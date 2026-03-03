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
  FiMoreVertical,
  FiEye,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, EmptyState, Button, Alert, LoadingSpinner } from '../components/ui';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';

const TodayAppointments = () => {
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
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  // Action states
  const [actionLoading, setActionLoading] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    fetchTodayAppointments();
  }, []);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowActionMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchTodayAppointments = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await api.get('/appointments/doctor/appointments/today');
      setAppointments(response.data || []);
    } catch (err) {
      console.error('Error fetching today\'s appointments:', err);
      const message = getErrorMessage(err, 'Unable to load today\'s appointments. Please refresh the page.');
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

  // Get current date formatted
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
      fetchTodayAppointments(true);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to mark this appointment as completed. Please try again.'));
    } finally {
      setActionLoading((prev) => ({ ...prev, [appointmentId]: null }));
      setShowActionMenu(null);
    }
  };

  // Handle mark as no-show
  const handleMarkNoShow = async (appointmentId) => {
    setActionLoading((prev) => ({ ...prev, [appointmentId]: 'noshow' }));
    try {
      await api.put(`/appointments/doctor/${appointmentId}/no-show`);
      toast.success('Appointment marked as no-show');
      fetchTodayAppointments(true);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to record no-show. Please try again.'));
    } finally {
      setActionLoading((prev) => ({ ...prev, [appointmentId]: null }));
      setShowActionMenu(null);
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
      fetchTodayAppointments(true);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to cancel this appointment. Please try again.'));
    } finally {
      setActionLoading((prev) => ({ ...prev, [appointmentId]: null }));
      setShowActionMenu(null);
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

  // Sort by time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  // Get summary stats
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === 'SCHEDULED').length,
    confirmed: appointments.filter((a) => a.status === 'CONFIRMED').length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
    cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
    noShow: appointments.filter((a) => a.status === 'NO_SHOW').length,
  };

  // Check if action can be taken
  const canTakeAction = (status) => {
    return status === 'SCHEDULED' || status === 'CONFIRMED';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading today's appointments...</p>
      </div>
    );
  }

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
              Today's Appointments
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{getCurrentDate()}</p>
          </div>

          <Button
            onClick={() => fetchTodayAppointments(true)}
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
        <div className="bg-error-50 rounded-xl p-4 border border-error-100 text-center">
          <p className="text-2xl font-bold text-error-600">{stats.cancelled}</p>
          <p className="text-xs text-error-600 mt-1">Cancelled</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.noShow}</p>
          <p className="text-xs text-yellow-600 mt-1">No Show</p>
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
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
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
            title="No appointments found"
            description={
              searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : "You don't have any appointments scheduled for today."
            }
          />
        </Card>
      ) : viewMode === 'table' ? (
        /* Table View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Contact
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
                {sortedAppointments.map((appointment) => {
                  const statusConfig = getStatusConfig(appointment.status);
                  const StatusIcon = statusConfig.icon;
                  const isLoading = actionLoading[appointment.id];

                  return (
                    <tr
                      key={appointment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {appointment.patientId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {appointment.patientEmail && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FiMail className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                              <span className="truncate max-w-[150px]">
                                {appointment.patientEmail}
                              </span>
                            </div>
                          )}
                          {appointment.patientPhone && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <FiPhone className="h-3.5 w-3.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                              {appointment.patientPhone}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="px-6 py-4">
                        {appointment.patientNotes ? (
                          <div className="max-w-[200px]">
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={appointment.patientNotes}>
                              {appointment.patientNotes}
                            </p>
                          </div>
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
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAppointments.map((appointment) => {
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
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
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
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodayAppointments;
