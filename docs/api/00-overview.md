# REST API Specification - Hospital Booking System

> **Project:** Hospital Appointment Booking System
> **Student:** Najm (2356070)
> **Supervisor:** Steve Counsell
> **Date:** January 12, 2026
> **Sprint:** Sprint 1 - Dev Task 11

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Common Headers](#common-headers)
5. [Response Format](#response-format)
6. [Error Handling](#error-handling)
7. [Status Codes](#status-codes)
8. [Pagination](#pagination)
9. [Rate Limiting](#rate-limiting)
10. [Versioning](#versioning)

---

## API Overview

The Hospital Booking System API is a RESTful web service that provides endpoints for managing appointments, users, doctors, and administrative functions. The API follows REST architectural principles and uses JSON for request and response payloads.

### Key Features

- **RESTful Design** - Resource-based URLs, HTTP methods
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control (RBAC)** - Patient, Doctor, Admin roles
- **Comprehensive Error Handling** - Consistent error responses
- **Pagination Support** - For large datasets
- **CORS Enabled** - For frontend integration
- **Rate Limited** - Prevent abuse

### API Endpoints Summary

| Category | Endpoints | Description |
|---|---|---|
| **Authentication** | 6 endpoints | Register, login, logout, password management |
| **Patients** | 8 endpoints | Appointments, bookings, profile |
| **Doctors** | 10 endpoints | Schedule, availability, patient notes |
| **Admin** | 12 endpoints | User management, analytics, reports |
| **Common** | 4 endpoints | Departments, doctor listings, public data |

**Total:** 40 REST API endpoints

---

## Base URL

### Development
```
http://localhost:8080/api
```

### Production
```
https://api.hospital-booking.com/api
```

### Version Prefix
```
/api/v1
```

**Example Full URL:**
```
http://localhost:8080/api/v1/auth/login
```

---

## Authentication

### JWT Token-Based Authentication

The API uses JSON Web Tokens (JWT) for authentication. After successful login, clients receive a token that must be included in subsequent requests.

#### Token Structure

```json
{
  "userId": 123,
  "email": "user@example.com",
  "role": "PATIENT",
  "iat": 1705075200,
  "exp": 1705161600
}
```

#### Token Expiry
- **Access Token:** 24 hours
- **Refresh Token:** 7 days (future implementation)

#### Public Endpoints (No Authentication Required)

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/validate-token
GET    /api/v1/departments (read-only)
```

#### Protected Endpoints

All other endpoints require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Common Headers

### Request Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>
X-Request-ID: <unique_request_id> (optional, for tracking)
```

### Response Headers

```http
Content-Type: application/json
X-Request-ID: <unique_request_id>
X-Rate-Limit-Limit: 100
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Reset: 1705075200
```

---

## Response Format

### Success Response Structure

All successful responses follow this structure:

```json
{
  "success": true,
  "data": {
    // Response data object or array
  },
  "message": "Operation completed successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Example Success Responses

**Single Resource:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "firstName": "Sarah",
    "lastName": "Chen",
    "email": "sarah.chen@example.com",
    "role": "PATIENT"
  },
  "message": "User retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

**Collection (with pagination):**
```json
{
  "success": true,
  "data": {
    "items": [
      { "id": 1, "name": "Dr. Thompson" },
      { "id": 2, "name": "Dr. Wilson" }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "totalItems": 45,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "message": "Doctors retrieved successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

**No Content (204):**
```
// Empty response body
```

---

## Error Handling

### Error Response Structure

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/register"
}
```

### Error Codes

| Code | Description | HTTP Status |
|---|---|---|
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT` | Resource already exists | 409 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_SERVER_ERROR` | Server error | 500 |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable | 503 |

### Example Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is already registered",
    "details": [
      {
        "field": "email",
        "message": "This email address is already in use"
      }
    ]
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/register"
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": null
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/patient/appointments"
}
```

**Authorization Error (403):**
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

**Not Found Error (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Appointment not found",
    "details": {
      "resourceType": "Appointment",
      "resourceId": 999
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/appointments/999"
}
```

**Conflict Error (409):**
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Appointment slot is already booked",
    "details": {
      "doctorId": 5,
      "date": "2026-01-15",
      "time": "09:00"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/appointments"
}
```

---

## Status Codes

### HTTP Status Codes Used

| Status Code | Meaning | Usage |
|---|---|---|
| **200 OK** | Success | GET, PUT requests |
| **201 Created** | Resource created | POST requests |
| **204 No Content** | Success, no response body | DELETE requests |
| **400 Bad Request** | Invalid input | Validation errors |
| **401 Unauthorized** | Authentication required | Missing/invalid token |
| **403 Forbidden** | Insufficient permissions | Role mismatch |
| **404 Not Found** | Resource doesn't exist | Invalid ID |
| **409 Conflict** | Resource conflict | Duplicate, double booking |
| **422 Unprocessable Entity** | Semantic errors | Business logic violations |
| **429 Too Many Requests** | Rate limit exceeded | Too many requests |
| **500 Internal Server Error** | Server error | Unexpected errors |
| **503 Service Unavailable** | Service down | Maintenance, outages |

---

## Pagination

### Query Parameters

For endpoints that return collections, use these query parameters:

```
GET /api/v1/doctors?page=1&limit=10&sort=name&order=asc
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 10 | Items per page (max 100) |
| `sort` | string | id | Field to sort by |
| `order` | string | asc | Sort order: `asc` or `desc` |

### Pagination Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "totalItems": 45,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

---

## Rate Limiting

### Rate Limits by Endpoint Type

| Endpoint Type | Rate Limit | Window |
|---|---|---|
| **Authentication** | 5 requests | 15 minutes |
| **Public Endpoints** | 100 requests | 1 hour |
| **Authenticated (Patient)** | 1000 requests | 1 hour |
| **Authenticated (Doctor)** | 2000 requests | 1 hour |
| **Authenticated (Admin)** | 5000 requests | 1 hour |

### Rate Limit Headers

```http
X-Rate-Limit-Limit: 1000
X-Rate-Limit-Remaining: 995
X-Rate-Limit-Reset: 1705075200
```

### Rate Limit Exceeded Response (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 3600,
      "resetAt": "2026-01-12T11:00:00Z"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z"
}
```

---

## Versioning

### URL Versioning

The API uses URL versioning to maintain backward compatibility:

```
/api/v1/...  (Current version)
/api/v2/...  (Future version)
```

### Version Information Endpoint

```
GET /api/version
```

**Response:**
```json
{
  "version": "1.0.0",
  "apiVersion": "v1",
  "buildDate": "2026-01-12T00:00:00Z",
  "environment": "production"
}
```

---

## Data Types and Formats

### Common Data Types

| Type | Format | Example |
|---|---|---|
| **ID** | BIGINT | `123` |
| **String** | UTF-8 | `"Sarah Chen"` |
| **Email** | RFC 5322 | `"user@example.com"` |
| **Phone** | E.164 or UK format | `"+44 7700 900000"` |
| **Date** | ISO 8601 (Date) | `"2026-01-15"` |
| **Time** | HH:MM (24-hour) | `"09:00"` |
| **DateTime** | ISO 8601 (UTC) | `"2026-01-12T10:30:00Z"` |
| **Boolean** | true/false | `true` |
| **Enum** | Uppercase string | `"PATIENT"`, `"SCHEDULED"` |
| **Currency** | Decimal (2 places) | `150.00` |

### Enum Values

**UserRole:**
```
PATIENT | DOCTOR | ADMIN
```

**AppointmentStatus:**
```
SCHEDULED | COMPLETED | CANCELLED | NO_SHOW
```

**DayOfWeek:**
```
MONDAY | TUESDAY | WEDNESDAY | THURSDAY | FRIDAY | SATURDAY | SUNDAY
```

---

## Security Considerations

### HTTPS Only

All API requests must use HTTPS in production. HTTP requests will be redirected to HTTPS.

### CORS Configuration

```javascript
Allowed Origins: http://localhost:3000, https://hospital-booking.com
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Content-Type, Authorization
Max Age: 3600
```

### SQL Injection Prevention

- All database queries use prepared statements
- Input sanitization on all endpoints
- ORM (JPA/Hibernate) for query building

### XSS Prevention

- All user input sanitized before storage
- Content-Security-Policy headers
- Output encoding in responses

### Password Security

- BCrypt hashing with cost factor 12
- Minimum 8 characters, 1 uppercase, 1 number
- Password strength validation

---

## Testing the API

### Using cURL

```bash
# Register new user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Chen",
    "email": "sarah.chen@example.com",
    "password": "SecurePass123",
    "role": "PATIENT"
  }'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.chen@example.com",
    "password": "SecurePass123"
  }'

# Get appointments (with token)
curl -X GET http://localhost:8080/api/v1/patient/appointments \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Using Postman

Import the Postman collection (future: provide JSON export) or manually configure:

1. Set base URL: `http://localhost:8080/api/v1`
2. Add environment variable: `token`
3. Configure Authorization header: `Bearer {{token}}`
4. Test endpoints according to documentation

---

## API Documentation Files

### Complete API Reference

- **[00-overview.md](00-overview.md)** - This document
- **[01-authentication.md](01-authentication.md)** - Auth endpoints
- **[02-patient-endpoints.md](02-patient-endpoints.md)** - Patient operations
- **[03-doctor-endpoints.md](03-doctor-endpoints.md)** - Doctor operations
- **[04-admin-endpoints.md](04-admin-endpoints.md)** - Admin operations
- **[05-common-endpoints.md](05-common-endpoints.md)** - Public/shared endpoints
- **[06-error-codes.md](06-error-codes.md)** - Error reference
- **[07-examples.md](07-examples.md)** - Request/response examples

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | Jan 12, 2026 | Initial API specification (Sprint 1, Dev 11) |

---

## Support & Contact

**Project:** Hospital Appointment Booking System
**Student:** Najm (2356070)
**Supervisor:** Steve Counsell

For API questions or issues, refer to the detailed endpoint documentation files.

---

**Next:** See [01-authentication.md](01-authentication.md) for authentication endpoints specification.
