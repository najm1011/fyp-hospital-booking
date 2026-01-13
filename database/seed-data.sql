-- =============================================================================
-- Hospital Booking System - Seed Data for Testing
-- =============================================================================
-- Project: Hospital Appointment Booking System
-- Student: Najm (2356070)
-- Purpose: Sample data for development and testing
-- =============================================================================

USE hospital_booking;

-- =============================================================================
-- SAMPLE USERS (Patients)
-- =============================================================================
-- All passwords: Patient123!
-- BCrypt hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu
-- =============================================================================

INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_active) VALUES
('sarah.chen@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Sarah', 'Chen', '+44 7700 900001', 'PATIENT', TRUE),
('james.wilson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'James', 'Wilson', '+44 7700 900002', 'PATIENT', TRUE),
('maria.garcia@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Maria', 'Garcia', '+44 7700 900003', 'PATIENT', TRUE),
('robert.taylor@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Robert', 'Taylor', '+44 7700 900004', 'PATIENT', TRUE),
('linda.anderson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Linda', 'Anderson', '+44 7700 900005', 'PATIENT', TRUE),
('david.lee@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'David', 'Lee', '+44 7700 900006', 'PATIENT', TRUE),
('emma.brown@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Emma', 'Brown', '+44 7700 900007', 'PATIENT', TRUE),
('michael.davis@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Michael', 'Davis', '+44 7700 900008', 'PATIENT', TRUE),
('sophia.martinez@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Sophia', 'Martinez', '+44 7700 900009', 'PATIENT', TRUE),
('william.johnson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'William', 'Johnson', '+44 7700 900010', 'PATIENT', TRUE);

-- =============================================================================
-- SAMPLE USERS (Doctors)
-- =============================================================================
-- All passwords: Doctor123!
-- BCrypt hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu
-- =============================================================================

INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_active) VALUES
('dr.emily.thompson@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Emily', 'Thompson', '+44 20 7123 4501', 'DOCTOR', TRUE),
('dr.michael.chang@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Michael', 'Chang', '+44 20 7123 4502', 'DOCTOR', TRUE),
('dr.rachel.patel@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Rachel', 'Patel', '+44 20 7123 4503', 'DOCTOR', TRUE),
('dr.john.smith@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'John', 'Smith', '+44 20 7123 4504', 'DOCTOR', TRUE),
('dr.amanda.white@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Amanda', 'White', '+44 20 7123 4505', 'DOCTOR', TRUE),
('dr.kevin.rodriguez@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Kevin', 'Rodriguez', '+44 20 7123 4506', 'DOCTOR', TRUE),
('dr.lisa.nguyen@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Lisa', 'Nguyen', '+44 20 7123 4507', 'DOCTOR', TRUE),
('dr.thomas.miller@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Thomas', 'Miller', '+44 20 7123 4508', 'DOCTOR', TRUE),
('dr.jennifer.harris@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Jennifer', 'Harris', '+44 20 7123 4509', 'DOCTOR', TRUE),
('dr.christopher.kim@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'Christopher', 'Kim', '+44 20 7123 4510', 'DOCTOR', TRUE);

-- =============================================================================
-- DOCTOR PROFILES
-- =============================================================================

INSERT INTO doctors (user_id, department_id, specialty, qualifications, bio, consultation_fee) VALUES
-- Cardiology (Department ID: 1)
(11, 1, 'General Cardiology', 'MD, MBBS, MRCP', 'Dr. Thompson specializes in general cardiology with over 15 years of experience in cardiovascular disease management and preventive care.', 150.00),
(12, 1, 'Interventional Cardiology', 'MD, MRCP, FESC', 'Dr. Chang is an expert in interventional cardiology procedures including angioplasty and stent placement.', 180.00),

-- Dermatology (Department ID: 2)
(13, 2, 'Medical Dermatology', 'MBBS, MD (Derm), FAAD', 'Dr. Patel focuses on medical dermatology, treating conditions like eczema, psoriasis, and acne with evidence-based approaches.', 120.00),
(14, 2, 'Cosmetic Dermatology', 'MBBS, MD (Derm)', 'Dr. Smith specializes in cosmetic dermatology procedures including Botox, fillers, and laser treatments.', 140.00),

-- General Practice (Department ID: 3)
(15, 3, 'Family Medicine', 'MBBS, MRCGP', 'Dr. White is a family medicine specialist providing comprehensive primary care for patients of all ages.', 80.00),
(16, 3, 'Internal Medicine', 'MD, MRCP', 'Dr. Rodriguez specializes in internal medicine with expertise in managing chronic diseases.', 90.00),

-- Orthopedics (Department ID: 4)
(17, 4, 'Sports Medicine', 'MBBS, MS (Ortho)', 'Dr. Nguyen focuses on sports injuries and musculoskeletal conditions affecting athletes and active individuals.', 160.00),
(18, 4, 'Joint Replacement', 'MBBS, MS (Ortho), FRCS', 'Dr. Miller is an expert in joint replacement surgery with over 20 years of experience.', 200.00),

-- Pediatrics (Department ID: 5)
(19, 5, 'General Pediatrics', 'MBBS, MD (Paeds), MRCPCH', 'Dr. Harris provides comprehensive care for children from infancy through adolescence.', 100.00),
(20, 5, 'Pediatric Cardiology', 'MD (Paeds), DM (Card)', 'Dr. Kim specializes in pediatric cardiology, treating heart conditions in children.', 170.00);

-- =============================================================================
-- DOCTOR TIME SLOTS (Availability Schedules)
-- =============================================================================

-- Dr. Emily Thompson (Cardiology) - Monday to Friday, 9 AM - 5 PM
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(1, 'MONDAY', '09:00:00', '12:00:00', TRUE),
(1, 'MONDAY', '13:00:00', '17:00:00', TRUE),
(1, 'TUESDAY', '09:00:00', '12:00:00', TRUE),
(1, 'TUESDAY', '13:00:00', '17:00:00', TRUE),
(1, 'WEDNESDAY', '09:00:00', '12:00:00', TRUE),
(1, 'WEDNESDAY', '13:00:00', '17:00:00', TRUE),
(1, 'THURSDAY', '09:00:00', '12:00:00', TRUE),
(1, 'THURSDAY', '13:00:00', '17:00:00', TRUE),
(1, 'FRIDAY', '09:00:00', '12:00:00', TRUE),
(1, 'FRIDAY', '13:00:00', '17:00:00', TRUE);

-- Dr. Michael Chang (Cardiology) - Monday, Wednesday, Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(2, 'MONDAY', '10:00:00', '13:00:00', TRUE),
(2, 'MONDAY', '14:00:00', '18:00:00', TRUE),
(2, 'WEDNESDAY', '10:00:00', '13:00:00', TRUE),
(2, 'WEDNESDAY', '14:00:00', '18:00:00', TRUE),
(2, 'FRIDAY', '10:00:00', '13:00:00', TRUE),
(2, 'FRIDAY', '14:00:00', '18:00:00', TRUE);

-- Dr. Rachel Patel (Dermatology) - Tuesday to Saturday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(3, 'TUESDAY', '09:00:00', '12:00:00', TRUE),
(3, 'TUESDAY', '14:00:00', '17:00:00', TRUE),
(3, 'WEDNESDAY', '09:00:00', '12:00:00', TRUE),
(3, 'WEDNESDAY', '14:00:00', '17:00:00', TRUE),
(3, 'THURSDAY', '09:00:00', '12:00:00', TRUE),
(3, 'THURSDAY', '14:00:00', '17:00:00', TRUE),
(3, 'FRIDAY', '09:00:00', '12:00:00', TRUE),
(3, 'FRIDAY', '14:00:00', '17:00:00', TRUE),
(3, 'SATURDAY', '09:00:00', '13:00:00', TRUE);

-- Dr. John Smith (Dermatology) - Monday to Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(4, 'MONDAY', '08:00:00', '11:00:00', TRUE),
(4, 'MONDAY', '12:00:00', '16:00:00', TRUE),
(4, 'TUESDAY', '08:00:00', '11:00:00', TRUE),
(4, 'TUESDAY', '12:00:00', '16:00:00', TRUE),
(4, 'WEDNESDAY', '08:00:00', '11:00:00', TRUE),
(4, 'WEDNESDAY', '12:00:00', '16:00:00', TRUE),
(4, 'THURSDAY', '08:00:00', '11:00:00', TRUE),
(4, 'THURSDAY', '12:00:00', '16:00:00', TRUE),
(4, 'FRIDAY', '08:00:00', '11:00:00', TRUE),
(4, 'FRIDAY', '12:00:00', '16:00:00', TRUE);

-- Dr. Amanda White (General Practice) - All weekdays
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(5, 'MONDAY', '08:00:00', '12:00:00', TRUE),
(5, 'MONDAY', '13:00:00', '18:00:00', TRUE),
(5, 'TUESDAY', '08:00:00', '12:00:00', TRUE),
(5, 'TUESDAY', '13:00:00', '18:00:00', TRUE),
(5, 'WEDNESDAY', '08:00:00', '12:00:00', TRUE),
(5, 'WEDNESDAY', '13:00:00', '18:00:00', TRUE),
(5, 'THURSDAY', '08:00:00', '12:00:00', TRUE),
(5, 'THURSDAY', '13:00:00', '18:00:00', TRUE),
(5, 'FRIDAY', '08:00:00', '12:00:00', TRUE),
(5, 'FRIDAY', '13:00:00', '18:00:00', TRUE);

-- Additional doctors with similar patterns (6-10)
-- Dr. Kevin Rodriguez (General Practice)
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(6, 'MONDAY', '09:00:00', '17:00:00', TRUE),
(6, 'TUESDAY', '09:00:00', '17:00:00', TRUE),
(6, 'WEDNESDAY', '09:00:00', '17:00:00', TRUE),
(6, 'THURSDAY', '09:00:00', '17:00:00', TRUE),
(6, 'FRIDAY', '09:00:00', '17:00:00', TRUE);

-- Dr. Lisa Nguyen (Orthopedics)
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(7, 'MONDAY', '10:00:00', '16:00:00', TRUE),
(7, 'WEDNESDAY', '10:00:00', '16:00:00', TRUE),
(7, 'FRIDAY', '10:00:00', '16:00:00', TRUE);

-- Dr. Thomas Miller (Orthopedics)
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(8, 'TUESDAY', '08:00:00', '14:00:00', TRUE),
(8, 'THURSDAY', '08:00:00', '14:00:00', TRUE),
(8, 'SATURDAY', '09:00:00', '13:00:00', TRUE);

-- Dr. Jennifer Harris (Pediatrics)
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(9, 'MONDAY', '09:00:00', '17:00:00', TRUE),
(9, 'TUESDAY', '09:00:00', '17:00:00', TRUE),
(9, 'WEDNESDAY', '09:00:00', '17:00:00', TRUE),
(9, 'THURSDAY', '09:00:00', '17:00:00', TRUE),
(9, 'FRIDAY', '09:00:00', '17:00:00', TRUE);

-- Dr. Christopher Kim (Pediatrics)
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available) VALUES
(10, 'TUESDAY', '10:00:00', '16:00:00', TRUE),
(10, 'THURSDAY', '10:00:00', '16:00:00', TRUE),
(10, 'SATURDAY', '10:00:00', '14:00:00', TRUE);

-- =============================================================================
-- SAMPLE APPOINTMENTS
-- =============================================================================
-- Note: Update dates to future dates for testing
-- =============================================================================

-- Future appointments (Scheduled)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes) VALUES
(1, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', '09:30:00', 'SCHEDULED', 'Routine cardiology checkup'),
(2, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', '10:30:00', 'SCHEDULED', 'Follow-up for chest pain'),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:00:00', '09:30:00', 'SCHEDULED', 'Skin rash consultation'),
(4, 5, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '08:00:00', '08:30:00', 'SCHEDULED', 'Annual physical examination'),
(5, 9, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '09:00:00', '09:30:00', 'SCHEDULED', 'Child wellness visit'),
(6, 2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '10:00:00', '10:30:00', 'SCHEDULED', 'Post-surgery follow-up'),
(7, 7, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '10:00:00', '10:30:00', 'SCHEDULED', 'Knee pain evaluation'),
(8, 4, DATE_ADD(CURDATE(), INTERVAL 7 DAY), '08:00:00', '08:30:00', 'SCHEDULED', 'Acne treatment consultation'),
(9, 6, DATE_ADD(CURDATE(), INTERVAL 10 DAY), '09:00:00', '09:30:00', 'SCHEDULED', 'Diabetes management'),
(10, 10, DATE_ADD(CURDATE(), INTERVAL 12 DAY), '10:00:00', '10:30:00', 'SCHEDULED', 'Pediatric heart murmur check');

-- Past appointments (Completed)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes, doctor_notes) VALUES
(1, 1, DATE_SUB(CURDATE(), INTERVAL 30 DAY), '09:00:00', '09:30:00', 'COMPLETED', 'Initial consultation', 'Patient stable, continue medication'),
(2, 3, DATE_SUB(CURDATE(), INTERVAL 20 DAY), '14:00:00', '14:30:00', 'COMPLETED', 'Eczema treatment', 'Prescribed topical steroid cream'),
(3, 5, DATE_SUB(CURDATE(), INTERVAL 15 DAY), '08:00:00', '08:30:00', 'COMPLETED', 'Flu symptoms', 'Viral infection, rest recommended'),
(4, 9, DATE_SUB(CURDATE(), INTERVAL 10 DAY), '09:00:00', '09:30:00', 'COMPLETED', 'Vaccination', 'MMR vaccine administered'),
(5, 2, DATE_SUB(CURDATE(), INTERVAL 7 DAY), '10:00:00', '10:30:00', 'COMPLETED', 'Chest pain', 'ECG normal, no cardiac issues detected');

-- Cancelled appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes, cancellation_reason) VALUES
(6, 1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '11:00:00', '11:30:00', 'CANCELLED', 'Routine checkup', 'Schedule conflict'),
(7, 4, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '12:00:00', '12:30:00', 'CANCELLED', 'Skin consultation', 'Feeling better, no longer needed');

-- No-show appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes) VALUES
(8, 6, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '09:00:00', '09:30:00', 'NO_SHOW', 'Follow-up appointment');

-- =============================================================================
-- VERIFICATION
-- =============================================================================

SELECT 'Seed data inserted successfully' AS status;

-- Show counts
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'PATIENT') AS total_patients,
    (SELECT COUNT(*) FROM users WHERE role = 'DOCTOR') AS total_doctors,
    (SELECT COUNT(*) FROM users WHERE role = 'ADMIN') AS total_admins,
    (SELECT COUNT(*) FROM doctors) AS doctor_profiles,
    (SELECT COUNT(*) FROM time_slots) AS time_slots,
    (SELECT COUNT(*) FROM appointments) AS total_appointments,
    (SELECT COUNT(*) FROM appointments WHERE status = 'SCHEDULED') AS scheduled_appointments,
    (SELECT COUNT(*) FROM appointments WHERE status = 'COMPLETED') AS completed_appointments;

-- =============================================================================
-- END OF SEED DATA
-- =============================================================================
