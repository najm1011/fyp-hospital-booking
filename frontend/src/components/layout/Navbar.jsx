import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiHeart,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiBell,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplayName = (role) => {
    const roles = {
      PATIENT: 'Patient',
      DOCTOR: 'Doctor',
      ADMIN: 'Administrator',
    };
    return roles[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      PATIENT: 'bg-green-100 text-green-800',
      DOCTOR: 'bg-blue-100 text-blue-800',
      ADMIN: 'bg-purple-100 text-purple-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and menu button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
              >
                {isSidebarOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center ml-2 lg:ml-0">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FiHeart className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
                Hospital Booking
              </span>
            </Link>
          </div>

          {/* Right side - Auth buttons or user menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
                  >
                    <FiBell className="h-6 w-6" />
                    {/* Notification badge */}
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Notifications dropdown */}
                  {isNotificationsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsNotificationsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Notifications
                          </h3>
                        </div>
                        <div className="p-4 text-sm text-gray-500 text-center">
                          No new notifications
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <FiChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                  </button>

                  {/* Profile dropdown menu */}
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-4 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {user?.email}
                          </p>
                          <span
                            className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                              user?.role
                            )}`}
                          >
                            {getRoleDisplayName(user?.role)}
                          </span>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FiUser className="h-4 w-4 mr-3" />
                            My Profile
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <FiSettings className="h-4 w-4 mr-3" />
                            Settings
                          </Link>
                        </div>
                        <div className="border-t border-gray-200 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <FiLogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
