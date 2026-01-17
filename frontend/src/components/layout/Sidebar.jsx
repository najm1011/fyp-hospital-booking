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
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white/95 backdrop-blur-lg border-r border-gray-100/80
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? '' : 'text-gray-400'}`} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-3 border-t border-gray-100">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-500/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <FiSettings className={`h-5 w-5 mr-3 ${isActive ? '' : 'text-gray-400'}`} />
                  Settings
                </>
              )}
            </NavLink>

            {/* Help card */}
            <div className="mt-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100/50">
              <h4 className="text-sm font-semibold text-teal-900">Need Help?</h4>
              <p className="text-xs text-teal-700/80 mt-1">
                Contact support for assistance with your account.
              </p>
              <button className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center group">
                Get Support
                <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
