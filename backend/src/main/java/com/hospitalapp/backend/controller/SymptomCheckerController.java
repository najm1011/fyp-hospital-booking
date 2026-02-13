package com.hospitalapp.backend.controller;

import com.hospitalapp.backend.dto.symptom.SymptomMatchRequest;
import com.hospitalapp.backend.service.SymptomCheckerService;
import com.hospitalapp.backend.service.SymptomCheckerService.SymptomMatchResult;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/symptoms")
public class SymptomCheckerController {

    private final SymptomCheckerService symptomCheckerService;

    public SymptomCheckerController(SymptomCheckerService symptomCheckerService) {
        this.symptomCheckerService = symptomCheckerService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllSymptoms() {
        Map<String, Object> response = new HashMap<>();
        response.put("symptomsByCategory", symptomCheckerService.getAllSymptoms());
        response.put("allSymptoms", symptomCheckerService.getAllSymptomNames());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/match")
    public ResponseEntity<Map<String, Object>> matchSymptoms(
            @Valid @RequestBody SymptomMatchRequest request) {
        SymptomMatchResult result = symptomCheckerService.matchSymptoms(request.getSymptoms());

        Map<String, Object> response = new HashMap<>();
        response.put("matchedDepartments", result.getMatchedDepartments());
        response.put("departmentScores", result.getDepartmentScores());
        response.put("recommendedDoctors", result.getRecommendedDoctors());
        return ResponseEntity.ok(response);
    }
}
