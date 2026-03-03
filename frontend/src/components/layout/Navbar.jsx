import { useState, useEffect, useRef } from 'react';
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
  FiCalendar,
  FiXCircle,
  FiRefreshCw,
  FiCheck,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, loading: notificationsLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isNotificationsOpen) setIsNotificationsOpen(false);
        if (isProfileOpen) setIsProfileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isNotificationsOpen, isProfileOpen]);

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
    <nav aria-label="Top navigation" className="bg-white/80 backdrop-blur-lg shadow-soft border-b border-gray-100/80 fixed w-full top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and menu button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                onClick={onMenuClick}
                aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isSidebarOpen}
                className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 lg:hidden transition-colors"
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
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => {
                      const opening = !isNotificationsOpen;
                      setIsNotificationsOpen(opening);
                      if (opening) fetchNotifications();
                    }}
                    aria-label="Notifications"
                    aria-expanded={isNotificationsOpen}
                    aria-haspopup="true"
                    className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 relative transition-colors"
                  >
                    <FiBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-error-500 rounded-full ring-2 ring-white flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  {isNotificationsOpen && (
                      <div className="fixed left-4 right-4 top-[4.5rem] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96 bg-white rounded-2xl shadow-soft-lg border border-gray-100/80 z-20 overflow-hidden animate-fade-in-down">
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Notifications
                          </h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notificationsLoading ? (
                            <div className="p-6 text-sm text-gray-500 text-center">
                              Loading...
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="p-6 text-sm text-gray-500 text-center">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FiBell className="h-5 w-5 text-gray-400" />
                              </div>
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((notification) => {
                              const icon = notification.type === 'APPOINTMENT_BOOKED' ? FiCalendar
                                : notification.type === 'APPOINTMENT_CANCELLED' ? FiXCircle
                                : FiRefreshCw;
                              const iconColor = notification.type === 'APPOINTMENT_BOOKED' ? 'text-success-600 bg-success-50'
                                : notification.type === 'APPOINTMENT_CANCELLED' ? 'text-error-600 bg-error-50'
                                : 'text-primary-600 bg-primary-50';
                              const Icon = icon;

                              return (
                                <button
                                  key={notification.id}
                                  onClick={() => {
                                    if (!notification.read) markAsRead(notification.id);
                                  }}
                                  className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                                    !notification.read ? 'bg-primary-50/30' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg flex-shrink-0 ${iconColor}`}>
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                          {notification.title}
                                        </p>
                                        {!notification.read && (
                                          <span className="h-2 w-2 bg-primary-500 rounded-full flex-shrink-0" />
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {notification.timeAgo}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    aria-label="User menu"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                    className="flex items-center space-x-3 p-2 pr-3 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors"
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
                      <div className="fixed left-4 right-4 top-[4.5rem] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-64 bg-white rounded-2xl shadow-soft-lg border border-gray-100/80 z-20 overflow-hidden animate-fade-in-down">
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
