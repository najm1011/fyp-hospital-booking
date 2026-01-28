import { useState, useEffect } from 'react';
import {
  FiTrendingUp,
  FiCalendar,
  FiUsers,
  FiUserPlus,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiBarChart2,
  FiPieChart,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useToast } from '../context/ToastContext';
import { Card, Alert, LoadingSpinner } from '../components/ui';
import api from '../services/api';

const Analytics = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [months, setMonths] = useState(12);

  // Chart colors
  const COLORS = {
    primary: '#14b8a6',
    secondary: '#06b6d4',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    blue: '#3b82f6',
    indigo: '#6366f1',
  };

  const STATUS_COLORS = {
    SCHEDULED: COLORS.blue,
    COMPLETED: COLORS.success,
    CANCELLED: COLORS.danger,
    NO_SHOW: COLORS.warning,
  };

  const PIE_COLORS = [COLORS.primary, COLORS.blue, COLORS.purple, COLORS.warning, COLORS.danger, COLORS.indigo];

  useEffect(() => {
    fetchAnalytics();
  }, [months]);

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await api.get(`/appointments/admin/analytics?months=${months}`);
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again.');
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Transform status distribution for pie chart
  const getStatusPieData = () => {
    if (!analytics?.statusDistribution) return [];
    return Object.entries(analytics.statusDistribution).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || COLORS.primary,
    }));
  };

  // Transform department distribution for bar chart
  const getDepartmentData = () => {
    if (!analytics?.departmentDistribution) return [];
    return Object.entries(analytics.departmentDistribution).map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      fullName: name,
      appointments: value,
    }));
  };

  // Transform weekday distribution
  const getWeekdayData = () => {
    if (!analytics?.weekdayDistribution) return [];
    const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return order.map(day => ({
      day,
      appointments: analytics.weekdayDistribution[day] || 0,
    }));
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Appointment statistics and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
          >
            <option value={3}>Last 3 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={12}>Last 12 Months</option>
            <option value={24}>Last 24 Months</option>
          </select>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{analytics?.totalAppointments || 0}</p>
              <p className="text-primary-100 text-sm mt-1">Total Appointments</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiCalendar className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{analytics?.totalPatients || 0}</p>
              <p className="text-blue-100 text-sm mt-1">Unique Patients</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiUsers className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{analytics?.totalDoctors || 0}</p>
              <p className="text-purple-100 text-sm mt-1">Active Doctors</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiUserPlus className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{analytics?.completionRate || 0}%</p>
              <p className="text-success-100 text-sm mt-1">Completion Rate</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <FiCheckCircle className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Rate Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success-100 rounded-xl">
              <FiCheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics?.completionRate || 0}%</p>
              <p className="text-sm text-gray-500">Completion Rate</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-error-100 rounded-xl">
              <FiXCircle className="h-6 w-6 text-error-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics?.cancellationRate || 0}%</p>
              <p className="text-sm text-gray-500">Cancellation Rate</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <FiAlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics?.noShowRate || 0}%</p>
              <p className="text-sm text-gray-500">No-Show Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FiTrendingUp className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Appointments Per Month</h2>
        </div>
        {analytics?.monthlyStats?.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={analytics.monthlyStats}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="monthName"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#colorTotal)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke={COLORS.success}
                fillOpacity={1}
                fill="url(#colorCompleted)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[350px] text-gray-400">
            <div className="text-center">
              <FiBarChart2 className="h-12 w-12 mx-auto mb-2" />
              <p>No data available for selected period</p>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiPieChart className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Status Distribution</h2>
          </div>
          {getStatusPieData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getStatusPieData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {getStatusPieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <div className="text-center">
                <FiPieChart className="h-12 w-12 mx-auto mb-2" />
                <p>No status data available</p>
              </div>
            </div>
          )}
        </Card>

        {/* Weekday Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiBarChart2 className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Appointments by Day of Week</h2>
          </div>
          {getWeekdayData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getWeekdayData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="appointments"
                  name="Appointments"
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <div className="text-center">
                <FiBarChart2 className="h-12 w-12 mx-auto mb-2" />
                <p>No weekday data available</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Department Distribution */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FiBarChart2 className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Appointments by Department</h2>
        </div>
        {getDepartmentData().length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={getDepartmentData()} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{payload[0].payload.fullName}</p>
                        <p className="text-sm text-primary-600">
                          Appointments: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="appointments"
                name="Appointments"
                fill={COLORS.secondary}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[350px] text-gray-400">
            <div className="text-center">
              <FiBarChart2 className="h-12 w-12 mx-auto mb-2" />
              <p>No department data available</p>
            </div>
          </div>
        )}
      </Card>

      {/* Monthly Breakdown Table */}
      {analytics?.monthlyStats?.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-4 py-3 font-medium">Month</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium text-right">Scheduled</th>
                  <th className="px-4 py-3 font-medium text-right">Completed</th>
                  <th className="px-4 py-3 font-medium text-right">Cancelled</th>
                  <th className="px-4 py-3 font-medium text-right">No Show</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analytics.monthlyStats.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {month.monthName} {month.year}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                      {month.total}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {month.scheduled}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                        {month.completed}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-100 text-error-700">
                        {month.cancelled}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        {month.noShow}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
