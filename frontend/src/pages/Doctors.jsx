import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiUser } from 'react-icons/fi';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';
import { Button, LoadingSpinner, Alert } from '../components/ui';
import DoctorCard from '../components/DoctorCard';
import DoctorDetailModal from '../components/DoctorDetailModal';

const Doctors = () => {
  // Data states
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, fee-low, fee-high

  // Modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);

      // Extract unique departments
      const uniqueDepartments = [...new Set(response.data.map((d) => d.departmentName))];
      setDepartments(uniqueDepartments.sort());
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load the doctor list. Please refresh the page.'));
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort doctors
  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch =
        doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        !selectedDepartment || doctor.departmentName === selectedDepartment;
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'fee-low':
          return a.consultationFee - b.consultationFee;
        case 'fee-high':
          return b.consultationFee - a.consultationFee;
        case 'name':
        default:
          return a.fullName.localeCompare(b.fullName);
      }
    });

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Find Doctors</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Browse our qualified doctors and book an appointment
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Department Filter */}
          <div className="md:w-48">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white dark:bg-gray-800"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white dark:bg-gray-800"
            >
              <option value="name">Sort by Name</option>
              <option value="fee-low">Fee: Low to High</option>
              <option value="fee-high">Fee: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedDepartment) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1.5 hover:text-primary-900"
                >
                  &times;
                </button>
              </span>
            )}
            {selectedDepartment && (
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700">
                {selectedDepartment}
                <button
                  onClick={() => setSelectedDepartment('')}
                  className="ml-1.5 hover:text-primary-900"
                >
                  &times;
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('');
              }}
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />
      )}

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </p>
      )}

      {/* Doctors Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onViewDetails={() => handleViewDoctor(doctor)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-soft">
          <div className="bg-gray-50 dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUser className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No doctors found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedDepartment('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Doctor Detail Modal */}
      <DoctorDetailModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Doctors;
