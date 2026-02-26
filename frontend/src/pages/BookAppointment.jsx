import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiUser,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';
import { useToast } from '../context/ToastContext';
import {
  Button,
  Alert,
  LoadingSpinner,
  DatePicker,
  TimeSlotPicker,
  EmptyState,
} from '../components/ui';
import BookingConfirmationModal from '../components/BookingConfirmationModal';
import SymptomChecker from '../components/SymptomChecker';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Steps: 0 = Select Hospital, 1 = Symptoms (optional), 2 = Select Doctor, 3 = Date & Time, 4 = Confirm
  const [step, setStep] = useState(0);

  // Symptom checker state
  const [symptomMatchData, setSymptomMatchData] = useState(null);
  const [symptomCheckerUsed, setSymptomCheckerUsed] = useState(false);

  // Hospital data
  const [hospitals, setHospitals] = useState([]);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalsLoading, setHospitalsLoading] = useState(true);

  // Doctor data
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Date/Time data
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

  // Fetch hospitals on mount
  useEffect(() => {
    fetchHospitals();
  }, []);

  // Pre-select hospital (and optionally doctor) if passed via URL query params
  useEffect(() => {
    const hospitalId = searchParams.get('hospitalId');
    if (hospitalId && hospitals.length > 0 && !selectedHospital) {
      const hospital = hospitals.find(
        (h) => h.id === parseInt(hospitalId, 10)
      );
      if (hospital) {
        handleSelectHospital(hospital);
      }
    }
  }, [searchParams, hospitals]);

  // Pre-select doctor if doctorId is in URL and doctors are loaded
  useEffect(() => {
    const doctorId = searchParams.get('doctorId');
    if (doctorId && doctors.length > 0 && !selectedDoctor) {
      const doctor = doctors.find(
        (d) => d.id === parseInt(doctorId, 10)
      );
      if (doctor) {
        setSelectedDoctor(doctor);
      }
    }
  }, [searchParams, doctors]);

  // Fetch available slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchHospitals = async () => {
    setHospitalsLoading(true);
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data);
    } catch (err) {
      const message = getErrorMessage(
        err,
        'Unable to load hospitals. Please refresh the page.'
      );
      setError(message);
      toast.error(message);
    } finally {
      setHospitalsLoading(false);
    }
  };

  const fetchDoctorsForHospital = async (hospitalId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/hospitals/${hospitalId}/doctors`);
      setDoctors(response.data);

      // Extract unique departments from this hospital's doctors
      const uniqueDepartments = [
        ...new Set(response.data.map((d) => d.departmentName)),
      ];
      setDepartments(uniqueDepartments.sort());
    } catch (err) {
      const message = getErrorMessage(
        err,
        'Unable to load doctors for this hospital.'
      );
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    setSlotsLoading(true);
    setError(null);
    setSelectedSlot(null);
    try {
      const response = await api.get(
        `/doctors/${selectedDoctor.id}/available-slots`,
        {
          params: { date: selectedDate },
        }
      );
      const available = response.data.filter((slot) => slot.available);
      setAvailableSlots(available);
    } catch (err) {
      const message = getErrorMessage(
        err,
        'Unable to load available time slots. Please try a different date.'
      );
      setError(message);
      toast.error(message);
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
        patientNotes: patientNotes,
      });
      setBookingResult(response.data);
      setIsBookingSuccess(true);
      toast.success('Appointment booked successfully!', {
        title: 'Booking Confirmed',
        duration: 6000,
      });
    } catch (err) {
      const message = getErrorMessage(
        err,
        'Unable to complete your booking. Please try again.'
      );
      setError(message);
      setShowConfirmModal(false);
      toast.error(message, { title: 'Booking Failed' });
    } finally {
      setBookingLoading(false);
    }
  };

  // Hospital selection
  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
    setSelectedDoctor(null);
    setSelectedDepartment('');
    setSymptomMatchData(null);
    setSymptomCheckerUsed(false);
    setDoctors([]);
    fetchDoctorsForHospital(hospital.id);
    setStep(1);
  };

  // Symptom checker callbacks
  const handleSymptomsMatched = (data) => {
    setSymptomMatchData(data);
    setSymptomCheckerUsed(true);
    if (data.matchedDepartments.length > 0) {
      setSelectedDepartment(data.matchedDepartments[0]);
    }
    setStep(2);
  };

  const handleSkipSymptoms = () => {
    setSymptomCheckerUsed(false);
    setSymptomMatchData(null);
    setStep(2);
  };

  // Open confirmation modal
  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
    setIsBookingSuccess(false);
  };

  // Reset booking form
  const handleBookAnother = () => {
    setStep(0);
    setSymptomMatchData(null);
    setSymptomCheckerUsed(false);
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setSelectedDepartment('');
    setSelectedDate('');
    setSelectedSlot(null);
    setPatientNotes('');
    setBookingResult(null);
    setSuccess(null);
    setShowConfirmModal(false);
    setIsBookingSuccess(false);
    setDoctors([]);
    setHospitalSearch('');
  };

  // Close modal
  const handleCloseModal = () => {
    if (!bookingLoading) {
      setShowConfirmModal(false);
      if (isBookingSuccess) {
        handleBookAnother();
      }
    }
  };

  // Filter hospitals by search
  const filteredHospitals = useMemo(() => {
    if (!hospitalSearch.trim()) return hospitals;
    const term = hospitalSearch.toLowerCase();
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(term) ||
        (h.city && h.city.toLowerCase().includes(term)) ||
        (h.postcode && h.postcode.toLowerCase().includes(term))
    );
  }, [hospitals, hospitalSearch]);

  // Filter and sort doctors by department and symptom match
  const filteredDoctors = useMemo(() => {
    let filtered = doctors;

    if (selectedDepartment) {
      filtered = filtered.filter((d) => d.departmentName === selectedDepartment);
    }

    if (
      symptomMatchData &&
      symptomMatchData.recommendedDoctorIds &&
      symptomMatchData.recommendedDoctorIds.length > 0
    ) {
      const recommendedIds = new Set(symptomMatchData.recommendedDoctorIds);
      const recommended = filtered.filter((d) => recommendedIds.has(d.id));
      const others = filtered.filter((d) => !recommendedIds.has(d.id));
      filtered = [...recommended, ...others];
    }

    return filtered;
  }, [doctors, selectedDepartment, symptomMatchData]);

  // Get minimum date (today) and maximum date (90 days from now)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // ==================== STEP RENDERERS ====================

  // Step 0: Select Hospital
  const renderHospitalSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Select a Hospital
        </h2>
        <p className="text-gray-600">
          Choose the NHS hospital where you'd like to book your appointment.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={hospitalSearch}
          onChange={(e) => setHospitalSearch(e.target.value)}
          placeholder="Search by hospital name, city, or postcode..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
        />
        {hospitalSearch && (
          <button
            onClick={() => setHospitalSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>

      {hospitalsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            {filteredHospitals.length} hospital
            {filteredHospitals.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                onClick={() => handleSelectHospital(hospital)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedHospital?.id === hospital.id
                    ? 'border-teal-500 bg-teal-50 shadow-sm'
                    : 'border-gray-200 hover:border-teal-200 hover:shadow-soft'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-3 rounded-xl flex-shrink-0 ${
                      selectedHospital?.id === hospital.id
                        ? 'bg-teal-500'
                        : 'bg-teal-100'
                    }`}
                  >
                    <FiMapPin
                      className={`h-5 w-5 ${
                        selectedHospital?.id === hospital.id
                          ? 'text-white'
                          : 'text-teal-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {hospital.name}
                    </h3>
                    {hospital.city && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        {hospital.city}
                        {hospital.postcode && ` · ${hospital.postcode}`}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">
                        {hospital.doctorCount} doctor
                        {hospital.doctorCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">
                        {hospital.departmentCount} dept
                        {hospital.departmentCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {selectedHospital?.id === hospital.id && (
                    <FiCheck className="h-5 w-5 text-teal-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredHospitals.length === 0 && (
            <EmptyState
              icon={FiMapPin}
              title="No hospitals found"
              description={
                hospitalSearch
                  ? `No hospitals match "${hospitalSearch}". Try a different search term.`
                  : 'No hospitals are available at the moment.'
              }
              actionLabel={hospitalSearch ? 'Clear Search' : undefined}
              onAction={hospitalSearch ? () => setHospitalSearch('') : undefined}
            />
          )}
        </>
      )}
    </div>
  );

  // Step 2: Select Doctor
  const renderDoctorSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Select a Doctor
        </h2>
        <p className="text-gray-600">
          Showing doctors at{' '}
          <span className="font-medium text-teal-700">
            {selectedHospital?.name}
          </span>
        </p>
      </div>

      {/* Symptom match info banner */}
      {symptomMatchData && (
        <div className="bg-success-50 border border-success-200 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-success-800">
                Doctors matched to your symptoms
              </p>
              <p className="text-sm text-success-700 mt-1">
                Based on: {symptomMatchData.selectedSymptoms.join(', ')}.
                {' '}Recommended: {symptomMatchData.matchedDepartments.join(', ')}.
              </p>
            </div>
            <button
              onClick={() => setSymptomMatchData(null)}
              className="text-success-600 hover:text-success-800 text-sm font-medium flex-shrink-0 ml-4"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Department filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Department
        </label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor)}
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedDoctor?.id === doctor.id
                  ? 'border-primary-500 bg-primary-50 shadow-primary-sm'
                  : 'border-gray-200 hover:border-primary-200 hover:shadow-soft'
              }`}
            >
              {/* Recommended badge */}
              {symptomMatchData?.recommendedDoctorIds?.includes(doctor.id) && (
                <div className="mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-success-100 text-success-700 border border-success-200">
                    Recommended
                  </span>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <div
                  className={`p-3 rounded-xl ${
                    selectedDoctor?.id === doctor.id
                      ? 'bg-primary-500'
                      : 'bg-primary-100'
                  }`}
                >
                  <FiUser
                    className={`h-6 w-6 ${
                      selectedDoctor?.id === doctor.id
                        ? 'text-white'
                        : 'text-primary-600'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    Dr. {doctor.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  <p className="text-sm text-primary-600 font-medium">
                    {doctor.departmentName}
                  </p>
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
        <EmptyState
          icon={FiUser}
          title="No doctors found"
          description={
            selectedDepartment
              ? 'No doctors are available in this department at this hospital. Try selecting a different department.'
              : 'No doctors are currently available at this hospital.'
          }
          actionLabel={selectedDepartment ? 'Show All Departments' : undefined}
          onAction={
            selectedDepartment ? () => setSelectedDepartment('') : undefined
          }
        />
      )}
    </div>
  );

  // Step 3: Select Date and Time
  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Select Date & Time
        </h2>
        <p className="text-gray-600">
          Booking with{' '}
          <span className="font-medium">Dr. {selectedDoctor?.fullName}</span> at{' '}
          <span className="font-medium text-teal-700">
            {selectedHospital?.name}
          </span>
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

  // Step 4: Confirmation
  const renderConfirmation = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Confirm Your Appointment
      </h2>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-100">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Hospital</span>
          <span className="font-medium text-teal-700">
            {selectedHospital?.name}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Doctor</span>
          <span className="font-medium text-gray-900">
            Dr. {selectedDoctor?.fullName}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Specialty</span>
          <span className="font-medium text-gray-900">
            {selectedDoctor?.specialty}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Department</span>
          <span className="font-medium text-primary-600">
            {selectedDoctor?.departmentName}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 gap-2">
          <span className="text-gray-500 flex-shrink-0">Date</span>
          <span className="font-medium text-gray-900 text-right">
            {new Date(selectedDate).toLocaleDateString('en-GB', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Time</span>
          <span className="font-medium text-gray-900">
            {formatTime(selectedSlot?.startTime)} -{' '}
            {formatTime(selectedSlot?.endTime)}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500">Consultation Fee</span>
          <span className="font-semibold text-success-600">
            £{selectedDoctor?.consultationFee}
          </span>
        </div>
        {patientNotes && (
          <div className="pt-2">
            <span className="text-gray-500 block mb-2">Your Notes</span>
            <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
              {patientNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Step 5: Success
  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-2xl">
        <FiCheck className="h-8 w-8 text-success-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900">
        Appointment Booked!
      </h2>
      <p className="text-gray-600">Your appointment has been confirmed.</p>

      {bookingResult && (
        <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto space-y-3 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Confirmation #</span>
            <span className="font-mono font-semibold text-primary-600">
              {bookingResult.confirmationNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Hospital</span>
            <span className="font-medium text-teal-700">
              {selectedHospital?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Doctor</span>
            <span className="font-medium text-gray-900">
              {bookingResult.doctorName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-900">
              {bookingResult.appointmentDate}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-medium text-gray-900">
              {formatTime(bookingResult.startTime)}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4 pt-4">
        <Button variant="outline" onClick={handleBookAnother}>
          Book Another
        </Button>
        <Button onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );

  // ==================== NAVIGATION ====================

  const renderNavigation = () => {
    if (step === 5) return null;

    return (
      <div className="flex justify-between pt-6 border-t border-gray-200">
        {/* Back button */}
        {step > 0 && step !== 1 ? (
          <Button
            variant="outline"
            onClick={() => {
              if (step === 2) {
                setStep(1);
              } else {
                setStep(step - 1);
              }
            }}
          >
            <FiArrowLeft className="mr-2" />
            Back
          </Button>
        ) : step === 1 ? (
          <Button
            variant="outline"
            onClick={() => {
              setSelectedHospital(null);
              setDoctors([]);
              setStep(0);
            }}
          >
            <FiArrowLeft className="mr-2" />
            Change Hospital
          </Button>
        ) : (
          <div />
        )}

        {/* Next / Confirm button */}
        {step === 0 && (
          <Button onClick={() => setStep(1)} disabled={!selectedHospital}>
            Next
            <FiArrowRight className="ml-2" />
          </Button>
        )}

        {step === 2 && (
          <Button onClick={() => setStep(3)} disabled={!selectedDoctor}>
            Next
            <FiArrowRight className="ml-2" />
          </Button>
        )}

        {step === 3 && (
          <Button
            onClick={() => setStep(4)}
            disabled={!selectedDate || !selectedSlot}
          >
            Next
            <FiArrowRight className="ml-2" />
          </Button>
        )}

        {step === 4 && (
          <Button onClick={handleOpenConfirmModal} disabled={bookingLoading}>
            <FiCheck className="mr-2" />
            Confirm Booking
          </Button>
        )}
      </div>
    );
  };

  // ==================== PROGRESS BAR ====================

  const renderProgress = () => {
    if (step === 5) return null;

    const progressSteps = [
      { num: 0, label: 'Hospital' },
      { num: 1, label: 'Symptoms' },
      { num: 2, label: 'Doctor' },
      { num: 3, label: 'Date & Time' },
      { num: 4, label: 'Confirm' },
    ];

    return (
      <div className="mb-8 overflow-x-auto">
        <div className="flex items-center justify-center min-w-0">
          {progressSteps.map((s, index) => (
            <div key={s.num} className="flex items-center flex-shrink-0">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  step >= s.num
                    ? 'bg-primary-600 text-white shadow-primary-sm'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {step > s.num ? <FiCheck /> : index + 1}
              </div>
              <span
                className={`ml-2 text-sm hidden sm:inline ${
                  step >= s.num
                    ? 'text-primary-700 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
              {index < progressSteps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-1 mx-2 sm:mx-4 rounded-full transition-colors duration-200 ${
                    step > s.num ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Book Appointment
        </h1>
        <p className="text-gray-600 mt-1">
          Select a hospital, then choose your doctor and time
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {success && step !== 5 && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
          className="mb-6"
        />
      )}

      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        {renderProgress()}

        {step === 0 && renderHospitalSelection()}
        {step === 1 && (
          <SymptomChecker
            onSymptomsMatched={handleSymptomsMatched}
            onSkip={handleSkipSymptoms}
            hospitalId={selectedHospital?.id}
          />
        )}
        {step === 2 && renderDoctorSelection()}
        {step === 3 && renderDateTimeSelection()}
        {step === 4 && renderConfirmation()}
        {step === 5 && renderSuccess()}

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
