import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiClock,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiRefreshCw,
  FiArrowLeft,
  FiCheck,
  FiToggleLeft,
  FiToggleRight,
  FiCalendar,
  FiCopy,
  FiZap,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, Button, Alert, LoadingSpinner } from '../components/ui';
import api from '../services/api';

const DAYS_OF_WEEK = [
  { value: 'MONDAY', label: 'Monday', short: 'Mon' },
  { value: 'TUESDAY', label: 'Tuesday', short: 'Tue' },
  { value: 'WEDNESDAY', label: 'Wednesday', short: 'Wed' },
  { value: 'THURSDAY', label: 'Thursday', short: 'Thu' },
  { value: 'FRIDAY', label: 'Friday', short: 'Fri' },
  { value: 'SATURDAY', label: 'Saturday', short: 'Sat' },
  { value: 'SUNDAY', label: 'Sunday', short: 'Sun' },
];

const TIME_OPTIONS = [];
for (let hour = 6; hour <= 21; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const displayHour = hour % 12 || 12;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    TIME_OPTIONS.push({ value: timeString, label: displayTime });
  }
}

const QUICK_SETUP_TEMPLATES = [
  {
    name: 'Standard (Mon-Fri, 9-5)',
    days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    name: 'Extended (Mon-Fri, 8-6)',
    days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    startTime: '08:00',
    endTime: '18:00',
  },
  {
    name: 'Morning Only (Mon-Fri, 8-12)',
    days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    startTime: '08:00',
    endTime: '12:00',
  },
  {
    name: 'Afternoon Only (Mon-Fri, 1-5)',
    days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    startTime: '13:00',
    endTime: '17:00',
  },
  {
    name: 'Full Week (Mon-Sat, 9-5)',
    days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    startTime: '09:00',
    endTime: '17:00',
  },
];

const AvailabilitySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Data states
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
  });
  const [copyToDays, setCopyToDays] = useState([]);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Quick setup states
  const [quickSetupData, setQuickSetupData] = useState({
    selectedDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    startTime: '09:00',
    endTime: '17:00',
    replaceExisting: true,
  });

  // Action loading states
  const [actionLoading, setActionLoading] = useState({});

  // Fetch data on mount
  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await api.get('/doctors/me/availability/slots');
      setTimeSlots(response.data || []);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load availability settings. Please try again.');
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Group slots by day
  const getSlotsByDay = () => {
    const grouped = {};
    DAYS_OF_WEEK.forEach((day) => {
      grouped[day.value] = timeSlots
        .filter((slot) => slot.dayOfWeek === day.value)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Handle add new slot
  const handleAddSlot = () => {
    setEditingSlot(null);
    setFormData({
      dayOfWeek: 'MONDAY',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
    });
    setCopyToDays([]);
    setFormError('');
    setShowAddModal(true);
  };

  // Handle edit slot
  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setFormData({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: slot.isAvailable,
    });
    setCopyToDays([]);
    setFormError('');
    setShowAddModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate times
    if (formData.endTime <= formData.startTime) {
      setFormError('End time must be after start time');
      return;
    }

    setSaving(true);

    try {
      if (editingSlot) {
        // Update existing slot
        await api.put(`/doctors/me/availability/slots/${editingSlot.id}`, formData);
        toast.success('Time slot updated successfully');
      } else {
        // Add new slot
        await api.post('/doctors/me/availability/slots', formData);

        // If copying to other days
        if (copyToDays.length > 0) {
          const copyPromises = copyToDays.map((day) =>
            api.post('/doctors/me/availability/slots', {
              ...formData,
              dayOfWeek: day,
            })
          );
          await Promise.allSettled(copyPromises);
          toast.success(`Time slot added to ${copyToDays.length + 1} days`);
        } else {
          toast.success('Time slot added successfully');
        }
      }
      setShowAddModal(false);
      fetchTimeSlots(true);
    } catch (err) {
      console.error('Error saving time slot:', err);
      const message = err.response?.data?.message || 'Failed to save time slot';
      setFormError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Quick Setup submit
  const handleQuickSetupSubmit = async () => {
    if (quickSetupData.selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    if (quickSetupData.endTime <= quickSetupData.startTime) {
      toast.error('End time must be after start time');
      return;
    }

    setSaving(true);

    try {
      // Build the time slots array
      const newSlots = quickSetupData.selectedDays.map((day) => ({
        dayOfWeek: day,
        startTime: quickSetupData.startTime,
        endTime: quickSetupData.endTime,
        isAvailable: true,
      }));

      if (quickSetupData.replaceExisting) {
        // Use bulk update endpoint
        await api.put('/doctors/me/availability/slots/bulk', {
          timeSlots: newSlots,
        });
        toast.success('Schedule updated successfully');
      } else {
        // Add slots one by one
        const promises = newSlots.map((slot) =>
          api.post('/doctors/me/availability/slots', slot).catch((err) => {
            console.log(`Skipping ${slot.dayOfWeek}: ${err.response?.data?.message}`);
            return null;
          })
        );
        await Promise.all(promises);
        toast.success('Working hours added successfully');
      }

      setShowQuickSetup(false);
      fetchTimeSlots(true);
    } catch (err) {
      console.error('Error in quick setup:', err);
      toast.error(err.response?.data?.message || 'Failed to set up schedule');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete slot
  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, [slotId]: 'delete' }));

    try {
      await api.delete(`/doctors/me/availability/slots/${slotId}`);
      toast.success('Time slot deleted successfully');
      fetchTimeSlots(true);
    } catch (err) {
      console.error('Error deleting time slot:', err);
      toast.error(err.response?.data?.message || 'Failed to delete time slot');
    } finally {
      setActionLoading((prev) => ({ ...prev, [slotId]: null }));
    }
  };

  // Handle toggle availability
  const handleToggleAvailability = async (slotId) => {
    setActionLoading((prev) => ({ ...prev, [slotId]: 'toggle' }));

    try {
      await api.put(`/doctors/me/availability/slots/${slotId}/toggle`);
      toast.success('Availability toggled successfully');
      fetchTimeSlots(true);
    } catch (err) {
      console.error('Error toggling availability:', err);
      toast.error(err.response?.data?.message || 'Failed to toggle availability');
    } finally {
      setActionLoading((prev) => ({ ...prev, [slotId]: null }));
    }
  };

  // Handle clear all slots
  const handleClearAll = async () => {
    if (
      !window.confirm(
        'Are you sure you want to clear all your availability slots? This cannot be undone.'
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      await api.put('/doctors/me/availability/slots/bulk', { timeSlots: [] });
      toast.success('All slots cleared successfully');
      fetchTimeSlots(true);
    } catch (err) {
      console.error('Error clearing slots:', err);
      toast.error(err.response?.data?.message || 'Failed to clear slots');
    } finally {
      setSaving(false);
    }
  };

  // Toggle day in quick setup
  const toggleQuickSetupDay = (day) => {
    setQuickSetupData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  // Apply template in quick setup
  const applyTemplate = (template) => {
    setQuickSetupData({
      ...quickSetupData,
      selectedDays: template.days,
      startTime: template.startTime,
      endTime: template.endTime,
    });
  };

  // Toggle copy to day
  const toggleCopyToDay = (day) => {
    if (day === formData.dayOfWeek) return;
    setCopyToDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Calculate stats
  const stats = {
    totalSlots: timeSlots.length,
    activeSlots: timeSlots.filter((s) => s.isAvailable).length,
    inactiveSlots: timeSlots.filter((s) => !s.isAvailable).length,
    workingDays: new Set(timeSlots.filter((s) => s.isAvailable).map((s) => s.dayOfWeek)).size,
  };

  const slotsByDay = getSlotsByDay();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/doctor"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Availability Settings</h1>
            <p className="text-gray-500 mt-1">Manage your weekly schedule and working hours</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTimeSlots(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowQuickSetup(true)}
            className="flex items-center gap-2 px-4 py-2 text-primary-700 bg-primary-50 border border-primary-200 rounded-xl hover:bg-primary-100 transition-colors"
          >
            <FiZap className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Setup</span>
          </button>
          <button
            onClick={handleAddSlot}
            className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md shadow-primary-500/20"
          >
            <FiPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Slot</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiClock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSlots}</p>
              <p className="text-sm text-gray-500">Total Slots</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <FiCheck className="h-5 w-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSlots}</p>
              <p className="text-sm text-gray-500">Active Slots</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiX className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inactiveSlots}</p>
              <p className="text-sm text-gray-500">Inactive Slots</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FiCalendar className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.workingDays}</p>
              <p className="text-sm text-gray-500">Working Days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Empty State */}
      {timeSlots.length === 0 && (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Working Hours Set</h3>
            <p className="text-gray-500 mb-6">
              Set up your weekly availability so patients can book appointments with you. Use Quick
              Setup for a fast configuration or add individual time slots.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowQuickSetup(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-md"
              >
                <FiZap className="h-4 w-4" />
                Quick Setup
              </button>
              <button
                onClick={handleAddSlot}
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-primary-700 bg-primary-50 border border-primary-200 rounded-xl hover:bg-primary-100 transition-colors"
              >
                <FiPlus className="h-4 w-4" />
                Add Manually
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Schedule */}
      {timeSlots.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Schedule</h2>
            {timeSlots.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-error-600 hover:text-error-700 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day.value}
                className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-28 flex-shrink-0">
                  <span className="font-semibold text-gray-900">{day.label}</span>
                </div>
                <div className="flex-1">
                  {slotsByDay[day.value].length === 0 ? (
                    <p className="text-gray-400 text-sm italic">Day off</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {slotsByDay[day.value].map((slot) => (
                        <div
                          key={slot.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                            slot.isAvailable
                              ? 'bg-white border-primary-200 text-primary-700'
                              : 'bg-gray-100 border-gray-300 text-gray-500 line-through'
                          }`}
                        >
                          <FiClock className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                          <div className="flex items-center gap-1 ml-2 border-l pl-2 border-gray-200">
                            <button
                              onClick={() => handleToggleAvailability(slot.id)}
                              disabled={actionLoading[slot.id]}
                              className={`p-1 rounded transition-colors ${
                                slot.isAvailable
                                  ? 'text-success-600 hover:bg-success-50'
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                              title={slot.isAvailable ? 'Disable slot' : 'Enable slot'}
                            >
                              {actionLoading[slot.id] === 'toggle' ? (
                                <FiRefreshCw className="h-4 w-4 animate-spin" />
                              ) : slot.isAvailable ? (
                                <FiToggleRight className="h-4 w-4" />
                              ) : (
                                <FiToggleLeft className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditSlot(slot)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit slot"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              disabled={actionLoading[slot.id]}
                              className="p-1 text-error-600 hover:bg-error-50 rounded transition-colors"
                              title="Delete slot"
                            >
                              {actionLoading[slot.id] === 'delete' ? (
                                <FiRefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <FiTrash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setFormData({
                      dayOfWeek: day.value,
                      startTime: '09:00',
                      endTime: '17:00',
                      isAvailable: true,
                    });
                    setCopyToDays([]);
                    setEditingSlot(null);
                    setFormError('');
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <FiPlus className="h-4 w-4" />
                  Add
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingSlot ? 'Edit Time Slot' : 'Add Time Slot'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <Alert variant="error" className="mb-4">
                  {formError}
                </Alert>
              )}

              {/* Day of Week */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => {
                    setFormData({ ...formData, dayOfWeek: e.target.value });
                    setCopyToDays((prev) => prev.filter((d) => d !== e.target.value));
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Slot is active</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isAvailable ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Copy to Other Days (only for new slots) */}
              {!editingSlot && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FiCopy className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Also add to other days
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.filter((d) => d.value !== formData.dayOfWeek).map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleCopyToDay(day.value)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                          copyToDays.includes(day.value)
                            ? 'bg-primary-50 border-primary-300 text-primary-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {day.short}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all font-medium disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FiRefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="h-4 w-4" />
                      {editingSlot ? 'Update' : 'Add'} Slot
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Setup Modal */}
      {showQuickSetup && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <FiZap className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Setup</h3>
                  <p className="text-sm text-gray-500">Set your working hours quickly</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickSetup(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Templates */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a template
              </label>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_SETUP_TEMPLATES.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Configuration */}
            <div className="space-y-4 border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-700">Or customise:</p>

              {/* Working Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleQuickSetupDay(day.value)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        quickSetupData.selectedDays.includes(day.value)
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <select
                    value={quickSetupData.startTime}
                    onChange={(e) =>
                      setQuickSetupData({ ...quickSetupData, startTime: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <select
                    value={quickSetupData.endTime}
                    onChange={(e) =>
                      setQuickSetupData({ ...quickSetupData, endTime: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Replace Option */}
              <div className="flex items-center justify-between py-2 bg-amber-50 px-4 rounded-xl border border-amber-200">
                <div>
                  <span className="text-sm font-medium text-amber-800">Replace existing slots</span>
                  <p className="text-xs text-amber-600 mt-0.5">
                    This will remove all current slots and create new ones
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setQuickSetupData({
                      ...quickSetupData,
                      replaceExisting: !quickSetupData.replaceExisting,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    quickSetupData.replaceExisting ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      quickSetupData.replaceExisting ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => setShowQuickSetup(false)}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickSetupSubmit}
                disabled={saving || quickSetupData.selectedDays.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all font-medium disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <FiRefreshCw className="h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <FiCheck className="h-4 w-4" />
                    Apply Schedule
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilitySettings;
