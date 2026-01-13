# Component Library

> **Project:** Hospital Appointment Booking System
> **Sprint:** Sprint 1 - Dev Task 10
> **Last Updated:** January 12, 2026

---

## Overview

This document defines reusable UI components used across the Hospital Booking System. All components follow consistent design patterns, accessibility standards (WCAG 2.1 AA), and are built with React + Tailwind CSS.

---

## 1. Buttons

### Primary Button

```
┌────────────────────┐
│   Book Appointment │  ← Default state
└────────────────────┘

┌────────────────────┐
│   Book Appointment │  ← Hover state (darker)
└────────────────────┘

┌────────────────────┐
│ ⟳ Booking...      │  ← Loading state
└────────────────────┘

┌────────────────────┐
│   Book Appointment │  ← Disabled state (gray, opacity 0.5)
└────────────────────┘
```

**Usage:** Primary actions (submit forms, book appointments, save changes)

**Tailwind Classes:**
```jsx
className="
  bg-blue-500 hover:bg-blue-700
  text-white font-medium
  px-6 py-3 rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
"
```

### Secondary Button

```
┌────────────────────┐
│      Cancel        │  ← Outline style
└────────────────────┘
```

**Usage:** Secondary actions (cancel, go back)

**Tailwind Classes:**
```jsx
className="
  bg-white hover:bg-gray-50
  text-gray-700 font-medium
  px-6 py-3 rounded-lg
  border border-gray-300
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-gray-300
"
```

### Danger Button

```
┌────────────────────┐
│  Delete Account    │  ← Red for destructive actions
└────────────────────┘
```

**Usage:** Destructive actions (delete, cancel appointment)

**Tailwind Classes:**
```jsx
className="
  bg-red-500 hover:bg-red-700
  text-white font-medium
  px-6 py-3 rounded-lg
"
```

### Icon Button

```
┌───┐
│ × │  ← Close button
└───┘

┌───┐
│ ⋮ │  ← Menu button
└───┘
```

**Usage:** Actions with icons only

**Accessibility:** Must have aria-label

---

## 2. Form Inputs

### Text Input

```
┌──────────────────────────────────────┐
│  Email Address *                     │  ← Label
│  ┌────────────────────────────────┐  │
│  │ you@example.com                │  │  ← Input field
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

// Error State
┌──────────────────────────────────────┐
│  Email Address *                     │
│  ┌────────────────────────────────┐  │
│  │ invalid-email                  │  │  ← Red border
│  └────────────────────────────────┘  │
│  ✗ Please enter a valid email        │  ← Error message
└──────────────────────────────────────┘

// Success State
┌──────────────────────────────────────┐
│  Email Address *                     │
│  ┌────────────────────────────────┐  │
│  │ sarah.chen@example.com     ✓   │  │  ← Green checkmark
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Tailwind Classes:**
```jsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  Email Address <span className="text-red-500">*</span>
</label>
<input
  type="email"
  className="
    w-full px-4 py-3
    border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500
    placeholder:text-gray-400
  "
  aria-describedby="email-error"
/>
<p id="email-error" className="mt-1 text-sm text-red-600">
  ✗ Please enter a valid email
</p>
```

### Select Dropdown

```
┌──────────────────────────────────────┐
│  Department                          │
│  ┌────────────────────────────────┐  │
│  │ Cardiology               ▾    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

// Opened
┌──────────────────────────────────────┐
│  Department                          │
│  ┌────────────────────────────────┐  │
│  │ Cardiology               ▾    │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ Cardiology                ✓   │  │  ← Selected
│  │ Dermatology                    │  │
│  │ General Practice               │  │
│  │ Orthopedics                    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Checkbox

```
[✓] I agree to the Terms of Service

[ ] Send me email notifications
```

**Tailwind Classes:**
```jsx
<label className="flex items-center space-x-3 cursor-pointer">
  <input
    type="checkbox"
    className="
      w-5 h-5
      text-blue-500 border-gray-300 rounded
      focus:ring-2 focus:ring-blue-500
    "
  />
  <span className="text-sm text-gray-700">
    I agree to the Terms of Service
  </span>
</label>
```

### Radio Buttons

```
○ Patient
● Doctor
○ Admin
```

---

## 3. Cards

### Basic Card

```
┌────────────────────────────────────────────────┐
│  Card Title                           [Action] │
├────────────────────────────────────────────────┤
│                                                │
│  Card content goes here. This is a container   │
│  for related information.                      │
│                                                │
│  [Button]  [Button]                            │
│                                                │
└────────────────────────────────────────────────┘
```

**Tailwind Classes:**
```jsx
<div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
    <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
    <button>Action</button>
  </div>
  <div className="px-6 py-4">
    Card content
  </div>
</div>
```

### Appointment Card

```
┌────────────────────────────────────────────────┐
│  📅 Monday, Jan 15, 2026  •  09:00 - 09:30     │
│  ────────────────────────────────────────────  │
│                                                │
│  [👨‍⚕️]  Dr. Emily Thompson                     │
│           Cardiology  •  General Cardiology    │
│                                                │
│  📍 Room 305, Cardiology Wing                  │
│  📝 Chest pain follow-up                       │
│                                                │
│  [Reschedule] [Cancel] [View Details]         │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 4. Modals

### Standard Modal

```
    ┌──────────────────────────────────────────┐
    │  Modal Title                         [×] │
    ├──────────────────────────────────────────┤
    │                                          │
    │  Modal content goes here.                │
    │                                          │
    │  This is where you explain what the      │
    │  user needs to do.                       │
    │                                          │
    │  [Cancel]  [Confirm]                     │
    │                                          │
    └──────────────────────────────────────────┘
```

**Features:**
- Backdrop overlay (semi-transparent black)
- Focus trap (Tab cycles within modal)
- Escape key closes modal
- Click outside closes modal (optional)
- Return focus to trigger element on close

**Tailwind Classes:**
```jsx
{/* Backdrop */}
<div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

{/* Modal */}
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-lg font-semibold">Modal Title</h3>
      <button aria-label="Close">×</button>
    </div>

    {/* Body */}
    <div className="px-6 py-4">
      Content
    </div>

    {/* Footer */}
    <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
      <button>Cancel</button>
      <button>Confirm</button>
    </div>
  </div>
</div>
```

---

## 5. Toast Notifications

### Success Toast

```
┌────────────────────────────────────┐
│ ✓  Appointment booked successfully │  ← Green background
└────────────────────────────────────┘
```

### Error Toast

```
┌────────────────────────────────────┐
│ ✗  Failed to book appointment      │  ← Red background
└────────────────────────────────────┘
```

### Info Toast

```
┌────────────────────────────────────┐
│ ℹ  Your session will expire soon   │  ← Blue background
└────────────────────────────────────┘
```

**Position:** Top-right corner, stacked vertically
**Duration:** 5 seconds (auto-dismiss)
**Interaction:** Click to dismiss early

**Tailwind Classes:**
```jsx
<div className="fixed top-4 right-4 z-50 space-y-2">
  <div className="
    bg-green-500 text-white
    px-6 py-4 rounded-lg shadow-lg
    flex items-center space-x-3
    animate-slide-in-right
  ">
    <span className="text-xl">✓</span>
    <span>Appointment booked successfully</span>
  </div>
</div>
```

---

## 6. Navigation

### Desktop Header

```
┌────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Home  Appointments  Profile           │
│                                              [🔔3] Sarah Chen [▾]│
└────────────────────────────────────────────────────────────────┘
```

### Sidebar (Desktop)

```
┌─────────────────┐
│ 🏠 Dashboard    │  ← Active state (blue background)
│ 📅 Appointments │
│ 📋 History      │
│ ⚙  Settings     │
│ 🚪 Logout       │
└─────────────────┘
```

### Bottom Navigation (Mobile)

```
┌─────────────────────────────────┐
│ [🏠]  [📅]  [📋]  [⚙]  [👤]  │
│ Home  Appts  Hist  Set.  Prof. │
└─────────────────────────────────┘
```

**Tailwind Classes:**
```jsx
<nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30">
  <div className="flex justify-around">
    {navItems.map(item => (
      <button className="
        flex flex-col items-center
        py-3 px-4
        text-gray-600 hover:text-blue-500
        active:bg-blue-50
      ">
        <span className="text-2xl">{item.icon}</span>
        <span className="text-xs mt-1">{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

---

## 7. Tables

### Data Table

```
┌──────────────────────────────────────────────────────────────┐
│  Users                                         [+ Add User]  │
├─────┬────────────┬───────────────────┬──────────┬───────────┤
│ ID  │ Name       │ Email             │ Role     │ Actions   │
├─────┼────────────┼───────────────────┼──────────┼───────────┤
│1001 │Sarah Chen  │sarah.chen@...     │ PATIENT  │[Edit]     │
│1002 │Dr. Thompson│dr.thompson@...    │ DOCTOR   │[Edit]     │
│1003 │Admin User  │admin@hospital.com │ ADMIN    │[Edit]     │
└─────┴────────────┴───────────────────┴──────────┴───────────┘
```

**Features:**
- Sortable columns (click header to sort)
- Row hover effect
- Pagination
- Responsive (horizontal scroll on mobile)

**Tailwind Classes:**
```jsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          Sarah Chen
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 8. Status Badges

### Appointment Status

```
● SCHEDULED   ← Blue
✓ COMPLETED   ← Green
× CANCELLED   ← Red
⚠ NO_SHOW     ← Amber
```

**Tailwind Classes:**
```jsx
<span className="
  inline-flex items-center
  px-3 py-1 rounded-full
  text-xs font-medium
  bg-blue-100 text-blue-800
">
  ● SCHEDULED
</span>

<span className="bg-green-100 text-green-800">✓ COMPLETED</span>
<span className="bg-red-100 text-red-800">× CANCELLED</span>
<span className="bg-amber-100 text-amber-800">⚠ NO_SHOW</span>
```

### User Role Badge

```
PATIENT   ← Gray
DOCTOR    ← Purple
ADMIN     ← Orange
```

---

## 9. Loading States

### Spinner

```
  ⟳    ← Rotating icon
```

**Tailwind Classes:**
```jsx
<div className="flex justify-center items-center">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
</div>
```

### Skeleton Screen

```
┌────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓░░░░░░░░░░                │  ← Animated pulse
│  ▓▓▓▓░░░░░░░░░░░░░░░░░░            │
│                                    │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░             │
│  ▓▓▓▓▓▓░░░░░░░░░░░░░░░             │
└────────────────────────────────────┘
```

**Tailwind Classes:**
```jsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

---

## 10. Empty States

### No Appointments

```
┌────────────────────────────────────┐
│                                    │
│           📅                       │
│                                    │
│    No Upcoming Appointments        │
│                                    │
│  You don't have any scheduled      │
│  appointments at this time.        │
│                                    │
│  ┌──────────────────────────────┐  │
│  │   + Book an Appointment      │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

**Features:**
- Friendly icon/illustration
- Helpful message
- Clear call-to-action

---

## 11. Date & Time Pickers

### Calendar Picker

```
┌──────────────────────────┐
│   JANUARY 2026           │
│                          │
│  Su Mo Tu We Th Fr Sa    │
│         1  2  3  4       │
│  5  6  7  8  9  10 11    │
│  12 13 14 [15]16 17 18   │  ← Selected date
│  19 20 21  22 23 24 25   │
│  26 27 28  29 30 31      │
│                          │
│  [< Prev]     [Next >]   │
└──────────────────────────┘
```

**Features:**
- Arrow key navigation
- Keyboard date input
- Disable past dates
- Highlight today

### Time Slot Selector

```
MORNING
┌──────┐ ┌──────┐ ┌──────┐
│09:00│ │09:30│ │10:00│  ← Available (white)
└──────┘ └──────┘ └──────┘

┌──────┐ ┌──────┐ ┌──────┐
│10:30│ │11:00│ │11:30│
│BOOKED│ └──────┘ └──────┘  ← Booked (gray, disabled)
└──────┘
```

**States:**
- Available: White background, blue border on hover
- Selected: Blue background, white text
- Booked: Gray background, disabled
- Past: Light gray, disabled

---

## 12. Progress Indicators

### Multi-Step Form

```
Step 1 of 3: Select Doctor
━━━━━━━━━━░░░░░░░░░░░░░░░░░░  33%

◉ Select Doctor  →  ○ Choose Time  →  ○ Confirm
```

**Tailwind Classes:**
```jsx
<div className="mb-6">
  <div className="flex justify-between mb-2">
    <span className="text-sm font-medium text-gray-700">
      Step 1 of 3: Select Doctor
    </span>
    <span className="text-sm text-gray-500">33%</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className="bg-blue-500 h-2 rounded-full" style="width: 33%"></div>
  </div>
</div>
```

---

## 13. Alerts & Banners

### Info Banner

```
┌──────────────────────────────────────────────────────┐
│ ℹ  System maintenance scheduled for Jan 20, 2026    │
└──────────────────────────────────────────────────────┘
```

### Warning Banner

```
┌──────────────────────────────────────────────────────┐
│ ⚠  Your session will expire in 5 minutes            │
└──────────────────────────────────────────────────────┘
```

### Success Banner

```
┌──────────────────────────────────────────────────────┐
│ ✓  Your profile has been updated successfully       │
└──────────────────────────────────────────────────────┘
```

---

## 14. Accessibility Components

### Skip to Content Link

```
[Skip to main content]  ← Visible only on keyboard focus
```

**Implementation:**
```jsx
<a
  href="#main-content"
  className="
    sr-only focus:not-sr-only
    focus:absolute focus:top-4 focus:left-4
    focus:z-50 focus:px-4 focus:py-2
    focus:bg-blue-500 focus:text-white focus:rounded
  "
>
  Skip to main content
</a>
```

### Screen Reader Only Text

```jsx
<span className="sr-only">Loading...</span>
```

---

## Component Usage Guidelines

### When to Use Each Component

1. **Primary Button:** Main action on a page (Book, Save, Submit)
2. **Secondary Button:** Alternative actions (Cancel, Back)
3. **Danger Button:** Destructive actions (Delete, Remove)
4. **Modal:** User decision required before proceeding
5. **Toast:** Feedback on completed actions
6. **Card:** Group related information
7. **Table:** Display structured data with sorting/filtering
8. **Skeleton:** Show loading state without blocking UI

### Consistency Rules

1. Always use the same component for the same purpose
2. Maintain consistent spacing (4px grid)
3. Use semantic HTML elements
4. Provide accessible labels and ARIA attributes
5. Test all components with keyboard navigation
6. Ensure color contrast meets WCAG AA standards

---

## Next: Responsive Specifications

See [06-responsive-specs.md](06-responsive-specs.md) for breakpoint-specific layouts and mobile adaptations.
