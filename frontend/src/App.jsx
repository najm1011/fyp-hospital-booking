import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { MainLayout, AuthLayout } from './components/layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Auth Routes - No layout (login/register have their own design) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Protected Routes - Any authenticated user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Patient Routes */}
        <Route
          path="/appointments/*"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <Dashboard /> {/* Replace with Appointments component later */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <Dashboard /> {/* Replace with Doctors list later */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/medical-history"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <Dashboard /> {/* Replace with Medical History later */}
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <Dashboard /> {/* Replace with Doctor components later */}
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Dashboard /> {/* Replace with Admin components later */}
            </ProtectedRoute>
          }
        />

        {/* Common Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Dashboard /> {/* Replace with Profile component later */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Dashboard /> {/* Replace with Settings component later */}
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
