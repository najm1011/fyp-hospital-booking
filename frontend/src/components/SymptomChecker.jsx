import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiX, FiActivity, FiArrowRight } from 'react-icons/fi';
import api from '../services/api';
import { LoadingSpinner, Alert } from './ui';
import { Button } from './ui';

const SymptomChecker = ({ onSymptomsMatched, onSkip, hospitalId }) => {
  const [symptomsByCategory, setSymptomsByCategory] = useState({});
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await api.get('/symptoms');
      setSymptomsByCategory(response.data.symptomsByCategory);
    } catch (err) {
      setError('Unable to load symptoms. Please try again or skip this step.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleFindDoctors = async () => {
    if (selectedSymptoms.length === 0) return;
    setMatching(true);
    setError(null);
    try {
      const payload = { symptoms: selectedSymptoms };
      if (hospitalId) {
        payload.hospitalId = hospitalId;
      }
      const response = await api.post('/symptoms/match', payload);
      onSymptomsMatched({
        selectedSymptoms,
        matchedDepartments: response.data.matchedDepartments,
        departmentScores: response.data.departmentScores,
        recommendedDoctorIds: response.data.recommendedDoctors.map(d => d.id),
      });
    } catch (err) {
      setError('Unable to match symptoms. Please try again or skip this step.');
    } finally {
      setMatching(false);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return symptomsByCategory;
    const term = searchTerm.toLowerCase();
    const filtered = {};
    for (const [category, symptoms] of Object.entries(symptomsByCategory)) {
      const matched = symptoms.filter(s => s.toLowerCase().includes(term));
      if (matched.length > 0) filtered[category] = matched;
    }
    return filtered;
  }, [symptomsByCategory, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          What symptoms are you experiencing?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select your symptoms and we'll recommend the best doctors for you.
          You can also{' '}
          <button
            onClick={onSkip}
            className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2 transition-colors"
          >
            skip this step
          </button>{' '}
          and choose a doctor directly.
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search symptoms..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Selected Summary */}
      {selectedSymptoms.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <p className="text-sm font-medium text-primary-700 mb-2">
            Selected symptoms ({selectedSymptoms.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(symptom => (
              <span
                key={symptom}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-600 text-white cursor-pointer hover:bg-primary-700 transition-colors"
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
                <FiX className="ml-1.5 h-3.5 w-3.5" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Symptom Categories */}
      <div className="space-y-5">
        {Object.entries(filteredCategories).map(([category, symptoms]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2.5 flex items-center">
              <FiActivity className="h-4 w-4 mr-2 text-primary-500" />
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(symptom => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-primary-sm'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-200 hover:shadow-soft'
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(filteredCategories).length === 0 && searchTerm && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No symptoms found matching "{searchTerm}"
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
        <Button variant="outline" onClick={onSkip}>
          Skip
        </Button>
        <Button
          onClick={handleFindDoctors}
          disabled={selectedSymptoms.length === 0 || matching}
          loading={matching}
        >
          Find Matching Doctors
          <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SymptomChecker;
