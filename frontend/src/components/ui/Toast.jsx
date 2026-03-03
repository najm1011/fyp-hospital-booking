import { useState, useEffect } from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
} from 'react-icons/fi';

const Toast = ({
  id,
  type = 'info', // 'success', 'error', 'warning', 'info'
  title,
  message,
  duration = 5000, // Auto-dismiss after 5 seconds (0 = no auto-dismiss)
  onClose,
  position = 'top-right',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss
    let dismissTimer;
    if (duration > 0) {
      dismissTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(enterTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300); // Match animation duration
  };

  const typeConfig = {
    success: {
      icon: FiCheckCircle,
      bgColor: 'bg-white dark:bg-gray-800',
      borderColor: 'border-success-200 dark:border-success-800',
      iconBg: 'bg-success-100 dark:bg-success-900/30',
      iconColor: 'text-success-600',
      titleColor: 'text-gray-900 dark:text-gray-100',
      messageColor: 'text-gray-600 dark:text-gray-400',
      progressColor: 'bg-gradient-to-r from-success-400 to-success-500',
    },
    error: {
      icon: FiXCircle,
      bgColor: 'bg-white dark:bg-gray-800',
      borderColor: 'border-error-200 dark:border-error-800',
      iconBg: 'bg-error-100 dark:bg-error-900/30',
      iconColor: 'text-error-600',
      titleColor: 'text-gray-900 dark:text-gray-100',
      messageColor: 'text-gray-600 dark:text-gray-400',
      progressColor: 'bg-gradient-to-r from-error-400 to-error-500',
    },
    warning: {
      icon: FiAlertCircle,
      bgColor: 'bg-white dark:bg-gray-800',
      borderColor: 'border-amber-200 dark:border-amber-800',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600',
      titleColor: 'text-gray-900 dark:text-gray-100',
      messageColor: 'text-gray-600 dark:text-gray-400',
      progressColor: 'bg-gradient-to-r from-amber-400 to-amber-500',
    },
    info: {
      icon: FiInfo,
      bgColor: 'bg-white dark:bg-gray-800',
      borderColor: 'border-primary-200 dark:border-primary-800',
      iconBg: 'bg-primary-100 dark:bg-primary-900/30',
      iconColor: 'text-primary-600',
      titleColor: 'text-gray-900 dark:text-gray-100',
      messageColor: 'text-gray-600 dark:text-gray-400',
      progressColor: 'bg-gradient-to-r from-primary-400 to-primary-500',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        max-w-sm w-full ${config.bgColor} ${config.borderColor} border rounded-2xl shadow-soft-lg overflow-hidden backdrop-blur-lg
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 p-2 rounded-xl ${config.iconBg}`}>
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          <div className="ml-3 flex-1 pt-0.5">
            {title && (
              <p className={`text-sm font-semibold ${config.titleColor}`}>
                {title}
              </p>
            )}
            {message && (
              <p className={`text-sm ${config.messageColor} ${title ? 'mt-0.5' : ''}`}>
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Close</span>
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-700">
          <div
            className={`h-full ${config.progressColor} transition-all ease-linear`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
