package com.hospitalapp.backend.service;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private static final String TEMPLATE_PATH = "templates/email/";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a");

    private final JavaMailSender mailSender;

    // Template cache
    private final Map<String, String> templateCache = new HashMap<>();

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.from-name}")
    private String fromName;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${spring.mail.username:NOT_SET}")
    private String smtpUsername;

    @Value("${spring.mail.host:NOT_SET}")
    private String smtpHost;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostConstruct
    public void init() {
        logger.info("EMAIL CONFIG => host={}, username={}, enabled={}", smtpHost, smtpUsername, emailEnabled);
        loadTemplates();
    }

    /**
     * Load all email templates into cache on startup
     */
    private void loadTemplates() {
        String[] templateNames = {
            "appointment-confirmation",
            "appointment-cancellation",
            "appointment-reminder",
            "appointment-rescheduled",
            "welcome",
            "password-reset"
        };

        for (String templateName : templateNames) {
            try {
                ClassPathResource resource = new ClassPathResource(TEMPLATE_PATH + templateName + ".html");
                String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
                templateCache.put(templateName, content);
                logger.info("Loaded email template: {}", templateName);
            } catch (IOException e) {
                logger.warn("Could not load email template: {}. Using fallback.", templateName);
            }
        }
    }

    /**
     * Get template from cache or return null if not found
     */
    private String getTemplate(String templateName) {
        return templateCache.get(templateName);
    }

    /**
     * Process template by replacing placeholders with actual values
     */
    private String processTemplate(String template, Map<String, String> variables) {
        if (template == null) {
            return null;
        }

        String processed = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            processed = processed.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return processed;
    }

    /**
     * Send a simple text email
     */
    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        if (!emailEnabled) {
            logger.info("Email disabled. Would have sent to: {}, subject: {}", to, subject);
            logger.debug("Email content: {}", text);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromName + " <" + fromEmail + ">");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            logger.info("Simple email sent successfully to: {}", to);
        } catch (MailException e) {
            logger.error("Failed to send simple email to: {}. Error: {}", to, e.getMessage());
        }
    }

    /**
     * Send an HTML email
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (!emailEnabled) {
            logger.info("Email disabled. Would have sent HTML email to: {}, subject: {}", to, subject);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("HTML email sent successfully to: {}", to);
        } catch (MessagingException | MailException e) {
            logger.error("Failed to send HTML email to: {}. Error: {}", to, e.getMessage());
        } catch (java.io.UnsupportedEncodingException e) {
            logger.error("Encoding error when sending email to: {}. Error: {}", to, e.getMessage());
        }
    }

    /**
     * Send appointment confirmation email
     */
    @Async
    public void sendAppointmentConfirmation(String patientEmail, String patientName, String doctorName,
                                            String department, LocalDate appointmentDate, LocalTime startTime,
                                            String confirmationNumber) {
        String subject = "Appointment Confirmation - " + confirmationNumber;

        Map<String, String> variables = new HashMap<>();
        variables.put("patientName", patientName);
        variables.put("doctorName", doctorName);
        variables.put("department", department);
        variables.put("appointmentDate", appointmentDate.format(DATE_FORMATTER));
        variables.put("appointmentTime", startTime.format(TIME_FORMATTER));
        variables.put("confirmationNumber", confirmationNumber);

        String template = getTemplate("appointment-confirmation");
        String htmlContent = template != null
            ? processTemplate(template, variables)
            : buildFallbackConfirmationEmail(variables);

        sendHtmlEmail(patientEmail, subject, htmlContent);
    }

    /**
     * Send appointment cancellation email
     */
    @Async
    public void sendAppointmentCancellation(String patientEmail, String patientName, String doctorName,
                                            LocalDate appointmentDate, LocalTime startTime, String reason) {
        String subject = "Appointment Cancelled";

        Map<String, String> variables = new HashMap<>();
        variables.put("patientName", patientName);
        variables.put("doctorName", doctorName);
        variables.put("appointmentDate", appointmentDate.format(DATE_FORMATTER));
        variables.put("appointmentTime", startTime.format(TIME_FORMATTER));
        variables.put("cancellationReason", reason);

        String template = getTemplate("appointment-cancellation");
        String htmlContent = template != null
            ? processTemplate(template, variables)
            : buildFallbackCancellationEmail(variables);

        sendHtmlEmail(patientEmail, subject, htmlContent);
    }

    /**
     * Send appointment reminder email
     */
    @Async
    public void sendAppointmentReminder(String patientEmail, String patientName, String doctorName,
                                        String department, LocalDate appointmentDate, LocalTime startTime) {
        String subject = "Appointment Reminder - Tomorrow";

        Map<String, String> variables = new HashMap<>();
        variables.put("patientName", patientName);
        variables.put("doctorName", doctorName);
        variables.put("department", department);
        variables.put("appointmentDate", appointmentDate.format(DATE_FORMATTER));
        variables.put("appointmentTime", startTime.format(TIME_FORMATTER));

        String template = getTemplate("appointment-reminder");
        String htmlContent = template != null
            ? processTemplate(template, variables)
            : buildFallbackReminderEmail(variables);

        sendHtmlEmail(patientEmail, subject, htmlContent);
    }

    /**
     * Send appointment rescheduled email
     */
    @Async
    public void sendAppointmentRescheduled(String patientEmail, String patientName, String doctorName,
                                           LocalDate oldDate, LocalTime oldTime,
                                           LocalDate newDate, LocalTime newTime) {
        String subject = "Appointment Rescheduled";

        Map<String, String> variables = new HashMap<>();
        variables.put("patientName", patientName);
        variables.put("doctorName", doctorName);
        variables.put("oldDate", oldDate.format(DATE_FORMATTER));
        variables.put("oldTime", oldTime.format(TIME_FORMATTER));
        variables.put("newDate", newDate.format(DATE_FORMATTER));
        variables.put("newTime", newTime.format(TIME_FORMATTER));

        String template = getTemplate("appointment-rescheduled");
        String htmlContent = template != null
            ? processTemplate(template, variables)
            : buildFallbackRescheduledEmail(variables);

        sendHtmlEmail(patientEmail, subject, htmlContent);
    }

    /**
     * Send welcome email to new users
     */
    @Async
    public void sendWelcomeEmail(String email, String firstName) {
        String subject = "Welcome to Hospital Booking System";

        Map<String, String> variables = new HashMap<>();
        variables.put("firstName", firstName);

        String template = getTemplate("welcome");
        String htmlContent = template != null
            ? processTemplate(template, variables)
            : buildFallbackWelcomeEmail(variables);

        sendHtmlEmail(email, subject, htmlContent);
    }

    /**
     * Send password reset email
     */
    @Async
    public void sendPasswordResetEmail(String email, String firstName, String resetLink) {
        String subject = "Reset Your Password - Hospital Booking System";

        Map<String, String> variables = new HashMap<>();
        variables.put("firstName", firstName);
        variables.put("resetLink", resetLink);

        String template = getTemplate("password-reset");
        String htmlContent = template != null
            ? processTemplate(template, variables)
            : buildFallbackPasswordResetEmail(variables);

        sendHtmlEmail(email, subject, htmlContent);
    }

    // --- FALLBACK TEMPLATES ---

    private String buildFallbackConfirmationEmail(Map<String, String> vars) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #14b8a6;">Appointment Confirmed</h2>
                <p>Dear %s,</p>
                <p>Your appointment has been successfully booked.</p>
                <p><strong>Confirmation Number:</strong> %s</p>
                <p><strong>Doctor:</strong> Dr. %s</p>
                <p><strong>Department:</strong> %s</p>
                <p><strong>Date:</strong> %s</p>
                <p><strong>Time:</strong> %s</p>
                <p>Please arrive 15 minutes early.</p>
                <p>Hospital Booking System</p>
            </body>
            </html>
            """.formatted(
                vars.get("patientName"),
                vars.get("confirmationNumber"),
                vars.get("doctorName"),
                vars.get("department"),
                vars.get("appointmentDate"),
                vars.get("appointmentTime")
            );
    }

    private String buildFallbackCancellationEmail(Map<String, String> vars) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #ef4444;">Appointment Cancelled</h2>
                <p>Dear %s,</p>
                <p>Your appointment has been cancelled.</p>
                <p><strong>Doctor:</strong> Dr. %s</p>
                <p><strong>Date:</strong> %s</p>
                <p><strong>Time:</strong> %s</p>
                <p><strong>Reason:</strong> %s</p>
                <p>Hospital Booking System</p>
            </body>
            </html>
            """.formatted(
                vars.get("patientName"),
                vars.get("doctorName"),
                vars.get("appointmentDate"),
                vars.get("appointmentTime"),
                vars.get("cancellationReason")
            );
    }

    private String buildFallbackReminderEmail(Map<String, String> vars) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #f59e0b;">Appointment Reminder</h2>
                <p>Dear %s,</p>
                <p>This is a reminder for your appointment tomorrow.</p>
                <p><strong>Doctor:</strong> Dr. %s</p>
                <p><strong>Department:</strong> %s</p>
                <p><strong>Date:</strong> %s</p>
                <p><strong>Time:</strong> %s</p>
                <p>Please arrive 15 minutes early.</p>
                <p>Hospital Booking System</p>
            </body>
            </html>
            """.formatted(
                vars.get("patientName"),
                vars.get("doctorName"),
                vars.get("department"),
                vars.get("appointmentDate"),
                vars.get("appointmentTime")
            );
    }

    private String buildFallbackRescheduledEmail(Map<String, String> vars) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #8b5cf6;">Appointment Rescheduled</h2>
                <p>Dear %s,</p>
                <p>Your appointment with Dr. %s has been rescheduled.</p>
                <p><strong>Previous:</strong> %s at %s</p>
                <p><strong>New:</strong> %s at %s</p>
                <p>Please arrive 15 minutes early.</p>
                <p>Hospital Booking System</p>
            </body>
            </html>
            """.formatted(
                vars.get("patientName"),
                vars.get("doctorName"),
                vars.get("oldDate"),
                vars.get("oldTime"),
                vars.get("newDate"),
                vars.get("newTime")
            );
    }

    private String buildFallbackPasswordResetEmail(Map<String, String> vars) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #14b8a6;">Reset Your Password</h2>
                <p>Dear %s,</p>
                <p>We received a request to reset your password. Click the link below to set a new password:</p>
                <p><a href="%s" style="display: inline-block; background: #14b8a6; color: #ffffff; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset My Password</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p>Hospital Booking System</p>
            </body>
            </html>
            """.formatted(vars.get("firstName"), vars.get("resetLink"));
    }

    private String buildFallbackWelcomeEmail(Map<String, String> vars) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #14b8a6;">Welcome to Hospital Booking!</h2>
                <p>Dear %s,</p>
                <p>Thank you for creating an account with Hospital Booking System.</p>
                <p>You can now:</p>
                <ul>
                    <li>Book appointments with qualified doctors</li>
                    <li>View and manage your appointments</li>
                    <li>Reschedule or cancel appointments</li>
                    <li>Access your appointment history</li>
                </ul>
                <p>Stay healthy!</p>
                <p>Hospital Booking System</p>
            </body>
            </html>
            """.formatted(vars.get("firstName"));
    }
}
