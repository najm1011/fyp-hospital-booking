import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEdit,
  FiX,
} from 'react-icons/fi';
import { Button } from './ui';

const AppointmentCard = ({
  appointment,
  variant = 'default', // 'default', 'compact', 'mini'
  showActions = true,
  onCancel,
  onReschedule,
  onViewDetails,
  loading = false,
  className = '',
}) => {

  // Loading skeleton for mini variant
  if (loading && variant === 'mini') {
    return (
      <div className={`flex items-center p-2 rounded-lg border border-gray-200 animate-pulse ${className}`}>
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
      </div>
    );
  }

  // Loading skeleton for compact variant
  if (loading && variant === 'compact') {
    return (
      <div className={`flex items-center p-3 bg-white rounded-lg border border-gray-200 animate-pulse ${className}`}>
        <div className="flex-shrink-0 w-14 h-14 bg-gray-200 rounded-xl mr-4"></div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  // Loading skeleton for default variant
  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse ${className}`}>
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-100">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl mr-4"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-36 mb-4"></div>
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) return null;

  // Format time for display (24h to 12h)
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
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-GB', { month: 'short' }),
      weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      full: date.toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const config = {
      SCHEDULED: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: FiClock,
        label: 'Scheduled',
        color: 'blue',
      },
      CONFIRMED: {
        bg: 'bg-success-100',
        text: 'text-success-700',
        border: 'border-success-200',
        icon: FiCheckCircle,
        label: 'Confirmed',
        color: 'green',
      },
      COMPLETED: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: FiCheckCircle,
        label: 'Completed',
        color: 'gray',
      },
      CANCELLED: {
        bg: 'bg-error-100',
        text: 'text-error-700',
        border: 'border-error-200',
        icon: FiXCircle,
        label: 'Cancelled',
        color: 'red',
      },
      NO_SHOW: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: FiAlertCircle,
        label: 'No Show',
        color: 'orange',
      },
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: FiClock,
        label: 'Pending',
        color: 'yellow',
      },
    };
    return config[status] || config.PENDING;
  };

  // Check if appointment can be modified
  const canModify = () => {
    const modifiableStatuses = ['SCHEDULED', 'CONFIRMED', 'PENDING'];
    if (!modifiableStatuses.includes(appointment.status)) return false;
    const appointmentDate = new Date(appointment.appointmentDate + 'T' + appointment.startTime);
    return appointmentDate > new Date();
  };

  // Handle click
  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(appointment);
    }
  };

  const dateInfo = formatDate(appointment.appointmentDate);
  const statusConfig = getStatusConfig(appointment.status);
  const StatusIcon = statusConfig.icon;

  // Mini variant - smallest, for widgets
  if (variant === 'mini') {
    return (
      <div
        onClick={handleClick}
        className={`flex items-center p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all ${className}`}
      >
        <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex flex-col items-center justify-center mr-3">
          <span className="text-xs font-bold text-primary-600">{dateInfo.day}</span>
          <span className="text-[10px] text-primary-500 uppercase">{dateInfo.month}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">Dr. {appointment.doctorName}</p>
          <p className="text-xs text-gray-500">{formatTime(appointment.startTime)}</p>
        </div>
        <span className={`w-2 h-2 rounded-full bg-${statusConfig.color}-500 flex-shrink-0`} />
      </div>
    );
  }

  // Compact variant - for lists
  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all ${className}`}
      >
        {/* Date Badge */}
        <div
          onClick={handleClick}
          className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex flex-col items-center justify-center mr-4 border border-primary-200 cursor-pointer"
        >
          <span className="text-lg font-bold text-primary-600">{dateInfo.day}</span>
          <span className="text-xs text-primary-500 uppercase">{dateInfo.month}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={handleClick}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              Dr. {appointment.doctorName}
            </h4>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text} flex-shrink-0 ml-2`}>
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500 space-x-3">
            <span className="flex items-center">
              <FiClock className="h-3 w-3 mr-1" />
              {formatTime(appointment.startTime)}
            </span>
            {appointment.departmentName && (
              <span className="flex items-center">
                <FiMapPin className="h-3 w-3 mr-1" />
                {appointment.departmentName}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && canModify() && (
          <div className="flex items-center gap-2 ml-4">
            {onReschedule && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReschedule(appointment);
                }}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Reschedule"
              >
                <FiEdit className="h-4 w-4" />
              </button>
            )}
            {onCancel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(appointment);
                }}
                className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                title="Cancel"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default variant - full card
  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-gray-100/80 overflow-hidden hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-300 ${className}`}>
      {/* Card Header with Status Indicator */}
      <div className={`px-4 py-3 border-b ${statusConfig.border} ${statusConfig.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-1.5 rounded-lg ${statusConfig.bg} mr-2`}>
              <StatusIcon className={`h-4 w-4 ${statusConfig.text}`} />
            </div>
            <span className={`text-sm font-semibold ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
          </div>
          {appointment.confirmationNumber && (
            <span className="text-xs font-mono text-gray-500 bg-white/50 px-2 py-1 rounded-lg">
              #{appointment.confirmationNumber}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Date and Time Row */}
        <div className="flex items-start mb-4">
          {/* Date Badge */}
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex flex-col items-center justify-center text-white mr-4 shadow-lg shadow-primary-500/20">
            <span className="text-2xl font-bold">{dateInfo.day}</span>
            <span className="text-xs uppercase opacity-90 font-medium">{dateInfo.month}</span>
          </div>

          {/* Date/Time Details */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">{dateInfo.weekday}</p>
            <p className="text-base font-semibold text-gray-900">{dateInfo.full}</p>
            <div className="flex items-center mt-1.5 text-sm text-gray-600">
              <FiClock className="h-4 w-4 mr-1.5 text-primary-500" />
              {formatTime(appointment.startTime)}
              {appointment.endTime && ` - ${formatTime(appointment.endTime)}`}
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl mb-4 border border-gray-100">
          <div className="bg-gradient-to-br from-primary-100 to-primary-50 p-2.5 rounded-xl mr-3">
            <FiUser className="h-5 w-5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">Dr. {appointment.doctorName}</h4>
            <p className="text-sm text-gray-500 truncate">
              {appointment.specialty || appointment.departmentName}
            </p>
          </div>
        </div>

        {/* Department & Location */}
        {appointment.departmentName && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
            {appointment.departmentName}
          </div>
        )}

        {/* Actions */}
        {showActions && canModify() && (
          <div className="flex gap-2 pt-4 border-t border-gray-100">
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
                <FiEdit className="h-4 w-4 mr-1.5" />
                Reschedule
              </Button>
            )}
            {onCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(appointment);
                }}
                className="flex-1"
              >
                <FiX className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
            )}
          </div>
        )}

        {/* View Details Link */}
        {!showActions && (
          <button
            onClick={handleClick}
            className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-semibold pt-4 border-t border-gray-100 hover:bg-primary-50/50 -mx-5 px-5 -mb-5 pb-4 transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
