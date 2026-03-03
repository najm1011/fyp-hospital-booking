import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useModalAccessibility from '../hooks/useModalAccessibility';
import {
  FiX,
  FiCheck,
  FiUser,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiFileText,
  FiCopy,
  FiPrinter,
  FiCheckCircle,
} from 'react-icons/fi';
import { LuPoundSterling } from 'react-icons/lu';
import { Button, LoadingSpinner } from './ui';

const BookingConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  // Booking details (for pre-confirmation)
  doctor,
  appointmentDate,
  timeSlot,
  patientNotes,
  // Success state (after booking)
  bookingResult,
  isSuccess = false,
  // Loading state
  loading = false,
  // Callbacks
  onBookAnother,
  onGoToDashboard,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const modalRef = useModalAccessibility(isOpen, () => { if (!loading) onClose(); });

  if (!isOpen) return null;

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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Copy confirmation number
  const copyConfirmationNumber = async () => {
    if (bookingResult?.confirmationNumber) {
      try {
        await navigator.clipboard.writeText(bookingResult.confirmationNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for non-HTTPS or unsupported browsers
        const textArea = document.createElement('textarea');
        textArea.value = bookingResult.confirmationNumber;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // Handle dashboard navigation
  const handleGoToDashboard = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else {
      navigate('/dashboard');
    }
    onClose();
  };

  // Handle book another
  const handleBookAnother = () => {
    if (onBookAnother) {
      onBookAnother();
    }
    onClose();
  };

  // Confirmation view (before booking)
  const renderConfirmation = () => (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Confirm Appointment</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">Please review your appointment details</p>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        {/* Doctor Info */}
        <div className="flex items-start space-x-4 p-4 bg-primary-50 rounded-xl">
          <div className="bg-primary-100 p-3 rounded-full">
            <FiUser className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Dr. {doctor?.fullName}</h3>
            <p className="text-sm text-gray-600">{doctor?.specialty}</p>
            <p className="text-sm text-primary-600">{doctor?.departmentName}</p>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 gap-2">
            <div className="flex items-center text-gray-600 flex-shrink-0">
              <FiCalendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Date</span>
            </div>
            <span className="font-medium text-gray-900 text-right text-sm">{formatDate(appointmentDate)}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 gap-2">
            <div className="flex items-center text-gray-600 flex-shrink-0">
              <FiClock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Time</span>
            </div>
            <span className="font-medium text-gray-900 text-right">
              {formatTime(timeSlot?.startTime)}
              {timeSlot?.endTime && ` - ${formatTime(timeSlot.endTime)}`}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 gap-2">
            <div className="flex items-center text-gray-600 flex-shrink-0">
              <FiMapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Department</span>
            </div>
            <span className="font-medium text-gray-900 text-right truncate">{doctor?.departmentName}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 gap-2">
            <div className="flex items-center text-gray-600 flex-shrink-0">
              <LuPoundSterling className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Consultation Fee</span>
            </div>
            <span className="font-semibold text-success-600">£{doctor?.consultationFee}</span>
          </div>
        </div>

        {/* Patient Notes */}
        {patientNotes && (
          <div className="pt-2">
            <div className="flex items-center text-gray-600 mb-2">
              <FiFileText className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Your Notes</span>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {patientNotes}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-amber-700">
            By confirming this appointment, you agree to our cancellation policy.
            Please arrive 15 minutes before your scheduled time.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
        <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="small" />
              <span className="ml-2">Booking...</span>
            </>
          ) : (
            <>
              <FiCheck className="mr-2" />
              Confirm Booking
            </>
          )}
        </Button>
      </div>
    </>
  );

  // Success view (after booking)
  const renderSuccess = () => (
    <>
      {/* Header - Success */}
      <div className="px-6 pt-8 pb-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success-100 rounded-full mb-4">
          <FiCheckCircle className="h-10 w-10 text-success-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="text-gray-500 mt-1">Your appointment has been successfully scheduled</p>
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        {/* Confirmation Number */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-50 rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Confirmation Number</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-mono font-bold text-primary-600">
              {bookingResult?.confirmationNumber || 'N/A'}
            </span>
            <button
              onClick={copyConfirmationNumber}
              className="flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              {copied ? (
                <>
                  <FiCheck className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <FiCopy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Appointment Summary */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center text-gray-600">
              <FiUser className="h-4 w-4 mr-2" />
              <span className="text-sm">Doctor</span>
            </div>
            <span className="font-medium text-gray-900">
              {bookingResult?.doctorName || `Dr. ${doctor?.fullName}`}
            </span>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center text-gray-600">
              <FiCalendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Date</span>
            </div>
            <span className="font-medium text-gray-900">
              {bookingResult?.appointmentDate || formatDate(appointmentDate)}
            </span>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center text-gray-600">
              <FiClock className="h-4 w-4 mr-2" />
              <span className="text-sm">Time</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatTime(bookingResult?.startTime || timeSlot?.startTime)}
            </span>
          </div>

          {(bookingResult?.departmentName || doctor?.departmentName) && (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center text-gray-600">
                <FiMapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Department</span>
              </div>
              <span className="font-medium text-gray-900">
                {bookingResult?.departmentName || doctor?.departmentName}
              </span>
            </div>
          )}
        </div>

        {/* Reminder */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-primary-700">
            A confirmation email has been sent to your registered email address.
            Please save your confirmation number for reference.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleBookAnother} className="flex-1">
            Book Another
          </Button>
          <Button onClick={handleGoToDashboard} className="flex-1">
            Go to Dashboard
          </Button>
        </div>
        <button
          onClick={() => window.print()}
          className="w-full mt-3 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiPrinter className="h-4 w-4 mr-1" />
          Print Confirmation
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={isSuccess ? 'Booking confirmed' : 'Confirm appointment'}
          className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-scale-in"
        >
          {isSuccess ? renderSuccess() : renderConfirmation()}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
