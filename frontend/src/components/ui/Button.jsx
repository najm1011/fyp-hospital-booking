const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
    active:scale-[0.98]
  `;

  const variants = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 hover:shadow-primary-sm
      focus:ring-primary-500
    `,
    secondary: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200 hover:text-gray-900
      focus:ring-gray-400
    `,
    outline: `
      border border-gray-300 text-gray-700 bg-white
      hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50
      focus:ring-primary-500
    `,
    danger: `
      bg-error-600 text-white
      hover:bg-error-700 hover:shadow-accent-sm
      focus:ring-error-500
    `,
    success: `
      bg-success-600 text-white
      hover:bg-success-700 hover:shadow-success-sm
      focus:ring-success-500
    `,
    ghost: `
      text-gray-600 bg-transparent
      hover:bg-gray-100 hover:text-gray-900
      focus:ring-gray-400
    `,
    // New: subtle variant for secondary actions
    subtle: `
      text-primary-600 bg-primary-50
      hover:bg-primary-100 hover:text-primary-700
      focus:ring-primary-500
    `,
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 -ml-0.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
