# Patient Endpoints

> **API Version:** v1
> **Last Updated:** January 12, 2026
> **Base URL:** `/api/v1/patient`

---

## Overview

Patient endpoints allow patients to manage their appointments, view doctor information, and update their profile.

**Endpoints:** 8
**Authentication Required:** Yes (PATIENT role)
**Rate Limit:** 1000 requests/hour

---

## Table of Contents

1. [Get Patient Dashboard](#1-get-patient-dashboard)
2. [Book Appointment](#2-book-appointment)
3. [Get My Appointments](#3-get-my-appointments)
4. [Get Appointment Details](#4-get-appointment-details)
5. [Reschedule Appointment](#5-reschedule-appointment)
6. [Cancel Appointment](#6-cancel-appointment)
7. [Get Patient Profile](#7-get-patient-profile)
8. [Update Patient Profile](#8-update-patient-profile)

---

## 1. Get Patient Dashboard

Get dashboard summary with upcoming appointments and statistics.

### Endpoint

```http
GET /api/v1/patient/dashboard
```

### Authentication

Required (PATIENT role)

### Request Headers

```http
Authorization: Bearer <jwt_token>
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "upcomingAppointments": [
      {
        "id": 123,
        "appointmentDate": "2026-01-15",
        "startTime": "09:00",
        "endTime": "09:30",
        "status": "SCHEDULED",
        "doctor": {
          "id": 5,
          "firstName": "Emily",
          "lastName": "Thompson",
          "specialty": "General Cardiology",
          "department": "Cardiology",
          "photoUrl": "/uploads/doctors/5.jpg"
        },
        "location": "Room 305, Cardiology Wing",
        "patientNotes": "Follow-up for chest pain"
      }
    ],
    "appointmentStats": {
      "upcoming": 2,
      "past": 8,
      "total": 10
    },
    "nextAppointment": {
      "date": "2026-01-15",
      "time": "09:00",
      "daysUntil": 3,
      "doctorName": "Dr. Emily Thompson"
    }
  },
  "message": "Dashboard data retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

---

## 2. Book Appointment

Create a new appointment with a doctor.

### Endpoint

```http
POST /api/v1/patient/appointments
```

### Authentication

Required (PATIENT role)

### Request Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Request Body

```json
{
  "doctorId": 5,
  "appointmentDate": "2026-01-15",
  "startTime": "09:00",
  "endTime": "09:30",
  "patientNotes": "Chest pain for 2 weeks, occasional shortness of breath",
  "sendConfirmation": true,
  "sendReminder": true
}
```

### Request Parameters

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `doctorId` | integer | Yes | Must exist | ID of the doctor |
| `appointmentDate` | string | Yes | ISO 8601 date, future date | Appointment date |
| `startTime` | string | Yes | HH:MM format | Start time |
| `endTime` | string | Yes | HH:MM format, after startTime | End time |
| `patientNotes` | string | No | Max 500 chars | Reason for visit |
| `sendConfirmation` | boolean | No | Default: true | Send email confirmation |
| `sendReminder` | boolean | No | Default: true | Send 24h reminder |

### Validation Rules

```javascript
doctorId: {
  required: true,
  exists: "doctors table",
  message: "Doctor not found"
}

appointmentDate: {
  required: true,
  format: "YYYY-MM-DD",
  futureDate: true,
  message: "Appointment date must be in the future"
}

startTime: {
  required: true,
  format: "HH:MM",
  withinDoctorAvailability: true,
  message: "Selected time slot is not available"
}

endTime: {
  required: true,
  format: "HH:MM",
  afterStartTime: true,
  duration: 30, // minutes
  message: "End time must be 30 minutes after start time"
}

patientNotes: {
  required: false,
  maxLength: 500
}
```

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": 123,
    "confirmationNumber": "APT-2026-00123",
    "patientId": 1,
    "doctorId": 5,
    "appointmentDate": "2026-01-15",
    "startTime": "09:00",
    "endTime": "09:30",
    "status": "SCHEDULED",
    "patientNotes": "Chest pain for 2 weeks, occasional shortness of breath",
    "location": "Room 305, Cardiology Wing",
    "doctor": {
      "id": 5,
      "firstName": "Emily",
      "lastName": "Thompson",
      "specialty": "General Cardiology",
      "department": "Cardiology",
      "consultationFee": 150.00
    },
    "createdAt": "2026-01-12T10:30:00Z"
  },
  "message": "Appointment booked successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Responses

**Time Slot Not Available (409 Conflict)**

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "This time slot is already booked",
    "details": {
      "doctorId": 5,
      "appointmentDate": "2026-01-15",
      "startTime": "09:00",
      "availableSlots": ["09:30", "10:00", "10:30"]
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/patient/appointments"
}
```

**Doctor Not Available (400 Bad Request)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Doctor is not available on the selected date/time",
    "details": {
      "reason": "Doctor does not work on Sundays",
      "availableDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/patient/appointments"
}
```

### Business Rules

1. Appointments can only be booked during doctor's working hours
2. 30-minute slots only
3. Cannot double-book a time slot
4. Minimum booking: Same day (if time not passed)
5. Maximum booking: 3 months in advance
6. Patient can have maximum 5 upcoming appointments

---

## 3. Get My Appointments

Retrieve patient's appointments with filtering options.

### Endpoint

```http
GET /api/v1/patient/appointments
```

### Authentication

Required (PATIENT role)

### Request Headers

```http
Authorization: Bearer <jwt_token>
```

### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `status` | string | all | Filter by status: `upcoming`, `past`, `cancelled`, `all` |
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page (max 100) |
| `sortBy` | string | appointmentDate | Sort field |
| `order` | string | asc | Sort order: `asc` or `desc` |

### Example Request

```http
GET /api/v1/patient/appointments?status=upcoming&page=1&limit=10
```

### Success Response (200 OK)

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
        "endTime": "09:30",
        "status": "SCHEDULED",
        "patientNotes": "Chest pain follow-up",
        "location": "Room 305, Cardiology Wing",
        "doctor": {
          "id": 5,
          "firstName": "Emily",
          "lastName": "Thompson",
          "specialty": "General Cardiology",
          "department": "Cardiology",
          "photoUrl": "/uploads/doctors/5.jpg"
        },
        "createdAt": "2026-01-10T14:30:00Z"
      },
      {
        "id": 124,
        "confirmationNumber": "APT-2026-00124",
        "appointmentDate": "2026-01-17",
        "startTime": "14:00",
        "endTime": "14:30",
        "status": "SCHEDULED",
        "patientNotes": "Annual skin check",
        "location": "Room 102, Dermatology Department",
        "doctor": {
          "id": 8,
          "firstName": "James",
          "lastName": "Wilson",
          "specialty": "Skin Specialist",
          "department": "Dermatology",
          "photoUrl": "/uploads/doctors/8.jpg"
        },
        "createdAt": "2026-01-11T09:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "totalItems": 2,
      "hasNext": false,
      "hasPrevious": false
    }
  },
  "message": "Appointments retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

---

## 4. Get Appointment Details

Retrieve detailed information about a specific appointment.

### Endpoint

```http
GET /api/v1/patient/appointments/{appointmentId}
```

### Authentication

Required (PATIENT role)

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `appointmentId` | integer | Appointment ID |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 123,
    "confirmationNumber": "APT-2026-00123",
    "appointmentDate": "2026-01-15",
    "startTime": "09:00",
    "endTime": "09:30",
    "status": "SCHEDULED",
    "patientNotes": "Chest pain for 2 weeks, occasional shortness of breath",
    "location": "Room 305, Cardiology Wing",
    "doctor": {
      "id": 5,
      "firstName": "Emily",
      "lastName": "Thompson",
      "specialty": "General Cardiology",
      "department": "Cardiology",
      "qualifications": "MD, MBBS",
      "experience": 15,
      "consultationFee": 150.00,
      "photoUrl": "/uploads/doctors/5.jpg",
      "rating": 4.8,
      "reviewCount": 124
    },
    "canReschedule": true,
    "canCancel": true,
    "cancellationDeadline": "2026-01-14T09:00:00Z",
    "createdAt": "2026-01-10T14:30:00Z",
    "updatedAt": "2026-01-10T14:30:00Z"
  },
  "message": "Appointment details retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Responses

**Appointment Not Found (404)**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Appointment not found",
    "details": {
      "appointmentId": 999
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/patient/appointments/999"
}
```

**Unauthorized Access (403)**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to view this appointment",
    "details": null
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/patient/appointments/123"
}
```

---

## 5. Reschedule Appointment

Change the date/time of an existing appointment.

### Endpoint

```http
PUT /api/v1/patient/appointments/{appointmentId}/reschedule
```

### Authentication

Required (PATIENT role)

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `appointmentId` | integer | Appointment ID to reschedule |

### Request Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Request Body

```json
{
  "newDate": "2026-01-16",
  "newStartTime": "10:00",
  "newEndTime": "10:30",
  "reason": "Schedule conflict with work meeting"
}
```

### Request Parameters

| Field | Type | Required | Description |
|---|---|---|---|
| `newDate` | string | Yes | New appointment date |
| `newStartTime` | string | Yes | New start time |
| `newEndTime` | string | Yes | New end time |
| `reason` | string | No | Reason for rescheduling |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 123,
    "confirmationNumber": "APT-2026-00123",
    "oldDate": "2026-01-15",
    "oldTime": "09:00",
    "newDate": "2026-01-16",
    "newTime": "10:00",
    "status": "SCHEDULED",
    "doctor": {
      "id": 5,
      "firstName": "Emily",
      "lastName": "Thompson"
    },
    "updatedAt": "2026-01-12T10:30:00Z"
  },
  "message": "Appointment rescheduled successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Responses

**Too Late to Reschedule (400)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Cannot reschedule within 24 hours of appointment",
    "details": {
      "appointmentDate": "2026-01-13",
      "currentTime": "2026-01-12T10:30:00Z",
      "minimumNotice": "24 hours"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/patient/appointments/123/reschedule"
}
```

### Business Rules

1. Can only reschedule SCHEDULED appointments
2. Must reschedule at least 24 hours before original appointment
3. New time slot must be available
4. Email notification sent to patient and doctor

---

## 6. Cancel Appointment

Cancel an existing appointment.

### Endpoint

```http
DELETE /api/v1/patient/appointments/{appointmentId}
```

### Alternative (with request body):

```http
PUT /api/v1/patient/appointments/{appointmentId}/cancel
```

### Authentication

Required (PATIENT role)

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `appointmentId` | integer | Appointment ID to cancel |

### Request Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Request Body (Optional)

```json
{
  "cancellationReason": "Schedule conflict - work meeting moved"
}
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 123,
    "confirmationNumber": "APT-2026-00123",
    "status": "CANCELLED",
    "cancelledAt": "2026-01-12T10:30:00Z",
    "cancellationReason": "Schedule conflict - work meeting moved"
  },
  "message": "Appointment cancelled successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Responses

**Cannot Cancel (400)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Cannot cancel appointment within 24 hours of scheduled time",
    "details": {
      "appointmentDate": "2026-01-13",
      "appointmentTime": "09:00",
      "currentTime": "2026-01-12T10:30:00Z",
      "minimumNotice": "24 hours"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/patient/appointments/123/cancel"
}
```

### Business Rules

1. Can only cancel SCHEDULED appointments
2. Must cancel at least 24 hours before appointment
3. Email notification sent to patient and doctor
4. Cancellation logged for analytics

---

## 7. Get Patient Profile

Retrieve the authenticated patient's profile information.

### Endpoint

```http
GET /api/v1/patient/profile
```

### Authentication

Required (PATIENT role)

### Request Headers

```http
Authorization: Bearer <jwt_token>
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Sarah",
    "lastName": "Chen",
    "email": "sarah.chen@example.com",
    "phoneNumber": "+44 7700 900000",
    "role": "PATIENT",
    "isActive": true,
    "emailPreferences": {
      "appointmentConfirmations": true,
      "appointmentReminders": true,
      "cancellationNotifications": true,
      "promotionalEmails": false
    },
    "statistics": {
      "totalAppointments": 10,
      "completedAppointments": 8,
      "upcomingAppointments": 2
    },
    "createdAt": "2025-06-15T08:00:00Z",
    "updatedAt": "2026-01-10T14:30:00Z"
  },
  "message": "Profile retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

---

## 8. Update Patient Profile

Update the authenticated patient's profile information.

### Endpoint

```http
PUT /api/v1/patient/profile
```

### Authentication

Required (PATIENT role)

### Request Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Request Body

```json
{
  "firstName": "Sarah",
  "lastName": "Chen",
  "phoneNumber": "+44 7700 900123",
  "emailPreferences": {
    "appointmentConfirmations": true,
    "appointmentReminders": true,
    "cancellationNotifications": true,
    "promotionalEmails": false
  }
}
```

### Request Parameters

| Field | Type | Required | Constraints |
|---|---|---|---|
| `firstName` | string | No | 2-100 chars |
| `lastName` | string | No | 2-100 chars |
| `phoneNumber` | string | No | UK format |
| `emailPreferences` | object | No | Boolean flags |

**Note:** Email cannot be changed via this endpoint. Password changes use separate endpoint.

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Sarah",
    "lastName": "Chen",
    "email": "sarah.chen@example.com",
    "phoneNumber": "+44 7700 900123",
    "emailPreferences": {
      "appointmentConfirmations": true,
      "appointmentReminders": true,
      "cancellationNotifications": true,
      "promotionalEmails": false
    },
    "updatedAt": "2026-01-12T10:30:00Z"
  },
  "message": "Profile updated successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

---

## Error Summary

| HTTP Status | Error Code | Common Causes |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid input, business rule violation |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Accessing another patient's appointment |
| 404 | `NOT_FOUND` | Appointment or doctor not found |
| 409 | `CONFLICT` | Time slot already booked |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |

---

## Next: Doctor Endpoints

See [03-doctor-endpoints.md](03-doctor-endpoints.md) for doctor-specific operations.
