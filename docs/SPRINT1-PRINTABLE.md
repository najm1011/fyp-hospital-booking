# Hospital Booking System - Sprint 1 Complete Guide

> **Project:** Hospital Appointment Booking System
> **Student:** Najm (2356070)
> **Supervisor:** Steve Counsell
> **Sprint 1 Status:** Complete

---

# TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Database Design](#4-database-design)
5. [REST API Specification](#5-rest-api-specification)
6. [Authentication & Security](#6-authentication--security)
7. [Backend Structure](#7-backend-structure)
8. [Frontend Structure](#8-frontend-structure)
9. [Configuration](#9-configuration)
10. [How It All Works Together](#10-how-it-all-works-together)

---

# 1. PROJECT OVERVIEW

## What is This System?

A web-based hospital appointment booking system that allows:
- **Patients** to browse doctors and book appointments
- **Doctors** to manage their schedule and view patient appointments
- **Admins** to manage users, doctors, and departments

## Key Features

| Feature | Description |
|---------|-------------|
| User Authentication | Register, login, JWT-based sessions |
| Doctor Browsing | Search by department, specialty, name |
| Appointment Booking | Select doctor, date, time slot |
| Appointment Management | View, cancel, reschedule appointments |
| Email Notifications | Confirmation, cancellation, reminders |
| Role-Based Access | Different views for Patient/Doctor/Admin |

---

# 2. TECHNOLOGY STACK

## Backend (Java/Spring Boot)

| Technology | Purpose | Version |
|------------|---------|---------|
| Java | Programming language | 17 |
| Spring Boot | Web framework | 3.4.x |
| Spring Security | Authentication/Authorization | 6.x |
| Spring Data JPA | Database ORM | 3.x |
| H2 Database | Development database | 2.x |
| MySQL | Production database | 8.0+ |
| JWT | Token-based authentication | - |
| Maven | Build tool | 3.8+ |

## Frontend (React)

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI framework | 19.x |
| Vite | Build tool | 6.x |
| Tailwind CSS | Styling | 3.4.x |
| React Router | Navigation | 7.x |
| Axios | HTTP client | 1.x |
| React Icons | Icon library | 5.x |

---

# 3. ARCHITECTURE

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  React Frontend (Vite)                   │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │
│  │  │  Pages  │  │Components│  │ Context │  │Services │    │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (JSON)
                              │ JWT Token in Header
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Spring Boot Backend (Port 8080)             │   │
│  │                                                          │   │
│  │  ┌──────────────┐    ┌──────────────┐                   │   │
│  │  │  Controllers │───▶│   Services   │                   │   │
│  │  │  (REST API)  │    │(Business Logic)                  │   │
│  │  └──────────────┘    └──────────────┘                   │   │
│  │         │                   │                            │   │
│  │         ▼                   ▼                            │   │
│  │  ┌──────────────┐    ┌──────────────┐                   │   │
│  │  │   Security   │    │ Repositories │                   │   │
│  │  │  (JWT Auth)  │    │   (JPA)      │                   │   │
│  │  └──────────────┘    └──────────────┘                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ JDBC
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         H2 (Development) / MySQL (Production)            │   │
│  │                                                          │   │
│  │  ┌────────┐ ┌────────┐ ┌───────────┐ ┌────────────────┐ │   │
│  │  │ users  │ │doctors │ │departments│ │  appointments  │ │   │
│  │  └────────┘ └────────┘ └───────────┘ └────────────────┘ │   │
│  │                    ┌────────────┐                        │   │
│  │                    │ time_slots │                        │   │
│  │                    └────────────┘                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow Example: Booking an Appointment

```
1. User clicks "Book Appointment" button
              │
              ▼
2. React sends POST /api/v1/appointments
   with JWT token in Authorization header
              │
              ▼
3. Spring Security validates JWT token
              │
              ▼
4. AppointmentController receives request
              │
              ▼
5. AppointmentService processes business logic:
   - Validates patient exists
   - Validates doctor exists
   - Checks time slot availability
   - Creates appointment record
              │
              ▼
6. AppointmentRepository saves to database
              │
              ▼
7. EmailService sends confirmation (async)
              │
              ▼
8. Response returned to frontend
              │
              ▼
9. React updates UI with success message
```

---

# 4. DATABASE DESIGN

## Entity-Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │    doctors      │       │  departments    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ PK id           │       │ PK id           │       │ PK id           │
│    email        │       │ FK user_id      │───────│    name         │
│    password_hash│◄──────│ FK department_id│       │    description  │
│    first_name   │       │    specialty    │       │    created_at   │
│    last_name    │       │    qualifications       └─────────────────┘
│    phone_number │       │    bio          │
│    role         │       │    consultation_fee
│    is_active    │       │    created_at   │
│    created_at   │       └─────────────────┘
│    updated_at   │               │
└─────────────────┘               │
        │                         │
        │                         │
        ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│  appointments   │       │   time_slots    │
├─────────────────┤       ├─────────────────┤
│ PK id           │       │ PK id           │
│ FK patient_id   │       │ FK doctor_id    │
│ FK doctor_id    │       │    day_of_week  │
│    appointment_date     │    start_time   │
│    start_time   │       │    end_time     │
│    end_time     │       │    is_available │
│    status       │       │    created_at   │
│    patient_notes│       └─────────────────┘
│    doctor_notes │
│    cancellation_reason
│    created_at   │
│    updated_at   │
└─────────────────┘
```

## Table Descriptions

### users
Stores all user accounts (patients, doctors, admins).

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key, auto-increment |
| email | VARCHAR(255) | Unique email address |
| password_hash | VARCHAR(255) | BCrypt hashed password |
| first_name | VARCHAR(100) | User's first name |
| last_name | VARCHAR(100) | User's last name |
| phone_number | VARCHAR(20) | Contact number |
| role | ENUM | PATIENT, DOCTOR, or ADMIN |
| is_active | BOOLEAN | Account status |
| created_at | TIMESTAMP | Registration date |
| updated_at | TIMESTAMP | Last modification date |

### doctors
Extended profile for users with DOCTOR role.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | FK to users table |
| department_id | BIGINT | FK to departments table |
| specialty | VARCHAR(100) | Medical specialty |
| qualifications | VARCHAR(500) | Degrees, certifications |
| bio | TEXT | Doctor's biography |
| consultation_fee | DECIMAL(10,2) | Fee per appointment |
| created_at | TIMESTAMP | Profile creation date |

### departments
Hospital departments/specialties.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Department name |
| description | TEXT | Department description |
| created_at | TIMESTAMP | Creation date |

### time_slots
Doctor's weekly availability schedule.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| doctor_id | BIGINT | FK to doctors table |
| day_of_week | ENUM | MONDAY through SUNDAY |
| start_time | TIME | Slot start time |
| end_time | TIME | Slot end time |
| is_available | BOOLEAN | Slot availability |
| created_at | TIMESTAMP | Creation date |

### appointments
Booked appointments between patients and doctors.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| patient_id | BIGINT | FK to users table |
| doctor_id | BIGINT | FK to doctors table |
| appointment_date | DATE | Date of appointment |
| start_time | TIME | Appointment start |
| end_time | TIME | Appointment end |
| status | ENUM | SCHEDULED, COMPLETED, CANCELLED, NO_SHOW |
| patient_notes | TEXT | Notes from patient |
| doctor_notes | TEXT | Notes from doctor |
| cancellation_reason | VARCHAR(500) | Reason if cancelled |
| created_at | TIMESTAMP | Booking date |
| updated_at | TIMESTAMP | Last update date |

---

# 5. REST API SPECIFICATION

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | User login | No |
| POST | /auth/refresh | Refresh token | Yes |
| GET | /auth/me | Get current user | Yes |

### Register Request
```json
POST /api/v1/auth/register
{
  "email": "patient@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "079-1234-5678"
}
```

### Login Request
```json
POST /api/v1/auth/login
{
  "email": "patient@example.com",
  "password": "Password123!"
}
```

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "patient@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PATIENT"
  }
}
```

## Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /appointments/my-appointments | Get all my appointments |
| GET | /appointments/my-appointments/upcoming | Get upcoming appointments |
| GET | /appointments/my-appointments/stats | Get appointment statistics |
| POST | /appointments | Book new appointment |
| PUT | /appointments/{id}/cancel | Cancel appointment |
| PUT | /appointments/{id}/reschedule | Reschedule appointment |

### Book Appointment Request
```json
POST /api/v1/appointments
Authorization: Bearer <token>
{
  "doctorId": 1,
  "appointmentDate": "2026-01-25",
  "startTime": "09:00",
  "patientNotes": "Regular checkup"
}
```

### Appointment Response
```json
{
  "id": 15,
  "patientId": 10,
  "patientName": "John Doe",
  "doctorId": 1,
  "doctorName": "James Smith",
  "departmentName": "Cardiology",
  "appointmentDate": "2026-01-25",
  "startTime": "09:00:00",
  "endTime": "09:30:00",
  "status": "SCHEDULED",
  "patientNotes": "Regular checkup",
  "confirmationNumber": "APT-20260125-001"
}
```

## Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /appointments/doctor/appointments | Get all appointments |
| GET | /appointments/doctor/appointments/today | Get today's appointments |
| GET | /appointments/doctor/appointments/upcoming | Get upcoming appointments |
| GET | /appointments/doctor/stats | Get statistics |
| PUT | /appointments/doctor/{id}/complete | Mark as completed |
| PUT | /appointments/doctor/{id}/no-show | Mark as no-show |
| PUT | /appointments/doctor/{id}/cancel | Cancel appointment |
| PUT | /appointments/doctor/{id}/notes | Update notes |

## Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /appointments/admin/all | Get all appointments |
| GET | /appointments/admin/upcoming | Get all upcoming |
| GET | /appointments/admin/stats | Get overall statistics |
| PUT | /appointments/admin/{id}/cancel | Cancel any appointment |
| GET | /admin/users | Get all users |
| GET | /admin/doctors | Get all doctors |
| GET | /departments | Get all departments |

## Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /doctors | Get all doctors |
| GET | /doctors/{id} | Get doctor by ID |
| GET | /departments | Get all departments |
| GET | /appointments/available-slots | Get available time slots |

### Available Slots Request
```
GET /api/v1/appointments/available-slots?doctorId=1&date=2026-01-25
```

### Available Slots Response
```json
[
  {
    "startTime": "09:00:00",
    "endTime": "09:30:00",
    "available": true
  },
  {
    "startTime": "09:30:00",
    "endTime": "10:00:00",
    "available": false
  }
]
```

---

# 6. AUTHENTICATION & SECURITY

## JWT (JSON Web Token) Flow

```
1. USER LOGIN
   ┌────────┐                    ┌────────┐
   │ Client │─── POST /login ───▶│ Server │
   │        │    email/password  │        │
   └────────┘                    └────────┘
                                      │
                                      ▼
                               Validate credentials
                               Generate JWT token
                                      │
                                      ▼
   ┌────────┐                    ┌────────┐
   │ Client │◀── JWT Token ──────│ Server │
   │        │                    │        │
   └────────┘                    └────────┘
        │
        ▼
   Store token in localStorage

2. AUTHENTICATED REQUEST
   ┌────────┐                    ┌────────┐
   │ Client │─── GET /data ─────▶│ Server │
   │        │   Authorization:   │        │
   │        │   Bearer <token>   │        │
   └────────┘                    └────────┘
                                      │
                                      ▼
                               Validate JWT token
                               Extract user info
                               Process request
                                      │
                                      ▼
   ┌────────┐                    ┌────────┐
   │ Client │◀── Response ───────│ Server │
   └────────┘                    └────────┘
```

## JWT Token Structure

```
Header.Payload.Signature

Header (Algorithm):
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (Claims):
{
  "sub": "user@example.com",    // Subject (email)
  "userId": 1,                   // User ID
  "role": "PATIENT",            // User role
  "iat": 1705689600,            // Issued at
  "exp": 1705776000             // Expiration (24h)
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## Role-Based Access Control

| Role | Permissions |
|------|-------------|
| PATIENT | Book/view/cancel own appointments |
| DOCTOR | View/manage assigned appointments |
| ADMIN | Full system access |

## Password Security

- Passwords hashed with BCrypt (strength 12)
- Minimum 8 characters required
- Must contain uppercase, lowercase, number
- Never stored in plain text

---

# 7. BACKEND STRUCTURE

## Project Structure

```
backend/
├── src/main/java/com/hospitalapp/backend/
│   ├── HospitalBookingApiApplication.java    # Main entry point
│   │
│   ├── config/                                # Configuration classes
│   │   ├── SecurityConfig.java               # Spring Security setup
│   │   ├── CorsConfig.java                   # CORS configuration
│   │   └── AsyncConfig.java                  # Async processing
│   │
│   ├── controller/                            # REST API endpoints
│   │   ├── AuthController.java               # Login/register
│   │   ├── AppointmentController.java        # Appointment CRUD
│   │   ├── DoctorController.java             # Doctor endpoints
│   │   └── DepartmentController.java         # Department endpoints
│   │
│   ├── service/                               # Business logic
│   │   ├── AuthService.java                  # Authentication logic
│   │   ├── AppointmentService.java           # Appointment logic
│   │   ├── DoctorService.java                # Doctor logic
│   │   └── EmailService.java                 # Email notifications
│   │
│   ├── repository/                            # Database access
│   │   ├── UserRepository.java
│   │   ├── DoctorRepository.java
│   │   ├── AppointmentRepository.java
│   │   ├── DepartmentRepository.java
│   │   └── TimeSlotRepository.java
│   │
│   ├── model/                                 # JPA entities
│   │   ├── User.java
│   │   ├── Doctor.java
│   │   ├── Department.java
│   │   ├── Appointment.java
│   │   └── TimeSlot.java
│   │
│   ├── dto/                                   # Data transfer objects
│   │   ├── auth/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── AuthResponse.java
│   │   └── appointment/
│   │       ├── CreateAppointmentRequest.java
│   │       ├── AppointmentResponse.java
│   │       └── ...
│   │
│   ├── security/                              # Security components
│   │   ├── JwtUtil.java                      # JWT generation/validation
│   │   ├── JwtAuthenticationFilter.java      # Request filter
│   │   └── CustomUserDetailsService.java     # User loading
│   │
│   └── exception/                             # Error handling
│       ├── GlobalExceptionHandler.java
│       ├── ResourceNotFoundException.java
│       └── ...
│
└── src/main/resources/
    ├── application.properties                 # Configuration
    ├── data.sql                              # Seed data
    └── templates/email/                       # Email templates
        ├── appointment-confirmation.html
        ├── appointment-cancellation.html
        └── ...
```

## Key Classes Explained

### Entity (Model) Example - User.java
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Role role;  // PATIENT, DOCTOR, ADMIN

    // Getters, setters, constructors...
}
```

### Repository Example - UserRepository.java
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(User.Role role);
}
```

### Service Example - AppointmentService.java
```java
@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    public AppointmentResponse bookAppointment(Long patientId,
                                                CreateAppointmentRequest request) {
        // 1. Validate patient exists
        // 2. Validate doctor exists
        // 3. Check slot availability
        // 4. Create appointment
        // 5. Send confirmation email
        // 6. Return response
    }
}
```

### Controller Example - AppointmentController.java
```java
@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CreateAppointmentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(appointmentService.bookAppointment(user.getUserId(), request));
    }
}
```

---

# 8. FRONTEND STRUCTURE

## Project Structure

```
frontend/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
│
└── src/
    ├── index.jsx                 # React entry point
    ├── App.jsx                   # Main app with routing
    │
    ├── context/                  # React Context (state)
    │   ├── AuthContext.jsx      # Authentication state
    │   └── ToastContext.jsx     # Notifications
    │
    ├── services/                 # API communication
    │   └── api.js               # Axios instance
    │
    ├── pages/                    # Page components
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── Doctors.jsx
    │   ├── BookAppointment.jsx
    │   └── Appointments.jsx
    │
    ├── components/               # Reusable components
    │   ├── layout/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── ui/
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   └── Input.jsx
    │   └── AppointmentCard.jsx
    │
    └── assets/                   # Static files
        └── images/
```

## Key Components Explained

### AuthContext.jsx - Managing Authentication State
```jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### api.js - Axios Configuration
```jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Page Component Example - Dashboard.jsx
```jsx
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [statsRes, aptsRes] = await Promise.all([
        api.get('/appointments/my-appointments/stats'),
        api.get('/appointments/my-appointments/upcoming'),
      ]);
      setStats(statsRes.data);
      setAppointments(aptsRes.data);
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <StatsCards stats={stats} />
      <AppointmentList appointments={appointments} />
    </div>
  );
};
```

---

# 9. CONFIGURATION

## Development Configuration (application.properties)

```properties
# Server
server.port=8080

# H2 Database (Development)
spring.datasource.url=jdbc:h2:mem:hospital_booking_db
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# JWT Security
jwt.secret=aG9zcGl0YWxCb29raW5nU2VjcmV0S2V5...
jwt.expiration=86400000

# Email (disabled in development)
app.email.enabled=false

# CORS
app.cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

## Seed Data (data.sql)

The system comes with pre-loaded test data:

**Test Accounts (Password: Password123!):**

| Email | Role |
|-------|------|
| admin@hospital.com | ADMIN |
| dr.smith@hospital.com | DOCTOR |
| dr.johnson@hospital.com | DOCTOR |
| john.doe@email.com | PATIENT |
| jane.doe@email.com | PATIENT |

**Departments:**
- Cardiology
- Dermatology
- Neurology
- Orthopedics
- Pediatrics
- General Medicine
- Ophthalmology
- ENT

---

# 10. HOW IT ALL WORKS TOGETHER

## Complete User Journey: Booking an Appointment

### Step 1: User Opens Website
```
Browser → http://localhost:5173
       ↓
React App loads (App.jsx)
       ↓
Checks localStorage for token
       ↓
If no token → Show Login page
If token → Validate with /auth/me → Show Dashboard
```

### Step 2: User Logs In
```
User enters email/password
       ↓
Frontend: api.post('/auth/login', {email, password})
       ↓
Backend: AuthController.login()
       ↓
Backend: AuthService.authenticate()
  - Find user by email
  - Verify password with BCrypt
  - Generate JWT token
       ↓
Response: { token, user }
       ↓
Frontend: Save token to localStorage
Frontend: Update AuthContext
Frontend: Navigate to Dashboard
```

### Step 3: User Browses Doctors
```
Dashboard → Click "Find Doctors"
       ↓
Navigate to /doctors
       ↓
Frontend: api.get('/doctors')
       ↓
Backend: DoctorController.getAllDoctors()
       ↓
Backend: DoctorRepository.findAll()
       ↓
Database: SELECT * FROM doctors JOIN users...
       ↓
Response: List of doctors with profiles
       ↓
Frontend: Render doctor cards
```

### Step 4: User Books Appointment
```
Click "Book" on doctor card
       ↓
Navigate to /appointments/book?doctorId=1
       ↓
Frontend: api.get('/available-slots?doctorId=1&date=2026-01-25')
       ↓
Backend: Check which slots are free
       ↓
Frontend: Show available time slots
       ↓
User selects slot, clicks "Confirm Booking"
       ↓
Frontend: api.post('/appointments', {
  doctorId: 1,
  appointmentDate: "2026-01-25",
  startTime: "09:00"
})
       ↓
Backend: AppointmentController.bookAppointment()
       ↓
Backend: AppointmentService.bookAppointment()
  - Validate patient
  - Validate doctor
  - Check slot availability
  - Create appointment record
  - Send confirmation email (async)
       ↓
Database: INSERT INTO appointments...
       ↓
Response: { id, confirmationNumber, ... }
       ↓
Frontend: Show success message
Frontend: Navigate to appointments list
```

### Step 5: User Views Appointments
```
Dashboard → Click "View All Appointments"
       ↓
Navigate to /appointments
       ↓
Frontend: api.get('/appointments/my-appointments')
       ↓
Backend: AppointmentController.getMyAppointments()
       ↓
Backend: Security filter extracts user from JWT
       ↓
Backend: AppointmentRepository.findByPatientId(userId)
       ↓
Database: SELECT * FROM appointments WHERE patient_id = ?
       ↓
Response: List of user's appointments
       ↓
Frontend: Render appointment cards with status
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  User   │───▶│  React  │───▶│  Axios  │───▶│   API   │  │
│  │ Action  │    │Component│    │ Service │    │  Call   │  │
│  └─────────┘    └─────────┘    └─────────┘    └────┬────┘  │
└───────────────────────────────────────────────────│────────┘
                                                     │
                                          HTTP + JWT │
                                                     ▼
┌──────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │Security │───▶│Controller───▶│ Service │───▶│  Repo   │  │
│  │ Filter  │    │         │    │         │    │         │  │
│  └─────────┘    └─────────┘    └─────────┘    └────┬────┘  │
└───────────────────────────────────────────────────│────────┘
                                                     │
                                              JDBC   │
                                                     ▼
┌──────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
│                    ┌─────────┐                               │
│                    │  H2 /   │                               │
│                    │  MySQL  │                               │
│                    └─────────┘                               │
└──────────────────────────────────────────────────────────────┘
```

---

# QUICK REFERENCE

## Running the Application

### Start Backend
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Access H2 Database Console
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:hospital_booking_db
Username: sa
Password: (empty)
```

## Important URLs

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Frontend application |
| http://localhost:8080 | Backend API |
| http://localhost:8080/h2-console | Database console |
| http://localhost:8080/api/v1/... | REST API endpoints |

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | Password123! |
| Doctor | dr.smith@hospital.com | Password123! |
| Patient | john.doe@email.com | Password123! |

---

**Document Version:** 1.0
**Last Updated:** January 2026
**Project:** Hospital Appointment Booking System
**Student:** Najm (2356070)
