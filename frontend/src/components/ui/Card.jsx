const Card = ({
  children,
  title,
  subtitle,
  action,
  loading = false,
  hover = false,
  noPadding = false,
  elevation = 'default', // 'flat', 'default', 'raised', 'floating'
  className = '',
}) => {
  // Elevation system for visual hierarchy
  const elevations = {
    flat: 'bg-white border border-gray-200/80 dark:bg-gray-800 dark:border-gray-700/80',
    default: 'bg-white shadow-soft border border-gray-100/60 dark:bg-gray-800 dark:border-gray-700/60',
    raised: 'bg-white shadow-soft-md border border-gray-100/40 dark:bg-gray-800 dark:border-gray-700/40',
    floating: 'bg-white shadow-soft-lg border border-gray-50 dark:bg-gray-800 dark:border-gray-700',
  };

  const baseStyles = `
    rounded-xl transition-all duration-250
    ${elevations[elevation] || elevations.default}
    ${hover ? 'hover:shadow-soft-md hover:-translate-y-0.5 cursor-pointer' : ''}
  `;

  if (loading) {
    return (
      <div className={`${baseStyles} ${className}`}>
        <div className="p-5 animate-pulse">
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-28 mb-4"></div>
          <div className="space-y-2.5">
            <div className="h-3.5 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3.5 bg-gray-100 dark:bg-gray-700 rounded w-4/5"></div>
            <div className="h-3.5 bg-gray-100 dark:bg-gray-700 rounded w-3/5"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`}>
      {(title || action) && (
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};

export default Card;
