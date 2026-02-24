package com.hospitalapp.backend.service;

import com.hospitalapp.backend.dto.doctor.DoctorResponse;
import com.hospitalapp.backend.dto.hospital.HospitalResponse;
import com.hospitalapp.backend.dto.hospital.NhsOrganisation;
import com.hospitalapp.backend.exception.ResourceNotFoundException;
import com.hospitalapp.backend.model.Hospital;
import com.hospitalapp.backend.repository.DoctorRepository;
import com.hospitalapp.backend.repository.HospitalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HospitalService {

    private static final Logger log = LoggerFactory.getLogger(HospitalService.class);
    private static final String NHS_ODS_BASE_URL = "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations";
    private static final String NHS_TRUSTS_ROLE_ID = "RO197";

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final RestTemplate restTemplate;

    public HospitalService(HospitalRepository hospitalRepository,
                           DoctorRepository doctorRepository,
                           RestTemplate restTemplate) {
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
        this.restTemplate = restTemplate;
    }

    @Transactional(readOnly = true)
    public List<HospitalResponse> getAllHospitals() {
        return hospitalRepository.findAllActive().stream()
                .map(this::toResponseWithCounts)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HospitalResponse getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "id", id));
        return toResponseWithCounts(hospital);
    }

    @Transactional(readOnly = true)
    public HospitalResponse getHospitalByOdsCode(String odsCode) {
        Hospital hospital = hospitalRepository.findByOdsCode(odsCode)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "odsCode", odsCode));
        return toResponseWithCounts(hospital);
    }

    @Transactional(readOnly = true)
    public List<HospitalResponse> searchHospitals(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllHospitals();
        }
        return hospitalRepository.searchHospitals(query.trim()).stream()
                .map(this::toResponseWithCounts)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> getDoctorsByHospital(Long hospitalId) {
        if (!hospitalRepository.existsById(hospitalId)) {
            throw new ResourceNotFoundException("Hospital", "id", hospitalId);
        }
        // Prototype: return all active doctors for any hospital
        return doctorRepository.findAllActiveDoctors().stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public int syncFromNhs() {
        log.info("Starting NHS ODS sync...");
        int synced = 0;

        try {
            List<NhsOrganisation> organisations = fetchNhsOrganisations();
            log.info("Fetched {} NHS organisations", organisations.size());

            for (NhsOrganisation org : organisations) {
                try {
                    Optional<Hospital> existing = hospitalRepository.findByOdsCode(org.getOrgId());
                    Hospital hospital = existing.orElseGet(Hospital::new);

                    hospital.setOdsCode(org.getOrgId());
                    hospital.setName(formatNhsName(org.getName()));
                    hospital.setPostcode(org.getPostCode());
                    hospital.setActive("Active".equalsIgnoreCase(org.getStatus()));
                    hospital.setLastSyncedAt(LocalDateTime.now());

                    // Fetch detailed info for address
                    fetchAndApplyDetails(hospital, org.getOrgId());

                    hospitalRepository.save(hospital);
                    synced++;
                } catch (Exception e) {
                    log.warn("Failed to sync organisation {}: {}", org.getOrgId(), e.getMessage());
                }
            }

            log.info("NHS ODS sync complete. Synced {} hospitals.", synced);
        } catch (Exception e) {
            log.error("NHS ODS sync failed: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to sync from NHS ODS API: " + e.getMessage());
        }

        return synced;
    }

    private List<NhsOrganisation> fetchNhsOrganisations() {
        String url = NHS_ODS_BASE_URL + "?PrimaryRoleId=" + NHS_TRUSTS_ROLE_ID
                + "&Status=Active&Limit=1000";

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );

        Map<String, Object> body = response.getBody();
        if (body == null || !body.containsKey("Organisations")) {
            return Collections.emptyList();
        }

        @SuppressWarnings("unchecked")
        List<Map<String, String>> orgList = (List<Map<String, String>>) body.get("Organisations");

        return orgList.stream().map(map -> {
            NhsOrganisation org = new NhsOrganisation();
            org.setOrgId(map.get("OrgId"));
            org.setName(map.get("Name"));
            org.setStatus(map.get("Status"));
            org.setPostCode(map.get("PostCode"));
            org.setOrgLink(map.get("OrgLink"));
            return org;
        }).collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private void fetchAndApplyDetails(Hospital hospital, String orgId) {
        try {
            String url = NHS_ODS_BASE_URL + "/" + orgId;

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> body = response.getBody();
            if (body == null || !body.containsKey("Organisation")) {
                return;
            }

            Map<String, Object> org = (Map<String, Object>) body.get("Organisation");
            if (org == null) return;

            // Extract address from GeoLoc
            Map<String, Object> geoLoc = (Map<String, Object>) org.get("GeoLoc");
            if (geoLoc != null) {
                Map<String, String> location = (Map<String, String>) geoLoc.get("Location");
                if (location != null) {
                    hospital.setAddress1(location.get("AddrLn1"));
                    hospital.setAddress2(location.get("AddrLn2"));
                    hospital.setCity(location.get("Town"));
                    hospital.setCounty(location.get("County"));
                    if (location.get("PostCode") != null) {
                        hospital.setPostcode(location.get("PostCode"));
                    }
                }
            }

            // Extract contacts
            List<Map<String, Object>> contacts = (List<Map<String, Object>>) org.get("Contacts");
            if (contacts != null) {
                for (Map<String, Object> contact : contacts) {
                    String type = (String) contact.get("type");
                    String value = (String) contact.get("value");
                    if ("tel".equalsIgnoreCase(type) && hospital.getPhone() == null) {
                        hospital.setPhone(value);
                    } else if ("http".equalsIgnoreCase(type) && hospital.getWebsite() == null) {
                        hospital.setWebsite(value);
                    }
                }
            }
        } catch (Exception e) {
            log.debug("Could not fetch details for {}: {}", orgId, e.getMessage());
        }
    }

    private String formatNhsName(String name) {
        if (name == null) return null;
        // Convert "ROYAL LONDON HOSPITAL" to "Royal London Hospital"
        String[] words = name.toLowerCase().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                if (sb.length() > 0) sb.append(' ');
                // Keep common abbreviations uppercase
                if (word.equals("nhs") || word.equals("nft") || word.equals("uk")) {
                    sb.append(word.toUpperCase());
                } else {
                    sb.append(Character.toUpperCase(word.charAt(0)));
                    sb.append(word.substring(1));
                }
            }
        }
        return sb.toString();
    }

    private HospitalResponse toResponseWithCounts(Hospital hospital) {
        HospitalResponse response = HospitalResponse.fromEntity(hospital);
        // Prototype: show total doctors/departments across platform for every hospital
        response.setDoctorCount(doctorRepository.countAllActiveDoctors());
        response.setDepartmentCount(doctorRepository.countAllActiveDepartments());
        return response;
    }
}
