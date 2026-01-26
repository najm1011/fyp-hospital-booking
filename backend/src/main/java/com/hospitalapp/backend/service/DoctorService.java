package com.hospitalapp.backend.service;

import com.hospitalapp.backend.dto.doctor.DoctorAvailabilityResponse;
import com.hospitalapp.backend.dto.doctor.DoctorAvailabilityResponse.AvailableDate;
import com.hospitalapp.backend.dto.doctor.DoctorAvailabilityResponse.TimeRange;
import com.hospitalapp.backend.dto.doctor.DoctorAvailabilityResponse.WeeklySchedule;
import com.hospitalapp.backend.dto.doctor.DoctorResponse;
import com.hospitalapp.backend.dto.doctor.TimeSlotRequest;
import com.hospitalapp.backend.dto.doctor.TimeSlotResponse;
import com.hospitalapp.backend.dto.doctor.UpdateAvailabilityRequest;
import com.hospitalapp.backend.exception.ResourceNotFoundException;
import com.hospitalapp.backend.model.Appointment;
import com.hospitalapp.backend.model.Doctor;
import com.hospitalapp.backend.model.TimeSlot;
import com.hospitalapp.backend.repository.AppointmentRepository;
import com.hospitalapp.backend.repository.DoctorRepository;
import com.hospitalapp.backend.repository.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final AppointmentRepository appointmentRepository;

    @Value("${app.appointment.slot-duration:30}")
    private int slotDurationMinutes;

    @Value("${app.appointment.max-future-days:90}")
    private int maxFutureDays;

    public DoctorService(DoctorRepository doctorRepository,
                         TimeSlotRepository timeSlotRepository,
                         AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.appointmentRepository = appointmentRepository;
    }

    /**
     * Get all active doctors
     */
    public List<DoctorResponse> getAllActiveDoctors() {
        List<Doctor> doctors = doctorRepository.findAllActiveDoctors();
        return doctors.stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all doctors (including inactive) - Admin only
     */
    public List<DoctorResponse> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get doctor by ID
     */
    public DoctorResponse getDoctorById(Long doctorId) {
        Doctor doctor = doctorRepository.findByIdWithUserAndDepartment(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
        return DoctorResponse.fromEntity(doctor);
    }

    /**
     * Get doctors by department
     */
    public List<DoctorResponse> getDoctorsByDepartment(Long departmentId) {
        List<Doctor> doctors = doctorRepository.findActiveDoctorsByDepartmentId(departmentId);
        return doctors.stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get doctors by specialty
     */
    public List<DoctorResponse> getDoctorsBySpecialty(String specialty) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyContaining(specialty);
        return doctors.stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Search doctors by name or specialty
     */
    public List<DoctorResponse> searchDoctors(String searchTerm) {
        List<Doctor> doctors = doctorRepository.searchDoctors(searchTerm);
        return doctors.stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Search doctors within a department
     */
    public List<DoctorResponse> searchDoctorsByDepartment(Long departmentId, String searchTerm) {
        List<Doctor> doctors = doctorRepository.searchDoctorsByDepartment(departmentId, searchTerm);
        return doctors.stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ==================== AVAILABILITY METHODS ====================

    /**
     * Get doctor's full availability information
     */
    public DoctorAvailabilityResponse getDoctorAvailability(Long doctorId) {
        Doctor doctor = doctorRepository.findByIdWithUserAndDepartment(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        DoctorAvailabilityResponse response = new DoctorAvailabilityResponse(
                doctor.getId(),
                doctor.getDoctorName()
        );

        // Get weekly schedule
        response.setWeeklySchedule(getWeeklySchedule(doctorId));

        // Get available dates for next N days
        response.setAvailableDates(getAvailableDatesForDoctor(doctorId, maxFutureDays));

        return response;
    }

    /**
     * Get doctor's weekly schedule (working hours for each day)
     */
    public List<WeeklySchedule> getWeeklySchedule(Long doctorId) {
        List<TimeSlot> timeSlots = timeSlotRepository.findByDoctorIdOrderedByDayAndTime(doctorId);

        // Group time slots by day of week
        Map<DayOfWeek, List<TimeSlot>> slotsByDay = timeSlots.stream()
                .filter(TimeSlot::getIsAvailable)
                .collect(Collectors.groupingBy(TimeSlot::getDayOfWeek));

        // Create weekly schedule for all days
        List<WeeklySchedule> weeklySchedule = new ArrayList<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            List<TimeSlot> daySlots = slotsByDay.getOrDefault(day, Collections.emptyList());
            List<TimeRange> timeRanges = daySlots.stream()
                    .map(slot -> new TimeRange(slot.getStartTime(), slot.getEndTime()))
                    .collect(Collectors.toList());
            weeklySchedule.add(new WeeklySchedule(day, timeRanges));
        }

        return weeklySchedule;
    }

    /**
     * Get available dates for a doctor for the next N days
     */
    public List<AvailableDate> getAvailableDatesForDoctor(Long doctorId, int daysAhead) {
        List<AvailableDate> availableDates = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Get all time slots for the doctor
        List<TimeSlot> allTimeSlots = timeSlotRepository.findByDoctorIdOrderedByDayAndTime(doctorId);
        Map<DayOfWeek, List<TimeSlot>> slotsByDay = allTimeSlots.stream()
                .filter(TimeSlot::getIsAvailable)
                .collect(Collectors.groupingBy(TimeSlot::getDayOfWeek));

        for (int i = 0; i < daysAhead; i++) {
            LocalDate date = today.plusDays(i);
            DayOfWeek dayOfWeek = date.getDayOfWeek();

            List<TimeSlot> daySlots = slotsByDay.getOrDefault(dayOfWeek, Collections.emptyList());
            if (daySlots.isEmpty()) {
                continue; // Doctor doesn't work on this day
            }

            // Calculate total slots for this day
            int totalSlots = calculateTotalSlots(daySlots);

            // Get booked appointments for this date
            List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndDate(doctorId, date);
            int bookedSlots = (int) bookedAppointments.stream()
                    .filter(a -> a.getStatus() == Appointment.Status.SCHEDULED)
                    .count();

            // For today, also consider past time slots as unavailable
            if (date.equals(today)) {
                int pastSlots = countPastSlotsForToday(daySlots);
                bookedSlots += pastSlots;
            }

            int availableSlots = Math.max(0, totalSlots - bookedSlots);

            if (availableSlots > 0) {
                availableDates.add(new AvailableDate(date, availableSlots, totalSlots));
            }
        }

        return availableDates;
    }

    /**
     * Check if doctor is available on a specific date
     */
    public boolean isDoctorAvailableOnDate(Long doctorId, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        List<TimeSlot> slots = timeSlotRepository.findAvailableSlotsByDoctorAndDay(doctorId, dayOfWeek);
        return !slots.isEmpty();
    }

    /**
     * Get next available date for a doctor
     */
    public LocalDate getNextAvailableDate(Long doctorId) {
        List<AvailableDate> availableDates = getAvailableDatesForDoctor(doctorId, maxFutureDays);
        return availableDates.isEmpty() ? null : availableDates.get(0).getDate();
    }

    /**
     * Get count of available slots for a doctor on a specific date
     */
    public int getAvailableSlotsCount(Long doctorId, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        List<TimeSlot> daySlots = timeSlotRepository.findAvailableSlotsByDoctorAndDay(doctorId, dayOfWeek);

        if (daySlots.isEmpty()) {
            return 0;
        }

        int totalSlots = calculateTotalSlots(daySlots);

        // Get booked appointments
        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndDate(doctorId, date);
        int bookedSlots = (int) bookedAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.SCHEDULED)
                .count();

        // For today, also consider past time slots
        if (date.equals(LocalDate.now())) {
            bookedSlots += countPastSlotsForToday(daySlots);
        }

        return Math.max(0, totalSlots - bookedSlots);
    }

    // ==================== HELPER METHODS ====================

    /**
     * Calculate total number of appointment slots from time ranges
     */
    private int calculateTotalSlots(List<TimeSlot> timeSlots) {
        int totalSlots = 0;
        for (TimeSlot slot : timeSlots) {
            long minutes = java.time.Duration.between(slot.getStartTime(), slot.getEndTime()).toMinutes();
            totalSlots += (int) (minutes / slotDurationMinutes);
        }
        return totalSlots;
    }

    /**
     * Count slots that have already passed for today
     */
    private int countPastSlotsForToday(List<TimeSlot> timeSlots) {
        LocalTime now = LocalTime.now();
        int pastSlots = 0;

        for (TimeSlot slot : timeSlots) {
            LocalTime startTime = slot.getStartTime();
            LocalTime endTime = slot.getEndTime();

            if (endTime.isBefore(now) || endTime.equals(now)) {
                // Entire slot is in the past
                long minutes = java.time.Duration.between(startTime, endTime).toMinutes();
                pastSlots += (int) (minutes / slotDurationMinutes);
            } else if (startTime.isBefore(now)) {
                // Partial slot is in the past
                long minutes = java.time.Duration.between(startTime, now).toMinutes();
                pastSlots += (int) (minutes / slotDurationMinutes);
            }
        }

        return pastSlots;
    }

    // ==================== AVAILABILITY MANAGEMENT METHODS ====================

    /**
     * Get doctor by user ID
     */
    public Doctor getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "userId", userId));
    }

    /**
     * Get all time slots for a doctor
     */
    public List<TimeSlotResponse> getDoctorTimeSlots(Long doctorId) {
        List<TimeSlot> timeSlots = timeSlotRepository.findByDoctorIdOrderedByDayAndTime(doctorId);
        return timeSlots.stream()
                .map(TimeSlotResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Add a new time slot for a doctor
     */
    @Transactional
    public TimeSlotResponse addTimeSlot(Long doctorId, TimeSlotRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        // Validate time range
        if (request.getEndTime().isBefore(request.getStartTime()) ||
            request.getEndTime().equals(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        // Check for overlapping slots
        List<TimeSlot> existingSlots = timeSlotRepository.findByDoctorIdAndDayOfWeek(
                doctorId, request.getDayOfWeek());

        for (TimeSlot existing : existingSlots) {
            if (isOverlapping(request.getStartTime(), request.getEndTime(),
                              existing.getStartTime(), existing.getEndTime())) {
                throw new IllegalArgumentException(
                        "Time slot overlaps with existing slot: " +
                        existing.getStartTime() + " - " + existing.getEndTime());
            }
        }

        TimeSlot timeSlot = new TimeSlot(doctor, request.getDayOfWeek(),
                request.getStartTime(), request.getEndTime());
        timeSlot.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);

        TimeSlot saved = timeSlotRepository.save(timeSlot);
        return TimeSlotResponse.fromEntity(saved);
    }

    /**
     * Update an existing time slot
     */
    @Transactional
    public TimeSlotResponse updateTimeSlot(Long doctorId, Long slotId, TimeSlotRequest request) {
        TimeSlot timeSlot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", slotId));

        // Verify the slot belongs to this doctor
        if (!timeSlot.getDoctor().getId().equals(doctorId)) {
            throw new IllegalArgumentException("Time slot does not belong to this doctor");
        }

        // Validate time range
        if (request.getEndTime().isBefore(request.getStartTime()) ||
            request.getEndTime().equals(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        // Check for overlapping slots (excluding current slot)
        List<TimeSlot> existingSlots = timeSlotRepository.findByDoctorIdAndDayOfWeek(
                doctorId, request.getDayOfWeek());

        for (TimeSlot existing : existingSlots) {
            if (!existing.getId().equals(slotId) &&
                isOverlapping(request.getStartTime(), request.getEndTime(),
                              existing.getStartTime(), existing.getEndTime())) {
                throw new IllegalArgumentException(
                        "Time slot overlaps with existing slot: " +
                        existing.getStartTime() + " - " + existing.getEndTime());
            }
        }

        timeSlot.setDayOfWeek(request.getDayOfWeek());
        timeSlot.setStartTime(request.getStartTime());
        timeSlot.setEndTime(request.getEndTime());
        timeSlot.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);

        TimeSlot saved = timeSlotRepository.save(timeSlot);
        return TimeSlotResponse.fromEntity(saved);
    }

    /**
     * Delete a time slot
     */
    @Transactional
    public void deleteTimeSlot(Long doctorId, Long slotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", slotId));

        // Verify the slot belongs to this doctor
        if (!timeSlot.getDoctor().getId().equals(doctorId)) {
            throw new IllegalArgumentException("Time slot does not belong to this doctor");
        }

        timeSlotRepository.delete(timeSlot);
    }

    /**
     * Toggle time slot availability
     */
    @Transactional
    public TimeSlotResponse toggleTimeSlotAvailability(Long doctorId, Long slotId) {
        TimeSlot timeSlot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", slotId));

        // Verify the slot belongs to this doctor
        if (!timeSlot.getDoctor().getId().equals(doctorId)) {
            throw new IllegalArgumentException("Time slot does not belong to this doctor");
        }

        timeSlot.setIsAvailable(!timeSlot.getIsAvailable());
        TimeSlot saved = timeSlotRepository.save(timeSlot);
        return TimeSlotResponse.fromEntity(saved);
    }

    /**
     * Bulk update all time slots for a doctor (replaces all existing slots)
     */
    @Transactional
    public List<TimeSlotResponse> updateAllTimeSlots(Long doctorId, UpdateAvailabilityRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        // Validate all time slots
        for (TimeSlotRequest slotRequest : request.getTimeSlots()) {
            if (slotRequest.getEndTime().isBefore(slotRequest.getStartTime()) ||
                slotRequest.getEndTime().equals(slotRequest.getStartTime())) {
                throw new IllegalArgumentException("End time must be after start time for " +
                        slotRequest.getDayOfWeek() + " " + slotRequest.getStartTime());
            }
        }

        // Check for overlapping slots within the request
        Map<DayOfWeek, List<TimeSlotRequest>> slotsByDay = request.getTimeSlots().stream()
                .collect(Collectors.groupingBy(TimeSlotRequest::getDayOfWeek));

        for (Map.Entry<DayOfWeek, List<TimeSlotRequest>> entry : slotsByDay.entrySet()) {
            List<TimeSlotRequest> daySlots = entry.getValue();
            for (int i = 0; i < daySlots.size(); i++) {
                for (int j = i + 1; j < daySlots.size(); j++) {
                    TimeSlotRequest slot1 = daySlots.get(i);
                    TimeSlotRequest slot2 = daySlots.get(j);
                    if (isOverlapping(slot1.getStartTime(), slot1.getEndTime(),
                                      slot2.getStartTime(), slot2.getEndTime())) {
                        throw new IllegalArgumentException(
                                "Overlapping time slots on " + entry.getKey() + ": " +
                                slot1.getStartTime() + "-" + slot1.getEndTime() + " and " +
                                slot2.getStartTime() + "-" + slot2.getEndTime());
                    }
                }
            }
        }

        // Delete all existing slots for this doctor
        List<TimeSlot> existingSlots = timeSlotRepository.findByDoctorId(doctorId);
        timeSlotRepository.deleteAll(existingSlots);

        // Create new slots
        List<TimeSlot> newSlots = new ArrayList<>();
        for (TimeSlotRequest slotRequest : request.getTimeSlots()) {
            TimeSlot timeSlot = new TimeSlot(doctor, slotRequest.getDayOfWeek(),
                    slotRequest.getStartTime(), slotRequest.getEndTime());
            timeSlot.setIsAvailable(slotRequest.getIsAvailable() != null ? slotRequest.getIsAvailable() : true);
            newSlots.add(timeSlot);
        }

        List<TimeSlot> savedSlots = timeSlotRepository.saveAll(newSlots);
        return savedSlots.stream()
                .map(TimeSlotResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Check if two time ranges overlap
     */
    private boolean isOverlapping(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return start1.isBefore(end2) && start2.isBefore(end1);
    }
}
