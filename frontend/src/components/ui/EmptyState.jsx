import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}) => {
  const buttonClasses = `
    inline-flex items-center px-4 py-2.5
    bg-primary-600 text-white text-sm font-medium rounded-lg
    hover:bg-primary-700 hover:shadow-primary-sm
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  `;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && (
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-xs mb-5">
          {description}
        </p>
      )}
      {actionLabel && actionPath && (
        <Link to={actionPath} className={buttonClasses}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionPath && (
        <button onClick={onAction} className={buttonClasses}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
