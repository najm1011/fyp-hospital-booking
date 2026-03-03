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
      bg: 'bg-gradient-to-r from-success-50 to-emerald-50 dark:from-success-900/20 dark:to-emerald-900/20',
      border: 'border-success-200 dark:border-success-800',
      titleColor: 'text-success-800 dark:text-success-300',
      textColor: 'text-success-700 dark:text-success-400',
      icon: FiCheckCircle,
      iconBg: 'bg-success-100 dark:bg-success-900/30',
      iconColor: 'text-success-600',
    },
    error: {
      bg: 'bg-gradient-to-r from-error-50 to-rose-50 dark:from-error-900/20 dark:to-rose-900/20',
      border: 'border-error-200 dark:border-error-800',
      titleColor: 'text-error-800 dark:text-error-300',
      textColor: 'text-error-700 dark:text-error-400',
      icon: FiXCircle,
      iconBg: 'bg-error-100 dark:bg-error-900/30',
      iconColor: 'text-error-600',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      titleColor: 'text-amber-800 dark:text-amber-300',
      textColor: 'text-amber-700 dark:text-amber-400',
      icon: FiAlertCircle,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600',
    },
    info: {
      bg: 'bg-gradient-to-r from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20',
      border: 'border-primary-200 dark:border-primary-800',
      titleColor: 'text-primary-800 dark:text-primary-300',
      textColor: 'text-primary-700 dark:text-primary-400',
      icon: FiInfo,
      iconBg: 'bg-primary-100 dark:bg-primary-900/30',
      iconColor: 'text-primary-600',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bg} ${config.border}
        border rounded-2xl p-4 animate-fade-in ${className}
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
