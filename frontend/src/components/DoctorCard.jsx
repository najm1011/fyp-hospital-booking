import { useNavigate } from 'react-router-dom';
import {
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiStar,
  FiPhone,
  FiMail,
  FiAward,
} from 'react-icons/fi';
import { Button } from './ui';

const DoctorCard = ({
  doctor,
  variant = 'default', // 'default', 'compact', 'detailed'
  showBookButton = true,
  onBookClick,
  onViewDetails,
}) => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (onBookClick) {
      onBookClick(doctor);
    } else {
      navigate('/appointments/book', { state: { selectedDoctor: doctor } });
    }
  };

  // Generate initials for avatar placeholder
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on doctor id
  const getAvatarColor = (id) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    return colors[id % colors.length];
  };

  // Compact variant - for lists and small spaces
  if (variant === 'compact') {
    return (
      <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {doctor.photoUrl ? (
            <img
              src={doctor.photoUrl}
              alt={doctor.fullName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div
              className={`h-12 w-12 rounded-full ${getAvatarColor(doctor.id)} flex items-center justify-center text-white font-semibold`}
            >
              {getInitials(doctor.fullName)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="ml-4 flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            Dr. {doctor.fullName}
          </h4>
          <p className="text-xs text-gray-500 truncate">{doctor.specialty}</p>
          <div className="flex items-center mt-1">
            <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="ml-1 text-xs text-gray-600">4.8</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-xs text-green-600 font-medium">
              ${doctor.consultationFee}
            </span>
          </div>
        </div>

        {/* Book Button */}
        {showBookButton && (
          <Button size="small" onClick={handleBookClick}>
            Book
          </Button>
        )}
      </div>
    );
  }

  // Detailed variant - for doctor profile pages
  if (variant === 'detailed') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Photo */}
            {doctor.photoUrl ? (
              <img
                src={doctor.photoUrl}
                alt={doctor.fullName}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div
                className={`h-32 w-32 rounded-full ${getAvatarColor(doctor.id)} flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg`}
              >
                {getInitials(doctor.fullName)}
              </div>
            )}

            {/* Basic Info */}
            <div className="text-center sm:text-left text-white">
              <h2 className="text-2xl font-bold">Dr. {doctor.fullName}</h2>
              <p className="text-blue-100 text-lg">{doctor.specialty}</p>
              <div className="flex items-center justify-center sm:justify-start mt-2 space-x-4">
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
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Qualifications */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <FiAward className="inline h-4 w-4 mr-2" />
              Qualifications
            </h3>
            <p className="text-gray-600">{doctor.qualifications}</p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              About
            </h3>
            <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
          </div>

          {/* Contact & Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FiMail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-900 truncate">{doctor.email}</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-gray-900">{doctor.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <FiDollarSign className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Consultation Fee</p>
                <p className="text-sm font-semibold text-green-600">
                  ${doctor.consultationFee}
                </p>
              </div>
            </div>
          </div>

          {/* Book Button */}
          {showBookButton && (
            <Button onClick={handleBookClick} className="w-full" size="large">
              <FiCalendar className="mr-2" />
              Book Appointment
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default variant - card for grid layout
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Photo/Avatar */}
          {doctor.photoUrl ? (
            <img
              src={doctor.photoUrl}
              alt={doctor.fullName}
              className="h-16 w-16 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div
              className={`h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/50`}
            >
              {getInitials(doctor.fullName)}
            </div>
          )}
          <div className="text-white flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">Dr. {doctor.fullName}</h3>
            <p className="text-blue-100 text-sm truncate">{doctor.specialty}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Department & Rating */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <FiMapPin className="h-3 w-3 mr-1" />
            {doctor.departmentName}
          </span>
          <div className="flex items-center">
            <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">4.8</span>
            <span className="ml-1 text-xs text-gray-500">(120)</span>
          </div>
        </div>

        {/* Qualifications */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-1">
          <FiAward className="inline h-4 w-4 mr-1 text-gray-400" />
          {doctor.qualifications}
        </p>

        {/* Bio */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{doctor.bio}</p>

        {/* Contact Info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <FiMail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiPhone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{doctor.phoneNumber}</span>
          </div>
        </div>

        {/* Fee & Book */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <FiDollarSign className="h-5 w-5 text-green-500" />
            <span className="text-xl font-bold text-gray-900">{doctor.consultationFee}</span>
            <span className="text-gray-500 text-sm ml-1">/ visit</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {onViewDetails && (
            <Button variant="outline" onClick={() => onViewDetails(doctor)} className="flex-1">
              View Details
            </Button>
          )}
          {showBookButton && (
            <Button onClick={handleBookClick} className={onViewDetails ? "flex-1" : "w-full"}>
              <FiCalendar className="mr-2" />
              Book
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
