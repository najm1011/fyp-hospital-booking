const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  const sizes = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const borderSizes = {
    xs: 'border-2',
    sm: 'border-2',
    md: 'border-[3px]',
    lg: 'border-[3px]',
    xl: 'border-4',
  };

  const colors = {
    blue: 'border-primary-500/30 border-t-primary-600',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-300 border-t-gray-600',
    green: 'border-success-500/30 border-t-success-600',
    red: 'border-error-500/30 border-t-error-600',
  };

  return (
    <div
      className={`
        animate-spin rounded-full
        ${sizes[size]}
        ${borderSizes[size]}
        ${colors[color]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
