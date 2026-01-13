# UI Wireframes - Hospital Booking System

> **Project:** Hospital Appointment Booking System
> **Student:** Najm (2356070)
> **Supervisor:** Steve Counsell
> **Date:** January 12, 2026
> **Sprint:** Sprint 1 - Dev Task 10

---

## Overview

This directory contains comprehensive UI wireframes for the Hospital Booking System, designed to support three primary user roles: Patient, Doctor, and Administrator. All wireframes follow responsive design principles, WCAG 2.1 AA accessibility standards, and modern UX best practices.

---

## Design Principles

### 1. Accessibility First (NFR-4.1)
- WCAG 2.1 Level AA compliance
- Minimum 4.5:1 color contrast ratio for text
- Keyboard navigation support on all interactive elements
- Screen reader friendly with ARIA labels
- Focus indicators visible on all focusable elements
- Font size minimum 16px for body text

### 2. Responsive Design (NFR-4.1)
- Mobile-first approach (320px → 768px → 1024px → 1440px+)
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Touch-friendly targets (minimum 44x44px tap areas)
- Collapsible navigation for mobile devices

### 3. Consistency
- Unified component library across all views
- Consistent spacing system (4px base grid)
- Standardized button styles and states
- Predictable navigation patterns

### 4. Performance (NFR-4.1)
- Maximum 3 clicks to complete primary tasks
- Inline validation for forms
- Loading states for async operations
- Optimistic UI updates where appropriate

---

## Wireframe Structure

### Authentication Flows
- [01-authentication.md](01-authentication.md)
  - Login page
  - Register page
  - Forgot password flow
  - Email verification

### Patient Role
- [02-patient-views.md](02-patient-views.md)
  - Patient dashboard
  - Book appointment (multi-step)
  - View upcoming appointments
  - Appointment history
  - Reschedule/cancel appointment
  - Profile settings

### Doctor Role
- [03-doctor-views.md](03-doctor-views.md)
  - Doctor dashboard
  - Daily schedule view
  - Manage availability
  - Appointment details
  - Patient notes interface
  - Profile management

### Admin Role
- [04-admin-views.md](04-admin-views.md)
  - Admin dashboard with analytics
  - User management (CRUD)
  - Department management
  - System-wide appointment view
  - Reports and statistics

### Shared Components
- [05-component-library.md](05-component-library.md)
  - Navigation (header, sidebar, mobile menu)
  - Buttons and form controls
  - Cards and panels
  - Modals and dialogs
  - Tables and lists
  - Toast notifications
  - Loading states
  - Empty states

### Responsive Layouts
- [06-responsive-specs.md](06-responsive-specs.md)
  - Mobile layouts (320px-767px)
  - Tablet layouts (768px-1023px)
  - Desktop layouts (1024px+)
  - Navigation patterns per breakpoint

---

## Color Palette

### Primary Colors
```
Primary Blue (Actions, Links)
- 50:  #E3F2FD
- 500: #2196F3  ← Primary action color
- 700: #1976D2
- 900: #0D47A1

Success Green (Confirmations)
- 500: #4CAF50
- 700: #388E3C

Error Red (Warnings, Cancellations)
- 500: #F44336
- 700: #D32F2F

Warning Amber (Alerts)
- 500: #FF9800
- 700: #F57C00
```

### Neutral Colors
```
Gray Scale
- 50:  #FAFAFA (Backgrounds)
- 100: #F5F5F5
- 200: #EEEEEE (Borders)
- 400: #BDBDBD (Disabled text)
- 700: #616161 (Secondary text)
- 900: #212121 (Primary text)
```

### Semantic Colors
```
- Link: #2196F3 (Primary 500)
- Success: #4CAF50
- Error: #F44336
- Warning: #FF9800
- Info: #2196F3
```

---

## Typography

### Font Family
```
Primary: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Monospace: 'Fira Code', 'Courier New', monospace (for IDs, codes)
```

### Font Sizes (Tailwind Scale)
```
- text-xs:   12px / 16px line-height (Labels, captions)
- text-sm:   14px / 20px (Secondary text)
- text-base: 16px / 24px (Body text) ← Default
- text-lg:   18px / 28px (Subheadings)
- text-xl:   20px / 28px (Card titles)
- text-2xl:  24px / 32px (Section headings)
- text-3xl:  30px / 36px (Page headings)
- text-4xl:  36px / 40px (Dashboard welcome)
```

### Font Weights
```
- font-normal:   400 (Body text)
- font-medium:   500 (Buttons, labels)
- font-semibold: 600 (Headings)
- font-bold:     700 (Page titles)
```

---

## Spacing System (4px Grid)

```
- space-1:  4px   (Tight spacing)
- space-2:  8px   (Small gaps)
- space-3:  12px  (Default inline spacing)
- space-4:  16px  (Default block spacing)
- space-6:  24px  (Section spacing)
- space-8:  32px  (Large gaps)
- space-12: 48px  (Component separation)
- space-16: 64px  (Page sections)
```

---

## Component States

### Button States
1. **Default**: Primary color, white text, rounded corners
2. **Hover**: Darker shade (Primary 700)
3. **Active**: Pressed appearance (scale 0.98)
4. **Disabled**: Gray background, reduced opacity (0.5)
5. **Loading**: Spinner icon, disabled state

### Input States
1. **Default**: Gray border, white background
2. **Focus**: Blue border (2px), focus ring
3. **Error**: Red border, error icon, helper text below
4. **Success**: Green border, checkmark icon
5. **Disabled**: Gray background, cursor not-allowed

---

## Icon System

**Library:** Heroicons v2 (Outline for default, Solid for emphasis)

**Common Icons:**
- Calendar: Appointments, scheduling
- Clock: Time slots, duration
- User: Profiles, patients
- UserGroup: Departments, doctors
- Bell: Notifications, reminders
- Check: Success, completed
- X: Close, cancel, error
- Pencil: Edit actions
- Trash: Delete actions
- ChevronRight: Navigation, forward
- MagnifyingGlass: Search functionality

---

## Navigation Patterns

### Desktop (1024px+)
- **Persistent sidebar** (240px width) with role-based menu items
- **Top header** with user profile, notifications, logout
- **Main content area** with page heading and breadcrumbs

### Tablet (768px-1023px)
- **Collapsible sidebar** (toggleable hamburger menu)
- **Simplified header** with essential controls
- **Full-width content** when sidebar collapsed

### Mobile (< 768px)
- **Bottom navigation bar** for primary actions
- **Hamburger menu** for secondary navigation
- **Full-screen modals** for forms
- **Swipe gestures** for dismissible elements

---

## User Flows

### Patient: Book Appointment (3 clicks - NFR-4.1)
1. Dashboard → "Book Appointment" button
2. Select doctor from filtered list
3. Choose available time slot
4. Confirm booking → Success confirmation

### Doctor: Set Availability (2 clicks)
1. Dashboard → "Manage Availability"
2. Select days/times → Save

### Admin: Create User (2 clicks)
1. Dashboard → "User Management" → "Add User"
2. Fill form → Submit

---

## Form Validation

### Client-Side Validation (Inline)
- **Email**: Valid email format, availability check
- **Password**: Minimum 8 characters, 1 uppercase, 1 number
- **Phone**: UK format validation (+44 or 07...)
- **Required fields**: Red asterisk (*), error on blur
- **Real-time feedback**: Green checkmark on valid input

### Error Messages
```
✗ Email is required
✗ Invalid email format
✗ This email is already registered
✓ Email available
```

---

## Accessibility Features

### Keyboard Navigation
- `Tab`: Navigate between focusable elements
- `Enter`/`Space`: Activate buttons and links
- `Esc`: Close modals and dropdowns
- `Arrow keys`: Navigate lists and date pickers

### Screen Reader Support
- Semantic HTML (`<nav>`, `<main>`, `<section>`)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Skip-to-content link at page top

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal, 3:1 for large)
- Focus indicators have 3:1 contrast with background
- Interactive elements distinguishable without color alone

---

## Error Handling

### Form Errors
- Inline validation with red border and error message
- Summary of errors at top of form for screen readers
- Focus moved to first error field on submit

### API Errors
- Toast notification for transient errors
- Modal dialog for critical errors requiring action
- Retry mechanism for failed requests

### Empty States
- Friendly illustrations for empty appointment lists
- Call-to-action button to resolve empty state
- Helpful text explaining why list is empty

---

## Loading States

### Page Load
- Skeleton screens matching content layout
- Animated pulse effect on placeholder elements
- No layout shift when content loads

### Action Feedback
- Button spinner during async operations
- Disabled state to prevent double submission
- Success/error toast on completion

---

## Responsive Images

### Doctor Profile Photos
- Desktop: 120x120px
- Mobile: 80x80px
- Format: WebP with JPEG fallback
- Lazy loading below fold

### Department Icons
- Size: 48x48px
- SVG format for crisp rendering
- Accessible alt text

---

## Wireframe Annotations

Each wireframe includes:
1. **Screen title** and user role
2. **Functional requirements** mapped (FR-X.X)
3. **Interactive elements** with hover/click states
4. **Responsive behavior** notes
5. **Validation rules** for forms
6. **Accessibility considerations**

---

## Tools and Technologies

**Design:** ASCII art + Mermaid diagrams (documentation-first)
**Frontend Implementation:** React 19 + Tailwind CSS + shadcn/ui
**Icons:** Heroicons v2
**Fonts:** Inter (Google Fonts)

---

## Next Steps

1. Review wireframes with stakeholders (Sprint 1)
2. Create high-fidelity mockups in Figma (Sprint 2, optional)
3. Implement React components from wireframes (Sprint 2-3)
4. Conduct usability testing with personas (Sprint 4)

---

## Document Version

**Version:** 1.0
**Last Updated:** January 12, 2026
**Status:** Sprint 1 - Dev Task 10 Complete
