import { useState } from 'react';
import {
  FiX,
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiUser,
} from 'react-icons/fi';
import { Button, LoadingSpinner } from './ui';

const CancelAppointmentModal = ({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  loading = false,
}) => {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  if (!isOpen || !appointment) return null;

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
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Predefined cancellation reasons
  const cancellationReasons = [
    'Schedule conflict',
    'Feeling better, no longer need appointment',
    'Found alternative healthcare provider',
    'Transportation issues',
    'Financial reasons',
    'Emergency situation',
    'Other',
  ];

  const handleSubmit = () => {
    const finalReason = selectedReason === 'Other' ? reason : selectedReason;
    onConfirm(finalReason);
  };

  const handleClose = () => {
    if (!loading) {
      setReason('');
      setSelectedReason('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <FiAlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Cancel Appointment</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
              <p className="text-sm text-red-700">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </p>
            </div>

            {/* Appointment Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-5">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Appointment Details</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <FiUser className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Doctor:</span>
                  <span className="ml-auto font-medium text-gray-900">
                    Dr. {appointment.doctorName}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-auto font-medium text-gray-900">
                    {formatDate(appointment.appointmentDate)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FiClock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Time:</span>
                  <span className="ml-auto font-medium text-gray-900">
                    {formatTime(appointment.startTime)}
                  </span>
                </div>
                {appointment.confirmationNumber && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600">Confirmation #:</span>
                    <span className="ml-auto font-mono text-sm text-teal-600">
                      {appointment.confirmationNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <div className="space-y-2 mb-3">
                {cancellationReasons.map((reasonOption) => (
                  <label
                    key={reasonOption}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedReason === reasonOption
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={reasonOption}
                      checked={selectedReason === reasonOption}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{reasonOption}</span>
                  </label>
                ))}
              </div>

              {/* Custom reason input */}
              {selectedReason === 'Other' && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please specify your reason..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Keep Appointment
            </Button>
            <Button
              variant="danger"
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading || !selectedReason || (selectedReason === 'Other' && !reason.trim())}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Cancelling...</span>
                </>
              ) : (
                'Cancel Appointment'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;
