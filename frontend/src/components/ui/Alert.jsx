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
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: FiCheckCircle,
      iconColor: 'text-green-400',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: FiXCircle,
      iconColor: 'text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: FiAlertCircle,
      iconColor: 'text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: FiInfo,
      iconColor: 'text-blue-400',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bg} ${config.border} ${config.text}
        border rounded-lg p-4 ${className}
      `}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          {message && (
            <p className={`text-sm ${title ? 'mt-1' : ''}`}>{message}</p>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onClose}
              className={`
                inline-flex rounded-md p-1.5
                ${config.text} hover:${config.bg}
                focus:outline-none focus:ring-2 focus:ring-offset-2
              `}
            >
              <span className="sr-only">Dismiss</span>
              <FiX className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
