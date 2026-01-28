import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiActivity,
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
      PATIENT: 'bg-success-50 text-success-700',
      DOCTOR: 'bg-primary-50 text-primary-700',
      ADMIN: 'bg-violet-100 text-violet-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-soft border-b border-gray-100/80 fixed w-full top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and menu button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 lg:hidden transition-colors"
              >
                {isSidebarOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            )}

            {/* Logo */}
            <Link to="/" className="flex items-center ml-2 lg:ml-0 group">
              <div className="bg-gradient-to-br from-primary-600 to-primary-500 p-2.5 rounded-xl shadow-md shadow-primary-sm group-hover:shadow-lg group-hover:shadow-primary transition-all duration-300">
                <FiActivity className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden sm:block">
                MediBook
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
                    className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 relative transition-colors"
                  >
                    <FiBell className="h-5 w-5" />
                    {/* Notification badge */}
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-error-500 rounded-full ring-2 ring-white"></span>
                  </button>

                  {/* Notifications dropdown */}
                  {isNotificationsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsNotificationsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-gray-100/80 z-20 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Notifications
                          </h3>
                        </div>
                        <div className="p-6 text-sm text-gray-500 text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiBell className="h-5 w-5 text-gray-400" />
                          </div>
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
                    className="flex items-center space-x-3 p-1.5 pr-3 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <FiChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                  </button>

                  {/* Profile dropdown menu */}
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-lg border border-gray-100/80 z-20 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {user?.email}
                          </p>
                          <span
                            className={`inline-block mt-2 px-2.5 py-1 text-xs font-semibold rounded-lg ${getRoleBadgeColor(
                              user?.role
                            )}`}
                          >
                            {getRoleDisplayName(user?.role)}
                          </span>
                        </div>
                        <div className="py-1.5">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiUser className="h-4 w-4 mr-3 text-gray-400" />
                            My Profile
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FiSettings className="h-4 w-4 mr-3 text-gray-400" />
                            Settings
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 py-1.5">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors"
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
                  className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-5 py-2.5 rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all font-semibold shadow-md shadow-primary-sm hover:shadow-lg hover:shadow-primary"
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
