# Doctor Endpoints

> **API Version:** v1
> **Last Updated:** January 12, 2026
> **Base URL:** `/api/v1/doctor`

---

## Overview

Doctor endpoints allow doctors to manage their schedule, availability, view appointments, and add patient notes.

**Endpoints:** 10
**Authentication Required:** Yes (DOCTOR role)
**Rate Limit:** 2000 requests/hour

---

## Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| GET | `/doctor/dashboard` | Get dashboard with today's schedule |
| GET | `/doctor/appointments` | Get all appointments (filter by date/status) |
| GET | `/doctor/appointments/{id}` | Get appointment details with patient history |
| PUT | `/doctor/appointments/{id}/status` | Mark appointment status (completed/no-show) |
| PUT | `/doctor/appointments/{id}/notes` | Add/update doctor notes |
| GET | `/doctor/schedule` | Get weekly/monthly schedule |
| GET | `/doctor/availability` | Get current availability settings |
| PUT | `/doctor/availability` | Update weekly availability |
| POST | `/doctor/availability/block` | Block specific dates (holidays/leave) |
| DELETE | `/doctor/availability/block/{id}` | Remove blocked date |
| GET | `/doctor/profile` | Get doctor profile |
| PUT | `/doctor/profile` | Update doctor profile |

---

## Key Endpoints

### 1. Get Doctor Dashboard

```http
GET /api/v1/doctor/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "todayAppointments": [
      {
        "id": 123,
        "appointmentDate": "2026-01-12",
        "startTime": "09:00",
        "endTime": "09:30",
        "status": "SCHEDULED",
        "patient": {
          "id": 1,
          "firstName": "Sarah",
          "lastName": "Chen",
          "age": 34,
          "gender": "Female"
        },
        "patientNotes": "Chest pain follow-up",
        "lastVisit": "2025-12-20"
      }
    ],
    "todayStats": {
      "total": 8,
      "completed": 3,
      "upcoming": 5,
      "noShows": 0
    },
    "weekStats": {
      "monday": 8,
      "tuesday": 6,
      "wednesday": 7,
      "thursday": 5,
      "friday": 8
    }
  }
}
```

---

### 2. Get Appointments (Filtered)

```http
GET /api/v1/doctor/appointments?date=2026-01-12&status=SCHEDULED
```

**Query Parameters:**
- `date` (optional): Filter by specific date (YYYY-MM-DD)
- `startDate` / `endDate` (optional): Date range
- `status` (optional): SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
- `page`, `limit`: Pagination

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {...}
  }
}
```

---

### 3. Get Appointment Details

```http
GET /api/v1/doctor/appointments/123
```

**Response includes patient history:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "appointmentDate": "2026-01-15",
    "startTime": "09:00",
    "patient": {
      "id": 1,
      "firstName": "Sarah",
      "lastName": "Chen",
      "email": "sarah.chen@example.com",
      "phoneNumber": "+44 7700 900000",
      "dateOfBirth": "1992-03-15",
      "age": 34,
      "gender": "Female"
    },
    "patientNotes": "Chest pain for 2 weeks",
    "doctorNotes": null,
    "previousVisits": [
      {
        "id": 89,
        "date": "2025-12-20",
        "doctorNotes": "Initial consultation for chest pain. ECG normal. Prescribed beta-blockers.",
        "status": "COMPLETED"
      }
    ],
    "status": "SCHEDULED"
  }
}
```

---

### 4. Update Appointment Status

```http
PUT /api/v1/doctor/appointments/123/status
```

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Valid Status Transitions:**
- SCHEDULED → COMPLETED
- SCHEDULED → NO_SHOW
- SCHEDULED → CANCELLED (by doctor)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "status": "COMPLETED",
    "completedAt": "2026-01-15T09:30:00Z"
  },
  "message": "Appointment status updated successfully"
}
```

---

### 5. Add/Update Doctor Notes

```http
PUT /api/v1/doctor/appointments/123/notes
```

**Request Body:**
```json
{
  "doctorNotes": "Follow-up consultation completed. Patient reports significant improvement in symptoms. Continue current medication. Follow-up in 4 weeks."
}
```

**Validation:**
- Max 2000 characters
- Only doctor who owns appointment can add notes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "doctorNotes": "Follow-up consultation completed...",
    "updatedAt": "2026-01-15T09:35:00Z"
  },
  "message": "Notes saved successfully"
}
```

---

### 6. Get Weekly Schedule

```http
GET /api/v1/doctor/schedule?week=2026-W03
```

**Query Parameters:**
- `week` (optional): ISO week format (YYYY-Www), default: current week
- `view`: `week` (default) or `day`

**Response:**
```json
{
  "success": true,
  "data": {
    "week": "2026-W03",
    "startDate": "2026-01-12",
    "endDate": "2026-01-18",
    "schedule": {
      "MONDAY": [
        {
          "time": "09:00-09:30",
          "appointment": {
            "id": 123,
            "patient": "Sarah Chen",
            "status": "SCHEDULED"
          }
        },
        {
          "time": "09:30-10:00",
          "appointment": {
            "id": 124,
            "patient": "Robert Martinez",
            "status": "SCHEDULED"
          }
        },
        {
          "time": "10:00-10:30",
          "type": "BREAK"
        }
      ],
      "TUESDAY": [...]
    },
    "summary": {
      "totalAppointments": 34,
      "totalHours": 17
    }
  }
}
```

---

### 7. Get Availability Settings

```http
GET /api/v1/doctor/availability
```

**Response:**
```json
{
  "success": true,
  "data": {
    "weeklySchedule": [
      {
        "id": 1,
        "dayOfWeek": "MONDAY",
        "isAvailable": true,
        "startTime": "09:00",
        "endTime": "17:00",
        "breaks": [
          {
            "startTime": "10:00",
            "endTime": "10:30",
            "type": "BREAK"
          },
          {
            "startTime": "12:00",
            "endTime": "13:00",
            "type": "LUNCH"
          }
        ]
      },
      {
        "dayOfWeek": "SATURDAY",
        "isAvailable": false
      },
      {
        "dayOfWeek": "SUNDAY",
        "isAvailable": false
      }
    ],
    "blockedDates": [
      {
        "id": 5,
        "startDate": "2025-12-24",
        "endDate": "2025-12-26",
        "reason": "Christmas Holiday"
      },
      {
        "id": 6,
        "startDate": "2026-02-10",
        "endDate": "2026-02-14",
        "reason": "Medical Conference"
      }
    ],
    "appointmentDuration": 30,
    "bufferTime": 0
  }
}
```

---

### 8. Update Weekly Availability

```http
PUT /api/v1/doctor/availability
```

**Request Body:**
```json
{
  "weeklySchedule": [
    {
      "dayOfWeek": "MONDAY",
      "isAvailable": true,
      "startTime": "09:00",
      "endTime": "17:00",
      "breaks": [
        {
          "startTime": "10:00",
          "endTime": "10:30"
        },
        {
          "startTime": "12:00",
          "endTime": "13:00"
        }
      ]
    }
  ],
  "appointmentDuration": 30,
  "bufferTime": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "weeklySchedule": [...],
    "updatedAt": "2026-01-12T10:30:00Z"
  },
  "message": "Availability updated successfully"
}
```

---

### 9. Block Specific Dates

```http
POST /api/v1/doctor/availability/block
```

**Request Body:**
```json
{
  "startDate": "2026-01-20",
  "endDate": "2026-01-25",
  "reason": "Annual Leave"
}
```

**Validation:**
- Start date must be in future
- End date must be after start date
- Checks for existing appointments in date range

**Response (if appointments exist):**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "startDate": "2026-01-20",
    "endDate": "2026-01-25",
    "reason": "Annual Leave",
    "affectedAppointments": 12,
    "warning": "12 appointments will be cancelled. Patients will be notified."
  },
  "message": "Dates blocked successfully"
}
```

---

### 10. Update Doctor Profile

```http
PUT /api/v1/doctor/profile
```

**Request Body:**
```json
{
  "specialty": "General Cardiology",
  "qualifications": "MD, MBBS, MRCP",
  "bio": "Dr. Thompson specializes in general cardiology with 15 years of experience...",
  "consultationFee": 150.00,
  "photoUrl": "/uploads/doctors/5.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "userId": 2,
    "departmentId": 1,
    "specialty": "General Cardiology",
    "qualifications": "MD, MBBS, MRCP",
    "bio": "Dr. Thompson specializes...",
    "consultationFee": 150.00,
    "rating": 4.8,
    "totalAppointments": 1247,
    "updatedAt": "2026-01-12T10:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

## Business Rules

### Appointment Management
1. Only assigned doctor can view/edit appointment
2. Cannot change status of past appointments
3. Doctor notes are private (not visible to patients)
4. Email notifications sent on status changes

### Availability Management
1. Changes to availability apply to future appointments only
2. Blocking dates with existing appointments requires confirmation
3. Cannot delete availability if appointments exist
4. Minimum 30-minute appointment slots

---

## Next: Admin Endpoints

See [04-admin-endpoints.md](04-admin-endpoints.md) for administrative operations.
