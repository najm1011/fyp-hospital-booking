import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { MainLayout, AuthLayout } from "./components/layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import TodayAppointments from "./pages/TodayAppointments";
import UpcomingAppointments from "./pages/UpcomingAppointments";
import AvailabilitySettings from "./pages/AvailabilitySettings";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import Analytics from "./pages/Analytics";
import BookAppointment from "./pages/BookAppointment";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import MyAppointments from "./pages/MyAppointments";
import MedicalHistory from "./pages/MedicalHistory";
import Hospitals from "./pages/Hospitals";
import HospitalDetail from "./pages/HospitalDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

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
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:hospitalId" element={<HospitalDetail />} />

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
          path="/appointments/book"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors/:doctorId"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <DoctorDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medical-history"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <MedicalHistory />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments/today"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <TodayAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments/upcoming"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <UpcomingAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/availability"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <AvailabilitySettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard /> {/* Replace with ManageDepartments later */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard /> {/* Replace with AllAppointments later */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
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
              <Settings />
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
