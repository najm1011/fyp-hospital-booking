import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
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
import { getErrorMessage } from '../utils/errorMessages';
import { Button, LoadingSpinner, Alert } from '../components/ui';

const DoctorDetail = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const [doctorRes, availabilityRes] = await Promise.all([
        api.get(`/doctors/${doctorId}`),
        api.get(`/doctors/${doctorId}/availability`).catch(() => null),
      ]);
      setDoctor(doctorRes.data);
      if (availabilityRes) {
        setAvailability(availabilityRes.data);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load doctor details. Please go back and try again.'));
      console.error('Error fetching doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert type="error" message={error} />
        <Button variant="outline" onClick={() => navigate('/doctors')} className="mt-4">
          <FiArrowLeft className="mr-2" />
          Back to Doctors
        </Button>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <FiUser className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Doctor not found</h3>
        <Button variant="outline" onClick={() => navigate('/doctors')}>
          <FiArrowLeft className="mr-2" />
          Back to Doctors
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/doctors')}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
      >
        <FiArrowLeft className="h-5 w-5 mr-2" />
        Back to Doctors
      </button>

      {/* Doctor Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Photo/Avatar */}
            {doctor.photoUrl && (
              <img
                src={doctor.photoUrl}
                alt={doctor.fullName}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            )}
            <div
              className={`h-32 w-32 rounded-full ${getAvatarColor(doctor.id)} items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg`}
              style={{ display: doctor.photoUrl ? 'none' : 'flex' }}
            >
              {getInitials(doctor.fullName)}
            </div>

            {/* Basic Info */}
            <div className="text-center sm:text-left text-white flex-1">
              <h1 className="text-3xl font-bold">Dr. {doctor.fullName}</h1>
              <p className="text-primary-100 text-xl mt-1">{doctor.specialty}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start mt-3 gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/20">
                  <FiMapPin className="h-4 w-4 mr-1" />
                  {doctor.departmentName}
                </span>
                <span className="inline-flex items-center text-sm">
                  <FiStar className="h-4 w-4 text-yellow-300 fill-current mr-1" />
                  4.8 (120 reviews)
                </span>
              </div>
            </div>

            {/* Book Button (Desktop) */}
            <div className="hidden sm:block">
              <Button
                onClick={handleBookAppointment}
                className="bg-white dark:bg-gray-800 text-primary-600 hover:bg-primary-50"
              >
                <FiCalendar className="mr-2" />
                Book Now
              </Button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Qualifications */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  <FiAward className="h-5 w-5 mr-2 text-primary-500" />
                  Qualifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{doctor.qualifications}</p>
              </div>

              {/* About */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  <FiUser className="h-5 w-5 mr-2 text-primary-500" />
                  About
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{doctor.bio}</p>
              </div>

              {/* Availability */}
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  <FiClock className="h-5 w-5 mr-2 text-primary-500" />
                  Weekly Schedule
                </h3>
                {availability?.weeklySchedule ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(
                      (day) => {
                        const slots = availability.weeklySchedule[day] || [];
                        return (
                          <div
                            key={day}
                            className={`p-3 rounded-lg text-center ${
                              slots.length > 0
                                ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800'
                                : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {day.slice(0, 3)}
                            </p>
                            {slots.length > 0 ? (
                              <div className="mt-1">
                                <FiCheckCircle className="h-4 w-4 text-success-500 mx-auto" />
                                <p className="text-xs text-success-600 mt-1">
                                  {slots[0].startTime?.slice(0, 5)}
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Off</p>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                      <div
                        key={day}
                        className="p-3 rounded-lg text-center bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800"
                      >
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{day}</p>
                        <FiCheckCircle className="h-4 w-4 text-success-500 mx-auto mt-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiMail className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100 break-all">{doctor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiPhone className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">{doctor.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Card */}
              <div className="bg-gradient-to-br from-success-50 to-emerald-50 dark:from-success-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-success-100 dark:border-success-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Consultation Fee</p>
                    <p className="text-3xl font-bold text-success-600">
                      £{doctor.consultationFee}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">per visit</p>
                  </div>
                  <LuPoundSterling className="h-12 w-12 text-success-500 opacity-30" />
                </div>
              </div>

              {/* Book Button */}
              <Button onClick={handleBookAppointment} className="w-full" size="large">
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

export default DoctorDetail;
