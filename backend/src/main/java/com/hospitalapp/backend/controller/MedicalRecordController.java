package com.hospitalapp.backend.controller;

import com.hospitalapp.backend.dto.medical.MedicalRecordResponse;
import com.hospitalapp.backend.model.MedicalRecord;
import com.hospitalapp.backend.security.CustomUserDetailsService.CustomUserDetails;
import com.hospitalapp.backend.service.MedicalRecordService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medical-records")
@PreAuthorize("hasRole('PATIENT')")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MedicalRecordResponse> uploadRecord(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {

        MedicalRecordResponse response = medicalRecordService.uploadRecord(
                userDetails.getUserId(), file, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecordResponse>> getMyRecords(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        List<MedicalRecordResponse> records = medicalRecordService.getPatientRecords(
                userDetails.getUserId());
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{recordId}/download")
    public ResponseEntity<Resource> downloadRecord(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recordId) {

        MedicalRecord record = medicalRecordService.getRecordEntity(recordId, userDetails.getUserId());
        Resource resource = medicalRecordService.downloadRecord(recordId, userDetails.getUserId());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(record.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + record.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteRecord(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long recordId) {

        medicalRecordService.deleteRecord(recordId, userDetails.getUserId());
        return ResponseEntity.noContent().build();
    }
}
