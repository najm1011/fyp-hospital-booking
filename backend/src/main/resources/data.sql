-- =============================================================================
-- Hospital Booking System - Seed Data
-- =============================================================================
-- Project: Hospital Appointment Booking System
-- Student: Najm (2356070)
-- Purpose: Sample data for development and testing
-- =============================================================================

-- =============================================================================
-- DEPARTMENTS
-- =============================================================================
INSERT INTO departments (name, description, created_at) VALUES
('Cardiology', 'Heart and cardiovascular system diagnosis and treatment', CURRENT_TIMESTAMP),
('Dermatology', 'Skin, hair, and nail conditions treatment', CURRENT_TIMESTAMP),
('Neurology', 'Brain, spinal cord, and nervous system disorders', CURRENT_TIMESTAMP),
('Orthopedics', 'Bone, joint, and muscle conditions treatment', CURRENT_TIMESTAMP),
('Pediatrics', 'Medical care for infants, children, and adolescents', CURRENT_TIMESTAMP),
('General Medicine', 'Primary healthcare and general medical conditions', CURRENT_TIMESTAMP),
('Ophthalmology', 'Eye care and vision-related conditions', CURRENT_TIMESTAMP),
('ENT', 'Ear, nose, and throat specialist care', CURRENT_TIMESTAMP);

-- =============================================================================
-- USERS (Admin, Doctors, Patients)
-- =============================================================================
-- Password for all users: Password123! (BCrypt hashed)
-- BCrypt hash generated with strength 12

-- Admin User
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_active, created_at, updated_at) VALUES
('admin@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'System', 'Administrator', '020-1234-5678', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Doctor Users
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_active, created_at, updated_at) VALUES
('dr.smith@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'James', 'Smith', '020-1111-1111', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.johnson@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Sarah', 'Johnson', '020-2222-2222', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.williams@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Michael', 'Williams', '020-3333-3333', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.brown@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Emily', 'Brown', '020-4444-4444', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.davis@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Robert', 'Davis', '020-5555-5555', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.wilson@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Jennifer', 'Wilson', '020-6666-6666', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.taylor@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'David', 'Taylor', '020-7777-7777', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.anderson@hospital.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Lisa', 'Anderson', '020-8888-8888', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Patient Users
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_active, created_at, updated_at) VALUES
('john.doe@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'John', 'Doe', '079-1111-1111', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('jane.doe@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Jane', 'Doe', '079-2222-2222', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('alice.wilson@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Alice', 'Wilson', '079-3333-3333', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bob.martin@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Bob', 'Martin', '079-4444-4444', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('emma.thomas@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Emma', 'Thomas', '079-5555-5555', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oliver.clark@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Oliver', 'Clark', '079-6666-6666', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sophia.lewis@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Sophia', 'Lewis', '079-7777-7777', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('william.hall@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'William', 'Hall', '079-8888-8888', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mia.young@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Mia', 'Young', '079-9999-9999', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('noah.king@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYb9wUGPJ.Wy', 'Noah', 'King', '079-1010-1010', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================================================
-- DOCTORS (Profiles linked to doctor users)
-- =============================================================================
-- User IDs: Admin=1, Doctors=2-9, Patients=10-19
-- Department IDs: Cardiology=1, Dermatology=2, Neurology=3, Orthopedics=4,
--                 Pediatrics=5, General Medicine=6, Ophthalmology=7, ENT=8

INSERT INTO doctors (user_id, department_id, specialty, qualifications, bio, consultation_fee, created_at) VALUES
(2, 1, 'Interventional Cardiology', 'MBBS, MD (Cardiology), FRCP', 'Dr. James Smith is a senior cardiologist with over 15 years of experience in treating heart conditions. He specializes in interventional procedures and preventive cardiology.', 150.00, CURRENT_TIMESTAMP),
(3, 2, 'Clinical Dermatology', 'MBBS, MD (Dermatology), FAAD', 'Dr. Sarah Johnson is an expert in treating skin conditions including acne, eczema, and skin cancer. She has published numerous research papers on dermatological treatments.', 120.00, CURRENT_TIMESTAMP),
(4, 3, 'Neurophysiology', 'MBBS, DM (Neurology), PhD', 'Dr. Michael Williams specializes in neurological disorders including epilepsy, stroke, and movement disorders. He leads the neurology research team.', 180.00, CURRENT_TIMESTAMP),
(5, 4, 'Sports Medicine', 'MBBS, MS (Orthopedics), FICS', 'Dr. Emily Brown is an orthopedic surgeon specializing in sports injuries and joint replacement. She has treated many professional athletes.', 140.00, CURRENT_TIMESTAMP),
(6, 5, 'Neonatal Care', 'MBBS, MD (Pediatrics), DCH', 'Dr. Robert Davis is a pediatrician with expertise in newborn care and childhood diseases. He is known for his gentle approach with young patients.', 100.00, CURRENT_TIMESTAMP),
(7, 6, 'Internal Medicine', 'MBBS, MD (Medicine), MRCP', 'Dr. Jennifer Wilson provides comprehensive primary care services. She focuses on preventive medicine and chronic disease management.', 80.00, CURRENT_TIMESTAMP),
(8, 7, 'Retinal Surgery', 'MBBS, MS (Ophthalmology), FRCS', 'Dr. David Taylor is an eye surgeon specializing in cataract surgery and retinal disorders. He has performed over 5000 successful surgeries.', 130.00, CURRENT_TIMESTAMP),
(9, 8, 'Head and Neck Surgery', 'MBBS, MS (ENT), DLO', 'Dr. Lisa Anderson specializes in ear, nose, and throat conditions. She is an expert in sinus surgery and hearing disorders.', 110.00, CURRENT_TIMESTAMP);

-- =============================================================================
-- TIME SLOTS (Weekly availability for each doctor)
-- =============================================================================
-- Doctor IDs: 1-8 (corresponding to doctor profiles above)

-- Dr. James Smith (Cardiology) - Monday, Wednesday, Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(1, 'MONDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(1, 'MONDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(1, 'MONDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(1, 'MONDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(1, 'MONDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(1, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(1, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(1, 'MONDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(1, 'WEDNESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(1, 'WEDNESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(1, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(1, 'WEDNESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(1, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(1, 'WEDNESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(1, 'FRIDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(1, 'FRIDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(1, 'FRIDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(1, 'FRIDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Sarah Johnson (Dermatology) - Tuesday, Thursday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(2, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '11:30:00', '12:00:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '15:30:00', '16:00:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Michael Williams (Neurology) - Monday, Tuesday, Thursday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(3, 'MONDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(3, 'MONDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(3, 'MONDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(3, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(3, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Emily Brown (Orthopedics) - Wednesday, Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(4, 'WEDNESDAY', '08:00:00', '08:30:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(4, 'FRIDAY', '08:00:00', '08:30:00', true, CURRENT_TIMESTAMP),
(4, 'FRIDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(4, 'FRIDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(4, 'FRIDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(4, 'FRIDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(4, 'FRIDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Robert Davis (Pediatrics) - Monday through Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(5, 'MONDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(5, 'MONDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(5, 'MONDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(5, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(5, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(5, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(5, 'WEDNESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(5, 'WEDNESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(5, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(5, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(5, 'THURSDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(5, 'THURSDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(5, 'FRIDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(5, 'FRIDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(5, 'FRIDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP);

-- Dr. Jennifer Wilson (General Medicine) - Monday through Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(6, 'MONDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(6, 'MONDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(6, 'MONDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(6, 'MONDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(6, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(6, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(6, 'TUESDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(6, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(6, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(6, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(6, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(6, 'THURSDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(6, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(6, 'THURSDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(6, 'FRIDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(6, 'FRIDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(6, 'FRIDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP);

-- Dr. David Taylor (Ophthalmology) - Tuesday, Wednesday, Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(7, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(7, 'TUESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(7, 'TUESDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(7, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(7, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(7, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(7, 'WEDNESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(7, 'WEDNESDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(7, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(7, 'FRIDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(7, 'FRIDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(7, 'FRIDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(7, 'FRIDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(7, 'FRIDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Lisa Anderson (ENT) - Monday, Thursday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(8, 'MONDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(8, 'MONDAY', '11:30:00', '12:00:00', true, CURRENT_TIMESTAMP),
(8, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(8, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(8, 'MONDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(8, 'MONDAY', '15:30:00', '16:00:00', true, CURRENT_TIMESTAMP),
(8, 'THURSDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(8, 'THURSDAY', '11:30:00', '12:00:00', true, CURRENT_TIMESTAMP),
(8, 'THURSDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(8, 'THURSDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(8, 'THURSDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(8, 'THURSDAY', '15:30:00', '16:00:00', true, CURRENT_TIMESTAMP);

-- =============================================================================
-- SAMPLE APPOINTMENTS
-- =============================================================================
-- Patient IDs: 10-19, Doctor IDs: 1-8

-- Upcoming appointments (future dates)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes, created_at, updated_at) VALUES
(10, 1, DATEADD('DAY', 3, CURRENT_DATE), '09:00:00', '09:30:00', 'SCHEDULED', 'Regular checkup for heart condition', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 2, DATEADD('DAY', 5, CURRENT_DATE), '09:30:00', '10:00:00', 'SCHEDULED', 'Skin rash treatment follow-up', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 3, DATEADD('DAY', 7, CURRENT_DATE), '10:00:00', '10:30:00', 'SCHEDULED', 'Recurring headaches evaluation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 4, DATEADD('DAY', 4, CURRENT_DATE), '08:30:00', '09:00:00', 'SCHEDULED', 'Knee pain after sports injury', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 5, DATEADD('DAY', 6, CURRENT_DATE), '09:00:00', '09:30:00', 'SCHEDULED', 'Child vaccination appointment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 6, DATEADD('DAY', 2, CURRENT_DATE), '09:00:00', '09:30:00', 'SCHEDULED', 'Annual health checkup', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 7, DATEADD('DAY', 8, CURRENT_DATE), '10:30:00', '11:00:00', 'SCHEDULED', 'Vision problems and eye strain', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 8, DATEADD('DAY', 10, CURRENT_DATE), '14:00:00', '14:30:00', 'SCHEDULED', 'Ear infection follow-up', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Past appointments (completed)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes, doctor_notes, created_at, updated_at) VALUES
(10, 6, DATEADD('DAY', -10, CURRENT_DATE), '09:30:00', '10:00:00', 'COMPLETED', 'Feeling tired and weak', 'Patient shows signs of iron deficiency. Prescribed supplements and follow-up in 4 weeks.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 1, DATEADD('DAY', -7, CURRENT_DATE), '10:00:00', '10:30:00', 'COMPLETED', 'Chest pain during exercise', 'ECG normal. Stress test recommended. Advised to reduce intensity of workouts.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 2, DATEADD('DAY', -14, CURRENT_DATE), '09:00:00', '09:30:00', 'COMPLETED', 'Persistent acne problem', 'Prescribed topical treatment and oral antibiotics. Follow-up in 6 weeks.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 4, DATEADD('DAY', -5, CURRENT_DATE), '14:00:00', '14:30:00', 'COMPLETED', 'Back pain for 2 weeks', 'Mild muscle strain. Prescribed physiotherapy sessions and pain medication.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 5, DATEADD('DAY', -3, CURRENT_DATE), '09:30:00', '10:00:00', 'COMPLETED', 'Child has fever and cough', 'Viral infection diagnosed. Prescribed rest, fluids, and fever medication.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Cancelled appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes, cancellation_reason, created_at, updated_at) VALUES
(13, 3, DATEADD('DAY', -2, CURRENT_DATE), '14:00:00', '14:30:00', 'CANCELLED', 'Dizziness and balance issues', 'Patient had scheduling conflict', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 7, DATEADD('DAY', -1, CURRENT_DATE), '10:00:00', '10:30:00', 'CANCELLED', 'Eye examination', 'Doctor unavailable due to emergency', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================================================
-- END OF SEED DATA
-- =============================================================================
