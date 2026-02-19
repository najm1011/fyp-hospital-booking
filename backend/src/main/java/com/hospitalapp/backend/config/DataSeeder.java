package com.hospitalapp.backend.config;

import com.github.javafaker.Faker;
import com.hospitalapp.backend.model.*;
import com.hospitalapp.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final PasswordEncoder passwordEncoder;
    private final Faker faker = new Faker(new Locale("en-GB"));

    public DataSeeder(UserRepository userRepository,
                      DoctorRepository doctorRepository,
                      DepartmentRepository departmentRepository,
                      TimeSlotRepository timeSlotRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded — skipping.");
            return;
        }

        log.info("Seeding database...");
        seedAdmin();
        List<Department> departments = seedDepartments();
        seedDoctors(departments);
        seedPatients();
        log.info("Seeding complete!");
    }

    private void seedAdmin() {
        User admin = new User(
                "admin@medibook.com",
                passwordEncoder.encode("Admin123!"),
                "Admin",
                "User",
                User.Role.ADMIN
        );
        admin.setPhoneNumber("07700000000");
        userRepository.save(admin);
        log.info("Created admin: admin@medibook.com / Admin123!");
    }

    private List<Department> seedDepartments() {
        String[][] deptData = {
                {"General Practice", "Primary care and general health consultations"},
                {"Cardiology", "Heart and cardiovascular system"},
                {"Dermatology", "Skin conditions and treatments"},
                {"Orthopaedics", "Bones, joints, and musculoskeletal system"},
                {"Paediatrics", "Medical care for infants and children"},
                {"Neurology", "Brain and nervous system disorders"},
                {"Ophthalmology", "Eye care and vision"},
                {"Psychiatry", "Mental health and behavioural disorders"}
        };

        List<Department> departments = new ArrayList<>();
        for (String[] d : deptData) {
            Department dept = new Department();
            dept.setName(d[0]);
            dept.setDescription(d[1]);
            departments.add(dept);
        }

        List<Department> saved = departmentRepository.saveAll(departments);
        log.info("Created {} departments", saved.size());
        return saved;
    }

    private void seedDoctors(List<Department> departments) {
        String[] qualifications = {
                "MBBS, MRCP", "MBBS, FRCS", "MBBS, MD, FRCP",
                "MBBS, MRCGP", "MBBS, FRCOphth", "MBBS, MRCPsych",
                "MBBS, FRCA", "MBBS, PhD"
        };

        int count = 0;
        for (Department dept : departments) {
            int numDoctors = faker.number().numberBetween(3, 5);

            for (int i = 0; i < numDoctors; i++) {
                String firstName = faker.name().firstName();
                String lastName = faker.name().lastName();
                String email = (firstName + "." + lastName + "@medibook.com")
                        .toLowerCase().replaceAll("[^a-z.@]", "");

                // Create User with DOCTOR role
                User user = new User(
                        email,
                        passwordEncoder.encode("Doctor123!"),
                        firstName,
                        lastName,
                        User.Role.DOCTOR
                );
                user.setPhoneNumber("07" + faker.number().digits(9));
                user = userRepository.save(user);

                // Create Doctor profile
                int yearsExp = faker.number().numberBetween(3, 25);
                Doctor doctor = new Doctor(
                        user,
                        dept,
                        dept.getName(),
                        BigDecimal.valueOf(faker.number().numberBetween(50, 200))
                );
                doctor.setQualifications(
                        qualifications[faker.number().numberBetween(0, qualifications.length)]
                );
                doctor.setBio("Dr. " + lastName + " is a dedicated " +
                        dept.getName().toLowerCase() + " specialist with " +
                        yearsExp + " years of experience.");
                doctor = doctorRepository.save(doctor);

                // Create TimeSlots (Mon–Fri, 9am–5pm, 30-min slots)
                seedTimeSlotsForDoctor(doctor);
                count++;
            }
        }
        log.info("Created {} doctors with time slots", count);
    }

    private void seedTimeSlotsForDoctor(Doctor doctor) {
        List<TimeSlot> slots = new ArrayList<>();
        DayOfWeek[] workDays = {
                DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY
        };

        for (DayOfWeek day : workDays) {
            LocalTime time = LocalTime.of(9, 0);
            while (time.isBefore(LocalTime.of(17, 0))) {
                slots.add(new TimeSlot(doctor, day, time, time.plusMinutes(30)));
                time = time.plusMinutes(30);
            }
        }
        timeSlotRepository.saveAll(slots);
    }

    private void seedPatients() {
        for (int i = 0; i < 20; i++) {
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String email = (firstName + "." + lastName + "@mail.com")
                    .toLowerCase().replaceAll("[^a-z.@]", "");

            User patient = new User(
                    email,
                    passwordEncoder.encode("Patient123!"),
                    firstName,
                    lastName,
                    User.Role.PATIENT
            );
            patient.setPhoneNumber("07" + faker.number().digits(9));
            userRepository.save(patient);
        }
        log.info("Created 20 patients");
    }
}