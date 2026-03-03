import { useState, useEffect } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';
import { Button, LoadingSpinner, Alert } from '../components/ui';
import HospitalCard from '../components/HospitalCard';

const Hospitals = () => {
  // Data states
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, doctors

  // Fetch hospitals on mount
  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load hospitals. Please refresh the page.'));
      console.error('Error fetching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort hospitals
  const filteredHospitals = hospitals
    .filter((hospital) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        hospital.name.toLowerCase().includes(term) ||
        (hospital.city && hospital.city.toLowerCase().includes(term)) ||
        (hospital.postcode && hospital.postcode.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'doctors':
          return b.doctorCount - a.doctorCount;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-teal-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
            <FiMapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">NHS Hospitals</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-0.5">
              Browse NHS hospitals and find doctors near you
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by hospital name, city, or postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Sort */}
          <div className="md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white dark:bg-gray-800"
            >
              <option value="name">Sort by Name</option>
              <option value="doctors">Most Doctors</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {searchTerm && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1.5 hover:text-primary-900"
              >
                &times;
              </button>
            </span>
            <button
              onClick={() => setSearchTerm('')}
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
          Showing {filteredHospitals.length} of {hospitals.length} hospitals
        </p>
      )}

      {/* Hospitals Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : filteredHospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-soft">
          <div className="bg-gray-50 dark:bg-gray-800/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiMapPin className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No hospitals found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your search criteria
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchTerm('')}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
