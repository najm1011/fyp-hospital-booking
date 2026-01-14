package com.hospitalapp.backend.controller;

import com.hospitalapp.backend.dto.appointment.*;
import com.hospitalapp.backend.exception.AppointmentException;
import com.hospitalapp.backend.model.Doctor;
import com.hospitalapp.backend.model.User;
import com.hospitalapp.backend.repository.DoctorRepository;
import com.hospitalapp.backend.security.CustomUserDetailsService.CustomUserDetails;
import com.hospitalapp.backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final DoctorRepository doctorRepository;

    public AppointmentController(AppointmentService appointmentService, DoctorRepository doctorRepository) {
        this.appointmentService = appointmentService;
        this.doctorRepository = doctorRepository;
    }

    // ==================== PATIENT ENDPOINTS ====================

    /**
     * Book a new appointment (Patient only)
     */
    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateAppointmentRequest request) {

        AppointmentResponse response = appointmentService.bookAppointment(
                userDetails.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all appointments for the current patient
     */
    @GetMapping("/my-appointments")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        List<AppointmentResponse> appointments = appointmentService.getPatientAppointments(
                userDetails.getUserId());
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get upcoming appointments for the current patient
     */
    @GetMapping("/my-appointments/upcoming")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<AppointmentResponse>> getMyUpcomingAppointments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        List<AppointmentResponse> appointments = appointmentService.getPatientUpcomingAppointments(
                userDetails.getUserId());
        return ResponseEntity.ok(appointments);
    }

    /**
     * Cancel an appointment (Patient)
     */
    @PostMapping("/{appointmentId}/cancel")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponse> cancelMyAppointment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long appointmentId,
            @Valid @RequestBody CancelAppointmentRequest request) {

        AppointmentResponse response = appointmentService.cancelAppointmentByPatient(
                userDetails.getUserId(), appointmentId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Reschedule an appointment (Patient)
     */
    @PutMapping("/{appointmentId}/reschedule")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponse> rescheduleMyAppointment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long appointmentId,
            @Valid @RequestBody RescheduleAppointmentRequest request) {

        AppointmentResponse response = appointmentService.rescheduleAppointmentByPatient(
                userDetails.getUserId(), appointmentId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get patient's appointment statistics
     */
    @GetMapping("/my-appointments/stats")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentStatsResponse> getMyStats(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        AppointmentStatsResponse stats = appointmentService.getPatientStats(
                userDetails.getUserId());
        return ResponseEntity.ok(stats);
    }

    // ==================== DOCTOR ENDPOINTS ====================

    /**
     * Get all appointments for the current doctor
     */
    @GetMapping("/doctor/appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponse>> getDoctorAppointments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long doctorId = getDoctorIdFromUser(userDetails.getUserId());
        List<AppointmentResponse> appointments = appointmentService.getDoctorAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get today's appointments for the current doctor
     */
    @GetMapping("/doctor/appointments/today")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponse>> getDoctorTodayAppointments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long doctorId = getDoctorIdFromUser(userDetails.getUserId());
        List<AppointmentResponse> appointments = appointmentService.getDoctorTodayAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get upcoming appointments for the current doctor
     */
    @GetMapping("/doctor/appointments/upcoming")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponse>> getDoctorUpcomingAppointments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long doctorId = getDoctorIdFromUser(userDetails.getUserId());
        List<AppointmentResponse> appointments = appointmentService.getDoctorUpcomingAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get doctor's appointments for a specific date range
     */
    @GetMapping("/doctor/appointments/range")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponse>> getDoctorAppointmentsByDateRange(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Long doctorId = getDoctorIdFromUser(userDetails.getUserId());
        List<AppointmentResponse> appointments = appointmentService.getDoctorAppointmentsByDateRange(
                doctorId, startDate, endDate);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Mark appointment as completed (Doctor)
     */
    @PutMapping("/doctor/{appointmentId}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponse> completeAppointment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long appointmentId,
            @RequestBody(required = false) UpdateAppointmentNotesRequest request) {

        Long doctorId = getDoctorIdFromUser(userDetails.getUserId());
        AppointmentResponse response = appointmentService.completeAppointment(doctorId, appointmentId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Mark appointment as no-show (Doctor)
     */
    @PutMapping("/doctor/{appointmentId}/no-show")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponse> markNoShow(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long appointmentId) {

        Long doctorId = getDoctorIdFromUser(userDetails.getUserId());
        AppointmentResponse response = appointmentService.markNoShow(doctorId, appointmentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Update doctor notes for an appointment (Doctor)
     */
    @PutMapping("/doctor/{appointmentId}/notes")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponse> updateDoctorNotes(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long appointmentId,
            @Valid @RequestBody UpdateAppointmentNotesRequest request) {

        Long doctorId = getDoctorIdFromUser(userDetails.getUserId());
        AppointmentResponse response = appointmentService.updateDoctorNotes(doctorId, appointmentId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel an appointment (Doctor)
     */
    @PostMapping("/doctor/{appointmentId}/cancel")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponse> cancelAppointmentByDoctor(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long appointmentId,
            @Valid @RequestBody CancelAppointmentRequest request) {

        Long doctorId = getDoctorIdFromUser(userDetails.getUserId());
        AppointmentResponse response = appointmentService.cancelAppointmentByDoctor(doctorId, appointmentId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get doctor's appointment statistics
     */
    @GetMapping("/doctor/stats")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentStatsResponse> getDoctorStats(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long doctorId = getDoctorIdFromUser(userDetails.getUserId());
        AppointmentStatsResponse stats = appointmentService.getDoctorStats(doctorId);
        return ResponseEntity.ok(stats);
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Get all appointments (Admin only)
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get all upcoming appointments (Admin only)
     */
    @GetMapping("/admin/upcoming")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getAllUpcomingAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAllUpcomingAppointments();
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointments by date range (Admin only)
     */
    @GetMapping("/admin/range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDateRange(startDate, endDate);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Cancel any appointment (Admin only)
     */
    @PostMapping("/admin/{appointmentId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentResponse> cancelAppointmentByAdmin(
            @PathVariable Long appointmentId,
            @Valid @RequestBody CancelAppointmentRequest request) {

        AppointmentResponse response = appointmentService.cancelAppointmentByAdmin(appointmentId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get overall appointment statistics (Admin only)
     */
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentStatsResponse> getOverallStats() {
        AppointmentStatsResponse stats = appointmentService.getOverallStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get all appointments for a specific patient (Admin only)
     */
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getPatientAppointmentsById(
            @PathVariable Long patientId) {

        List<AppointmentResponse> appointments = appointmentService.getPatientAppointments(patientId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get upcoming appointments for a specific patient (Admin only)
     */
    @GetMapping("/patient/{patientId}/upcoming")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getPatientUpcomingAppointmentsById(
            @PathVariable Long patientId) {

        List<AppointmentResponse> appointments = appointmentService.getPatientUpcomingAppointments(patientId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointment statistics for a specific patient (Admin only)
     */
    @GetMapping("/patient/{patientId}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentStatsResponse> getPatientStatsById(
            @PathVariable Long patientId) {

        AppointmentStatsResponse stats = appointmentService.getPatientStats(patientId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get all appointments for a specific doctor by doctor ID (Admin only)
     */
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getDoctorAppointmentsById(
            @PathVariable Long doctorId) {

        List<AppointmentResponse> appointments = appointmentService.getDoctorAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get upcoming appointments for a specific doctor (Admin only)
     */
    @GetMapping("/doctor/{doctorId}/upcoming")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getDoctorUpcomingAppointmentsById(
            @PathVariable Long doctorId) {

        List<AppointmentResponse> appointments = appointmentService.getDoctorUpcomingAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get today's appointments for a specific doctor (Admin only)
     */
    @GetMapping("/doctor/{doctorId}/today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getDoctorTodayAppointmentsById(
            @PathVariable Long doctorId) {

        List<AppointmentResponse> appointments = appointmentService.getDoctorTodayAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointment statistics for a specific doctor (Admin only)
     */
    @GetMapping("/doctor/{doctorId}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentStatsResponse> getDoctorStatsById(
            @PathVariable Long doctorId) {

        AppointmentStatsResponse stats = appointmentService.getDoctorStats(doctorId);
        return ResponseEntity.ok(stats);
    }

    // ==================== PUBLIC/SHARED ENDPOINTS ====================

    /**
     * Get available slots for a doctor on a specific date (Public)
     */
    @GetMapping("/available-slots")
    public ResponseEntity<List<AvailableSlotResponse>> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<AvailableSlotResponse> slots = appointmentService.getAvailableSlots(doctorId, date);
        return ResponseEntity.ok(slots);
    }

    /**
     * Get a single appointment by ID
     */
    @GetMapping("/{appointmentId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> getAppointmentById(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long appointmentId) {

        AppointmentResponse appointment = appointmentService.getAppointmentResponseById(appointmentId);

        // Verify access based on role
        User.Role role = userDetails.getRole();
        Long userId = userDetails.getUserId();

        if (role == User.Role.PATIENT && !appointment.getPatientId().equals(userId)) {
            throw new AppointmentException("You are not authorized to view this appointment",
                    AppointmentException.UNAUTHORIZED);
        }

        if (role == User.Role.DOCTOR) {
            Long doctorId = getDoctorIdFromUser(userId);
            if (!appointment.getDoctorId().equals(doctorId)) {
                throw new AppointmentException("You are not authorized to view this appointment",
                        AppointmentException.UNAUTHORIZED);
            }
        }

        // Admin can view any appointment
        return ResponseEntity.ok(appointment);
    }

    // ==================== HELPER METHODS ====================

    private Long getDoctorIdFromUser(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new AppointmentException(
                        "Doctor profile not found for this user",
                        AppointmentException.UNAUTHORIZED));
        return doctor.getId();
    }
}
