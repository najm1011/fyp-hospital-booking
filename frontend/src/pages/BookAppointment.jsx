import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiCheck, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Button, Alert, LoadingSpinner, DatePicker, TimeSlotPicker } from '../components/ui';
import BookingConfirmationModal from '../components/BookingConfirmationModal';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Steps: 1 = Select Doctor, 2 = Select Date/Time, 3 = Confirm
  const [step, setStep] = useState(1);

  // Data states
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientNotes, setPatientNotes] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch available slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);

      // Extract unique departments
      const uniqueDepartments = [...new Set(response.data.map(d => d.departmentName))];
      setDepartments(uniqueDepartments);
    } catch (err) {
      const message = 'Failed to load doctors. Please try again.';
      setError(message);
      toast.error(message);
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    setSlotsLoading(true);
    setError(null);
    setSelectedSlot(null);
    try {
      const response = await api.get(`/doctors/${selectedDoctor.id}/available-slots`, {
        params: { date: selectedDate }
      });
      // Filter only available slots
      const available = response.data.filter(slot => slot.available);
      setAvailableSlots(available);
    } catch (err) {
      const message = 'Failed to load available slots. Please try again.';
      setError(message);
      toast.error(message);
      console.error('Error fetching slots:', err);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    setBookingLoading(true);
    setError(null);
    try {
      const response = await api.post('/appointments', {
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDate,
        startTime: selectedSlot.startTime,
        patientNotes: patientNotes
      });
      setBookingResult(response.data);
      setIsBookingSuccess(true);
      toast.success('Appointment booked successfully!', {
        title: 'Booking Confirmed',
        duration: 6000,
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to book appointment. Please try again.';
      setError(message);
      setShowConfirmModal(false);
      toast.error(message, { title: 'Booking Failed' });
      console.error('Error booking appointment:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  // Open confirmation modal
  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
    setIsBookingSuccess(false);
  };

  // Reset booking form
  const handleBookAnother = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedSlot(null);
    setPatientNotes('');
    setBookingResult(null);
    setSuccess(null);
    setShowConfirmModal(false);
    setIsBookingSuccess(false);
  };

  // Close modal
  const handleCloseModal = () => {
    if (!bookingLoading) {
      setShowConfirmModal(false);
      if (isBookingSuccess) {
        // If booking was successful, reset everything
        handleBookAnother();
      }
    }
  };

  // Filter doctors by department
  const filteredDoctors = selectedDepartment
    ? doctors.filter(d => d.departmentName === selectedDepartment)
    : doctors;

  // Get minimum date (today) and maximum date (90 days from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Step 1: Select Doctor
  const renderDoctorSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Doctor</h2>

        {/* Department Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map(doctor => (
            <div
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedDoctor?.id === doctor.id
                  ? 'border-primary-500 bg-primary-50 shadow-primary-sm'
                  : 'border-gray-200 hover:border-primary-200 hover:shadow-soft'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-3 rounded-xl ${selectedDoctor?.id === doctor.id ? 'bg-primary-500' : 'bg-primary-100'}`}>
                  <FiUser className={`h-6 w-6 ${selectedDoctor?.id === doctor.id ? 'text-white' : 'text-primary-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Dr. {doctor.fullName}</h3>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  <p className="text-sm text-primary-600 font-medium">{doctor.departmentName}</p>
                  <p className="text-sm font-semibold text-success-600 mt-1">
                    £{doctor.consultationFee}
                  </p>
                </div>
                {selectedDoctor?.id === doctor.id && (
                  <FiCheck className="h-5 w-5 text-primary-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDoctors.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No doctors found for the selected department.
        </div>
      )}
    </div>
  );

  // Step 2: Select Date and Time
  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">
          Booking with <span className="font-medium">Dr. {selectedDoctor?.fullName}</span>
        </p>
      </div>

      {/* Date Selection */}
      <div className="md:w-80">
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={setSelectedDate}
          minDate={today}
          maxDate={maxDate}
          placeholder="Choose appointment date"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <TimeSlotPicker
          label="Available Time Slots"
          slots={availableSlots}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          loading={slotsLoading}
          emptyMessage="No available slots for this date."
        />
      )}

      {/* Patient Notes */}
      {selectedSlot && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes for Doctor (Optional)
          </label>
          <textarea
            value={patientNotes}
            onChange={(e) => setPatientNotes(e.target.value)}
            placeholder="Describe your symptoms or reason for visit..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          />
        </div>
      )}
    </div>
  );

  // Step 3: Confirmation
  const renderConfirmation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Confirm Your Appointment</h2>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-100">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Doctor</span>
          <span className="font-medium text-gray-900">Dr. {selectedDoctor?.fullName}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Specialty</span>
          <span className="font-medium text-gray-900">{selectedDoctor?.specialty}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Department</span>
          <span className="font-medium text-primary-600">{selectedDoctor?.departmentName}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Date</span>
          <span className="font-medium text-gray-900">{new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Time</span>
          <span className="font-medium text-gray-900">{formatTime(selectedSlot?.startTime)} - {formatTime(selectedSlot?.endTime)}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Consultation Fee</span>
          <span className="font-semibold text-success-600">£{selectedDoctor?.consultationFee}</span>
        </div>
        {patientNotes && (
          <div className="pt-2">
            <span className="text-gray-500 block mb-2">Your Notes</span>
            <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200">{patientNotes}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Step 4: Success
  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-2xl">
        <FiCheck className="h-8 w-8 text-success-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900">Appointment Booked!</h2>
      <p className="text-gray-600">Your appointment has been confirmed.</p>

      {bookingResult && (
        <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto space-y-3 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Confirmation #</span>
            <span className="font-mono font-semibold text-primary-600">{bookingResult.confirmationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Doctor</span>
            <span className="font-medium text-gray-900">{bookingResult.doctorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-900">{bookingResult.appointmentDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-medium text-gray-900">{formatTime(bookingResult.startTime)}</span>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setStep(1);
            setSelectedDoctor(null);
            setSelectedDate('');
            setSelectedSlot(null);
            setPatientNotes('');
            setBookingResult(null);
            setSuccess(null);
          }}
        >
          Book Another
        </Button>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );

  // Navigation buttons
  const renderNavigation = () => {
    if (step === 4) return null;

    return (
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={() => step === 1 ? navigate('/dashboard') : setStep(step - 1)}
        >
          <FiArrowLeft className="mr-2" />
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && !selectedDoctor) ||
              (step === 2 && (!selectedDate || !selectedSlot))
            }
          >
            Next
            <FiArrowRight className="ml-2" />
          </Button>
        ) : (
          <Button onClick={handleOpenConfirmModal} disabled={bookingLoading}>
            <FiCheck className="mr-2" />
            Confirm Booking
          </Button>
        )}
      </div>
    );
  };

  // Progress steps
  const renderProgress = () => {
    if (step === 4) return null;

    const steps = [
      { num: 1, label: 'Select Doctor' },
      { num: 2, label: 'Date & Time' },
      { num: 3, label: 'Confirm' },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  step >= s.num
                    ? 'bg-primary-600 text-white shadow-primary-sm'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {step > s.num ? <FiCheck /> : s.num}
              </div>
              <span className={`ml-2 text-sm ${step >= s.num ? 'text-primary-700 font-medium' : 'text-gray-500'}`}>
                {s.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-4 rounded-full transition-colors duration-200 ${step > s.num ? 'bg-primary-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600 mt-1">Schedule an appointment with our doctors</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />
      )}

      {success && step !== 4 && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} className="mb-6" />
      )}

      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        {renderProgress()}

        {step === 1 && renderDoctorSelection()}
        {step === 2 && renderDateTimeSelection()}
        {step === 3 && renderConfirmation()}
        {step === 4 && renderSuccess()}

        {renderNavigation()}
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleBookAppointment}
        doctor={selectedDoctor}
        appointmentDate={selectedDate}
        timeSlot={selectedSlot}
        patientNotes={patientNotes}
        bookingResult={bookingResult}
        isSuccess={isBookingSuccess}
        loading={bookingLoading}
        onBookAnother={handleBookAnother}
        onGoToDashboard={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default BookAppointment;
