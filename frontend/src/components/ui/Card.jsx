const Card = ({
  children,
  title,
  subtitle,
  action,
  loading = false,
  hover = false,
  noPadding = false,
  className = '',
}) => {
  const baseStyles = `
    bg-white rounded-2xl shadow-soft border border-gray-100/80
    ${hover ? 'hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''}
  `;

  if (loading) {
    return (
      <div className={`${baseStyles} ${className}`}>
        <div className="p-6 animate-pulse">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-full"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-gray-100/80 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  );
};

export default Card;
