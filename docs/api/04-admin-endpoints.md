# Admin Endpoints

> **API Version:** v1
> **Last Updated:** January 12, 2026
> **Base URL:** `/api/v1/admin`

---

## Overview

Admin endpoints provide full system management capabilities including user management, doctor management, department management, and analytics.

**Endpoints:** 12
**Authentication Required:** Yes (ADMIN role)
**Rate Limit:** 5000 requests/hour

---

## Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard` | System-wide dashboard and statistics |
| GET | `/admin/users` | List all users with filtering |
| POST | `/admin/users` | Create new user |
| GET | `/admin/users/{id}` | Get user details |
| PUT | `/admin/users/{id}` | Update user |
| DELETE | `/admin/users/{id}` | Delete user |
| POST | `/admin/users/{id}/reset-password` | Reset user password |
| GET | `/admin/doctors` | List all doctors |
| POST | `/admin/doctors` | Create doctor profile |
| GET | `/admin/departments` | List departments |
| POST | `/admin/departments` | Create department |
| PUT | `/admin/departments/{id}` | Update department |
| DELETE | `/admin/departments/{id}` | Delete department |
| GET | `/admin/appointments` | View all appointments |
| GET | `/admin/analytics` | System analytics and reports |

---

## 1. Get Admin Dashboard

```http
GET /api/v1/admin/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "systemStats": {
      "totalUsers": 1247,
      "totalDoctors": 45,
      "totalPatients": 1200,
      "totalAdmins": 2,
      "activeUsers": 1245
    },
    "appointmentStats": {
      "today": 186,
      "thisMonth": 5234,
      "lastMonth": 4892,
      "growth": 7.0
    },
    "recentActivity": [
      {
        "type": "USER_REGISTERED",
        "user": "sarah.chen@example.com",
        "timestamp": "2026-01-12T10:25:00Z"
      },
      {
        "type": "APPOINTMENT_BOOKED",
        "details": "Sarah Chen booked with Dr. Thompson",
        "timestamp": "2026-01-12T10:20:00Z"
      }
    ],
    "topDoctors": [
      {
        "id": 5,
        "name": "Dr. Emily Thompson",
        "appointments": 187,
        "rating": 4.8
      }
    ],
    "topDepartments": [
      {
        "id": 1,
        "name": "Cardiology",
        "appointments": 1234,
        "percentage": 24
      }
    ]
  }
}
```

---

## 2. User Management

### List Users

```http
GET /api/v1/admin/users?role=PATIENT&status=active&page=1&limit=10
```

**Query Parameters:**
- `role`: PATIENT, DOCTOR, ADMIN
- `status`: active, inactive, all
- `search`: Search by name or email
- `page`, `limit`: Pagination
- `sortBy`: name, email, createdAt
- `order`: asc, desc

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "firstName": "Sarah",
        "lastName": "Chen",
        "email": "sarah.chen@example.com",
        "phoneNumber": "+44 7700 900000",
        "role": "PATIENT",
        "isActive": true,
        "createdAt": "2026-01-10T08:00:00Z",
        "lastLogin": "2026-01-12T09:30:00Z",
        "appointmentCount": 10
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 125,
      "totalItems": 1247
    }
  }
}
```

### Create User

```http
POST /api/v1/admin/users
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+44 7700 900111",
  "password": "TempPass123",
  "role": "PATIENT",
  "sendWelcomeEmail": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1248,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "PATIENT",
    "isActive": true,
    "createdAt": "2026-01-12T10:30:00Z"
  },
  "message": "User created successfully"
}
```

### Update User

```http
PUT /api/v1/admin/users/1248
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+44 7700 900222",
  "isActive": true
}
```

**Note:** Email and role cannot be changed via this endpoint.

### Delete User

```http
DELETE /api/v1/admin/users/1248
```

**Validation:**
- Cannot delete users with upcoming appointments
- Soft delete (sets isActive = false) by default
- Hard delete requires `?force=true` parameter

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1248,
    "deleted": true,
    "deletedAt": "2026-01-12T10:30:00Z"
  },
  "message": "User deleted successfully"
}
```

**Error if appointments exist:**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Cannot delete user with active appointments",
    "details": {
      "upcomingAppointments": 2,
      "appointmentIds": [123, 124]
    }
  }
}
```

### Reset User Password

```http
POST /api/v1/admin/users/1248/reset-password
```

**Request Body:**
```json
{
  "newPassword": "NewTempPass456",
  "sendEmail": true,
  "requireChange": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1248,
    "passwordReset": true,
    "emailSent": true,
    "requireChange": true
  },
  "message": "Password reset successfully"
}
```

---

## 3. Doctor Management

### List Doctors

```http
GET /api/v1/admin/doctors?department=1&status=active
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 5,
        "userId": 2,
        "firstName": "Emily",
        "lastName": "Thompson",
        "email": "dr.thompson@hospital.com",
        "department": {
          "id": 1,
          "name": "Cardiology"
        },
        "specialty": "General Cardiology",
        "qualifications": "MD, MBBS",
        "consultationFee": 150.00,
        "rating": 4.8,
        "totalAppointments": 1247,
        "monthlyAppointments": 87,
        "isActive": true,
        "joinedAt": "2021-03-15T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### Create Doctor

```http
POST /api/v1/admin/doctors
```

**Request Body:**
```json
{
  "user": {
    "firstName": "James",
    "lastName": "Wilson",
    "email": "dr.wilson@hospital.com",
    "phoneNumber": "+44 20 1234 5678",
    "password": "DoctorPass123"
  },
  "doctorProfile": {
    "departmentId": 2,
    "specialty": "Dermatology",
    "qualifications": "MBBS, MD (Derm)",
    "bio": "Dr. Wilson specializes in skin conditions...",
    "consultationFee": 120.00
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "userId": 1249,
    "doctorId": 46,
    "email": "dr.wilson@hospital.com",
    "department": "Dermatology",
    "createdAt": "2026-01-12T10:30:00Z"
  },
  "message": "Doctor profile created successfully"
}
```

---

## 4. Department Management

### List Departments

```http
GET /api/v1/admin/departments
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cardiology",
      "description": "Heart and cardiovascular system treatment",
      "doctorCount": 8,
      "monthlyAppointments": 1234,
      "createdAt": "2021-01-15T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Dermatology",
      "description": "Skin conditions and cosmetic treatments",
      "doctorCount": 5,
      "monthlyAppointments": 987,
      "createdAt": "2021-01-15T00:00:00Z"
    }
  ]
}
```

### Create Department

```http
POST /api/v1/admin/departments
```

**Request Body:**
```json
{
  "name": "Orthopedics",
  "description": "Bone, joint, and muscle treatment"
}
```

**Validation:**
- Name must be unique
- Name: 2-100 characters
- Description: Max 500 characters

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Orthopedics",
    "description": "Bone, joint, and muscle treatment",
    "doctorCount": 0,
    "createdAt": "2026-01-12T10:30:00Z"
  },
  "message": "Department created successfully"
}
```

### Update Department

```http
PUT /api/v1/admin/departments/10
```

**Request Body:**
```json
{
  "name": "Orthopedics & Sports Medicine",
  "description": "Bone, joint, muscle treatment and sports injury management"
}
```

### Delete Department

```http
DELETE /api/v1/admin/departments/10
```

**Validation:**
- Cannot delete department with assigned doctors
- Returns error with doctor count

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Cannot delete department with assigned doctors",
    "details": {
      "doctorCount": 6,
      "departmentName": "Cardiology"
    }
  }
}
```

---

## 5. View All Appointments

```http
GET /api/v1/admin/appointments?startDate=2026-01-01&endDate=2026-01-31&status=SCHEDULED
```

**Query Parameters:**
- `startDate`, `endDate`: Date range
- `status`: Filter by status
- `doctorId`: Filter by doctor
- `departmentId`: Filter by department
- `patientId`: Filter by patient
- `page`, `limit`: Pagination

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 123,
        "confirmationNumber": "APT-2026-00123",
        "appointmentDate": "2026-01-15",
        "startTime": "09:00",
        "status": "SCHEDULED",
        "patient": {
          "id": 1,
          "name": "Sarah Chen",
          "email": "sarah.chen@example.com"
        },
        "doctor": {
          "id": 5,
          "name": "Dr. Emily Thompson",
          "department": "Cardiology"
        },
        "createdAt": "2026-01-10T14:30:00Z"
      }
    ],
    "pagination": {...},
    "summary": {
      "total": 5234,
      "scheduled": 1234,
      "completed": 3500,
      "cancelled": 400,
      "noShows": 100
    }
  }
}
```

---

## 6. Analytics & Reports

```http
GET /api/v1/admin/analytics?period=last_30_days
```

**Query Parameters:**
- `period`: today, last_7_days, last_30_days, last_90_days, custom
- `startDate`, `endDate`: For custom period
- `metric`: appointments, users, revenue, departments

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-12-13",
      "end": "2026-01-12",
      "days": 30
    },
    "keyMetrics": {
      "totalAppointments": 5234,
      "completedAppointments": 4523,
      "cancelledAppointments": 487,
      "noShows": 224,
      "newPatients": 247,
      "averageDailyAppointments": 174,
      "completionRate": 86.4,
      "cancellationRate": 9.3,
      "noShowRate": 4.3
    },
    "trends": {
      "daily": [
        {
          "date": "2026-01-12",
          "appointments": 186,
          "completed": 156,
          "cancelled": 20,
          "noShows": 10
        }
      ]
    },
    "topDoctors": [
      {
        "id": 5,
        "name": "Dr. Emily Thompson",
        "appointments": 187,
        "completionRate": 92.5,
        "rating": 4.8
      }
    ],
    "topDepartments": [
      {
        "id": 1,
        "name": "Cardiology",
        "appointments": 1234,
        "percentage": 23.6,
        "growth": 12.5
      }
    ],
    "cancellationReasons": [
      {
        "reason": "Schedule conflict",
        "count": 187,
        "percentage": 38.4
      },
      {
        "reason": "Feeling better",
        "count": 132,
        "percentage": 27.1
      }
    ],
    "peakHours": [
      {
        "hour": "09:00",
        "appointments": 245
      },
      {
        "hour": "10:00",
        "appointments": 238
      }
    ],
    "peakDays": {
      "MONDAY": 198,
      "TUESDAY": 165,
      "WEDNESDAY": 178,
      "THURSDAY": 152,
      "FRIDAY": 189
    }
  }
}
```

---

## Business Rules

### User Management
1. Admin can create/modify any user type
2. Cannot delete self (current admin)
3. At least one active admin must exist
4. Email addresses must be unique across all users

### Doctor Management
1. Doctor profile requires existing user with DOCTOR role
2. Doctor must be assigned to a department
3. Cannot delete doctor with future appointments

### Department Management
1. Department names must be unique
2. Cannot delete department with assigned doctors
3. Deleting department requires reassigning doctors first

---

## Error Handling

Common error scenarios:

**Insufficient Permissions (403):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin role required for this operation"
  }
}
```

**Resource Conflict (409):**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Cannot perform operation due to existing dependencies",
    "details": {
      "reason": "Department has 6 assigned doctors"
    }
  }
}
```

---

## Next: Common Endpoints

See [05-common-endpoints.md](05-common-endpoints.md) for public and shared endpoints.
