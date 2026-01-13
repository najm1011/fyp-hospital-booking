# H2 Database Configuration Guide

> **Project:** Hospital Appointment Booking System
> **Environment:** Development
> **Database:** H2 In-Memory Database
> **Last Updated:** January 12, 2026

---

## Overview

This guide explains how to configure and use H2 database for development. H2 is a lightweight, in-memory database perfect for rapid development and testing.

---

## Table of Contents

1. [What is H2 Database?](#what-is-h2-database)
2. [Configuration Files](#configuration-files)
3. [Starting the Application](#starting-the-application)
4. [Accessing H2 Console](#accessing-h2-console)
5. [Database Schema](#database-schema)
6. [Sample Data](#sample-data)
7. [Troubleshooting](#troubleshooting)
8. [Switching to MySQL](#switching-to-mysql)

---

## What is H2 Database?

### Features

- **In-Memory:** Data stored in RAM (fast, but lost on restart)
- **Embedded:** No separate database server needed
- **Web Console:** Built-in web UI to view/query data
- **SQL Compatible:** Supports standard SQL syntax
- **Zero Configuration:** Works out of the box

### Advantages for Development

✅ **Fast startup** - No database server installation
✅ **Clean slate** - Fresh database on each restart
✅ **Easy testing** - Perfect for unit/integration tests
✅ **Portable** - No external dependencies
✅ **SQL practice** - Learn SQL without MySQL setup

### Limitations

⚠️ **Data not persistent** - Lost when application stops
⚠️ **Not for production** - Use MySQL/PostgreSQL for production
⚠️ **Limited features** - Some MySQL features not available

---

## Configuration Files

### 1. application.properties

**Location:** `backend/src/main/resources/application.properties`

**Key H2 Configurations:**

```properties
# H2 Database URL (in-memory)
spring.datasource.url=jdbc:h2:mem:hospital_booking_db
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Enable H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Auto-create database schema from JPA entities
spring.jpa.hibernate.ddl-auto=create-drop
```

### 2. pom.xml

**H2 Dependency (Already Configured):**

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## Starting the Application

### Step 1: Navigate to Backend Directory

```bash
cd /Users/najm/Desktop/hospital-booking-system/backend
```

### Step 2: Build the Project

```bash
./mvnw clean install
```

**Expected Output:**
```
[INFO] BUILD SUCCESS
[INFO] Total time:  XX.XXX s
```

### Step 3: Run the Application

```bash
./mvnw spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.4.12)

2026-01-12 20:00:00 - Starting HospitalBookingApiApplication
2026-01-12 20:00:01 - Tomcat initialized with port(s): 8080 (http)
2026-01-12 20:00:02 - HHH000204: Processing PersistenceUnitInfo [name: default]
2026-01-12 20:00:03 - HHH000412: Hibernate ORM core version 6.4.1.Final
2026-01-12 20:00:05 - Started HospitalBookingApiApplication in 5.123 seconds
```

### Step 4: Verify Application is Running

Open browser: http://localhost:8080

**Expected Response:**
```json
{
  "error": "Not Found",
  "status": 404
}
```

This is normal - API endpoints need to be implemented first.

---

## Accessing H2 Console

### Step 1: Open H2 Console

**URL:** http://localhost:8080/h2-console

### Step 2: Login to H2 Database

**Connection Settings:**

```
Saved Settings:    Generic H2 (Embedded)
Setting Name:      Generic H2 (Embedded)
Driver Class:      org.h2.Driver
JDBC URL:          jdbc:h2:mem:hospital_booking_db
User Name:         sa
Password:          [leave empty]
```

### Step 3: Click "Connect"

You should see the H2 Console interface with:
- Left panel: Database schema tree
- Right panel: SQL query editor

### Step 4: View Tables

Once you create JPA entities, tables will appear:
- USERS
- DOCTORS
- DEPARTMENTS
- APPOINTMENTS
- TIME_SLOTS

---

## Database Schema

### Viewing Schema

In H2 Console, run:

```sql
-- Show all tables
SELECT * FROM INFORMATION_SCHEMA.TABLES;

-- Show table structure
SHOW COLUMNS FROM USERS;
```

### Expected Tables (After Entity Creation)

```
┌──────────────┐
│    USERS     │
├──────────────┤
│ ID           │
│ EMAIL        │
│ PASSWORD_HASH│
│ FIRST_NAME   │
│ LAST_NAME    │
│ PHONE_NUMBER │
│ ROLE         │
│ IS_ACTIVE    │
│ CREATED_AT   │
│ UPDATED_AT   │
└──────────────┘

┌──────────────────┐
│   DEPARTMENTS    │
├──────────────────┤
│ ID               │
│ NAME             │
│ DESCRIPTION      │
│ CREATED_AT       │
└──────────────────┘

┌──────────────────┐
│     DOCTORS      │
├──────────────────┤
│ ID               │
│ USER_ID          │
│ DEPARTMENT_ID    │
│ SPECIALTY        │
│ QUALIFICATIONS   │
│ BIO              │
│ PHOTO_URL        │
│ CONSULTATION_FEE │
│ CREATED_AT       │
└──────────────────┘

┌──────────────────┐
│   TIME_SLOTS     │
├──────────────────┤
│ ID               │
│ DOCTOR_ID        │
│ DAY_OF_WEEK      │
│ START_TIME       │
│ END_TIME         │
│ IS_AVAILABLE     │
│ CREATED_AT       │
└──────────────────┘

┌─────────────────────┐
│   APPOINTMENTS      │
├─────────────────────┤
│ ID                  │
│ PATIENT_ID          │
│ DOCTOR_ID           │
│ APPOINTMENT_DATE    │
│ START_TIME          │
│ END_TIME            │
│ STATUS              │
│ PATIENT_NOTES       │
│ DOCTOR_NOTES        │
│ CANCELLATION_REASON │
│ CREATED_AT          │
│ UPDATED_AT          │
└─────────────────────┘
```

---

## Sample Data

### Inserting Test Data

You can insert test data via H2 Console:

```sql
-- Insert test user (patient)
INSERT INTO USERS (ID, EMAIL, PASSWORD_HASH, FIRST_NAME, LAST_NAME, ROLE, IS_ACTIVE, CREATED_AT)
VALUES (1, 'sarah.chen@example.com', '$2a$12$hashedpassword', 'Sarah', 'Chen', 'PATIENT', TRUE, CURRENT_TIMESTAMP);

-- Insert department
INSERT INTO DEPARTMENTS (ID, NAME, DESCRIPTION, CREATED_AT)
VALUES (1, 'Cardiology', 'Heart and cardiovascular system treatment', CURRENT_TIMESTAMP);

-- Insert doctor user
INSERT INTO USERS (ID, EMAIL, PASSWORD_HASH, FIRST_NAME, LAST_NAME, ROLE, IS_ACTIVE, CREATED_AT)
VALUES (2, 'dr.thompson@hospital.com', '$2a$12$hashedpassword', 'Emily', 'Thompson', 'DOCTOR', TRUE, CURRENT_TIMESTAMP);

-- Insert doctor profile
INSERT INTO DOCTORS (ID, USER_ID, DEPARTMENT_ID, SPECIALTY, QUALIFICATIONS, CONSULTATION_FEE, CREATED_AT)
VALUES (1, 2, 1, 'General Cardiology', 'MD, MBBS', 150.00, CURRENT_TIMESTAMP);

-- Insert time slot
INSERT INTO TIME_SLOTS (ID, DOCTOR_ID, DAY_OF_WEEK, START_TIME, END_TIME, IS_AVAILABLE, CREATED_AT)
VALUES (1, 1, 'MONDAY', '09:00:00', '17:00:00', TRUE, CURRENT_TIMESTAMP);

-- Insert appointment
INSERT INTO APPOINTMENTS (ID, PATIENT_ID, DOCTOR_ID, APPOINTMENT_DATE, START_TIME, END_TIME, STATUS, PATIENT_NOTES, CREATED_AT)
VALUES (1, 1, 1, '2026-01-15', '09:00:00', '09:30:00', 'SCHEDULED', 'Chest pain follow-up', CURRENT_TIMESTAMP);
```

### Querying Data

```sql
-- View all users
SELECT * FROM USERS;

-- View all doctors with department names
SELECT d.ID, u.FIRST_NAME, u.LAST_NAME, d.SPECIALTY, dep.NAME AS DEPARTMENT
FROM DOCTORS d
JOIN USERS u ON d.USER_ID = u.ID
JOIN DEPARTMENTS dep ON d.DEPARTMENT_ID = dep.ID;

-- View appointments with patient and doctor names
SELECT
    a.ID,
    a.APPOINTMENT_DATE,
    a.START_TIME,
    p.FIRST_NAME || ' ' || p.LAST_NAME AS PATIENT_NAME,
    d.FIRST_NAME || ' ' || d.LAST_NAME AS DOCTOR_NAME,
    a.STATUS
FROM APPOINTMENTS a
JOIN USERS p ON a.PATIENT_ID = p.ID
JOIN DOCTORS doc ON a.DOCTOR_ID = doc.ID
JOIN USERS d ON doc.USER_ID = d.ID
ORDER BY a.APPOINTMENT_DATE, a.START_TIME;
```

---

## H2 Console Features

### 1. SQL Query Editor

- **Write SQL:** Type queries in the text area
- **Execute:** Click "Run" or press Ctrl+Enter
- **Results:** View in table format below
- **Export:** Download results as CSV

### 2. Table Browser

- **Left Panel:** Click table names to view structure
- **Columns:** See column names, types, constraints
- **Indexes:** View indexes and keys
- **Foreign Keys:** See relationships

### 3. SQL Scripts

Save commonly used queries:

```sql
-- Create script file: test-data.sql
INSERT INTO DEPARTMENTS VALUES (1, 'Cardiology', 'Heart care', CURRENT_TIMESTAMP);
INSERT INTO DEPARTMENTS VALUES (2, 'Dermatology', 'Skin care', CURRENT_TIMESTAMP);
```

Run script:
```sql
RUNSCRIPT FROM 'classpath:test-data.sql';
```

---

## Configuration Options

### DDL Auto Modes

In `application.properties`:

```properties
# create-drop: Create schema on startup, drop on shutdown (Development)
spring.jpa.hibernate.ddl-auto=create-drop

# create: Create schema on startup, keep on shutdown
spring.jpa.hibernate.ddl-auto=create

# update: Update schema, never drop tables (Safer for development)
spring.jpa.hibernate.ddl-auto=update

# validate: Validate schema matches entities, no changes (Production)
spring.jpa.hibernate.ddl-auto=validate

# none: No schema management (Production)
spring.jpa.hibernate.ddl-auto=none
```

**Recommendation for Development:** Use `create-drop` for clean state each restart.

### File-Based H2 (Persistent)

To keep data between restarts:

```properties
# File-based H2 (data persists)
spring.datasource.url=jdbc:h2:file:./data/hospital_booking_db

# Or in home directory
spring.datasource.url=jdbc:h2:file:~/hospital_booking_db
```

**Note:** Creates `hospital_booking_db.mv.db` file.

---

## Troubleshooting

### Issue 1: H2 Console Not Accessible

**Problem:** http://localhost:8080/h2-console shows 404

**Solution:**
1. Check `application.properties`:
   ```properties
   spring.h2.console.enabled=true
   ```
2. Restart application
3. Verify URL: http://localhost:8080/h2-console (not /h2)

### Issue 2: Cannot Connect to Database

**Problem:** Login fails in H2 Console

**Solution:**
1. Verify JDBC URL: `jdbc:h2:mem:hospital_booking_db`
2. Username: `sa`
3. Password: (leave empty)
4. Check application logs for database name

### Issue 3: Tables Not Showing

**Problem:** No tables in H2 Console

**Solution:**
1. Create JPA entity classes first
2. Ensure `@Entity` annotation present
3. Check `spring.jpa.hibernate.ddl-auto=create-drop`
4. Restart application
5. Refresh H2 Console

### Issue 4: Data Disappears

**Problem:** Data lost after restart

**Solution:**
- **Expected behavior** with in-memory H2
- Use file-based H2 or create data initialization script
- Or switch to MySQL for persistence

### Issue 5: SQL Syntax Errors

**Problem:** Query fails in H2 Console

**Solution:**
- H2 uses slightly different SQL syntax than MySQL
- Check H2 documentation for specific functions
- Example: Use `CURRENT_TIMESTAMP` not `NOW()`

---

## Logging SQL Queries

### View Generated SQL

In `application.properties`:

```properties
# Show SQL in console
spring.jpa.show-sql=true

# Format SQL for readability
spring.jpa.properties.hibernate.format_sql=true

# Show parameter values
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### Sample Output

```sql
Hibernate:
    insert
    into
        USERS
        (CREATED_AT, EMAIL, FIRST_NAME, IS_ACTIVE, LAST_NAME, PASSWORD_HASH, PHONE_NUMBER, ROLE, UPDATED_AT, ID)
    values
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
2026-01-12 20:00:05 - binding parameter [1] as [TIMESTAMP] - [2026-01-12T20:00:05.123]
2026-01-12 20:00:05 - binding parameter [2] as [VARCHAR] - [sarah.chen@example.com]
```

---

## Switching to MySQL (Production)

### Step 1: Create MySQL Database

```sql
CREATE DATABASE hospital_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hospital_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON hospital_booking.* TO 'hospital_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Update application.properties

```properties
# Comment out H2 configuration
# spring.datasource.url=jdbc:h2:mem:hospital_booking_db
# spring.h2.console.enabled=true

# Add MySQL configuration
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_booking?useSSL=false&serverTimezone=UTC
spring.datasource.username=hospital_user
spring.datasource.password=secure_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# MySQL dialect
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Production: validate schema only
spring.jpa.hibernate.ddl-auto=validate

# Disable SQL logging in production
spring.jpa.show-sql=false
```

### Step 3: Run Database Migrations

Use Flyway or Liquibase for production schema management.

---

## Best Practices

### Development Workflow

1. ✅ **Use H2 for rapid development** - Fast iteration
2. ✅ **Create JPA entities first** - Let Hibernate generate schema
3. ✅ **Use H2 Console to inspect** - Verify data structure
4. ✅ **Test with sample data** - Insert via SQL or REST API
5. ✅ **Switch to MySQL before production** - Test with real DB

### Do's

✅ Use `create-drop` mode in development
✅ Enable SQL logging to debug queries
✅ Use H2 Console to verify schema
✅ Write integration tests with H2
✅ Keep sample data scripts

### Don'ts

❌ Don't use H2 in production
❌ Don't rely on in-memory data persistence
❌ Don't use MySQL-specific SQL in entities
❌ Don't hardcode database URLs in code
❌ Don't commit database files to Git

---

## Useful H2 Console Queries

### Database Information

```sql
-- Show all tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='PUBLIC';

-- Show table row counts
SELECT TABLE_NAME, COUNT(*) FROM INFORMATION_SCHEMA.TABLES;

-- Show indexes
SELECT * FROM INFORMATION_SCHEMA.INDEXES;

-- Show constraints
SELECT * FROM INFORMATION_SCHEMA.CONSTRAINTS;
```

### Data Queries

```sql
-- Count records
SELECT
    'Users' AS TABLE_NAME, COUNT(*) AS COUNT FROM USERS
UNION ALL
SELECT 'Doctors', COUNT(*) FROM DOCTORS
UNION ALL
SELECT 'Appointments', COUNT(*) FROM APPOINTMENTS;

-- Recent appointments
SELECT * FROM APPOINTMENTS
ORDER BY CREATED_AT DESC
LIMIT 10;

-- Appointments by status
SELECT STATUS, COUNT(*)
FROM APPOINTMENTS
GROUP BY STATUS;
```

---

## Next Steps

1. ✅ **H2 configured** - Database ready for development
2. 📝 **Create JPA entities** - Define User, Doctor, Appointment models
3. 🔧 **Create repositories** - Spring Data JPA interfaces
4. 🎯 **Create services** - Business logic layer
5. 🌐 **Create controllers** - REST API endpoints
6. 🧪 **Test with H2** - Write integration tests
7. 🚀 **Deploy with MySQL** - Production database

---

## Summary

✅ **H2 Database Configured Successfully**

- In-memory database for fast development
- H2 Console available at http://localhost:8080/h2-console
- Auto-creates schema from JPA entities
- Perfect for testing and development
- Easy migration to MySQL for production

**Configuration File:** [application.properties](../../backend/src/main/resources/application.properties)

---

**Ready for Sprint 2 Development!** 🚀

You can now start creating JPA entities, and H2 will automatically create the database schema based on your entity classes.
