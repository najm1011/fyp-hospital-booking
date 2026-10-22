# MediBook — Hospital Appointment Booking System

A full-stack web application for managing hospital appointments, designed to reduce missed appointments and improve patient–provider communication.

**Live demo:** [fyp-hospital-booking.vercel.app](https://fyp-hospital-booking.vercel.app)

## Features

- Patient registration and JWT authentication with refresh tokens
- Role-based access control (patient / doctor / admin)
- Appointment booking, rescheduling and cancellation
- Double-booking prevention (service-level checks + partial unique index)
- Doctor availability management
- Automated email reminders for upcoming appointments
- AI symptom checker (Gemini) to suggest a department
- Admin dashboard with analytics

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios, Recharts |
| Backend | Spring Boot 3.4 (Java 17), Spring Security, Spring Data JPA |
| Database | PostgreSQL (H2 for tests) |
| Auth | JWT (access + refresh tokens), role-based access control |
| Deployment | Vercel (frontend) |

## Architecture

```
fyp-hospital-booking/
├── frontend/    # React application
├── backend/     # Spring Boot REST API
├── database/    # Schema and seed data
└── docs/        # Documentation
```

The backend uses a layered architecture (controller → service → repository) with DTOs separating the API from the data model.

## Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- Docker (for PostgreSQL)

### 1. Start the database

```bash
docker run -d --name medibook-db -e POSTGRES_DB=medibook -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:16
```

### 2. Configure the backend

Create `backend/.env`:

```properties
JWT_SECRET=<output of: openssl rand -base64 32>
DB_USERNAME=postgres
DB_PASSWORD=dev
DB_SSLMODE=disable
```

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

Runs at http://localhost:8080

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at http://localhost:3000

## Tests

```bash
cd backend
./mvnw test
```

## About

Built as my final-year project (BSc Computer Science, Brunel University London), supervised by Steve Counsell.
