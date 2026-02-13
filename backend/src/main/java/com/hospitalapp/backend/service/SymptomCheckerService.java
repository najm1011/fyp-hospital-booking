package com.hospitalapp.backend.service;

import com.hospitalapp.backend.dto.doctor.DoctorResponse;
import com.hospitalapp.backend.model.Doctor;
import com.hospitalapp.backend.repository.DepartmentRepository;
import com.hospitalapp.backend.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SymptomCheckerService {

    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;

    // Key: symptom display name, Value: set of department names (first = primary)
    private static final Map<String, Set<String>> SYMPTOM_DEPARTMENT_MAP = new LinkedHashMap<>();

    static {
        // Cardiology symptoms
        addSymptom("Chest pain", "Cardiology", "General Practice");
        addSymptom("Heart palpitations", "Cardiology");
        addSymptom("Shortness of breath", "Cardiology", "General Practice");
        addSymptom("High blood pressure", "Cardiology", "General Practice");
        addSymptom("Dizziness", "Cardiology", "General Practice");
        addSymptom("Swollen ankles", "Cardiology", "General Practice");
        addSymptom("Irregular heartbeat", "Cardiology");

        // Dermatology symptoms
        addSymptom("Skin rash", "Dermatology");
        addSymptom("Acne", "Dermatology");
        addSymptom("Eczema", "Dermatology");
        addSymptom("Psoriasis", "Dermatology");
        addSymptom("Hair loss", "Dermatology");
        addSymptom("Skin discoloration", "Dermatology");
        addSymptom("Mole changes", "Dermatology");
        addSymptom("Itchy skin", "Dermatology", "General Practice");
        addSymptom("Hives", "Dermatology", "General Practice");

        // General Practice symptoms
        addSymptom("Fever", "General Practice", "Pediatrics");
        addSymptom("Headache", "General Practice");
        addSymptom("Fatigue", "General Practice");
        addSymptom("Cough", "General Practice", "Pediatrics");
        addSymptom("Sore throat", "General Practice", "Pediatrics");
        addSymptom("Cold and flu", "General Practice", "Pediatrics");
        addSymptom("Nausea", "General Practice");
        addSymptom("Stomach pain", "General Practice", "Pediatrics");
        addSymptom("Weight loss", "General Practice");
        addSymptom("Allergies", "General Practice", "Dermatology");
        addSymptom("Insomnia", "General Practice");

        // Orthopedics symptoms
        addSymptom("Back pain", "Orthopedics", "General Practice");
        addSymptom("Joint pain", "Orthopedics", "General Practice");
        addSymptom("Knee pain", "Orthopedics");
        addSymptom("Shoulder pain", "Orthopedics");
        addSymptom("Sports injury", "Orthopedics");
        addSymptom("Fracture", "Orthopedics");
        addSymptom("Muscle pain", "Orthopedics", "General Practice");
        addSymptom("Neck pain", "Orthopedics", "General Practice");
        addSymptom("Hip pain", "Orthopedics");
        addSymptom("Arthritis", "Orthopedics", "General Practice");
        addSymptom("Swollen joints", "Orthopedics");

        // Pediatrics symptoms
        addSymptom("Child fever", "Pediatrics");
        addSymptom("Child rash", "Pediatrics", "Dermatology");
        addSymptom("Growth concerns", "Pediatrics");
        addSymptom("Childhood vaccination", "Pediatrics");
        addSymptom("Ear infection", "Pediatrics", "General Practice");
        addSymptom("Behavioral concerns", "Pediatrics");
    }

    private static void addSymptom(String symptom, String... departments) {
        SYMPTOM_DEPARTMENT_MAP.put(symptom, new LinkedHashSet<>(Arrays.asList(departments)));
    }

    public SymptomCheckerService(DepartmentRepository departmentRepository,
                                  DoctorRepository doctorRepository) {
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
    }

    /**
     * Get all available symptoms grouped by primary department.
     */
    public Map<String, List<String>> getAllSymptoms() {
        Map<String, List<String>> grouped = new LinkedHashMap<>();
        for (Map.Entry<String, Set<String>> entry : SYMPTOM_DEPARTMENT_MAP.entrySet()) {
            String primaryDept = entry.getValue().iterator().next();
            grouped.computeIfAbsent(primaryDept, k -> new ArrayList<>()).add(entry.getKey());
        }
        return grouped;
    }

    /**
     * Get flat list of all symptom names.
     */
    public List<String> getAllSymptomNames() {
        return new ArrayList<>(SYMPTOM_DEPARTMENT_MAP.keySet());
    }

    /**
     * Match selected symptoms to departments and return recommended doctors.
     */
    public SymptomMatchResult matchSymptoms(List<String> symptoms) {
        Map<String, Integer> departmentScores = new LinkedHashMap<>();

        for (String symptom : symptoms) {
            Set<String> departments = SYMPTOM_DEPARTMENT_MAP.get(symptom);
            if (departments != null) {
                for (String dept : departments) {
                    departmentScores.merge(dept, 1, Integer::sum);
                }
            }
        }

        List<String> rankedDepartments = departmentScores.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        List<Long> matchedDepartmentIds = new ArrayList<>();
        for (String deptName : rankedDepartments) {
            departmentRepository.findByName(deptName)
                    .ifPresent(dept -> matchedDepartmentIds.add(dept.getId()));
        }

        List<DoctorResponse> recommendedDoctors = new ArrayList<>();
        Set<Long> seenIds = new HashSet<>();
        for (Long deptId : matchedDepartmentIds) {
            List<Doctor> doctors = doctorRepository.findActiveDoctorsByDepartmentId(deptId);
            for (Doctor doctor : doctors) {
                if (seenIds.add(doctor.getId())) {
                    recommendedDoctors.add(DoctorResponse.fromEntity(doctor));
                }
            }
        }

        return new SymptomMatchResult(rankedDepartments, departmentScores, recommendedDoctors);
    }

    public static class SymptomMatchResult {
        private final List<String> matchedDepartments;
        private final Map<String, Integer> departmentScores;
        private final List<DoctorResponse> recommendedDoctors;

        public SymptomMatchResult(List<String> matchedDepartments,
                                   Map<String, Integer> departmentScores,
                                   List<DoctorResponse> recommendedDoctors) {
            this.matchedDepartments = matchedDepartments;
            this.departmentScores = departmentScores;
            this.recommendedDoctors = recommendedDoctors;
        }

        public List<String> getMatchedDepartments() {
            return matchedDepartments;
        }

        public Map<String, Integer> getDepartmentScores() {
            return departmentScores;
        }

        public List<DoctorResponse> getRecommendedDoctors() {
            return recommendedDoctors;
        }
    }
}
