package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("User Repository CRUD Tests")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User testPatient;
    private User testDoctor;
    private User testAdmin;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        testPatient = new User();
        testPatient.setEmail("patient@test.com");
        testPatient.setPasswordHash("$2a$12$hashedpassword");
        testPatient.setFirstName("John");
        testPatient.setLastName("Doe");
        testPatient.setPhoneNumber("079-1234-5678");
        testPatient.setRole(User.Role.PATIENT);
        testPatient.setIsActive(true);

        testDoctor = new User();
        testDoctor.setEmail("doctor@test.com");
        testDoctor.setPasswordHash("$2a$12$hashedpassword");
        testDoctor.setFirstName("Jane");
        testDoctor.setLastName("Smith");
        testDoctor.setPhoneNumber("020-1111-2222");
        testDoctor.setRole(User.Role.DOCTOR);
        testDoctor.setIsActive(true);

        testAdmin = new User();
        testAdmin.setEmail("admin@test.com");
        testAdmin.setPasswordHash("$2a$12$hashedpassword");
        testAdmin.setFirstName("Admin");
        testAdmin.setLastName("User");
        testAdmin.setPhoneNumber("020-9999-9999");
        testAdmin.setRole(User.Role.ADMIN);
        testAdmin.setIsActive(true);
    }

    // ==================== CREATE TESTS ====================

    @Test
    @DisplayName("Should create a new patient user")
    void shouldCreatePatientUser() {
        User savedUser = userRepository.save(testPatient);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo("patient@test.com");
        assertThat(savedUser.getRole()).isEqualTo(User.Role.PATIENT);
        assertThat(savedUser.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should create a new doctor user")
    void shouldCreateDoctorUser() {
        User savedUser = userRepository.save(testDoctor);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getRole()).isEqualTo(User.Role.DOCTOR);
    }

    @Test
    @DisplayName("Should create a new admin user")
    void shouldCreateAdminUser() {
        User savedUser = userRepository.save(testAdmin);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getRole()).isEqualTo(User.Role.ADMIN);
    }

    // ==================== READ TESTS ====================

    @Test
    @DisplayName("Should find user by ID")
    void shouldFindUserById() {
        User savedUser = userRepository.save(testPatient);

        Optional<User> foundUser = userRepository.findById(savedUser.getId());

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo("patient@test.com");
    }

    @Test
    @DisplayName("Should find user by email")
    void shouldFindUserByEmail() {
        userRepository.save(testPatient);

        Optional<User> foundUser = userRepository.findByEmail("patient@test.com");

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getFirstName()).isEqualTo("John");
    }

    @Test
    @DisplayName("Should return empty when user not found by email")
    void shouldReturnEmptyWhenUserNotFoundByEmail() {
        Optional<User> foundUser = userRepository.findByEmail("nonexistent@test.com");

        assertThat(foundUser).isEmpty();
    }

    @Test
    @DisplayName("Should find all users")
    void shouldFindAllUsers() {
        userRepository.save(testPatient);
        userRepository.save(testDoctor);
        userRepository.save(testAdmin);

        List<User> users = userRepository.findAll();

        assertThat(users).hasSize(3);
    }

    @Test
    @DisplayName("Should find users by role")
    void shouldFindUsersByRole() {
        userRepository.save(testPatient);
        userRepository.save(testDoctor);
        userRepository.save(testAdmin);

        List<User> patients = userRepository.findByRole(User.Role.PATIENT);
        List<User> doctors = userRepository.findByRole(User.Role.DOCTOR);

        assertThat(patients).hasSize(1);
        assertThat(doctors).hasSize(1);
    }

    @Test
    @DisplayName("Should find active users by role")
    void shouldFindActiveUsersByRole() {
        testPatient.setIsActive(true);
        userRepository.save(testPatient);

        User inactivePatient = new User();
        inactivePatient.setEmail("inactive@test.com");
        inactivePatient.setPasswordHash("$2a$12$hash");
        inactivePatient.setFirstName("Inactive");
        inactivePatient.setLastName("Patient");
        inactivePatient.setRole(User.Role.PATIENT);
        inactivePatient.setIsActive(false);
        userRepository.save(inactivePatient);

        List<User> activePatients = userRepository.findByRoleAndIsActive(User.Role.PATIENT, true);

        assertThat(activePatients).hasSize(1);
        assertThat(activePatients.get(0).getEmail()).isEqualTo("patient@test.com");
    }

    @Test
    @DisplayName("Should check if email exists")
    void shouldCheckIfEmailExists() {
        userRepository.save(testPatient);

        boolean exists = userRepository.existsByEmail("patient@test.com");
        boolean notExists = userRepository.existsByEmail("nonexistent@test.com");

        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    @DisplayName("Should search users by name or email")
    void shouldSearchUsers() {
        userRepository.save(testPatient);
        userRepository.save(testDoctor);

        List<User> results = userRepository.searchUsers("John");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getFirstName()).isEqualTo("John");
    }

    @Test
    @DisplayName("Should count users by role")
    void shouldCountUsersByRole() {
        userRepository.save(testPatient);
        userRepository.save(testDoctor);
        userRepository.save(testAdmin);

        long patientCount = userRepository.countByRole(User.Role.PATIENT);
        long doctorCount = userRepository.countByRole(User.Role.DOCTOR);

        assertThat(patientCount).isEqualTo(1);
        assertThat(doctorCount).isEqualTo(1);
    }

    // ==================== UPDATE TESTS ====================

    @Test
    @DisplayName("Should update user email")
    void shouldUpdateUserEmail() {
        User savedUser = userRepository.save(testPatient);

        savedUser.setEmail("updated@test.com");
        User updatedUser = userRepository.save(savedUser);

        assertThat(updatedUser.getEmail()).isEqualTo("updated@test.com");
        assertThat(updatedUser.getId()).isEqualTo(savedUser.getId());
    }

    @Test
    @DisplayName("Should update user name")
    void shouldUpdateUserName() {
        User savedUser = userRepository.save(testPatient);

        savedUser.setFirstName("UpdatedFirst");
        savedUser.setLastName("UpdatedLast");
        User updatedUser = userRepository.save(savedUser);

        assertThat(updatedUser.getFirstName()).isEqualTo("UpdatedFirst");
        assertThat(updatedUser.getLastName()).isEqualTo("UpdatedLast");
        assertThat(updatedUser.getFullName()).isEqualTo("UpdatedFirst UpdatedLast");
    }

    @Test
    @DisplayName("Should deactivate user")
    void shouldDeactivateUser() {
        User savedUser = userRepository.save(testPatient);

        savedUser.setIsActive(false);
        User updatedUser = userRepository.save(savedUser);

        assertThat(updatedUser.getIsActive()).isFalse();
    }

    @Test
    @DisplayName("Should update user phone number")
    void shouldUpdateUserPhoneNumber() {
        User savedUser = userRepository.save(testPatient);

        savedUser.setPhoneNumber("079-9999-8888");
        User updatedUser = userRepository.save(savedUser);

        assertThat(updatedUser.getPhoneNumber()).isEqualTo("079-9999-8888");
    }

    // ==================== DELETE TESTS ====================

    @Test
    @DisplayName("Should delete user by ID")
    void shouldDeleteUserById() {
        User savedUser = userRepository.save(testPatient);
        Long userId = savedUser.getId();

        userRepository.deleteById(userId);

        Optional<User> deletedUser = userRepository.findById(userId);
        assertThat(deletedUser).isEmpty();
    }

    @Test
    @DisplayName("Should delete user entity")
    void shouldDeleteUserEntity() {
        User savedUser = userRepository.save(testPatient);

        userRepository.delete(savedUser);

        Optional<User> deletedUser = userRepository.findById(savedUser.getId());
        assertThat(deletedUser).isEmpty();
    }

    @Test
    @DisplayName("Should delete all users")
    void shouldDeleteAllUsers() {
        userRepository.save(testPatient);
        userRepository.save(testDoctor);
        userRepository.save(testAdmin);

        userRepository.deleteAll();

        List<User> users = userRepository.findAll();
        assertThat(users).isEmpty();
    }

    // ==================== HELPER METHOD TESTS ====================

    @Test
    @DisplayName("Should return full name correctly")
    void shouldReturnFullName() {
        User savedUser = userRepository.save(testPatient);

        assertThat(savedUser.getFullName()).isEqualTo("John Doe");
    }
}
