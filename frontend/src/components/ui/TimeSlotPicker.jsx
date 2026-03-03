import { FiClock, FiSun, FiMoon, FiSunrise } from 'react-icons/fi';

const TimeSlotPicker = ({
  slots = [],
  selectedSlot,
  onSelectSlot,
  loading = false,
  emptyMessage = 'No available slots for this date.',
  label,
  showPeriodSections = true,
  className = '',
}) => {
  // Format time for display (24h to 12h format)
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get hour from time string
  const getHour = (timeString) => {
    if (!timeString) return 0;
    return parseInt(timeString.split(':')[0]);
  };

  // Categorize slots by time of day
  const categorizeSlots = (slots) => {
    const morning = []; // 6 AM - 12 PM
    const afternoon = []; // 12 PM - 5 PM
    const evening = []; // 5 PM - 9 PM

    slots.forEach((slot) => {
      const hour = getHour(slot.startTime);
      if (hour >= 6 && hour < 12) {
        morning.push(slot);
      } else if (hour >= 12 && hour < 17) {
        afternoon.push(slot);
      } else if (hour >= 17 && hour < 21) {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  };

  // Check if a slot is selected
  const isSelected = (slot) => {
    return selectedSlot?.startTime === slot.startTime;
  };

  // Render individual slot button
  const renderSlot = (slot, index) => (
    <button
      key={`${slot.startTime}-${index}`}
      type="button"
      onClick={() => onSelectSlot(slot)}
      disabled={!slot.available}
      className={`
        relative px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all duration-200
        ${!slot.available
          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
          : isSelected(slot)
            ? 'border-primary-500 bg-primary-500 text-white shadow-md'
            : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50 hover:shadow-sm'
        }
      `}
    >
      {formatTime(slot.startTime)}
      {isSelected(slot) && (
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-success-400 rounded-full border-2 border-white" />
      )}
    </button>
  );

  // Render a time period section
  const renderPeriodSection = (title, icon, slots, colorClass) => {
    if (slots.length === 0) return null;

    return (
      <div className="mb-6 last:mb-0">
        <div className={`flex items-center mb-3 ${colorClass}`}>
          {icon}
          <span className="ml-2 text-sm font-semibold">{title}</span>
          <span className="ml-2 text-xs text-gray-400">({slots.length} slots)</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {slots.map((slot, index) => renderSlot(slot, index))}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <FiClock className="inline mr-2" />
            {label}
          </label>
        )}
        <div className="bg-gray-50 rounded-xl p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-3" />
            <p className="text-sm text-gray-500">Loading available slots...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (slots.length === 0) {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <FiClock className="inline mr-2" />
            {label}
          </label>
        )}
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <FiClock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{emptyMessage}</p>
          <p className="text-sm text-gray-400 mt-1">Please select another date.</p>
        </div>
      </div>
    );
  }

  const { morning, afternoon, evening } = categorizeSlots(slots);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <FiClock className="inline mr-2" />
          {label}
        </label>
      )}

      {/* Selected Slot Summary */}
      {selectedSlot && (
        <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiClock className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-sm text-primary-800">
                Selected: <span className="font-semibold">{formatTime(selectedSlot.startTime)}</span>
                {selectedSlot.endTime && (
                  <span className="text-primary-600"> - {formatTime(selectedSlot.endTime)}</span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectSlot(null)}
              className="text-xs text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Slots Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {showPeriodSections ? (
          <>
            {renderPeriodSection(
              'Morning',
              <FiSunrise className="h-4 w-4" />,
              morning,
              'text-amber-600'
            )}
            {renderPeriodSection(
              'Afternoon',
              <FiSun className="h-4 w-4" />,
              afternoon,
              'text-orange-500'
            )}
            {renderPeriodSection(
              'Evening',
              <FiMoon className="h-4 w-4" />,
              evening,
              'text-indigo-500'
            )}
          </>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {slots.map((slot, index) => renderSlot(slot, index))}
          </div>
        )}

        {/* Slots Count */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <span>
            {slots.filter(s => s.available !== false).length} available slots
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded border-2 border-gray-200 bg-white mr-1" />
              Available
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded bg-primary-500 mr-1" />
              Selected
            </div>
            <div className="flex items-center">
              <span className="h-3 w-3 rounded bg-gray-100 mr-1" />
              Booked
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;
