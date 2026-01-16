package com.hospitalapp.backend.service;

import com.hospitalapp.backend.dto.appointment.*;
import com.hospitalapp.backend.exception.AppointmentException;
import com.hospitalapp.backend.exception.ResourceNotFoundException;
import com.hospitalapp.backend.model.*;
import com.hospitalapp.backend.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Value("${app.appointment.slot-duration:30}")
    private int slotDurationMinutes;

    @Value("${app.appointment.max-future-days:90}")
    private int maxFutureDays;

    @Value("${app.appointment.min-cancellation-hours:24}")
    private int minCancellationHours;

    @Value("${app.appointment.max-upcoming-per-patient:5}")
    private int maxUpcomingPerPatient;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            TimeSlotRepository timeSlotRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    // ==================== PATIENT OPERATIONS ====================

    /**
     * Book a new appointment for a patient
     */
    public AppointmentResponse bookAppointment(Long patientId, CreateAppointmentRequest request) {
        // Validate patient exists
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        // Validate patient role
        if (patient.getRole() != User.Role.PATIENT) {
            throw new AppointmentException("Only patients can book appointments", AppointmentException.UNAUTHORIZED);
        }

        // Validate doctor exists
        Doctor doctor = doctorRepository.findByIdWithUserAndDepartment(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", request.getDoctorId()));

        // Validate doctor is active
        if (!doctor.getUser().getIsActive()) {
            throw new AppointmentException("This doctor is not currently available", AppointmentException.DOCTOR_NOT_AVAILABLE);
        }

        // Validate appointment date
        validateAppointmentDate(request.getAppointmentDate());

        // Calculate end time early for validation
        LocalTime endTime = request.getStartTime().plusMinutes(slotDurationMinutes);

        // Validate doctor works on this day and time is within working hours
        DayOfWeek dayOfWeek = request.getAppointmentDate().getDayOfWeek();
        List<TimeSlot> doctorSlots = timeSlotRepository.findAvailableSlotsByDoctorAndDay(doctor.getId(), dayOfWeek);
        if (doctorSlots.isEmpty()) {
            throw new AppointmentException("Doctor is not available on this day", AppointmentException.DOCTOR_NOT_AVAILABLE);
        }

        // Validate time slot is within doctor's working hours
        validateTimeSlotWithinWorkingHours(request.getStartTime(), endTime, doctorSlots);

        // Check patient's upcoming appointment limit
        long upcomingCount = appointmentRepository.countUpcomingAppointmentsByPatient(patientId, LocalDate.now());
        if (upcomingCount >= maxUpcomingPerPatient) {
            throw new AppointmentException(
                    String.format("You can only have %d upcoming appointments at a time", maxUpcomingPerPatient),
                    AppointmentException.MAX_APPOINTMENTS_REACHED
            );
        }

        // ==================== DOUBLE BOOKING PREVENTION ====================

        // 1. Check if doctor's slot is already booked (existing check)
        if (!isSlotAvailable(doctor.getId(), request.getAppointmentDate(), request.getStartTime())) {
            throw new AppointmentException("This time slot is already booked with this doctor",
                    AppointmentException.SLOT_NOT_AVAILABLE);
        }

        // 2. Check for overlapping doctor appointments (time range overlap)
        if (appointmentRepository.hasOverlappingDoctorAppointment(
                doctor.getId(), request.getAppointmentDate(), request.getStartTime(), endTime)) {
            throw new AppointmentException("Doctor has a conflicting appointment at this time",
                    AppointmentException.DOCTOR_TIME_CONFLICT);
        }

        // 3. Check if patient already has appointment at same time (with any doctor)
        if (appointmentRepository.hasOverlappingPatientAppointment(
                patientId, request.getAppointmentDate(), request.getStartTime(), endTime)) {
            throw new AppointmentException("You already have an appointment at this time",
                    AppointmentException.PATIENT_TIME_CONFLICT);
        }

        // 4. Check if patient already has appointment with same doctor on same day
        if (appointmentRepository.existsByPatientDoctorAndDate(
                patientId, doctor.getId(), request.getAppointmentDate())) {
            throw new AppointmentException("You already have an appointment with this doctor on this date",
                    AppointmentException.SAME_DAY_SAME_DOCTOR);
        }

        // ==================== CREATE APPOINTMENT ====================

        Appointment appointment = new Appointment(
                patient,
                doctor,
                request.getAppointmentDate(),
                request.getStartTime(),
                endTime
        );
        appointment.setPatientNotes(request.getPatientNotes());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return AppointmentResponse.fromEntity(savedAppointment);
    }

    /**
     * Get all appointments for a patient
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getPatientAppointments(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientIdOrderedByDate(patientId);
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming appointments for a patient
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getPatientUpcomingAppointments(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findUpcomingAppointmentsByPatient(patientId, LocalDate.now());
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Cancel an appointment by patient
     */
    public AppointmentResponse cancelAppointmentByPatient(Long patientId, Long appointmentId, CancelAppointmentRequest request) {
        Appointment appointment = getAppointmentById(appointmentId);

        // Verify patient owns this appointment
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new AppointmentException("You are not authorized to cancel this appointment", AppointmentException.UNAUTHORIZED);
        }

        return cancelAppointment(appointment, request.getReason());
    }

    /**
     * Reschedule an appointment by patient
     */
    public AppointmentResponse rescheduleAppointmentByPatient(Long patientId, Long appointmentId, RescheduleAppointmentRequest request) {
        Appointment appointment = getAppointmentById(appointmentId);

        // Verify patient owns this appointment
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new AppointmentException("You are not authorized to reschedule this appointment", AppointmentException.UNAUTHORIZED);
        }

        return rescheduleAppointment(appointment, request);
    }

    // ==================== DOCTOR OPERATIONS ====================

    /**
     * Get all appointments for a doctor
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getDoctorAppointments(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorIdOrderedByDate(doctorId);
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get today's appointments for a doctor
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getDoctorTodayAppointments(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findTodayAppointmentsByDoctor(doctorId, LocalDate.now());
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming appointments for a doctor
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getDoctorUpcomingAppointments(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findUpcomingAppointmentsByDoctor(doctorId, LocalDate.now());
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get doctor's appointments for a specific date range
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getDoctorAppointmentsByDateRange(Long doctorId, LocalDate startDate, LocalDate endDate) {
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Mark appointment as completed by doctor
     */
    public AppointmentResponse completeAppointment(Long doctorId, Long appointmentId, UpdateAppointmentNotesRequest request) {
        Appointment appointment = getAppointmentById(appointmentId);

        // Verify doctor owns this appointment
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new AppointmentException("You are not authorized to update this appointment", AppointmentException.UNAUTHORIZED);
        }

        // Verify appointment is scheduled
        if (appointment.getStatus() != Appointment.Status.SCHEDULED) {
            throw new AppointmentException("Only scheduled appointments can be marked as completed", AppointmentException.CANNOT_MODIFY);
        }

        appointment.setStatus(Appointment.Status.COMPLETED);
        if (request != null && request.getNotes() != null) {
            appointment.setDoctorNotes(request.getNotes());
        }

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(savedAppointment);
    }

    /**
     * Mark appointment as no-show by doctor
     */
    public AppointmentResponse markNoShow(Long doctorId, Long appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);

        // Verify doctor owns this appointment
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new AppointmentException("You are not authorized to update this appointment", AppointmentException.UNAUTHORIZED);
        }

        // Verify appointment is scheduled
        if (appointment.getStatus() != Appointment.Status.SCHEDULED) {
            throw new AppointmentException("Only scheduled appointments can be marked as no-show", AppointmentException.CANNOT_MODIFY);
        }

        appointment.setStatus(Appointment.Status.NO_SHOW);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(savedAppointment);
    }

    /**
     * Update doctor notes for an appointment
     */
    public AppointmentResponse updateDoctorNotes(Long doctorId, Long appointmentId, UpdateAppointmentNotesRequest request) {
        Appointment appointment = getAppointmentById(appointmentId);

        // Verify doctor owns this appointment
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new AppointmentException("You are not authorized to update this appointment", AppointmentException.UNAUTHORIZED);
        }

        appointment.setDoctorNotes(request.getNotes());
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(savedAppointment);
    }

    /**
     * Cancel an appointment by doctor
     */
    public AppointmentResponse cancelAppointmentByDoctor(Long doctorId, Long appointmentId, CancelAppointmentRequest request) {
        Appointment appointment = getAppointmentById(appointmentId);

        // Verify doctor owns this appointment
        if (!appointment.getDoctor().getId().equals(doctorId)) {
            throw new AppointmentException("You are not authorized to cancel this appointment", AppointmentException.UNAUTHORIZED);
        }

        return cancelAppointment(appointment, request.getReason());
    }

    // ==================== ADMIN OPERATIONS ====================

    /**
     * Get all appointments (admin only)
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all upcoming appointments (admin only)
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllUpcomingAppointments() {
        List<Appointment> appointments = appointmentRepository.findAllUpcomingAppointments(LocalDate.now());
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get appointments by date range (admin only)
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Appointment> appointments = appointmentRepository.findAppointmentsBetweenDates(startDate, endDate);
        return appointments.stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Cancel any appointment (admin only)
     */
    public AppointmentResponse cancelAppointmentByAdmin(Long appointmentId, CancelAppointmentRequest request) {
        Appointment appointment = getAppointmentById(appointmentId);
        return cancelAppointment(appointment, request.getReason() + " (Cancelled by Admin)");
    }

    // ==================== AVAILABILITY OPERATIONS ====================

    /**
     * Get available slots for a doctor on a specific date
     */
    @Transactional(readOnly = true)
    public List<AvailableSlotResponse> getAvailableSlots(Long doctorId, LocalDate date) {
        // Validate doctor exists
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }

        // Validate date
        validateAppointmentDate(date);

        DayOfWeek dayOfWeek = date.getDayOfWeek();
        List<TimeSlot> doctorTimeSlots = timeSlotRepository.findAvailableSlotsByDoctorAndDay(doctorId, dayOfWeek);

        if (doctorTimeSlots.isEmpty()) {
            return new ArrayList<>();
        }

        // Get existing appointments for this date
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndDate(doctorId, date);
        List<LocalTime> bookedTimes = existingAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.SCHEDULED)
                .map(Appointment::getStartTime)
                .collect(Collectors.toList());

        // Generate available slots
        List<AvailableSlotResponse> availableSlots = new ArrayList<>();

        for (TimeSlot timeSlot : doctorTimeSlots) {
            LocalTime currentTime = timeSlot.getStartTime();
            while (currentTime.plusMinutes(slotDurationMinutes).isBefore(timeSlot.getEndTime()) ||
                   currentTime.plusMinutes(slotDurationMinutes).equals(timeSlot.getEndTime())) {

                LocalTime endTime = currentTime.plusMinutes(slotDurationMinutes);
                boolean isAvailable = !bookedTimes.contains(currentTime);

                // Check if slot is in the past for today
                if (date.equals(LocalDate.now()) && currentTime.isBefore(LocalTime.now())) {
                    isAvailable = false;
                }

                availableSlots.add(new AvailableSlotResponse(date, currentTime, endTime, isAvailable));
                currentTime = endTime;
            }
        }

        return availableSlots;
    }

    /**
     * Check if a specific slot is available
     */
    @Transactional(readOnly = true)
    public boolean isSlotAvailable(Long doctorId, LocalDate date, LocalTime startTime) {
        return !appointmentRepository.existsByDoctorDateAndTime(doctorId, date, startTime);
    }

    // ==================== STATISTICS ====================

    /**
     * Get appointment statistics for a patient
     */
    @Transactional(readOnly = true)
    public AppointmentStatsResponse getPatientStats(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        AppointmentStatsResponse stats = calculateStats(appointments);

        // Calculate upcoming appointments
        long upcoming = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.SCHEDULED &&
                        !a.getAppointmentDate().isBefore(LocalDate.now()))
                .count();
        stats.setUpcoming(upcoming);

        // Calculate unique doctors visited
        long uniqueDoctors = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.COMPLETED)
                .map(a -> a.getDoctor().getId())
                .distinct()
                .count();
        stats.setUniqueDoctorsCount(uniqueDoctors);

        // Calculate pending (scheduled) appointments
        long pending = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.SCHEDULED)
                .count();
        stats.setPending(pending);

        return stats;
    }

    /**
     * Get appointment statistics for a doctor
     */
    @Transactional(readOnly = true)
    public AppointmentStatsResponse getDoctorStats(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        AppointmentStatsResponse stats = calculateStats(appointments);

        // Calculate today's appointments
        LocalDate today = LocalDate.now();
        long todayCount = appointments.stream()
                .filter(a -> a.getAppointmentDate().equals(today))
                .count();
        stats.setTodayCount(todayCount);

        // Calculate completed today
        long completedToday = appointments.stream()
                .filter(a -> a.getAppointmentDate().equals(today) &&
                        a.getStatus() == Appointment.Status.COMPLETED)
                .count();
        stats.setCompletedToday(completedToday);

        // Calculate unique patients
        long uniquePatients = appointments.stream()
                .map(a -> a.getPatient().getId())
                .distinct()
                .count();
        stats.setUniquePatientsCount(uniquePatients);

        // Calculate pending
        long pending = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.SCHEDULED)
                .count();
        stats.setPending(pending);

        return stats;
    }

    /**
     * Get overall appointment statistics (admin)
     */
    @Transactional(readOnly = true)
    public AppointmentStatsResponse getOverallStats() {
        long scheduled = appointmentRepository.countByStatus(Appointment.Status.SCHEDULED);
        long completed = appointmentRepository.countByStatus(Appointment.Status.COMPLETED);
        long cancelled = appointmentRepository.countByStatus(Appointment.Status.CANCELLED);
        long noShow = appointmentRepository.countByStatus(Appointment.Status.NO_SHOW);

        AppointmentStatsResponse stats = new AppointmentStatsResponse(scheduled, completed, cancelled, noShow);

        // Calculate today's appointments
        LocalDate today = LocalDate.now();
        long todayCount = appointmentRepository.countByAppointmentDate(today);
        stats.setTodayCount(todayCount);

        // Get counts from repositories
        long totalDoctors = doctorRepository.count();
        long totalPatients = userRepository.countByRole(User.Role.PATIENT);

        stats.setTotalDoctors(totalDoctors);
        stats.setTotalPatients(totalPatients);

        return stats;
    }

    // ==================== COMMON OPERATIONS ====================

    /**
     * Get a single appointment by ID
     */
    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentResponseById(Long appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);
        return AppointmentResponse.fromEntity(appointment);
    }

    // ==================== HELPER METHODS ====================

    private Appointment getAppointmentById(Long appointmentId) {
        return appointmentRepository.findByIdWithPatientAndDoctor(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));
    }

    private void validateAppointmentDate(LocalDate date) {
        LocalDate today = LocalDate.now();

        if (date.isBefore(today)) {
            throw new AppointmentException("Cannot book appointments in the past", AppointmentException.PAST_DATE);
        }

        LocalDate maxDate = today.plusDays(maxFutureDays);
        if (date.isAfter(maxDate)) {
            throw new AppointmentException(
                    String.format("Cannot book appointments more than %d days in advance", maxFutureDays),
                    AppointmentException.TOO_FAR_IN_FUTURE
            );
        }
    }

    private AppointmentResponse cancelAppointment(Appointment appointment, String reason) {
        // Check if already cancelled
        if (appointment.getStatus() == Appointment.Status.CANCELLED) {
            throw new AppointmentException("This appointment is already cancelled", AppointmentException.ALREADY_CANCELLED);
        }

        // Check if appointment can be cancelled (not completed or no-show)
        if (appointment.getStatus() != Appointment.Status.SCHEDULED) {
            throw new AppointmentException("This appointment cannot be cancelled", AppointmentException.CANNOT_CANCEL);
        }

        appointment.setStatus(Appointment.Status.CANCELLED);
        appointment.setCancellationReason(reason);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(savedAppointment);
    }

    private AppointmentResponse rescheduleAppointment(Appointment appointment, RescheduleAppointmentRequest request) {
        // Check if appointment can be rescheduled
        if (appointment.getStatus() != Appointment.Status.SCHEDULED) {
            throw new AppointmentException("Only scheduled appointments can be rescheduled", AppointmentException.CANNOT_MODIFY);
        }

        // Validate new date
        validateAppointmentDate(request.getNewDate());

        // Calculate new end time
        LocalTime newEndTime = request.getNewStartTime().plusMinutes(slotDurationMinutes);

        // Validate doctor works on the new day
        DayOfWeek newDayOfWeek = request.getNewDate().getDayOfWeek();
        List<TimeSlot> doctorSlots = timeSlotRepository.findAvailableSlotsByDoctorAndDay(
                appointment.getDoctor().getId(), newDayOfWeek);
        if (doctorSlots.isEmpty()) {
            throw new AppointmentException("Doctor is not available on the new date", AppointmentException.DOCTOR_NOT_AVAILABLE);
        }

        // Validate time slot is within doctor's working hours
        validateTimeSlotWithinWorkingHours(request.getNewStartTime(), newEndTime, doctorSlots);

        // Check if new slot is available (exclude current appointment from check)
        if (!isSlotAvailable(appointment.getDoctor().getId(), request.getNewDate(), request.getNewStartTime())) {
            throw new AppointmentException("The new time slot is not available", AppointmentException.SLOT_NOT_AVAILABLE);
        }

        // Check for overlapping patient appointments (exclude current appointment)
        if (hasOverlappingPatientAppointmentExcluding(
                appointment.getPatient().getId(), request.getNewDate(),
                request.getNewStartTime(), newEndTime, appointment.getId())) {
            throw new AppointmentException("You already have an appointment at this time",
                    AppointmentException.PATIENT_TIME_CONFLICT);
        }

        // Update appointment
        appointment.setAppointmentDate(request.getNewDate());
        appointment.setStartTime(request.getNewStartTime());
        appointment.setEndTime(newEndTime);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(savedAppointment);
    }

    private AppointmentStatsResponse calculateStats(List<Appointment> appointments) {
        long scheduled = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.SCHEDULED)
                .count();
        long completed = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.COMPLETED)
                .count();
        long cancelled = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.CANCELLED)
                .count();
        long noShow = appointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.NO_SHOW)
                .count();

        return new AppointmentStatsResponse(scheduled, completed, cancelled, noShow);
    }

    /**
     * Validate that the requested time slot falls within doctor's working hours
     */
    private void validateTimeSlotWithinWorkingHours(LocalTime startTime, LocalTime endTime, List<TimeSlot> doctorSlots) {
        boolean isWithinWorkingHours = false;

        for (TimeSlot slot : doctorSlots) {
            // Check if the appointment time falls completely within this working hour slot
            if (!startTime.isBefore(slot.getStartTime()) && !endTime.isAfter(slot.getEndTime())) {
                isWithinWorkingHours = true;
                break;
            }
        }

        if (!isWithinWorkingHours) {
            throw new AppointmentException(
                    "The requested time is outside doctor's working hours",
                    AppointmentException.OUTSIDE_WORKING_HOURS
            );
        }
    }

    /**
     * Check for overlapping patient appointments, excluding a specific appointment (for rescheduling)
     */
    private boolean hasOverlappingPatientAppointmentExcluding(Long patientId, LocalDate date,
                                                              LocalTime startTime, LocalTime endTime,
                                                              Long excludeAppointmentId) {
        return appointmentRepository.hasOverlappingPatientAppointmentExcluding(
                patientId, date, startTime, endTime, excludeAppointmentId);
    }
}
