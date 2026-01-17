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
      bg: 'bg-gradient-to-br from-teal-50 to-cyan-100',
      icon: 'text-teal-600',
      ring: 'ring-teal-500/20',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      icon: 'text-green-600',
      ring: 'ring-green-500/20',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
      icon: 'text-amber-600',
      ring: 'ring-amber-500/20',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      icon: 'text-purple-600',
      ring: 'ring-purple-500/20',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      icon: 'text-red-600',
      ring: 'ring-red-500/20',
    },
  };

  const colorClasses = colors[color] || colors.blue;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100/80 animate-pulse">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3.5 rounded-xl h-14 w-14"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-20 mb-2"></div>
            <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100/80 hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex items-center">
        <div className={`${colorClasses.bg} p-3.5 rounded-xl ring-1 ${colorClasses.ring} group-hover:scale-110 transition-transform duration-300`}>
          {Icon && <Icon className={`h-6 w-6 ${colorClasses.icon}`} />}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  trendDirection === 'up'
                    ? 'text-green-700 bg-green-100'
                    : trendDirection === 'down'
                    ? 'text-red-700 bg-red-100'
                    : 'text-gray-600 bg-gray-100'
                }`}
              >
                {trendDirection === 'up' && '↑ '}
                {trendDirection === 'down' && '↓ '}
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
