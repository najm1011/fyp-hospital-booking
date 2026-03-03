package com.hospitalapp.backend.repository;

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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("Doctor Repository CRUD Tests")
class DoctorRepositoryTest {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private User doctorUser1;
    private User doctorUser2;
    private Department cardiology;
    private Department dermatology;
    private Doctor doctor1;
    private Doctor doctor2;

    @BeforeEach
    void setUp() {
        doctorRepository.deleteAll();
        userRepository.deleteAll();
        departmentRepository.deleteAll();

        // Create departments
        cardiology = new Department();
        cardiology.setName("Cardiology");
        cardiology.setDescription("Heart and cardiovascular system");
        cardiology = departmentRepository.save(cardiology);

        dermatology = new Department();
        dermatology.setName("Dermatology");
        dermatology.setDescription("Skin conditions");
        dermatology = departmentRepository.save(dermatology);

        // Create doctor users
        doctorUser1 = new User();
        doctorUser1.setEmail("dr.smith@hospital.com");
        doctorUser1.setPasswordHash("$2a$12$hash");
        doctorUser1.setFirstName("James");
        doctorUser1.setLastName("Smith");
        doctorUser1.setRole(User.Role.DOCTOR);
        doctorUser1.setIsActive(true);
        doctorUser1 = userRepository.save(doctorUser1);

        doctorUser2 = new User();
        doctorUser2.setEmail("dr.johnson@hospital.com");
        doctorUser2.setPasswordHash("$2a$12$hash");
        doctorUser2.setFirstName("Sarah");
        doctorUser2.setLastName("Johnson");
        doctorUser2.setRole(User.Role.DOCTOR);
        doctorUser2.setIsActive(true);
        doctorUser2 = userRepository.save(doctorUser2);

        // Create doctors
        doctor1 = new Doctor();
        doctor1.setUser(doctorUser1);
        doctor1.setDepartment(cardiology);
        doctor1.setSpecialty("Interventional Cardiology");
        doctor1.setQualifications("MBBS, MD, FRCP");
        doctor1.setBio("Senior cardiologist with 15 years experience");
        doctor1.setConsultationFee(new BigDecimal("150.00"));

        doctor2 = new Doctor();
        doctor2.setUser(doctorUser2);
        doctor2.setDepartment(dermatology);
        doctor2.setSpecialty("Clinical Dermatology");
        doctor2.setQualifications("MBBS, MD, FAAD");
        doctor2.setBio("Expert in skin conditions");
        doctor2.setConsultationFee(new BigDecimal("120.00"));
    }

    // --- CREATE TESTS ---

    @Test
    @DisplayName("Should create a new doctor")
    void shouldCreateDoctor() {
        Doctor saved = doctorRepository.save(doctor1);

        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getSpecialty()).isEqualTo("Interventional Cardiology");
        assertThat(saved.getConsultationFee()).isEqualByComparingTo(new BigDecimal("150.00"));
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should create doctor with user relationship")
    void shouldCreateDoctorWithUserRelationship() {
        Doctor saved = doctorRepository.save(doctor1);

        assertThat(saved.getUser()).isNotNull();
        assertThat(saved.getUser().getEmail()).isEqualTo("dr.smith@hospital.com");
        assertThat(saved.getDoctorName()).isEqualTo("James Smith");
    }

    @Test
    @DisplayName("Should create doctor with department relationship")
    void shouldCreateDoctorWithDepartmentRelationship() {
        Doctor saved = doctorRepository.save(doctor1);

        assertThat(saved.getDepartment()).isNotNull();
        assertThat(saved.getDepartment().getName()).isEqualTo("Cardiology");
    }

    // --- READ TESTS ---

    @Test
    @DisplayName("Should find doctor by ID")
    void shouldFindDoctorById() {
        Doctor saved = doctorRepository.save(doctor1);

        Optional<Doctor> found = doctorRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getSpecialty()).isEqualTo("Interventional Cardiology");
    }

    @Test
    @DisplayName("Should find doctor by user ID")
    void shouldFindDoctorByUserId() {
        doctorRepository.save(doctor1);

        Optional<Doctor> found = doctorRepository.findByUserId(doctorUser1.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getSpecialty()).isEqualTo("Interventional Cardiology");
    }

    @Test
    @DisplayName("Should check if doctor exists by user ID")
    void shouldCheckIfDoctorExistsByUserId() {
        doctorRepository.save(doctor1);

        boolean exists = doctorRepository.existsByUserId(doctorUser1.getId());
        boolean notExists = doctorRepository.existsByUserId(999L);

        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("Should find doctors by department ID")
    void shouldFindDoctorsByDepartmentId() {
        doctorRepository.save(doctor1);
        doctorRepository.save(doctor2);

        List<Doctor> cardiologyDoctors = doctorRepository.findByDepartmentId(cardiology.getId());

        assertThat(cardiologyDoctors).hasSize(1);
        assertThat(cardiologyDoctors.get(0).getSpecialty()).isEqualTo("Interventional Cardiology");
    }

    @Test
    @DisplayName("Should find all active doctors")
    void shouldFindAllActiveDoctors() {
        doctorRepository.save(doctor1);
        doctorRepository.save(doctor2);

        List<Doctor> activeDoctors = doctorRepository.findAllActiveDoctors();

        assertThat(activeDoctors).hasSize(2);
    }

    @Test
    @DisplayName("Should find active doctors by department")
    void shouldFindActiveDoctorsByDepartment() {
        doctorRepository.save(doctor1);
        doctorRepository.save(doctor2);

        List<Doctor> activeDoctors = doctorRepository.findActiveDoctorsByDepartmentId(cardiology.getId());

        assertThat(activeDoctors).hasSize(1);
    }

    @Test
    @DisplayName("Should find doctors by specialty")
    void shouldFindDoctorsBySpecialty() {
        doctorRepository.save(doctor1);
        doctorRepository.save(doctor2);

        List<Doctor> results = doctorRepository.findBySpecialtyContaining("Cardiology");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getUser().getFirstName()).isEqualTo("James");
    }

    @Test
    @DisplayName("Should search doctors by name or specialty")
    void shouldSearchDoctors() {
        doctorRepository.save(doctor1);
        doctorRepository.save(doctor2);

        List<Doctor> results = doctorRepository.searchDoctors("James");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getSpecialty()).isEqualTo("Interventional Cardiology");
    }

    @Test
    @DisplayName("Should find doctor with user eagerly loaded")
    void shouldFindDoctorWithUser() {
        Doctor saved = doctorRepository.save(doctor1);

        Optional<Doctor> found = doctorRepository.findByIdWithUser(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getUser()).isNotNull();
        assertThat(found.get().getUser().getEmail()).isEqualTo("dr.smith@hospital.com");
    }

    @Test
    @DisplayName("Should find doctor with user and department eagerly loaded")
    void shouldFindDoctorWithUserAndDepartment() {
        Doctor saved = doctorRepository.save(doctor1);

        Optional<Doctor> found = doctorRepository.findByIdWithUserAndDepartment(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getUser()).isNotNull();
        assertThat(found.get().getDepartment()).isNotNull();
        assertThat(found.get().getDepartment().getName()).isEqualTo("Cardiology");
    }

    // --- UPDATE TESTS ---

    @Test
    @DisplayName("Should update doctor specialty")
    void shouldUpdateDoctorSpecialty() {
        Doctor saved = doctorRepository.save(doctor1);

        saved.setSpecialty("Cardiac Surgery");
        Doctor updated = doctorRepository.save(saved);

        assertThat(updated.getSpecialty()).isEqualTo("Cardiac Surgery");
        assertThat(updated.getId()).isEqualTo(saved.getId());
    }

    @Test
    @DisplayName("Should update doctor consultation fee")
    void shouldUpdateDoctorConsultationFee() {
        Doctor saved = doctorRepository.save(doctor1);

        saved.setConsultationFee(new BigDecimal("200.00"));
        Doctor updated = doctorRepository.save(saved);

        assertThat(updated.getConsultationFee()).isEqualByComparingTo(new BigDecimal("200.00"));
    }

    @Test
    @DisplayName("Should update doctor department")
    void shouldUpdateDoctorDepartment() {
        Doctor saved = doctorRepository.save(doctor1);

        saved.setDepartment(dermatology);
        Doctor updated = doctorRepository.save(saved);

        assertThat(updated.getDepartment().getName()).isEqualTo("Dermatology");
    }

    @Test
    @DisplayName("Should update doctor qualifications")
    void shouldUpdateDoctorQualifications() {
        Doctor saved = doctorRepository.save(doctor1);

        saved.setQualifications("MBBS, MD, FRCP, PhD");
        Doctor updated = doctorRepository.save(saved);

        assertThat(updated.getQualifications()).isEqualTo("MBBS, MD, FRCP, PhD");
    }

    // --- DELETE TESTS ---

    @Test
    @DisplayName("Should delete doctor by ID")
    void shouldDeleteDoctorById() {
        Doctor saved = doctorRepository.save(doctor1);
        Long id = saved.getId();

        doctorRepository.deleteById(id);

        Optional<Doctor> deleted = doctorRepository.findById(id);
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("Should delete doctor entity")
    void shouldDeleteDoctorEntity() {
        Doctor saved = doctorRepository.save(doctor1);

        doctorRepository.delete(saved);

        Optional<Doctor> deleted = doctorRepository.findById(saved.getId());
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("Should delete all doctors")
    void shouldDeleteAllDoctors() {
        doctorRepository.save(doctor1);
        doctorRepository.save(doctor2);

        doctorRepository.deleteAll();

        List<Doctor> doctors = doctorRepository.findAll();
        assertThat(doctors).isEmpty();
    }

    // --- HELPER METHOD TESTS ---

    @Test
    @DisplayName("Should return doctor name from user")
    void shouldReturnDoctorName() {
        Doctor saved = doctorRepository.save(doctor1);

        assertThat(saved.getDoctorName()).isEqualTo("James Smith");
    }
}
