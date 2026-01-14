package com.hospitalapp.backend.service;

import com.hospitalapp.backend.dto.doctor.DoctorAvailabilityResponse;
import com.hospitalapp.backend.dto.doctor.DoctorAvailabilityResponse.AvailableDate;
import com.hospitalapp.backend.dto.doctor.DoctorAvailabilityResponse.TimeRange;
import com.hospitalapp.backend.dto.doctor.DoctorAvailabilityResponse.WeeklySchedule;
import com.hospitalapp.backend.dto.doctor.DoctorResponse;
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
}
