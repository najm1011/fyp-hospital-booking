-- =============================================================================
-- Hospital Booking System - MySQL Database Schema
-- =============================================================================
-- Project: Hospital Appointment Booking System
-- Student: Najm (2356070)
-- Database: MySQL 8.0+
-- Character Set: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- =============================================================================

-- Drop existing database if exists (WARNING: This will delete all data!)
-- DROP DATABASE IF EXISTS hospital_booking;

-- Create database with UTF-8 support
CREATE DATABASE IF NOT EXISTS hospital_booking
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE hospital_booking;

-- =============================================================================
-- TABLE: users
-- =============================================================================
-- Stores all user accounts (patients, doctors, admins)
-- =============================================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: departments
-- =============================================================================
-- Medical departments (Cardiology, Dermatology, etc.)
-- =============================================================================

CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: doctors
-- =============================================================================
-- Doctor-specific profile information
-- =============================================================================

CREATE TABLE doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    specialty VARCHAR(255),
    qualifications TEXT,
    bio TEXT,
    photo_url VARCHAR(500),
    consultation_fee DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,

    INDEX idx_user (user_id),
    INDEX idx_department (department_id),
    INDEX idx_specialty (specialty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: time_slots
-- =============================================================================
-- Doctor availability schedule (recurring weekly slots)
-- =============================================================================

CREATE TABLE time_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,

    INDEX idx_doctor (doctor_id),
    INDEX idx_day (day_of_week),
    INDEX idx_available (is_available),

    CONSTRAINT chk_time_order CHECK (end_time > start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: appointments
-- =============================================================================
-- Patient appointment bookings
-- =============================================================================

CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    patient_notes TEXT,
    doctor_notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,

    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_date (appointment_date),
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_composite (doctor_id, appointment_date, start_time),

    CONSTRAINT chk_appointment_time CHECK (end_time > start_time),
    CONSTRAINT chk_future_date CHECK (appointment_date >= CURDATE()),

    UNIQUE KEY unique_doctor_slot (doctor_id, appointment_date, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
AND a.appointment_date >= CURDATE()
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
    SUM(CASE WHEN a.status = 'SCHEDULED' AND a.appointment_date >= CURDATE() THEN 1 ELSE 0 END) AS upcoming_appointments
FROM doctors d
JOIN users u ON d.user_id = u.id
JOIN departments dep ON d.department_id = dep.id
LEFT JOIN appointments a ON d.id = a.doctor_id
GROUP BY d.id, u.first_name, u.last_name, dep.name, d.specialty;

-- =============================================================================
-- STORED PROCEDURES
-- =============================================================================

DELIMITER $$

-- Procedure: Get available time slots for a doctor on a specific date
CREATE PROCEDURE get_available_slots(
    IN p_doctor_id BIGINT,
    IN p_date DATE
)
BEGIN
    DECLARE v_day_of_week VARCHAR(10);

    SET v_day_of_week = UPPER(DAYNAME(p_date));

    SELECT
        ts.id,
        ts.start_time,
        ts.end_time,
        CASE
            WHEN a.id IS NOT NULL THEN FALSE
            ELSE TRUE
        END AS is_available,
        a.status AS booked_status
    FROM time_slots ts
    LEFT JOIN appointments a ON ts.doctor_id = a.doctor_id
        AND a.appointment_date = p_date
        AND a.start_time = ts.start_time
        AND a.status = 'SCHEDULED'
    WHERE ts.doctor_id = p_doctor_id
        AND ts.day_of_week = v_day_of_week
        AND ts.is_available = TRUE
    ORDER BY ts.start_time;
END$$

-- Procedure: Get patient appointment history
CREATE PROCEDURE get_patient_appointments(
    IN p_patient_id BIGINT
)
BEGIN
    SELECT
        a.id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        CONCAT(du.first_name, ' ', du.last_name) AS doctor_name,
        d.specialty,
        dep.name AS department,
        a.patient_notes,
        a.created_at
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users du ON d.user_id = du.id
    JOIN departments dep ON d.department_id = dep.id
    WHERE a.patient_id = p_patient_id
    ORDER BY a.appointment_date DESC, a.start_time DESC;
END$$

-- Procedure: Get doctor schedule for a date range
CREATE PROCEDURE get_doctor_schedule(
    IN p_doctor_id BIGINT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT
        a.id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
        p.email AS patient_email,
        p.phone_number AS patient_phone,
        a.patient_notes,
        a.created_at
    FROM appointments a
    JOIN users p ON a.patient_id = p.id
    WHERE a.doctor_id = p_doctor_id
        AND a.appointment_date BETWEEN p_start_date AND p_end_date
    ORDER BY a.appointment_date, a.start_time;
END$$

DELIMITER ;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

DELIMITER $$

-- Trigger: Prevent overlapping appointments
CREATE TRIGGER prevent_overlapping_appointments
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    DECLARE overlap_count INT;

    SELECT COUNT(*) INTO overlap_count
    FROM appointments
    WHERE doctor_id = NEW.doctor_id
        AND appointment_date = NEW.appointment_date
        AND status = 'SCHEDULED'
        AND (
            (NEW.start_time >= start_time AND NEW.start_time < end_time)
            OR (NEW.end_time > start_time AND NEW.end_time <= end_time)
            OR (NEW.start_time <= start_time AND NEW.end_time >= end_time)
        );

    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Time slot already booked for this doctor';
    END IF;
END$$

-- Trigger: Validate appointment is within doctor's working hours
CREATE TRIGGER validate_doctor_availability
BEFORE INSERT ON appointments
FOR EACH ROW
BEGIN
    DECLARE availability_count INT;
    DECLARE v_day_of_week VARCHAR(10);

    SET v_day_of_week = UPPER(DAYNAME(NEW.appointment_date));

    SELECT COUNT(*) INTO availability_count
    FROM time_slots
    WHERE doctor_id = NEW.doctor_id
        AND day_of_week = v_day_of_week
        AND start_time <= NEW.start_time
        AND end_time >= NEW.end_time
        AND is_available = TRUE;

    IF availability_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Doctor is not available at the selected time';
    END IF;
END$$

DELIMITER ;

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
-- Additional composite indexes for common query patterns
-- =============================================================================

CREATE INDEX idx_appointments_upcoming ON appointments(status, appointment_date, start_time)
    WHERE status = 'SCHEDULED' AND appointment_date >= CURDATE();

CREATE INDEX idx_user_role_active ON users(role, is_active);

-- =============================================================================
-- GRANTS AND PERMISSIONS
-- =============================================================================
-- Create application user with limited privileges
-- =============================================================================

-- Create application database user
-- IMPORTANT: Change the password in production
CREATE USER IF NOT EXISTS 'hospital_app'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';

-- Grant necessary privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON hospital_booking.* TO 'hospital_app'@'localhost';
GRANT EXECUTE ON hospital_booking.* TO 'hospital_app'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- =============================================================================
-- DATABASE MAINTENANCE
-- =============================================================================

-- Optimize tables
OPTIMIZE TABLE users, doctors, departments, time_slots, appointments;

-- Analyze tables for query optimization
ANALYZE TABLE users, doctors, departments, time_slots, appointments;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify schema creation
SELECT 'Database schema created successfully' AS status;

-- Show table structure
SHOW TABLES;

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
