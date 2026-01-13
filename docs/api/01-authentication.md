# Authentication Endpoints

> **API Version:** v1
> **Last Updated:** January 12, 2026
> **Base URL:** `/api/v1/auth`

---

## Overview

Authentication endpoints handle user registration, login, logout, and password management. All authentication endpoints are public except logout.

**Endpoints:** 6
**Authentication Required:** No (except logout)

---

## Table of Contents

1. [Register User](#1-register-user)
2. [Login](#2-login)
3. [Logout](#3-logout)
4. [Forgot Password](#4-forgot-password)
5. [Reset Password](#5-reset-password)
6. [Validate Token](#6-validate-token)

---

## 1. Register User

Create a new user account.

### Endpoint

```http
POST /api/v1/auth/register
```

### Authentication

Not required (public endpoint)

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "firstName": "Sarah",
  "lastName": "Chen",
  "email": "sarah.chen@example.com",
  "phoneNumber": "+44 7700 900000",
  "password": "SecurePass123",
  "role": "PATIENT"
}
```

### Request Parameters

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `firstName` | string | Yes | 2-100 chars, letters only | User's first name |
| `lastName` | string | Yes | 2-100 chars, letters only | User's last name |
| `email` | string | Yes | Valid email, unique | User's email address |
| `phoneNumber` | string | No | UK format | Contact number |
| `password` | string | Yes | Min 8 chars, 1 upper, 1 number | Account password |
| `role` | enum | No | PATIENT (default), DOCTOR, ADMIN | User role |

### Validation Rules

```javascript
firstName: {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[a-zA-Z\s'-]+$/,
  message: "First name must contain only letters, spaces, hyphens, and apostrophes"
}

lastName: {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[a-zA-Z\s'-]+$/
}

email: {
  required: true,
  unique: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  maxLength: 255,
  message: "Please provide a valid email address"
}

phoneNumber: {
  required: false,
  pattern: /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
  message: "Invalid UK phone number format"
}

password: {
  required: true,
  minLength: 8,
  maxLength: 255,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
  message: "Password must be at least 8 characters with 1 uppercase letter and 1 number"
}

role: {
  required: false,
  enum: ["PATIENT", "DOCTOR", "ADMIN"],
  default: "PATIENT"
}
```

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "sarah.chen@example.com",
    "firstName": "Sarah",
    "lastName": "Chen",
    "role": "PATIENT",
    "isActive": true,
    "createdAt": "2026-01-12T10:30:00Z"
  },
  "message": "User registered successfully",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Responses

**Email Already Exists (409 Conflict)**

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
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

**Validation Error (400 Bad Request)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields",
    "details": [
      {
        "field": "password",
        "message": "Password must be at least 8 characters with 1 uppercase letter and 1 number"
      },
      {
        "field": "email",
        "message": "Please provide a valid email address"
      }
    ]
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/register"
}
```

### Rate Limiting

- **Limit:** 5 requests per 15 minutes per IP address
- **Purpose:** Prevent automated account creation

---

## 2. Login

Authenticate a user and receive a JWT token.

### Endpoint

```http
POST /api/v1/auth/login
```

### Authentication

Not required (public endpoint)

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "email": "sarah.chen@example.com",
  "password": "SecurePass123"
}
```

### Request Parameters

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | Yes | User's email address |
| `password` | string | Yes | User's password |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoic2FyYWguY2hlbkBleGFtcGxlLmNvbSIsInJvbGUiOiJQQVRJRU5UIiwiaWF0IjoxNzA1MDc1MjAwLCJleHAiOjE3MDUxNjE2MDB9.abc123",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "email": "sarah.chen@example.com",
      "firstName": "Sarah",
      "lastName": "Chen",
      "role": "PATIENT",
      "isActive": true
    }
  },
  "message": "Login successful",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `token` | string | JWT access token |
| `tokenType` | string | Always "Bearer" |
| `expiresIn` | integer | Token expiry in seconds (24 hours = 86400) |
| `user` | object | User information |

### Error Responses

**Invalid Credentials (401 Unauthorized)**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password",
    "details": null
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/login"
}
```

**Account Inactive (403 Forbidden)**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Account is inactive. Please contact administrator.",
    "details": {
      "isActive": false,
      "userId": 1
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/login"
}
```

### Rate Limiting

- **Limit:** 5 requests per 15 minutes per IP address
- **Purpose:** Prevent brute force attacks

### Security Notes

- Password is hashed using BCrypt with cost factor 12
- Failed login attempts are logged
- Account lockout after 5 failed attempts (future implementation)

---

## 3. Logout

Invalidate the current user's JWT token.

### Endpoint

```http
POST /api/v1/auth/logout
```

### Authentication

Required (Bearer token)

### Request Headers

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Request Body

None

### Success Response (200 OK)

```json
{
  "success": true,
  "data": null,
  "message": "Logout successful",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Responses

**Invalid Token (401 Unauthorized)**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": null
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/logout"
}
```

### Implementation Notes

- Token is added to blacklist (in-memory cache or Redis)
- Blacklist entry expires when token would naturally expire
- Client should delete token from localStorage/sessionStorage

---

## 4. Forgot Password

Request a password reset link via email.

### Endpoint

```http
POST /api/v1/auth/forgot-password
```

### Authentication

Not required (public endpoint)

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "email": "sarah.chen@example.com"
}
```

### Request Parameters

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | Yes | User's email address |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "email": "s***h@example.com",
    "message": "If this email exists in our system, a password reset link has been sent"
  },
  "message": "Password reset email sent",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Responses

**Rate Limit Exceeded (429 Too Many Requests)**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many password reset requests. Please try again later.",
    "details": {
      "retryAfter": 900,
      "resetAt": "2026-01-12T10:45:00Z"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/forgot-password"
}
```

### Rate Limiting

- **Limit:** 3 requests per hour per email address
- **Purpose:** Prevent email spam and abuse

### Security Notes

- Always returns success response (prevents user enumeration)
- Email is masked in response (s***h@example.com)
- Reset token expires after 1 hour
- Reset token is single-use only
- Email contains reset link: `https://app.com/reset-password?token=abc123`

### Email Template

```
Subject: Password Reset Request - Hospital Booking System

Hi [FirstName],

We received a request to reset your password for your Hospital Booking System account.

Click the link below to reset your password:
https://hospital-booking.com/reset-password?token=abc123xyz

This link will expire in 1 hour.

If you didn't request this, please ignore this email. Your password will remain unchanged.

Best regards,
Hospital Booking System Team
```

---

## 5. Reset Password

Reset user password using a valid reset token.

### Endpoint

```http
POST /api/v1/auth/reset-password
```

### Authentication

Not required (public endpoint, but requires valid reset token)

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "token": "abc123xyz789resettoken",
  "newPassword": "NewSecurePass456"
}
```

### Request Parameters

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `token` | string | Yes | Valid reset token | Token from email link |
| `newPassword` | string | Yes | Min 8 chars, 1 upper, 1 number | New password |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "message": "Password has been reset successfully"
  },
  "message": "Password reset successful",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Responses

**Invalid or Expired Token (400 Bad Request)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid or expired reset token",
    "details": {
      "token": "Token has expired or has already been used"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/reset-password"
}
```

**Weak Password (400 Bad Request)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password does not meet security requirements",
    "details": [
      {
        "field": "newPassword",
        "message": "Password must be at least 8 characters with 1 uppercase letter and 1 number"
      }
    ]
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/reset-password"
}
```

### Security Notes

- Token is invalidated after successful password reset
- New password is hashed using BCrypt
- User receives email notification of password change
- Previous sessions are invalidated (user must login again)

---

## 6. Validate Token

Validate if a JWT token is still valid.

### Endpoint

```http
GET /api/v1/auth/validate-token
```

### Authentication

Required (Bearer token to validate)

### Request Headers

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "valid": true,
    "userId": 1,
    "email": "sarah.chen@example.com",
    "role": "PATIENT",
    "expiresAt": "2026-01-13T10:30:00Z"
  },
  "message": "Token is valid",
  "timestamp": "2026-01-12T10:30:00Z"
}
```

### Error Responses

**Invalid Token (401 Unauthorized)**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {
      "valid": false,
      "reason": "Token has expired"
    }
  },
  "timestamp": "2026-01-12T10:30:00Z",
  "path": "/api/v1/auth/validate-token"
}
```

### Use Cases

- Frontend token validation on app initialization
- Check if user session is still active
- Refresh token logic (future implementation)

---

## JWT Token Structure

### Token Payload

```json
{
  "userId": 1,
  "email": "sarah.chen@example.com",
  "role": "PATIENT",
  "iat": 1705075200,
  "exp": 1705161600
}
```

### Token Claims

| Claim | Type | Description |
|---|---|---|
| `userId` | integer | User's unique ID |
| `email` | string | User's email address |
| `role` | string | User's role (PATIENT, DOCTOR, ADMIN) |
| `iat` | integer | Issued at (Unix timestamp) |
| `exp` | integer | Expiration time (Unix timestamp) |

### Token Expiry

- **Duration:** 24 hours (86400 seconds)
- **Refresh:** Not implemented (future: refresh tokens)

---

## Error Summary

| HTTP Status | Error Code | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid input data |
| 401 | `UNAUTHORIZED` | Invalid credentials or token |
| 403 | `FORBIDDEN` | Account inactive |
| 409 | `CONFLICT` | Email already registered |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_SERVER_ERROR` | Server error |

---

## Testing Examples

### cURL Examples

**Register:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sarah",
    "lastName": "Chen",
    "email": "sarah.chen@example.com",
    "password": "SecurePass123",
    "phoneNumber": "+44 7700 900000",
    "role": "PATIENT"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.chen@example.com",
    "password": "SecurePass123"
  }'
```

**Logout:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Forgot Password:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.chen@example.com"
  }'
```

**Reset Password:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123xyz789",
    "newPassword": "NewSecurePass456"
  }'
```

---

## Next Steps

- **[02-patient-endpoints.md](02-patient-endpoints.md)** - Patient-specific endpoints
- **[03-doctor-endpoints.md](03-doctor-endpoints.md)** - Doctor-specific endpoints
- **[04-admin-endpoints.md](04-admin-endpoints.md)** - Admin-specific endpoints

---

**Sprint 1, Dev Task 11** - Authentication Endpoints Complete
