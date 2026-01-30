import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiRefreshCw,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiFileText,
  FiXCircle,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatsCard, Card, EmptyState, Button, Alert, LoadingSpinner } from '../components/ui';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Data states
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [activeTab, setActiveTab] = useState('today'); // today, upcoming, all
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination for upcoming
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Action loading states
  const [actionLoading, setActionLoading] = useState({});

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, todayRes, upcomingRes] = await Promise.all([
        api.get('/appointments/doctor/stats'),
        api.get('/appointments/doctor/appointments/today'),
        api.get('/appointments/doctor/appointments/upcoming'),
      ]);

      setStats({
        todayCount: statsRes.data.todayCount || 0,
        completedTodayCount: statsRes.data.completedTodayCount || 0,
        pendingCount: statsRes.data.pendingCount || 0,
        uniquePatientsCount: statsRes.data.uniquePatientsCount || 0,
        weekCount: statsRes.data.weekCount || 0,
        monthCount: statsRes.data.monthCount || 0,
      });
      setTodayAppointments(todayRes.data || []);
      setUpcomingAppointments(upcomingRes.data || []);
    } catch (err) {
      console.error('Error fetching doctor dashboard:', err);
      const message = getErrorMessage(err, 'Unable to load your dashboard. Please refresh the page.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
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
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const badges = {
      SCHEDULED: 'bg-blue-100 text-blue-700',
      CONFIRMED: 'bg-success-100 text-success-700',
      COMPLETED: 'bg-gray-100 text-gray-700',
      CANCELLED: 'bg-error-100 text-error-700',
      NO_SHOW: 'bg-orange-100 text-orange-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  // Handle mark as completed
  const handleMarkCompleted = async (appointmentId) => {
    setActionLoading((prev) => ({ ...prev, [appointmentId]: 'complete' }));
    try {
      await api.put(`/appointments/doctor/${appointmentId}/complete`, {
        notes: '',
      });
      toast.success('Appointment marked as completed');
      fetchDashboardData();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to mark this appointment as completed. Please try again.'));
    } finally {
      setActionLoading((prev) => ({ ...prev, [appointmentId]: null }));
    }
  };

  // Handle mark as no-show
  const handleMarkNoShow = async (appointmentId) => {
    setActionLoading((prev) => ({ ...prev, [appointmentId]: 'noshow' }));
    try {
      await api.put(`/appointments/doctor/${appointmentId}/no-show`);
      toast.success('Appointment marked as no-show');
      fetchDashboardData();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to record no-show. Please try again.'));
    } finally {
      setActionLoading((prev) => ({ ...prev, [appointmentId]: null }));
    }
  };

  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    setActionLoading((prev) => ({ ...prev, [appointmentId]: 'cancel' }));
    try {
      await api.put(`/appointments/doctor/${appointmentId}/cancel`, {
        reason: 'Cancelled by doctor',
      });
      toast.success('Appointment cancelled');
      fetchDashboardData();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to cancel this appointment. Please try again.'));
    } finally {
      setActionLoading((prev) => ({ ...prev, [appointmentId]: null }));
    }
  };

  // Filter appointments by status
  const filterByStatus = (appointments) => {
    if (statusFilter === 'all') return appointments;
    return appointments.filter((apt) => apt.status === statusFilter);
  };

  // Get current appointments based on tab
  const getCurrentAppointments = () => {
    switch (activeTab) {
      case 'today':
        return filterByStatus(todayAppointments);
      case 'upcoming':
        return filterByStatus(upcomingAppointments);
      default:
        return filterByStatus([...todayAppointments, ...upcomingAppointments]);
    }
  };

  const currentAppointments = getCurrentAppointments();
  const totalPages = Math.ceil(currentAppointments.length / itemsPerPage);
  const paginatedAppointments = currentAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, statusFilter]);

  // Render appointment card
  const renderAppointmentCard = (appointment) => {
    const isLoading = actionLoading[appointment.id];
    const canTakeAction = appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED';

    return (
      <div
        key={appointment.id}
        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <FiUser className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
              <div className="text-sm text-gray-500 space-y-1 mt-1">
                <div className="flex items-center">
                  <FiCalendar className="h-3.5 w-3.5 mr-1.5" />
                  {formatDate(appointment.appointmentDate)}
                </div>
                <div className="flex items-center">
                  <FiClock className="h-3.5 w-3.5 mr-1.5" />
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </div>
              </div>
              {appointment.patientNotes && (
                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <FiFileText className="inline h-3.5 w-3.5 mr-1" />
                  {appointment.patientNotes}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                appointment.status
              )}`}
            >
              {appointment.status.replace('_', ' ')}
            </span>

            {canTakeAction && (
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleMarkCompleted(appointment.id)}
                  disabled={isLoading}
                  className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Mark as Completed"
                >
                  {isLoading === 'complete' ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <FiCheckCircle className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => handleMarkNoShow(appointment.id)}
                  disabled={isLoading}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Mark as No-Show"
                >
                  {isLoading === 'noshow' ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <FiAlertCircle className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => handleCancelAppointment(appointment.id)}
                  disabled={isLoading}
                  className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Cancel Appointment"
                >
                  {isLoading === 'cancel' ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <FiXCircle className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome, Dr. {user?.lastName}!
          </h1>
          <p className="text-gray-600 mt-1">Manage your appointments and patients</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" className="mt-4 sm:mt-0">
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={FiCalendar}
          label="Patients Today"
          value={stats?.todayCount || 0}
          color="blue"
        />
        <StatsCard
          icon={FiCheckCircle}
          label="Seen Today"
          value={stats?.completedTodayCount || 0}
          color="green"
        />
        <StatsCard
          icon={FiClock}
          label="Awaiting"
          value={stats?.pendingCount || 0}
          color="yellow"
        />
        <StatsCard
          icon={FiUsers}
          label="Your Patients"
          value={stats?.uniquePatientsCount || 0}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Section */}
        <div className="lg:col-span-2">
          <Card>
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { value: 'today', label: 'Today', count: todayAppointments.length },
                  { value: 'upcoming', label: 'Upcoming', count: upcomingAppointments.length },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.value
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.value
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="NO_SHOW">No Show</option>
                </select>
              </div>
            </div>

            {/* Appointments List */}
            {paginatedAppointments.length > 0 ? (
              <div className="space-y-4">
                {paginatedAppointments.map(renderAppointmentCard)}
              </div>
            ) : (
              <EmptyState
                icon={FiCalendar}
                title={`No ${activeTab} appointments`}
                description={
                  statusFilter !== 'all'
                    ? 'Try changing the status filter.'
                    : activeTab === 'today'
                    ? "You don't have any appointments scheduled for today."
                    : "You don't have any upcoming appointments."
                }
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions & Stats Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Link
                to="/doctor/appointments/today"
                className="flex items-center justify-between p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Today's Appointments</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                to="/doctor/appointments/upcoming"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiClock className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Upcoming Appointments</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                to="/doctor/availability"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiUsers className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Set Availability</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </Card>

          {/* Weekly Summary */}
          <Card title="This Week">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm text-gray-700">Total Appointments</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{stats?.weekCount || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                <div className="flex items-center">
                  <FiCheckCircle className="h-5 w-5 text-success-600 mr-3" />
                  <span className="text-sm text-gray-700">Completed</span>
                </div>
                <span className="text-lg font-bold text-success-600">
                  {stats?.completedTodayCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <FiAlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-sm text-gray-700">Pending</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{stats?.pendingCount || 0}</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity Placeholder */}
          <Card title="Recent Activity">
            <EmptyState
              icon={FiClock}
              title="No recent activity"
              description="Your recent appointment activity will appear here."
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
