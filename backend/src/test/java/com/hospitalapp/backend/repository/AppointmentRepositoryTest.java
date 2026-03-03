package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.Appointment;
import com.hospitalapp.backend.model.Department;
import com.hospitalapp.backend.model.Doctor;
import com.hospitalapp.backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Appointment Repository CRUD Tests")
class AppointmentRepositoryTest {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private User patient1;
    private User patient2;
    private Doctor doctor;
    private Appointment appointment1;
    private Appointment appointment2;
    private Appointment appointment3;

    @BeforeEach
    void setUp() {
        appointmentRepository.deleteAll();
        doctorRepository.deleteAll();
        userRepository.deleteAll();
        departmentRepository.deleteAll();

        // Create department
        Department cardiology = new Department();
        cardiology.setName("Cardiology");
        cardiology.setDescription("Heart department");
        cardiology = departmentRepository.save(cardiology);

        // Create doctor user
        User doctorUser = new User();
        doctorUser.setEmail("dr.smith@hospital.com");
        doctorUser.setPasswordHash("$2a$12$hash");
        doctorUser.setFirstName("James");
        doctorUser.setLastName("Smith");
        doctorUser.setRole(User.Role.DOCTOR);
        doctorUser.setIsActive(true);
        doctorUser = userRepository.save(doctorUser);

        // Create doctor
        doctor = new Doctor();
        doctor.setUser(doctorUser);
        doctor.setDepartment(cardiology);
        doctor.setSpecialty("Cardiology");
        doctor.setConsultationFee(new BigDecimal("150.00"));
        doctor = doctorRepository.save(doctor);

        // Create patients
        patient1 = new User();
        patient1.setEmail("john.doe@email.com");
        patient1.setPasswordHash("$2a$12$hash");
        patient1.setFirstName("John");
        patient1.setLastName("Doe");
        patient1.setRole(User.Role.PATIENT);
        patient1.setIsActive(true);
        patient1 = userRepository.save(patient1);

        patient2 = new User();
        patient2.setEmail("jane.doe@email.com");
        patient2.setPasswordHash("$2a$12$hash");
        patient2.setFirstName("Jane");
        patient2.setLastName("Doe");
        patient2.setRole(User.Role.PATIENT);
        patient2.setIsActive(true);
        patient2 = userRepository.save(patient2);

        // Create appointments
        appointment1 = new Appointment();
        appointment1.setPatient(patient1);
        appointment1.setDoctor(doctor);
        appointment1.setAppointmentDate(LocalDate.now().plusDays(3));
        appointment1.setStartTime(LocalTime.of(9, 0));
        appointment1.setEndTime(LocalTime.of(9, 30));
        appointment1.setStatus(Appointment.Status.SCHEDULED);
        appointment1.setPatientNotes("Regular checkup");

        appointment2 = new Appointment();
        appointment2.setPatient(patient1);
        appointment2.setDoctor(doctor);
        appointment2.setAppointmentDate(LocalDate.now().plusDays(7));
        appointment2.setStartTime(LocalTime.of(10, 0));
        appointment2.setEndTime(LocalTime.of(10, 30));
        appointment2.setStatus(Appointment.Status.SCHEDULED);
        appointment2.setPatientNotes("Follow-up visit");

        appointment3 = new Appointment();
        appointment3.setPatient(patient2);
        appointment3.setDoctor(doctor);
        appointment3.setAppointmentDate(LocalDate.now().minusDays(5));
        appointment3.setStartTime(LocalTime.of(14, 0));
        appointment3.setEndTime(LocalTime.of(14, 30));
        appointment3.setStatus(Appointment.Status.COMPLETED);
        appointment3.setPatientNotes("Heart palpitations");
        appointment3.setDoctorNotes("ECG normal. Advised lifestyle changes.");
    }

    // --- CREATE TESTS ---

    @Test
    @DisplayName("Should create a new appointment")
    void shouldCreateAppointment() {
        Appointment saved = appointmentRepository.save(appointment1);

        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getAppointmentDate()).isEqualTo(LocalDate.now().plusDays(3));
        assertThat(saved.getStartTime()).isEqualTo(LocalTime.of(9, 0));
        assertThat(saved.getStatus()).isEqualTo(Appointment.Status.SCHEDULED);
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should create appointment with patient relationship")
    void shouldCreateAppointmentWithPatientRelationship() {
        Appointment saved = appointmentRepository.save(appointment1);

        assertThat(saved.getPatient()).isNotNull();
        assertThat(saved.getPatient().getEmail()).isEqualTo("john.doe@email.com");
    }

    @Test
    @DisplayName("Should create appointment with doctor relationship")
    void shouldCreateAppointmentWithDoctorRelationship() {
        Appointment saved = appointmentRepository.save(appointment1);

        assertThat(saved.getDoctor()).isNotNull();
        assertThat(saved.getDoctor().getSpecialty()).isEqualTo("Cardiology");
    }

    @Test
    @DisplayName("Should create completed appointment with doctor notes")
    void shouldCreateCompletedAppointmentWithDoctorNotes() {
        Appointment saved = appointmentRepository.save(appointment3);

        assertThat(saved.getStatus()).isEqualTo(Appointment.Status.COMPLETED);
        assertThat(saved.getDoctorNotes()).isEqualTo("ECG normal. Advised lifestyle changes.");
    }

    // --- READ TESTS ---

    @Test
    @DisplayName("Should find appointment by ID")
    void shouldFindAppointmentById() {
        Appointment saved = appointmentRepository.save(appointment1);

        Optional<Appointment> found = appointmentRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getPatientNotes()).isEqualTo("Regular checkup");
    }

    @Test
    @DisplayName("Should find appointments by patient ID")
    void shouldFindAppointmentsByPatientId() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);
        appointmentRepository.save(appointment3);

        List<Appointment> patient1Appointments = appointmentRepository.findByPatientId(patient1.getId());
        List<Appointment> patient2Appointments = appointmentRepository.findByPatientId(patient2.getId());

        assertThat(patient1Appointments).hasSize(2);
        assertThat(patient2Appointments).hasSize(1);
    }

    @Test
    @DisplayName("Should find appointments by doctor ID")
    void shouldFindAppointmentsByDoctorId() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);
        appointmentRepository.save(appointment3);

        List<Appointment> doctorAppointments = appointmentRepository.findByDoctorId(doctor.getId());

        assertThat(doctorAppointments).hasSize(3);
    }

    @Test
    @DisplayName("Should find appointments by status")
    void shouldFindAppointmentsByStatus() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);
        appointmentRepository.save(appointment3);

        List<Appointment> scheduled = appointmentRepository.findByStatus(Appointment.Status.SCHEDULED);
        List<Appointment> completed = appointmentRepository.findByStatus(Appointment.Status.COMPLETED);

        assertThat(scheduled).hasSize(2);
        assertThat(completed).hasSize(1);
    }

    @Test
    @DisplayName("Should find appointments by patient ID ordered by date")
    void shouldFindAppointmentsByPatientIdOrderedByDate() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);

        List<Appointment> appointments = appointmentRepository.findByPatientIdOrderedByDate(patient1.getId());

        assertThat(appointments).hasSize(2);
        // Ordered DESC, so later date first
        assertThat(appointments.get(0).getAppointmentDate()).isAfter(appointments.get(1).getAppointmentDate());
    }

    @Test
    @DisplayName("Should find upcoming appointments by patient")
    void shouldFindUpcomingAppointmentsByPatient() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);
        appointmentRepository.save(appointment3); // Past appointment

        List<Appointment> upcoming = appointmentRepository.findUpcomingAppointmentsByPatient(patient1.getId(), LocalDate.now());

        assertThat(upcoming).hasSize(2);
    }

    @Test
    @DisplayName("Should find upcoming appointments by doctor")
    void shouldFindUpcomingAppointmentsByDoctor() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);
        appointmentRepository.save(appointment3);

        List<Appointment> upcoming = appointmentRepository.findUpcomingAppointmentsByDoctor(doctor.getId(), LocalDate.now());

        assertThat(upcoming).hasSize(2);
    }

    @Test
    @DisplayName("Should find appointments by doctor and date")
    void shouldFindAppointmentsByDoctorAndDate() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);

        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDate(
            doctor.getId(),
            LocalDate.now().plusDays(3)
        );

        assertThat(appointments).hasSize(1);
        assertThat(appointments.get(0).getPatientNotes()).isEqualTo("Regular checkup");
    }

    @Test
    @DisplayName("Should find appointments by doctor and date range")
    void shouldFindAppointmentsByDoctorAndDateRange() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);
        appointmentRepository.save(appointment3);

        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDateRange(
            doctor.getId(),
            LocalDate.now(),
            LocalDate.now().plusDays(10)
        );

        assertThat(appointments).hasSize(2);
    }

    @Test
    @DisplayName("Should check if appointment exists by doctor, date and time")
    void shouldCheckIfAppointmentExists() {
        appointmentRepository.save(appointment1);

        boolean exists = appointmentRepository.existsByDoctorDateAndTime(
            doctor.getId(),
            LocalDate.now().plusDays(3),
            LocalTime.of(9, 0)
        );

        boolean notExists = appointmentRepository.existsByDoctorDateAndTime(
            doctor.getId(),
            LocalDate.now().plusDays(3),
            LocalTime.of(11, 0)
        );

        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("Should count upcoming appointments by patient")
    void shouldCountUpcomingAppointmentsByPatient() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);
        appointmentRepository.save(appointment3);

        long count = appointmentRepository.countUpcomingAppointmentsByPatient(patient1.getId(), LocalDate.now());

        assertThat(count).isEqualTo(2);
    }

    @Test
    @DisplayName("Should count appointments by status")
    void shouldCountAppointmentsByStatus() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);
        appointmentRepository.save(appointment3);

        long scheduledCount = appointmentRepository.countByStatus(Appointment.Status.SCHEDULED);
        long completedCount = appointmentRepository.countByStatus(Appointment.Status.COMPLETED);

        assertThat(scheduledCount).isEqualTo(2);
        assertThat(completedCount).isEqualTo(1);
    }

    @Test
    @DisplayName("Should find appointment with patient and doctor")
    void shouldFindAppointmentWithPatientAndDoctor() {
        Appointment saved = appointmentRepository.save(appointment1);

        Optional<Appointment> found = appointmentRepository.findByIdWithPatientAndDoctor(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getPatient()).isNotNull();
        assertThat(found.get().getDoctor()).isNotNull();
    }

    // --- UPDATE TESTS ---

    @Test
    @DisplayName("Should update appointment status")
    void shouldUpdateAppointmentStatus() {
        Appointment saved = appointmentRepository.save(appointment1);

        saved.setStatus(Appointment.Status.COMPLETED);
        Appointment updated = appointmentRepository.save(saved);

        assertThat(updated.getStatus()).isEqualTo(Appointment.Status.COMPLETED);
        assertThat(updated.getId()).isEqualTo(saved.getId());
    }

    @Test
    @DisplayName("Should update appointment with doctor notes")
    void shouldUpdateAppointmentWithDoctorNotes() {
        Appointment saved = appointmentRepository.save(appointment1);

        saved.setStatus(Appointment.Status.COMPLETED);
        saved.setDoctorNotes("Patient is in good health. No concerns.");
        Appointment updated = appointmentRepository.save(saved);

        assertThat(updated.getDoctorNotes()).isEqualTo("Patient is in good health. No concerns.");
    }

    @Test
    @DisplayName("Should cancel appointment with reason")
    void shouldCancelAppointmentWithReason() {
        Appointment saved = appointmentRepository.save(appointment1);

        saved.setStatus(Appointment.Status.CANCELLED);
        saved.setCancellationReason("Patient requested cancellation");
        Appointment updated = appointmentRepository.save(saved);

        assertThat(updated.getStatus()).isEqualTo(Appointment.Status.CANCELLED);
        assertThat(updated.getCancellationReason()).isEqualTo("Patient requested cancellation");
    }

    @Test
    @DisplayName("Should update appointment date and time")
    void shouldUpdateAppointmentDateAndTime() {
        Appointment saved = appointmentRepository.save(appointment1);

        saved.setAppointmentDate(LocalDate.now().plusDays(10));
        saved.setStartTime(LocalTime.of(11, 0));
        saved.setEndTime(LocalTime.of(11, 30));
        Appointment updated = appointmentRepository.save(saved);

        assertThat(updated.getAppointmentDate()).isEqualTo(LocalDate.now().plusDays(10));
        assertThat(updated.getStartTime()).isEqualTo(LocalTime.of(11, 0));
    }

    @Test
    @DisplayName("Should mark appointment as no-show")
    void shouldMarkAppointmentAsNoShow() {
        Appointment saved = appointmentRepository.save(appointment1);

        saved.setStatus(Appointment.Status.NO_SHOW);
        Appointment updated = appointmentRepository.save(saved);

        assertThat(updated.getStatus()).isEqualTo(Appointment.Status.NO_SHOW);
    }

    // --- DELETE TESTS ---

    @Test
    @DisplayName("Should delete appointment by ID")
    void shouldDeleteAppointmentById() {
        Appointment saved = appointmentRepository.save(appointment1);
        Long id = saved.getId();

        appointmentRepository.deleteById(id);

        Optional<Appointment> deleted = appointmentRepository.findById(id);
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("Should delete appointment entity")
    void shouldDeleteAppointmentEntity() {
        Appointment saved = appointmentRepository.save(appointment1);

        appointmentRepository.delete(saved);

        Optional<Appointment> deleted = appointmentRepository.findById(saved.getId());
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("Should delete all appointments")
    void shouldDeleteAllAppointments() {
        appointmentRepository.save(appointment1);
        appointmentRepository.save(appointment2);
        appointmentRepository.save(appointment3);

        appointmentRepository.deleteAll();

        List<Appointment> appointments = appointmentRepository.findAll();
        assertThat(appointments).isEmpty();
    }

    // --- HELPER METHOD TESTS ---

    @Test
    @DisplayName("Should generate confirmation number")
    void shouldGenerateConfirmationNumber() {
        Appointment saved = appointmentRepository.save(appointment1);

        String confirmationNumber = saved.getConfirmationNumber();

        assertThat(confirmationNumber).isNotNull();
        assertThat(confirmationNumber).startsWith("APT-");
        assertThat(confirmationNumber).contains(String.valueOf(saved.getAppointmentDate().getYear()));
    }
}
