package com.hospitalapp.backend.service;

import com.hospitalapp.backend.dto.medical.MedicalRecordResponse;
import com.hospitalapp.backend.model.MedicalRecord;
import com.hospitalapp.backend.model.User;
import com.hospitalapp.backend.repository.MedicalRecordRepository;
import com.hospitalapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;
    private final Path uploadDir;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository,
                                 UserRepository userRepository,
                                 @Value("${app.upload.dir:uploads/}") String uploadPath) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.userRepository = userRepository;
        this.uploadDir = Paths.get(uploadPath).resolve("medical-records").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public MedicalRecordResponse uploadRecord(Long patientId, MultipartFile file, String description) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds 5MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new RuntimeException("Only PDF, JPEG, and PNG files are allowed");
        }

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID().toString() + extension;

        try {
            Path targetPath = this.uploadDir.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            MedicalRecord record = new MedicalRecord(
                    patient,
                    originalFileName != null ? originalFileName : storedFileName,
                    targetPath.toString(),
                    contentType,
                    file.getSize(),
                    description
            );

            MedicalRecord saved = medicalRecordRepository.save(record);
            return MedicalRecordResponse.fromEntity(saved);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Transactional(readOnly = true)
    public List<MedicalRecordResponse> getPatientRecords(Long patientId) {
        return medicalRecordRepository.findByPatientIdOrderByUploadedAtDesc(patientId)
                .stream()
                .map(MedicalRecordResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Resource downloadRecord(Long recordId, Long patientId) {
        MedicalRecord record = medicalRecordRepository.findByIdAndPatientId(recordId, patientId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        try {
            Path filePath = Paths.get(record.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found on disk");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("File not found", e);
        }
    }

    @Transactional(readOnly = true)
    public MedicalRecord getRecordEntity(Long recordId, Long patientId) {
        return medicalRecordRepository.findByIdAndPatientId(recordId, patientId)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    public void deleteRecord(Long recordId, Long patientId) {
        MedicalRecord record = medicalRecordRepository.findByIdAndPatientId(recordId, patientId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        try {
            Path filePath = Paths.get(record.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log but don't fail — DB record still gets deleted
        }

        medicalRecordRepository.delete(record);
    }
}
