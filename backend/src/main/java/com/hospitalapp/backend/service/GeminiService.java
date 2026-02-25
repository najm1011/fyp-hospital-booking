package com.hospitalapp.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

    private static final String EXTRACTION_PROMPT =
            "You are a medical document text extraction assistant. " +
            "Carefully examine this medical document and extract ALL readable text from it. " +
            "This could be a prescription, lab report, discharge summary, referral letter, or any medical record. " +
            "Instructions:\n" +
            "- Extract every piece of text you can read, including headers, labels, values, dates, names, and numbers.\n" +
            "- Preserve the original layout and structure as much as possible.\n" +
            "- If the document contains tables, format them clearly with labels and values.\n" +
            "- Include all medical terms, drug names, dosages, and test results exactly as written.\n" +
            "- If any text is partially illegible, include what you can read and mark unclear parts with [illegible].\n" +
            "- Do NOT add any interpretation, summary, or commentary — only extract the raw text.\n" +
            "- If the image contains no readable text at all, respond with exactly: NO_TEXT_FOUND";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-2.5-flash}")
    private String model;

    public GeminiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Extract text from an image file (JPEG, PNG) using Gemini Vision.
     */
    public String extractTextFromImage(Path imagePath, String mimeType) {
        if (!isConfigured()) {
            return null;
        }

        if (!Files.exists(imagePath)) {
            logger.error("Image file does not exist: {}", imagePath);
            return null;
        }

        try {
            byte[] fileBytes = Files.readAllBytes(imagePath);
            return callGeminiApi(fileBytes, mimeType);
        } catch (IOException e) {
            logger.error("Failed to read image file {}: {}", imagePath, e.getMessage());
            return null;
        }
    }

    /**
     * Extract text from a PDF file using Gemini.
     */
    public String extractTextFromPdf(Path pdfPath) {
        if (!isConfigured()) {
            return null;
        }

        if (!Files.exists(pdfPath)) {
            logger.error("PDF file does not exist: {}", pdfPath);
            return null;
        }

        try {
            byte[] fileBytes = Files.readAllBytes(pdfPath);
            return callGeminiApi(fileBytes, "application/pdf");
        } catch (IOException e) {
            logger.error("Failed to read PDF file {}: {}", pdfPath, e.getMessage());
            return null;
        }
    }

    /**
     * Core method that calls the Gemini API with proper error handling.
     */
    private String callGeminiApi(byte[] fileBytes, String mimeType) {
        String base64Data = Base64.getEncoder().encodeToString(fileBytes);
        String url = GEMINI_API_URL + model + ":generateContent?key=" + apiKey;

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of(
                        "inlineData", Map.of(
                            "mimeType", mimeType,
                            "data", base64Data
                        )
                    ),
                    Map.of("text", EXTRACTION_PROMPT)
                ))
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                logger.warn("Gemini API returned non-success status: {}", response.getStatusCode());
                return null;
            }

            return parseGeminiResponse(response.getBody());

        } catch (HttpClientErrorException e) {
            // 4xx errors — bad request, auth failure, quota exceeded
            logger.error("Gemini API client error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED || e.getStatusCode() == HttpStatus.FORBIDDEN) {
                logger.error("Gemini API key is invalid or expired. Please check your GEMINI_API_KEY.");
            } else if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                logger.warn("Gemini API rate limit exceeded. Text extraction skipped.");
            }
            return null;

        } catch (HttpServerErrorException e) {
            // 5xx errors — Gemini service issue
            logger.error("Gemini API server error ({}): {}", e.getStatusCode(), e.getMessage());
            return null;

        } catch (ResourceAccessException e) {
            // Network timeout or connection refused
            logger.error("Cannot reach Gemini API (network error): {}", e.getMessage());
            return null;

        } catch (Exception e) {
            // Any other unexpected error
            logger.error("Unexpected error calling Gemini API: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Parse the Gemini API JSON response and extract the text content.
     */
    private String parseGeminiResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);

            // Check for API-level errors in the response body
            JsonNode error = root.path("error");
            if (!error.isMissingNode()) {
                String errorMessage = error.path("message").asText("Unknown error");
                logger.error("Gemini API returned error: {}", errorMessage);
                return null;
            }

            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                logger.warn("Gemini response has no candidates");
                return null;
            }

            // Check if the response was blocked by safety filters
            JsonNode finishReason = candidates.get(0).path("finishReason");
            if (finishReason.isTextual() && "SAFETY".equals(finishReason.asText())) {
                logger.warn("Gemini blocked the response due to safety filters");
                return null;
            }

            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (!parts.isArray() || parts.isEmpty()) {
                logger.warn("Gemini response has no content parts");
                return null;
            }

            String extractedText = parts.get(0).path("text").asText("").trim();

            // Check if Gemini found no text
            if (extractedText.isEmpty() || "NO_TEXT_FOUND".equals(extractedText)) {
                logger.info("Gemini found no readable text in the document");
                return null;
            }

            logger.info("Successfully extracted {} characters of text via Gemini", extractedText.length());
            return extractedText;

        } catch (Exception e) {
            logger.error("Failed to parse Gemini API response: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Check if the Gemini service is properly configured.
     */
    private boolean isConfigured() {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("Gemini API key not configured — text extraction is disabled. Set GEMINI_API_KEY in .env");
            return false;
        }
        return true;
    }
}
