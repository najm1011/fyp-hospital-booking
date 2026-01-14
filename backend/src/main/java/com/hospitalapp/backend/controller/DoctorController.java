package com.hospitalapp.backend.controller;

import com.hospitalapp.backend.dto.appointment.AvailableSlotResponse;
import com.hospitalapp.backend.dto.doctor.DoctorAvailabilityResponse;
import com.hospitalapp.backend.dto.doctor.DoctorResponse;
import com.hospitalapp.backend.service.AppointmentService;
import com.hospitalapp.backend.service.DoctorService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    public DoctorController(DoctorService doctorService, AppointmentService appointmentService) {
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
    }

    /**
     * Get all active doctors (Public)
     */
    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        List<DoctorResponse> doctors = doctorService.getAllActiveDoctors();
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get all doctors including inactive (Admin only)
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DoctorResponse>> getAllDoctorsAdmin() {
        List<DoctorResponse> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get doctor by ID (Public)
     */
    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorResponse> getDoctorById(@PathVariable Long doctorId) {
        DoctorResponse doctor = doctorService.getDoctorById(doctorId);
        return ResponseEntity.ok(doctor);
    }

    /**
     * Get doctors by department (Public)
     */
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<DoctorResponse>> getDoctorsByDepartment(@PathVariable Long departmentId) {
        List<DoctorResponse> doctors = doctorService.getDoctorsByDepartment(departmentId);
        return ResponseEntity.ok(doctors);
    }

    /**
     * Get doctors by specialty (Public)
     */
    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<List<DoctorResponse>> getDoctorsBySpecialty(@PathVariable String specialty) {
        List<DoctorResponse> doctors = doctorService.getDoctorsBySpecialty(specialty);
        return ResponseEntity.ok(doctors);
    }

    /**
     * Search doctors by name or specialty (Public)
     */
    @GetMapping("/search")
    public ResponseEntity<List<DoctorResponse>> searchDoctors(@RequestParam String q) {
        List<DoctorResponse> doctors = doctorService.searchDoctors(q);
        return ResponseEntity.ok(doctors);
    }

    /**
     * Search doctors within a department (Public)
     */
    @GetMapping("/department/{departmentId}/search")
    public ResponseEntity<List<DoctorResponse>> searchDoctorsByDepartment(
            @PathVariable Long departmentId,
            @RequestParam String q) {
        List<DoctorResponse> doctors = doctorService.searchDoctorsByDepartment(departmentId, q);
        return ResponseEntity.ok(doctors);
    }

    // ==================== AVAILABILITY ENDPOINTS ====================

    /**
     * Get doctor's full availability information (Public)
     */
    @GetMapping("/{doctorId}/availability")
    public ResponseEntity<DoctorAvailabilityResponse> getDoctorAvailability(@PathVariable Long doctorId) {
        DoctorAvailabilityResponse availability = doctorService.getDoctorAvailability(doctorId);
        return ResponseEntity.ok(availability);
    }

    /**
     * Check if doctor is available on a specific date (Public)
     */
    @GetMapping("/{doctorId}/availability/check")
    public ResponseEntity<Map<String, Object>> checkDoctorAvailability(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        Map<String, Object> response = new HashMap<>();
        response.put("doctorId", doctorId);
        response.put("date", date);
        response.put("isAvailable", doctorService.isDoctorAvailableOnDate(doctorId, date));
        response.put("availableSlots", doctorService.getAvailableSlotsCount(doctorId, date));

        return ResponseEntity.ok(response);
    }

    /**
     * Get next available date for a doctor (Public)
     */
    @GetMapping("/{doctorId}/availability/next")
    public ResponseEntity<Map<String, Object>> getNextAvailableDate(@PathVariable Long doctorId) {
        Map<String, Object> response = new HashMap<>();
        response.put("doctorId", doctorId);
        response.put("nextAvailableDate", doctorService.getNextAvailableDate(doctorId));

        return ResponseEntity.ok(response);
    }

    /**
     * Get available time slots for a doctor on a specific date (Public)
     * Returns detailed slot information with start/end times and availability status
     */
    @GetMapping("/{doctorId}/available-slots")
    public ResponseEntity<List<AvailableSlotResponse>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<AvailableSlotResponse> slots = appointmentService.getAvailableSlots(doctorId, date);
        return ResponseEntity.ok(slots);
    }
}
