-- =============================================================================
-- Hospital Booking System - PostgreSQL Database Schema
-- =============================================================================
-- Project: Hospital Appointment Booking System
-- Student: Najm (2356070)
-- Database: PostgreSQL 14+
-- Encoding: UTF-8
-- =============================================================================

-- Drop existing database if exists (WARNING: This will delete all data!)
-- DROP DATABASE IF EXISTS hospital_booking;

-- Create database
-- CREATE DATABASE hospital_booking WITH ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8';

-- Connect to the database
-- \c hospital_booking;

-- =============================================================================
-- TABLE: users
-- =============================================================================
-- Stores all user accounts (patients, doctors, admins)
-- =============================================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('PATIENT', 'DOCTOR', 'ADMIN')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_created ON users(created_at);
CREATE INDEX idx_users_role_active ON users(role, is_active);

-- =============================================================================
-- TABLE: departments
-- =============================================================================
-- Medical departments (Cardiology, Dermatology, etc.)
-- =============================================================================

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_departments_name ON departments(name);

-- =============================================================================
-- TABLE: doctors
-- =============================================================================
-- Doctor-specific profile information
-- =============================================================================

CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department_id BIGINT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    specialty VARCHAR(255),
    qualifications TEXT,
    bio TEXT,
    photo_url VARCHAR(500),
    consultation_fee DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_doctors_user ON doctors(user_id);
CREATE INDEX idx_doctors_department ON doctors(department_id);
CREATE INDEX idx_doctors_specialty ON doctors(specialty);

-- =============================================================================
-- TABLE: time_slots
-- =============================================================================
-- Doctor availability schedule (recurring weekly slots)
-- =============================================================================

CREATE TABLE time_slots (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

CREATE INDEX idx_timeslots_doctor ON time_slots(doctor_id);
CREATE INDEX idx_timeslots_day ON time_slots(day_of_week);
CREATE INDEX idx_timeslots_available ON time_slots(is_available);

-- =============================================================================
-- TABLE: appointments
-- =============================================================================
-- Patient appointment bookings
-- =============================================================================

CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    patient_notes TEXT,
    doctor_notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_appointment_time CHECK (end_time > start_time),
    CONSTRAINT unique_doctor_slot UNIQUE (doctor_id, appointment_date, start_time)
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_created ON appointments(created_at);
CREATE INDEX idx_appointments_composite ON appointments(doctor_id, appointment_date, start_time);

-- Partial index for upcoming scheduled appointments
CREATE INDEX idx_appointments_upcoming ON appointments(status, appointment_date, start_time)
    WHERE status = 'SCHEDULED';

-- =============================================================================
-- INITIAL DATA: Departments
-- =============================================================================

INSERT INTO departments (name, description) VALUES
('Cardiology', 'Heart and cardiovascular system treatment'),
('Dermatology', 'Skin conditions and cosmetic treatments'),
('General Practice', 'Primary care and general health services'),
('Orthopedics', 'Bone, joint, and muscle treatment'),
('Pediatrics', 'Healthcare for infants, children, and adolescents');

-- =============================================================================
-- INITIAL DATA: Admin User
-- =============================================================================
-- Password: Admin123! (BCrypt hash with cost factor 12)
-- IMPORTANT: Change this password immediately after first login
-- =============================================================================

INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('admin@hospital-booking.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYVjHpIZmWu', 'System', 'Administrator', 'ADMIN', TRUE);

-- =============================================================================
-- DATABASE VIEWS
-- =============================================================================

-- View: Active appointments with patient and doctor details
CREATE OR REPLACE VIEW active_appointments AS
SELECT
    a.id,
    a.appointment_date,
    a.start_time,
    a.end_time,
    a.status,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.email AS patient_email,
    p.phone_number AS patient_phone,
    CONCAT(du.first_name, ' ', du.last_name) AS doctor_name,
    du.email AS doctor_email,
    d.specialty AS doctor_specialty,
    dep.name AS department_name,
    a.created_at,
    a.updated_at
FROM appointments a
JOIN users p ON a.patient_id = p.id
JOIN doctors d ON a.doctor_id = d.id
JOIN users du ON d.user_id = du.id
JOIN departments dep ON d.department_id = dep.id
WHERE a.status = 'SCHEDULED'
AND a.appointment_date >= CURRENT_DATE
ORDER BY a.appointment_date, a.start_time;

-- View: Doctor statistics
CREATE OR REPLACE VIEW doctor_statistics AS
SELECT
    d.id AS doctor_id,
    CONCAT(u.first_name, ' ', u.last_name) AS doctor_name,
    dep.name AS department,
    d.specialty,
    COUNT(a.id) AS total_appointments,
    SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_appointments,
    SUM(CASE WHEN a.status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_appointments,
    SUM(CASE WHEN a.status = 'NO_SHOW' THEN 1 ELSE 0 END) AS no_show_appointments,
    SUM(CASE WHEN a.status = 'SCHEDULED' AND a.appointment_date >= CURRENT_DATE THEN 1 ELSE 0 END) AS upcoming_appointments
FROM doctors d
JOIN users u ON d.user_id = u.id
JOIN departments dep ON d.department_id = dep.id
LEFT JOIN appointments a ON d.id = a.doctor_id
GROUP BY d.id, u.first_name, u.last_name, dep.name, d.specialty;

-- =============================================================================
-- FUNCTIONS (PostgreSQL equivalent of stored procedures)
-- =============================================================================

-- Function: Get available time slots for a doctor on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
    p_doctor_id BIGINT,
    p_date DATE
)
RETURNS TABLE (
    slot_id BIGINT,
    slot_start_time TIME,
    slot_end_time TIME,
    slot_available BOOLEAN,
    booked_status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ts.id,
        ts.start_time,
        ts.end_time,
        CASE WHEN a.id IS NOT NULL THEN FALSE ELSE TRUE END,
        a.status
    FROM time_slots ts
    LEFT JOIN appointments a ON ts.doctor_id = a.doctor_id
        AND a.appointment_date = p_date
        AND a.start_time = ts.start_time
        AND a.status = 'SCHEDULED'
    WHERE ts.doctor_id = p_doctor_id
        AND ts.day_of_week = UPPER(TRIM(TO_CHAR(p_date, 'Day')))
        AND ts.is_available = TRUE
    ORDER BY ts.start_time;
END;
$$ LANGUAGE plpgsql;

-- Function: Get patient appointment history
CREATE OR REPLACE FUNCTION get_patient_appointments(
    p_patient_id BIGINT
)
RETURNS TABLE (
    appointment_id BIGINT,
    appt_date DATE,
    appt_start_time TIME,
    appt_end_time TIME,
    appt_status VARCHAR,
    doctor_name TEXT,
    doctor_specialty VARCHAR,
    department VARCHAR,
    notes TEXT,
    appt_created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        CONCAT(du.first_name, ' ', du.last_name),
        d.specialty,
        dep.name,
        a.patient_notes,
        a.created_at
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users du ON d.user_id = du.id
    JOIN departments dep ON d.department_id = dep.id
    WHERE a.patient_id = p_patient_id
    ORDER BY a.appointment_date DESC, a.start_time DESC;
END;
$$ LANGUAGE plpgsql;

-- Function: Get doctor schedule for a date range
CREATE OR REPLACE FUNCTION get_doctor_schedule(
    p_doctor_id BIGINT,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    appointment_id BIGINT,
    appt_date DATE,
    appt_start_time TIME,
    appt_end_time TIME,
    appt_status VARCHAR,
    patient_name TEXT,
    patient_email VARCHAR,
    patient_phone VARCHAR,
    notes TEXT,
    appt_created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        CONCAT(p.first_name, ' ', p.last_name),
        p.email,
        p.phone_number,
        a.patient_notes,
        a.created_at
    FROM appointments a
    JOIN users p ON a.patient_id = p.id
    WHERE a.doctor_id = p_doctor_id
        AND a.appointment_date BETWEEN p_start_date AND p_end_date
    ORDER BY a.appointment_date, a.start_time;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGER FUNCTIONS
-- =============================================================================

-- Trigger function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- GRANTS AND PERMISSIONS
-- =============================================================================
-- Create application user with limited privileges
-- =============================================================================

-- Create application database user
-- IMPORTANT: Change the password in production
-- CREATE USER hospital_app WITH PASSWORD 'CHANGE_THIS_PASSWORD';

-- Grant necessary privileges
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hospital_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO hospital_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO hospital_app;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify schema creation
SELECT 'Database schema created successfully' AS status;

-- Count rows in each table
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'time_slots', COUNT(*) FROM time_slots
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments;

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
