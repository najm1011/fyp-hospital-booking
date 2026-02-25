package com.hospitalapp.backend.service;

import com.hospitalapp.backend.dto.medical.MedicalRecordResponse;
import com.hospitalapp.backend.model.MedicalRecord;
import com.hospitalapp.backend.model.User;
import com.hospitalapp.backend.repository.MedicalRecordRepository;
import com.hospitalapp.backend.repository.UserRepository;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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

    private static final Logger logger = LoggerFactory.getLogger(MedicalRecordService.class);

    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;
    private final Path uploadDir;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg"
    );

    private static final Set<String> IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/jpg"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository,
                                 UserRepository userRepository,
                                 GeminiService geminiService,
                                 @Value("${app.upload.dir:uploads/}") String uploadPath) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
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

            // ── 3-Layer Text Extraction ──
            // Layer 1: PDFs     → Apache PDFBox (local, instant, no API)
            // Layer 2: Images   → Gemini AI (cloud, primary OCR)
            // Layer 3: Fallback → Tesseract OCR (local, when Gemini fails)
            try {
                String extractedText = null;

                if ("application/pdf".equals(contentType)) {
                    // LAYER 1: PDFBox — extract embedded text from PDFs locally
                    logger.info("Extracting text from PDF using PDFBox: {}", originalFileName);
                    extractedText = extractTextWithPdfBox(targetPath);

                    // If PDFBox returns nothing (scanned PDF), fall back to Gemini
                    if (extractedText == null || extractedText.isBlank()) {
                        logger.info("PDFBox found no embedded text (likely scanned PDF), trying Gemini AI: {}", originalFileName);
                        extractedText = geminiService.extractTextFromPdf(targetPath);
                    }
                } else if (IMAGE_TYPES.contains(contentType)) {
                    // LAYER 2: Gemini AI — primary OCR for images
                    logger.info("Extracting text from image using Gemini AI: {}", originalFileName);
                    extractedText = geminiService.extractTextFromImage(targetPath, contentType);

                    // LAYER 3: Tesseract fallback — if Gemini fails (quota, network, etc.)
                    if (extractedText == null || extractedText.isBlank()) {
                        logger.info("Gemini AI unavailable, falling back to Tesseract OCR: {}", originalFileName);
                        extractedText = extractTextWithTesseract(targetPath);
                    }
                }

                if (extractedText != null && !extractedText.isBlank()) {
                    record.setExtractedText(extractedText);
                    logger.info("Text extraction successful for: {} ({} chars)", originalFileName, extractedText.length());
                } else {
                    logger.info("No text extracted for: {}", originalFileName);
                }
            } catch (Exception e) {
                logger.warn("Text extraction failed for {} — upload continues without extracted text: {}", originalFileName, e.getMessage());
            }

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

    /**
     * Extract embedded text from a PDF using Apache PDFBox (local, no API).
     */
    private String extractTextWithPdfBox(Path pdfPath) {
        try (PDDocument document = Loader.loadPDF(pdfPath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document).trim();
            if (text.isEmpty()) {
                return null;
            }
            logger.info("PDFBox extracted {} characters from PDF", text.length());
            return text;
        } catch (IOException e) {
            logger.warn("PDFBox extraction failed: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Extract text from an image using Tesseract OCR (local fallback).
     */
    private String extractTextWithTesseract(Path imagePath) {
        try {
            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("/opt/homebrew/share/tessdata");
            tesseract.setLanguage("eng");

            String text = tesseract.doOCR(imagePath.toFile()).trim();
            if (text.isEmpty()) {
                return null;
            }
            logger.info("Tesseract OCR extracted {} characters from image", text.length());
            return text;
        } catch (TesseractException e) {
            logger.warn("Tesseract OCR failed: {}", e.getMessage());
            return null;
        }
    }
}
