# MySQL Production Database Setup Guide

> **Project:** Hospital Appointment Booking System
> **Student:** Najm (2356070)
> **Environment:** Production
> **Database:** MySQL 8.0+
> **Last Updated:** January 12, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [MySQL Installation](#mysql-installation)
4. [Database Setup](#database-setup)
5. [Application Configuration](#application-configuration)
6. [Security Configuration](#security-configuration)
7. [Running the Application](#running-the-application)
8. [Database Migrations](#database-migrations)
9. [Backup and Restore](#backup-and-restore)
10. [Monitoring and Maintenance](#monitoring-and-maintenance)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This guide explains how to set up MySQL database for production deployment of the Hospital Booking System.

### Key Differences from H2 Development Setup

| Feature | H2 (Development) | MySQL (Production) |
|---------|------------------|-------------------|
| **Storage** | In-memory (RAM) | Persistent (Disk) |
| **Data Persistence** | Lost on restart | Permanent |
| **Performance** | Very fast | Fast with indexing |
| **Scalability** | Single instance | Replication, clustering |
| **Security** | Minimal | User permissions, SSL |
| **Backup** | Not needed | Critical requirement |
| **Use Case** | Development/Testing | Production deployment |

---

## Prerequisites

### System Requirements

- **Operating System:** Ubuntu 20.04+ / CentOS 8+ / macOS / Windows Server
- **RAM:** Minimum 2GB (Recommended 4GB+)
- **Disk Space:** Minimum 10GB free space
- **MySQL Version:** 8.0 or higher
- **Java:** JDK 17 or higher
- **Maven:** 3.8+

### Network Requirements

- MySQL port 3306 accessible (firewall configuration)
- Application server can connect to MySQL server
- SSL/TLS certificates (for encrypted connections)

---

## MySQL Installation

### Ubuntu/Debian

```bash
# Update package index
sudo apt update

# Install MySQL Server 8.0
sudo apt install mysql-server -y

# Secure MySQL installation
sudo mysql_secure_installation
```

**mysql_secure_installation prompts:**
- Set root password: **Yes** (use strong password)
- Remove anonymous users: **Yes**
- Disallow root login remotely: **Yes**
- Remove test database: **Yes**
- Reload privilege tables: **Yes**

### macOS (using Homebrew)

```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation
```

### Windows

1. Download MySQL Installer from [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
2. Run installer and select "MySQL Server 8.0"
3. Choose "Server only" or "Full" installation
4. Configure MySQL Server:
   - Port: 3306
   - Set root password
   - Create Windows service

### Verify Installation

```bash
# Check MySQL version
mysql --version

# Expected output: mysql  Ver 8.0.x for Linux/macOS/Windows
```

---

## Database Setup

### Step 1: Login to MySQL

```bash
# Login as root
sudo mysql -u root -p
```

Enter your root password when prompted.

### Step 2: Create Database and User

```sql
-- Create database
CREATE DATABASE hospital_booking
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Create application user
CREATE USER 'hospital_app'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON hospital_booking.* TO 'hospital_app'@'localhost';
GRANT EXECUTE ON hospital_booking.* TO 'hospital_app'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

**Important Security Notes:**
- Replace `STRONG_PASSWORD_HERE` with a secure password (min 16 characters, mixed case, numbers, symbols)
- Use `'hospital_app'@'%'` instead of `'hospital_app'@'localhost'` if connecting from different server
- Never use root user for application connections

### Step 3: Run Database Schema

```bash
# Navigate to database directory
cd /path/to/hospital-booking-system/database

# Run schema creation script
mysql -u hospital_app -p hospital_booking < schema.sql
```

**What this does:**
- Creates all tables (users, doctors, departments, time_slots, appointments)
- Sets up foreign keys and constraints
- Creates indexes for performance
- Creates database views for common queries
- Creates stored procedures
- Creates triggers for data validation
- Inserts initial department data
- Creates admin user

### Step 4: Load Sample Data (Optional - Development/Testing Only)

```bash
# Load test data
mysql -u hospital_app -p hospital_booking < seed-data.sql
```

**Warning:** Only load seed data in development/testing environments. Production should start with empty tables.

### Step 5: Verify Database Setup

```bash
# Login to MySQL
mysql -u hospital_app -p hospital_booking

# Run verification queries
SHOW TABLES;
DESCRIBE users;
SELECT COUNT(*) FROM departments;
SELECT * FROM users WHERE role = 'ADMIN';

# Exit
EXIT;
```

**Expected output:**
- 5 tables: users, doctors, departments, time_slots, appointments
- 5 departments
- 1 admin user

---

## Application Configuration

### Step 1: Create Environment Variables

**Linux/macOS:**

Create `/etc/hospital-booking/application.env`:

```bash
# Database Configuration
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=hospital_booking
export DB_USERNAME=hospital_app
export DB_PASSWORD=your_secure_password_here

# JWT Configuration
export JWT_SECRET=your_256_bit_secret_key_here_minimum_32_characters_required
export JWT_EXPIRATION=86400000

# Email Configuration
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USERNAME=noreply@yourdomain.com
export SMTP_PASSWORD=your_smtp_password
export EMAIL_FROM=noreply@yourdomain.com

# CORS Configuration
export CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# File Upload
export UPLOAD_DIR=/var/www/hospital-booking/uploads/
```

**Load environment variables:**

```bash
# Add to .bashrc or .bash_profile
source /etc/hospital-booking/application.env

# Or load before running application
source /etc/hospital-booking/application.env && java -jar backend.jar
```

**Windows:**

Use System Environment Variables or create `setenv.bat`:

```batch
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=hospital_booking
set DB_USERNAME=hospital_app
set DB_PASSWORD=your_secure_password_here
set JWT_SECRET=your_256_bit_secret_key_here
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Step 2: Build Application with Production Profile

```bash
# Navigate to backend directory
cd /path/to/hospital-booking-system/backend

# Build with production profile
./mvnw clean package -Pprod

# Or specify profile when running
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

### Step 3: Verify Configuration

```bash
# Check application-prod.properties is being used
java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# Look for these log lines:
# - The following profiles are active: prod
# - HikariPool-1 - Starting...
# - Initialized JPA EntityManagerFactory
# - Tomcat started on port(s): 8080
```

---

## Security Configuration

### Database User Permissions

**Principle of Least Privilege:**

```sql
-- Create read-only user for reports/analytics
CREATE USER 'hospital_readonly'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON hospital_booking.* TO 'hospital_readonly'@'localhost';

-- Create backup user
CREATE USER 'hospital_backup'@'localhost' IDENTIFIED BY 'backup_password';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON hospital_booking.* TO 'hospital_backup'@'localhost';
```

### SSL/TLS Encryption

**Enable SSL for MySQL connections:**

```sql
-- Check SSL status
SHOW VARIABLES LIKE '%ssl%';

-- Require SSL for application user
ALTER USER 'hospital_app'@'localhost' REQUIRE SSL;
```

**Update application-prod.properties:**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_booking?useSSL=true&requireSSL=true&verifyServerCertificate=true
```

### Firewall Configuration

**Ubuntu/Debian (UFW):**

```bash
# Allow MySQL only from application server
sudo ufw allow from 192.168.1.100 to any port 3306

# Deny all other connections
sudo ufw deny 3306
```

**CentOS/RHEL (firewalld):**

```bash
# Allow MySQL
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

### Password Security

**Generate strong passwords:**

```bash
# Generate JWT secret (256 bits)
openssl rand -base64 64

# Generate database password
openssl rand -base64 32
```

---

## Running the Application

### Development Mode (using JAR)

```bash
# Set environment variables
source /etc/hospital-booking/application.env

# Run with production profile
java -jar -Dspring.profiles.active=prod target/backend-0.0.1-SNAPSHOT.jar
```

### Production Deployment (Systemd Service)

**Create service file:** `/etc/systemd/system/hospital-booking.service`

```ini
[Unit]
Description=Hospital Booking System API
After=mysql.service
Requires=mysql.service

[Service]
User=hospital
Group=hospital
Type=simple
WorkingDirectory=/opt/hospital-booking
EnvironmentFile=/etc/hospital-booking/application.env
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /opt/hospital-booking/backend.jar
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Deploy and start service:**

```bash
# Create service user
sudo useradd -r -s /bin/false hospital

# Copy JAR file
sudo mkdir -p /opt/hospital-booking
sudo cp target/backend-0.0.1-SNAPSHOT.jar /opt/hospital-booking/backend.jar
sudo chown -R hospital:hospital /opt/hospital-booking

# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable hospital-booking

# Start service
sudo systemctl start hospital-booking

# Check status
sudo systemctl status hospital-booking

# View logs
sudo journalctl -u hospital-booking -f
```

### Docker Deployment

**Dockerfile:**

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: hospital_booking
      MYSQL_USER: hospital_app
      MYSQL_PASSWORD: app_password
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/1-schema.sql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: hospital_booking
      DB_USERNAME: hospital_app
      DB_PASSWORD: app_password
      JWT_SECRET: your_jwt_secret_here
      SMTP_HOST: smtp.gmail.com
      CORS_ALLOWED_ORIGINS: https://yourdomain.com
    ports:
      - "8080:8080"

volumes:
  mysql-data:
```

**Run with Docker:**

```bash
docker-compose up -d
```

---

## Database Migrations

### Manual Schema Updates

When making schema changes in production:

1. **Create migration script** (e.g., `V2_add_column.sql`):

```sql
-- Add new column to users table
ALTER TABLE users
ADD COLUMN middle_name VARCHAR(100) AFTER first_name;

-- Update existing records
UPDATE users SET middle_name = '' WHERE middle_name IS NULL;
```

2. **Test in staging environment first**

3. **Backup database before applying**

4. **Apply migration:**

```bash
mysql -u hospital_app -p hospital_booking < migrations/V2_add_column.sql
```

### Using Flyway (Recommended)

**Add Flyway dependency** to `pom.xml`:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

**Configure in application-prod.properties:**

```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
```

**Create migration files** in `src/main/resources/db/migration/`:

- `V1__Initial_Schema.sql`
- `V2__Add_Column.sql`
- `V3__Create_Index.sql`

Flyway will automatically apply migrations on startup.

---

## Backup and Restore

### Automated Daily Backups

**Create backup script:** `/opt/hospital-booking/scripts/backup.sh`

```bash
#!/bin/bash

# Configuration
DB_NAME="hospital_booking"
DB_USER="hospital_backup"
DB_PASS="backup_password"
BACKUP_DIR="/var/backups/hospital-booking"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Perform backup
mysqldump -u $DB_USER -p$DB_PASS \
    --single-transaction \
    --quick \
    --lock-tables=false \
    $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Delete old backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

**Make executable:**

```bash
sudo chmod +x /opt/hospital-booking/scripts/backup.sh
```

**Schedule with cron:**

```bash
# Edit crontab
sudo crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/hospital-booking/scripts/backup.sh >> /var/log/hospital-booking/backup.log 2>&1
```

### Manual Backup

```bash
# Full database backup
mysqldump -u hospital_backup -p \
    --single-transaction \
    --routines \
    --triggers \
    hospital_booking > backup_$(date +%Y%m%d).sql

# Compress
gzip backup_$(date +%Y%m%d).sql
```

### Restore from Backup

```bash
# Decompress backup
gunzip backup_20260112.sql.gz

# Restore database
mysql -u hospital_app -p hospital_booking < backup_20260112.sql

# Verify restoration
mysql -u hospital_app -p hospital_booking -e "SELECT COUNT(*) FROM users;"
```

---

## Monitoring and Maintenance

### Performance Monitoring

**Enable MySQL slow query log:**

```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow-query.log';
```

**Monitor slow queries:**

```bash
sudo tail -f /var/log/mysql/slow-query.log
```

### Database Optimization

**Optimize tables monthly:**

```sql
OPTIMIZE TABLE users, doctors, departments, time_slots, appointments;
```

**Analyze tables for query optimization:**

```sql
ANALYZE TABLE users, doctors, departments, time_slots, appointments;
```

**Check table statistics:**

```sql
SELECT
    table_name,
    table_rows,
    data_length,
    index_length,
    ROUND(data_length / 1024 / 1024, 2) AS data_mb,
    ROUND(index_length / 1024 / 1024, 2) AS index_mb
FROM information_schema.tables
WHERE table_schema = 'hospital_booking'
ORDER BY data_length DESC;
```

### Health Checks

**Create monitoring script:** `/opt/hospital-booking/scripts/health-check.sh`

```bash
#!/bin/bash

# Check MySQL service
systemctl is-active mysql || echo "MySQL is down!"

# Check application service
systemctl is-active hospital-booking || echo "Application is down!"

# Check database connectivity
mysql -u hospital_app -p$DB_PASSWORD -e "SELECT 1" > /dev/null 2>&1 || echo "Database connection failed!"

# Check disk space
df -h | grep '/var/lib/mysql' | awk '{if ($5+0 > 80) print "Disk usage high: " $5}'
```

**Schedule health checks:**

```bash
# Run every 5 minutes
*/5 * * * * /opt/hospital-booking/scripts/health-check.sh >> /var/log/hospital-booking/health.log
```

---

## Troubleshooting

### Issue 1: Cannot Connect to Database

**Error:** `Communications link failure`

**Solutions:**

1. Check MySQL is running:
```bash
sudo systemctl status mysql
```

2. Verify port is open:
```bash
netstat -tuln | grep 3306
```

3. Check firewall:
```bash
sudo ufw status
```

4. Test connection:
```bash
mysql -u hospital_app -p -h localhost hospital_booking
```

### Issue 2: Access Denied for User

**Error:** `Access denied for user 'hospital_app'@'localhost'`

**Solutions:**

1. Verify user exists:
```sql
SELECT user, host FROM mysql.user WHERE user = 'hospital_app';
```

2. Check grants:
```sql
SHOW GRANTS FOR 'hospital_app'@'localhost';
```

3. Reset password:
```sql
ALTER USER 'hospital_app'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Issue 3: Table Doesn't Exist

**Error:** `Table 'hospital_booking.users' doesn't exist`

**Solutions:**

1. Verify database selected:
```sql
SELECT DATABASE();
```

2. List tables:
```sql
SHOW TABLES;
```

3. Re-run schema.sql:
```bash
mysql -u hospital_app -p hospital_booking < database/schema.sql
```

### Issue 4: Slow Queries

**Solutions:**

1. Check slow query log
2. Add missing indexes:
```sql
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
```

3. Optimize tables:
```sql
OPTIMIZE TABLE appointments;
```

### Issue 5: Disk Space Full

**Solutions:**

1. Check disk usage:
```bash
df -h
```

2. Clear old binary logs:
```sql
PURGE BINARY LOGS BEFORE DATE_SUB(NOW(), INTERVAL 7 DAY);
```

3. Delete old backups:
```bash
find /var/backups/hospital-booking -mtime +30 -delete
```

---

## Production Checklist

Before deploying to production, verify:

- [ ] MySQL 8.0+ installed and secured
- [ ] Database `hospital_booking` created
- [ ] Application user `hospital_app` created with limited privileges
- [ ] Schema.sql executed successfully
- [ ] All environment variables set securely
- [ ] SSL/TLS enabled for database connections
- [ ] Firewall configured to restrict database access
- [ ] Strong passwords used for all accounts
- [ ] Automated backups scheduled
- [ ] Monitoring and alerts configured
- [ ] `spring.jpa.hibernate.ddl-auto` set to `validate` (NOT create-drop)
- [ ] SQL logging disabled (`spring.jpa.show-sql=false`)
- [ ] Application running with production profile (`-Dspring.profiles.active=prod`)
- [ ] Health check endpoint accessible
- [ ] Error messages don't expose sensitive information
- [ ] Database performance optimized (indexes, query analysis)
- [ ] Disaster recovery plan documented

---

## Summary

**MySQL Production Setup Complete** ✅

You now have:
- MySQL 8.0+ database configured for production
- Secure database user with limited privileges
- Complete database schema with tables, views, procedures, triggers
- Production application configuration
- Automated backup strategy
- Monitoring and maintenance procedures
- Troubleshooting guide

**Configuration Files:**
- Production config: [application-prod.properties](../../backend/src/main/resources/application-prod.properties)
- Database schema: [schema.sql](../../database/schema.sql)
- Sample data: [seed-data.sql](../../database/seed-data.sql)

**Next Steps:**
- Deploy application to production server
- Configure SSL certificates
- Set up monitoring dashboards
- Test disaster recovery procedures

---

**Production-Ready!** 🚀

For development setup with H2, see [H2-DATABASE-SETUP.md](H2-DATABASE-SETUP.md).
