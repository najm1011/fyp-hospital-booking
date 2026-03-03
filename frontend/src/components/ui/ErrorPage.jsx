import { Link } from 'react-router-dom';
import {
  FiAlertCircle,
  FiWifiOff,
  FiServer,
  FiLock,
  FiSearch,
  FiRefreshCw,
  FiHome,
  FiArrowLeft,
} from 'react-icons/fi';

const errorTypes = {
  network: {
    icon: FiWifiOff,
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    color: 'red',
  },
  server: {
    icon: FiServer,
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    color: 'red',
  },
  unauthorized: {
    icon: FiLock,
    title: 'Access Denied',
    message: "You don't have permission to access this resource.",
    color: 'yellow',
  },
  notFound: {
    icon: FiSearch,
    title: 'Not Found',
    message: "The resource you're looking for doesn't exist or has been moved.",
    color: 'gray',
  },
  generic: {
    icon: FiAlertCircle,
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    color: 'red',
  },
};

const colorClasses = {
  red: {
    bg: 'bg-error-100 dark:bg-error-900/30',
    icon: 'text-error-600 dark:text-error-400',
    button: 'bg-error-600 hover:bg-error-700',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: 'text-yellow-600 dark:text-yellow-400',
    button: 'bg-yellow-600 hover:bg-yellow-700',
  },
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    icon: 'text-gray-600 dark:text-gray-400',
    button: 'bg-gray-600 hover:bg-gray-700',
  },
};

const ErrorPage = ({
  type = 'generic',
  title,
  message,
  error,
  onRetry,
  showHomeButton = true,
  showBackButton = false,
  className = '',
}) => {
  const errorConfig = errorTypes[type] || errorTypes.generic;
  const colors = colorClasses[errorConfig.color];
  const Icon = errorConfig.icon;

  // Use custom title/message if provided, otherwise use defaults
  const displayTitle = title || errorConfig.title;
  const displayMessage = message || error?.message || errorConfig.message;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className={`mx-auto w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mb-6`}>
          <Icon className={`h-10 w-10 ${colors.icon}`} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {displayTitle}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {displayMessage}
        </p>

        {/* Error details in development */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Error Details:
            </p>
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-24">
              {error.stack || error.toString()}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`inline-flex items-center justify-center px-6 py-3 ${colors.button} text-white font-medium rounded-lg transition-colors`}
            >
              <FiRefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </button>
          )}

          {showBackButton && (
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FiArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          )}

          {showHomeButton && (
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FiHome className="h-5 w-5 mr-2" />
              Go Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
