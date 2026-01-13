# Doctor Role Wireframes

> **Project:** Hospital Appointment Booking System
> **Sprint:** Sprint 1 - Dev Task 10
> **Last Updated:** January 12, 2026

---

## 1. Doctor Dashboard

**Route:** `/doctor/dashboard`
**Access:** DOCTOR role only
**Requirements:** FR-5.2

### Desktop Layout (1024px+)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Schedule  Availability  Profile  [🔔2] Dr. Thompson [▾]│
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│ 🏠 │  Good morning, Dr. Thompson!                         Monday, Jan 15, 2026│
│    │  You have 8 appointments today                                           │
│ 📅 │                                                                           │
│    │  ┌────────────────────────────────────────────────────────────────┐      │
│ 📊 │  │  TODAY'S SCHEDULE                                             │      │
│    │  │  Monday, January 15, 2026                        [Day][Week]  │      │
│ ⚙  │  ├────────────────────────────────────────────────────────────────┤      │
│    │  │                                                                │      │
│ 🚪 │  │  09:00  ┌──────────────────────────────────────────────────┐  │      │
│    │  │  09:30  │  Sarah Chen  •  34 years  •  #APT-2026-00123    │  │      │
│    │  │         │  Patient ID: P-1001                              │  │      │
│    │  │         │                                                  │  │      │
│    │  │         │  Reason: Chest pain follow-up                   │  │      │
│    │  │         │  Last Visit: Dec 20, 2025                       │  │      │
│    │  │         │                                                  │  │      │
│    │  │         │  [View History] [Start Consultation]           │  │      │
│    │  │         └──────────────────────────────────────────────────┘  │      │
│    │  │                                                                │      │
│    │  │  09:30  ┌──────────────────────────────────────────────────┐  │      │
│    │  │  10:00  │  Robert Martinez  •  68 years  •  #APT-2026-124 │  │      │
│    │  │         │  Patient ID: P-1042                              │  │      │
│    │  │         │                                                  │  │      │
│    │  │         │  Reason: Routine cardio check                   │  │      │
│    │  │         │  Last Visit: Nov 15, 2025                       │  │      │
│    │  │         │                                                  │  │      │
│    │  │         │  [View History] [Start Consultation]           │  │      │
│    │  │         └──────────────────────────────────────────────────┘  │      │
│    │  │                                                                │      │
│    │  │  10:00  ─────────── Break ───────────                         │      │
│    │  │  10:30                                                         │      │
│    │  │                                                                │      │
│    │  │  10:30  ┌──────────────────────────────────────────────────┐  │      │
│    │  │  11:00  │  James Wilson  •  45 years  •  #APT-2026-125    │  │      │
│    │  │         │  ...                                             │  │      │
│    │  │                                                                │      │
│    │  │  [View Full Schedule →]                                       │      │
│    │  └────────────────────────────────────────────────────────────────┘      │
│    │                                                                           │
│    │  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐        │
│    │  │  THIS WEEK      │  │  STATISTICS      │  │  QUICK ACTIONS  │        │
│    │  ├─────────────────┤  ├──────────────────┤  ├─────────────────┤        │
│    │  │                 │  │                  │  │                 │        │
│    │  │  📅 Mon: 8/8    │  │  👥 Today: 8     │  │  [Block Time]   │        │
│    │  │  📅 Tue: 6/8    │  │  ✓ Completed: 45 │  │                 │        │
│    │  │  📅 Wed: 7/8    │  │  ⏱ Avg: 28 min   │  │  [Set Away]     │        │
│    │  │  📅 Thu: 5/8    │  │  ⭐ Rating: 4.8  │  │                 │        │
│    │  │  📅 Fri: 8/8    │  │                  │  │  [View Reports] │        │
│    │  │                 │  │                  │  │                 │        │
│    │  └─────────────────┘  └──────────────────┘  └─────────────────┘        │
└────┴───────────────────────────────────────────────────────────────────────────┘

Sidebar Menu:
  🏠 Dashboard (active)
  📅 My Schedule
  📊 Availability
  ⚙  Profile Settings
  🚪 Logout
```

### Mobile Layout (< 768px)

```
┌─────────────────────────────────┐
│  [☰]  Dashboard      [🔔2] [👤]│
├─────────────────────────────────┤
│                                 │
│  Good morning,                  │
│  Dr. Thompson!                  │
│                                 │
│  📅 Monday, Jan 15, 2026        │
│  8 appointments today           │
│                                 │
│  TODAY'S SCHEDULE               │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 09:00 - 09:30             │  │
│  │ ─────────────────────────  │  │
│  │ Sarah Chen, 34            │  │
│  │ Chest pain follow-up      │  │
│  │                           │  │
│  │ [Start Consultation]      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 09:30 - 10:00             │  │
│  │ ─────────────────────────  │  │
│  │ Robert Martinez, 68       │  │
│  │ Routine cardio check      │  │
│  │                           │  │
│  │ [Start Consultation]      │  │
│  └───────────────────────────┘  │
│                                 │
│  10:00 - 10:30                  │
│  ─── Break ───                  │
│                                 │
│  [View Full Schedule →]         │
│                                 │
│  QUICK ACTIONS                  │
│  [Block Time] [Set Away]        │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📅] [📊] [⚙] [Profile] │
└─────────────────────────────────┘
```

---

## 2. Appointment Details & Consultation

**Route:** `/doctor/appointment/:id`
**Access:** DOCTOR role only
**Requirements:** FR-5.2

### Appointment Details View

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [< Back to Schedule]  Appointment Details                  Dr. Thompson [▾]  │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐     │
│  │  PATIENT INFORMATION                                                 │     │
│  ├──────────────────────────────────────────────────────────────────────┤     │
│  │                                                                       │     │
│  │  [👤]  Sarah Chen                          Patient ID: P-1001        │     │
│  │         Female  •  34 years  •  DOB: March 15, 1992                  │     │
│  │                                                                       │     │
│  │  📧 Email:    sarah.chen@example.com                                 │     │
│  │  📞 Phone:    +44 7700 900000                                        │     │
│  │                                                                       │     │
│  └──────────────────────────────────────────────────────────────────────┘     │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐     │
│  │  APPOINTMENT DETAILS                                                 │     │
│  ├──────────────────────────────────────────────────────────────────────┤     │
│  │                                                                       │     │
│  │  Confirmation #:  APT-2026-00123                                     │     │
│  │  Date & Time:     Monday, January 15, 2026  •  09:00 - 09:30        │     │
│  │  Location:        Room 305, Cardiology Wing                          │     │
│  │  Status:          ● SCHEDULED                                        │     │
│  │  Booked:          January 10, 2026 at 14:30                          │     │
│  │                                                                       │     │
│  └──────────────────────────────────────────────────────────────────────┘     │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐     │
│  │  PATIENT'S REASON FOR VISIT                                          │     │
│  ├──────────────────────────────────────────────────────────────────────┤     │
│  │                                                                       │     │
│  │  "Follow-up for chest pain. Symptoms have improved since last        │     │
│  │   visit but still experiencing occasional discomfort, especially     │     │
│  │   after physical activity. Would like to discuss treatment options." │     │
│  │                                                                       │     │
│  └──────────────────────────────────────────────────────────────────────┘     │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐     │
│  │  PREVIOUS VISITS                                                     │     │
│  ├──────────────────────────────────────────────────────────────────────┤     │
│  │                                                                       │     │
│  │  📅 December 20, 2025  •  Dr. Emily Thompson                         │     │
│  │     Status: COMPLETED                                                │     │
│  │     Notes: "Initial consultation for chest pain. ECG normal.        │     │
│  │            Prescribed beta-blockers. Follow-up in 4 weeks."          │     │
│  │     [View Full Notes]                                                │     │
│  │                                                                       │     │
│  │  📅 September 10, 2025  •  Dr. Emily Thompson                        │     │
│  │     Status: COMPLETED                                                │     │
│  │     Notes: "Annual checkup. Blood pressure slightly elevated..."     │     │
│  │     [View Full Notes]                                                │     │
│  │                                                                       │     │
│  └──────────────────────────────────────────────────────────────────────┘     │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐     │
│  │  DOCTOR'S NOTES (Private - Not visible to patient)                  │     │
│  ├──────────────────────────────────────────────────────────────────────┤     │
│  │                                                                       │     │
│  │  ┌────────────────────────────────────────────────────────────────┐  │     │
│  │  │  Add consultation notes...                                     │  │     │
│  │  │                                                                │  │     │
│  │  │  • Examination findings                                        │  │     │
│  │  │  • Diagnosis                                                   │  │     │
│  │  │  • Treatment plan                                              │  │     │
│  │  │  • Prescriptions                                               │  │     │
│  │  │  • Follow-up recommendations                                   │  │     │
│  │  │                                                                │  │     │
│  │  └────────────────────────────────────────────────────────────────┘  │     │
│  │  0 / 2000 characters                                                 │     │
│  │                                                                       │     │
│  │  [Save Notes]                                                        │     │
│  └──────────────────────────────────────────────────────────────────────┘     │
│                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────┐     │
│  │  APPOINTMENT ACTIONS                                                 │     │
│  │                                                                       │     │
│  │  Mark as:  [✓ Completed] [× Cancelled] [⚠ No Show]                 │     │
│  │                                                                       │     │
│  └──────────────────────────────────────────────────────────────────────┘     │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Mark as Completed Confirmation

```
     ┌───────────────────────────────────────────────────────────┐
     │  Mark Appointment as Completed                        [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │  Patient: Sarah Chen                                      │
     │  Date: Monday, January 15, 2026 at 09:00                  │
     │                                                           │
     │  ⚠ Have you added your consultation notes?              │
     │                                                           │
     │  ✓ Yes, notes have been added (recommended)              │
     │                                                           │
     │  This will update the appointment status to COMPLETED     │
     │  and the patient will be able to book future              │
     │  appointments.                                            │
     │                                                           │
     │  [Cancel]  [Mark as Completed]                            │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

### API Calls

```javascript
GET /api/doctor/appointments/123
Response: { /* Full appointment details */ }

PUT /api/doctor/appointments/123/notes
{
  "doctorNotes": "Follow-up consultation completed. Patient reports..."
}

PUT /api/doctor/appointments/123/status
{
  "status": "COMPLETED"
}

Response (200):
{
  "id": 123,
  "status": "COMPLETED",
  "completedAt": "2026-01-15T09:30:00Z"
}
```

---

## 3. My Schedule (Weekly View)

**Route:** `/doctor/schedule`
**Access:** DOCTOR role only
**Requirements:** FR-5.2

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Schedule  Availability  Profile  [🔔2] Dr. Thompson [▾]│
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  My Schedule                              [< Prev Week]  [Next Week >]   │
│    │  January 15 - January 21, 2026                            [Print] [Export]│
│    │                                                                           │
│    │  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐                            │
│    │  │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │                            │
│    │  │  15 │  16 │  17 │  18 │  19 │  20 │  21 │                            │
│    │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤                            │
│    │  │     │     │     │     │     │     │     │                            │
│    │  │09:00│09:00│09:00│     │09:00│ OFF │ OFF │                            │
│    │  │ SC  │ RM  │     │     │ JW  │     │     │                            │
│    │  │     │     │     │     │     │     │     │                            │
│    │  │09:30│09:30│09:30│09:30│09:30│     │     │                            │
│    │  │ RM  │     │ LK  │     │     │     │     │                            │
│    │  │     │     │     │     │     │     │     │                            │
│    │  │10:00│10:00│10:00│10:00│10:00│     │     │                            │
│    │  │ JW  │ SC  │BREAK│     │ RM  │     │     │                            │
│    │  │     │     │     │     │     │     │     │                            │
│    │  │10:30│10:30│10:30│10:30│10:30│     │     │                            │
│    │  │BREAK│BREAK│     │     │BREAK│     │     │                            │
│    │  │     │     │     │     │     │     │     │                            │
│    │  │11:00│11:00│11:00│11:00│11:00│     │     │                            │
│    │  │ MK  │     │ TH  │ SC  │     │     │     │                            │
│    │  │     │     │     │     │     │     │     │                            │
│    │  │     │     │     │     │     │     │     │                            │
│    │  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘                            │
│    │                                                                           │
│    │  Legend: ● Scheduled  ◐ Completed  ○ Available  × Blocked                │
│    │  SC = Sarah Chen, RM = Robert Martinez, etc.                             │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  WEEK SUMMARY                                                   │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Total Appointments: 34                                          │    │
│    │  │  Scheduled: 28  •  Completed: 4  •  No Shows: 1  •  Cancelled: 1│    │
│    │  │                                                                  │    │
│    │  │  Total Hours: 17 hours                                           │    │
│    │  │  Average per day: 3.4 hours                                      │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### Day View (Detailed)

```
│    │  My Schedule - Daily View                    Monday, January 15, 2026    │
│    │  [Week View] [Month View]                              [< Prev] [Next >] │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  TIME     PATIENT          STATUS        NOTES                  │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  08:00    ─────────────  Preparation Time ─────────────         │    │
│    │  │  09:00                                                           │    │
│    │  │                                                                  │    │
│    │  │  09:00 │  Sarah Chen        ● SCHEDULED  Chest pain f/up        │    │
│    │  │  09:30 │  #APT-2026-00123                [View] [Start]         │    │
│    │  │        └──────────────────────────────────────────────────       │    │
│    │  │                                                                  │    │
│    │  │  09:30 │  Robert Martinez   ● SCHEDULED  Routine check          │    │
│    │  │  10:00 │  #APT-2026-00124                [View] [Start]         │    │
│    │  │        └──────────────────────────────────────────────────       │    │
│    │  │                                                                  │    │
│    │  │  10:00    ─────────────────  Break  ─────────────────           │    │
│    │  │  10:30                                                           │    │
│    │  │                                                                  │    │
│    │  │  10:30 │  James Wilson      ● SCHEDULED  New patient            │    │
│    │  │  11:00 │  #APT-2026-00125                [View] [Start]         │    │
│    │  │        └──────────────────────────────────────────────────       │    │
│    │  │                                                                  │    │
│    │  │  11:00 │  Mary Kim          ◐ COMPLETED  Diabetes f/up          │    │
│    │  │  11:30 │  #APT-2026-00126                [View Notes]           │    │
│    │  │        └──────────────────────────────────────────────────       │    │
│    │  │                                                                  │    │
│    │  │  11:30    ───────────────── Available ─────────────────         │    │
│    │  │  12:00                                                           │    │
│    │  │                                                                  │    │
│    │  │  12:00    ─────────────────  Lunch  ─────────────────           │    │
│    │  │  13:00                                                           │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
```

---

## 4. Manage Availability

**Route:** `/doctor/availability`
**Access:** DOCTOR role only
**Requirements:** FR-2.2

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Schedule  Availability  Profile  [🔔2] Dr. Thompson [▾]│
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  Manage Availability                                        [Save Changes]│
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  WEEKLY SCHEDULE                                  [Copy to All] │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  📅 Monday                                        [✓] Available  │    │
│    │  │  ├────────────────────────────────────────────────────────────   │    │
│    │  │  │  Start Time:  [09:00 ▾]    End Time:  [17:00 ▾]             │    │
│    │  │  │                                                               │    │
│    │  │  │  Break:  [10:00 ▾] to [10:30 ▾]  [+ Add Break]              │    │
│    │  │  │  Lunch:  [12:00 ▾] to [13:00 ▾]                             │    │
│    │  │  └────────────────────────────────────────────────────────────   │    │
│    │  │                                                                  │    │
│    │  │  📅 Tuesday                                       [✓] Available  │    │
│    │  │  ├────────────────────────────────────────────────────────────   │    │
│    │  │  │  Start Time:  [09:00 ▾]    End Time:  [17:00 ▾]             │    │
│    │  │  │                                                               │    │
│    │  │  │  Break:  [10:30 ▾] to [11:00 ▾]  [+ Add Break]              │    │
│    │  │  │  Lunch:  [12:00 ▾] to [13:00 ▾]                             │    │
│    │  │  └────────────────────────────────────────────────────────────   │    │
│    │  │                                                                  │    │
│    │  │  📅 Wednesday                                     [✓] Available  │    │
│    │  │  ├────────────────────────────────────────────────────────────   │    │
│    │  │  │  Start Time:  [09:00 ▾]    End Time:  [14:00 ▾]             │    │
│    │  │  │                                                               │    │
│    │  │  │  Break:  [10:00 ▾] to [10:30 ▾]  [+ Add Break]              │    │
│    │  │  └────────────────────────────────────────────────────────────   │    │
│    │  │                                                                  │    │
│    │  │  ...Thursday, Friday (similar)                                   │    │
│    │  │                                                                  │    │
│    │  │  📅 Saturday                                      [ ] Available  │    │
│    │  │  📅 Sunday                                        [ ] Available  │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  BLOCK SPECIFIC DATES (Holidays, Leave, Training)              │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  From Date:  [MM/DD/YYYY]  To Date:  [MM/DD/YYYY]    │     │    │
│    │  │  │  Reason:  [Annual Leave ▾]                            │     │    │
│    │  │  │  [+ Block These Dates]                                │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  │  CURRENTLY BLOCKED DATES:                                       │    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  🗓 Dec 24-26, 2025  •  Christmas Holiday      [×]    │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  🗓 Feb 10-14, 2026  •  Medical Conference      [×]   │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  APPOINTMENT SETTINGS                                           │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Default Appointment Duration:  [30 minutes ▾]                  │    │
│    │  │  Buffer Time Between Appointments:  [0 minutes ▾]               │    │
│    │  │                                                                  │    │
│    │  │  ℹ Patients can book appointments in 30-minute slots during    │    │
│    │  │    your available hours.                                        │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  [Cancel]  [Save Changes]                                                │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### Block Specific Date Modal

```
     ┌───────────────────────────────────────────────────────────┐
     │  Block Dates                                          [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  From Date *                                        │  │
     │  │  [January 15, 2026]         📅                     │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  To Date *                                          │  │
     │  │  [January 20, 2026]         📅                     │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Reason *                                           │  │
     │  │  [Annual Leave ▾]                                   │  │
     │  │                                                     │  │
     │  │  Options: Annual Leave, Medical Conference,         │  │
     │  │           Training, Personal, Other                 │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ⚠ This will cancel 12 existing appointments.           │
     │    Patients will be notified via email.                  │
     │                                                           │
     │  [Cancel]  [Block Dates]                                 │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

### API Calls

```javascript
GET /api/doctor/availability
Response: {
  "weeklySchedule": [
    {
      "dayOfWeek": "MONDAY",
      "isAvailable": true,
      "startTime": "09:00",
      "endTime": "17:00",
      "breaks": [
        { "startTime": "10:00", "endTime": "10:30" },
        { "startTime": "12:00", "endTime": "13:00" }
      ]
    },
    ...
  ],
  "blockedDates": [
    {
      "startDate": "2025-12-24",
      "endDate": "2025-12-26",
      "reason": "Christmas Holiday"
    }
  ]
}

PUT /api/doctor/availability
{
  "weeklySchedule": [...],
  "appointmentDuration": 30,
  "bufferTime": 0
}

POST /api/doctor/availability/block
{
  "startDate": "2026-01-15",
  "endDate": "2026-01-20",
  "reason": "Annual Leave"
}
```

---

## 5. Doctor Profile Settings

**Route:** `/doctor/profile`
**Access:** DOCTOR role only
**Requirements:** FR-2.1

### Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Booking    Schedule  Availability  Profile  [🔔2] Dr. Thompson [▾]│
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  Profile Settings                                                         │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  PROFESSIONAL INFORMATION                         [Edit]        │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  [👨‍⚕️ Upload Photo]                                              │    │
│    │  │                                                                  │    │
│    │  │  Full Name:      Dr. Emily Thompson                             │    │
│    │  │  Department:     Cardiology                                     │    │
│    │  │  Specialty:      General Cardiology                             │    │
│    │  │  Qualifications: MD, MBBS                                       │    │
│    │  │  Experience:     15 years                                       │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  BIOGRAPHY                                        [Edit]        │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Dr. Thompson specializes in general cardiology with a focus    │    │
│    │  │  on preventive care and heart disease management. She           │    │
│    │  │  completed her medical degree at Oxford University and          │    │
│    │  │  residency at St. Mary's Hospital.                              │    │
│    │  │                                                                  │    │
│    │  │  500 / 500 characters                                           │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  CONTACT INFORMATION                              [Edit]        │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Email:        dr.thompson@hospital.com                         │    │
│    │  │  Phone:        +44 20 1234 5678                                 │    │
│    │  │  Office:       Room 305, Cardiology Wing                        │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  CONSULTATION FEE                                 [Edit]        │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Standard Consultation:  £150.00                                │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  STATISTICS                                                     │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Total Appointments:     1,247                                  │    │
│    │  │  Patient Rating:         ⭐ 4.8 / 5.0 (124 reviews)            │    │
│    │  │  Member Since:           March 2021                             │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Doctor Notifications

**Access:** Notification bell icon in header

### Notifications Dropdown

```
     ┌─────────────────────────────────────────────┐
     │  Notifications (3)               [Mark all] │
     ├─────────────────────────────────────────────┤
     │                                             │
     │  ● New Appointment                          │
     │    Sarah Chen booked for Jan 15 at 09:00    │
     │    5 minutes ago                    [View]  │
     │                                             │
     │  ─────────────────────────────────────────  │
     │                                             │
     │  ● Appointment Cancelled                    │
     │    Robert Martinez cancelled Jan 16 appt    │
     │    1 hour ago                       [View]  │
     │                                             │
     │  ─────────────────────────────────────────  │
     │                                             │
     │  ○ Reminder                                 │
     │    You have 8 appointments tomorrow         │
     │    Yesterday                                │
     │                                             │
     │  ─────────────────────────────────────────  │
     │                                             │
     │  [View All Notifications]                   │
     │                                             │
     └─────────────────────────────────────────────┘
```

---

## Accessibility Checklist

- [ ] All calendar/schedule views keyboard navigable
- [ ] Time slot selection accessible via arrow keys
- [ ] Doctor notes textarea has proper labels
- [ ] Appointment status changes announced to screen readers
- [ ] Loading states for async operations
- [ ] Focus management in modals
- [ ] Color-coded status uses text labels, not just color
- [ ] All interactive elements have visible focus indicators

---

## Next: Admin Views

See [04-admin-views.md](04-admin-views.md) for admin dashboard and management wireframes.
