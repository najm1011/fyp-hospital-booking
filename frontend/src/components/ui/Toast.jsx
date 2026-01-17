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
      bgColor: 'bg-white',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-gray-900',
      messageColor: 'text-gray-600',
      progressColor: 'bg-gradient-to-r from-green-400 to-green-500',
    },
    error: {
      icon: FiXCircle,
      bgColor: 'bg-white',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-gray-900',
      messageColor: 'text-gray-600',
      progressColor: 'bg-gradient-to-r from-red-400 to-red-500',
    },
    warning: {
      icon: FiAlertCircle,
      bgColor: 'bg-white',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      titleColor: 'text-gray-900',
      messageColor: 'text-gray-600',
      progressColor: 'bg-gradient-to-r from-amber-400 to-amber-500',
    },
    info: {
      icon: FiInfo,
      bgColor: 'bg-white',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      titleColor: 'text-gray-900',
      messageColor: 'text-gray-600',
      progressColor: 'bg-gradient-to-r from-teal-400 to-cyan-500',
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
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Close</span>
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <div className="h-1 w-full bg-gray-100">
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
