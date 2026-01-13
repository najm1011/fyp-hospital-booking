# Patient Role Wireframes

> **Project:** Hospital Appointment Booking System
> **Sprint:** Sprint 1 - Dev Task 10
> **Last Updated:** January 12, 2026

---

## 1. Patient Dashboard

**Route:** `/patient/dashboard`
**Access:** PATIENT role only
**Requirements:** FR-3.3, FR-5.1

### Desktop Layout (1024px+)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Home  Appointments  Profile    [🔔3] Sarah Chen [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│ 🏠 │  Welcome back, Sarah!                                    January 12, 2026│
│    │                                                                           │
│ 📅 │  ┌────────────────────────────────────────────────────────────────┐      │
│    │  │  UPCOMING APPOINTMENTS                          View All →    │      │
│ 📋 │  ├────────────────────────────────────────────────────────────────┤      │
│    │  │                                                                │      │
│ ⚙  │  │  ┌──────────────────────────────────────────────────────┐    │      │
│    │  │  │  📅 Monday, Jan 15, 2026  •  09:00 - 09:30          │    │      │
│ 🚪 │  │  │                                                      │    │      │
│    │  │  │  [👨‍⚕️]  Dr. Emily Thompson                          │    │      │
│    │  │  │         Cardiology  •  General Cardiology           │    │      │
│    │  │  │                                                      │    │      │
│    │  │  │  📍 Room 305, Cardiology Wing                       │    │      │
│    │  │  │  📝 Reason: Follow-up chest pain consultation       │    │      │
│    │  │  │                                                      │    │      │
│    │  │  │  [Reschedule] [Cancel] [View Details]              │    │      │
│    │  │  └──────────────────────────────────────────────────────┘    │      │
│    │  │                                                                │      │
│    │  │  ┌──────────────────────────────────────────────────────┐    │      │
│    │  │  │  📅 Wednesday, Jan 17, 2026  •  14:00 - 14:30       │    │      │
│    │  │  │                                                      │    │      │
│    │  │  │  [👨‍⚕️]  Dr. James Wilson                            │    │      │
│    │  │  │         Dermatology  •  Skin Specialist             │    │      │
│    │  │  │                                                      │    │      │
│    │  │  │  📍 Room 102, Dermatology Department                │    │      │
│    │  │  │  📝 Reason: Annual skin check                       │    │      │
│    │  │  │                                                      │    │      │
│    │  │  │  [Reschedule] [Cancel] [View Details]              │    │      │
│    │  │  └──────────────────────────────────────────────────────┘    │      │
│    │  │                                                                │      │
│    │  └────────────────────────────────────────────────────────────────┘      │
│    │                                                                           │
│    │  ┌──────────────────────┐  ┌──────────────────────┐                     │
│    │  │  QUICK ACTIONS       │  │  HEALTH TIPS         │                     │
│    │  ├──────────────────────┤  ├──────────────────────┤                     │
│    │  │                      │  │                      │                     │
│    │  │  ┌────────────────┐  │  │  💡 Remember to      │                     │
│    │  │  │ + Book New     │  │  │  bring your medical  │                     │
│    │  │  │   Appointment  │  │  │  history to your     │                     │
│    │  │  └────────────────┘  │  │  appointment         │                     │
│    │  │                      │  │                      │                     │
│    │  │  📋 View History     │  │  📞 Need to cancel?  │                     │
│    │  │                      │  │  Do so 24h in        │                     │
│    │  │  📄 Download Records │  │  advance to avoid    │                     │
│    │  │                      │  │  fees                │                     │
│    │  └──────────────────────┘  └──────────────────────┘                     │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘

Sidebar Menu:
  🏠 Dashboard (active)
  📅 Book Appointment
  📋 My Appointments
  ⚙  Profile Settings
  🚪 Logout
```

### Mobile Layout (< 768px)

```
┌─────────────────────────────────┐
│  [☰]  Dashboard      [🔔3] [👤]│
├─────────────────────────────────┤
│                                 │
│  Welcome, Sarah!                │
│  January 12, 2026               │
│                                 │
│  ┌───────────────────────────┐  │
│  │ + Book New Appointment    │  │
│  └───────────────────────────┘  │
│                                 │
│  UPCOMING APPOINTMENTS          │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Mon, Jan 15  •  09:00     │  │
│  │ ─────────────────────────  │  │
│  │ [👨‍⚕️] Dr. Emily Thompson  │  │
│  │ Cardiology                │  │
│  │                           │  │
│  │ Room 305                  │  │
│  │ Chest pain follow-up      │  │
│  │                           │  │
│  │ [Reschedule] [Cancel]     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Wed, Jan 17  •  14:00     │  │
│  │ ─────────────────────────  │  │
│  │ [👨‍⚕️] Dr. James Wilson    │  │
│  │ Dermatology               │  │
│  │                           │  │
│  │ Room 102                  │  │
│  │ Annual skin check         │  │
│  │                           │  │
│  │ [Reschedule] [Cancel]     │  │
│  └───────────────────────────┘  │
│                                 │
│  [View All Appointments →]      │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📅] [📋] [⚙] [Profile] │
└─────────────────────────────────┘
```

### Key Features

**Upcoming Appointments Card**
- Shows next 2-3 appointments chronologically
- Each card displays:
  - Date and time in readable format
  - Doctor photo, name, department, specialty
  - Location (room number)
  - Appointment reason (patient notes)
  - Quick actions: Reschedule, Cancel, View Details
- "View All" link navigates to full appointments list

**Quick Actions Panel**
- Primary CTA: "Book New Appointment" (large, prominent button)
- Secondary actions: View History, Download Records

**Health Tips Panel**
- Contextual tips based on upcoming appointments
- Reminders about cancellation policy

**Empty State** (no upcoming appointments):
```
┌────────────────────────────────────────────┐
│  UPCOMING APPOINTMENTS                     │
├────────────────────────────────────────────┤
│                                            │
│            📅                              │
│                                            │
│      No Upcoming Appointments              │
│                                            │
│  You don't have any scheduled appointments │
│  at this time.                             │
│                                            │
│  ┌──────────────────────────────────┐      │
│  │    + Book an Appointment         │      │
│  └──────────────────────────────────┘      │
│                                            │
└────────────────────────────────────────────┘
```

### API Calls

```javascript
GET /api/patient/dashboard
Response:
{
  "upcomingAppointments": [
    {
      "id": 123,
      "date": "2026-01-15",
      "startTime": "09:00",
      "endTime": "09:30",
      "doctor": {
        "id": 5,
        "firstName": "Emily",
        "lastName": "Thompson",
        "specialty": "General Cardiology",
        "department": "Cardiology",
        "photoUrl": "/uploads/doctors/5.jpg"
      },
      "location": "Room 305, Cardiology Wing",
      "patientNotes": "Follow-up chest pain consultation",
      "status": "SCHEDULED"
    }
  ],
  "appointmentCount": {
    "upcoming": 2,
    "past": 8,
    "total": 10
  },
  "nextAppointment": {
    "date": "2026-01-15",
    "time": "09:00",
    "daysUntil": 3
  }
}
```

---

## 2. Book Appointment Flow

**Route:** `/patient/book-appointment`
**Access:** PATIENT role only
**Requirements:** FR-3.1, FR-3.2 (Maximum 3 clicks - NFR-4.1)

### Step 1: Select Doctor

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Home  Appointments  Profile    [🔔3] Sarah Chen [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│ 🏠 │  Book Appointment                                Step 1 of 3: Select Doctor│
│    │                                                                           │
│ 📅 │  ┌─────────────────────────────────────────────────────────────────┐     │
│    │  │  🔍 Search doctors by name or specialty...                     │     │
│ 📋 │  └─────────────────────────────────────────────────────────────────┘     │
│    │                                                                           │
│ ⚙  │  Filter by:  [All Departments ▾]  [All Specialties ▾]  [Reset Filters] │
│    │                                                                           │
│ 🚪 │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  AVAILABLE DOCTORS (12 found)                                   │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  [👨‍⚕️]  Dr. Emily Thompson              ⭐ 4.8 (124)│     │    │
│    │  │  │           Cardiology  •  General Cardiology           │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  MD, MBBS • 15 years experience                       │     │    │
│    │  │  │  Specializes in heart disease, hypertension           │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  💰 Consultation: £150                                │     │    │
│    │  │  │  📅 Next Available: Mon, Jan 15 at 09:00              │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  [View Profile] [Select Doctor →]                    │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  [👨‍⚕️]  Dr. James Wilson                 ⭐ 4.9 (89) │     │    │
│    │  │  │           Dermatology  •  Skin Specialist             │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  MBBS, MD (Derm) • 12 years experience                │     │    │
│    │  │  │  Skin conditions, acne, eczema treatment              │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  💰 Consultation: £120                                │     │    │
│    │  │  │  📅 Next Available: Tue, Jan 16 at 10:30              │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  [View Profile] [Select Doctor →]                    │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  │  [Load More...]                                                 │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### Step 2: Select Date & Time

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Home  Appointments  Profile    [🔔3] Sarah Chen [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  [< Back] Book Appointment            Step 2 of 3: Select Date & Time   │
│    │                                                                           │
│    │  Selected Doctor: Dr. Emily Thompson  •  Cardiology                      │
│    │  ───────────────────────────────────────────────────────────────────     │
│    │                                                                           │
│    │  ┌──────────────────────────┐  ┌─────────────────────────────────────┐  │
│    │  │   JANUARY 2026           │  │  AVAILABLE TIME SLOTS               │  │
│    │  │                          │  │                                     │  │
│    │  │  Su Mo Tu We Th Fr Sa    │  │  📅 Monday, January 15, 2026        │  │
│    │  │         1  2  3  4       │  │                                     │  │
│    │  │  5  6  7  8  9  10 11    │  │  MORNING                            │  │
│    │  │  12 13 14 [15]16 17 18   │  │  ┌──────┐ ┌──────┐ ┌──────┐        │  │
│    │  │  19 20 21  22 23 24 25   │  │  │09:00│ │09:30│ │10:00│        │  │
│    │  │  26 27 28  29 30 31      │  │  └──────┘ └──────┘ └──────┘        │  │
│    │  │                          │  │  ┌──────┐ ┌──────┐ ┌──────┐        │  │
│    │  │  [< Prev]     [Next >]   │  │  │10:30│ │11:00│ │11:30│        │  │
│    │  │                          │  │  └──────┘ └──────┘ └──────┘        │  │
│    │  └──────────────────────────┘  │                                     │  │
│    │                                │  AFTERNOON                          │  │
│    │  Legend:                       │  ┌──────┐ ┌──────┐ ┌──────┐        │  │
│    │  • Available                   │  │14:00│ │14:30│ │15:00│        │  │
│    │  • Booked                      │  │      │ │      │ │ BOOKED│        │  │
│    │  • Selected                    │  └──────┘ └──────┘ └──────┘        │  │
│    │  • Past/Unavailable            │  ┌──────┐                          │  │
│    │                                │  │15:30│                          │  │
│    │                                │  └──────┘                          │  │
│    │                                │                                     │  │
│    │                                │  Selected: 09:00 - 09:30           │  │
│    │                                │                                     │  │
│    │                                │  [Continue to Confirmation →]      │  │
│    │                                └─────────────────────────────────────┘  │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Confirmation & Notes

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Home  Appointments  Profile    [🔔3] Sarah Chen [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  [< Back] Book Appointment         Step 3 of 3: Confirm Booking         │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  APPOINTMENT SUMMARY                                            │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Doctor:       Dr. Emily Thompson                               │    │
│    │  │                Cardiology  •  General Cardiology                │    │
│    │  │                                                                  │    │
│    │  │  Date & Time:  Monday, January 15, 2026                         │    │
│    │  │                09:00 - 09:30 (30 minutes)                       │    │
│    │  │                                                                  │    │
│    │  │  Location:     Room 305, Cardiology Wing                        │    │
│    │  │                Hospital Main Building, 2nd Floor                │    │
│    │  │                                                                  │    │
│    │  │  Fee:          £150.00                                          │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  REASON FOR VISIT (Optional)                                    │    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────────┐ │    │
│    │  │  │ Describe your symptoms or reason for this appointment...   │ │    │
│    │  │  │                                                            │ │    │
│    │  │  │                                                            │ │    │
│    │  │  │                                                            │ │    │
│    │  │  └────────────────────────────────────────────────────────────┘ │    │
│    │  │  0 / 500 characters                                             │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  📧 EMAIL NOTIFICATIONS                                         │    │
│    │  │                                                                  │    │
│    │  │  [✓] Send booking confirmation to sarah.chen@example.com       │    │
│    │  │  [✓] Send reminder 24 hours before appointment                 │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  ⚠ CANCELLATION POLICY                                         │    │
│    │  │                                                                  │    │
│    │  │  You can cancel or reschedule this appointment up to 24 hours   │    │
│    │  │  before the scheduled time without charge.                      │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  [< Back to Date Selection]          [Confirm Booking]                  │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### Success Confirmation

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Home  Appointments  Profile    [🔔3] Sarah Chen [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │                             ✓                                            │
│    │                                                                           │
│    │                  Appointment Booked Successfully!                         │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │                                                                  │    │
│    │  │  Confirmation Number: #APT-2026-00123                           │    │
│    │  │                                                                  │    │
│    │  │  Dr. Emily Thompson                                             │    │
│    │  │  Monday, January 15, 2026                                       │    │
│    │  │  09:00 - 09:30                                                  │    │
│    │  │                                                                  │    │
│    │  │  Room 305, Cardiology Wing                                      │    │
│    │  │                                                                  │    │
│    │  │  📧 A confirmation email has been sent to:                      │    │
│    │  │     sarah.chen@example.com                                      │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  NEXT STEPS                                                     │    │
│    │  │                                                                  │    │
│    │  │  • Arrive 10 minutes early for check-in                         │    │
│    │  │  • Bring your ID and insurance card (if applicable)             │    │
│    │  │  • You'll receive a reminder 24 hours before                    │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  [Add to Calendar] [View Appointment] [Back to Dashboard]               │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### API Calls

```javascript
// Step 1: Fetch doctors
GET /api/doctors?department=cardiology&search=thompson
Response: [...]

// Step 2: Get available slots
GET /api/doctors/5/availability?date=2026-01-15
Response: {
  "date": "2026-01-15",
  "slots": [
    { "startTime": "09:00", "endTime": "09:30", "available": true },
    { "startTime": "09:30", "endTime": "10:00", "available": true },
    { "startTime": "15:00", "endTime": "15:30", "available": false }
  ]
}

// Step 3: Create appointment
POST /api/appointments
{
  "doctorId": 5,
  "appointmentDate": "2026-01-15",
  "startTime": "09:00",
  "endTime": "09:30",
  "patientNotes": "Chest pain for 2 weeks, occasional shortness of breath",
  "sendConfirmation": true,
  "sendReminder": true
}

Response (201):
{
  "id": 123,
  "confirmationNumber": "APT-2026-00123",
  "status": "SCHEDULED",
  "doctor": { ... },
  "date": "2026-01-15",
  "startTime": "09:00",
  "endTime": "09:30"
}
```

---

## 3. My Appointments Page

**Route:** `/patient/appointments`
**Access:** PATIENT role only
**Requirements:** FR-3.3, FR-5.1

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Home  Appointments  Profile    [🔔3] Sarah Chen [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  My Appointments                                   [+ Book New]          │
│    │                                                                           │
│    │  Filter:  ● Upcoming (2)  ○ Past (8)  ○ Cancelled (1)                   │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  UPCOMING APPOINTMENTS (2)                                      │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  📅 Mon, Jan 15, 2026  •  09:00 - 09:30        #APT-2026-00123  │    │
│    │  │  ─────────────────────────────────────────────────────────────   │    │
│    │  │                                                                  │    │
│    │  │  [👨‍⚕️]  Dr. Emily Thompson                                      │    │
│    │  │           Cardiology  •  General Cardiology                     │    │
│    │  │                                                                  │    │
│    │  │  📍 Room 305, Cardiology Wing                                   │    │
│    │  │  📝 Chest pain follow-up consultation                           │    │
│    │  │  ⏰ In 3 days                                                   │    │
│    │  │                                                                  │    │
│    │  │  Status: SCHEDULED                                              │    │
│    │  │                                                                  │    │
│    │  │  [View Details] [Reschedule] [Cancel Appointment]              │    │
│    │  │                                                                  │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  📅 Wed, Jan 17, 2026  •  14:00 - 14:30        #APT-2026-00124  │    │
│    │  │  ─────────────────────────────────────────────────────────────   │    │
│    │  │                                                                  │    │
│    │  │  [👨‍⚕️]  Dr. James Wilson                                        │    │
│    │  │           Dermatology  •  Skin Specialist                       │    │
│    │  │                                                                  │    │
│    │  │  📍 Room 102, Dermatology Department                            │    │
│    │  │  📝 Annual skin check                                           │    │
│    │  │  ⏰ In 5 days                                                   │    │
│    │  │                                                                  │    │
│    │  │  Status: SCHEDULED                                              │    │
│    │  │                                                                  │    │
│    │  │  [View Details] [Reschedule] [Cancel Appointment]              │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### Past Appointments View

```
│    │  Filter:  ○ Upcoming (2)  ● Past (8)  ○ Cancelled (1)                   │
│    │  Sort by: [Most Recent ▾]                                               │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  PAST APPOINTMENTS (8)                                          │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  📅 Thu, Dec 20, 2025  •  11:00 - 11:30        #APT-2025-00089  │    │
│    │  │  ─────────────────────────────────────────────────────────────   │    │
│    │  │                                                                  │    │
│    │  │  [👨‍⚕️]  Dr. Emily Thompson                                      │    │
│    │  │           Cardiology  •  General Cardiology                     │    │
│    │  │                                                                  │    │
│    │  │  Status: ✓ COMPLETED                                            │    │
│    │  │                                                                  │    │
│    │  │  [View Details]                                                 │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
```

### Appointment Details Modal

```
     ┌───────────────────────────────────────────────────────────┐
     │  Appointment Details                                  [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │  Confirmation #: APT-2026-00123                           │
     │  Status: SCHEDULED                                        │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  APPOINTMENT INFORMATION                           │  │
     │  ├─────────────────────────────────────────────────────┤  │
     │  │                                                     │  │
     │  │  [👨‍⚕️]  Dr. Emily Thompson                         │  │
     │  │           MD, MBBS • 15 years experience            │  │
     │  │           Cardiology  •  General Cardiology         │  │
     │  │           ⭐ 4.8 (124 reviews)                      │  │
     │  │                                                     │  │
     │  │  📅 Date:     Monday, January 15, 2026              │  │
     │  │  ⏰ Time:     09:00 - 09:30 (30 minutes)            │  │
     │  │  📍 Location: Room 305, Cardiology Wing             │  │
     │  │               Hospital Main Building, 2nd Floor     │  │
     │  │                                                     │  │
     │  │  📝 Your Notes:                                     │  │
     │  │     "Follow-up for chest pain. Symptoms have        │  │
     │  │      improved since last visit but still           │  │
     │  │      experiencing occasional discomfort."           │  │
     │  │                                                     │  │
     │  │  💰 Consultation Fee: £150.00                       │  │
     │  │                                                     │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  REMINDERS                                          │  │
     │  │                                                     │  │
     │  │  • Arrive 10 minutes early for check-in             │  │
     │  │  • Bring your ID and insurance documents            │  │
     │  │  • Email reminder will be sent 24h before           │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  [Add to Calendar] [Get Directions]                      │
     │                                                           │
     │  [Reschedule Appointment] [Cancel Appointment]           │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

---

## 4. Reschedule Appointment Flow

**Requirements:** FR-3.5

### Reschedule Confirmation Dialog

```
     ┌───────────────────────────────────────────────────────────┐
     │  Reschedule Appointment                               [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │  Current Appointment:                                     │
     │  Dr. Emily Thompson                                       │
     │  Monday, January 15, 2026 at 09:00                        │
     │                                                           │
     │  Would you like to reschedule with the same doctor?       │
     │                                                           │
     │  ┌─────────────────────────┐  ┌──────────────────────┐   │
     │  │   Yes, Same Doctor      │  │  Choose New Doctor   │   │
     │  └─────────────────────────┘  └──────────────────────┘   │
     │                                                           │
     │  [Cancel]                                                 │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

After selection, navigates to Step 2 of booking flow (date/time selection) with pre-filled doctor.

---

## 5. Cancel Appointment Flow

**Requirements:** FR-3.4

### Cancellation Confirmation Dialog

```
     ┌───────────────────────────────────────────────────────────┐
     │  Cancel Appointment                                   [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │  ⚠ Are you sure you want to cancel this appointment?    │
     │                                                           │
     │  Dr. Emily Thompson                                       │
     │  Monday, January 15, 2026 at 09:00                        │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Reason for cancellation (Optional)                 │  │
     │  │                                                     │  │
     │  │  ┌───────────────────────────────────────────────┐  │  │
     │  │  │ Please tell us why you're cancelling...      │  │  │
     │  │  │                                               │  │  │
     │  │  └───────────────────────────────────────────────┘  │  │
     │  │                                                     │  │
     │  │  [ ] Schedule conflict                              │  │
     │  │  [ ] Feeling better / No longer needed              │  │
     │  │  [ ] Personal reasons                               │  │
     │  │  [ ] Other                                          │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ℹ This appointment is in 3 days. You can cancel        │
     │    without charge up to 24 hours before.                 │
     │                                                           │
     │  [Keep Appointment]  [Cancel Appointment]                │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

### Success State

```
     ┌───────────────────────────────────────────────────────────┐
     │  Appointment Cancelled                                [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │                          ✓                                │
     │                                                           │
     │  Your appointment has been cancelled successfully.        │
     │                                                           │
     │  Confirmation #: APT-2026-00123                           │
     │  Dr. Emily Thompson                                       │
     │  Monday, January 15, 2026 at 09:00                        │
     │                                                           │
     │  A cancellation confirmation has been sent to your email. │
     │                                                           │
     │  [Book New Appointment] [Close]                           │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

### API Call

```javascript
PUT /api/appointments/123/cancel
{
  "cancellationReason": "Schedule conflict - work meeting moved"
}

Response (200):
{
  "id": 123,
  "status": "CANCELLED",
  "cancellationReason": "Schedule conflict - work meeting moved",
  "cancelledAt": "2026-01-12T14:30:00Z"
}
```

---

## 6. Patient Profile Settings

**Route:** `/patient/profile`
**Access:** PATIENT role only
**Requirements:** FR-1.1

### Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Home  Appointments  Profile    [🔔3] Sarah Chen [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  Profile Settings                                                         │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  PERSONAL INFORMATION                             [Edit]        │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  First Name:    Sarah                                           │    │
│    │  │  Last Name:     Chen                                            │    │
│    │  │  Email:         sarah.chen@example.com                          │    │
│    │  │  Phone Number:  +44 7700 900000                                 │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  EMAIL PREFERENCES                                [Edit]        │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  [✓] Appointment confirmations                                  │    │
│    │  │  [✓] Appointment reminders (24h before)                         │    │
│    │  │  [✓] Cancellation confirmations                                 │    │
│    │  │  [ ] Promotional emails                                         │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  CHANGE PASSWORD                                  [Edit]        │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Last changed: December 1, 2025                                 │    │
│    │  │                                                                  │    │
│    │  │  [Change Password]                                              │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  ACCOUNT ACTIONS                                                │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  [Download My Data]  [Delete Account]                           │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

---

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible (Tab, Enter, Escape)
- [ ] Appointment cards have proper ARIA labels
- [ ] Date picker keyboard navigable (arrow keys)
- [ ] Time slots accessible as radio buttons
- [ ] Loading states announced to screen readers
- [ ] Success/error toasts use ARIA live regions
- [ ] Focus management in modals (focus trap, return focus on close)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All images have alt text
- [ ] Form validation errors linked with aria-describedby

---

## Next: Doctor Views

See [03-doctor-views.md](03-doctor-views.md) for doctor dashboard and availability management wireframes.
