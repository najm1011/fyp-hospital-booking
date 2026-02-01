import { useState, useEffect } from 'react';
import {
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiUser,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
} from 'react-icons/fi';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';
import { useToast } from '../context/ToastContext';
import { Alert, LoadingSpinner, EmptyState, StatsCard } from '../components/ui';

const MedicalHistory = () => {
  const { toast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Expanded cards
  const [expandedId, setExpandedId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/appointments/my-appointments');
      // Filter only past/completed appointments (not SCHEDULED)
      const historyStatuses = ['COMPLETED', 'CANCELLED', 'NO_SHOW'];
      const history = response.data.filter((apt) =>
        historyStatuses.includes(apt.status)
      );
      setAppointments(history);
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to load your medical history. Please refresh the page.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const stats = {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === 'COMPLETED').length,
    cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
    noShow: appointments.filter((a) => a.status === 'NO_SHOW').length,
  };

  // Filter and sort
  const getFilteredAppointments = () => {
    let filtered = [...appointments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.doctorName?.toLowerCase().includes(search) ||
          apt.departmentName?.toLowerCase().includes(search) ||
          apt.specialty?.toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate + 'T' + a.startTime);
      const dateB = new Date(b.appointmentDate + 'T' + b.startTime);
      return sortBy === 'date-asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, sortBy]);

  // Format helpers
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusConfig = (status) => {
    const config = {
      COMPLETED: {
        bg: 'bg-success-100',
        text: 'text-success-700',
        icon: FiCheckCircle,
        label: 'Completed',
      },
      CANCELLED: {
        bg: 'bg-error-100',
        text: 'text-error-700',
        icon: FiXCircle,
        label: 'Cancelled',
      },
      NO_SHOW: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        icon: FiAlertCircle,
        label: 'No Show',
      },
    };
    return config[status] || config.COMPLETED;
  };

  const tabs = [
    { value: 'all', label: 'All History', count: stats.total },
    { value: 'COMPLETED', label: 'Completed', count: stats.completed },
    { value: 'CANCELLED', label: 'Cancelled', count: stats.cancelled },
    { value: 'NO_SHOW', label: 'No Show', count: stats.noShow },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Medical History</h1>
        <p className="text-gray-600 mt-1">View your past appointments and visit history</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={FiActivity} label="Total Visits" value={stats.total} color="blue" loading={loading} />
        <StatsCard icon={FiCheckCircle} label="Completed" value={stats.completed} color="green" loading={loading} />
        <StatsCard icon={FiXCircle} label="Cancelled" value={stats.cancelled} color="red" loading={loading} />
        <StatsCard icon={FiAlertCircle} label="No Show" value={stats.noShow} color="yellow" loading={loading} />
      </div>

      {/* Tab Filters */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === tab.value
                ? 'bg-white text-primary-600 shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                statusFilter === tab.value
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {paginatedAppointments.length} of {filteredAppointments.length} records
        </p>
      )}

      {/* Appointment List */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl border border-gray-100 shadow-soft">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-500">Loading your medical history...</p>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <>
          <div className="space-y-3">
            {paginatedAppointments.map((appointment) => {
              const statusConfig = getStatusConfig(appointment.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedId === appointment.id;

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden transition-all duration-200 hover:shadow-soft-md"
                >
                  {/* Main Row */}
                  <div
                    className="flex items-center p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : appointment.id)}
                  >
                    {/* Date Badge */}
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex flex-col items-center justify-center mr-4 border border-primary-200">
                      <span className="text-lg font-bold text-primary-600">
                        {new Date(appointment.appointmentDate + 'T00:00:00').getDate()}
                      </span>
                      <span className="text-xs text-primary-500 uppercase">
                        {new Date(appointment.appointmentDate + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          Dr. {appointment.doctorName}
                        </h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text} flex-shrink-0 ml-2`}>
                          <StatusIcon className="inline h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 space-x-3">
                        <span className="flex items-center">
                          <FiClock className="h-3 w-3 mr-1" />
                          {formatTime(appointment.startTime)}
                          {appointment.endTime && ` - ${formatTime(appointment.endTime)}`}
                        </span>
                        {appointment.departmentName && (
                          <span className="flex items-center">
                            <FiMapPin className="h-3 w-3 mr-1" />
                            {appointment.departmentName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand Toggle */}
                    <div className="ml-3 text-gray-400">
                      {isExpanded ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Visit Details */}
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Visit Details</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <FiUser className="h-4 w-4 mr-2 text-gray-400" />
                              Dr. {appointment.doctorName}
                            </div>
                            {appointment.specialty && (
                              <div className="flex items-center text-gray-600">
                                <FiActivity className="h-4 w-4 mr-2 text-gray-400" />
                                {appointment.specialty}
                              </div>
                            )}
                            <div className="flex items-center text-gray-600">
                              <FiClock className="h-4 w-4 mr-2 text-gray-400" />
                              {formatDate(appointment.appointmentDate)}, {formatTime(appointment.startTime)}
                            </div>
                            {appointment.departmentName && (
                              <div className="flex items-center text-gray-600">
                                <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
                                {appointment.departmentName}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                          <div className="space-y-3">
                            {appointment.doctorNotes && (
                              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                <p className="text-xs font-medium text-blue-700 mb-1 flex items-center">
                                  <FiFileText className="h-3 w-3 mr-1" />
                                  Doctor Notes
                                </p>
                                <p className="text-sm text-blue-800">{appointment.doctorNotes}</p>
                              </div>
                            )}
                            {appointment.patientNotes && (
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                                  <FiFileText className="h-3 w-3 mr-1" />
                                  Your Notes
                                </p>
                                <p className="text-sm text-gray-700">{appointment.patientNotes}</p>
                              </div>
                            )}
                            {appointment.cancellationReason && (
                              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                <p className="text-xs font-medium text-red-700 mb-1 flex items-center">
                                  <FiXCircle className="h-3 w-3 mr-1" />
                                  Cancellation Reason
                                </p>
                                <p className="text-sm text-red-800">{appointment.cancellationReason}</p>
                              </div>
                            )}
                            {!appointment.doctorNotes && !appointment.patientNotes && !appointment.cancellationReason && (
                              <p className="text-sm text-gray-400 italic">No notes available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-white rounded-xl border border-gray-100 shadow-soft px-4 py-3">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white shadow-primary-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft">
          <EmptyState
            icon={FiActivity}
            title="No medical history found"
            description={
              searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters to find records.'
                : "You don't have any past appointments yet."
            }
            actionLabel={searchTerm || statusFilter !== 'all' ? 'Clear Filters' : undefined}
            onAction={
              searchTerm || statusFilter !== 'all'
                ? () => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
