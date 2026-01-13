# Vite Frontend Configuration Guide

> **Project:** Hospital Appointment Booking System
> **Student:** Najm (2356070)
> **Frontend:** React 19 + Vite 5 + Tailwind CSS
> **Date:** January 13, 2026

---

## Overview

The frontend has been configured with **Vite** for blazing-fast development and optimized production builds.

### Why Vite?

✅ **10x faster** than Create React App
✅ **Instant Hot Module Replacement (HMR)** - changes reflect immediately
✅ **Faster builds** - optimized production bundles
✅ **Native ES modules** - modern JavaScript features
✅ **Better developer experience** - instant server start

---

## Configuration Files Created

| File | Purpose |
|------|---------|
| [vite.config.js](../../frontend/vite.config.js) | Main Vite configuration |
| [package.json](../../frontend/package.json) | Updated with Vite scripts |
| [index.html](../../frontend/index.html) | Entry HTML file (moved to root) |
| [.eslintrc.cjs](../../frontend/.eslintrc.cjs) | ESLint configuration |
| [.env](../../frontend/.env) | Environment variables (development) |
| [.env.example](../../frontend/.env.example) | Environment variables template |

---

## Installation

### Step 1: Remove Old Dependencies

```bash
cd /Users/najm/Desktop/hospital-booking-system/frontend

# Remove node_modules and lock files
rm -rf node_modules package-lock.json
```

### Step 2: Install New Dependencies

```bash
# Install all dependencies
npm install
```

**This will install:**
- Vite 5.2.0
- React 19.2.3
- React Router 7.11.0
- Tailwind CSS 3.4.19
- Axios 1.13.2
- All required plugins and dev dependencies

---

## Running the Frontend

### Development Mode

```bash
cd frontend

# Start development server
npm run dev
```

**Output:**
```
VITE v5.2.0  ready in 234 ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.x:3000/
➜  press h to show help
```

**Frontend will open automatically at:** http://localhost:3000

### Features:
- ⚡ Instant server start
- 🔥 Hot Module Replacement (HMR)
- 🎯 Proxy to backend API automatically
- 📱 Network access for mobile testing

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests with Vitest |
| `npm run lint` | Run ESLint |

---

## Vite Configuration Details

### Server Configuration

**File:** `vite.config.js`

```javascript
server: {
  port: 3000,              // Development port
  open: true,              // Auto-open browser
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // Backend URL
      changeOrigin: true,
      secure: false
    }
  }
}
```

**What this does:**
- Runs on port 3000
- Opens browser automatically
- **Proxies all `/api` requests to backend** (no CORS issues!)

### Path Aliases

Import from anywhere without `../../`:

```javascript
// Before
import Button from '../../components/common/Button'

// After (with alias)
import Button from '@components/common/Button'
```

**Available aliases:**
- `@` → `src/`
- `@components` → `src/components/`
- `@pages` → `src/pages/`
- `@services` → `src/services/`
- `@utils` → `src/utils/`
- `@hooks` → `src/hooks/`
- `@context` → `src/context/`
- `@assets` → `src/assets/`

### Build Configuration

```javascript
build: {
  outDir: 'build',        // Output directory
  sourcemap: true,        // Generate source maps
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        axios: ['axios']
      }
    }
  }
}
```

**What this does:**
- Builds to `build/` folder (compatible with existing setup)
- Splits code into chunks for better caching
- Generates source maps for debugging

---

## Environment Variables

### Development (.env)

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Hospital Booking System
VITE_APP_ENV=development
VITE_ENABLE_DEBUG=true
```

### Production (.env.production)

Create this file for production builds:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_APP_NAME=Hospital Booking System
VITE_APP_ENV=production
VITE_ENABLE_DEBUG=false
```

### Using Environment Variables in Code

```javascript
// Import env variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const APP_NAME = import.meta.env.VITE_APP_NAME

// Example usage
axios.get(`${API_BASE_URL}/departments`)
```

**Important:** All env variables must be prefixed with `VITE_`

---

## API Proxy Setup

### How it Works

**Without Proxy (CORS Issues):**
```javascript
// Frontend (localhost:3000) → Backend (localhost:8080) ❌ CORS error
axios.get('http://localhost:8080/api/v1/departments')
```

**With Proxy (No CORS Issues):**
```javascript
// Frontend makes request to itself, Vite proxies to backend ✅
axios.get('/api/v1/departments')
// Vite automatically forwards to http://localhost:8080/api/v1/departments
```

### Configuration

Already configured in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false
  }
}
```

**Usage in your code:**

```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',  // Just use /api - Vite handles the rest
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
```

---

## File Structure

```
frontend/
├── index.html                  ← Entry HTML (Vite requires at root)
├── vite.config.js              ← Vite configuration
├── package.json                ← Dependencies and scripts
├── .eslintrc.cjs               ← ESLint config
├── .env                        ← Environment variables (dev)
├── .env.example                ← Env template
├── tailwind.config.js          ← Tailwind CSS config
├── postcss.config.js           ← PostCSS config
├── public/                     ← Static assets
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src/
    ├── index.jsx               ← App entry point
    ├── index.css               ← Global styles + Tailwind
    ├── App.jsx                 ← Main App component
    ├── App.css                 ← App styles
    ├── components/             ← Reusable components
    ├── pages/                  ← Page components
    ├── services/               ← API services
    ├── utils/                  ← Utility functions
    ├── hooks/                  ← Custom React hooks
    ├── context/                ← React Context providers
    └── assets/                 ← Images, fonts, etc.
```

---

## Building for Production

### Step 1: Create Production Env File

```bash
cd frontend
cp .env.example .env.production
nano .env.production
```

Update with production API URL:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_APP_ENV=production
```

### Step 2: Build

```bash
npm run build
```

**Output:**
```
vite v5.2.0 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB
dist/assets/index-abc123.css      4.23 kB
dist/assets/index-xyz789.js     143.21 kB
✓ built in 3.45s
```

**Production files in:** `build/`

### Step 3: Preview Production Build

```bash
npm run preview
```

Opens production build at: http://localhost:4173

### Step 4: Deploy

Upload `build/` folder contents to your web server.

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/hospital-booking/frontend;
    index index.html;

    # Frontend routing (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Running Frontend + Backend Together

### Terminal 1: Backend

```bash
cd /Users/najm/Desktop/hospital-booking-system/backend
./mvnw spring-boot:run
```

**Wait for:**
```
Started HospitalBookingApiApplication in 5.123 seconds
Tomcat started on port(s): 8080 (http)
```

### Terminal 2: Frontend

```bash
cd /Users/najm/Desktop/hospital-booking-system/frontend
npm run dev
```

**Wait for:**
```
➜  Local:   http://localhost:3000/
```

### Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api/v1
- **H2 Console:** http://localhost:8080/h2-console

---

## Testing

### Run Tests

```bash
npm run test
```

**Vitest configuration** in `vite.config.js`:

```javascript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.js',
  css: true
}
```

### Example Test

```javascript
// src/components/Button.test.jsx
import { render, screen } from '@testing-library/react'
import Button from '@components/Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

---

## Troubleshooting

### Issue 1: Port 3000 Already in Use

**Solution:**

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or Vite will ask to use different port
# Choose Y to use port 3001
```

### Issue 2: Cannot Find Module '@components/...'

**Solution:**

```bash
# Restart Vite dev server
npm run dev
```

Path aliases require server restart after config changes.

### Issue 3: API Requests Failing

**Check:**

1. Backend is running on port 8080
2. Proxy is configured in `vite.config.js`
3. Using `/api/v1/...` not full URL

**Example:**

```javascript
// ❌ Wrong
axios.get('http://localhost:8080/api/v1/departments')

// ✅ Correct
axios.get('/api/v1/departments')
```

### Issue 4: Environment Variables Not Working

**Check:**

1. Variables prefixed with `VITE_`
2. `.env` file exists
3. Server restarted after changing .env

```javascript
// ❌ Wrong
const url = import.meta.env.API_BASE_URL

// ✅ Correct
const url = import.meta.env.VITE_API_BASE_URL
```

### Issue 5: Build Fails

**Solution:**

```bash
# Clear cache and rebuild
rm -rf node_modules build dist
npm install
npm run build
```

---

## Performance Comparison

### Create React App vs Vite

| Metric | Create React App | Vite | Improvement |
|--------|------------------|------|-------------|
| **Cold Start** | 15-20 seconds | 1-2 seconds | **10x faster** |
| **Hot Reload** | 2-3 seconds | 50-200 ms | **15x faster** |
| **Production Build** | 40-60 seconds | 10-15 seconds | **4x faster** |
| **Bundle Size** | Larger | Optimized | **Smaller** |

---

## Migration Notes

### What Changed

✅ **Removed:**
- `react-scripts` package
- `public/index.html` (moved to root)
- `%PUBLIC_URL%` placeholders

✅ **Added:**
- Vite and plugins
- `vite.config.js`
- ESLint configuration
- Path aliases
- Vitest for testing

✅ **Updated:**
- `package.json` scripts
- `index.html` (Vite format)
- Import paths (can use aliases)

### Code Changes Required

**Environment Variables:**

```javascript
// Before (CRA)
process.env.REACT_APP_API_URL

// After (Vite)
import.meta.env.VITE_API_URL
```

**Public Assets:**

```javascript
// Before
<img src={process.env.PUBLIC_URL + '/logo.png'} />

// After
<img src="/logo.png" />
```

---

## Best Practices

### 1. Use Path Aliases

```javascript
// ❌ Avoid
import Button from '../../../components/common/Button'

// ✅ Better
import Button from '@components/common/Button'
```

### 2. Environment Variables

```javascript
// ❌ Don't hardcode
const API_URL = 'http://localhost:8080/api/v1'

// ✅ Use env variables
const API_URL = import.meta.env.VITE_API_BASE_URL
```

### 3. API Calls

```javascript
// ❌ Don't use full URLs in development
axios.get('http://localhost:8080/api/v1/departments')

// ✅ Use relative paths (proxy handles it)
axios.get('/api/v1/departments')
```

### 4. Code Splitting

```javascript
// Lazy load pages for better performance
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Profile = lazy(() => import('@pages/Profile'))
```

---

## Summary

✅ **Vite Configured Successfully**

**Key Features:**
- ⚡ Lightning-fast development server
- 🔥 Instant Hot Module Replacement
- 📦 Optimized production builds
- 🎯 API proxy (no CORS issues)
- 🔧 Path aliases for clean imports
- 🧪 Vitest for testing
- 🎨 Tailwind CSS integrated

**Commands:**
- Development: `npm run dev`
- Production Build: `npm run build`
- Preview: `npm run preview`
- Test: `npm run test`

**Ready to develop!** 🚀

---

**Next Steps:**
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development
3. Start building your React components

**Documentation:**
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
