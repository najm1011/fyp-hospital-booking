package com.hospitalapp.backend.config;

import com.hospitalapp.backend.model.*;
import com.hospitalapp.backend.repository.*;
import com.hospitalapp.backend.service.HospitalService;
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
    private final HospitalRepository hospitalRepository;
    private final HospitalService hospitalService;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      DoctorRepository doctorRepository,
                      DepartmentRepository departmentRepository,
                      TimeSlotRepository timeSlotRepository,
                      HospitalRepository hospitalRepository,
                      HospitalService hospitalService,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.hospitalRepository = hospitalRepository;
        this.hospitalService = hospitalService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Sync real NHS hospitals from ODS API
        if (hospitalRepository.count() == 0) {
            log.info("No hospitals found — syncing from NHS ODS API...");
            try {
                int synced = hospitalService.syncFromNhs();
                log.info("Synced {} real NHS hospitals from ODS API", synced);
            } catch (Exception e) {
                log.error("Failed to sync NHS hospitals: {}. App will start without hospital data.", e.getMessage());
            }
        } else {
            log.info("{} hospitals already in database — skipping NHS sync.", hospitalRepository.count());
        }

        // Seed departments (required for symptom checker)
        if (departmentRepository.count() == 0) {
            seedDepartments();
        }

        // Create users and doctors if no users exist yet
        if (userRepository.count() == 0) {
            seedAdmin();
            seedDoctors();
            seedPatients();
        }

        log.info("Startup complete. Hospitals: {}, Departments: {}, Doctors: {}, Users: {}",
                hospitalRepository.count(), departmentRepository.count(),
                doctorRepository.count(), userRepository.count());
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

    private void seedDepartments() {
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

        departmentRepository.saveAll(departments);
        log.info("Created {} departments", departments.size());
    }

    private void seedDoctors() {
        // Build department lookup
        Map<String, Department> deptMap = new HashMap<>();
        departmentRepository.findAll().forEach(d -> deptMap.put(d.getName(), d));

        // Build hospital lookup by ODS code
        Map<String, Hospital> hospitalMap = new HashMap<>();
        hospitalRepository.findAll().forEach(h -> {
            if (h.getOdsCode() != null) hospitalMap.put(h.getOdsCode(), h);
        });

        // Curated doctors: {firstName, lastName, email, phone, department, qualification, fee, bio, hospitalOdsCode}
        String[][] doctorData = {
                // === Barts Health NHS Trust (R1H) — Royal London Hospital ===
                {"James", "Harrison", "james.harrison@nhs.net", "02073777001", "Cardiology", "MBBS, MRCP, MD", "150", "Consultant cardiologist specialising in interventional cardiology and heart failure management with 18 years of experience.", "R1H"},
                {"Priya", "Sharma", "priya.sharma@nhs.net", "02073777002", "General Practice", "MBBS, MRCGP", "85", "Senior GP with expertise in chronic disease management and preventive medicine. 12 years in practice.", "R1H"},
                {"David", "Chen", "david.chen@nhs.net", "02073777003", "Neurology", "MBBS, MRCP, PhD", "175", "Consultant neurologist specialising in epilepsy and movement disorders. Published researcher.", "R1H"},
                {"Sarah", "Williams", "sarah.williams@nhs.net", "02073777004", "Dermatology", "MBBS, MRCP(Derm)", "120", "Consultant dermatologist with special interest in skin cancer, psoriasis, and paediatric dermatology.", "R1H"},
                {"Mohammed", "Khan", "mohammed.khan@nhs.net", "02073777005", "Orthopaedics", "MBBS, FRCS(Orth)", "160", "Consultant orthopaedic surgeon specialising in joint replacement and sports injuries.", "R1H"},

                // === Guy's and St Thomas' NHS Foundation Trust (RJ1) ===
                {"Emma", "Thompson", "emma.thompson@nhs.net", "02071887001", "Cardiology", "MBBS, FRCP, MD", "165", "Leading consultant cardiologist with expertise in cardiac imaging and valvular heart disease.", "RJ1"},
                {"Robert", "Patel", "robert.patel@nhs.net", "02071887002", "Paediatrics", "MBBS, FRCPCH", "130", "Consultant paediatrician specialising in neonatal care and childhood respiratory conditions.", "RJ1"},
                {"Catherine", "O'Brien", "catherine.obrien@nhs.net", "02071887003", "Psychiatry", "MBBS, MRCPsych", "140", "Consultant psychiatrist with expertise in anxiety disorders, PTSD, and cognitive behavioural therapy.", "RJ1"},
                {"Amir", "Hassan", "amir.hassan@nhs.net", "02071887004", "General Practice", "MBBS, MRCGP, DRCOG", "90", "Experienced GP with special interest in diabetes management and men's health.", "RJ1"},
                {"Lisa", "Campbell", "lisa.campbell@nhs.net", "02071887005", "Dermatology", "MBBS, FRCP(Derm)", "135", "Consultant dermatologist specialising in eczema, immunodermatology, and laser treatments.", "RJ1"},

                // === King's College Hospital NHS Foundation Trust (RJZ) ===
                {"Michael", "Davies", "michael.davies@nhs.net", "02032990001", "Neurology", "MBBS, FRCP, PhD", "180", "Professor of neurology with 20 years of experience in stroke medicine and neurodegenerative diseases.", "RJZ"},
                {"Fatima", "Ali", "fatima.ali@nhs.net", "02032990002", "General Practice", "MBBS, MRCGP", "80", "Dedicated GP focusing on women's health, family planning, and community medicine.", "RJZ"},
                {"Thomas", "Wright", "thomas.wright@nhs.net", "02032990003", "Orthopaedics", "MBBS, FRCS(Tr&Orth)", "155", "Consultant trauma and orthopaedic surgeon with expertise in spinal surgery.", "RJZ"},
                {"Anita", "Desai", "anita.desai@nhs.net", "02032990004", "Ophthalmology", "MBBS, FRCOphth", "145", "Consultant ophthalmologist specialising in cataract surgery and glaucoma management.", "RJZ"},
                {"George", "Taylor", "george.taylor@nhs.net", "02032990005", "Cardiology", "MBBS, MRCP", "140", "Consultant cardiologist with focus on arrhythmia management and cardiac electrophysiology.", "RJZ"},

                // === University College London Hospitals NHS Foundation Trust (RRV) ===
                {"Sophie", "Anderson", "sophie.anderson@nhs.net", "02034567001", "Neurology", "MBBS, MRCP, DPhil", "185", "Leading consultant neurologist specialising in multiple sclerosis and neuroimmunology research.", "RRV"},
                {"Richard", "Brown", "richard.brown@nhs.net", "02034567002", "Cardiology", "MBBS, FRCP, MD", "170", "Professor of cardiovascular medicine with expertise in preventive cardiology and lipid disorders.", "RRV"},
                {"Zara", "Malik", "zara.malik@nhs.net", "02034567003", "Paediatrics", "MBBS, MRCPCH, MSc", "125", "Consultant paediatrician specialising in paediatric endocrinology and growth disorders.", "RRV"},
                {"Andrew", "MacLeod", "andrew.macleod@nhs.net", "02034567004", "Psychiatry", "MBBS, FRCPsych, PhD", "155", "Professor of psychiatry with research focus on schizophrenia and psychopharmacology.", "RRV"},
                {"Helen", "Clarke", "helen.clarke@nhs.net", "02034567005", "General Practice", "MBBS, MRCGP, DCH", "85", "Senior GP with 15 years of experience in elderly care and palliative medicine.", "RRV"},

                // === Imperial College Healthcare NHS Trust (RYJ) ===
                {"Daniel", "Evans", "daniel.evans@nhs.net", "02033127001", "Orthopaedics", "MBBS, FRCS(Orth), PhD", "175", "Professor of orthopaedic surgery and leading researcher in cartilage regeneration.", "RYJ"},
                {"Olivia", "Hughes", "olivia.hughes@nhs.net", "02033127002", "Dermatology", "MBBS, MRCP(Derm), PhD", "140", "Consultant dermatologist with expertise in melanoma, Mohs surgery, and dermatopathology.", "RYJ"},
                {"Raj", "Gupta", "raj.gupta@nhs.net", "02033127003", "Cardiology", "MBBS, MRCP, DM", "160", "Consultant cardiologist specialising in coronary intervention and structural heart disease.", "RYJ"},
                {"Victoria", "Scott", "victoria.scott@nhs.net", "02033127004", "Paediatrics", "MBBS, FRCPCH", "130", "Consultant paediatrician with expertise in paediatric allergy and immunology.", "RYJ"},
                {"Mark", "Robinson", "mark.robinson@nhs.net", "02033127005", "General Practice", "MBBS, MRCGP", "80", "Experienced GP specialising in mental health in primary care and health promotion.", "RYJ"},

                // === Royal Free London NHS Foundation Trust (RAL) ===
                {"Charlotte", "Walker", "charlotte.walker@nhs.net", "02077941001", "Neurology", "MBBS, MRCP, MD", "165", "Consultant neurologist with special interest in headache disorders and chronic pain.", "RAL"},
                {"Nadia", "Ahmed", "nadia.ahmed@nhs.net", "02077941002", "Ophthalmology", "MBBS, FRCOphth, PhD", "150", "Consultant ophthalmic surgeon specialising in retinal diseases and macular degeneration.", "RAL"},
                {"Jonathan", "Mitchell", "jonathan.mitchell@nhs.net", "02077941003", "Psychiatry", "MBBS, MRCPsych", "135", "Consultant psychiatrist specialising in eating disorders and adolescent mental health.", "RAL"},

                // === Chelsea and Westminster Hospital NHS Foundation Trust (RQM) ===
                {"Elizabeth", "Cooper", "elizabeth.cooper@nhs.net", "02033158001", "Dermatology", "MBBS, FRCP(Derm)", "130", "Consultant dermatologist with expertise in acne, rosacea, and cosmetic dermatology.", "RQM"},
                {"Oliver", "Bennett", "oliver.bennett@nhs.net", "02033158002", "General Practice", "MBBS, MRCGP, DFSRH", "85", "Senior GP with special interest in sexual health and travel medicine.", "RQM"},
                {"Amara", "Okafor", "amara.okafor@nhs.net", "02033158003", "Paediatrics", "MBBS, MRCPCH", "120", "Consultant paediatrician focusing on paediatric infectious diseases and vaccination.", "RQM"},

                // === Moorfields Eye Hospital NHS Foundation Trust (RP6) ===
                {"William", "Foster", "william.foster@nhs.net", "02072533411", "Ophthalmology", "MBBS, FRCOphth, FRCS", "190", "Leading consultant ophthalmic surgeon with world-renowned expertise in corneal transplantation.", "RP6"},
                {"Jasmine", "Kaur", "jasmine.kaur@nhs.net", "02072533412", "Ophthalmology", "MBBS, FRCOphth, PhD", "175", "Consultant ophthalmologist specialising in paediatric ophthalmology and strabismus surgery.", "RP6"},

                // === Great Ormond Street Hospital (RP4) ===
                {"Emily", "Morgan", "emily.morgan@nhs.net", "02074059200", "Paediatrics", "MBBS, FRCPCH, PhD", "165", "Professor of paediatric medicine with expertise in rare childhood diseases and gene therapy.", "RP4"},
                {"Kwame", "Mensah", "kwame.mensah@nhs.net", "02074059201", "Paediatrics", "MBBS, MRCPCH, MSc", "140", "Consultant paediatrician specialising in paediatric cardiology and congenital heart defects.", "RP4"},

                // === South London and Maudsley NHS Foundation Trust (RV5) ===
                {"Rachel", "Green", "rachel.green@nhs.net", "02032286001", "Psychiatry", "MBBS, FRCPsych, MD", "160", "Professor of psychiatry with 22 years of experience in mood disorders and bipolar treatment.", "RV5"},
                {"Samuel", "Osei", "samuel.osei@nhs.net", "02032286002", "Psychiatry", "MBBS, MRCPsych, MSc", "135", "Consultant psychiatrist specialising in addiction psychiatry and dual diagnosis.", "RV5"},

                // === Leeds Teaching Hospitals NHS Trust (RR8) ===
                {"Hannah", "Richardson", "hannah.richardson@nhs.net", "01132433144", "Cardiology", "MBBS, MRCP, MD", "145", "Consultant cardiologist specialising in cardiac MRI and heart failure.", "RR8"},
                {"Patrick", "O'Connor", "patrick.oconnor@nhs.net", "01132433145", "Orthopaedics", "MBBS, FRCS(Tr&Orth)", "150", "Consultant orthopaedic surgeon with expertise in hip and knee replacement.", "RR8"},

                // === Oxford University Hospitals NHS Foundation Trust (RTH) ===
                {"Isabella", "Price", "isabella.price@nhs.net", "01865741166", "Neurology", "MBBS, FRCP, DPhil", "180", "Professor of clinical neurology specialising in dementia research and Alzheimer's disease.", "RTH"},
                {"Alexander", "Murray", "alexander.murray@nhs.net", "01865741167", "General Practice", "MBBS, MRCGP, MSc", "90", "Academic GP with research interest in evidence-based medicine and clinical trials.", "RTH"},

                // === Manchester University NHS Foundation Trust (R0A) ===
                {"Lucy", "Ward", "lucy.ward@nhs.net", "01612764147", "Dermatology", "MBBS, MRCP(Derm)", "125", "Consultant dermatologist with special interest in autoimmune skin conditions and biologics.", "R0A"},
                {"Benjamin", "Shaw", "benjamin.shaw@nhs.net", "01612764148", "Orthopaedics", "MBBS, FRCS(Orth)", "155", "Consultant orthopaedic surgeon specialising in shoulder surgery and sports medicine.", "R0A"},

                // === Sheffield Teaching Hospitals NHS Foundation Trust (RHQ) ===
                {"Claire", "Barton", "claire.barton@nhs.net", "01142712001", "General Practice", "MBBS, MRCGP", "85", "Senior GP with special interest in respiratory medicine and COPD management.", "RHQ"},
                {"Dominic", "Reeves", "dominic.reeves@nhs.net", "01142712002", "Cardiology", "MBBS, MRCP, MD", "155", "Consultant cardiologist with expertise in heart failure and cardiac rehabilitation.", "RHQ"},

                // === Cambridge University Hospitals NHS Foundation Trust (RGT) ===
                {"Fiona", "Mackenzie", "fiona.mackenzie@nhs.net", "01223245151", "Neurology", "MBBS, FRCP, PhD", "185", "Professor of neurology with world-leading research in motor neurone disease.", "RGT"},
                {"Alistair", "Kerr", "alistair.kerr@nhs.net", "01223245152", "Ophthalmology", "MBBS, FRCOphth", "150", "Consultant ophthalmologist specialising in diabetic retinopathy and vitreoretinal surgery.", "RGT"},

                // === University Hospitals Bristol and Weston NHS Foundation Trust (RA7) ===
                {"Megan", "Howe", "megan.howe@nhs.net", "01173423001", "Paediatrics", "MBBS, FRCPCH", "135", "Consultant paediatrician specialising in paediatric neurology and developmental disorders.", "RA7"},
                {"Neil", "Chambers", "neil.chambers@nhs.net", "01173423002", "Psychiatry", "MBBS, MRCPsych, MSc", "140", "Consultant psychiatrist with expertise in trauma-focused therapy and veteran mental health.", "RA7"},

                // === The Newcastle Upon Tyne Hospitals NHS Foundation Trust (RTD) ===
                {"Karen", "Robson", "karen.robson@nhs.net", "01912336161", "Dermatology", "MBBS, MRCP(Derm)", "130", "Consultant dermatologist specialising in paediatric dermatology and genetic skin conditions.", "RTD"},
                {"Stuart", "Fleming", "stuart.fleming@nhs.net", "01912336162", "Orthopaedics", "MBBS, FRCS(Tr&Orth)", "160", "Consultant orthopaedic surgeon with expertise in complex revision joint surgery.", "RTD"},

                // === Nottingham University Hospitals NHS Trust (RX1) ===
                {"Grace", "Hartley", "grace.hartley@nhs.net", "01159691169", "General Practice", "MBBS, MRCGP, DCH", "80", "Senior GP with special interest in paediatric primary care and childhood immunisations.", "RX1"},
        };

        int created = 0;
        int skippedNoHospital = 0;

        for (String[] d : doctorData) {
            String odsCode = d[8];
            Hospital hospital = hospitalMap.get(odsCode);
            if (hospital == null) {
                skippedNoHospital++;
                continue;
            }

            Department dept = deptMap.get(d[4]);
            if (dept == null) {
                log.warn("Department '{}' not found, skipping doctor {}", d[4], d[1]);
                continue;
            }

            // Create user account
            User user = new User(d[2], passwordEncoder.encode("Doctor123!"), d[0], d[1], User.Role.DOCTOR);
            user.setPhoneNumber(d[3]);
            user = userRepository.save(user);

            // Create doctor profile
            Doctor doctor = new Doctor(user, dept, dept.getName(), new BigDecimal(d[6]));
            doctor.setQualifications(d[5]);
            doctor.setBio(d[7]);
            doctor.setHospital(hospital);
            doctor = doctorRepository.save(doctor);

            // Create time slots (Mon–Fri, 9am–5pm, 30-min slots)
            createTimeSlotsForDoctor(doctor);
            created++;
        }

        log.info("Created {} doctors across real NHS hospitals (skipped {} — hospital not found)", created, skippedNoHospital);
    }

    private void createTimeSlotsForDoctor(Doctor doctor) {
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
        // Curated test patients for demo purposes
        String[][] patientData = {
                {"John", "Smith", "john.smith@mail.com", "07911123456"},
                {"Emma", "Johnson", "emma.johnson@mail.com", "07922234567"},
                {"Tariq", "Rahman", "tariq.rahman@mail.com", "07933345678"},
                {"Grace", "Kelly", "grace.kelly@mail.com", "07944456789"},
                {"Liam", "Murphy", "liam.murphy@mail.com", "07955567890"},
        };

        for (String[] p : patientData) {
            User patient = new User(p[2], passwordEncoder.encode("Patient123!"), p[0], p[1], User.Role.PATIENT);
            patient.setPhoneNumber(p[3]);
            userRepository.save(patient);
        }
        log.info("Created {} test patients", patientData.length);
    }
}
