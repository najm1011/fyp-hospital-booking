import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-5 rounded-2xl mb-5 shadow-soft">
          <Icon className="h-10 w-10 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && actionPath && (
        <Link
          to={actionPath}
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionPath && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
