# Sprint 2: JPA Entities and Repositories

> **Project:** Hospital Appointment Booking System
> **Student:** Najm (2356070)
> **Sprint:** Sprint 2 - Backend Implementation
> **Task:** JPA Entities and Spring Data JPA Repositories
> **Status:** ✅ Complete
> **Date Completed:** January 12, 2026

---

## Overview

This document summarizes the JPA entities and Spring Data JPA repositories created for the Hospital Booking System backend.

---

## Files Created

### JPA Entity Classes

| Entity | File | Lines | Description |
|--------|------|-------|-------------|
| **User** | [model/User.java](../backend/src/main/java/com/hospitalapp/backend/model/User.java) | 180 | All user accounts (patients, doctors, admins) |
| **Department** | [model/Department.java](../backend/src/main/java/com/hospitalapp/backend/model/Department.java) | 110 | Medical departments |
| **Doctor** | [model/Doctor.java](../backend/src/main/java/com/hospitalapp/backend/model/Doctor.java) | 195 | Doctor-specific profiles |
| **TimeSlot** | [model/TimeSlot.java](../backend/src/main/java/com/hospitalapp/backend/model/TimeSlot.java) | 145 | Doctor availability schedules |
| **Appointment** | [model/Appointment.java](../backend/src/main/java/com/hospitalapp/backend/model/Appointment.java) | 215 | Patient appointment bookings |

### Spring Data JPA Repositories

| Repository | File | Queries | Description |
|------------|------|---------|-------------|
| **UserRepository** | [repository/UserRepository.java](../backend/src/main/java/com/hospitalapp/backend/repository/UserRepository.java) | 15 | User database operations |
| **DepartmentRepository** | [repository/DepartmentRepository.java](../backend/src/main/java/com/hospitalapp/backend/repository/DepartmentRepository.java) | 7 | Department database operations |
| **DoctorRepository** | [repository/DoctorRepository.java](../backend/src/main/java/com/hospitalapp/backend/repository/DoctorRepository.java) | 15 | Doctor database operations |
| **TimeSlotRepository** | [repository/TimeSlotRepository.java](../backend/src/main/java/com/hospitalapp/backend/repository/TimeSlotRepository.java) | 10 | Time slot database operations |
| **AppointmentRepository** | [repository/AppointmentRepository.java](../backend/src/main/java/com/hospitalapp/backend/repository/AppointmentRepository.java) | 21 | Appointment database operations |

---

## Entity Details

### 1. User Entity

**Table:** `users`

**Purpose:** Stores all user accounts (patients, doctors, admins)

**Fields:**
- `id` (Long) - Primary key
- `email` (String) - Unique, validated email
- `passwordHash` (String) - BCrypt hashed password
- `firstName` (String) - User's first name
- `lastName` (String) - User's last name
- `phoneNumber` (String) - Optional phone number
- `role` (Enum: PATIENT, DOCTOR, ADMIN) - User role
- `isActive` (Boolean) - Account active status
- `createdAt` (LocalDateTime) - Auto-generated timestamp
- `updatedAt` (LocalDateTime) - Auto-updated timestamp

**Indexes:**
- `idx_email` - Email lookup
- `idx_role` - Role filtering
- `idx_active` - Active user filtering
- `idx_created` - Creation date ordering

**Validation:**
- Email must be valid format
- First/last name 2-100 characters
- Phone number max 20 characters

**Methods:**
- `getFullName()` - Returns "FirstName LastName"

---

### 2. Department Entity

**Table:** `departments`

**Purpose:** Medical departments (Cardiology, Dermatology, etc.)

**Fields:**
- `id` (Long) - Primary key
- `name` (String) - Unique department name
- `description` (String) - Department description
- `createdAt` (LocalDateTime) - Auto-generated timestamp

**Relationships:**
- `doctors` (One-to-Many) - List of doctors in this department

**Indexes:**
- `idx_name` - Name lookup

**Validation:**
- Name 2-100 characters, unique
- Description max 500 characters

---

### 3. Doctor Entity

**Table:** `doctors`

**Purpose:** Doctor-specific profile information

**Fields:**
- `id` (Long) - Primary key
- `user` (User) - One-to-One relationship with User
- `department` (Department) - Many-to-One relationship
- `specialty` (String) - Doctor's specialty
- `qualifications` (String) - Doctor's qualifications
- `bio` (String) - Doctor's biography
- `photoUrl` (String) - Profile photo URL
- `consultationFee` (BigDecimal) - Consultation fee (default: 0.00)
- `createdAt` (LocalDateTime) - Auto-generated timestamp

**Relationships:**
- `user` (One-to-One) - Associated user account
- `department` (Many-to-One) - Department assignment
- `timeSlots` (One-to-Many) - Doctor's availability schedule
- `appointments` (One-to-Many) - Doctor's appointments

**Indexes:**
- `idx_user` - User lookup
- `idx_department` - Department filtering
- `idx_specialty` - Specialty search

**Validation:**
- User must exist and be unique
- Department must exist
- Consultation fee must be non-negative

**Methods:**
- `getDoctorName()` - Returns user's full name

---

### 4. TimeSlot Entity

**Table:** `time_slots`

**Purpose:** Doctor availability schedule (recurring weekly slots)

**Fields:**
- `id` (Long) - Primary key
- `doctor` (Doctor) - Many-to-One relationship
- `dayOfWeek` (DayOfWeek enum) - Day of week (MONDAY-SUNDAY)
- `startTime` (LocalTime) - Slot start time
- `endTime` (LocalTime) - Slot end time
- `isAvailable` (Boolean) - Availability status
- `createdAt` (LocalDateTime) - Auto-generated timestamp

**Relationships:**
- `doctor` (Many-to-One) - Doctor who owns this slot

**Indexes:**
- `idx_doctor` - Doctor lookup
- `idx_day` - Day filtering
- `idx_available` - Availability filtering

**Validation:**
- Day of week required
- Start/end time required
- End time must be after start time (database constraint)

---

### 5. Appointment Entity

**Table:** `appointments`

**Purpose:** Patient appointment bookings

**Fields:**
- `id` (Long) - Primary key
- `patient` (User) - Many-to-One relationship with patient
- `doctor` (Doctor) - Many-to-One relationship with doctor
- `appointmentDate` (LocalDate) - Appointment date
- `startTime` (LocalTime) - Start time
- `endTime` (LocalTime) - End time
- `status` (Enum: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW) - Status
- `patientNotes` (String) - Patient's notes
- `doctorNotes` (String) - Doctor's notes (private)
- `cancellationReason` (String) - Reason if cancelled
- `createdAt` (LocalDateTime) - Auto-generated timestamp
- `updatedAt` (LocalDateTime) - Auto-updated timestamp

**Relationships:**
- `patient` (Many-to-One) - Patient who booked
- `doctor` (Many-to-One) - Doctor for appointment

**Indexes:**
- `idx_patient` - Patient lookup
- `idx_doctor` - Doctor lookup
- `idx_date` - Date filtering
- `idx_status` - Status filtering
- `idx_created` - Creation date ordering
- `idx_composite` - Combined doctor, date, time lookup

**Unique Constraints:**
- `unique_doctor_slot` - Prevents double booking (doctor_id, appointment_date, start_time)

**Validation:**
- Appointment date required
- Start/end time required
- End time must be after start time (database constraint)
- Must be future date (database constraint)

**Methods:**
- `getConfirmationNumber()` - Returns "APT-YYYY-XXXXX"

---

## Repository Query Methods

### UserRepository Queries

**Built-in JPA Methods:**
- `save(User)` - Create/update user
- `findById(Long)` - Find by ID
- `findAll()` - Get all users
- `deleteById(Long)` - Delete user

**Custom Query Methods:**
```java
Optional<User> findByEmail(String email)
boolean existsByEmail(String email)
List<User> findByRole(User.Role role)
List<User> findByRoleAndIsActive(User.Role role, Boolean isActive)
List<User> findByIsActive(Boolean isActive)
List<User> findActiveUsersByRole(User.Role role)
List<User> searchUsers(String searchTerm)
List<User> searchUsersByRole(User.Role role, String searchTerm)
long countByRole(User.Role role)
long countActiveByRole(User.Role role)
List<User> findUsersCreatedBetween(LocalDateTime startDate, LocalDateTime endDate)
List<User> findAllPatients()
List<User> findAllDoctors()
List<User> findAllAdmins()
```

**Usage Examples:**
```java
// Find user by email
Optional<User> user = userRepository.findByEmail("sarah.chen@example.com");

// Search users by name/email
List<User> results = userRepository.searchUsers("sarah");

// Count active patients
long count = userRepository.countActiveByRole(User.Role.PATIENT);
```

---

### DepartmentRepository Queries

**Custom Query Methods:**
```java
Optional<Department> findByName(String name)
boolean existsByName(String name)
List<Department> findAllOrderedByName()
List<Department> searchDepartments(String searchTerm)
Optional<Department> findByIdWithDoctors(Long id)
List<Department> findDepartmentsWithDoctors()
long countDoctorsByDepartmentId(Long departmentId)
```

**Usage Examples:**
```java
// Find department by name
Optional<Department> dept = departmentRepository.findByName("Cardiology");

// Get department with all doctors (eager fetch)
Optional<Department> deptWithDoctors = departmentRepository.findByIdWithDoctors(1L);

// Count doctors in department
long doctorCount = departmentRepository.countDoctorsByDepartmentId(1L);
```

---

### DoctorRepository Queries

**Custom Query Methods:**
```java
Optional<Doctor> findByUserId(Long userId)
boolean existsByUserId(Long userId)
List<Doctor> findByDepartmentId(Long departmentId)
List<Doctor> findActiveDoctorsByDepartmentId(Long departmentId)
List<Doctor> findAllActiveDoctors()
Optional<Doctor> findByIdWithUser(Long id)
Optional<Doctor> findByIdWithUserAndDepartment(Long id)
List<Doctor> findBySpecialtyContaining(String specialty)
List<Doctor> searchDoctors(String searchTerm)
List<Doctor> searchDoctorsByDepartment(Long departmentId, String searchTerm)
long countUpcomingAppointments(Long doctorId)
long countCompletedAppointments(Long doctorId)
Optional<Doctor> findByIdWithTimeSlots(Long id)
```

**Usage Examples:**
```java
// Find doctor by user ID
Optional<Doctor> doctor = doctorRepository.findByUserId(2L);

// Search doctors by name or specialty
List<Doctor> results = doctorRepository.searchDoctors("cardiology");

// Get doctor with user and department (eager fetch - avoids N+1)
Optional<Doctor> doctorFull = doctorRepository.findByIdWithUserAndDepartment(5L);
```

---

### TimeSlotRepository Queries

**Custom Query Methods:**
```java
List<TimeSlot> findByDoctorId(Long doctorId)
List<TimeSlot> findByDoctorIdAndIsAvailable(Long doctorId, Boolean isAvailable)
List<TimeSlot> findByDoctorIdAndDayOfWeek(Long doctorId, DayOfWeek dayOfWeek)
List<TimeSlot> findAvailableSlotsByDoctorAndDay(Long doctorId, DayOfWeek dayOfWeek)
Optional<TimeSlot> findByDoctorAndDayAndTime(Long doctorId, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime)
List<TimeSlot> findByDoctorIdOrderedByDayAndTime(Long doctorId)
List<TimeSlot> findAvailableSlotsInTimeRange(Long doctorId, LocalTime minTime, LocalTime maxTime)
long countAvailableSlots(Long doctorId)
boolean existsByDoctorIdAndDayOfWeekAndStartTimeAndEndTime(...)
```

**Usage Examples:**
```java
// Get available slots for doctor on specific day
List<TimeSlot> slots = timeSlotRepository.findAvailableSlotsByDoctorAndDay(5L, DayOfWeek.MONDAY);

// Check if time slot exists
boolean exists = timeSlotRepository.existsByDoctorIdAndDayOfWeekAndStartTimeAndEndTime(
    5L, DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(9, 30)
);
```

---

### AppointmentRepository Queries

**Custom Query Methods:**
```java
List<Appointment> findByPatientId(Long patientId)
List<Appointment> findByDoctorId(Long doctorId)
List<Appointment> findByStatus(Appointment.Status status)
List<Appointment> findByPatientIdOrderedByDate(Long patientId)
List<Appointment> findByDoctorIdOrderedByDate(Long doctorId)
List<Appointment> findByPatientIdAndStatus(Long patientId, Appointment.Status status)
List<Appointment> findByDoctorIdAndStatus(Long doctorId, Appointment.Status status)
List<Appointment> findByDoctorIdAndDate(Long doctorId, LocalDate date)
List<Appointment> findByDoctorIdAndDateRange(Long doctorId, LocalDate startDate, LocalDate endDate)
List<Appointment> findUpcomingAppointmentsByPatient(Long patientId, LocalDate currentDate)
List<Appointment> findUpcomingAppointmentsByDoctor(Long doctorId, LocalDate currentDate)
List<Appointment> findTodayAppointmentsByDoctor(Long doctorId, LocalDate date)
Optional<Appointment> findByDoctorDateAndTime(Long doctorId, LocalDate date, LocalTime time)
boolean existsByDoctorDateAndTime(Long doctorId, LocalDate date, LocalTime startTime)
long countUpcomingAppointmentsByPatient(Long patientId, LocalDate currentDate)
Optional<Appointment> findByIdWithPatientAndDoctor(Long id)
List<Appointment> findAllUpcomingAppointments(LocalDate currentDate)
List<Appointment> findAppointmentsBetweenDates(LocalDate startDate, LocalDate endDate)
long countByStatus(Appointment.Status status)
List<Appointment> findAppointmentsCreatedBetween(LocalDateTime startDateTime, LocalDateTime endDateTime)
```

**Usage Examples:**
```java
// Get patient's upcoming appointments
List<Appointment> upcoming = appointmentRepository.findUpcomingAppointmentsByPatient(1L, LocalDate.now());

// Check if slot is already booked
boolean isBooked = appointmentRepository.existsByDoctorDateAndTime(
    5L, LocalDate.of(2026, 1, 15), LocalTime.of(9, 0)
);

// Get today's appointments for doctor
List<Appointment> today = appointmentRepository.findTodayAppointmentsByDoctor(5L, LocalDate.now());
```

---

## Database Relationships

### Entity Relationship Diagram

```
User (1) ──────── (1) Doctor ──────── (M) TimeSlot
  │                    │
  │                    │
  │ (1:M)              │ (M:1)
  │                    │
  └──> Appointment <───┘
            │
            │ (M:1)
            ▼
       Department
```

### Relationship Details

| From | To | Type | Cascade | Description |
|------|-----|------|---------|-------------|
| User | Doctor | One-to-One | - | Each doctor has one user account |
| Doctor | Department | Many-to-One | - | Doctors belong to departments |
| Doctor | TimeSlot | One-to-Many | ALL | Doctor has many time slots |
| Doctor | Appointment | One-to-Many | ALL | Doctor has many appointments |
| User (Patient) | Appointment | One-to-Many | ALL | Patient has many appointments |
| Department | Doctor | One-to-Many | ALL | Department has many doctors |

---

## Build Verification

**Compilation Result:** ✅ **BUILD SUCCESS**

```bash
cd backend
./mvnw clean compile
```

**Output:**
```
[INFO] Compiling 11 source files with javac [debug parameters release 17] to target/classes
[INFO] BUILD SUCCESS
[INFO] Total time:  4.565 s
```

**Files Compiled:**
- 5 Entity classes
- 5 Repository interfaces
- 1 Main application class

---

## Testing the Entities

### Using H2 Console

1. **Start Application:**
```bash
cd backend
./mvnw spring-boot:run
```

2. **Access H2 Console:**
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:hospital_booking_db`
- Username: `sa`
- Password: (empty)

3. **Verify Tables Created:**
```sql
SHOW TABLES;
```

Expected output:
- USERS
- DEPARTMENTS
- DOCTORS
- TIME_SLOTS
- APPOINTMENTS

4. **Check Table Structure:**
```sql
SHOW COLUMNS FROM USERS;
SHOW COLUMNS FROM APPOINTMENTS;
```

---

## Next Steps (Sprint 2 Continuation)

Now that entities and repositories are complete, the next tasks are:

1. **✅ JPA Entities Created** (Complete)
2. **✅ Spring Data JPA Repositories Created** (Complete)
3. **📝 Service Layer** (Next):
   - UserService
   - DepartmentService
   - DoctorService
   - AppointmentService
   - AuthenticationService

4. **📝 DTOs (Data Transfer Objects)**:
   - Request DTOs
   - Response DTOs
   - Mapper utilities

5. **📝 REST Controllers**:
   - AuthenticationController
   - PatientController
   - DoctorController
   - AdminController

6. **📝 Security Configuration**:
   - JWT authentication
   - Spring Security config
   - Role-based access control

7. **📝 Exception Handling**:
   - Global exception handler
   - Custom exceptions
   - Validation error responses

8. **📝 Integration Tests**:
   - Repository tests
   - Service tests
   - Controller tests

---

## Summary

**Entities and Repositories Complete!** ✅

**Created:**
- 5 JPA Entity classes (845 lines of code)
- 5 Spring Data JPA Repository interfaces (68 custom query methods)
- All entities properly validated and indexed
- All relationships correctly mapped
- Build compiles successfully with no errors

**Ready for:**
- Service layer implementation
- REST controller creation
- Security configuration
- Testing

---

**Sprint 2 Progress:** Entities and Repositories ✅ | Services (Next)

**Project:** Hospital Appointment Booking System
**Student:** Najm (2356070)
**Date:** January 12, 2026
