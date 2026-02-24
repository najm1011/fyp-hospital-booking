package com.hospitalapp.backend.dto.medical;

import com.hospitalapp.backend.model.MedicalRecord;

import java.time.LocalDateTime;

public class MedicalRecordResponse {

    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String description;
    private LocalDateTime uploadedAt;

    public MedicalRecordResponse() {
    }

    public static MedicalRecordResponse fromEntity(MedicalRecord record) {
        MedicalRecordResponse response = new MedicalRecordResponse();
        response.setId(record.getId());
        response.setFileName(record.getFileName());
        response.setFileType(record.getFileType());
        response.setFileSize(record.getFileSize());
        response.setDescription(record.getDescription());
        response.setUploadedAt(record.getUploadedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
