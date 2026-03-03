-- ---
-- Hospital Booking System - Seed Data
-- ---
-- Project: Hospital Appointment Booking System
-- Student: Najm (2356070)
-- Purpose: Comprehensive sample data for development and testing
-- ---

-- ---
-- DEPARTMENTS (10 departments)
-- ---
INSERT INTO departments (name, description, created_at) VALUES
('Cardiology', 'Heart and cardiovascular system diagnosis and treatment', CURRENT_TIMESTAMP),
('Dermatology', 'Skin, hair, and nail conditions treatment', CURRENT_TIMESTAMP),
('Neurology', 'Brain, spinal cord, and nervous system disorders', CURRENT_TIMESTAMP),
('Orthopedics', 'Bone, joint, and muscle conditions treatment', CURRENT_TIMESTAMP),
('Pediatrics', 'Medical care for infants, children, and adolescents', CURRENT_TIMESTAMP),
('General Medicine', 'Primary healthcare and general medical conditions', CURRENT_TIMESTAMP),
('Ophthalmology', 'Eye care and vision-related conditions', CURRENT_TIMESTAMP),
('ENT', 'Ear, nose, and throat specialist care', CURRENT_TIMESTAMP),
('Psychiatry', 'Mental health diagnosis and treatment', CURRENT_TIMESTAMP),
('Gynecology', 'Women health and reproductive system care', CURRENT_TIMESTAMP);

-- ---
-- USERS (Admin, Doctors, Patients)
-- ---
-- Password for all users: "password" (BCrypt hashed with strength 12)
-- BCrypt hash: $2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6

-- Admin Users (IDs: 1-2)
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_active, created_at, updated_at) VALUES
('najamarab@gmail.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'System', 'Administrator', '+44 7721037334', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('najmm@gmail.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Hospital', 'Manager', '+44 7721037334', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Doctor Users (IDs: 3-16)
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_active, created_at, updated_at) VALUES
('dr.smith@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'James', 'Smith', '+44 20 7111 1111', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.johnson@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Sarah', 'Johnson', '+44 20 7222 2222', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.williams@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Michael', 'Williams', '+44 20 7333 3333', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.brown@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Emily', 'Brown', '+44 20 7444 4444', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.davis@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Robert', 'Davis', '+44 20 7555 5555', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.wilson@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Jennifer', 'Wilson', '+44 20 7666 6666', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.taylor@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'David', 'Taylor', '+44 20 7777 7777', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.anderson@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Lisa', 'Anderson', '+44 20 7888 8888', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.patel@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Raj', 'Patel', '+44 20 7999 9999', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.chen@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Wei', 'Chen', '+44 20 7101 0101', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.murphy@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Claire', 'Murphy', '+44 20 7202 0202', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.khan@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Amir', 'Khan', '+44 20 7303 0303', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.oconnor@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Fiona', 'O''Connor', '+44 20 7404 0404', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dr.martinez@hospital.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Carlos', 'Martinez', '+44 20 7505 0505', 'DOCTOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Patient Users (IDs: 17-36)
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_active, created_at, updated_at) VALUES
('john.doe@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'John', 'Doe', '+44 79 1111 1111', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('jane.doe@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Jane', 'Doe', '+44 79 2222 2222', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('alice.wilson@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Alice', 'Wilson', '+44 79 3333 3333', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bob.martin@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Bob', 'Martin', '+44 79 4444 4444', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('emma.thomas@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Emma', 'Thomas', '+44 79 5555 5555', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('oliver.clark@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Oliver', 'Clark', '+44 79 6666 6666', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sophia.lewis@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Sophia', 'Lewis', '+44 79 7777 7777', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('william.hall@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'William', 'Hall', '+44 79 8888 8888', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mia.young@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Mia', 'Young', '+44 79 9999 9999', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('noah.king@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Noah', 'King', '+44 79 1010 1010', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('isabella.wright@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Isabella', 'Wright', '+44 79 1212 1212', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('liam.scott@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Liam', 'Scott', '+44 79 1313 1313', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ava.green@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Ava', 'Green', '+44 79 1414 1414', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ethan.baker@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Ethan', 'Baker', '+44 79 1515 1515', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('charlotte.adams@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Charlotte', 'Adams', '+44 79 1616 1616', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('mason.nelson@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Mason', 'Nelson', '+44 79 1717 1717', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('amelia.hill@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Amelia', 'Hill', '+44 79 1818 1818', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('lucas.campbell@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Lucas', 'Campbell', '+44 79 1919 1919', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('harper.mitchell@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'Harper', 'Mitchell', '+44 79 2020 2020', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('james.roberts@email.com', '$2a$12$yhVaRgEzok4tG81fwQJ0F.laHOaBD7w74rlqS3Gzqj/uGbRYDIaD6', 'James', 'Roberts', '+44 79 2121 2121', 'PATIENT', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---
-- DOCTORS (14 doctor profiles linked to doctor users)
-- ---
-- User IDs: Admins=1-2, Doctors=3-16, Patients=17-36
-- Department IDs: Cardiology=1, Dermatology=2, Neurology=3, Orthopedics=4,
--                 Pediatrics=5, General Medicine=6, Ophthalmology=7, ENT=8,
--                 Psychiatry=9, Gynecology=10

INSERT INTO doctors (user_id, department_id, specialty, qualifications, bio, consultation_fee, created_at) VALUES
-- Cardiology (2 doctors)
(3, 1, 'Interventional Cardiology', 'MBBS, MD (Cardiology), FRCP', 'Dr. James Smith is a senior cardiologist with over 15 years of experience in treating heart conditions. He specializes in interventional procedures including angioplasty and stent placement.', 150.00, CURRENT_TIMESTAMP),
(11, 1, 'Electrophysiology', 'MBBS, MD (Cardiology), DM', 'Dr. Raj Patel specializes in cardiac electrophysiology, focusing on heart rhythm disorders. He has performed over 2000 ablation procedures and is an expert in pacemaker implantation.', 160.00, CURRENT_TIMESTAMP),

-- Dermatology (2 doctors)
(4, 2, 'Clinical Dermatology', 'MBBS, MD (Dermatology), FAAD', 'Dr. Sarah Johnson is an expert in treating skin conditions including acne, eczema, psoriasis, and skin cancer. She has published numerous research papers on dermatological treatments.', 120.00, CURRENT_TIMESTAMP),
(12, 2, 'Cosmetic Dermatology', 'MBBS, MD (Dermatology), FRCP', 'Dr. Wei Chen combines medical and cosmetic dermatology expertise. She specializes in laser treatments, chemical peels, and anti-aging procedures alongside treating skin diseases.', 140.00, CURRENT_TIMESTAMP),

-- Neurology (1 doctor)
(5, 3, 'Neurophysiology', 'MBBS, DM (Neurology), PhD', 'Dr. Michael Williams specializes in neurological disorders including epilepsy, stroke, and movement disorders. He leads the neurology research team and has pioneered new treatment protocols.', 180.00, CURRENT_TIMESTAMP),

-- Orthopedics (2 doctors)
(6, 4, 'Sports Medicine', 'MBBS, MS (Orthopedics), FICS', 'Dr. Emily Brown is an orthopedic surgeon specializing in sports injuries and joint replacement. She has treated many professional athletes and is the team doctor for several sports clubs.', 140.00, CURRENT_TIMESTAMP),
(13, 4, 'Spine Surgery', 'MBBS, MS (Orthopedics), MCh', 'Dr. Claire Murphy focuses on spinal conditions and minimally invasive spine surgery. She has performed over 3000 successful spine surgeries with excellent patient outcomes.', 170.00, CURRENT_TIMESTAMP),

-- Pediatrics (2 doctors)
(7, 5, 'Neonatal Care', 'MBBS, MD (Pediatrics), DCH', 'Dr. Robert Davis is a pediatrician with expertise in newborn care and childhood diseases. He is known for his gentle approach with young patients and their families.', 100.00, CURRENT_TIMESTAMP),
(14, 5, 'Pediatric Neurology', 'MBBS, MD (Pediatrics), DM', 'Dr. Amir Khan specializes in childhood neurological conditions including developmental disorders, epilepsy, and ADHD. He works closely with schools and families.', 130.00, CURRENT_TIMESTAMP),

-- General Medicine (1 doctor)
(8, 6, 'Internal Medicine', 'MBBS, MD (Medicine), MRCP', 'Dr. Jennifer Wilson provides comprehensive primary care services. She focuses on preventive medicine, chronic disease management, and health screenings.', 80.00, CURRENT_TIMESTAMP),

-- Ophthalmology (1 doctor)
(9, 7, 'Retinal Surgery', 'MBBS, MS (Ophthalmology), FRCS', 'Dr. David Taylor is an eye surgeon specializing in cataract surgery, LASIK, and retinal disorders. He has performed over 5000 successful surgeries and uses the latest technology.', 130.00, CURRENT_TIMESTAMP),

-- ENT (1 doctor)
(10, 8, 'Head and Neck Surgery', 'MBBS, MS (ENT), DLO', 'Dr. Lisa Anderson specializes in ear, nose, and throat conditions. She is an expert in sinus surgery, hearing disorders, and treatment of sleep apnea.', 110.00, CURRENT_TIMESTAMP),

-- Psychiatry (1 doctor)
(15, 9, 'Clinical Psychiatry', 'MBBS, MD (Psychiatry), MRCPsych', 'Dr. Fiona O''Connor specializes in anxiety disorders, depression, and bipolar disorder. She combines medication management with psychotherapy for comprehensive mental health care.', 150.00, CURRENT_TIMESTAMP),

-- Gynecology (1 doctor)
(16, 10, 'Obstetrics and Gynecology', 'MBBS, MD (OB/GYN), FRCOG', 'Dr. Carlos Martinez provides comprehensive women''s health services including prenatal care, gynecological surgery, and fertility treatments. He has delivered over 2000 babies.', 130.00, CURRENT_TIMESTAMP);

-- ---
-- TIME SLOTS (Weekly availability for each doctor)
-- ---
-- Doctor Profile IDs: 1-14

-- Dr. James Smith (Cardiology) - ID: 1 - Monday, Wednesday, Friday
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

-- Dr. Raj Patel (Cardiology) - ID: 2 - Tuesday, Thursday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(2, 'TUESDAY', '08:00:00', '08:30:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(2, 'TUESDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '08:00:00', '08:30:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(2, 'THURSDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Sarah Johnson (Dermatology) - ID: 3 - Tuesday, Thursday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(3, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '11:30:00', '12:00:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(3, 'TUESDAY', '15:30:00', '16:00:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(3, 'THURSDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Wei Chen (Dermatology) - ID: 4 - Monday, Wednesday, Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(4, 'MONDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(4, 'MONDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(4, 'MONDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(4, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(4, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(4, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(4, 'FRIDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(4, 'FRIDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(4, 'FRIDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP);

-- Dr. Michael Williams (Neurology) - ID: 5 - Monday, Tuesday, Thursday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(5, 'MONDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(5, 'MONDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(5, 'MONDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(5, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(5, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(5, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(5, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(5, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(5, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(5, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(5, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(5, 'THURSDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(5, 'THURSDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(5, 'THURSDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Emily Brown (Orthopedics - Sports Medicine) - ID: 6 - Wednesday, Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(6, 'WEDNESDAY', '08:00:00', '08:30:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(6, 'WEDNESDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(6, 'FRIDAY', '08:00:00', '08:30:00', true, CURRENT_TIMESTAMP),
(6, 'FRIDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(6, 'FRIDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(6, 'FRIDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(6, 'FRIDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(6, 'FRIDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Claire Murphy (Orthopedics - Spine) - ID: 7 - Monday, Tuesday, Thursday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(7, 'MONDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(7, 'MONDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(7, 'MONDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(7, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(7, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(7, 'TUESDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(7, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(7, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(7, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(7, 'THURSDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(7, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(7, 'THURSDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP);

-- Dr. Robert Davis (Pediatrics - Neonatal) - ID: 8 - Monday through Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(8, 'MONDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(8, 'MONDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(8, 'MONDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(8, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(8, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(8, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(8, 'WEDNESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(8, 'WEDNESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(8, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(8, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(8, 'THURSDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(8, 'THURSDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(8, 'FRIDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(8, 'FRIDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(8, 'FRIDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP);

-- Dr. Amir Khan (Pediatrics - Neurology) - ID: 9 - Tuesday, Wednesday, Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(9, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(9, 'TUESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(9, 'TUESDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(9, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(9, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(9, 'WEDNESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(9, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(9, 'WEDNESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(9, 'FRIDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(9, 'FRIDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(9, 'FRIDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP);

-- Dr. Jennifer Wilson (General Medicine) - ID: 10 - Monday through Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(10, 'MONDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(10, 'MONDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(10, 'MONDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(10, 'MONDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(10, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(10, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(10, 'TUESDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(10, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(10, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(10, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(10, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(10, 'WEDNESDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(10, 'WEDNESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(10, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(10, 'THURSDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(10, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(10, 'THURSDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(10, 'FRIDAY', '08:30:00', '09:00:00', true, CURRENT_TIMESTAMP),
(10, 'FRIDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(10, 'FRIDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP);

-- Dr. David Taylor (Ophthalmology) - ID: 11 - Tuesday, Wednesday, Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(11, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(11, 'TUESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(11, 'TUESDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(11, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(11, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(11, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(11, 'WEDNESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(11, 'WEDNESDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(11, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(11, 'FRIDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(11, 'FRIDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(11, 'FRIDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(11, 'FRIDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(11, 'FRIDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Lisa Anderson (ENT) - ID: 12 - Monday, Thursday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(12, 'MONDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(12, 'MONDAY', '11:30:00', '12:00:00', true, CURRENT_TIMESTAMP),
(12, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(12, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(12, 'MONDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(12, 'MONDAY', '15:30:00', '16:00:00', true, CURRENT_TIMESTAMP),
(12, 'THURSDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(12, 'THURSDAY', '11:30:00', '12:00:00', true, CURRENT_TIMESTAMP),
(12, 'THURSDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(12, 'THURSDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(12, 'THURSDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(12, 'THURSDAY', '15:30:00', '16:00:00', true, CURRENT_TIMESTAMP);

-- Dr. Fiona O'Connor (Psychiatry) - ID: 13 - Monday, Wednesday, Friday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(13, 'MONDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(13, 'MONDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(13, 'MONDAY', '11:00:00', '11:30:00', true, CURRENT_TIMESTAMP),
(13, 'MONDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(13, 'MONDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(13, 'MONDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(13, 'WEDNESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(13, 'WEDNESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(13, 'WEDNESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(13, 'WEDNESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(13, 'FRIDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(13, 'FRIDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(13, 'FRIDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP);

-- Dr. Carlos Martinez (Gynecology) - ID: 14 - Tuesday, Thursday
INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time, is_available, created_at) VALUES
(14, 'TUESDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(14, 'TUESDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(14, 'TUESDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(14, 'TUESDAY', '10:30:00', '11:00:00', true, CURRENT_TIMESTAMP),
(14, 'TUESDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(14, 'TUESDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP),
(14, 'TUESDAY', '15:00:00', '15:30:00', true, CURRENT_TIMESTAMP),
(14, 'THURSDAY', '09:00:00', '09:30:00', true, CURRENT_TIMESTAMP),
(14, 'THURSDAY', '09:30:00', '10:00:00', true, CURRENT_TIMESTAMP),
(14, 'THURSDAY', '10:00:00', '10:30:00', true, CURRENT_TIMESTAMP),
(14, 'THURSDAY', '14:00:00', '14:30:00', true, CURRENT_TIMESTAMP),
(14, 'THURSDAY', '14:30:00', '15:00:00', true, CURRENT_TIMESTAMP);

-- ---
-- SAMPLE APPOINTMENTS (35+ appointments)
-- ---
-- Patient IDs: 17-36, Doctor Profile IDs: 1-14

-- ---
-- UPCOMING APPOINTMENTS (Scheduled for future dates)
-- ---
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes, created_at, updated_at) VALUES
-- Tomorrow
(17, 1, CURRENT_DATE + 1, '09:00:00', '09:30:00', 'SCHEDULED', 'Annual heart checkup. Have been experiencing occasional chest tightness.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 10, CURRENT_DATE + 1, '09:30:00', '10:00:00', 'SCHEDULED', 'General health checkup and blood pressure monitoring.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 3, CURRENT_DATE + 1, '10:00:00', '10:30:00', 'SCHEDULED', 'Follow-up for eczema treatment. Skin has improved.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 2 days from now
(20, 6, CURRENT_DATE + 2, '08:30:00', '09:00:00', 'SCHEDULED', 'Knee pain after marathon training. Need assessment.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(21, 8, CURRENT_DATE + 2, '09:00:00', '09:30:00', 'SCHEDULED', 'Child vaccination appointment - 6 month checkup.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(22, 13, CURRENT_DATE + 2, '10:30:00', '11:00:00', 'SCHEDULED', 'Initial consultation for anxiety management.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 3 days from now
(23, 5, CURRENT_DATE + 3, '10:00:00', '10:30:00', 'SCHEDULED', 'Recurring migraines for the past month. Need evaluation.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(24, 11, CURRENT_DATE + 3, '10:30:00', '11:00:00', 'SCHEDULED', 'Eye strain from computer work. Considering glasses.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(25, 14, CURRENT_DATE + 3, '09:30:00', '10:00:00', 'SCHEDULED', 'Annual gynecological exam.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 5 days from now
(26, 2, CURRENT_DATE + 5, '08:00:00', '08:30:00', 'SCHEDULED', 'Palpitations and irregular heartbeat concerns.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(27, 7, CURRENT_DATE + 5, '09:00:00', '09:30:00', 'SCHEDULED', 'Lower back pain radiating to legs.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(28, 12, CURRENT_DATE + 5, '11:00:00', '11:30:00', 'SCHEDULED', 'Chronic sinusitis follow-up appointment.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 1 week from now
(29, 4, CURRENT_DATE + 7, '10:00:00', '10:30:00', 'SCHEDULED', 'Acne treatment consultation. Previous treatments ineffective.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(30, 9, CURRENT_DATE + 7, '10:30:00', '11:00:00', 'SCHEDULED', 'Child developmental assessment - ADHD concerns.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(31, 1, CURRENT_DATE + 7, '14:00:00', '14:30:00', 'SCHEDULED', 'Post-stent placement follow-up.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 10 days from now
(32, 10, CURRENT_DATE + 10, '09:00:00', '09:30:00', 'SCHEDULED', 'Diabetes management review and HbA1c check.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(33, 6, CURRENT_DATE + 10, '14:00:00', '14:30:00', 'SCHEDULED', 'Shoulder injury from tennis. Possible rotator cuff issue.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 2 weeks from now
(34, 13, CURRENT_DATE + 14, '14:00:00', '14:30:00', 'SCHEDULED', 'Depression follow-up. Adjusting medication.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(35, 3, CURRENT_DATE + 14, '15:00:00', '15:30:00', 'SCHEDULED', 'Psoriasis flare-up assessment.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(36, 11, CURRENT_DATE + 14, '14:30:00', '15:00:00', 'SCHEDULED', 'Pre-LASIK consultation and eligibility assessment.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---
-- COMPLETED APPOINTMENTS (Past appointments with doctor notes)
-- ---
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes, doctor_notes, created_at, updated_at) VALUES
-- Yesterday
(17, 10, CURRENT_DATE - 1, '09:00:00', '09:30:00', 'COMPLETED', 'Feeling fatigued and low energy.', 'Patient shows signs of vitamin D deficiency. Prescribed supplements 1000 IU daily. Blood test scheduled for follow-up in 4 weeks.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 2 days ago
(18, 1, CURRENT_DATE - 2, '10:00:00', '10:30:00', 'COMPLETED', 'Chest pain during exercise.', 'ECG normal. Stress test recommended. Patient advised to reduce workout intensity and monitor symptoms. Follow-up in 2 weeks.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 3, CURRENT_DATE - 2, '09:30:00', '10:00:00', 'COMPLETED', 'Persistent acne problem not responding to OTC treatments.', 'Moderate acne vulgaris diagnosed. Prescribed topical retinoid and oral antibiotics. Skincare routine discussed. Follow-up in 6 weeks.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 5 days ago
(20, 6, CURRENT_DATE - 5, '14:00:00', '14:30:00', 'COMPLETED', 'Back pain for 2 weeks after lifting heavy boxes.', 'Mild muscle strain with no nerve involvement. Prescribed physiotherapy sessions (6 weeks), NSAIDs for pain. No heavy lifting for 3 weeks.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(21, 8, CURRENT_DATE - 5, '09:30:00', '10:00:00', 'COMPLETED', 'Child has fever (38.5C) and persistent cough for 3 days.', 'Viral upper respiratory infection diagnosed. Prescribed rest, increased fluids, paracetamol for fever. No antibiotics needed. Return if symptoms worsen.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 1 week ago
(22, 5, CURRENT_DATE - 7, '10:30:00', '11:00:00', 'COMPLETED', 'Numbness in hands and feet.', 'Nerve conduction study ordered. Initial exam suggests possible carpal tunnel syndrome. MRI scheduled to rule out other conditions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, 12, CURRENT_DATE - 7, '14:30:00', '15:00:00', 'COMPLETED', 'Hearing loss in left ear noticed over past month.', 'Mild sensorineural hearing loss detected. Audiogram confirms moderate loss at high frequencies. Hearing aid consultation recommended.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 10 days ago
(24, 2, CURRENT_DATE - 10, '08:30:00', '09:00:00', 'COMPLETED', 'Heart racing episodes at night.', 'Holter monitor prescribed for 48 hours. ECG shows normal sinus rhythm. Likely anxiety-related. Lifestyle modifications discussed.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(25, 13, CURRENT_DATE - 10, '10:00:00', '10:30:00', 'COMPLETED', 'Feeling overwhelmed and anxious about work.', 'Generalized anxiety disorder diagnosis. Started on low-dose SSRI. CBT therapy recommended. Follow-up in 4 weeks to assess response.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 2 weeks ago
(26, 4, CURRENT_DATE - 14, '10:30:00', '11:00:00', 'COMPLETED', 'Dark patches appearing on face.', 'Melasma diagnosed. Sun protection emphasized. Prescribed hydroquinone cream 4%. Chemical peel series recommended.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(27, 7, CURRENT_DATE - 14, '14:00:00', '14:30:00', 'COMPLETED', 'Neck pain and stiffness for 3 weeks.', 'Cervical spondylosis identified on X-ray. Physical therapy ordered. Ergonomic workstation setup discussed. NSAIDs for flare-ups.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 3 weeks ago
(28, 11, CURRENT_DATE - 21, '10:00:00', '10:30:00', 'COMPLETED', 'Blurry vision while reading.', 'Presbyopia confirmed. Reading glasses prescription provided (+1.75). Annual eye exam recommended.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(29, 9, CURRENT_DATE - 21, '14:00:00', '14:30:00', 'COMPLETED', 'Concerned about child''s speech delay at age 3.', 'Speech evaluation shows mild expressive language delay. Speech therapy sessions recommended twice weekly. Hearing test normal.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 1 month ago
(30, 14, CURRENT_DATE - 30, '09:00:00', '09:30:00', 'COMPLETED', 'Irregular menstrual cycles for 4 months.', 'Ultrasound shows polycystic ovaries. PCOS likely diagnosis. Hormonal panel ordered. Lifestyle modifications discussed. Metformin considered.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(31, 10, CURRENT_DATE - 30, '14:30:00', '15:00:00', 'COMPLETED', 'Chronic fatigue and weight gain.', 'Thyroid function tests ordered. TSH elevated suggesting hypothyroidism. Started on levothyroxine 50mcg. Recheck in 6 weeks.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---
-- CANCELLED APPOINTMENTS
-- ---
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes, cancellation_reason, created_at, updated_at) VALUES
(32, 5, CURRENT_DATE - 3, '14:00:00', '14:30:00', 'CANCELLED', 'Dizziness and balance issues.', 'Patient had work emergency and could not attend.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(33, 11, CURRENT_DATE - 2, '10:00:00', '10:30:00', 'CANCELLED', 'Annual eye examination.', 'Doctor unavailable due to medical conference.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(34, 8, CURRENT_DATE - 4, '09:30:00', '10:00:00', 'CANCELLED', 'Child wellness checkup.', 'Family had to travel unexpectedly.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(35, 1, CURRENT_DATE - 6, '09:00:00', '09:30:00', 'CANCELLED', 'Follow-up for hypertension.', 'Patient feeling much better, requested to postpone.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---
-- NO-SHOW APPOINTMENTS (Patients who didn't attend)
-- ---
INSERT INTO appointments (patient_id, doctor_id, appointment_date, start_time, end_time, status, patient_notes, created_at, updated_at) VALUES
(36, 3, CURRENT_DATE - 8, '15:00:00', '15:30:00', 'NO_SHOW', 'Rash on arms and legs.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 12, CURRENT_DATE - 12, '14:00:00', '14:30:00', 'NO_SHOW', 'Persistent sore throat.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ---
-- END OF SEED DATA
-- ---
-- Summary:
-- - 10 Departments
-- - 2 Admin users
-- - 14 Doctors (across all departments)
-- - 20 Patients
-- - 170+ Time slots
-- - 35+ Appointments (mix of scheduled, completed, cancelled, no-show)
--
-- Test Credentials (all use password: "password"):
-- - Admin: admin@hospital.com
-- - Doctor: dr.smith@hospital.com (or any dr.* email)
-- - Patient: john.doe@email.com (or any patient email)
-- ---
