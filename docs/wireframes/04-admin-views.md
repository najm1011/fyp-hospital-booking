# Admin Role Wireframes

> **Project:** Hospital Appointment Booking System
> **Sprint:** Sprint 1 - Dev Task 10
> **Last Updated:** January 12, 2026

---

## 1. Admin Dashboard

**Route:** `/admin/dashboard`
**Access:** ADMIN role only
**Requirements:** FR-5.3, FR-6.1, FR-6.2

### Desktop Layout (1024px+)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Admin    Users  Doctors  Departments  Reports   [🔔5] Admin [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│ 📊 │  Admin Dashboard                                     January 15, 2026    │
│    │                                                                           │
│ 👥 │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│    │  │ TOTAL USERS  │  │   DOCTORS    │  │ APPOINTMENTS │  │APPOINTMENTS  │ │
│ 👨‍⚕️ │  │              │  │              │  │   (Today)    │  │  (This Mo)   │ │
│    │  │     1,247    │  │      45      │  │     186      │  │    5,234     │ │
│ 🏥 │  │   +23 this   │  │   3 active   │  │  +12 from    │  │  +342 from   │ │
│    │  │     week     │  │   requests   │  │  yesterday   │  │  last month  │ │
│ 📋 │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │
│    │                                                                           │
│ ⚙  │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  APPOINTMENTS OVERVIEW (Last 6 Months)                          │    │
│ 🚪 │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │   6000│                                        ▪                │    │
│    │  │       │                                    ▪       ▪            │    │
│    │  │   5000│                                ▪               ▪        │    │
│    │  │       │                            ▪                       ▪    │    │
│    │  │   4000│                        ▪                               │    │
│    │  │       │                    ▪                                    │    │
│    │  │   3000│                ▪                                        │    │
│    │  │       │            ▪                                            │    │
│    │  │   2000└────┴────┴────┴────┴────┴────                           │    │
│    │  │         Aug  Sep  Oct  Nov  Dec  Jan                            │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌─────────────────────────────────┐  ┌────────────────────────────┐    │
│    │  │  RECENT ACTIVITIES              │  │  SYSTEM HEALTH             │    │
│    │  ├─────────────────────────────────┤  ├────────────────────────────┤    │
│    │  │                                 │  │                            │    │
│    │  │  • New user registered          │  │  ✓ Database: Healthy       │    │
│    │  │    sarah.chen@example.com       │  │  ✓ Email Service: Online   │    │
│    │  │    2 minutes ago                │  │  ✓ API Response: 45ms      │    │
│    │  │                                 │  │  ⚠ Storage: 78% used      │    │
│    │  │  • Doctor profile updated       │  │                            │    │
│    │  │    Dr. Emily Thompson           │  │  Last Check: 1 min ago     │    │
│    │  │    5 minutes ago                │  │                            │    │
│    │  │                                 │  └────────────────────────────┘    │
│    │  │  • 12 appointments booked       │                                    │
│    │  │    Various patients             │                                    │
│    │  │    Today                        │                                    │
│    │  │                                 │                                    │
│    │  │  [View All Activities →]       │                                    │
│    │  └─────────────────────────────────┘                                    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  TOP DEPARTMENTS (By Appointments This Month)                   │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  1. Cardiology         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  1,234 (24%)       │    │
│    │  │  2. Dermatology        ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░    987 (19%)       │    │
│    │  │  3. General Practice   ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░    876 (17%)       │    │
│    │  │  4. Orthopedics        ▓▓▓▓▓▓▓▓░░░░░░░░░░░░    654 (13%)       │    │
│    │  │  5. Pediatrics         ▓▓▓▓▓▓░░░░░░░░░░░░░░    543 (10%)       │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘

Sidebar Menu:
  📊 Dashboard (active)
  👥 User Management
  👨‍⚕️ Doctor Management
  🏥 Departments
  📋 All Appointments
  ⚙  Settings
  🚪 Logout
```

---

## 2. User Management

**Route:** `/admin/users`
**Access:** ADMIN role only
**Requirements:** FR-6.1

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Admin    Users  Doctors  Departments  Reports   [🔔5] Admin [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  User Management                                       [+ Add New User]  │
│    │                                                                           │
│    │  ┌─────────────────────────────────────────────────────────────────┐     │
│    │  │  🔍 Search users...                                   [Search]  │     │
│    │  └─────────────────────────────────────────────────────────────────┘     │
│    │                                                                           │
│    │  Filter: [All Roles ▾]  [All Status ▾]  [Clear]        Showing 1-10 of 247│
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  USERS                                                          │    │
│    │  ├────┬──────────┬────────────────────┬─────────┬────────┬─────────┤    │
│    │  │ ID │ Name     │ Email              │ Role    │ Status │ Actions │    │
│    │  ├────┼──────────┼────────────────────┼─────────┼────────┼─────────┤    │
│    │  │    │          │                    │         │        │         │    │
│    │  │1001│Sarah Chen│sarah.chen@email.com│ PATIENT │● Active│[Edit]   │    │
│    │  │    │          │+44 7700 900000     │         │        │[Delete] │    │
│    │  │    │          │Joined: Jan 10, 2026│         │        │[Reset PW]│   │
│    │  │    │          │                    │         │        │         │    │
│    │  ├────┼──────────┼────────────────────┼─────────┼────────┼─────────┤    │
│    │  │    │          │                    │         │        │         │    │
│    │  │1002│Dr. Emily │dr.thompson@hos.com │ DOCTOR  │● Active│[Edit]   │    │
│    │  │    │Thompson  │+44 20 1234 5678    │         │        │[Deact.] │    │
│    │  │    │          │Joined: Mar 15, 2021│         │        │[Reset PW]│   │
│    │  │    │          │                    │         │        │         │    │
│    │  ├────┼──────────┼────────────────────┼─────────┼────────┼─────────┤    │
│    │  │    │          │                    │         │        │         │    │
│    │  │1003│Robert    │robert.m@email.com  │ PATIENT │● Active│[Edit]   │    │
│    │  │    │Martinez  │+44 7700 900123     │         │        │[Delete] │    │
│    │  │    │          │Joined: Sep 20, 2024│         │        │[Reset PW]│   │
│    │  │    │          │                    │         │        │         │    │
│    │  ├────┼──────────┼────────────────────┼─────────┼────────┼─────────┤    │
│    │  │    │          │                    │         │        │         │    │
│    │  │1004│Linda     │linda.o@hospital.com│ ADMIN   │● Active│[Edit]   │    │
│    │  │    │Okonkwo   │+44 20 1234 9999    │         │        │[Reset PW]│   │
│    │  │    │          │Joined: Jan 5, 2021 │         │        │         │    │
│    │  │    │          │                    │         │        │         │    │
│    │  ├────┼──────────┼────────────────────┼─────────┼────────┼─────────┤    │
│    │  │    │          │                    │         │        │         │    │
│    │  │1042│Michael   │mike.j@email.com    │ PATIENT │○Inactive│[Edit]  │    │
│    │  │    │Johnson   │+44 7700 900555     │         │        │[Activate]│   │
│    │  │    │          │Joined: May 1, 2024 │         │        │[Delete] │    │
│    │  │    │          │                    │         │        │         │    │
│    │  └────┴──────────┴────────────────────┴─────────┴────────┴─────────┘    │
│    │                                                                           │
│    │  [< Previous]  Page 1 of 25  [Next >]                                    │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### Add/Edit User Modal

```
     ┌───────────────────────────────────────────────────────────┐
     │  Add New User                                         [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  First Name *                                       │  │
     │  │  [Sarah]                                            │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Last Name *                                        │  │
     │  │  [Chen]                                             │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Email *                                            │  │
     │  │  [sarah.chen@example.com]                           │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Phone Number                                       │  │
     │  │  [+44 7700 900000]                                  │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Role *                                             │  │
     │  │  ○ Patient    ○ Doctor    ○ Admin                  │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Initial Password *                                 │  │
     │  │  [TempPass123!]                      [Generate]     │  │
     │  │  User will be required to change on first login     │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  [✓] Send welcome email with login credentials           │
     │  [✓] Set account as active                               │
     │                                                           │
     │  [Cancel]  [Create User]                                 │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

### Delete User Confirmation

```
     ┌───────────────────────────────────────────────────────────┐
     │  Delete User                                          [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │  ⚠ Are you sure you want to delete this user?           │
     │                                                           │
     │  Sarah Chen (sarah.chen@example.com)                      │
     │  Patient  •  Joined: January 10, 2026                    │
     │                                                           │
     │  ⚠ WARNING: This action cannot be undone!               │
     │                                                           │
     │  This user has 2 upcoming appointments.                   │
     │  These appointments will be cancelled and patients        │
     │  will be notified.                                        │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Type "DELETE" to confirm:                          │  │
     │  │  [                                              ]    │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  [Cancel]  [Delete User]                                 │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

---

## 3. Doctor Management

**Route:** `/admin/doctors`
**Access:** ADMIN role only
**Requirements:** FR-6.1, FR-6.2

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Admin    Users  Doctors  Departments  Reports   [🔔5] Admin [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  Doctor Management                                   [+ Add New Doctor]  │
│    │                                                                           │
│    │  Filter: [All Departments ▾]  [All Status ▾]          Showing 1-10 of 45 │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  DOCTORS                                                        │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  [👨‍⚕️]  Dr. Emily Thompson          ⭐ 4.8 (124)    │     │    │
│    │  │  │           User ID: 1002  •  Doctor ID: D-001           │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  Department:    Cardiology                            │     │    │
│    │  │  │  Specialty:     General Cardiology                    │     │    │
│    │  │  │  Qualifications: MD, MBBS                             │     │    │
│    │  │  │  Experience:    15 years                              │     │    │
│    │  │  │  Fee:           £150.00                               │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  📧 dr.thompson@hospital.com                          │     │    │
│    │  │  │  📞 +44 20 1234 5678                                  │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  Status: ● Active  •  Member Since: March 2021        │     │    │
│    │  │  │  Total Appointments: 1,247  •  This Month: 87         │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  [View Profile] [Edit] [View Schedule] [Deactivate]  │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  [👨‍⚕️]  Dr. James Wilson             ⭐ 4.9 (89)     │     │    │
│    │  │  │           User ID: 1015  •  Doctor ID: D-008           │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  Department:    Dermatology                           │     │    │
│    │  │  │  Specialty:     Skin Specialist                       │     │    │
│    │  │  │  Qualifications: MBBS, MD (Derm)                      │     │    │
│    │  │  │  Experience:    12 years                              │     │    │
│    │  │  │  Fee:           £120.00                               │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  Status: ● Active  •  Member Since: June 2022         │     │    │
│    │  │  │  Total Appointments: 543  •  This Month: 45           │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  [View Profile] [Edit] [View Schedule] [Deactivate]  │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### Add Doctor Modal

```
     ┌───────────────────────────────────────────────────────────┐
     │  Add New Doctor                                       [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │  STEP 1: Create User Account                              │
     │                                                           │
     │  ┌─────────────────────┐  ┌──────────────────────────┐   │
     │  │  First Name *       │  │  Last Name *             │   │
     │  │  [Emily]            │  │  [Thompson]              │   │
     │  └─────────────────────┘  └──────────────────────────┘   │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Email *                                            │  │
     │  │  [dr.thompson@hospital.com]                         │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Phone *                                            │  │
     │  │  [+44 20 1234 5678]                                 │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  STEP 2: Professional Information                         │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Department *                                       │  │
     │  │  [Cardiology ▾]                                     │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Specialty                                          │  │
     │  │  [General Cardiology]                               │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Qualifications                                     │  │
     │  │  [MD, MBBS]                                         │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Consultation Fee (£)                               │  │
     │  │  [150.00]                                           │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  [Cancel]  [Create Doctor Profile]                       │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

---

## 4. Department Management

**Route:** `/admin/departments`
**Access:** ADMIN role only
**Requirements:** FR-6.2

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Admin    Users  Doctors  Departments  Reports   [🔔5] Admin [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  Department Management                              [+ Add Department]   │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  DEPARTMENTS (12)                                               │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  🫀 Cardiology                                         │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  Heart and cardiovascular system treatment             │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  👨‍⚕️ Doctors: 8  •  📅 Appointments this month: 1,234 │     │    │
│    │  │  │  Created: January 15, 2021                             │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  [Edit] [View Doctors] [Delete]                       │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  🧬 Dermatology                                        │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  Skin conditions and cosmetic treatments               │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  👨‍⚕️ Doctors: 5  •  📅 Appointments this month: 987  │     │    │
│    │  │  │  Created: January 15, 2021                             │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  [Edit] [View Doctors] [Delete]                       │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  │  ┌────────────────────────────────────────────────────────┐     │    │
│    │  │  │  🦴 Orthopedics                                        │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  Bone, joint, and muscle treatment                     │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  👨‍⚕️ Doctors: 6  •  📅 Appointments this month: 654  │     │    │
│    │  │  │  Created: March 20, 2021                               │     │    │
│    │  │  │                                                        │     │    │
│    │  │  │  [Edit] [View Doctors] [Delete]                       │     │    │
│    │  │  └────────────────────────────────────────────────────────┘     │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

### Add/Edit Department Modal

```
     ┌───────────────────────────────────────────────────────────┐
     │  Add New Department                                   [×] │
     ├───────────────────────────────────────────────────────────┤
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Department Name *                                  │  │
     │  │  [Cardiology]                                       │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │  Description                                        │  │
     │  │  ┌─────────────────────────────────────────────┐    │  │
     │  │  │ Heart and cardiovascular system treatment   │    │  │
     │  │  │ including diagnosis, prevention, and care   │    │  │
     │  │  │ for cardiac patients.                       │    │  │
     │  │  │                                             │    │  │
     │  │  └─────────────────────────────────────────────┘    │  │
     │  │  150 / 500 characters                               │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ℹ You can assign doctors to this department after      │
     │    creation.                                              │
     │                                                           │
     │  [Cancel]  [Create Department]                           │
     │                                                           │
     └───────────────────────────────────────────────────────────┘
```

---

## 5. All Appointments View

**Route:** `/admin/appointments`
**Access:** ADMIN role only
**Requirements:** FR-5.3

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Admin    Users  Doctors  Departments  Reports   [🔔5] Admin [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  All Appointments                                          [Export CSV]  │
│    │                                                                           │
│    │  ┌─────────────────────────────────────────────────────────────────┐     │
│    │  │  🔍 Search by patient or doctor name...             [Search]   │     │
│    │  └─────────────────────────────────────────────────────────────────┘     │
│    │                                                                           │
│    │  Filters:                                                                 │
│    │  [All Doctors ▾]  [All Departments ▾]  [All Status ▾]                   │
│    │  Date Range: [Jan 1, 2026] to [Jan 31, 2026]         [Clear Filters]    │
│    │                                                                           │
│    │  Showing 1-20 of 5,234 appointments                                      │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  ID     Date/Time      Patient       Doctor        Status       │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  #123   Jan 15, 09:00  Sarah Chen    Dr. Thompson  ● SCHEDULED  │    │
│    │  │         Cardiology     P-1001        D-001         [View]       │    │
│    │  │                                                                  │    │
│    │  │  #124   Jan 15, 09:30  Robert M.     Dr. Thompson  ● SCHEDULED  │    │
│    │  │         Cardiology     P-1042        D-001         [View]       │    │
│    │  │                                                                  │    │
│    │  │  #125   Jan 15, 10:30  James Wilson  Dr. Wilson    ✓ COMPLETED  │    │
│    │  │         Dermatology    P-2031        D-008         [View]       │    │
│    │  │                                                                  │    │
│    │  │  #126   Jan 14, 14:00  Mary Kim      Dr. Lee       × CANCELLED  │    │
│    │  │         General Pract. P-3022        D-015         [View]       │    │
│    │  │         Reason: Patient request                                 │    │
│    │  │                                                                  │    │
│    │  │  #127   Jan 14, 11:00  Tom Brown     Dr. Singh     ⚠ NO_SHOW   │    │
│    │  │         Orthopedics    P-4012        D-020         [View]       │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  [< Previous]  Page 1 of 262  [Next >]                                   │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Analytics & Reports

**Route:** `/admin/reports`
**Access:** ADMIN role only
**Requirements:** FR-5.3

### Desktop Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [☰] Hospital Admin    Users  Doctors  Departments  Reports   [🔔5] Admin [▾] │
├────┬───────────────────────────────────────────────────────────────────────────┤
│    │                                                                           │
│    │  Analytics & Reports                                [Generate Report ▾]  │
│    │                                                                           │
│    │  Period: [Last 30 Days ▾]  Custom: [Jan 1] to [Jan 31]    [Apply]       │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  KEY METRICS (Last 30 Days)                                     │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Total Appointments:     5,234  (+12.5% from previous period)   │    │
│    │  │  Completed:              4,523  (86.4%)                          │    │
│    │  │  Cancelled:                487  (9.3%)                           │    │
│    │  │  No-Shows:                 224  (4.3%)                           │    │
│    │  │                                                                  │    │
│    │  │  New Patients:             247  (+8.2%)                          │    │
│    │  │  Average Daily Appts:      174                                   │    │
│    │  │  Peak Day:                 Mon (avg 198 appts)                   │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  APPOINTMENT TRENDS                                             │    │
│    │  │  [Bar Chart showing daily appointment volume]                   │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
│    │  ┌────────────────────────┐  ┌───────────────────────────────────┐      │
│    │  │  TOP DOCTORS           │  │  BUSIEST DEPARTMENTS              │      │
│    │  │  (By Appointments)     │  │                                   │      │
│    │  ├────────────────────────┤  ├───────────────────────────────────┤      │
│    │  │                        │  │                                   │      │
│    │  │  1. Dr. Thompson  187  │  │  1. Cardiology        1,234      │      │
│    │  │  2. Dr. Wilson    165  │  │  2. Dermatology         987      │      │
│    │  │  3. Dr. Lee       142  │  │  3. General Practice    876      │      │
│    │  │  4. Dr. Singh     138  │  │  4. Orthopedics         654      │      │
│    │  │  5. Dr. Kumar     121  │  │  5. Pediatrics          543      │      │
│    │  │                        │  │                                   │      │
│    │  └────────────────────────┘  └───────────────────────────────────┘      │
│    │                                                                           │
│    │  ┌──────────────────────────────────────────────────────────────────┐    │
│    │  │  CANCELLATION REASONS (Last 30 Days)                            │    │
│    │  ├──────────────────────────────────────────────────────────────────┤    │
│    │  │                                                                  │    │
│    │  │  Schedule Conflict        ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  187 (38.4%)    │    │
│    │  │  Feeling Better           ▓▓▓▓▓▓▓▓░░░░░░░░░░░░  132 (27.1%)    │    │
│    │  │  Personal Reasons         ▓▓▓▓▓▓░░░░░░░░░░░░░░   98 (20.1%)    │    │
│    │  │  No Longer Needed         ▓▓▓░░░░░░░░░░░░░░░░░   45 (9.2%)     │    │
│    │  │  Other                    ▓░░░░░░░░░░░░░░░░░░░   25 (5.1%)     │    │
│    │  │                                                                  │    │
│    │  └──────────────────────────────────────────────────────────────────┘    │
│    │                                                                           │
└────┴───────────────────────────────────────────────────────────────────────────┘
```

---

## API Calls

### User Management

```javascript
GET /api/admin/users?page=1&limit=10&role=PATIENT&status=active

POST /api/admin/users
{ firstName, lastName, email, phone, role, password }

PUT /api/admin/users/123
{ firstName, lastName, email, phone, isActive }

DELETE /api/admin/users/123

POST /api/admin/users/123/reset-password
```

### Department Management

```javascript
GET /api/admin/departments

POST /api/admin/departments
{ name, description }

PUT /api/admin/departments/5
{ name, description }

DELETE /api/admin/departments/5
```

### Analytics

```javascript
GET /api/admin/analytics?startDate=2026-01-01&endDate=2026-01-31
Response: {
  totalAppointments, completed, cancelled, noShows,
  newPatients, trends, topDoctors, topDepartments
}
```

---

## Accessibility Checklist

- [ ] All data tables have proper headers and ARIA labels
- [ ] Sortable columns keyboard accessible
- [ ] Modal dialogs trap focus
- [ ] Destructive actions require confirmation
- [ ] Charts have text alternatives
- [ ] Filter controls keyboard navigable
- [ ] Status indicators use text + icons, not just color

---

## Next: Component Library

See [05-component-library.md](05-component-library.md) for reusable UI components and design patterns.
