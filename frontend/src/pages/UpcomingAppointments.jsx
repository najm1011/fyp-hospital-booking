import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiUser,
  FiPhone,
  FiMail,
  FiFileText,
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, EmptyState, Button, Alert, LoadingSpinner } from '../components/ui';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';

const UpcomingAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Data states
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped', 'table', 'cards'

  // Collapsed date groups
  const [collapsedGroups, setCollapsedGroups] = useState({});

  // Action states
  const [actionLoading, setActionLoading] = useState({});

  // Fetch data on mount
  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const fetchUpcomingAppointments = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await api.get('/appointments/doctor/appointments/upcoming');
      setAppointments(response.data || []);
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err);
      const message = getErrorMessage(err, 'Unable to load upcoming appointments. Please refresh the page.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Format time for display (12-hour format)
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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Format short date for grouping headers
  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  // Get relative date label
  const getRelativeDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString + 'T00:00:00');
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays <= 14) return 'Next week';
    return formatShortDate(dateString);
  };

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      SCHEDULED: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: FiClock,
        label: 'Scheduled',
      },
      CONFIRMED: {
        bg: 'bg-success-100',
        text: 'text-success-700',
        border: 'border-success-200',
        icon: FiCheckCircle,
        label: 'Confirmed',
      },
      COMPLETED: {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-600',
        icon: FiCheckCircle,
        label: 'Completed',
      },
      CANCELLED: {
        bg: 'bg-error-100',
        text: 'text-error-700',
        border: 'border-error-200',
        icon: FiXCircle,
        label: 'Cancelled',
      },
      NO_SHOW: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: FiAlertCircle,
        label: 'No Show',
      },
    };
    return configs[status] || configs.SCHEDULED;
  };

  // Handle mark as completed
  const handleMarkCompleted = async (appointmentId) => {
    setActionLoading((prev) => ({ ...prev, [appointmentId]: 'complete' }));
    try {
      await api.put(`/appointments/doctor/${appointmentId}/complete`, { notes: '' });
      toast.success('Appointment marked as completed');
      fetchUpcomingAppointments(true);
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
      fetchUpcomingAppointments(true);
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
      fetchUpcomingAppointments(true);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to cancel this appointment. Please try again.'));
    } finally {
      setActionLoading((prev) => ({ ...prev, [appointmentId]: null }));
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      searchTerm === '' ||
      apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateCompare = a.appointmentDate.localeCompare(b.appointmentDate);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  // Group appointments by date
  const groupedAppointments = sortedAppointments.reduce((groups, appointment) => {
    const date = appointment.appointmentDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {});

  // Get summary stats
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === 'SCHEDULED').length,
    confirmed: appointments.filter((a) => a.status === 'CONFIRMED').length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
    noShow: appointments.filter((a) => a.status === 'NO_SHOW').length,
    thisWeek: appointments.filter((a) => {
      const date = new Date(a.appointmentDate + 'T00:00:00');
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return date <= weekFromNow;
    }).length,
  };

  // Toggle group collapse
  const toggleGroup = (date) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Check if action can be taken
  const canTakeAction = (status) => {
    return status === 'SCHEDULED' || status === 'CONFIRMED';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading upcoming appointments...</p>
      </div>
    );
  }

  // Render appointment row for table
  const renderTableRow = (appointment) => {
    const statusConfig = getStatusConfig(appointment.status);
    const StatusIcon = statusConfig.icon;
    const isLoading = actionLoading[appointment.id];

    return (
      <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        {/* Date */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <FiCalendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatShortDate(appointment.appointmentDate)}
              </p>
              <p className="text-xs text-primary-600 font-medium">
                {getRelativeDate(appointment.appointmentDate)}
              </p>
            </div>
          </div>
        </td>

        {/* Time */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <FiClock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatTime(appointment.startTime)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                to {formatTime(appointment.endTime)}
              </p>
            </div>
          </div>
        </td>

        {/* Patient */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <FiUser className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {appointment.patientName}
              </p>
              {appointment.patientEmail && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                  {appointment.patientEmail}
                </p>
              )}
            </div>
          </div>
        </td>

        {/* Notes */}
        <td className="px-6 py-4">
          {appointment.patientNotes ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]" title={appointment.patientNotes}>
              {appointment.patientNotes}
            </p>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500 italic">No notes</span>
          )}
        </td>

        {/* Status */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
          >
            <StatusIcon className="h-3.5 w-3.5 mr-1" />
            {statusConfig.label}
          </span>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right">
          {canTakeAction(appointment.status) ? (
            <div className="flex items-center justify-end space-x-2">
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
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
          )}
        </td>
      </tr>
    );
  };

  // Render appointment card
  const renderAppointmentCard = (appointment) => {
    const statusConfig = getStatusConfig(appointment.status);
    const StatusIcon = statusConfig.icon;
    const isLoading = actionLoading[appointment.id];

    return (
      <div
        key={appointment.id}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Card Header */}
        <div className={`px-4 py-3 ${statusConfig.bg} border-b ${statusConfig.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiClock className={`h-4 w-4 ${statusConfig.text} mr-2`} />
              <span className={`font-semibold ${statusConfig.text}`}>
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </span>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Date Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
              <FiCalendar className="h-3.5 w-3.5 mr-1.5" />
              {formatShortDate(appointment.appointmentDate)} - {getRelativeDate(appointment.appointmentDate)}
            </span>
          </div>

          {/* Patient Info */}
          <div className="flex items-start mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <FiUser className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                {appointment.patientName}
              </h4>
              {appointment.patientEmail && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {appointment.patientEmail}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          {appointment.patientNotes && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-start">
                <FiFileText className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {appointment.patientNotes}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {canTakeAction(appointment.status) && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleMarkCompleted(appointment.id)}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center py-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors disabled:opacity-50 mr-2"
                >
                  {isLoading === 'complete' ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <FiCheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Complete</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleMarkNoShow(appointment.id)}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 mr-2"
                >
                  {isLoading === 'noshow' ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <FiAlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">No Show</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleCancelAppointment(appointment.id)}
                  disabled={isLoading}
                  className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Cancel"
                >
                  {isLoading === 'cancel' ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <FiXCircle className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <Link
          to="/doctor"
          className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 mb-4 transition-colors"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Upcoming Appointments
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your scheduled appointments</p>
          </div>

          <Button
            onClick={() => fetchUpcomingAppointments(true)}
            variant="outline"
            className="mt-4 sm:mt-0"
            disabled={refreshing}
          >
            <FiRefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
          <p className="text-xs text-blue-600 mt-1">Scheduled</p>
        </div>
        <div className="bg-success-50 rounded-xl p-4 border border-success-100 text-center">
          <p className="text-2xl font-bold text-success-600">{stats.confirmed}</p>
          <p className="text-xs text-success-600 mt-1">Confirmed</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.completed}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Completed</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.noShow}</p>
          <p className="text-xs text-yellow-600 mt-1">No Show</p>
        </div>
        <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 text-center">
          <p className="text-2xl font-bold text-primary-600">{stats.thisWeek}</p>
          <p className="text-xs text-primary-600 mt-1">This Week</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="NO_SHOW">No Show</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                viewMode === 'grouped'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              Grouped
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing {sortedAppointments.length} of {appointments.length} appointments
      </p>

      {/* Appointments List */}
      {sortedAppointments.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiCalendar}
            title="No upcoming appointments"
            description={
              searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : "You don't have any upcoming appointments scheduled."
            }
          />
        </Card>
      ) : viewMode === 'grouped' ? (
        /* Grouped View */
        <div className="space-y-4">
          {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
            <Card key={date} className="overflow-hidden">
              {/* Date Header */}
              <button
                onClick={() => toggleGroup(date)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-primary-100 p-2 rounded-lg mr-3">
                    <FiCalendar className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(date)}</h3>
                    <p className="text-sm text-primary-600">{getRelativeDate(date)} - {dateAppointments.length} appointment{dateAppointments.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {collapsedGroups[date] ? (
                  <FiChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                ) : (
                  <FiChevronUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                )}
              </button>

              {/* Appointments for this date */}
              {!collapsedGroups[date] && (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {dateAppointments.map((appointment) => {
                    const statusConfig = getStatusConfig(appointment.status);
                    const StatusIcon = statusConfig.icon;
                    const isLoading = actionLoading[appointment.id];

                    return (
                      <div
                        key={appointment.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex items-start space-x-4">
                            {/* Time */}
                            <div className="text-center min-w-[60px] sm:min-w-[80px]">
                              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {formatTime(appointment.startTime)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                to {formatTime(appointment.endTime)}
                              </p>
                            </div>

                            {/* Patient Info */}
                            <div className="flex items-start">
                              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                <FiUser className="h-5 w-5 text-primary-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                  {appointment.patientName}
                                </h4>
                                {appointment.patientEmail && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {appointment.patientEmail}
                                  </p>
                                )}
                                {appointment.patientNotes && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                    <FiFileText className="inline h-3.5 w-3.5 mr-1 text-gray-400 dark:text-gray-500" />
                                    {appointment.patientNotes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Status Badge */}
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5 mr-1" />
                              {statusConfig.label}
                            </span>

                            {/* Action Buttons */}
                            {canTakeAction(appointment.status) && (
                              <div className="flex items-center space-x-1">
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
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedAppointments.map(renderTableRow)}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAppointments.map(renderAppointmentCard)}
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;
