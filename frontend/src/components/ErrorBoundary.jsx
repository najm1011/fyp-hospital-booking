import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could send error to a logging service
    // logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mb-6">
              <FiAlertTriangle className="h-8 w-8 text-error-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Something went wrong
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
            </p>

            {/* Error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-error-50 rounded-lg text-left">
                <p className="text-sm font-medium text-error-800 mb-2">
                  Error Details:
                </p>
                <pre className="text-xs text-error-700 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs text-error-600 overflow-auto max-h-32 mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRefresh}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transition-colors"
              >
                <FiRefreshCw className="h-5 w-5 mr-2" />
                Refresh Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <FiHome className="h-5 w-5 mr-2" />
                Go Home
              </button>
            </div>

            {this.props.onReset && (
              <button
                onClick={() => {
                  this.handleReset();
                  this.props.onReset();
                }}
                className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
