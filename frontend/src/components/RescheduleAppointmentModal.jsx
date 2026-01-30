import { useState, useEffect } from 'react';
import {
  FiX,
  FiCalendar,
  FiClock,
  FiUser,
  FiRefreshCw,
} from 'react-icons/fi';
import { Button, LoadingSpinner, DatePicker, TimeSlotPicker } from './ui';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';
import useModalAccessibility from '../hooks/useModalAccessibility';

const RescheduleAppointmentModal = ({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  loading = false,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useModalAccessibility(isOpen, () => {
    if (!loading) {
      setSelectedDate('');
      setSelectedSlot(null);
      setAvailableSlots([]);
      setError(null);
      onClose();
    }
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedDate('');
      setSelectedSlot(null);
      setAvailableSlots([]);
      setError(null);
    }
  }, [isOpen]);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate && appointment?.doctorId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, appointment?.doctorId]);

  const fetchAvailableSlots = async () => {
    setSlotsLoading(true);
    setError(null);
    setSelectedSlot(null);
    try {
      const response = await api.get(`/doctors/${appointment.doctorId}/available-slots`, {
        params: { date: selectedDate }
      });
      // Filter only available slots
      const available = response.data.filter(slot => slot.available);
      setAvailableSlots(available);

      if (available.length === 0) {
        setError('No available slots for this date. Please select another date.');
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError(getErrorMessage(err, 'Unable to load available time slots. Please try a different date.'));
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

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

  // Get minimum date (today) and maximum date (90 days from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleSubmit = () => {
    if (selectedDate && selectedSlot) {
      onConfirm({
        newDate: selectedDate,
        newStartTime: selectedSlot.startTime,
      });
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedDate('');
      setSelectedSlot(null);
      setAvailableSlots([]);
      setError(null);
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
          aria-label="Reschedule appointment"
          className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-scale-in"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <FiRefreshCw className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                aria-label="Close"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
            {/* Current Appointment Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-5">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Appointment</h4>
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
              </div>
            </div>

            {/* New Date Selection */}
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Select New Date & Time</h4>

              <DatePicker
                label="New Date"
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                  setError(null);
                }}
                minDate={today}
                maxDate={maxDate}
                placeholder="Choose new appointment date"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mb-4">
                {slotsLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <LoadingSpinner size="medium" />
                    <p className="mt-2 text-sm text-gray-500">Loading available slots...</p>
                  </div>
                ) : error ? (
                  <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                    <p className="text-sm text-error-600">{error}</p>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <TimeSlotPicker
                    label="Available Time Slots"
                    slots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    loading={false}
                    emptyMessage="No available slots for this date."
                  />
                ) : null}
              </div>
            )}

            {/* New Appointment Summary */}
            {selectedDate && selectedSlot && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-primary-800 mb-2">New Appointment</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-700">Date:</span>
                    <span className="font-medium text-primary-900">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Time:</span>
                    <span className="font-medium text-primary-900">
                      {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading || !selectedDate || !selectedSlot}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Rescheduling...</span>
                </>
              ) : (
                'Confirm Reschedule'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointmentModal;
