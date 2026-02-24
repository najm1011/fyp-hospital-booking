import { useNavigate } from 'react-router-dom';
import {
  FiMapPin,
  FiPhone,
  FiUsers,
  FiGrid,
  FiExternalLink,
  FiArrowRight,
} from 'react-icons/fi';
import { Button } from './ui';

const HospitalCard = ({ hospital, onViewDetails }) => {
  const navigate = useNavigate();

  // Generate initials for avatar placeholder
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on hospital id
  const getGradient = (id) => {
    const gradients = [
      'from-teal-500 to-cyan-600',
      'from-sky-500 to-blue-600',
      'from-emerald-500 to-teal-600',
      'from-cyan-500 to-blue-600',
      'from-blue-500 to-indigo-600',
      'from-indigo-500 to-violet-600',
    ];
    return gradients[id % gradients.length];
  };

  const handleViewDoctors = () => {
    navigate(`/hospitals/${hospital.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100/80 overflow-hidden hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 group">
      {/* Card Header */}
      <div className={`bg-gradient-to-br ${getGradient(hospital.id)} px-6 py-5`}>
        <div className="flex items-center space-x-4">
          {/* Hospital Icon */}
          <div className="h-16 w-16 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300">
            {getInitials(hospital.name)}
          </div>
          <div className="text-white flex-1 min-w-0">
            <h3 className="text-lg font-bold truncate">{hospital.name}</h3>
            {hospital.odsCode && (
              <p className="text-white/70 text-sm">ODS: {hospital.odsCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-start mb-3">
          <FiMapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            {hospital.address1 && <span>{hospital.address1}</span>}
            {hospital.city && <span>, {hospital.city}</span>}
            {hospital.postcode && (
              <span className="font-medium text-gray-700"> {hospital.postcode}</span>
            )}
          </div>
        </div>

        {/* Phone */}
        {hospital.phone && (
          <div className="flex items-center mb-4 text-sm text-gray-600">
            <FiPhone className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <span>{hospital.phone}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
            <FiUsers className="h-3 w-3 mr-1.5" />
            {hospital.doctorCount} {hospital.doctorCount === 1 ? 'Doctor' : 'Doctors'}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
            <FiGrid className="h-3 w-3 mr-1.5" />
            {hospital.departmentCount} {hospital.departmentCount === 1 ? 'Dept' : 'Depts'}
          </span>
        </div>

        {/* Website */}
        {hospital.website && (
          <div className="flex items-center mb-4 text-sm">
            <FiExternalLink className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
            <a
              href={hospital.website.startsWith('http') ? hospital.website : `https://${hospital.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 truncate"
            >
              {hospital.website}
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {onViewDetails && (
            <Button variant="outline" onClick={() => onViewDetails(hospital)} className="flex-1">
              Details
            </Button>
          )}
          <Button onClick={handleViewDoctors} className={onViewDetails ? 'flex-1' : 'w-full'}>
            View Doctors
            <FiArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
