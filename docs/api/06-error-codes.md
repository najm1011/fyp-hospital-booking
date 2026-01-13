# Error Codes Reference

> **API Version:** v1
> **Last Updated:** January 12, 2026

---

## Overview

This document provides a comprehensive reference of all error codes used in the Hospital Booking System API.

---

## Error Response Structure

All errors follow this consistent structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional context (optional)
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/endpoint"
}
```

---

## HTTP Status Codes

| Status | Description | When to Use |
|---|---|---|
| 400 | Bad Request | Invalid input, validation errors |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (duplicate, double booking) |
| 422 | Unprocessable Entity | Semantic errors, business logic violations |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server errors |
| 503 | Service Unavailable | Service temporarily down |

---

## Error Codes by Category

### Authentication Errors (401)

| Code | Message | Cause | Resolution |
|---|---|---|---|
| `UNAUTHORIZED` | Invalid or expired token | JWT token is invalid, expired, or missing | Login again to get new token |
| `INVALID_CREDENTIALS` | Invalid email or password | Login credentials don't match | Check email/password and retry |
| `TOKEN_EXPIRED` | Authentication token has expired | JWT token exceeded 24-hour lifetime | Login again |
| `TOKEN_BLACKLISTED` | Token has been invalidated | User logged out, token blacklisted | Login again |

### Authorization Errors (403)

| Code | Message | Cause | Resolution |
|---|---|---|---|
| `FORBIDDEN` | Insufficient permissions | User lacks required role | Contact administrator |
| `ACCOUNT_INACTIVE` | Account is inactive | User account deactivated | Contact administrator |
| `ROLE_MISMATCH` | Operation not allowed for your role | PATIENT accessing DOCTOR endpoint | Use correct endpoint for role |

### Validation Errors (400)

| Code | Message | Cause | Resolution |
|---|---|---|---|
| `VALIDATION_ERROR` | Validation failed for one or more fields | Input doesn't meet validation rules | Check field requirements |
| `INVALID_FORMAT` | Invalid data format | Date, time, email format incorrect | Use correct format |
| `REQUIRED_FIELD_MISSING` | Required field is missing | Mandatory field not provided | Provide all required fields |
| `FIELD_TOO_LONG` | Field exceeds maximum length | String exceeds max length | Shorten input |
| `FIELD_TOO_SHORT` | Field below minimum length | String below min length | Provide longer input |
| `INVALID_EMAIL` | Invalid email format | Email doesn't match regex | Use valid email format |
| `WEAK_PASSWORD` | Password doesn't meet requirements | Password too weak | Use stronger password |

### Resource Errors (404)

| Code | Message | Cause | Resolution |
|---|---|---|---|
| `NOT_FOUND` | Resource not found | ID doesn't exist in database | Verify ID is correct |
| `USER_NOT_FOUND` | User not found | User ID doesn't exist | Check user ID |
| `DOCTOR_NOT_FOUND` | Doctor not found | Doctor ID doesn't exist | Check doctor ID |
| `APPOINTMENT_NOT_FOUND` | Appointment not found | Appointment ID doesn't exist | Check appointment ID |
| `DEPARTMENT_NOT_FOUND` | Department not found | Department ID doesn't exist | Check department ID |

### Conflict Errors (409)

| Code | Message | Cause | Resolution |
|---|---|---|---|
| `CONFLICT` | Resource conflict | Duplicate or conflicting data | Choose different value |
| `EMAIL_ALREADY_EXISTS` | Email is already registered | Email in use by another user | Use different email |
| `SLOT_ALREADY_BOOKED` | Time slot is already booked | Appointment slot taken | Choose different time |
| `DEPARTMENT_NAME_EXISTS` | Department name already exists | Duplicate department name | Use different name |
| `CANNOT_DELETE_WITH_DEPENDENCIES` | Cannot delete due to dependencies | Resource has related records | Remove dependencies first |

### Business Logic Errors (422)

| Code | Message | Cause | Resolution |
|---|---|---|---|
| `APPOINTMENT_TOO_LATE` | Cannot book/modify within 24 hours | Less than 24h before appointment | Book earlier |
| `APPOINTMENT_TOO_EARLY` | Cannot book more than 3 months ahead | More than 90 days in future | Book closer to date |
| `DOCTOR_NOT_AVAILABLE` | Doctor unavailable on selected date/time | Doctor doesn't work that day/time | Choose different time |
| `PAST_DATE_NOT_ALLOWED` | Cannot perform operation on past dates | Date is in the past | Choose future date |
| `MAX_APPOINTMENTS_EXCEEDED` | Maximum appointments limit reached | Patient has 5 upcoming appointments | Cancel one first |
| `SLOT_DURATION_INVALID` | Appointment duration must be 30 minutes | Duration not 30 minutes | Use 30-minute slots |

### Rate Limiting Errors (429)

| Code | Message | Cause | Resolution |
|---|---|---|---|
| `RATE_LIMIT_EXCEEDED` | Too many requests | Exceeded rate limit | Wait before retrying |

### Server Errors (500)

| Code | Message | Cause | Resolution |
|---|---|---|---|
| `INTERNAL_SERVER_ERROR` | An unexpected error occurred | Server-side bug or issue | Retry later, contact support |
| `DATABASE_ERROR` | Database operation failed | DB connection or query error | Retry later |
| `EMAIL_SERVICE_ERROR` | Failed to send email | SMTP service down | Email will retry automatically |

### Service Errors (503)

| Code | Message | Cause | Resolution |
|---|---|---|---|
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable | Maintenance or outage | Retry after specified time |

---

## Common Error Scenarios

### Scenario: Invalid Login

**Request:**
```http
POST /api/v1/auth/login
{
  "email": "wrong@example.com",
  "password": "wrongpass"
}
```

**Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": null
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/login"
}
```

---

### Scenario: Validation Error

**Request:**
```http
POST /api/v1/auth/register
{
  "email": "invalid-email",
  "password": "weak"
}
```

**Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters with 1 uppercase letter and 1 number"
      },
      {
        "field": "firstName",
        "message": "First name is required"
      }
    ]
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/register"
}
```

---

### Scenario: Time Slot Conflict

**Request:**
```http
POST /api/v1/patient/appointments
{
  "doctorId": 5,
  "appointmentDate": "2026-01-15",
  "startTime": "09:00"
}
```

**Response (409):**
```json
{
  "success": false,
  "error": {
    "code": "SLOT_ALREADY_BOOKED",
    "message": "This time slot is already booked",
    "details": {
      "doctorId": 5,
      "date": "2026-01-15",
      "time": "09:00",
      "availableSlots": ["09:30", "10:00", "10:30", "11:00"]
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/patient/appointments"
}
```

---

### Scenario: Insufficient Permissions

**Request:**
```http
GET /api/v1/admin/users
Authorization: Bearer <patient_token>
```

**Response (403):**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource",
    "details": {
      "requiredRole": "ADMIN",
      "currentRole": "PATIENT"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/admin/users"
}
```

---

### Scenario: Resource Not Found

**Request:**
```http
GET /api/v1/patient/appointments/999
```

**Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "APPOINTMENT_NOT_FOUND",
    "message": "Appointment not found",
    "details": {
      "appointmentId": 999
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/patient/appointments/999"
}
```

---

### Scenario: Rate Limit Exceeded

**Request:**
```http
POST /api/v1/auth/login
(6th request in 15 minutes)
```

**Response (429):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 900,
      "resetAt": "2026-01-12T10:45:00Z",
      "limit": 5,
      "window": "15 minutes"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/login"
}
```

---

## Error Handling Best Practices

### For Frontend Developers

1. **Always check `success` field** before accessing `data`
2. **Display `error.message`** to users (user-friendly)
3. **Use `error.code`** for programmatic handling
4. **Log `error.details`** for debugging
5. **Handle common errors gracefully:**
   - 401: Redirect to login
   - 403: Show permission denied page
   - 404: Show not found page
   - 409: Show conflict resolution options
   - 500: Show error page with retry button

### Example Error Handling (JavaScript)

```javascript
try {
  const response = await fetch('/api/v1/patient/appointments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });

  const result = await response.json();

  if (!result.success) {
    switch (result.error.code) {
      case 'SLOT_ALREADY_BOOKED':
        // Show available time slots
        showAvailableSlots(result.error.details.availableSlots);
        break;
      case 'UNAUTHORIZED':
        // Redirect to login
        window.location.href = '/login';
        break;
      case 'VALIDATION_ERROR':
        // Show field-specific errors
        showFieldErrors(result.error.details);
        break;
      default:
        // Show general error message
        showError(result.error.message);
    }
    return;
  }

  // Success handling
  handleSuccess(result.data);

} catch (error) {
  // Network or parsing error
  showError('Unable to connect to server. Please try again.');
}
```

---

## Testing Error Scenarios

Use these test cases to verify error handling:

### Test Case 1: Invalid Token

```bash
curl -X GET http://localhost:8080/api/v1/patient/dashboard \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 UNAUTHORIZED
```

### Test Case 2: Missing Required Field

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
# Expected: 400 VALIDATION_ERROR (missing firstName, lastName, password)
```

### Test Case 3: Duplicate Email

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "existing@example.com",
    "password": "SecurePass123"
  }'
# Expected: 409 EMAIL_ALREADY_EXISTS
```

---

## Next: API Examples

See [07-examples.md](07-examples.md) for complete request/response examples and use case scenarios.
