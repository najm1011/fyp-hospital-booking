# REST API Specification - Hospital Booking System

> **Project:** Hospital Appointment Booking System
> **Student:** Najm (2356070)
> **Supervisor:** Steve Counsell
> **Sprint:** Sprint 1 - Dev Task 11
> **Status:** ✅ Complete

---

## Quick Navigation

### Getting Started
- **[00-overview.md](00-overview.md)** - API overview, base URL, authentication, response format

### API Endpoints
- **[01-authentication.md](01-authentication.md)** - Register, Login, Password Reset (6 endpoints)
- **[02-patient-endpoints.md](02-patient-endpoints.md)** - Patient operations (8 endpoints)
- **[03-doctor-endpoints.md](03-doctor-endpoints.md)** - Doctor operations (10 endpoints)
- **[04-admin-endpoints.md](04-admin-endpoints.md)** - Admin operations (12 endpoints)
- **[05-common-endpoints.md](05-common-endpoints.md)** - Public/shared endpoints (4 endpoints)

### Reference
- **[06-error-codes.md](06-error-codes.md)** - Complete error code reference

---

## Document Structure

```
docs/api/
├── README.md                     ← You are here
├── 00-overview.md                ← Start here
├── 01-authentication.md          ← Auth endpoints
├── 02-patient-endpoints.md       ← Patient operations
├── 03-doctor-endpoints.md        ← Doctor operations
├── 04-admin-endpoints.md         ← Admin operations
├── 05-common-endpoints.md        ← Public endpoints
└── 06-error-codes.md             ← Error reference
```

---

## API Summary

### Total Endpoints: 40

| Category | Count | Description |
|---|---|---|
| **Authentication** | 6 | Register, login, password management |
| **Patient** | 8 | Appointments, bookings, profile |
| **Doctor** | 10 | Schedule, availability, notes |
| **Admin** | 12 | User/doctor/department management, analytics |
| **Common** | 4 | Public doctor/department listings |

---

## Quick Start

### 1. Base URL

**Development:**
```
http://localhost:8080/api/v1
```

**Production:**
```
https://api.hospital-booking.com/api/v1
```

### 2. Authentication

Most endpoints require JWT authentication:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get a token by logging in:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Common Request Example

```bash
# Get patient dashboard
curl -X GET http://localhost:8080/api/v1/patient/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## API Features

### ✅ **RESTful Design**
- Resource-based URLs (`/api/v1/appointments`)
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format

### ✅ **JWT Authentication**
- Secure token-based authentication
- 24-hour token expiry
- Role-based access control (PATIENT, DOCTOR, ADMIN)

### ✅ **Comprehensive Error Handling**
- Consistent error response format
- Detailed error codes and messages
- Field-level validation errors

### ✅ **Pagination Support**
- Query parameters: `page`, `limit`, `sortBy`, `order`
- Response includes pagination metadata
- Maximum 100 items per page

### ✅ **Rate Limiting**
- Public endpoints: 100 requests/hour
- Authenticated patients: 1000 requests/hour
- Authenticated doctors: 2000 requests/hour
- Authenticated admins: 5000 requests/hour

### ✅ **CORS Enabled**
- Frontend integration support
- Configurable allowed origins
- Preflight request handling

---

## Endpoint Categories

### Authentication (Public)

```http
POST   /api/v1/auth/register          # Create account
POST   /api/v1/auth/login              # Get JWT token
POST   /api/v1/auth/logout             # Invalidate token
POST   /api/v1/auth/forgot-password    # Request reset link
POST   /api/v1/auth/reset-password     # Reset password
GET    /api/v1/auth/validate-token     # Validate JWT
```

### Patient Operations (PATIENT role)

```http
GET    /api/v1/patient/dashboard       # Dashboard summary
POST   /api/v1/patient/appointments    # Book appointment
GET    /api/v1/patient/appointments    # List appointments
GET    /api/v1/patient/appointments/:id # Appointment details
PUT    /api/v1/patient/appointments/:id/reschedule # Reschedule
DELETE /api/v1/patient/appointments/:id # Cancel
GET    /api/v1/patient/profile         # Get profile
PUT    /api/v1/patient/profile         # Update profile
```

### Doctor Operations (DOCTOR role)

```http
GET    /api/v1/doctor/dashboard        # Today's schedule
GET    /api/v1/doctor/appointments     # All appointments
GET    /api/v1/doctor/appointments/:id # Appointment details
PUT    /api/v1/doctor/appointments/:id/status # Update status
PUT    /api/v1/doctor/appointments/:id/notes  # Add notes
GET    /api/v1/doctor/schedule         # Weekly/monthly schedule
GET    /api/v1/doctor/availability     # Get availability
PUT    /api/v1/doctor/availability     # Update availability
POST   /api/v1/doctor/availability/block # Block dates
DELETE /api/v1/doctor/availability/block/:id # Unblock
GET    /api/v1/doctor/profile          # Get profile
PUT    /api/v1/doctor/profile          # Update profile
```

### Admin Operations (ADMIN role)

```http
GET    /api/v1/admin/dashboard         # System dashboard
GET    /api/v1/admin/users             # List users
POST   /api/v1/admin/users             # Create user
GET    /api/v1/admin/users/:id         # User details
PUT    /api/v1/admin/users/:id         # Update user
DELETE /api/v1/admin/users/:id         # Delete user
POST   /api/v1/admin/users/:id/reset-password # Reset password
GET    /api/v1/admin/doctors           # List doctors
POST   /api/v1/admin/doctors           # Create doctor
GET    /api/v1/admin/departments       # List departments
POST   /api/v1/admin/departments       # Create department
PUT    /api/v1/admin/departments/:id   # Update department
DELETE /api/v1/admin/departments/:id   # Delete department
GET    /api/v1/admin/appointments      # View all appointments
GET    /api/v1/admin/analytics         # System analytics
```

### Common Operations (Public/Authenticated)

```http
GET    /api/v1/departments             # List departments (public)
GET    /api/v1/doctors                 # List doctors (public)
GET    /api/v1/doctors/:id             # Doctor profile (public)
GET    /api/v1/doctors/:id/availability # Available slots (public)
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional context
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/endpoint"
}
```

---

## Status Codes

| Code | Meaning | Usage |
|---|---|---|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate/conflict |
| 422 | Unprocessable Entity | Business logic violation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Data Types

| Type | Format | Example |
|---|---|---|
| ID | BIGINT | `123` |
| Email | RFC 5322 | `"user@example.com"` |
| Phone | E.164/UK | `"+44 7700 900000"` |
| Date | ISO 8601 | `"2026-01-15"` |
| Time | HH:MM | `"09:00"` |
| DateTime | ISO 8601 (UTC) | `"2026-01-12T10:30:00Z"` |
| Role | ENUM | `"PATIENT"`, `"DOCTOR"`, `"ADMIN"` |
| Status | ENUM | `"SCHEDULED"`, `"COMPLETED"`, `"CANCELLED"`, `"NO_SHOW"` |

---

## Testing the API

### Using cURL

```bash
# Register
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

# Book appointment (with token)
curl -X POST http://localhost:8080/api/v1/patient/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 5,
    "appointmentDate": "2026-01-15",
    "startTime": "09:00",
    "endTime": "09:30",
    "patientNotes": "Chest pain follow-up"
  }'
```

### Using Postman

1. Import collection (future: provide JSON export)
2. Set environment variable `baseUrl`: `http://localhost:8080/api/v1`
3. Set environment variable `token`: (from login response)
4. Use `{{baseUrl}}` and `{{token}}` in requests

### Using JavaScript

```javascript
// Login
const response = await fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'sarah.chen@example.com',
    password: 'SecurePass123'
  })
});

const { success, data } = await response.json();

if (success) {
  const token = data.token;
  localStorage.setItem('token', token);

  // Use token for authenticated requests
  const appointments = await fetch('http://localhost:8080/api/v1/patient/appointments', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}
```

---

## Requirements Mapping

### Functional Requirements Coverage

| Requirement | Endpoints | Status |
|---|---|---|
| **FR-1.1** User Registration | `POST /auth/register` | ✅ |
| **FR-1.2** User Login | `POST /auth/login` | ✅ |
| **FR-2.1** Doctor Profiles | `GET /doctors/:id` | ✅ |
| **FR-2.2** Doctor Availability | `GET/PUT /doctor/availability` | ✅ |
| **FR-3.1** Browse Doctors | `GET /doctors` | ✅ |
| **FR-3.2** Book Appointment | `POST /patient/appointments` | ✅ |
| **FR-3.3** View Appointments | `GET /patient/appointments` | ✅ |
| **FR-3.4** Cancel Appointment | `DELETE /patient/appointments/:id` | ✅ |
| **FR-3.5** Reschedule | `PUT /patient/appointments/:id/reschedule` | ✅ |
| **FR-5.1** Patient Dashboard | `GET /patient/dashboard` | ✅ |
| **FR-5.2** Doctor Dashboard | `GET /doctor/dashboard` | ✅ |
| **FR-5.3** Admin Dashboard | `GET /admin/dashboard` | ✅ |
| **FR-6.1** User Management | `GET/POST/PUT/DELETE /admin/users` | ✅ |
| **FR-6.2** Department Management | `GET/POST/PUT/DELETE /admin/departments` | ✅ |

**All 14 functional requirements covered** ✅

---

## Security Features

### Authentication & Authorization
- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with BCrypt (cost factor 12)
- ✅ Token expiry (24 hours)
- ✅ Token blacklisting on logout

### Data Protection
- ✅ HTTPS required in production
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS prevention (input sanitization)
- ✅ CORS configuration
- ✅ Rate limiting

### Privacy
- ✅ Doctor notes private (not visible to patients)
- ✅ User email masking in responses
- ✅ No user enumeration in password reset

---

## Performance Considerations

### Caching
- Public endpoints cached for 5 minutes
- Doctor availability cached for 1 minute
- ETag support for conditional requests

### Pagination
- Default: 10 items per page
- Maximum: 100 items per page
- Prevents large response payloads

### Database Optimization
- Indexed foreign keys
- Composite indexes on frequently queried fields
- Query optimization with JPA/Hibernate

---

## Best Practices

### For API Consumers

1. **Always check `success` field** in responses
2. **Handle errors gracefully** with user-friendly messages
3. **Store tokens securely** (not in localStorage for sensitive apps)
4. **Implement retry logic** for transient errors (500, 503)
5. **Respect rate limits** to avoid 429 errors
6. **Use HTTPS** in production
7. **Validate input** before sending requests

### For API Developers

1. **Consistent response format** across all endpoints
2. **Meaningful error messages** for debugging
3. **Comprehensive validation** on all inputs
4. **Database transactions** for multi-step operations
5. **Logging and monitoring** for production
6. **API versioning** for backward compatibility
7. **Documentation** kept up to date

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | Jan 12, 2026 | Initial REST API specification (Sprint 1, Dev 11) |

---

## Future Enhancements

### Planned Features (Not in MVP)
- Refresh tokens for extended sessions
- WebSocket support for real-time notifications
- File upload for doctor profile photos
- Pagination cursor-based (for large datasets)
- GraphQL API alternative
- API rate limiting per endpoint
- Swagger/OpenAPI 3.0 specification export
- API analytics and usage tracking

---

## Support & Resources

**Project:** Hospital Appointment Booking System
**Student:** Najm (2356070)
**Supervisor:** Steve Counsell

### Documentation Files
- All endpoint details in individual MD files
- Error code reference for debugging
- cURL examples for testing
- Frontend integration examples

### For Questions
- Check endpoint documentation for details
- Review error codes for troubleshooting
- Test with provided cURL examples
- Verify authentication token is valid

---

**Sprint 1, Dev Task 11: Complete** ✅

REST API specification designed following industry best practices with comprehensive documentation for all 40 endpoints.
