import { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DatePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date',
  label,
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  // Parse the value to Date object
  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

  // Parse min/max dates
  const minDateObj = minDate ? new Date(minDate + 'T00:00:00') : null;
  const maxDateObj = maxDate ? new Date(maxDate + 'T00:00:00') : null;

  // Initialize current month to selected date or today
  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    } else {
      setCurrentMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Check if a date is disabled
  const isDateDisabled = (date) => {
    if (minDateObj && date < minDateObj) return true;
    if (maxDateObj && date > maxDateObj) return true;
    return false;
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Handle date selection
  const handleDateClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateDisabled(date)) return;

    // Format as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  // Format display date
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Generate calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const today = isToday(date);
      const selected = isSelected(date);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className={`
            h-9 w-9 rounded-full text-sm font-medium transition-all
            flex items-center justify-center
            ${disabled
              ? 'text-gray-300 cursor-not-allowed'
              : selected
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : today
                  ? 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                  : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Check if previous month button should be disabled
  const isPrevMonthDisabled = () => {
    if (!minDateObj) return false;
    const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const lastDayOfPrevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    return lastDayOfPrevMonth < minDateObj;
  };

  // Check if next month button should be disabled
  const isNextMonthDisabled = () => {
    if (!maxDateObj) return false;
    const firstDayOfNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return firstDayOfNextMonth > maxDateObj;
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-xl border-2
          transition-all duration-200 text-left bg-white
          ${disabled
            ? 'bg-gray-50 cursor-not-allowed border-gray-200 opacity-60'
            : error
              ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
              : 'border-gray-200 hover:border-gray-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10'
          }
          ${isOpen ? 'ring-4 ring-teal-500/10 border-teal-500' : ''}
        `}
      >
        <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <FiCalendar className={`h-5 w-5 ${isOpen ? 'text-teal-500' : error ? 'text-red-400' : 'text-gray-400'} transition-colors`} />
      </button>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-soft-lg border border-gray-100 p-4 w-72">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              disabled={isPrevMonthDisabled()}
              className={`
                p-2 rounded-lg transition-colors
                ${isPrevMonthDisabled()
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </h3>

            <button
              type="button"
              onClick={nextMonth}
              disabled={isNextMonthDisabled()}
              className={`
                p-2 rounded-lg transition-colors
                ${isNextMonthDisabled()
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="h-9 w-9 flex items-center justify-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                if (!isDateDisabled(today)) {
                  const formattedDate = today.toISOString().split('T')[0];
                  onChange(formattedDate);
                  setIsOpen(false);
                }
              }}
              className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-semibold py-1.5 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
