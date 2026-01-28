import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiUserPlus,
  FiCalendar,
  FiActivity,
  FiFileText,
  FiGrid,
  FiArrowRight,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiUser,
  FiPhone,
  FiMail,
  FiLayers,
  FiBarChart2,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, Alert, LoadingSpinner } from '../components/ui';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Data states
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [statsRes, appointmentsRes, doctorsRes] = await Promise.all([
        api.get('/appointments/admin/stats'),
        api.get('/appointments/admin/upcoming'),
        api.get('/doctors'),
      ]);

      setStats(statsRes.data);
      setRecentAppointments(appointmentsRes.data?.slice(0, 10) || []);
      setDoctors(doctorsRes.data || []);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      SCHEDULED: 'bg-blue-100 text-blue-700',
      CONFIRMED: 'bg-success-100 text-success-700',
      COMPLETED: 'bg-primary-100 text-primary-700',
      CANCELLED: 'bg-error-100 text-error-700',
      NO_SHOW: 'bg-orange-100 text-orange-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <FiClock className="h-3 w-3" />;
      case 'CONFIRMED':
        return <FiCheckCircle className="h-3 w-3" />;
      case 'COMPLETED':
        return <FiCheckCircle className="h-3 w-3" />;
      case 'CANCELLED':
        return <FiXCircle className="h-3 w-3" />;
      case 'NO_SHOW':
        return <FiAlertCircle className="h-3 w-3" />;
      default:
        return <FiClock className="h-3 w-3" />;
    }
  };

  // Group doctors by department
  const getDoctorsByDepartment = () => {
    const grouped = {};
    doctors.forEach((doctor) => {
      const dept = doctor.departmentName || 'Unassigned';
      if (!grouped[dept]) {
        grouped[dept] = [];
      }
      grouped[dept].push(doctor);
    });
    return grouped;
  };

  const doctorsByDept = getDoctorsByDepartment();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.firstName}. Here's your hospital overview.
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{stats?.totalDoctors || 0}</p>
              <p className="text-blue-100 text-sm mt-1">Doctors on Staff</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiUserPlus className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{stats?.totalPatients || 0}</p>
              <p className="text-primary-100 text-sm mt-1">Registered Patients</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiUsers className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{stats?.todayCount || 0}</p>
              <p className="text-purple-100 text-sm mt-1">Booked for Today</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiCalendar className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{stats?.completedToday || 0}</p>
              <p className="text-success-100 text-sm mt-1">Visits Completed</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiCheckCircle className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* System Statistics Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">At a Glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-200 rounded-lg">
                <FiUsers className="h-5 w-5 text-indigo-700" />
              </div>
              <span className="text-sm font-medium text-indigo-900">All Users</span>
            </div>
            <p className="text-3xl font-bold text-indigo-900">{stats?.totalUsers || 0}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-200 rounded-lg">
                <FiLayers className="h-5 w-5 text-amber-700" />
              </div>
              <span className="text-sm font-medium text-amber-900">Departments</span>
            </div>
            <p className="text-3xl font-bold text-amber-900">{stats?.totalDepartments || 0}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-200 rounded-lg">
                <FiBarChart2 className="h-5 w-5 text-primary-700" />
              </div>
              <span className="text-sm font-medium text-primary-900">This Week</span>
            </div>
            <p className="text-3xl font-bold text-primary-900">{stats?.weekCount || 0}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-rose-200 rounded-lg">
                <FiCalendar className="h-5 w-5 text-rose-700" />
              </div>
              <span className="text-sm font-medium text-rose-900">This Month</span>
            </div>
            <p className="text-3xl font-bold text-rose-900">{stats?.monthCount || 0}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-200 rounded-lg">
                <FiTrendingUp className="h-5 w-5 text-emerald-700" />
              </div>
              <span className="text-sm font-medium text-emerald-900">All Time</span>
            </div>
            <p className="text-3xl font-bold text-emerald-900">{stats?.total || 0}</p>
          </div>
        </div>
      </Card>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.scheduled || stats?.upcoming || 0}</p>
              <p className="text-sm text-gray-500">Upcoming Bookings</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-error-100 rounded-lg">
              <FiXCircle className="h-5 w-5 text-error-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.cancelled || 0}</p>
              <p className="text-sm text-gray-500">Cancellations</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiAlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.noShow || 0}</p>
              <p className="text-sm text-gray-500">Missed Appointments</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FiTrendingUp className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              <p className="text-sm text-gray-500">All-Time Bookings</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            to="/admin/users"
            className="flex flex-col items-center gap-2 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors group"
          >
            <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">
              <FiUsers className="h-6 w-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Manage Users</span>
          </Link>

          <Link
            to="/admin/doctors"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
          >
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <FiUserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Manage Doctors</span>
          </Link>

          <Link
            to="/admin/patients"
            className="flex flex-col items-center gap-2 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors group"
          >
            <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
              <FiUser className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Manage Patients</span>
          </Link>

          <Link
            to="/admin/appointments"
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
          >
            <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <FiCalendar className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">All Appointments</span>
          </Link>

          <Link
            to="/admin/departments"
            className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors group"
          >
            <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
              <FiActivity className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Departments</span>
          </Link>

          <Link
            to="/admin/analytics"
            className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors group"
          >
            <div className="p-3 bg-rose-100 rounded-xl group-hover:bg-rose-200 transition-colors">
              <FiBarChart2 className="h-6 w-6 text-rose-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <Link
              to="/admin/appointments"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View All <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FiCalendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Doctor</th>
                    <th className="pb-3 font-medium">Date & Time</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiUser className="h-4 w-4 text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {appointment.patientName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-gray-600">Dr. {appointment.doctorName}</span>
                      </td>
                      <td className="py-3">
                        <div className="text-sm">
                          <p className="text-gray-900">{formatDate(appointment.appointmentDate)}</p>
                          <p className="text-gray-500">{formatTime(appointment.appointmentTime)}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            appointment.status
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Doctors by Department */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Doctors Overview</h2>
            <Link
              to="/admin/doctors"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View All <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {Object.entries(doctorsByDept).slice(0, 5).map(([dept, deptDoctors]) => (
              <div key={dept} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 text-sm">{dept}</span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {deptDoctors.length} doctor{deptDoctors.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {deptDoctors.slice(0, 3).map((doctor) => (
                    <span
                      key={doctor.id}
                      className="text-xs text-gray-600 bg-white px-2 py-1 rounded-lg"
                    >
                      Dr. {doctor.lastName}
                    </span>
                  ))}
                  {deptDoctors.length > 3 && (
                    <span className="text-xs text-primary-600 px-2 py-1">
                      +{deptDoctors.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}

            {Object.keys(doctorsByDept).length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No doctors found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Appointment Status Breakdown */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiClock className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.scheduled || stats?.upcoming || 0}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>

          <div className="text-center p-4 bg-success-50 rounded-xl">
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiCheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.completed || 0}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>

          <div className="text-center p-4 bg-error-50 rounded-xl">
            <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiXCircle className="h-6 w-6 text-error-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.cancelled || 0}</p>
            <p className="text-sm text-gray-500">Cancelled</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiAlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.noShow || 0}</p>
            <p className="text-sm text-gray-500">Missed</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FiCalendar className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.todayCount || 0}</p>
            <p className="text-sm text-gray-500">Today</p>
          </div>
        </div>
      </Card>

      {/* System Info Card */}
      <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Hospital Management System</h3>
            <p className="text-gray-300 text-sm mb-4">
              Monitor and manage all hospital operations from this central dashboard.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">System Online</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{stats?.totalUsers || 0} Total Users</span>
              </div>
              <div className="flex items-center gap-2">
                <FiLayers className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{stats?.totalDepartments || 0} Departments</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUserPlus className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{stats?.totalDoctors || 0} Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{stats?.total || 0} Total Appointments</span>
              </div>
            </div>
          </div>
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm"
          >
            <FiFileText className="h-4 w-4" />
            View Reports
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
