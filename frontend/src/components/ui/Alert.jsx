import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const types = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-200',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
      icon: FiCheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-200',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      icon: FiXCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      titleColor: 'text-amber-800',
      textColor: 'text-amber-700',
      icon: FiAlertCircle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    info: {
      bg: 'bg-gradient-to-r from-teal-50 to-cyan-50',
      border: 'border-teal-200',
      titleColor: 'text-teal-800',
      textColor: 'text-teal-700',
      icon: FiInfo,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bg} ${config.border}
        border rounded-2xl p-4 ${className}
      `}
      role="alert"
    >
      <div className="flex">
        <div className={`flex-shrink-0 p-2 rounded-xl ${config.iconBg}`}>
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1 pt-0.5">
          {title && (
            <h3 className={`text-sm font-semibold ${config.titleColor}`}>{title}</h3>
          )}
          {message && (
            <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>{message}</p>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onClose}
              className={`
                p-1.5 rounded-lg
                ${config.textColor} hover:bg-white/50
                focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
              `}
            >
              <span className="sr-only">Dismiss</span>
              <FiX className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
