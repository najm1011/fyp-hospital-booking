import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiMapPin,
  FiPhone,
  FiExternalLink,
  FiUsers,
  FiGrid,
  FiArrowLeft,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';
import { useAuth } from '../context/AuthContext';
import { Button, LoadingSpinner, Alert } from '../components/ui';
import DoctorCard from '../components/DoctorCard';

const HospitalDetail = () => {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHospitalData();
  }, [hospitalId]);

  const fetchHospitalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hospitalRes, doctorsRes] = await Promise.all([
        api.get(`/hospitals/${hospitalId}`),
        api.get(`/hospitals/${hospitalId}/doctors`),
      ]);
      setHospital(hospitalRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load hospital details. Please try again.'));
      console.error('Error fetching hospital:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate gradient based on id
  const getGradient = (id) => {
    const gradients = [
      'from-teal-600 via-teal-700 to-cyan-800',
      'from-sky-600 via-sky-700 to-blue-800',
      'from-emerald-600 via-emerald-700 to-teal-800',
      'from-cyan-600 via-cyan-700 to-blue-800',
      'from-blue-600 via-blue-700 to-indigo-800',
      'from-indigo-600 via-indigo-700 to-violet-800',
    ];
    return gradients[id % gradients.length];
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
      <div className="max-w-4xl mx-auto">
        <Alert type="error" message={error} />
        <Button variant="outline" onClick={() => navigate('/hospitals')} className="mt-4">
          <FiArrowLeft className="mr-2" />
          Back to Hospitals
        </Button>
      </div>
    );
  }

  if (!hospital) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/hospitals')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <FiArrowLeft className="mr-2 h-4 w-4" />
        Back to Hospitals
      </button>

      {/* Hospital Header Card */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden mb-8">
        <div className={`bg-gradient-to-br ${getGradient(hospital.id)} px-6 sm:px-8 py-8`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Hospital Icon */}
            <div className="h-24 w-24 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold border-4 border-white/20 shadow-lg">
              {hospital.name.split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase()}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left text-white flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{hospital.name}</h1>
              {hospital.odsCode && (
                <p className="text-white/70 mt-1">ODS Code: {hospital.odsCode}</p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start mt-3 gap-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm bg-white/15 backdrop-blur-sm">
                  <FiUsers className="h-4 w-4 mr-1.5" />
                  {hospital.doctorCount} Doctors
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm bg-white/15 backdrop-blur-sm">
                  <FiGrid className="h-4 w-4 mr-1.5" />
                  {hospital.departmentCount} Departments
                </span>
              </div>
              {isAuthenticated && user?.role === 'PATIENT' && (
                <button
                  onClick={() => navigate(`/appointments/book?hospitalId=${hospital.id}`)}
                  className="mt-4 inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-teal-700 hover:bg-teal-50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <FiCalendar className="h-4 w-4 mr-2" />
                  Book at this Hospital
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hospital Details Body */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Address */}
            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
              <FiMapPin className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-900">
                  {hospital.address1}
                  {hospital.address2 && <>, {hospital.address2}</>}
                  {hospital.city && <><br />{hospital.city}</>}
                  {hospital.county && <>, {hospital.county}</>}
                  {hospital.postcode && <><br /><span className="font-medium">{hospital.postcode}</span></>}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
              <FiPhone className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm text-gray-900">{hospital.phone || 'Not available'}</p>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
              <FiExternalLink className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Website</p>
                {hospital.website ? (
                  <a
                    href={hospital.website.startsWith('http') ? hospital.website : `https://${hospital.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 break-all"
                  >
                    {hospital.website}
                  </a>
                ) : (
                  <p className="text-sm text-gray-900">Not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Doctors at this Hospital
          </h2>
          <span className="text-sm text-gray-500">{doctors.length} doctors</span>
        </div>

        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBookClick={(doc) => navigate(`/appointments/book?hospitalId=${hospital.id}&doctorId=${doc.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-soft">
            <div className="bg-amber-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiUser className="h-10 w-10 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors registered yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              This hospital doesn't have any doctors registered on our platform yet.
              You can browse other NHS hospitals that have doctors available for booking.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/hospitals')}
            >
              <FiArrowLeft className="mr-2" />
              Browse Other Hospitals
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDetail;
