# Common Endpoints

> **API Version:** v1
> **Last Updated:** January 12, 2026
> **Base URL:** `/api/v1`

---

## Overview

Common endpoints provide public and shared functionality accessible to all user roles or unauthenticated users.

**Endpoints:** 4
**Authentication Required:** Mixed (some public, some authenticated)
**Rate Limit:** 100 requests/hour (public), 1000 requests/hour (authenticated)

---

## Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/departments` | No | List all departments |
| GET | `/doctors` | No | List all doctors (filtered) |
| GET | `/doctors/{id}` | No | Get doctor profile |
| GET | `/doctors/{id}/availability` | No | Get doctor's available time slots |

---

## 1. List Departments

Get all medical departments.

### Endpoint

```http
GET /api/v1/departments
```

### Authentication

Not required (public endpoint)

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cardiology",
      "description": "Heart and cardiovascular system treatment",
      "doctorCount": 8
    },
    {
      "id": 2,
      "name": "Dermatology",
      "description": "Skin conditions and cosmetic treatments",
      "doctorCount": 5
    },
    {
      "id": 3,
      "name": "General Practice",
      "description": "Primary care and general health services",
      "doctorCount": 12
    },
    {
      "id": 4,
      "name": "Orthopedics",
      "description": "Bone, joint, and muscle treatment",
      "doctorCount": 6
    },
    {
      "id": 5,
      "name": "Pediatrics",
      "description": "Healthcare for infants, children, and adolescents",
      "doctorCount": 7
    }
  ],
  "message": "Departments retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Use Cases

- Patient browsing departments before booking
- Filter options in doctor search
- Department selection in registration forms

---

## 2. List Doctors

Search and filter available doctors.

### Endpoint

```http
GET /api/v1/doctors
```

### Authentication

Not required (public endpoint)

### Query Parameters

| Parameter | Type | Description | Example |
|---|---|---|---|
| `departmentId` | integer | Filter by department | `1` |
| `specialty` | string | Filter by specialty | `cardiology` |
| `search` | string | Search by name | `Thompson` |
| `availability` | string | Filter by availability | `today`, `this_week` |
| `sortBy` | string | Sort field | `name`, `rating`, `experience` |
| `order` | string | Sort order | `asc`, `desc` |
| `page` | integer | Page number | `1` |
| `limit` | integer | Items per page | `10` |

### Example Request

```http
GET /api/v1/doctors?departmentId=1&availability=this_week&page=1&limit=10
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 5,
        "firstName": "Emily",
        "lastName": "Thompson",
        "specialty": "General Cardiology",
        "qualifications": "MD, MBBS",
        "experience": 15,
        "consultationFee": 150.00,
        "rating": 4.8,
        "reviewCount": 124,
        "photoUrl": "/uploads/doctors/5.jpg",
        "department": {
          "id": 1,
          "name": "Cardiology"
        },
        "nextAvailable": {
          "date": "2026-01-15",
          "time": "09:00"
        }
      },
      {
        "id": 12,
        "firstName": "Michael",
        "lastName": "Chang",
        "specialty": "Interventional Cardiology",
        "qualifications": "MD, MRCP",
        "experience": 12,
        "consultationFee": 180.00,
        "rating": 4.9,
        "reviewCount": 89,
        "photoUrl": "/uploads/doctors/12.jpg",
        "department": {
          "id": 1,
          "name": "Cardiology"
        },
        "nextAvailable": {
          "date": "2026-01-16",
          "time": "10:30"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "totalItems": 8,
      "hasNext": false,
      "hasPrevious": false
    }
  },
  "message": "Doctors retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Use Cases

- Patient searching for doctors
- Booking appointment flow - step 1 (select doctor)
- Browse doctors by specialty/department

---

## 3. Get Doctor Profile

Get detailed information about a specific doctor.

### Endpoint

```http
GET /api/v1/doctors/{doctorId}
```

### Authentication

Not required (public endpoint)

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `doctorId` | integer | Doctor's unique ID |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 5,
    "firstName": "Emily",
    "lastName": "Thompson",
    "email": "dr.thompson@hospital.com",
    "phoneNumber": "+44 20 1234 5678",
    "specialty": "General Cardiology",
    "qualifications": "MD, MBBS, MRCP",
    "experience": 15,
    "bio": "Dr. Thompson specializes in general cardiology with a focus on preventive care and heart disease management. She completed her medical degree at Oxford University and residency at St. Mary's Hospital. With over 15 years of experience, she has helped thousands of patients manage cardiovascular conditions.",
    "consultationFee": 150.00,
    "photoUrl": "/uploads/doctors/5.jpg",
    "rating": 4.8,
    "reviewCount": 124,
    "department": {
      "id": 1,
      "name": "Cardiology",
      "description": "Heart and cardiovascular system treatment"
    },
    "location": "Room 305, Cardiology Wing",
    "totalAppointments": 1247,
    "joinedDate": "2021-03-15",
    "languages": ["English", "Mandarin"],
    "awards": [
      "Best Cardiologist 2023",
      "Excellence in Patient Care 2022"
    ]
  },
  "message": "Doctor profile retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Response (404)

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Doctor not found",
    "details": {
      "doctorId": 999
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/doctors/999"
}
```

### Use Cases

- View doctor details before booking
- Doctor profile page
- Patient decision-making

---

## 4. Get Doctor Availability

Get available time slots for a specific doctor on a given date.

### Endpoint

```http
GET /api/v1/doctors/{doctorId}/availability
```

### Authentication

Not required (public endpoint)

### Path Parameters

| Parameter | Type | Description |
|---|---|---|
| `doctorId` | integer | Doctor's unique ID |

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `date` | string | Yes | Date in YYYY-MM-DD format |

### Example Request

```http
GET /api/v1/doctors/5/availability?date=2026-01-15
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "doctorId": 5,
    "doctorName": "Dr. Emily Thompson",
    "date": "2026-01-15",
    "dayOfWeek": "WEDNESDAY",
    "isAvailable": true,
    "workingHours": {
      "start": "09:00",
      "end": "17:00"
    },
    "slots": [
      {
        "startTime": "09:00",
        "endTime": "09:30",
        "available": true
      },
      {
        "startTime": "09:30",
        "endTime": "10:00",
        "available": true
      },
      {
        "startTime": "10:00",
        "endTime": "10:30",
        "available": false,
        "reason": "BREAK"
      },
      {
        "startTime": "10:30",
        "endTime": "11:00",
        "available": true
      },
      {
        "startTime": "11:00",
        "endTime": "11:30",
        "available": false,
        "reason": "BOOKED"
      },
      {
        "startTime": "11:30",
        "endTime": "12:00",
        "available": true
      },
      {
        "startTime": "12:00",
        "endTime": "13:00",
        "available": false,
        "reason": "LUNCH"
      },
      {
        "startTime": "14:00",
        "endTime": "14:30",
        "available": true
      },
      {
        "startTime": "14:30",
        "endTime": "15:00",
        "available": true
      },
      {
        "startTime": "15:00",
        "endTime": "15:30",
        "available": false,
        "reason": "BOOKED"
      },
      {
        "startTime": "15:30",
        "endTime": "16:00",
        "available": true
      },
      {
        "startTime": "16:00",
        "endTime": "16:30",
        "available": true
      },
      {
        "startTime": "16:30",
        "endTime": "17:00",
        "available": true
      }
    ],
    "availableCount": 9,
    "totalSlots": 13
  },
  "message": "Availability retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Response When Doctor Not Available

```json
{
  "success": true,
  "data": {
    "doctorId": 5,
    "doctorName": "Dr. Emily Thompson",
    "date": "2026-01-20",
    "dayOfWeek": "SATURDAY",
    "isAvailable": false,
    "reason": "Doctor does not work on weekends",
    "slots": [],
    "availableCount": 0,
    "totalSlots": 0,
    "nextAvailableDate": "2026-01-22"
  },
  "message": "Doctor is not available on this date",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Response When Date is Blocked

```json
{
  "success": true,
  "data": {
    "doctorId": 5,
    "date": "2025-12-25",
    "isAvailable": false,
    "reason": "BLOCKED - Christmas Holiday",
    "slots": [],
    "nextAvailableDate": "2025-12-27"
  },
  "message": "Doctor is not available on this date",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Slot Unavailability Reasons

| Reason | Description |
|---|---|
| `BOOKED` | Time slot already has an appointment |
| `BREAK` | Doctor's scheduled break time |
| `LUNCH` | Doctor's lunch break |
| `BLOCKED` | Date blocked for leave/holiday/conference |
| `PAST` | Time slot is in the past |

### Use Cases

- Booking appointment flow - step 2 (select time)
- Display available time slots to patients
- Real-time availability checking

### Validation Rules

- Date must be in format YYYY-MM-DD
- Date cannot be in the past
- Date must be within 3 months from today (configurable)

### Error Responses

**Invalid Date Format (400)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date format",
    "details": {
      "field": "date",
      "message": "Date must be in YYYY-MM-DD format"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/doctors/5/availability"
}
```

**Past Date (400)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Cannot check availability for past dates",
    "details": {
      "providedDate": "2026-01-10",
      "currentDate": "2026-01-12"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/doctors/5/availability"
}
```

---

## Rate Limiting

### Public Endpoints

- **Limit:** 100 requests per hour per IP address
- **Applies to:** Unauthenticated requests

### Authenticated Endpoints

- **Limit:** 1000 requests per hour per user
- **Applies to:** Authenticated requests

### Rate Limit Headers

```http
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Reset: 1705075200
```

---

## Caching

### Cache Headers

Public endpoints include cache headers for performance:

```http
Cache-Control: public, max-age=300
ETag: "abc123xyz"
Last-Modified: Mon, 12 Jan 2026 10:00:00 GMT
```

### Cache Duration

- **Departments:** 5 minutes (rarely change)
- **Doctors list:** 5 minutes (profile updates infrequent)
- **Doctor availability:** 1 minute (real-time booking updates)

---

## CORS Configuration

Public endpoints support CORS for frontend integration:

```http
Access-Control-Allow-Origin: https://hospital-booking.com
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600
```

---

## Next: Error Codes Reference

See [06-error-codes.md](06-error-codes.md) for complete error code documentation.
