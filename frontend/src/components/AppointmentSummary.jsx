import { useState } from 'react';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiFileText,
  FiMoreVertical,
  FiX,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiPhone,
  FiMail,
} from 'react-icons/fi';
import { LuPoundSterling } from 'react-icons/lu';
import { Button } from './ui';

const AppointmentSummary = ({
  appointment,
  variant = 'default', // 'default', 'compact', 'detailed', 'card'
  showActions = true,
  onCancel,
  onReschedule,
  onViewDetails,
  className = '',
}) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!appointment) return null;

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
  const formatDate = (dateString, includeWeekday = true) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    const options = includeWeekday
      ? { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      SCHEDULED: {
        bg: 'bg-primary-100',
        text: 'text-primary-800',
        icon: FiClock,
        label: 'Scheduled',
      },
      CONFIRMED: {
        bg: 'bg-success-100',
        text: 'text-success-800',
        icon: FiCheckCircle,
        label: 'Confirmed',
      },
      COMPLETED: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: FiCheckCircle,
        label: 'Completed',
      },
      CANCELLED: {
        bg: 'bg-error-100',
        text: 'text-error-800',
        icon: FiXCircle,
        label: 'Cancelled',
      },
      NO_SHOW: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        icon: FiAlertCircle,
        label: 'No Show',
      },
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: FiClock,
        label: 'Pending',
      },
    };
    return statusConfig[status] || statusConfig.PENDING;
  };

  // Check if appointment can be modified
  const canModify = () => {
    const modifiableStatuses = ['SCHEDULED', 'CONFIRMED', 'PENDING'];
    if (!modifiableStatuses.includes(appointment.status)) return false;

    // Check if appointment is in the future
    const appointmentDate = new Date(appointment.appointmentDate + 'T' + appointment.startTime);
    return appointmentDate > new Date();
  };

  // Handle view details
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(appointment);
    }
  };

  const statusInfo = getStatusBadge(appointment.status);
  const StatusIcon = statusInfo.icon;

  // Compact variant - for lists and sidebar widgets
  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer ${className}`}
        onClick={handleViewDetails}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
            <FiCalendar className="h-4 w-4 text-primary-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Dr. {appointment.doctorName}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(appointment.appointmentDate, false)} • {formatTime(appointment.startTime)}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.bg} ${statusInfo.text} flex-shrink-0`}>
          {statusInfo.label}
        </span>
      </div>
    );
  }

  // Card variant - for grid displays
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
        {/* Card Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-white">
              <FiCalendar className="h-5 w-5" />
              <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Doctor Info */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="bg-gray-100 p-2 rounded-full">
              <FiUser className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Dr. {appointment.doctorName}</h4>
              <p className="text-sm text-gray-500">{appointment.specialty || appointment.departmentName}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <FiClock className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {formatTime(appointment.startTime)}
              {appointment.endTime && ` - ${formatTime(appointment.endTime)}`}
            </span>
          </div>

          {/* Department */}
          {appointment.departmentName && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{appointment.departmentName}</span>
            </div>
          )}

          {/* Confirmation Number */}
          {appointment.confirmationNumber && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
              <p className="text-xs text-gray-500">Confirmation #</p>
              <p className="font-mono text-sm font-medium text-primary-600">
                {appointment.confirmationNumber}
              </p>
            </div>
          )}

          {/* Actions */}
          {showActions && canModify() && (
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              {onReschedule && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReschedule(appointment);
                  }}
                  className="flex-1"
                >
                  <FiEdit className="h-4 w-4 mr-1" />
                  Reschedule
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(appointment);
                  }}
                  className="flex-1 text-error-600 border-error-200 hover:bg-error-50"
                >
                  <FiX className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detailed variant - for appointment detail pages
  if (variant === 'detailed') {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-primary-100 text-sm mb-1">
                <FiCalendar className="h-4 w-4" />
                <span>Appointment Details</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {formatDate(appointment.appointmentDate)}
              </h2>
              <p className="text-primary-100 mt-1">
                {formatTime(appointment.startTime)}
                {appointment.endTime && ` - ${formatTime(appointment.endTime)}`}
              </p>
            </div>
            <div className={`px-3 py-1.5 rounded-full ${statusInfo.bg} ${statusInfo.text} flex items-center`}>
              <StatusIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Confirmation Number */}
          {appointment.confirmationNumber && (
            <div className="bg-primary-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Confirmation Number</p>
              <p className="text-xl font-mono font-bold text-primary-600 mt-1">
                {appointment.confirmationNumber}
              </p>
            </div>
          )}

          {/* Doctor Information */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Doctor Information
            </h3>
            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <FiUser className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">Dr. {appointment.doctorName}</h4>
                {appointment.specialty && (
                  <p className="text-gray-600">{appointment.specialty}</p>
                )}
                {appointment.departmentName && (
                  <p className="text-primary-600 text-sm">{appointment.departmentName}</p>
                )}
                {appointment.doctorEmail && (
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <FiMail className="h-4 w-4 mr-2" />
                    {appointment.doctorEmail}
                  </div>
                )}
                {appointment.doctorPhone && (
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <FiPhone className="h-4 w-4 mr-2" />
                    {appointment.doctorPhone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Appointment Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  <span>Date</span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatDate(appointment.appointmentDate)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center text-gray-600">
                  <FiClock className="h-4 w-4 mr-2" />
                  <span>Time</span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatTime(appointment.startTime)}
                  {appointment.endTime && ` - ${formatTime(appointment.endTime)}`}
                </span>
              </div>
              {appointment.departmentName && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="h-4 w-4 mr-2" />
                    <span>Department</span>
                  </div>
                  <span className="font-medium text-gray-900">{appointment.departmentName}</span>
                </div>
              )}
              {appointment.consultationFee && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <LuPoundSterling className="h-4 w-4 mr-2" />
                    <span>Consultation Fee</span>
                  </div>
                  <span className="font-semibold text-success-600">£{appointment.consultationFee}</span>
                </div>
              )}
            </div>
          </div>

          {/* Patient Notes */}
          {appointment.patientNotes && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                <FiFileText className="inline h-4 w-4 mr-1" />
                Patient Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                {appointment.patientNotes}
              </div>
            </div>
          )}

          {/* Doctor Notes */}
          {appointment.doctorNotes && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Doctor Notes
              </h3>
              <div className="bg-primary-50 rounded-lg p-4 text-gray-700">
                {appointment.doctorNotes}
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && canModify() && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {onReschedule && (
                <Button variant="outline" onClick={() => onReschedule(appointment)} className="flex-1">
                  <FiEdit className="mr-2" />
                  Reschedule
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={() => onCancel(appointment)}
                  className="flex-1 text-error-600 border-error-300 hover:bg-error-50"
                >
                  <FiTrash2 className="mr-2" />
                  Cancel Appointment
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant - for standard list items
  return (
    <div
      className={`relative p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all ${className}`}
    >
      <div className="flex items-start justify-between">
        {/* Main Content */}
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          {/* Date Badge */}
          <div className="bg-primary-50 rounded-lg p-3 text-center flex-shrink-0">
            <p className="text-xs text-primary-600 font-medium uppercase">
              {new Date(appointment.appointmentDate + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
            </p>
            <p className="text-2xl font-bold text-primary-700">
              {new Date(appointment.appointmentDate + 'T00:00:00').getDate()}
            </p>
            <p className="text-xs text-primary-600">
              {new Date(appointment.appointmentDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' })}
            </p>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900 truncate">Dr. {appointment.doctorName}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.bg} ${statusInfo.text} ml-2 flex-shrink-0`}>
                {statusInfo.label}
              </span>
            </div>

            {appointment.specialty && (
              <p className="text-sm text-gray-600 truncate">{appointment.specialty}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              <span className="flex items-center">
                <FiClock className="h-4 w-4 mr-1" />
                {formatTime(appointment.startTime)}
              </span>
              {appointment.departmentName && (
                <span className="flex items-center">
                  <FiMapPin className="h-4 w-4 mr-1" />
                  {appointment.departmentName}
                </span>
              )}
              {appointment.confirmationNumber && (
                <span className="flex items-center font-mono text-xs">
                  #{appointment.confirmationNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        {showActions && canModify() && (
          <div className="relative ml-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiMoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleViewDetails();
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiFileText className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  {onReschedule && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onReschedule(appointment);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiEdit className="h-4 w-4 mr-2" />
                      Reschedule
                    </button>
                  )}
                  {onCancel && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onCancel(appointment);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                    >
                      <FiTrash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSummary;
