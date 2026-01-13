import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiUserPlus,
  FiClock,
  FiFileText,
  FiSettings,
  FiActivity,
  FiGrid,
  FiClipboard,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    ];

    const patientItems = [
      { name: 'Book Appointment', path: '/appointments/book', icon: FiCalendar },
      { name: 'My Appointments', path: '/appointments', icon: FiClock },
      { name: 'Medical History', path: '/medical-history', icon: FiFileText },
      { name: 'Find Doctors', path: '/doctors', icon: FiUsers },
    ];

    const doctorItems = [
      { name: 'My Schedule', path: '/doctor/schedule', icon: FiCalendar },
      { name: 'Appointments', path: '/doctor/appointments', icon: FiClock },
      { name: 'My Patients', path: '/doctor/patients', icon: FiUsers },
      { name: 'Availability', path: '/doctor/availability', icon: FiClipboard },
    ];

    const adminItems = [
      { name: 'Overview', path: '/admin', icon: FiGrid },
      { name: 'Manage Doctors', path: '/admin/doctors', icon: FiUserPlus },
      { name: 'Manage Patients', path: '/admin/patients', icon: FiUsers },
      { name: 'Departments', path: '/admin/departments', icon: FiActivity },
      { name: 'All Appointments', path: '/admin/appointments', icon: FiCalendar },
      { name: 'Reports', path: '/admin/reports', icon: FiFileText },
    ];

    switch (user?.role) {
      case 'PATIENT':
        return [...commonItems, ...patientItems];
      case 'DOCTOR':
        return [...commonItems, ...doctorItems];
      case 'ADMIN':
        return [...commonItems, ...adminItems];
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-200">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <FiSettings className="h-5 w-5 mr-3" />
              Settings
            </NavLink>

            {/* Help card */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900">Need Help?</h4>
              <p className="text-xs text-blue-700 mt-1">
                Contact support for assistance with your account.
              </p>
              <button className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-800">
                Get Support →
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
