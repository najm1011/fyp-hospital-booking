# Database Configuration Files

> **Project:** Hospital Appointment Booking System
> **Student:** Najm (2356070)

---

## Overview

This directory contains all database-related files for the Hospital Booking System, including schema definitions, seed data, and migration scripts for both development (H2) and production (MySQL) environments.

---

## Directory Structure

```
database/
├── README.md                  ← You are here
├── schema.sql                 ← MySQL production schema (tables, views, procedures, triggers)
├── seed-data.sql              ← Sample test data for development
└── migrations/                ← Future database migration scripts (Flyway)
```

---

## Files

### 1. schema.sql

**Purpose:** Complete MySQL database schema for production deployment

**Contains:**
- Database creation with UTF-8 support
- 5 main tables: users, doctors, departments, time_slots, appointments
- Foreign key constraints and relationships
- Indexes for query performance
- Database views for common queries
- Stored procedures for complex operations
- Triggers for data validation
- Initial department data
- Default admin user

**Usage:**

```bash
# Create database and run schema
mysql -u root -p < schema.sql

# Or if database already exists
mysql -u hospital_app -p hospital_booking < schema.sql
```

**Important Notes:**
- Run this ONCE when setting up production database
- Contains DROP DATABASE statement (commented out for safety)
- Creates application user 'hospital_app' with limited privileges
- Default admin password: Admin123! (CHANGE IMMEDIATELY)

---

### 2. seed-data.sql

**Purpose:** Sample data for development and testing

**Contains:**
- 10 sample patient users
- 10 sample doctor users
- 10 doctor profiles across all departments
- 60+ time slot entries (doctor availability)
- 20+ sample appointments (scheduled, completed, cancelled)

**Usage:**

```bash
# Load test data (development/testing ONLY)
mysql -u hospital_app -p hospital_booking < seed-data.sql
```

**Important Notes:**
- **DO NOT run in production** - for testing purposes only
- All user passwords: Patient123! or Doctor123!
- Appointments use dynamic dates (relative to current date)
- Useful for testing API endpoints without manual data entry

---

## Setup Instructions

### Development Environment (H2 Database)

For development, use H2 in-memory database. No SQL files needed - Hibernate auto-creates schema from JPA entities.

**See:** [docs/database/H2-DATABASE-SETUP.md](../docs/database/H2-DATABASE-SETUP.md)

**Configuration:** `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:h2:mem:hospital_booking_db
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
```

---

### Production Environment (MySQL 8.0+)

For production, use MySQL with manually created schema.

**See:** [docs/database/MYSQL-PRODUCTION-SETUP.md](../docs/database/MYSQL-PRODUCTION-SETUP.md)

**Steps:**

1. **Install MySQL 8.0+**

```bash
# Ubuntu/Debian
sudo apt install mysql-server

# macOS
brew install mysql
```

2. **Create Database and User**

```sql
CREATE DATABASE hospital_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hospital_app'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON hospital_booking.* TO 'hospital_app'@'localhost';
FLUSH PRIVILEGES;
```

3. **Run Schema Script**

```bash
mysql -u hospital_app -p hospital_booking < database/schema.sql
```

4. **Configure Application**

Update `backend/src/main/resources/application-prod.properties` or set environment variables:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=hospital_booking
export DB_USERNAME=hospital_app
export DB_PASSWORD=your_password
```

5. **Start Application with Production Profile**

```bash
./mvnw spring-boot:run -Dspring.profiles.active=prod
```

---

## Database Schema Summary

### Tables

| Table | Description | Rows (after seed) |
|-------|-------------|-------------------|
| **users** | All user accounts (patients, doctors, admins) | 21 |
| **departments** | Medical departments | 5 |
| **doctors** | Doctor-specific profiles | 10 |
| **time_slots** | Doctor availability schedules | 60+ |
| **appointments** | Patient bookings | 20+ |

### Entity Relationships

```
users (1) ─────── (1) doctors ─────── (M) time_slots
  │                    │
  │                    │
  │                    │
  │ (1:M)              │ (M:1)
  │                    │
  └─────> appointments <─────┘
                │
                │ (M:1)
                │
                ▼
          departments
```

### Key Constraints

- **Unique email** per user
- **Unique doctor-date-time** slot (prevents double booking)
- **Foreign keys** with CASCADE/RESTRICT for data integrity
- **Check constraints** for valid time ranges
- **Triggers** to validate appointment availability

---

## Database Views

### active_appointments

Lists all scheduled appointments with patient and doctor details.

```sql
SELECT * FROM active_appointments;
```

### doctor_statistics

Provides appointment statistics per doctor.

```sql
SELECT * FROM doctor_statistics;
```

---

## Stored Procedures

### get_available_slots

Get available time slots for a doctor on a specific date.

```sql
CALL get_available_slots(1, '2026-01-15');
```

### get_patient_appointments

Get all appointments for a patient.

```sql
CALL get_patient_appointments(1);
```

### get_doctor_schedule

Get doctor's schedule for a date range.

```sql
CALL get_doctor_schedule(1, '2026-01-15', '2026-01-31');
```

---

## Triggers

### prevent_overlapping_appointments

Automatically prevents booking overlapping time slots for the same doctor.

```sql
-- Attempting to book an already-booked slot triggers error:
-- Error 1644: Time slot already booked for this doctor
```

### validate_doctor_availability

Ensures appointments are only booked during doctor's working hours.

```sql
-- Attempting to book outside working hours triggers error:
-- Error 1644: Doctor is not available at the selected time
```

---

## Database Migrations

### Manual Migrations

For schema changes in production:

1. Create migration script: `migrations/V2_add_feature.sql`
2. Test in development environment
3. Backup production database
4. Apply migration:

```bash
mysql -u hospital_app -p hospital_booking < migrations/V2_add_feature.sql
```

### Flyway Migrations (Recommended for Future)

Flyway can be added for automated versioned migrations:

```
database/migrations/
├── V1__Initial_Schema.sql
├── V2__Add_Reviews_Table.sql
├── V3__Add_Notifications.sql
```

Add to `pom.xml`:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

---

## Backup and Restore

### Backup Database

```bash
# Full backup
mysqldump -u hospital_backup -p \
    --single-transaction \
    --routines \
    --triggers \
    hospital_booking > backup_$(date +%Y%m%d).sql

# Compress
gzip backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
# Decompress
gunzip backup_20260112.sql.gz

# Restore
mysql -u hospital_app -p hospital_booking < backup_20260112.sql
```

### Automated Backups

See [docs/database/MYSQL-PRODUCTION-SETUP.md](../docs/database/MYSQL-PRODUCTION-SETUP.md) for automated backup scripts.

---

## Test Credentials

### Admin User

- **Email:** admin@hospital-booking.com
- **Password:** Admin123!
- **Role:** ADMIN

**IMPORTANT:** Change admin password immediately after first login in production.

### Sample Patient (from seed-data.sql)

- **Email:** sarah.chen@example.com
- **Password:** Patient123!
- **Role:** PATIENT

### Sample Doctor (from seed-data.sql)

- **Email:** dr.emily.thompson@hospital.com
- **Password:** Doctor123!
- **Role:** DOCTOR
- **Department:** Cardiology

---

## Verification Queries

### Check Tables Created

```sql
SHOW TABLES;
```

### Count Records

```sql
SELECT
    'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'time_slots', COUNT(*) FROM time_slots
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments;
```

### View Sample Data

```sql
-- List all departments
SELECT * FROM departments;

-- List all doctors with departments
SELECT
    d.id,
    CONCAT(u.first_name, ' ', u.last_name) AS doctor_name,
    d.specialty,
    dep.name AS department
FROM doctors d
JOIN users u ON d.user_id = u.id
JOIN departments dep ON d.department_id = dep.id;

-- List upcoming appointments
SELECT * FROM active_appointments LIMIT 10;
```

---

## Security Best Practices

1. **Never use root user** for application connections
2. **Use strong passwords** for all database users
3. **Grant minimum privileges** to application user
4. **Enable SSL/TLS** for database connections in production
5. **Regular backups** - daily automated backups with 30-day retention
6. **Rotate passwords** periodically
7. **Monitor slow queries** and optimize performance
8. **Keep database updated** to latest stable version

---

## Troubleshooting

### Issue: "Table doesn't exist"

```bash
# Verify database selected
mysql -u hospital_app -p hospital_booking -e "SELECT DATABASE();"

# Re-run schema
mysql -u hospital_app -p hospital_booking < database/schema.sql
```

### Issue: "Access denied for user"

```sql
-- Check user exists and has privileges
SHOW GRANTS FOR 'hospital_app'@'localhost';

-- Reset password if needed
ALTER USER 'hospital_app'@'localhost' IDENTIFIED BY 'new_password';
```

### Issue: Duplicate entry errors

```sql
-- Clear all data (CAUTION: Deletes everything)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE appointments;
TRUNCATE TABLE time_slots;
TRUNCATE TABLE doctors;
TRUNCATE TABLE users;
TRUNCATE TABLE departments;
SET FOREIGN_KEY_CHECKS = 1;

-- Re-run schema and seed data
SOURCE database/schema.sql;
SOURCE database/seed-data.sql;
```

---

## Documentation References

- **H2 Development Setup:** [docs/database/H2-DATABASE-SETUP.md](../docs/database/H2-DATABASE-SETUP.md)
- **MySQL Production Setup:** [docs/database/MYSQL-PRODUCTION-SETUP.md](../docs/database/MYSQL-PRODUCTION-SETUP.md)
- **Database Schema Design:** [docs/database/database-schema.md](../docs/database/database-schema.md)
- **ER Diagram:** [docs/diagrams/database-er-diagram.md](../docs/diagrams/database-er-diagram.md)

---

## Next Steps

1. ✅ Database schema designed and documented
2. ✅ H2 configured for development
3. ✅ MySQL configured for production
4. 📝 Create JPA entity classes (Sprint 2)
5. 📝 Create repository interfaces (Sprint 2)
6. 📝 Implement service layer (Sprint 2)
7. 📝 Create REST controllers (Sprint 2)

---

**Database Configuration Complete!** ✅

All database files are ready for both development (H2) and production (MySQL) environments.
