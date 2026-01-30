const StatsCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendDirection,
  loading = false,
  color = 'blue',
}) => {
  // Refined colour palette with better visual hierarchy
  const colors = {
    blue: {
      bg: 'bg-gradient-to-br from-primary-50 via-primary-50 to-primary-100/80',
      iconBg: 'bg-primary-500',
      icon: 'text-white',
      accent: 'border-l-primary-500',
      shadow: 'shadow-primary-sm',
    },
    green: {
      bg: 'bg-gradient-to-br from-success-50 via-emerald-50 to-success-100/80',
      iconBg: 'bg-success-500',
      icon: 'text-white',
      accent: 'border-l-success-500',
      shadow: 'shadow-success-sm',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-warning-50 via-amber-50 to-warning-100/80',
      iconBg: 'bg-warning-500',
      icon: 'text-white',
      accent: 'border-l-warning-500',
      shadow: 'shadow-soft-sm',
    },
    purple: {
      bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100/80',
      iconBg: 'bg-violet-500',
      icon: 'text-white',
      accent: 'border-l-violet-500',
      shadow: 'shadow-soft-sm',
    },
    red: {
      bg: 'bg-gradient-to-br from-error-50 via-rose-50 to-error-100/80',
      iconBg: 'bg-error-500',
      icon: 'text-white',
      accent: 'border-l-error-500',
      shadow: 'shadow-accent-sm',
    },
  };

  const colorClasses = colors[color] || colors.blue;

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-soft border border-gray-100 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 p-3 rounded-lg h-12 w-12 flex-shrink-0"></div>
          <div className="flex-1 pt-0.5">
            <div className="h-3.5 bg-gray-100 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-100 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      relative bg-white p-5 rounded-xl border border-gray-100/80
      shadow-soft hover:shadow-soft-md
      transition-all duration-300 ease-out
      hover:-translate-y-0.5
      group overflow-hidden
    `}>
      {/* Subtle accent border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorClasses.accent} rounded-l-xl`} />

      <div className="flex items-start gap-4">
        {/* Icon container with solid colour */}
        <div className={`
          ${colorClasses.iconBg} p-3 rounded-lg ${colorClasses.shadow}
          group-hover:scale-105 transition-transform duration-300 ease-out
          flex-shrink-0
        `}>
          {Icon && <Icon className={`h-5 w-5 ${colorClasses.icon}`} />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium truncate mb-1">{label}</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
            {trend && (
              <span
                className={`
                  inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md
                  ${trendDirection === 'up'
                    ? 'text-success-700 bg-success-50'
                    : trendDirection === 'down'
                    ? 'text-error-700 bg-error-50'
                    : 'text-gray-600 bg-gray-100'
                  }
                `}
              >
                {trendDirection === 'up' && (
                  <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                {trendDirection === 'down' && (
                  <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
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
