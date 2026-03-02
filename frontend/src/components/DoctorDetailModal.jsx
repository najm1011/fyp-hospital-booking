import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiX,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiPhone,
  FiMail,
  FiAward,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import { LuPoundSterling } from 'react-icons/lu';
import api from '../services/api';
import { Button, LoadingSpinner } from './ui';
import useModalAccessibility from '../hooks/useModalAccessibility';

const DoctorDetailModal = ({ doctor, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useModalAccessibility(isOpen, onClose);

  useEffect(() => {
    if (isOpen && doctor) {
      fetchAvailability();
    }
  }, [isOpen, doctor]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/doctors/${doctor.id}/availability`);
      setAvailability(response.data);
    } catch (err) {
      console.error('Error fetching availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    onClose();
    navigate('/appointments/book', { state: { selectedDoctor: doctor } });
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate avatar color
  const getAvatarColor = (id) => {
    const colors = [
      'bg-blue-500',
      'bg-success-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-primary-500',
      'bg-orange-500',
      'bg-primary-500',
    ];
    return colors[id % colors.length];
  };

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Doctor details: Dr. ${doctor.fullName}`}
          className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>

          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-6">
              {/* Photo/Avatar */}
              {doctor.photoUrl && (
                <img
                  src={doctor.photoUrl}
                  alt={doctor.fullName}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              )}
              <div
                className={`h-20 w-20 sm:h-24 sm:w-24 rounded-full ${getAvatarColor(doctor.id)} items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-white shadow-lg flex-shrink-0`}
                style={{ display: doctor.photoUrl ? 'none' : 'flex' }}
              >
                {getInitials(doctor.fullName)}
              </div>

              {/* Basic Info */}
              <div className="text-white text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">Dr. {doctor.fullName}</h2>
                <p className="text-primary-100 text-base sm:text-lg">{doctor.specialty}</p>
                <div className="flex items-center justify-center sm:justify-start mt-2 space-x-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/20">
                    <FiMapPin className="h-3 w-3 mr-1" />
                    {doctor.departmentName}
                  </span>
                  <span className="inline-flex items-center text-sm">
                    <FiStar className="h-4 w-4 text-yellow-300 fill-current mr-1" />
                    4.8
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body - Scrollable */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)] sm:max-h-[calc(90vh-250px)]">
            {/* Qualifications */}
            <div className="mb-6">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                <FiAward className="h-4 w-4 mr-2 text-primary-500" />
                Qualifications
              </h3>
              <p className="text-gray-600">{doctor.qualifications}</p>
            </div>

            {/* About */}
            <div className="mb-6">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                <FiUser className="h-4 w-4 mr-2 text-primary-500" />
                About
              </h3>
              <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FiMail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 truncate">{doctor.email}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FiPhone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{doctor.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <h3 className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                <FiClock className="h-4 w-4 mr-2 text-primary-500" />
                Weekly Availability
              </h3>
              {loading ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner />
                </div>
              ) : availability?.weeklySchedule ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {Object.entries(availability.weeklySchedule).map(([day, slots]) => (
                    <div
                      key={day}
                      className={`p-3 rounded-lg text-center ${
                        slots.length > 0
                          ? 'bg-success-50 border border-success-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-medium text-gray-700 capitalize">
                        {day.toLowerCase()}
                      </p>
                      {slots.length > 0 ? (
                        <p className="text-xs text-success-600 mt-1">
                          {slots[0].startTime.slice(0, 5)} - {slots[slots.length - 1].endTime.slice(0, 5)}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">Off</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                    <div
                      key={day}
                      className="p-3 rounded-lg text-center bg-success-50 border border-success-200"
                    >
                      <p className="text-xs font-medium text-gray-700">{day}</p>
                      <p className="text-xs text-success-600 mt-1">
                        <FiCheckCircle className="inline h-3 w-3 mr-1" />
                        Available
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Consultation Fee */}
            <div className="bg-gradient-to-r from-success-50 to-emerald-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="text-2xl font-bold text-success-600">
                    £{doctor.consultationFee}
                  </p>
                </div>
                <LuPoundSterling className="h-10 w-10 text-success-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button onClick={handleBookAppointment} className="flex-1">
                <FiCalendar className="mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailModal;
