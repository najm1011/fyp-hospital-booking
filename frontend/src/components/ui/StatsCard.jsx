const StatsCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection,
  loading = false,
  color = 'blue',
}) => {
  const colors = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
    },
    yellow: {
      bg: 'bg-yellow-100',
      icon: 'text-yellow-600',
    },
    purple: {
      bg: 'bg-purple-100',
      icon: 'text-purple-600',
    },
    red: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
    },
  };

  const colorClasses = colors[color] || colors.blue;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center">
          <div className="bg-gray-200 p-3 rounded-lg h-12 w-12"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`${colorClasses.bg} p-3 rounded-lg`}>
          {Icon && <Icon className={`h-6 w-6 ${colorClasses.icon}`} />}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{label}</p>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`ml-2 text-xs font-medium ${
                  trendDirection === 'up'
                    ? 'text-green-600'
                    : trendDirection === 'down'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {trendDirection === 'up' && '↑'}
                {trendDirection === 'down' && '↓'}
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
