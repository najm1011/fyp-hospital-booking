# Authentication Wireframes

> **Project:** Hospital Appointment Booking System
> **Sprint:** Sprint 1 - Dev Task 10
> **Last Updated:** January 12, 2026

---

## 1. Login Page

**Route:** `/login`
**Access:** Public (unauthenticated users only)
**Requirements:** FR-1.2 (User Authentication)

### Desktop Layout (1024px+)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                          [Hospital Logo]                                │
│                    Hospital Booking System                              │
│                                                                         │
│    ┌───────────────────────────────────────────────────────┐           │
│    │                                                       │           │
│    │              Welcome Back                             │           │
│    │              Sign in to your account                  │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │  Email Address *                          │     │           │
│    │    │  [you@example.com........................]│     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │  Password *                               │     │           │
│    │    │  [•••••••••••••••••] [👁 Show]           │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    [ ] Remember me              Forgot password?     │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │           Sign In                         │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    ────────────  or  ────────────                    │           │
│    │                                                       │           │
│    │    Don't have an account?  Register here             │           │
│    │                                                       │           │
│    └───────────────────────────────────────────────────────┘           │
│                                                                         │
│                      © 2026 Hospital Booking System                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌─────────────────────────────┐
│    [≡]        [Logo]        │
├─────────────────────────────┤
│                             │
│      Welcome Back           │
│      Sign in to your        │
│      account                │
│                             │
│  ┌───────────────────────┐  │
│  │  Email *              │  │
│  │  [email@example.com]  │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Password *           │  │
│  │  [•••••••••] [👁]    │  │
│  └───────────────────────┘  │
│                             │
│  [ ] Remember me            │
│                             │
│  ┌───────────────────────┐  │
│  │     Sign In           │  │
│  └───────────────────────┘  │
│                             │
│  Forgot password?           │
│                             │
│  Don't have an account?     │
│  Register here              │
│                             │
└─────────────────────────────┘
```

### Interactive Elements

**Email Input**
- Type: `email`
- Validation: Required, valid email format
- Error states:
  - "Email is required"
  - "Please enter a valid email address"
  - "Invalid email or password" (on submit)

**Password Input**
- Type: `password` (toggleable to `text`)
- Validation: Required, minimum 8 characters
- Show/Hide toggle icon
- Error states:
  - "Password is required"
  - "Invalid email or password" (on submit)

**Remember Me Checkbox**
- Stores JWT token in localStorage (checked) vs sessionStorage (unchecked)

**Sign In Button**
- Primary button style
- Loading state: Shows spinner, text changes to "Signing in..."
- Disabled when form invalid or submitting

**Forgot Password Link**
- Opens forgot password modal or navigates to `/forgot-password`

**Register Link**
- Navigates to `/register`

### Validation Rules

**Client-Side:**
```javascript
Email:
  - Required: true
  - Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  - Max length: 255

Password:
  - Required: true
  - Min length: 8
  - Max length: 255
```

**Server-Side Response:**
```json
Success (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "patient@example.com",
    "firstName": "Sarah",
    "lastName": "Chen",
    "role": "PATIENT"
  }
}

Error (401):
{
  "error": "Invalid credentials",
  "message": "The email or password you entered is incorrect"
}
```

### User Flow

1. User lands on `/login`
2. Enters email and password
3. Clicks "Sign In"
4. Frontend validates inputs (inline)
5. POST request to `/api/auth/login` with credentials
6. On success:
   - Store JWT token in localStorage/sessionStorage
   - Redirect based on role:
     - PATIENT → `/patient/dashboard`
     - DOCTOR → `/doctor/dashboard`
     - ADMIN → `/admin/dashboard`
7. On error:
   - Display toast notification "Invalid email or password"
   - Clear password field
   - Focus on password input

### Accessibility

- Form has `<form>` element with proper `action` and `method`
- All inputs have associated `<label>` elements
- Error messages linked with `aria-describedby`
- Submit button is `type="submit"` for Enter key support
- Focus trap within modal if forgot password is modal
- Tab order: Email → Password → Remember me → Forgot password → Sign In → Register

---

## 2. Register Page

**Route:** `/register`
**Access:** Public (unauthenticated users only)
**Requirements:** FR-1.1 (User Registration)

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          [Hospital Logo]                                │
│                    Hospital Booking System                              │
│                                                                         │
│    ┌───────────────────────────────────────────────────────┐           │
│    │                                                       │           │
│    │              Create Account                           │           │
│    │              Join our healthcare platform             │           │
│    │                                                       │           │
│    │    ┌─────────────────────┐  ┌─────────────────────┐  │           │
│    │    │  First Name *       │  │  Last Name *        │  │           │
│    │    │  [Sarah]            │  │  [Chen]             │  │           │
│    │    └─────────────────────┘  └─────────────────────┘  │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │  Email Address *                          │     │           │
│    │    │  [sarah.chen@example.com] ✓               │     │           │
│    │    │  We'll send verification link to this email   │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │  Phone Number (Optional)                  │     │           │
│    │    │  [+44 7700 900000]                        │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │  Password *                               │     │           │
│    │    │  [•••••••••••••••••] [👁]                │     │           │
│    │    │  ▓▓▓░░░░░ Weak                            │     │           │
│    │    │  Must be at least 8 characters             │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │  Confirm Password *                       │     │           │
│    │    │  [•••••••••••••••••] [👁]                │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    [✓] I agree to the Terms of Service and          │           │
│    │        Privacy Policy                                │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │           Create Account                  │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    Already have an account?  Sign in                 │           │
│    │                                                       │           │
│    └───────────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────────┐
│    [<]        Register      │
├─────────────────────────────┤
│                             │
│      Create Account         │
│                             │
│  ┌───────────────────────┐  │
│  │  First Name *         │  │
│  │  [Sarah]              │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Last Name *          │  │
│  │  [Chen]               │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Email *              │  │
│  │  [email@example.com]  │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Phone (Optional)     │  │
│  │  [+44 7700 900000]    │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Password *           │  │
│  │  [•••••••••] [👁]    │  │
│  │  ▓▓░░░ Weak           │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  Confirm Password *   │  │
│  │  [•••••••••] [👁]    │  │
│  └───────────────────────┘  │
│                             │
│  [✓] I agree to Terms      │
│      and Privacy Policy     │
│                             │
│  ┌───────────────────────┐  │
│  │   Create Account      │  │
│  └───────────────────────┘  │
│                             │
│  Already registered?        │
│  Sign in                    │
│                             │
└─────────────────────────────┘
```

### Interactive Elements

**First Name / Last Name**
- Required fields
- Min length: 2, Max length: 100
- Only letters, spaces, hyphens, apostrophes
- Error: "First name is required", "Invalid characters"

**Email Address**
- Required, unique validation
- Real-time check via `/api/auth/check-email` (debounced 500ms)
- Shows green checkmark if available
- Error: "Email already registered"

**Phone Number**
- Optional
- UK format validation: `+44 XXXX XXXXXX` or `07XXX XXXXXX`
- Formats automatically as user types
- Error: "Invalid UK phone number format"

**Password**
- Required, minimum 8 characters
- Must contain: 1 uppercase, 1 lowercase, 1 number
- Strength meter: Weak (red) / Medium (yellow) / Strong (green)
- Show/hide toggle
- Error messages:
  - "Password must be at least 8 characters"
  - "Password must contain uppercase, lowercase, and number"

**Confirm Password**
- Must match password field
- Real-time validation on blur
- Error: "Passwords do not match"

**Terms Checkbox**
- Required before submission
- Links to Terms of Service (opens in new tab)
- Error: "You must agree to continue"

**Create Account Button**
- Disabled until all validations pass
- Loading state: "Creating account..."
- Success: Redirect to email verification page

### Validation Rules

```javascript
firstName: {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[a-zA-Z\s'-]+$/
}

lastName: {
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[a-zA-Z\s'-]+$/
}

email: {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  unique: true (async check),
  maxLength: 255
}

phoneNumber: {
  required: false,
  pattern: /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/
}

password: {
  required: true,
  minLength: 8,
  maxLength: 255,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
}

confirmPassword: {
  required: true,
  match: password
}

termsAccepted: {
  required: true,
  mustBeTrue: true
}
```

### API Request

```json
POST /api/auth/register
{
  "firstName": "Sarah",
  "lastName": "Chen",
  "email": "sarah.chen@example.com",
  "phoneNumber": "+44 7700 900000",
  "password": "SecurePass123",
  "role": "PATIENT"
}

Response (201 Created):
{
  "message": "Registration successful. Please check your email to verify your account.",
  "userId": 1,
  "email": "sarah.chen@example.com"
}

Error (400 Bad Request):
{
  "error": "Validation failed",
  "fields": {
    "email": "This email is already registered",
    "password": "Password too weak"
  }
}
```

### User Flow

1. User navigates to `/register`
2. Fills in form with real-time validation
3. Email availability checked on blur (debounced)
4. Password strength meter updates as user types
5. Clicks "Create Account"
6. Frontend validates all fields
7. POST request to `/api/auth/register`
8. On success:
   - Show success toast: "Account created! Check your email."
   - Redirect to `/verify-email` with instructions
9. On error:
   - Display field-specific errors inline
   - Show toast for general errors

### Accessibility

- Autofocus on first name input
- Labels properly associated with inputs
- Password requirements announced to screen readers
- Error summary at top of form for keyboard users
- Color-blind friendly strength indicator (uses text + color)
- Terms checkbox has clear label and link

---

## 3. Forgot Password Modal

**Trigger:** "Forgot password?" link on login page
**Access:** Public
**Requirements:** FR-1.2 (Password Recovery)

### Modal Layout

```
     ┌─────────────────────────────────────────────┐
     │  Forgot Password                        [×] │
     ├─────────────────────────────────────────────┤
     │                                             │
     │  Enter your email address and we'll send    │
     │  you a link to reset your password.         │
     │                                             │
     │  ┌───────────────────────────────────────┐  │
     │  │  Email Address *                      │  │
     │  │  [you@example.com.................]   │  │
     │  └───────────────────────────────────────┘  │
     │                                             │
     │  ┌───────────────────────────────────────┐  │
     │  │           Send Reset Link             │  │
     │  └───────────────────────────────────────┘  │
     │                                             │
     │  Remember your password?  Sign in           │
     │                                             │
     └─────────────────────────────────────────────┘
```

### Success State

```
     ┌─────────────────────────────────────────────┐
     │  Check Your Email                       [×] │
     ├─────────────────────────────────────────────┤
     │                                             │
     │            ✉                                │
     │                                             │
     │  We've sent a password reset link to:       │
     │                                             │
     │      sarah.chen@example.com                 │
     │                                             │
     │  Please check your inbox and click the      │
     │  link to reset your password.               │
     │                                             │
     │  Didn't receive the email?                  │
     │  Resend link                                │
     │                                             │
     │  ┌───────────────────────────────────────┐  │
     │  │           Back to Login               │  │
     │  └───────────────────────────────────────┘  │
     │                                             │
     └─────────────────────────────────────────────┘
```

### User Flow

1. User clicks "Forgot password?" on login page
2. Modal opens with email input
3. User enters email address
4. Clicks "Send Reset Link"
5. POST request to `/api/auth/forgot-password`
6. On success:
   - Modal content changes to success state
   - Shows email address password was sent to
   - "Resend link" available after 60 seconds (countdown timer)
7. User checks email and clicks reset link
8. Redirected to `/reset-password?token=xyz`

### API Request

```json
POST /api/auth/forgot-password
{
  "email": "sarah.chen@example.com"
}

Response (200):
{
  "message": "If this email exists, a reset link has been sent",
  "maskedEmail": "s***h@example.com"
}
```

Note: Always return 200 even if email doesn't exist (security best practice)

---

## 4. Reset Password Page

**Route:** `/reset-password?token=xyz`
**Access:** Public with valid token
**Requirements:** FR-1.2 (Password Recovery)

### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          [Hospital Logo]                                │
│                    Hospital Booking System                              │
│                                                                         │
│    ┌───────────────────────────────────────────────────────┐           │
│    │                                                       │           │
│    │              Reset Password                           │           │
│    │              Create a new password for your account   │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │  New Password *                           │     │           │
│    │    │  [•••••••••••••••••] [👁]                │     │           │
│    │    │  ▓▓▓▓▓░░░░ Strong                         │     │           │
│    │    │  At least 8 characters, uppercase & number│     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │  Confirm New Password *                   │     │           │
│    │    │  [•••••••••••••••••] [👁]                │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │           Reset Password                  │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    Back to login                                     │           │
│    │                                                       │           │
│    └───────────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Invalid/Expired Token

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          [Hospital Logo]                                │
│                                                                         │
│    ┌───────────────────────────────────────────────────────┐           │
│    │                                                       │           │
│    │                    ⚠                                 │           │
│    │                                                       │           │
│    │              Invalid Reset Link                       │           │
│    │                                                       │           │
│    │    This password reset link is invalid or has        │           │
│    │    expired. Please request a new one.                │           │
│    │                                                       │           │
│    │    ┌───────────────────────────────────────────┐     │           │
│    │    │      Request New Reset Link               │     │           │
│    │    └───────────────────────────────────────────┘     │           │
│    │                                                       │           │
│    │    Back to login                                     │           │
│    │                                                       │           │
│    └───────────────────────────────────────────────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### User Flow

1. User clicks link in email → `/reset-password?token=xyz`
2. Frontend validates token via `/api/auth/validate-token`
3. If valid: Show password reset form
4. If invalid: Show error state with "Request New Reset Link" button
5. User enters new password (validated in real-time)
6. Clicks "Reset Password"
7. POST request to `/api/auth/reset-password`
8. On success:
   - Show success toast: "Password updated successfully!"
   - Redirect to `/login` after 2 seconds
9. On error:
   - Display error message
   - Allow retry

### API Request

```json
POST /api/auth/reset-password
{
  "token": "abc123...",
  "newPassword": "NewSecurePass123"
}

Response (200):
{
  "message": "Password has been reset successfully"
}

Error (400):
{
  "error": "Invalid or expired token",
  "message": "Please request a new password reset link"
}
```

---

## Navigation Between Auth Pages

```
Login Page
  ├─> "Register here" → Register Page
  ├─> "Forgot password?" → Forgot Password Modal
  └─> Successful login → Role-based Dashboard

Register Page
  ├─> "Sign in" → Login Page
  └─> Successful registration → Email Verification Page

Forgot Password Modal
  ├─> "Sign in" → Close modal, return to Login
  └─> Successful submission → Success State → "Back to Login"

Reset Password Page
  ├─> "Back to login" → Login Page
  └─> Successful reset → Auto-redirect to Login Page (2s delay)
```

---

## Accessibility Checklist

- [ ] All forms have proper `<label>` elements
- [ ] Error messages linked with `aria-describedby`
- [ ] Password strength communicated to screen readers
- [ ] Focus management (auto-focus first field, trap in modals)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Loading states announced to screen readers
- [ ] Success/error states have ARIA live regions

---

## Security Considerations

1. **Password Requirements:** Enforced on both client and server
2. **Rate Limiting:** Forgot password endpoint limited to 3 requests/hour/IP
3. **Token Expiry:** Reset tokens expire after 1 hour
4. **HTTPS Only:** All auth endpoints require HTTPS in production
5. **No User Enumeration:** Forgot password always returns success (don't reveal if email exists)
6. **BCrypt Hashing:** Passwords hashed with BCrypt (cost factor 12)
7. **JWT Expiry:** Tokens expire after 24 hours
8. **XSS Protection:** All user input sanitized before rendering

---

## Next: Patient Views

See [02-patient-views.md](02-patient-views.md) for patient dashboard and appointment booking wireframes.
