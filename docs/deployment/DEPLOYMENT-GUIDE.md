# Production Deployment Guide

> **Project:** Hospital Appointment Booking System
> **Student:** Najm (2356070)
> **Last Updated:** January 12, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Environment Setup](#environment-setup)
5. [Database Deployment](#database-deployment)
6. [Backend Deployment](#backend-deployment)
7. [Frontend Deployment](#frontend-deployment)
8. [SSL/TLS Configuration](#ssltls-configuration)
9. [Post-Deployment Tasks](#post-deployment-tasks)
10. [Monitoring Setup](#monitoring-setup)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers complete production deployment of the Hospital Booking System, including database setup, backend API deployment, and frontend hosting.

### Architecture Overview

```
┌─────────────────┐
│   Load Balancer │ (Nginx/Cloudflare)
│   SSL/TLS       │
└────────┬────────┘
         │
         ├─────────────────┬──────────────────┐
         │                 │                  │
    ┌────▼─────┐     ┌────▼──────┐    ┌─────▼──────┐
    │ Frontend │     │  Backend  │    │   MySQL    │
    │  (React) │     │ (Spring)  │    │  Database  │
    │  Static  │     │    API    │    │            │
    └──────────┘     └───────────┘    └────────────┘
```

---

## Prerequisites

### Server Requirements

**Backend Server:**
- **OS:** Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2
- **CPU:** 2+ cores
- **RAM:** 4GB minimum, 8GB recommended
- **Disk:** 20GB minimum
- **Java:** OpenJDK 17
- **MySQL:** 8.0+

**Frontend Server (can be same as backend):**
- **Nginx:** Latest stable version
- **Node.js:** 18+ (for build process)

### Domain and SSL

- Registered domain name (e.g., hospital-booking.com)
- DNS configured to point to your server
- SSL certificate (Let's Encrypt recommended)

### Required Access

- SSH access to servers
- Root or sudo privileges
- Database credentials
- SMTP credentials for email

---

## Pre-Deployment Checklist

### Code Preparation

- [ ] All code tested in development environment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Security vulnerabilities scanned
- [ ] Dependencies updated to stable versions
- [ ] Documentation complete

### Configuration Files

- [ ] `application-prod.properties` configured
- [ ] `.env.example` created with all variables
- [ ] Environment variables documented
- [ ] Sensitive data removed from codebase
- [ ] `.gitignore` updated

### Security

- [ ] Strong passwords generated for all accounts
- [ ] JWT secret generated (256 bits minimum)
- [ ] Database user with limited privileges created
- [ ] SSL certificates obtained
- [ ] CORS origins configured for production domain
- [ ] Rate limiting configured

### Database

- [ ] MySQL installed and secured
- [ ] Database schema tested
- [ ] Backup strategy planned
- [ ] Migration scripts ready (if applicable)
- [ ] Initial admin user credentials prepared

---

## Environment Setup

### Step 1: Update System

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### Step 2: Install Java 17

```bash
# Ubuntu/Debian
sudo apt install openjdk-17-jdk -y

# CentOS/RHEL
sudo yum install java-17-openjdk -y

# Verify installation
java -version
```

### Step 3: Install MySQL 8.0

See [docs/database/MYSQL-PRODUCTION-SETUP.md](../database/MYSQL-PRODUCTION-SETUP.md) for detailed instructions.

```bash
# Ubuntu/Debian
sudo apt install mysql-server -y

# Secure installation
sudo mysql_secure_installation
```

### Step 4: Install Nginx

```bash
# Ubuntu/Debian
sudo apt install nginx -y

# Start and enable
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 5: Install Certbot (for SSL)

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y
```

---

## Database Deployment

### Step 1: Create Database

```bash
# Login to MySQL
sudo mysql -u root -p
```

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

-- Flush privileges
FLUSH PRIVILEGES;

EXIT;
```

### Step 2: Deploy Database Schema

```bash
# Navigate to project directory
cd /opt/hospital-booking-system

# Run schema script
mysql -u hospital_app -p hospital_booking < database/schema.sql
```

### Step 3: Verify Database

```bash
mysql -u hospital_app -p hospital_booking
```

```sql
SHOW TABLES;
SELECT COUNT(*) FROM departments;
SELECT * FROM users WHERE role = 'ADMIN';
EXIT;
```

### Step 4: Configure Automated Backups

```bash
# Create backup directory
sudo mkdir -p /var/backups/hospital-booking

# Create backup script
sudo nano /opt/hospital-booking/scripts/backup.sh
```

Paste the backup script from [docs/database/MYSQL-PRODUCTION-SETUP.md](../database/MYSQL-PRODUCTION-SETUP.md).

```bash
# Make executable
sudo chmod +x /opt/hospital-booking/scripts/backup.sh

# Test backup
sudo /opt/hospital-booking/scripts/backup.sh

# Schedule with cron (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /opt/hospital-booking/scripts/backup.sh >> /var/log/hospital-booking/backup.log 2>&1
```

---

## Backend Deployment

### Step 1: Create Deployment Directory

```bash
# Create application directory
sudo mkdir -p /opt/hospital-booking
sudo mkdir -p /etc/hospital-booking
sudo mkdir -p /var/log/hospital-booking
sudo mkdir -p /var/www/hospital-booking/uploads

# Create service user
sudo useradd -r -s /bin/false hospital

# Set permissions
sudo chown -R hospital:hospital /opt/hospital-booking
sudo chown -R hospital:hospital /var/log/hospital-booking
sudo chown -R hospital:hospital /var/www/hospital-booking
```

### Step 2: Build Application

```bash
# On your development machine
cd /path/to/hospital-booking-system/backend

# Build production JAR
./mvnw clean package -DskipTests

# JAR file will be in: target/backend-0.0.1-SNAPSHOT.jar
```

### Step 3: Upload JAR to Server

```bash
# From development machine
scp target/backend-0.0.1-SNAPSHOT.jar user@your-server:/tmp/

# On server, move to deployment directory
sudo mv /tmp/backend-0.0.1-SNAPSHOT.jar /opt/hospital-booking/backend.jar
sudo chown hospital:hospital /opt/hospital-booking/backend.jar
```

### Step 4: Configure Environment Variables

```bash
# Create environment file
sudo nano /etc/hospital-booking/application.env
```

Paste environment variables:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=hospital_booking
export DB_USERNAME=hospital_app
export DB_PASSWORD=your_secure_password

export JWT_SECRET=your_256_bit_secret_key_here
export JWT_EXPIRATION=86400000

export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USERNAME=noreply@yourdomain.com
export SMTP_PASSWORD=your_smtp_password
export EMAIL_FROM=noreply@yourdomain.com

export CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
export UPLOAD_DIR=/var/www/hospital-booking/uploads/
```

```bash
# Secure the file
sudo chmod 600 /etc/hospital-booking/application.env
sudo chown hospital:hospital /etc/hospital-booking/application.env
```

### Step 5: Create Systemd Service

```bash
sudo nano /etc/systemd/system/hospital-booking.service
```

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
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod -Xmx1024m -Xms512m /opt/hospital-booking/backend.jar
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/hospital-booking/application.log
StandardError=append:/var/log/hospital-booking/error.log

[Install]
WantedBy=multi-user.target
```

### Step 6: Start Backend Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable hospital-booking

# Start service
sudo systemctl start hospital-booking

# Check status
sudo systemctl status hospital-booking

# View logs
sudo tail -f /var/log/hospital-booking/application.log
```

### Step 7: Verify Backend is Running

```bash
# Check if service is listening on port 8080
sudo netstat -tuln | grep 8080

# Test API endpoint
curl http://localhost:8080/api/v1/departments
```

Expected response: JSON with departments list.

---

## Frontend Deployment

### Step 1: Build Frontend

```bash
# On development machine
cd /path/to/hospital-booking-system/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Build output will be in: build/
```

### Step 2: Upload Frontend Files

```bash
# Create frontend directory on server
sudo mkdir -p /var/www/hospital-booking/frontend

# Upload build files
scp -r build/* user@your-server:/tmp/frontend/

# On server, move to web directory
sudo mv /tmp/frontend/* /var/www/hospital-booking/frontend/
sudo chown -R www-data:www-data /var/www/hospital-booking/frontend
```

### Step 3: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/hospital-booking
```

```nginx
# HTTP server (redirect to HTTPS)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend static files
    root /var/www/hospital-booking/frontend;
    index index.html;

    # Frontend routing (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    location /uploads/ {
        alias /var/www/hospital-booking/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

### Step 4: Enable Site and Restart Nginx

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hospital-booking /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## SSL/TLS Configuration

### Step 1: Obtain SSL Certificate (Let's Encrypt)

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Start Nginx
sudo systemctl start nginx
```

Follow prompts:
- Enter email address
- Agree to terms of service
- Choose whether to share email with EFF

### Step 2: Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job for renewal
# Verify cron job exists
sudo systemctl list-timers | grep certbot
```

### Step 3: Update Nginx Configuration

Certbot automatically updates Nginx configuration with SSL paths. If not, manually update `/etc/nginx/sites-available/hospital-booking` with certificate paths.

---

## Post-Deployment Tasks

### Step 1: Change Default Passwords

```bash
# Login to application
# Navigate to: https://yourdomain.com

# Login with admin account:
# Email: admin@hospital-booking.com
# Password: Admin123!

# IMMEDIATELY change password to strong password
```

### Step 2: Verify All Endpoints

Test critical endpoints:

```bash
# Health check
curl https://yourdomain.com/api/v1/departments

# Auth endpoint
curl -X POST https://yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital-booking.com","password":"NewPassword123!"}'
```

### Step 3: Configure Firewall

```bash
# Ubuntu UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Block direct access to backend port
sudo ufw deny 8080
```

### Step 4: Set Up Log Rotation

```bash
sudo nano /etc/logrotate.d/hospital-booking
```

```
/var/log/hospital-booking/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 hospital hospital
    sharedscripts
    postrotate
        systemctl reload hospital-booking > /dev/null 2>&1 || true
    endscript
}
```

---

## Monitoring Setup

### Application Monitoring

```bash
# Check application status
sudo systemctl status hospital-booking

# View real-time logs
sudo journalctl -u hospital-booking -f

# Check error logs
sudo tail -f /var/log/hospital-booking/error.log
```

### Database Monitoring

```sql
-- Check active connections
SHOW PROCESSLIST;

-- Check table sizes
SELECT
    table_name,
    ROUND(data_length / 1024 / 1024, 2) AS data_mb,
    ROUND(index_length / 1024 / 1024, 2) AS index_mb
FROM information_schema.tables
WHERE table_schema = 'hospital_booking';

-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

### Server Monitoring

```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top

# Network connections
netstat -tuln
```

---

## Troubleshooting

### Issue: Backend Not Starting

**Check logs:**

```bash
sudo journalctl -u hospital-booking -n 100 --no-pager
```

**Common causes:**
- Database connection failed (check credentials)
- Port 8080 already in use
- Missing environment variables
- Java version mismatch

**Solutions:**

```bash
# Check database connectivity
mysql -u hospital_app -p hospital_booking -e "SELECT 1"

# Check if port is in use
sudo lsof -i :8080

# Verify environment variables loaded
sudo systemctl show hospital-booking | grep Environment
```

### Issue: Frontend Not Loading

**Check Nginx logs:**

```bash
sudo tail -f /var/log/nginx/error.log
```

**Common causes:**
- Nginx configuration syntax error
- SSL certificate issues
- Incorrect file permissions

**Solutions:**

```bash
# Test Nginx config
sudo nginx -t

# Check file permissions
ls -la /var/www/hospital-booking/frontend/

# Reload Nginx
sudo systemctl reload nginx
```

### Issue: 502 Bad Gateway

**Cause:** Backend not responding

**Solutions:**

```bash
# Check backend is running
sudo systemctl status hospital-booking

# Restart backend
sudo systemctl restart hospital-booking

# Check backend port
curl http://localhost:8080/api/v1/departments
```

### Issue: CORS Errors

**Cause:** CORS_ALLOWED_ORIGINS not set correctly

**Solution:**

```bash
# Update environment file
sudo nano /etc/hospital-booking/application.env

# Ensure CORS_ALLOWED_ORIGINS matches your domain
export CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Restart backend
sudo systemctl restart hospital-booking
```

---

## Production Checklist

Before going live, verify:

**Security:**
- [ ] All default passwords changed
- [ ] SSL/TLS certificates installed and working
- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] Database user has limited privileges
- [ ] Environment variables secured (chmod 600)
- [ ] JWT secret is strong and unique
- [ ] CORS configured for production domain only
- [ ] SQL injection protection tested
- [ ] XSS protection enabled

**Performance:**
- [ ] Database indexes created
- [ ] Connection pooling configured (HikariCP)
- [ ] Gzip compression enabled
- [ ] Static assets have cache headers
- [ ] Images optimized
- [ ] CDN configured (if applicable)

**Reliability:**
- [ ] Automated backups scheduled
- [ ] Backup restoration tested
- [ ] Service configured to restart on failure
- [ ] Log rotation configured
- [ ] Monitoring and alerting set up
- [ ] Health check endpoints working

**Compliance:**
- [ ] Error messages don't expose sensitive data
- [ ] Logs don't contain passwords or tokens
- [ ] User data encrypted in transit (HTTPS)
- [ ] Privacy policy in place
- [ ] Terms of service in place

---

## Rollback Procedure

If deployment fails:

### Backend Rollback

```bash
# Stop new version
sudo systemctl stop hospital-booking

# Restore previous JAR
sudo cp /opt/hospital-booking/backend.jar.backup /opt/hospital-booking/backend.jar

# Start service
sudo systemctl start hospital-booking
```

### Database Rollback

```bash
# Restore from backup
gunzip /var/backups/hospital-booking/backup_20260112.sql.gz
mysql -u hospital_app -p hospital_booking < /var/backups/hospital-booking/backup_20260112.sql
```

---

## Summary

**Deployment Complete!** ✅

You have successfully deployed:
- MySQL database with schema and initial data
- Spring Boot backend API with systemd service
- React frontend with Nginx reverse proxy
- SSL/TLS encryption with Let's Encrypt
- Automated backups and monitoring

**Access Points:**
- **Frontend:** https://yourdomain.com
- **API:** https://yourdomain.com/api/v1
- **Admin Login:** admin@hospital-booking.com

**Next Steps:**
- Monitor application logs
- Test all user workflows
- Set up monitoring dashboard
- Configure email alerts
- Train users

---

**Production Deployment Guide Complete!** 🚀
