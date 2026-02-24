package com.hospitalapp.backend.controller;

import com.hospitalapp.backend.dto.doctor.DoctorResponse;
import com.hospitalapp.backend.dto.hospital.HospitalResponse;
import com.hospitalapp.backend.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<List<HospitalResponse>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalResponse> getHospitalById(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<HospitalResponse>> searchHospitals(@RequestParam("q") String query) {
        return ResponseEntity.ok(hospitalService.searchHospitals(query));
    }

    @GetMapping("/{id}/doctors")
    public ResponseEntity<List<DoctorResponse>> getDoctorsByHospital(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getDoctorsByHospital(id));
    }

    @PostMapping("/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> syncFromNhs() {
        int count = hospitalService.syncFromNhs();
        return ResponseEntity.ok(Map.of(
                "message", "NHS sync completed successfully",
                "hospitalsSynced", count
        ));
    }
}
