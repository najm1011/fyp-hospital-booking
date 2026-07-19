# MediBook — Hospital Appointment Booking System

A full-stack web application for managing hospital appointments, designed to reduce missed appointments and improve patient–provider communication.

**Live demo:** [fyp-hospital-booking.vercel.app](https://fyp-hospital-booking.vercel.app)

<!-- TODO: add 2–3 screenshots here: login, booking flow, admin dashboard -->
<!-- ![Booking flow](docs/screenshots/booking.png) -->

## Features

- Patient registration and JWT-based authentication
- Role-based access control (patient / doctor / admin)
- Appointment booking, rescheduling, and cancellation
- Doctor schedule management
- Automated email notifications for upcoming appointments
- Admin dashboard with analytics

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, shadcn/ui |
| Backend | Spring Boot 3.4 (Java 17), REST API |
| Database | PostgreSQL (production), H2 (development/testing) |
| Auth | JWT, role-based access control |
| Deployment | Vercel (frontend) <!-- TODO: add backend host --> |

## Architecture

```
hospital-booking-system/
├── frontend/    # React application
├── backend/     # Spring Boot REST API
├── database/    # Schema and migrations
└── docs/        # Documentation
```

The backend follows a layered architecture (controller → service → repository) with clear separation between the API, business logic, and data access layers.

## Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

### Running the Frontend

```bash
cd frontend
npm install
npm start
```

Opens at http://localhost:3000

### Running the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Runs at http://localhost:8080 (uses H2 in-memory database by default for local development)

<!-- TODO once tests are added:
## Tests

```bash
cd backend
./mvnw test
```
-->

## About

Built as my final-year project (BSc Computer Science, Brunel University London), supervised by Steve Counsell.
