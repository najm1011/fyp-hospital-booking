# Quick Start Guide

> **Hospital Appointment Booking System**
> **Student:** Najm (2356070)

---

## 🚀 Quick Start (Development)

### Prerequisites

- **Java 17+** installed
- **Node.js 18+** and npm installed
- **Terminal** access

---

## Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
```

**Wait for:** Package installation to complete (~2-3 minutes first time)

---

## Step 2: Start Backend (Terminal 1)

```bash
cd backend
./mvnw spring-boot:run
```

**Wait for:**
```
Started HospitalBookingApiApplication in 5.123 seconds
Tomcat started on port(s): 8080 (http)
```

**Backend running at:** http://localhost:8080

---

## Step 3: Start Frontend (Terminal 2 - New Window)

```bash
cd frontend
npm run dev
```

**Wait for:**
```
➜  Local:   http://localhost:3000/
```

**Browser opens automatically!**

---

## 🎯 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | - |
| **Backend API** | http://localhost:8080/api/v1 | - |
| **H2 Database Console** | http://localhost:8080/h2-console | Username: `sa`, Password: (empty) |

### H2 Console Login

- **JDBC URL:** `jdbc:h2:mem:hospital_booking_db`
- **Username:** `sa`
- **Password:** (leave empty)

---

## 📋 Common Commands

### Backend

```bash
# Start backend
cd backend
./mvnw spring-boot:run

# Build backend
./mvnw clean package

# Run tests
./mvnw test
```

### Frontend

```bash
# Start development server (Vite)
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

---

## 🛑 Stop Servers

Press `Ctrl + C` in each terminal window

Or kill by port:

```bash
# Kill backend (port 8080)
lsof -ti:8080 | xargs kill -9

# Kill frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [H2 Database Setup](docs/database/H2-DATABASE-SETUP.md) | H2 development database guide |
| [MySQL Production Setup](docs/database/MYSQL-PRODUCTION-SETUP.md) | MySQL production database guide |
| [Vite Frontend Setup](docs/frontend/VITE-SETUP.md) | Vite configuration and usage |
| [REST API Specification](docs/api/README.md) | All 40 API endpoints documented |
| [Database ER Diagram](docs/diagrams/database-er-diagram.md) | Database schema and relationships |
| [UI Wireframes](docs/wireframes/README.md) | All UI designs and components |
| [Deployment Guide](docs/deployment/DEPLOYMENT-GUIDE.md) | Production deployment instructions |

---

## 🏗️ Project Structure

```
hospital-booking-system/
├── backend/                    # Spring Boot API
│   ├── src/main/java/         # Java source code
│   │   └── com/hospitalapp/backend/
│   │       ├── model/         # JPA entities ✅
│   │       ├── repository/    # Data repositories ✅
│   │       ├── service/       # Business logic (Next)
│   │       ├── controller/    # REST controllers (Next)
│   │       ├── config/        # Configuration
│   │       ├── security/      # Security & JWT
│   │       └── exception/     # Error handling
│   └── src/main/resources/
│       ├── application.properties      # H2 dev config
│       └── application-prod.properties # MySQL prod config
│
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Utilities
│   ├── public/              # Static assets
│   ├── index.html           # Entry HTML
│   └── vite.config.js       # Vite config
│
├── database/                 # Database files
│   ├── schema.sql           # MySQL schema
│   └── seed-data.sql        # Sample data
│
└── docs/                    # Documentation
    ├── api/                 # API documentation
    ├── database/            # Database guides
    ├── diagrams/            # ER diagrams
    ├── wireframes/          # UI designs
    ├── deployment/          # Deployment guides
    └── frontend/            # Frontend guides
```

---

## ✅ What's Completed

### Sprint 1 ✅
- [x] Database ER Diagram
- [x] UI Wireframes (30+ screens)
- [x] REST API Specification (40 endpoints)
- [x] H2 Database Configuration
- [x] MySQL Production Configuration

### Sprint 2 (In Progress) 🚧
- [x] JPA Entities (5 entities)
- [x] Spring Data Repositories (5 repositories)
- [x] Vite Frontend Configuration
- [ ] Service Layer
- [ ] REST Controllers
- [ ] Security Configuration (JWT)
- [ ] Exception Handling
- [ ] Integration Tests

---

## 🔧 Technology Stack

**Backend:**
- Spring Boot 3.4.12
- Java 17
- Spring Data JPA / Hibernate
- Spring Security + JWT
- H2 (dev) / MySQL 8+ (prod)
- Maven

**Frontend:**
- React 19.2.3
- Vite 5.2.0
- Tailwind CSS 3.4.19
- React Router 7.11.0
- Axios 1.13.2

---

## 🆘 Troubleshooting

### Backend won't start

```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill process if needed
kill -9 <PID>
```

### Frontend won't start

```bash
# Remove and reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database tables not created

Tables are auto-created from JPA entities when backend starts. Check:
1. Backend started successfully
2. Access H2 Console
3. Run `SHOW TABLES;`

Expected tables:
- USERS
- DEPARTMENTS
- DOCTORS
- TIME_SLOTS
- APPOINTMENTS

---

## 📞 Need Help?

Check the comprehensive documentation in the `docs/` folder:

- **Backend Issues:** See [H2-DATABASE-SETUP.md](docs/database/H2-DATABASE-SETUP.md)
- **Frontend Issues:** See [VITE-SETUP.md](docs/frontend/VITE-SETUP.md)
- **API Questions:** See [docs/api/README.md](docs/api/README.md)
- **Deployment:** See [DEPLOYMENT-GUIDE.md](docs/deployment/DEPLOYMENT-GUIDE.md)

---

**Ready to develop!** 🎉

Start with `npm install` in frontend, then run both servers!
