# Hospital Appointment Booking System

A full-stack web application for managing hospital appointments, designed to reduce missed appointments and improve patient-healthcare provider communication.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Spring Boot 3.4 (Java 17)
- **Database:** MySQL (production), H2 (development)

## Project Structure
```
hospital-booking-system/
├── frontend/          # React application
├── backend/           # Spring Boot API
├── docs/              # Documentation
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8.0+

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

Runs at http://localhost:8080

## Features

- Patient registration and authentication
- Appointment booking, rescheduling, and cancellation
- Doctor schedule management
- Automated email notifications
- Admin dashboard with analytics

## Author

- **Student Number:** 2356070
- **Supervisor:** Steve Counsell
- **University:** Brunel University London
- **Module:** CS3072/CS3605 Final Year Project
