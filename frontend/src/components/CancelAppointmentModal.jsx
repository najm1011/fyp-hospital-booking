import { useState } from 'react';
import {
  FiX,
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiUser,
} from 'react-icons/fi';
import { Button, LoadingSpinner } from './ui';
import useModalAccessibility from '../hooks/useModalAccessibility';

const CancelAppointmentModal = ({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  loading = false,
}) => {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const modalRef = useModalAccessibility(isOpen, () => {
    if (!loading) {
      setReason('');
      setSelectedReason('');
      onClose();
    }
  });

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
    return date.toLocaleDateString('en-GB', {
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
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Cancel appointment"
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-scale-in"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-error-100 p-2 rounded-full">
                  <FiAlertTriangle className="h-5 w-5 text-error-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cancel Appointment</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                aria-label="Close"
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {/* Warning Message */}
            <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-5">
              <p className="text-sm text-error-700">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </p>
            </div>

            {/* Appointment Details */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-5">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Appointment Details</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <FiUser className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
                  <span className="ml-auto font-medium text-gray-900 dark:text-gray-100">
                    Dr. {appointment.doctorName}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FiCalendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="ml-auto font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(appointment.appointmentDate)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FiClock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="ml-auto font-medium text-gray-900 dark:text-gray-100">
                    {formatTime(appointment.startTime)}
                  </span>
                </div>
                {appointment.confirmationNumber && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Confirmation #:</span>
                    <span className="ml-auto font-mono text-sm text-primary-600">
                      {appointment.confirmationNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Reason */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for cancellation
              </legend>
              <div className="space-y-2 mb-3">
                {cancellationReasons.map((reasonOption) => (
                  <label
                    key={reasonOption}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedReason === reasonOption
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={reasonOption}
                      checked={selectedReason === reasonOption}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{reasonOption}</span>
                  </label>
                ))}
              </div>

              {/* Custom reason input */}
              {selectedReason === 'Other' && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please specify your reason..."
                  aria-label="Custom cancellation reason"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              )}
            </fieldset>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-600 flex space-x-3">
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
