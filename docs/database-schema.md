# Database Schema - Hospital Booking System

> **Project:** Hospital Appointment Booking System  
> **Student:** Najm (2356070)  
> **Supervisor:** Steve Counsell  
> **Date:** December 20, 2025

---

## Entity-Relationship Diagram

### Relationships Overview

```
┌──────────┐         ┌──────────────┐         ┌─────────────┐
│  users   │────────▶│   doctors    │────────▶│ departments │
│          │  1:1    │              │  M:1    │             │
└────┬─────┘         └──────┬───────┘         └─────────────┘
     │                      │
     │ 1:M                  │ 1:M
     │                      │
     │                ┌─────▼──────┐
     │                │ time_slots │
     │                │            │
     │                └────────────┘
     │
     │               ┌──────────────┐
     └──────────────▶│ appointments │◀────── doctors (1:M)
         1:M         │              │
                     └──────────────┘
```

**Relationship Details:**
- users ──(1:1)──▶ doctors: One user can have one doctor profile (if role='DOCTOR')
- doctors ──(M:1)──▶ departments: Many doctors belong to one department
- doctors ──(1:M)──▶ time_slots: One doctor has many availability time slots
- users ──(1:M)──▶ appointments: One patient books many appointments
- doctors ──(1:M)──▶ appointments: One doctor receives many appointments

---

## Table Schemas

### users

| Column        | Type         | Constraints           | Description                |
|---------------|--------------|------------------------|----------------------------|
| id            | BIGINT       | PK, AUTO_INCREMENT     | Primary key                |
| email         | VARCHAR(255) | UNIQUE, NOT NULL       | Unique login identifier    |
| password_hash | VARCHAR(255) | NOT NULL               | BCrypt hashed password     |
| first_name    | VARCHAR(100) | NOT NULL               | User's first name          |
| last_name     | VARCHAR(100) | NOT NULL               | User's last name           |
| phone_number  | VARCHAR(20)  |                        | Contact number             |
| role          | ENUM         | NOT NULL               | PATIENT, DOCTOR, ADMIN     |
| is_active     | BOOLEAN      | DEFAULT TRUE           | Account status             |
| created_at    | TIMESTAMP    | DEFAULT CURRENT_TIME   | Creation timestamp         |
| updated_at    | TIMESTAMP    | ON UPDATE              | Last update timestamp      |

### departments

| Column      | Type         | Constraints           | Description              |
|-------------|--------------|------------------------|--------------------------|
| id          | BIGINT       | PK, AUTO_INCREMENT     | Primary key              |
| name        | VARCHAR(100) | UNIQUE, NOT NULL       | Department name          |
| description | TEXT         |                        | Department description   |
| created_at  | TIMESTAMP    | DEFAULT CURRENT_TIME   | Creation timestamp       |

### doctors

| Column           | Type           | Constraints           | Description                    |
|------------------|----------------|-----------------------|--------------------------------|
| id               | BIGINT         | PK, AUTO_INCREMENT    | Primary key                    |
| user_id          | BIGINT         | FK, UNIQUE, NOT NULL  | Foreign key to users.id        |
| department_id    | BIGINT         | FK, NOT NULL          | Foreign key to departments.id  |
| specialty        | VARCHAR(100)   |                       | Medical specialty              |
| qualifications   | TEXT           |                       | Degrees and certifications     |
| bio              | TEXT           |                       | Doctor biography               |
| photo_url        | VARCHAR(255)   |                       | Profile photo URL              |
| consultation_fee | DECIMAL(10,2)  |                       | Consultation fee               |
| created_at       | TIMESTAMP      | DEFAULT CURRENT_TIME  | Creation timestamp             |

### time_slots

| Column       | Type      | Constraints              | Description                        |
|--------------|-----------|--------------------------|-------------------------------------|
| id           | BIGINT    | PK, AUTO_INCREMENT       | Primary key                         |
| doctor_id    | BIGINT    | FK, NOT NULL             | Foreign key to doctors.id           |
| day_of_week  | ENUM      | NOT NULL                 | MONDAY-SUNDAY                       |
| start_time   | TIME      | NOT NULL                 | Slot start time                     |
| end_time     | TIME      | NOT NULL                 | Slot end time                       |
| is_available | BOOLEAN   | DEFAULT TRUE             | Availability flag                   |
| created_at   | TIMESTAMP | DEFAULT CURRENT_TIME     | Creation timestamp                  |

**Unique Constraint:** (doctor_id, day_of_week, start_time)

### appointments

| Column             | Type         | Constraints                | Description                    |
|--------------------|--------------|----------------------------|--------------------------------|
| id                 | BIGINT       | PK, AUTO_INCREMENT         | Primary key                    |
| patient_id         | BIGINT       | FK, NOT NULL               | Foreign key to users.id        |
| doctor_id          | BIGINT       | FK, NOT NULL               | Foreign key to doctors.id      |
| appointment_date   | DATE         | NOT NULL                   | Appointment date               |
| start_time         | TIME         | NOT NULL                   | Appointment start time         |
| end_time           | TIME         | NOT NULL                   | Appointment end time           |
| status             | ENUM         | NOT NULL                   | SCHEDULED, COMPLETED, etc.     |
| patient_notes      | TEXT         |                            | Patient's symptoms/notes       |
| doctor_notes       | TEXT         |                            | Doctor's private notes         |
| cancellation_reason| VARCHAR(255) |                            | Reason if cancelled            |
| created_at         | TIMESTAMP    | DEFAULT CURRENT_TIME       | Creation timestamp             |
| updated_at         | TIMESTAMP    | ON UPDATE                  | Last update timestamp          |

**Unique Constraint:** (doctor_id, appointment_date, start_time) - Prevents double booking

---

## Table Descriptions

### 1. users

**Purpose:** Stores all user accounts (patients, doctors, administrators)

**Columns:**

- `id`: Primary key, auto-increment
- `email`: Unique user identifier for login (FR-1.2)
- `password_hash`: BCrypt hashed password (NFR-2.1)
- `first_name`, `last_name`: User's full name
- `phone_number`: Contact number (UK format validation, NFR-2.4)
- `role`: User type - PATIENT, DOCTOR, or ADMIN (FR-1.3)
- `is_active`: Account status for soft deletion (FR-6.1)
- `created_at`, `updated_at`: Audit timestamps

**Indexes:**

- Primary key on `id`
- Unique index on `email` (fast login lookup)

---

### 2. departments

**Purpose:** Medical departments and specialties

**Columns:**

- `id`: Primary key
- `name`: Department name (e.g., "Cardiology", "Dermatology")
- `description`: Optional department description
- `created_at`: When department was added

**Indexes:**

- Primary key on `id`
- Unique index on `name`

---

### 3. doctors

**Purpose:** Extended profile information for users with DOCTOR role

**Columns:**

- `id`: Primary key
- `user_id`: Foreign key to users table (1:1 relationship)
- `department_id`: Foreign key to departments table
- `specialty`: Specific medical specialty (FR-2.1)
- `qualifications`: Degrees and certifications (FR-2.1)
- `bio`: Doctor's biography for patient viewing (FR-2.1)
- `photo_url`: Profile photo URL (FR-2.1)
- `consultation_fee`: Optional fee information
- `created_at`: When profile was created

**Indexes:**

- Primary key on `id`
- Unique index on `user_id` (one doctor profile per user)
- Index on `department_id` (filter doctors by department, FR-3.1)

**Relationships:**

- One user can have one doctor profile (if role='DOCTOR')
- Many doctors belong to one department

---

### 4. time_slots

**Purpose:** Define doctor availability by day and time

**Columns:**

- `id`: Primary key
- `doctor_id`: Foreign key to doctors table
- `day_of_week`: MONDAY, TUESDAY, ..., SUNDAY
- `start_time`: Slot start time (e.g., 09:00)
- `end_time`: Slot end time (e.g., 17:00)
- `is_available`: Can be blocked for holidays (FR-2.2)
- `created_at`: When slot was defined

**Indexes:**

- Primary key on `id`
- Composite unique index on `(doctor_id, day_of_week, start_time)` (prevent duplicates)
- Index on `doctor_id` (fetch all slots for a doctor)

**Business Logic:**

- System generates 30-minute appointment slots within these time ranges (FR-2.2)
- Example: If start_time=09:00, end_time=12:00, system generates slots: 09:00, 09:30, 10:00, 10:30, 11:00, 11:30

---

### 5. appointments

**Purpose:** Store all appointment bookings

**Columns:**

- `id`: Primary key
- `patient_id`: Foreign key to users table (patient who booked)
- `doctor_id`: Foreign key to doctors table
- `appointment_date`: Date of appointment (FR-3.2)
- `start_time`, `end_time`: Time range (30-minute slots)
- `status`: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW (FR-5.2)
- `patient_notes`: Optional symptoms/reason for visit (FR-3.2)
- `doctor_notes`: Private notes for doctor only (FR-5.2)
- `cancellation_reason`: Required when status=CANCELLED (FR-3.4)
- `created_at`, `updated_at`: Audit timestamps

**Indexes:**

- Primary key on `id`
- Composite unique index on `(doctor_id, appointment_date, start_time)` (**prevents double booking**, FR-3.2)
- Index on `patient_id` (fetch patient's appointments, FR-3.3)
- Index on `doctor_id` (fetch doctor's schedule, FR-3.3)
- Index on `appointment_date` (date range queries)

**Relationships:**

- Many appointments belong to one patient
- Many appointments belong to one doctor

---

## Key Constraints

### Primary Keys

All tables use `BIGINT AUTO_INCREMENT` primary keys for scalability (NFR-5.2)

### Foreign Keys

- `doctors.user_id` → `users.id` (CASCADE DELETE: if user deleted, doctor profile also deleted)
- `doctors.department_id` → `departments.id`
- `time_slots.doctor_id` → `doctors.id` (CASCADE DELETE)
- `appointments.patient_id` → `users.id`
- `appointments.doctor_id` → `doctors.id`

### Unique Constraints

- `users.email` - No duplicate emails (FR-1.1)
- `departments.name` - No duplicate departments
- `doctors.user_id` - One doctor profile per user
- `time_slots(doctor_id, day_of_week, start_time)` - No duplicate availability slots
- `appointments(doctor_id, appointment_date, start_time)` - **Prevents double booking** (FR-3.2, NFR-3.3)

### Check Constraints

- `users.role IN ('PATIENT', 'DOCTOR', 'ADMIN')`
- `time_slots.day_of_week IN ('MONDAY', 'TUESDAY', ..., 'SUNDAY')`
- `appointments.status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')`

---

## Data Types Justification

| Column Type | MySQL Type      | Reason                                                 |
| ----------- | --------------- | ------------------------------------------------------ |
| IDs         | `BIGINT`        | Supports 2^63 records, future-proof (NFR-5.2)          |
| Email       | `VARCHAR(255)`  | Standard email length limit                            |
| Password    | `VARCHAR(255)`  | BCrypt output is 60 chars, allow for future algorithms |
| Names       | `VARCHAR(100)`  | Sufficient for most names                              |
| Phone       | `VARCHAR(20)`   | International formats with country codes               |
| Text fields | `TEXT`          | Unlimited length for notes/bio                         |
| Dates       | `DATE`          | Calendar dates only                                    |
| Times       | `TIME`          | Time of day only                                       |
| Timestamps  | `TIMESTAMP`     | Auto-updates with timezone support                     |
| Fees        | `DECIMAL(10,2)` | Precise currency calculations                          |

---

## Sample Data

### users

| id  | email                    | role    | first_name | last_name |
| --- | ------------------------ | ------- | ---------- | --------- |
| 1   | sarah.chen@email.com     | PATIENT | Sarah      | Chen      |
| 2   | dr.thompson@hospital.com | DOCTOR  | Emily      | Thompson  |
| 3   | admin@hospital.com       | ADMIN   | Linda      | Okonkwo   |

### departments

| id  | name        | description                     |
| --- | ----------- | ------------------------------- |
| 1   | Cardiology  | Heart and cardiovascular system |
| 2   | Dermatology | Skin conditions and treatments  |

### doctors

| id  | user_id | department_id | specialty          |
| --- | ------- | ------------- | ------------------ |
| 1   | 2       | 1             | General Cardiology |

### appointments

| id  | patient_id | doctor_id | appointment_date | start_time | status    |
| --- | ---------- | --------- | ---------------- | ---------- | --------- |
| 1   | 1          | 1         | 2025-12-25       | 09:00      | SCHEDULED |

---

## Requirements Mapping

| Requirement                          | Implementation                                                      |
| ------------------------------------ | ------------------------------------------------------------------- |
| **FR-1.1** (User Registration)       | `users` table with email, password_hash, role                       |
| **FR-1.2** (Authentication)          | `users.email` + `password_hash` for login                           |
| **FR-1.3** (RBAC)                    | `users.role` ENUM with CHECK constraint                             |
| **FR-2.1** (Doctor Profile)          | `doctors` table with specialty, qualifications, bio, photo          |
| **FR-2.2** (Availability)            | `time_slots` table with day/time ranges                             |
| **FR-3.2** (Book Appointment)        | `appointments` table with unique constraint on (doctor, date, time) |
| **FR-3.4** (Cancel Appointment)      | `appointments.status` and `cancellation_reason`                     |
| **FR-6.1** (Soft Delete)             | `users.is_active` flag                                              |
| **NFR-2.1** (Password Security)      | `password_hash` column (BCrypt)                                     |
| **NFR-3.3** (Prevent Double Booking) | UNIQUE constraint on `(doctor_id, appointment_date, start_time)`    |
| **NFR-6.2** (Database Portability)   | Standard SQL types compatible with H2 and MySQL                     |

---

## Database Setup Commands

### MySQL (Production)

```sql
CREATE DATABASE hospital_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### H2 (Development)

Spring Boot will auto-create schema from JPA entities.

---

## Document Version

**Version:** 1.0  
**Last Updated:** December 20, 2025  
**Status:** Sprint 1 - Database Design Phase
