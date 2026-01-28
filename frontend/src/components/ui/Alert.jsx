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
      bg: 'bg-gradient-to-r from-success-50 to-emerald-50',
      border: 'border-success-200',
      titleColor: 'text-success-800',
      textColor: 'text-success-700',
      icon: FiCheckCircle,
      iconBg: 'bg-success-100',
      iconColor: 'text-success-600',
    },
    error: {
      bg: 'bg-gradient-to-r from-error-50 to-rose-50',
      border: 'border-error-200',
      titleColor: 'text-error-800',
      textColor: 'text-error-700',
      icon: FiXCircle,
      iconBg: 'bg-error-100',
      iconColor: 'text-error-600',
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
      bg: 'bg-gradient-to-r from-primary-50 to-primary-50',
      border: 'border-primary-200',
      titleColor: 'text-primary-800',
      textColor: 'text-primary-700',
      icon: FiInfo,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
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
