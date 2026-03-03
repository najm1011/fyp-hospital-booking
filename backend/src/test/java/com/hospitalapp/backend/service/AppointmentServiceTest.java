package com.hospitalapp.backend.service;

import com.hospitalapp.backend.dto.appointment.*;
import com.hospitalapp.backend.exception.AppointmentException;
import com.hospitalapp.backend.exception.ResourceNotFoundException;
import com.hospitalapp.backend.model.*;
import com.hospitalapp.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AppointmentService Unit Tests")
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TimeSlotRepository timeSlotRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private User patient;
    private User doctorUser;
    private Doctor doctor;
    private Department department;
    private TimeSlot timeSlot;
    private Appointment appointment;
    private CreateAppointmentRequest createRequest;
    private LocalDate futureDate;

    @BeforeEach
    void setUp() {
        // Set configuration values via reflection
        ReflectionTestUtils.setField(appointmentService, "slotDurationMinutes", 30);
        ReflectionTestUtils.setField(appointmentService, "maxFutureDays", 90);
        ReflectionTestUtils.setField(appointmentService, "minCancellationHours", 24);
        ReflectionTestUtils.setField(appointmentService, "maxUpcomingPerPatient", 5);

        // Set up future date (next Monday to ensure consistent day of week)
        futureDate = LocalDate.now().plusDays(7);
        while (futureDate.getDayOfWeek() != DayOfWeek.MONDAY) {
            futureDate = futureDate.plusDays(1);
        }

        // Create department
        department = new Department();
        department.setId(1L);
        department.setName("Cardiology");

        // Create patient
        patient = new User();
        patient.setId(1L);
        patient.setEmail("patient@test.com");
        patient.setFirstName("John");
        patient.setLastName("Doe");
        patient.setRole(User.Role.PATIENT);
        patient.setIsActive(true);

        // Create doctor user
        doctorUser = new User();
        doctorUser.setId(2L);
        doctorUser.setEmail("doctor@test.com");
        doctorUser.setFirstName("Jane");
        doctorUser.setLastName("Smith");
        doctorUser.setRole(User.Role.DOCTOR);
        doctorUser.setIsActive(true);

        // Create doctor
        doctor = new Doctor();
        doctor.setId(1L);
        doctor.setUser(doctorUser);
        doctor.setDepartment(department);
        doctor.setSpecialty("Cardiology");
        doctor.setConsultationFee(new BigDecimal("150.00"));

        // Create time slot for Monday
        timeSlot = new TimeSlot();
        timeSlot.setId(1L);
        timeSlot.setDoctor(doctor);
        timeSlot.setDayOfWeek(DayOfWeek.MONDAY);
        timeSlot.setStartTime(LocalTime.of(9, 0));
        timeSlot.setEndTime(LocalTime.of(17, 0));
        timeSlot.setIsAvailable(true);

        // Create appointment
        appointment = new Appointment();
        appointment.setId(1L);
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(futureDate);
        appointment.setStartTime(LocalTime.of(10, 0));
        appointment.setEndTime(LocalTime.of(10, 30));
        appointment.setStatus(Appointment.Status.SCHEDULED);

        // Create request
        createRequest = new CreateAppointmentRequest();
        createRequest.setDoctorId(1L);
        createRequest.setAppointmentDate(futureDate);
        createRequest.setStartTime(LocalTime.of(10, 0));
        createRequest.setPatientNotes("Regular checkup");
    }

    // --- BOOK APPOINTMENT TESTS ---

    @Nested
    @DisplayName("Book Appointment Tests")
    class BookAppointmentTests {

        @Test
        @DisplayName("Should book appointment successfully")
        void shouldBookAppointmentSuccessfully() {
            // Arrange
            when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
            when(doctorRepository.findByIdWithUserAndDepartment(1L)).thenReturn(Optional.of(doctor));
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, futureDate.getDayOfWeek()))
                    .thenReturn(List.of(timeSlot));
            when(appointmentRepository.countUpcomingAppointmentsByPatient(1L, LocalDate.now())).thenReturn(0L);
            when(appointmentRepository.existsByDoctorDateAndTime(1L, futureDate, LocalTime.of(10, 0))).thenReturn(false);
            when(appointmentRepository.hasOverlappingDoctorAppointment(eq(1L), eq(futureDate), any(), any())).thenReturn(false);
            when(appointmentRepository.hasOverlappingPatientAppointment(eq(1L), eq(futureDate), any(), any())).thenReturn(false);
            when(appointmentRepository.existsByPatientDoctorAndDate(1L, 1L, futureDate)).thenReturn(false);
            when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

            // Act
            AppointmentResponse response = appointmentService.bookAppointment(1L, createRequest);

            // Assert
            assertThat(response).isNotNull();
            assertThat(response.getStatus()).isEqualTo("SCHEDULED");
            verify(appointmentRepository).save(any(Appointment.class));
        }

        @Test
        @DisplayName("Should throw exception when patient not found")
        void shouldThrowExceptionWhenPatientNotFound() {
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> appointmentService.bookAppointment(999L, createRequest))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Patient");
        }

        @Test
        @DisplayName("Should throw exception when user is not a patient")
        void shouldThrowExceptionWhenUserIsNotPatient() {
            doctorUser.setRole(User.Role.DOCTOR);
            when(userRepository.findById(2L)).thenReturn(Optional.of(doctorUser));

            assertThatThrownBy(() -> appointmentService.bookAppointment(2L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("Only patients can book appointments");
        }

        @Test
        @DisplayName("Should throw exception when doctor not found")
        void shouldThrowExceptionWhenDoctorNotFound() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
            when(doctorRepository.findByIdWithUserAndDepartment(1L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Doctor");
        }

        @Test
        @DisplayName("Should throw exception when doctor is inactive")
        void shouldThrowExceptionWhenDoctorIsInactive() {
            doctorUser.setIsActive(false);
            when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
            when(doctorRepository.findByIdWithUserAndDepartment(1L)).thenReturn(Optional.of(doctor));

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("not currently available");
        }

        @Test
        @DisplayName("Should throw exception when booking in the past")
        void shouldThrowExceptionWhenBookingInPast() {
            createRequest.setAppointmentDate(LocalDate.now().minusDays(1));
            when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
            when(doctorRepository.findByIdWithUserAndDepartment(1L)).thenReturn(Optional.of(doctor));

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("Cannot book appointments in the past");
        }

        @Test
        @DisplayName("Should throw exception when booking too far in future")
        void shouldThrowExceptionWhenBookingTooFarInFuture() {
            createRequest.setAppointmentDate(LocalDate.now().plusDays(100));
            when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
            when(doctorRepository.findByIdWithUserAndDepartment(1L)).thenReturn(Optional.of(doctor));

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("Cannot book appointments more than");
        }

        @Test
        @DisplayName("Should throw exception when doctor does not work on the day")
        void shouldThrowExceptionWhenDoctorNotAvailableOnDay() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
            when(doctorRepository.findByIdWithUserAndDepartment(1L)).thenReturn(Optional.of(doctor));
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, futureDate.getDayOfWeek()))
                    .thenReturn(Collections.emptyList());

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("Doctor is not available on this day");
        }

        @Test
        @DisplayName("Should throw exception when max appointments reached")
        void shouldThrowExceptionWhenMaxAppointmentsReached() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
            when(doctorRepository.findByIdWithUserAndDepartment(1L)).thenReturn(Optional.of(doctor));
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, futureDate.getDayOfWeek()))
                    .thenReturn(List.of(timeSlot));
            when(appointmentRepository.countUpcomingAppointmentsByPatient(1L, LocalDate.now())).thenReturn(5L);

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("You can only have");
        }

        @Test
        @DisplayName("Should throw exception when time is outside working hours")
        void shouldThrowExceptionWhenTimeOutsideWorkingHours() {
            createRequest.setStartTime(LocalTime.of(7, 0)); // Before 9 AM
            when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
            when(doctorRepository.findByIdWithUserAndDepartment(1L)).thenReturn(Optional.of(doctor));
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, futureDate.getDayOfWeek()))
                    .thenReturn(List.of(timeSlot));
            // Note: countUpcomingAppointmentsByPatient is NOT mocked because the exception
            // is thrown before that check in the service flow

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("outside doctor's working hours");
        }
    }

    // --- DOUBLE BOOKING PREVENTION TESTS ---

    @Nested
    @DisplayName("Double Booking Prevention Tests")
    class DoubleBookingTests {

        @BeforeEach
        void setUpCommonMocks() {
            when(userRepository.findById(1L)).thenReturn(Optional.of(patient));
            when(doctorRepository.findByIdWithUserAndDepartment(1L)).thenReturn(Optional.of(doctor));
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, futureDate.getDayOfWeek()))
                    .thenReturn(List.of(timeSlot));
            when(appointmentRepository.countUpcomingAppointmentsByPatient(1L, LocalDate.now())).thenReturn(0L);
        }

        @Test
        @DisplayName("Should throw exception when slot is already booked")
        void shouldThrowExceptionWhenSlotAlreadyBooked() {
            when(appointmentRepository.existsByDoctorDateAndTime(1L, futureDate, LocalTime.of(10, 0))).thenReturn(true);

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("already booked");
        }

        @Test
        @DisplayName("Should throw exception when doctor has overlapping appointment")
        void shouldThrowExceptionWhenDoctorHasOverlap() {
            when(appointmentRepository.existsByDoctorDateAndTime(1L, futureDate, LocalTime.of(10, 0))).thenReturn(false);
            when(appointmentRepository.hasOverlappingDoctorAppointment(eq(1L), eq(futureDate), any(), any())).thenReturn(true);

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("Doctor has a conflicting appointment");
        }

        @Test
        @DisplayName("Should throw exception when patient has overlapping appointment")
        void shouldThrowExceptionWhenPatientHasOverlap() {
            when(appointmentRepository.existsByDoctorDateAndTime(1L, futureDate, LocalTime.of(10, 0))).thenReturn(false);
            when(appointmentRepository.hasOverlappingDoctorAppointment(eq(1L), eq(futureDate), any(), any())).thenReturn(false);
            when(appointmentRepository.hasOverlappingPatientAppointment(eq(1L), eq(futureDate), any(), any())).thenReturn(true);

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("You already have an appointment at this time");
        }

        @Test
        @DisplayName("Should throw exception when patient already has appointment with same doctor on same day")
        void shouldThrowExceptionWhenSameDaySameDoctor() {
            when(appointmentRepository.existsByDoctorDateAndTime(1L, futureDate, LocalTime.of(10, 0))).thenReturn(false);
            when(appointmentRepository.hasOverlappingDoctorAppointment(eq(1L), eq(futureDate), any(), any())).thenReturn(false);
            when(appointmentRepository.hasOverlappingPatientAppointment(eq(1L), eq(futureDate), any(), any())).thenReturn(false);
            when(appointmentRepository.existsByPatientDoctorAndDate(1L, 1L, futureDate)).thenReturn(true);

            assertThatThrownBy(() -> appointmentService.bookAppointment(1L, createRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("already have an appointment with this doctor on this date");
        }
    }

    // --- CANCEL APPOINTMENT TESTS ---

    @Nested
    @DisplayName("Cancel Appointment Tests")
    class CancelAppointmentTests {

        @Test
        @DisplayName("Should cancel appointment by patient successfully")
        void shouldCancelAppointmentByPatient() {
            CancelAppointmentRequest cancelRequest = new CancelAppointmentRequest("Personal reasons");
            appointment.setStatus(Appointment.Status.SCHEDULED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

            AppointmentResponse response = appointmentService.cancelAppointmentByPatient(1L, 1L, cancelRequest);

            assertThat(response.getStatus()).isEqualTo("CANCELLED");
            verify(appointmentRepository).save(any(Appointment.class));
        }

        @Test
        @DisplayName("Should throw exception when patient tries to cancel other patient's appointment")
        void shouldThrowExceptionWhenCancellingOtherPatientsAppointment() {
            CancelAppointmentRequest cancelRequest = new CancelAppointmentRequest("Personal reasons");

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));

            assertThatThrownBy(() -> appointmentService.cancelAppointmentByPatient(999L, 1L, cancelRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("not authorized");
        }

        @Test
        @DisplayName("Should throw exception when cancelling already cancelled appointment")
        void shouldThrowExceptionWhenAlreadyCancelled() {
            CancelAppointmentRequest cancelRequest = new CancelAppointmentRequest("Personal reasons");
            appointment.setStatus(Appointment.Status.CANCELLED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));

            assertThatThrownBy(() -> appointmentService.cancelAppointmentByPatient(1L, 1L, cancelRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("already cancelled");
        }

        @Test
        @DisplayName("Should throw exception when cancelling completed appointment")
        void shouldThrowExceptionWhenCancellingCompletedAppointment() {
            CancelAppointmentRequest cancelRequest = new CancelAppointmentRequest("Personal reasons");
            appointment.setStatus(Appointment.Status.COMPLETED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));

            assertThatThrownBy(() -> appointmentService.cancelAppointmentByPatient(1L, 1L, cancelRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("cannot be cancelled");
        }

        @Test
        @DisplayName("Should cancel appointment by doctor successfully")
        void shouldCancelAppointmentByDoctor() {
            CancelAppointmentRequest cancelRequest = new CancelAppointmentRequest("Doctor unavailable");
            appointment.setStatus(Appointment.Status.SCHEDULED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

            AppointmentResponse response = appointmentService.cancelAppointmentByDoctor(1L, 1L, cancelRequest);

            assertThat(response.getStatus()).isEqualTo("CANCELLED");
        }

        @Test
        @DisplayName("Should cancel appointment by admin successfully")
        void shouldCancelAppointmentByAdmin() {
            CancelAppointmentRequest cancelRequest = new CancelAppointmentRequest("Administrative cancellation");
            appointment.setStatus(Appointment.Status.SCHEDULED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

            AppointmentResponse response = appointmentService.cancelAppointmentByAdmin(1L, cancelRequest);

            assertThat(response.getStatus()).isEqualTo("CANCELLED");
            assertThat(response.getCancellationReason()).contains("Admin");
        }
    }

    // --- RESCHEDULE APPOINTMENT TESTS ---

    @Nested
    @DisplayName("Reschedule Appointment Tests")
    class RescheduleAppointmentTests {

        private RescheduleAppointmentRequest rescheduleRequest;
        private LocalDate newFutureDate;

        @BeforeEach
        void setUp() {
            newFutureDate = futureDate.plusDays(7);
            while (newFutureDate.getDayOfWeek() != DayOfWeek.MONDAY) {
                newFutureDate = newFutureDate.plusDays(1);
            }
            rescheduleRequest = new RescheduleAppointmentRequest(newFutureDate, LocalTime.of(11, 0));
        }

        @Test
        @DisplayName("Should reschedule appointment successfully")
        void shouldRescheduleAppointmentSuccessfully() {
            appointment.setStatus(Appointment.Status.SCHEDULED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, newFutureDate.getDayOfWeek()))
                    .thenReturn(List.of(timeSlot));
            when(appointmentRepository.existsByDoctorDateAndTime(1L, newFutureDate, LocalTime.of(11, 0))).thenReturn(false);
            when(appointmentRepository.hasOverlappingPatientAppointmentExcluding(eq(1L), eq(newFutureDate), any(), any(), eq(1L)))
                    .thenReturn(false);
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

            AppointmentResponse response = appointmentService.rescheduleAppointmentByPatient(1L, 1L, rescheduleRequest);

            assertThat(response).isNotNull();
            verify(appointmentRepository).save(any(Appointment.class));
        }

        @Test
        @DisplayName("Should throw exception when rescheduling other patient's appointment")
        void shouldThrowExceptionWhenReschedulingOthersAppointment() {
            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));

            assertThatThrownBy(() -> appointmentService.rescheduleAppointmentByPatient(999L, 1L, rescheduleRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("not authorized");
        }

        @Test
        @DisplayName("Should throw exception when rescheduling cancelled appointment")
        void shouldThrowExceptionWhenReschedulingCancelledAppointment() {
            appointment.setStatus(Appointment.Status.CANCELLED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));

            assertThatThrownBy(() -> appointmentService.rescheduleAppointmentByPatient(1L, 1L, rescheduleRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("Only scheduled appointments can be rescheduled");
        }

        @Test
        @DisplayName("Should throw exception when new slot is not available")
        void shouldThrowExceptionWhenNewSlotNotAvailable() {
            appointment.setStatus(Appointment.Status.SCHEDULED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, newFutureDate.getDayOfWeek()))
                    .thenReturn(List.of(timeSlot));
            when(appointmentRepository.existsByDoctorDateAndTime(1L, newFutureDate, LocalTime.of(11, 0))).thenReturn(true);

            assertThatThrownBy(() -> appointmentService.rescheduleAppointmentByPatient(1L, 1L, rescheduleRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("not available");
        }

        @Test
        @DisplayName("Should throw exception when patient has overlapping appointment on new date")
        void shouldThrowExceptionWhenOverlappingOnNewDate() {
            appointment.setStatus(Appointment.Status.SCHEDULED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, newFutureDate.getDayOfWeek()))
                    .thenReturn(List.of(timeSlot));
            when(appointmentRepository.existsByDoctorDateAndTime(1L, newFutureDate, LocalTime.of(11, 0))).thenReturn(false);
            when(appointmentRepository.hasOverlappingPatientAppointmentExcluding(eq(1L), eq(newFutureDate), any(), any(), eq(1L)))
                    .thenReturn(true);

            assertThatThrownBy(() -> appointmentService.rescheduleAppointmentByPatient(1L, 1L, rescheduleRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("already have an appointment at this time");
        }
    }

    // --- DOCTOR OPERATIONS TESTS ---

    @Nested
    @DisplayName("Doctor Operations Tests")
    class DoctorOperationsTests {

        @Test
        @DisplayName("Should get doctor appointments")
        void shouldGetDoctorAppointments() {
            List<Appointment> appointments = List.of(appointment);
            when(appointmentRepository.findByDoctorIdOrderedByDate(1L)).thenReturn(appointments);

            List<AppointmentResponse> response = appointmentService.getDoctorAppointments(1L);

            assertThat(response).hasSize(1);
        }

        @Test
        @DisplayName("Should get doctor today appointments")
        void shouldGetDoctorTodayAppointments() {
            when(appointmentRepository.findTodayAppointmentsByDoctor(eq(1L), any(LocalDate.class)))
                    .thenReturn(List.of(appointment));

            List<AppointmentResponse> response = appointmentService.getDoctorTodayAppointments(1L);

            assertThat(response).hasSize(1);
        }

        @Test
        @DisplayName("Should complete appointment successfully")
        void shouldCompleteAppointment() {
            UpdateAppointmentNotesRequest notesRequest = new UpdateAppointmentNotesRequest();
            notesRequest.setNotes("Patient is healthy");
            appointment.setStatus(Appointment.Status.SCHEDULED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

            AppointmentResponse response = appointmentService.completeAppointment(1L, 1L, notesRequest);

            assertThat(response.getStatus()).isEqualTo("COMPLETED");
        }

        @Test
        @DisplayName("Should throw exception when completing other doctor's appointment")
        void shouldThrowExceptionWhenCompletingOtherDoctorsAppointment() {
            UpdateAppointmentNotesRequest notesRequest = new UpdateAppointmentNotesRequest();
            appointment.setStatus(Appointment.Status.SCHEDULED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));

            assertThatThrownBy(() -> appointmentService.completeAppointment(999L, 1L, notesRequest))
                    .isInstanceOf(AppointmentException.class)
                    .hasMessageContaining("not authorized");
        }

        @Test
        @DisplayName("Should mark appointment as no-show")
        void shouldMarkAppointmentAsNoShow() {
            appointment.setStatus(Appointment.Status.SCHEDULED);

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

            AppointmentResponse response = appointmentService.markNoShow(1L, 1L);

            assertThat(response.getStatus()).isEqualTo("NO_SHOW");
        }

        @Test
        @DisplayName("Should update doctor notes")
        void shouldUpdateDoctorNotes() {
            UpdateAppointmentNotesRequest notesRequest = new UpdateAppointmentNotesRequest();
            notesRequest.setNotes("Follow-up required in 2 weeks");

            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));
            when(appointmentRepository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

            AppointmentResponse response = appointmentService.updateDoctorNotes(1L, 1L, notesRequest);

            assertThat(response).isNotNull();
            verify(appointmentRepository).save(any(Appointment.class));
        }
    }

    // --- PATIENT OPERATIONS TESTS ---

    @Nested
    @DisplayName("Patient Operations Tests")
    class PatientOperationsTests {

        @Test
        @DisplayName("Should get patient appointments")
        void shouldGetPatientAppointments() {
            when(appointmentRepository.findByPatientIdOrderedByDate(1L)).thenReturn(List.of(appointment));

            List<AppointmentResponse> response = appointmentService.getPatientAppointments(1L);

            assertThat(response).hasSize(1);
        }

        @Test
        @DisplayName("Should get patient upcoming appointments")
        void shouldGetPatientUpcomingAppointments() {
            when(appointmentRepository.findUpcomingAppointmentsByPatient(eq(1L), any(LocalDate.class)))
                    .thenReturn(List.of(appointment));

            List<AppointmentResponse> response = appointmentService.getPatientUpcomingAppointments(1L);

            assertThat(response).hasSize(1);
        }
    }

    // --- ADMIN OPERATIONS TESTS ---

    @Nested
    @DisplayName("Admin Operations Tests")
    class AdminOperationsTests {

        @Test
        @DisplayName("Should get all appointments")
        void shouldGetAllAppointments() {
            when(appointmentRepository.findAll()).thenReturn(List.of(appointment));

            List<AppointmentResponse> response = appointmentService.getAllAppointments();

            assertThat(response).hasSize(1);
        }

        @Test
        @DisplayName("Should get all upcoming appointments")
        void shouldGetAllUpcomingAppointments() {
            when(appointmentRepository.findAllUpcomingAppointments(any(LocalDate.class)))
                    .thenReturn(List.of(appointment));

            List<AppointmentResponse> response = appointmentService.getAllUpcomingAppointments();

            assertThat(response).hasSize(1);
        }

        @Test
        @DisplayName("Should get appointments by date range")
        void shouldGetAppointmentsByDateRange() {
            LocalDate startDate = LocalDate.now();
            LocalDate endDate = LocalDate.now().plusDays(30);

            when(appointmentRepository.findAppointmentsBetweenDates(startDate, endDate))
                    .thenReturn(List.of(appointment));

            List<AppointmentResponse> response = appointmentService.getAppointmentsByDateRange(startDate, endDate);

            assertThat(response).hasSize(1);
        }
    }

    // --- AVAILABLE SLOTS TESTS ---

    @Nested
    @DisplayName("Available Slots Tests")
    class AvailableSlotsTests {

        @Test
        @DisplayName("Should get available slots for doctor")
        void shouldGetAvailableSlots() {
            when(doctorRepository.existsById(1L)).thenReturn(true);
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, futureDate.getDayOfWeek()))
                    .thenReturn(List.of(timeSlot));
            when(appointmentRepository.findByDoctorIdAndDate(1L, futureDate)).thenReturn(Collections.emptyList());

            List<AvailableSlotResponse> slots = appointmentService.getAvailableSlots(1L, futureDate);

            assertThat(slots).isNotEmpty();
            // 9 AM to 5 PM = 8 hours = 16 slots of 30 minutes
            assertThat(slots).hasSize(16);
        }

        @Test
        @DisplayName("Should return empty list when doctor has no slots for the day")
        void shouldReturnEmptyWhenNoSlots() {
            when(doctorRepository.existsById(1L)).thenReturn(true);
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, futureDate.getDayOfWeek()))
                    .thenReturn(Collections.emptyList());

            List<AvailableSlotResponse> slots = appointmentService.getAvailableSlots(1L, futureDate);

            assertThat(slots).isEmpty();
        }

        @Test
        @DisplayName("Should throw exception when doctor not found for available slots")
        void shouldThrowExceptionWhenDoctorNotFoundForSlots() {
            when(doctorRepository.existsById(999L)).thenReturn(false);

            assertThatThrownBy(() -> appointmentService.getAvailableSlots(999L, futureDate))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("Should mark booked slots as unavailable")
        void shouldMarkBookedSlotsAsUnavailable() {
            Appointment bookedAppointment = new Appointment();
            bookedAppointment.setStartTime(LocalTime.of(10, 0));
            bookedAppointment.setStatus(Appointment.Status.SCHEDULED);

            when(doctorRepository.existsById(1L)).thenReturn(true);
            when(timeSlotRepository.findAvailableSlotsByDoctorAndDay(1L, futureDate.getDayOfWeek()))
                    .thenReturn(List.of(timeSlot));
            when(appointmentRepository.findByDoctorIdAndDate(1L, futureDate)).thenReturn(List.of(bookedAppointment));

            List<AvailableSlotResponse> slots = appointmentService.getAvailableSlots(1L, futureDate);

            // Find the 10:00 slot and verify it's not available
            Optional<AvailableSlotResponse> bookedSlot = slots.stream()
                    .filter(s -> s.getStartTime().equals(LocalTime.of(10, 0)))
                    .findFirst();

            assertThat(bookedSlot).isPresent();
            assertThat(bookedSlot.get().isAvailable()).isFalse();
        }

        @Test
        @DisplayName("Should check if specific slot is available")
        void shouldCheckIfSlotIsAvailable() {
            when(appointmentRepository.existsByDoctorDateAndTime(1L, futureDate, LocalTime.of(10, 0)))
                    .thenReturn(false);

            boolean available = appointmentService.isSlotAvailable(1L, futureDate, LocalTime.of(10, 0));

            assertThat(available).isTrue();
        }

        @Test
        @DisplayName("Should return false when slot is not available")
        void shouldReturnFalseWhenSlotNotAvailable() {
            when(appointmentRepository.existsByDoctorDateAndTime(1L, futureDate, LocalTime.of(10, 0)))
                    .thenReturn(true);

            boolean available = appointmentService.isSlotAvailable(1L, futureDate, LocalTime.of(10, 0));

            assertThat(available).isFalse();
        }
    }

    // --- STATISTICS TESTS ---

    @Nested
    @DisplayName("Statistics Tests")
    class StatisticsTests {

        @Test
        @DisplayName("Should get patient statistics")
        void shouldGetPatientStats() {
            List<Appointment> appointments = new ArrayList<>();

            Appointment scheduled = new Appointment();
            scheduled.setStatus(Appointment.Status.SCHEDULED);
            appointments.add(scheduled);

            Appointment completed = new Appointment();
            completed.setStatus(Appointment.Status.COMPLETED);
            appointments.add(completed);

            when(appointmentRepository.findByPatientId(1L)).thenReturn(appointments);

            AppointmentStatsResponse stats = appointmentService.getPatientStats(1L);

            assertThat(stats.getUpcoming()).isEqualTo(1);
            assertThat(stats.getCompleted()).isEqualTo(1);
            assertThat(stats.getCancelled()).isEqualTo(0);
            assertThat(stats.getNoShow()).isEqualTo(0);
        }

        @Test
        @DisplayName("Should get doctor statistics")
        void shouldGetDoctorStats() {
            List<Appointment> appointments = new ArrayList<>();

            Appointment completed1 = new Appointment();
            completed1.setStatus(Appointment.Status.COMPLETED);
            appointments.add(completed1);

            Appointment completed2 = new Appointment();
            completed2.setStatus(Appointment.Status.COMPLETED);
            appointments.add(completed2);

            Appointment cancelled = new Appointment();
            cancelled.setStatus(Appointment.Status.CANCELLED);
            appointments.add(cancelled);

            when(appointmentRepository.findByDoctorId(1L)).thenReturn(appointments);

            AppointmentStatsResponse stats = appointmentService.getDoctorStats(1L);

            assertThat(stats.getUpcoming()).isEqualTo(0);
            assertThat(stats.getCompleted()).isEqualTo(2);
            assertThat(stats.getCancelled()).isEqualTo(1);
        }

        @Test
        @DisplayName("Should get overall statistics")
        void shouldGetOverallStats() {
            when(appointmentRepository.countByStatus(Appointment.Status.SCHEDULED)).thenReturn(10L);
            when(appointmentRepository.countByStatus(Appointment.Status.COMPLETED)).thenReturn(50L);
            when(appointmentRepository.countByStatus(Appointment.Status.CANCELLED)).thenReturn(5L);
            when(appointmentRepository.countByStatus(Appointment.Status.NO_SHOW)).thenReturn(3L);

            AppointmentStatsResponse stats = appointmentService.getOverallStats();

            assertThat(stats.getUpcoming()).isEqualTo(10);
            assertThat(stats.getCompleted()).isEqualTo(50);
            assertThat(stats.getCancelled()).isEqualTo(5);
            assertThat(stats.getNoShow()).isEqualTo(3);
        }
    }

    // --- GET APPOINTMENT BY ID TESTS ---

    @Nested
    @DisplayName("Get Appointment By ID Tests")
    class GetAppointmentByIdTests {

        @Test
        @DisplayName("Should get appointment by ID")
        void shouldGetAppointmentById() {
            when(appointmentRepository.findByIdWithPatientAndDoctor(1L)).thenReturn(Optional.of(appointment));

            AppointmentResponse response = appointmentService.getAppointmentResponseById(1L);

            assertThat(response).isNotNull();
            assertThat(response.getId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should throw exception when appointment not found")
        void shouldThrowExceptionWhenAppointmentNotFound() {
            when(appointmentRepository.findByIdWithPatientAndDoctor(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> appointmentService.getAppointmentResponseById(999L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Appointment");
        }
    }
}
