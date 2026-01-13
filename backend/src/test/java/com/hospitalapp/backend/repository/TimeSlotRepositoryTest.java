package com.hospitalapp.backend.repository;

import com.hospitalapp.backend.model.Department;
import com.hospitalapp.backend.model.Doctor;
import com.hospitalapp.backend.model.TimeSlot;
import com.hospitalapp.backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("TimeSlot Repository CRUD Tests")
class TimeSlotRepositoryTest {

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private Doctor doctor;
    private TimeSlot mondayMorningSlot;
    private TimeSlot mondayAfternoonSlot;
    private TimeSlot tuesdaySlot;

    @BeforeEach
    void setUp() {
        timeSlotRepository.deleteAll();
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

        // Create time slots
        mondayMorningSlot = new TimeSlot();
        mondayMorningSlot.setDoctor(doctor);
        mondayMorningSlot.setDayOfWeek(DayOfWeek.MONDAY);
        mondayMorningSlot.setStartTime(LocalTime.of(9, 0));
        mondayMorningSlot.setEndTime(LocalTime.of(9, 30));
        mondayMorningSlot.setIsAvailable(true);

        mondayAfternoonSlot = new TimeSlot();
        mondayAfternoonSlot.setDoctor(doctor);
        mondayAfternoonSlot.setDayOfWeek(DayOfWeek.MONDAY);
        mondayAfternoonSlot.setStartTime(LocalTime.of(14, 0));
        mondayAfternoonSlot.setEndTime(LocalTime.of(14, 30));
        mondayAfternoonSlot.setIsAvailable(true);

        tuesdaySlot = new TimeSlot();
        tuesdaySlot.setDoctor(doctor);
        tuesdaySlot.setDayOfWeek(DayOfWeek.TUESDAY);
        tuesdaySlot.setStartTime(LocalTime.of(10, 0));
        tuesdaySlot.setEndTime(LocalTime.of(10, 30));
        tuesdaySlot.setIsAvailable(true);
    }

    // ==================== CREATE TESTS ====================

    @Test
    @DisplayName("Should create a new time slot")
    void shouldCreateTimeSlot() {
        TimeSlot saved = timeSlotRepository.save(mondayMorningSlot);

        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
        assertThat(saved.getStartTime()).isEqualTo(LocalTime.of(9, 0));
        assertThat(saved.getEndTime()).isEqualTo(LocalTime.of(9, 30));
        assertThat(saved.getIsAvailable()).isTrue();
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should create time slot with doctor relationship")
    void shouldCreateTimeSlotWithDoctorRelationship() {
        TimeSlot saved = timeSlotRepository.save(mondayMorningSlot);

        assertThat(saved.getDoctor()).isNotNull();
        assertThat(saved.getDoctor().getId()).isEqualTo(doctor.getId());
    }

    @Test
    @DisplayName("Should create multiple time slots for same doctor")
    void shouldCreateMultipleTimeSlotsForSameDoctor() {
        timeSlotRepository.save(mondayMorningSlot);
        timeSlotRepository.save(mondayAfternoonSlot);
        timeSlotRepository.save(tuesdaySlot);

        List<TimeSlot> slots = timeSlotRepository.findByDoctorId(doctor.getId());

        assertThat(slots).hasSize(3);
    }

    // ==================== READ TESTS ====================

    @Test
    @DisplayName("Should find time slot by ID")
    void shouldFindTimeSlotById() {
        TimeSlot saved = timeSlotRepository.save(mondayMorningSlot);

        Optional<TimeSlot> found = timeSlotRepository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
    }

    @Test
    @DisplayName("Should find time slots by doctor ID")
    void shouldFindTimeSlotsByDoctorId() {
        timeSlotRepository.save(mondayMorningSlot);
        timeSlotRepository.save(mondayAfternoonSlot);

        List<TimeSlot> slots = timeSlotRepository.findByDoctorId(doctor.getId());

        assertThat(slots).hasSize(2);
    }

    @Test
    @DisplayName("Should find available time slots by doctor ID")
    void shouldFindAvailableTimeSlotsByDoctorId() {
        mondayMorningSlot.setIsAvailable(true);
        mondayAfternoonSlot.setIsAvailable(false);
        timeSlotRepository.save(mondayMorningSlot);
        timeSlotRepository.save(mondayAfternoonSlot);

        List<TimeSlot> available = timeSlotRepository.findByDoctorIdAndIsAvailable(doctor.getId(), true);
        List<TimeSlot> unavailable = timeSlotRepository.findByDoctorIdAndIsAvailable(doctor.getId(), false);

        assertThat(available).hasSize(1);
        assertThat(unavailable).hasSize(1);
    }

    @Test
    @DisplayName("Should find time slots by doctor and day of week")
    void shouldFindTimeSlotsByDoctorAndDayOfWeek() {
        timeSlotRepository.save(mondayMorningSlot);
        timeSlotRepository.save(mondayAfternoonSlot);
        timeSlotRepository.save(tuesdaySlot);

        List<TimeSlot> mondaySlots = timeSlotRepository.findByDoctorIdAndDayOfWeek(doctor.getId(), DayOfWeek.MONDAY);
        List<TimeSlot> tuesdaySlots = timeSlotRepository.findByDoctorIdAndDayOfWeek(doctor.getId(), DayOfWeek.TUESDAY);

        assertThat(mondaySlots).hasSize(2);
        assertThat(tuesdaySlots).hasSize(1);
    }

    @Test
    @DisplayName("Should find available slots by doctor and day")
    void shouldFindAvailableSlotsByDoctorAndDay() {
        mondayMorningSlot.setIsAvailable(true);
        mondayAfternoonSlot.setIsAvailable(false);
        timeSlotRepository.save(mondayMorningSlot);
        timeSlotRepository.save(mondayAfternoonSlot);

        List<TimeSlot> available = timeSlotRepository.findAvailableSlotsByDoctorAndDay(doctor.getId(), DayOfWeek.MONDAY);

        assertThat(available).hasSize(1);
        assertThat(available.get(0).getStartTime()).isEqualTo(LocalTime.of(9, 0));
    }

    @Test
    @DisplayName("Should find time slot by doctor, day and time")
    void shouldFindTimeSlotByDoctorDayAndTime() {
        timeSlotRepository.save(mondayMorningSlot);

        Optional<TimeSlot> found = timeSlotRepository.findByDoctorAndDayAndTime(
            doctor.getId(),
            DayOfWeek.MONDAY,
            LocalTime.of(9, 0),
            LocalTime.of(9, 30)
        );

        assertThat(found).isPresent();
    }

    @Test
    @DisplayName("Should find time slots ordered by day and time")
    void shouldFindTimeSlotsOrderedByDayAndTime() {
        timeSlotRepository.save(tuesdaySlot);
        timeSlotRepository.save(mondayAfternoonSlot);
        timeSlotRepository.save(mondayMorningSlot);

        List<TimeSlot> slots = timeSlotRepository.findByDoctorIdOrderedByDayAndTime(doctor.getId());

        assertThat(slots).hasSize(3);
        assertThat(slots.get(0).getDayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
        assertThat(slots.get(0).getStartTime()).isEqualTo(LocalTime.of(9, 0));
    }

    @Test
    @DisplayName("Should count available slots for doctor")
    void shouldCountAvailableSlotsForDoctor() {
        mondayMorningSlot.setIsAvailable(true);
        mondayAfternoonSlot.setIsAvailable(true);
        tuesdaySlot.setIsAvailable(false);
        timeSlotRepository.save(mondayMorningSlot);
        timeSlotRepository.save(mondayAfternoonSlot);
        timeSlotRepository.save(tuesdaySlot);

        long count = timeSlotRepository.countAvailableSlots(doctor.getId());

        assertThat(count).isEqualTo(2);
    }

    @Test
    @DisplayName("Should check if time slot exists")
    void shouldCheckIfTimeSlotExists() {
        timeSlotRepository.save(mondayMorningSlot);

        boolean exists = timeSlotRepository.existsByDoctorIdAndDayOfWeekAndStartTimeAndEndTime(
            doctor.getId(),
            DayOfWeek.MONDAY,
            LocalTime.of(9, 0),
            LocalTime.of(9, 30)
        );

        boolean notExists = timeSlotRepository.existsByDoctorIdAndDayOfWeekAndStartTimeAndEndTime(
            doctor.getId(),
            DayOfWeek.FRIDAY,
            LocalTime.of(9, 0),
            LocalTime.of(9, 30)
        );

        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    // ==================== UPDATE TESTS ====================

    @Test
    @DisplayName("Should update time slot availability")
    void shouldUpdateTimeSlotAvailability() {
        TimeSlot saved = timeSlotRepository.save(mondayMorningSlot);

        saved.setIsAvailable(false);
        TimeSlot updated = timeSlotRepository.save(saved);

        assertThat(updated.getIsAvailable()).isFalse();
        assertThat(updated.getId()).isEqualTo(saved.getId());
    }

    @Test
    @DisplayName("Should update time slot times")
    void shouldUpdateTimeSlotTimes() {
        TimeSlot saved = timeSlotRepository.save(mondayMorningSlot);

        saved.setStartTime(LocalTime.of(10, 0));
        saved.setEndTime(LocalTime.of(10, 30));
        TimeSlot updated = timeSlotRepository.save(saved);

        assertThat(updated.getStartTime()).isEqualTo(LocalTime.of(10, 0));
        assertThat(updated.getEndTime()).isEqualTo(LocalTime.of(10, 30));
    }

    @Test
    @DisplayName("Should update time slot day of week")
    void shouldUpdateTimeSlotDayOfWeek() {
        TimeSlot saved = timeSlotRepository.save(mondayMorningSlot);

        saved.setDayOfWeek(DayOfWeek.WEDNESDAY);
        TimeSlot updated = timeSlotRepository.save(saved);

        assertThat(updated.getDayOfWeek()).isEqualTo(DayOfWeek.WEDNESDAY);
    }

    // ==================== DELETE TESTS ====================

    @Test
    @DisplayName("Should delete time slot by ID")
    void shouldDeleteTimeSlotById() {
        TimeSlot saved = timeSlotRepository.save(mondayMorningSlot);
        Long id = saved.getId();

        timeSlotRepository.deleteById(id);

        Optional<TimeSlot> deleted = timeSlotRepository.findById(id);
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("Should delete time slot entity")
    void shouldDeleteTimeSlotEntity() {
        TimeSlot saved = timeSlotRepository.save(mondayMorningSlot);

        timeSlotRepository.delete(saved);

        Optional<TimeSlot> deleted = timeSlotRepository.findById(saved.getId());
        assertThat(deleted).isEmpty();
    }

    @Test
    @DisplayName("Should delete all time slots")
    void shouldDeleteAllTimeSlots() {
        timeSlotRepository.save(mondayMorningSlot);
        timeSlotRepository.save(mondayAfternoonSlot);
        timeSlotRepository.save(tuesdaySlot);

        timeSlotRepository.deleteAll();

        List<TimeSlot> slots = timeSlotRepository.findAll();
        assertThat(slots).isEmpty();
    }
}
