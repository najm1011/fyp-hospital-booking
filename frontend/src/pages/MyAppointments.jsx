import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiFilter,
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiList,
  FiGrid,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Button, Alert, LoadingSpinner, EmptyState } from '../components/ui';
import AppointmentCard from '../components/AppointmentCard';
import CancelAppointmentModal from '../components/CancelAppointmentModal';

const MyAppointments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data states
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, upcoming, past
  const [sortBy, setSortBy] = useState('date-desc');

  // View states
  const [viewMode, setViewMode] = useState('list'); // list, grid

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Refreshing state (for manual refresh without full loading state)
  const [refreshing, setRefreshing] = useState(false);

  // Fetch appointments on mount and when filters change
  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const fetchAppointments = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await api.get('/appointments/my-appointments');
      setAppointments(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      if (isRefresh) {
        toast.success('Appointments refreshed');
      }
    } catch (err) {
      const message = 'Failed to load appointments. Please try again.';
      setError(message);
      toast.error(message);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Manual refresh handler
  const handleRefresh = () => {
    fetchAppointments(true);
  };

  // Filter and sort appointments
  const getFilteredAppointments = () => {
    let filtered = [...appointments];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === 'upcoming') {
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= today;
      });
    } else if (dateFilter === 'past') {
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate < today;
      });
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.doctorName?.toLowerCase().includes(search) ||
          apt.departmentName?.toLowerCase().includes(search) ||
          apt.confirmationNumber?.toLowerCase().includes(search) ||
          apt.specialty?.toLowerCase().includes(search)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate + 'T' + a.startTime);
      const dateB = new Date(b.appointmentDate + 'T' + b.startTime);

      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'doctor':
          return a.doctorName.localeCompare(b.doctorName);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  // Pagination
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update total pages when filters change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredAppointments.length / itemsPerPage));
    setCurrentPage(1);
  }, [statusFilter, dateFilter, searchTerm, sortBy, appointments]);

  // Handle cancel appointment
  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async (reason) => {
    if (!selectedAppointment) return;

    setCancelLoading(true);
    try {
      await api.post(`/appointments/${selectedAppointment.id}/cancel`, {
        cancellationReason: reason,
      });

      setCancelModalOpen(false);
      setSelectedAppointment(null);
      toast.success('Appointment cancelled successfully.', {
        title: 'Appointment Cancelled',
      });

      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to cancel appointment.';
      setError(message);
      toast.error(message, { title: 'Cancellation Failed' });
      console.error('Error cancelling appointment:', err);
    } finally {
      setCancelLoading(false);
    }
  };

  // Handle reschedule
  const handleReschedule = (appointment) => {
    navigate('/appointments/book', {
      state: {
        rescheduleAppointment: appointment,
        selectedDoctor: {
          id: appointment.doctorId,
          fullName: appointment.doctorName,
          specialty: appointment.specialty,
          departmentName: appointment.departmentName,
          consultationFee: appointment.consultationFee,
        },
      },
    });
  };

  // Handle view details
  const handleViewDetails = (appointment) => {
    navigate(`/appointments/${appointment.id}`);
  };

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'NO_SHOW', label: 'No Show' },
  ];

  // Get counts for tabs
  const getCounts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      all: appointments.length,
      upcoming: appointments.filter((apt) => new Date(apt.appointmentDate) >= today).length,
      past: appointments.filter((apt) => new Date(apt.appointmentDate) < today).length,
    };
  };

  const counts = getCounts();

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">View and manage your appointments</p>
        </div>
        <Link to="/appointments/book">
          <Button className="mt-4 sm:mt-0">
            <FiPlus className="mr-2" />
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} className="mb-6" />
      )}

      {/* Date Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { value: 'all', label: 'All', count: counts.all },
          { value: 'upcoming', label: 'Upcoming', count: counts.upcoming },
          { value: 'past', label: 'Past', count: counts.past },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setDateFilter(tab.value)}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              dateFilter === tab.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                dateFilter === tab.value
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor, department, or confirmation #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="doctor">By Doctor</option>
              <option value="status">By Status</option>
            </select>
          </div>

          {/* View Toggle & Refresh */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiGrid className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh appointments"
            >
              <FiRefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-900">
                  &times;
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Status: {statusOptions.find((s) => s.value === statusFilter)?.label}
                <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-blue-900">
                  &times;
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count with Refreshing Indicator */}
      {!loading && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing {paginatedAppointments.length} of {filteredAppointments.length} appointments
          </p>
          {refreshing && (
            <div className="flex items-center text-sm text-blue-600">
              <LoadingSpinner size="small" />
              <span className="ml-2">Refreshing...</span>
            </div>
          )}
        </div>
      )}

      {/* Appointments List/Grid */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 bg-white rounded-xl border border-gray-200">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-500">Loading your appointments...</p>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <>
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {paginatedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  variant="compact"
                  showActions={true}
                  onCancel={handleCancelClick}
                  onReschedule={handleReschedule}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  variant="default"
                  showActions={true}
                  onCancel={handleCancelClick}
                  onReschedule={handleReschedule}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
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
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={FiCalendar}
            title="No appointments found"
            description={
              searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters to find appointments.'
                : "You don't have any appointments yet. Book one to get started."
            }
            actionLabel={searchTerm || statusFilter !== 'all' ? 'Clear Filters' : 'Book Appointment'}
            actionPath={searchTerm || statusFilter !== 'all' ? undefined : '/appointments/book'}
            onAction={
              searchTerm || statusFilter !== 'all'
                ? () => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                  }
                : undefined
            }
          />
        </div>
      )}

      {/* Cancel Appointment Modal */}
      <CancelAppointmentModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleCancelConfirm}
        appointment={selectedAppointment}
        loading={cancelLoading}
      />
    </div>
  );
};

export default MyAppointments;
