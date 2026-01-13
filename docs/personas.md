# User Personas - Hospital Booking System

> **Note:** These personas reflect the MVP scope: appointment booking, availability management, cancellations/rescheduling, email notifications, and dashboards. Features such as medical records, payments, referrals, and video consultations are out of scope for this project.

---

## 1. Patient Persona: Busy Professional

**Name:** Sarah Chen  
**Age:** 34  
**Tech Proficiency:** High (comfortable with mobile apps)  
**Occupation:** Marketing manager  
**Primary Device:** Mobile (70%), Desktop (30%)  
**Frequency of Use:** 2-3 times per month

### Goals

- Book appointments quickly during work breaks
- Reschedule easily without phone calls
- Get reminders so she doesn't forget

### Pain Points

- Current system requires calling during office hours (9-5)
- No visibility of available slots
- Misses appointments due to busy schedule

### User Journey

1. Logs in → Views available doctors and time slots
2. Books appointment in 2-3 clicks
3. Receives email confirmation
4. Gets reminder 24 hours before appointment
5. Can reschedule or cancel online

### Key Features (from your FRs)

- Browse and filter doctors by specialty/department (FR-3.1)
- Book appointments with real-time slot validation (FR-3.2)
- Email notifications for booking/cancellation/reminders (FR-4.1)
- View upcoming appointments and history (FR-3.3, FR-5.1)
- Cancel appointments up to 24h before (FR-3.4)
- Reschedule appointments with new slot selection (FR-3.5)

---

## 2. Patient Persona: Senior with Low Tech Skills

**Name:** Robert Martinez  
**Age:** 68  
**Tech Proficiency:** Low (uses smartphone for calls/WhatsApp only)  
**Occupation:** Retired teacher  
**Primary Device:** Desktop (80%), Mobile (20%)  
**Frequency of Use:** Once every 2-3 months

### Goals

- Book appointments without complex steps
- Understand appointment details clearly
- Get confirmation he can print or save

### Pain Points

- Finds complex websites confusing
- Forgets passwords frequently
- Needs large text and simple navigation

### User Journey

1. Logs in (ideally saved credentials in browser)
2. Sees clear, large buttons for "Book Appointment"
3. Follows simple step-by-step flow with inline help
4. Receives email confirmation with clear details
5. Can cancel via link in email (optional feature per FR-4.1)

### Key Features (from your FRs & NFRs)

- Simple, accessible UI with WCAG 2.1 AA compliance (NFR-4.1)
- Large fonts and high contrast for readability (NFR-4.1)
- Email confirmations with appointment details (FR-4.1)
- Responsive design for desktop and mobile (NFR-4.1)
- User-friendly error messages (NFR-3.2)
- Maximum 3 clicks to book appointment (NFR-4.1)

---

## 3. Doctor Persona

**Name:** Dr. Emily Thompson  
**Age:** 42  
**Tech Proficiency:** Moderate (uses hospital systems daily)  
**Occupation:** General Practitioner  
**Primary Device:** Desktop (90%), Mobile (10%)  
**Frequency of Use:** Daily (checking schedule)

### Goals

- See daily schedule at a glance
- Manage availability (block slots for breaks/emergencies)
- Reduce no-shows and late cancellations

### Pain Points

- Manual schedule management wastes time
- No visibility into upcoming appointments
- Patients often arrive unprepared

### User Journey

1. Logs in → Views dashboard with today's appointments
2. Checks upcoming week's schedule
3. Blocks time slots for leave/training
4. Reviews patient details for scheduled appointments
5. Marks appointments as completed/no-show/cancelled

### Key Features (from your FRs)

- Doctor dashboard showing today's appointments (FR-5.2)
- View upcoming appointments for next 7 and 30 days (FR-5.2)
- Set working hours and availability (FR-2.2)
- Block specific dates for holidays/personal time (FR-2.2)
- View patient details for appointments (FR-1.3, FR-5.2)
- Mark appointments as completed/no-show/cancelled (FR-5.2)
- Add appointment notes (doctor-only visibility) (FR-5.2)

---

## 4. Admin/Receptionist Persona

**Name:** Linda Okonkwo  
**Age:** 51  
**Tech Proficiency:** Moderate (familiar with Excel, hospital systems)  
**Occupation:** Hospital administrator/receptionist  
**Primary Device:** Desktop (100%)  
**Frequency of Use:** Daily (managing system)

### Goals

- Manage all doctors' schedules and user accounts centrally
- Generate reports for hospital management
- Handle booking conflicts and patient queries

### Pain Points

- Current system is fragmented (phone + spreadsheets)
- No oversight of booking patterns or trends
- Difficult to add/remove doctors or manage users

### User Journey

1. Logs in → Views admin dashboard (system statistics)
2. Creates/edits/deletes user accounts (patients, doctors, admins)
3. Manages departments and medical specialties
4. Views all appointments across the system
5. Generates monthly analytics reports on booking trends

### Key Features (from your FRs)

- Admin dashboard with system-wide statistics (FR-5.3)
- User management: create, edit, delete users (FR-6.1)
- Reset user passwords (FR-6.1)
- Manage departments and medical specialties (FR-6.2)
- View all appointments with advanced filters (FR-5.3)
- Analytics charts showing appointments per month (FR-5.3)
- Deactivate/reactivate user accounts (FR-5.3)

---

## Personas Summary

| Persona                     | Key Priority                 | Primary Device | Main Features Used                                    |
| --------------------------- | ---------------------------- | -------------- | ----------------------------------------------------- |
| **Sarah (Busy Patient)**    | Speed and convenience        | Mobile/Desktop | Quick booking, rescheduling, email reminders          |
| **Robert (Senior Patient)** | Simplicity and accessibility | Desktop        | Clear UI, large text, simple booking flow             |
| **Dr. Thompson (Doctor)**   | Schedule visibility          | Desktop        | Dashboard, availability management, appointment notes |
| **Linda (Admin)**           | Central oversight            | Desktop        | User/doctor management, reports, analytics            |

---

## Out of Scope (Future Work)

The following features are **not included** in the current FYP scope but could be considered for future enhancements:

- Medical records/EMR integration
- Insurance verification
- Online payments
- Caregiver/guardian access
- Referral management
- Vaccination tracking
- Video consultations
- Waitlist management
- Flexible appointment durations (currently fixed 30-min slots per FR-2.2)
- Patient self-service password reset (admin can reset per FR-6.1)
