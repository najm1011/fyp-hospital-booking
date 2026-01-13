import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiFileText,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { StatsCard, Card, EmptyState, Alert } from '../components/ui';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState(
    location.state?.accessDenied ? "You don't have permission to access that page." : null
  );

  // Simulate loading data (will be replaced with real API calls)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set empty data for skeleton/empty state demo
      // In real app, this would come from API
      setStats({
        upcoming: 0,
        completed: 0,
        pending: 0,
        doctorsVisited: 0,
      });
      setUpcomingAppointments([]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Patient Dashboard
  const PatientDashboard = () => (
    <>
      {/* Access Denied Alert */}
      {accessDeniedMessage && (
        <Alert
          type="warning"
          message={accessDeniedMessage}
          onClose={() => setAccessDeniedMessage(null)}
          className="mb-6"
        />
      )}

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your appointments and health records
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={FiCalendar}
          label="Upcoming"
          value={stats?.upcoming || 0}
          color="blue"
          loading={loading}
        />
        <StatsCard
          icon={FiCheckCircle}
          label="Completed"
          value={stats?.completed || 0}
          color="green"
          loading={loading}
        />
        <StatsCard
          icon={FiClock}
          label="Pending"
          value={stats?.pending || 0}
          color="yellow"
          loading={loading}
        />
        <StatsCard
          icon={FiUsers}
          label="Doctors Visited"
          value={stats?.doctorsVisited || 0}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <Card title="Quick Actions" loading={loading}>
          <div className="space-y-3">
            <Link
              to="/appointments/book"
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiPlus className="h-5 w-5 text-blue-600" />
                </div>
                <span className="ml-3 font-medium text-gray-900">
                  Book New Appointment
                </span>
              </div>
              <FiArrowRight className="h-5 w-5 text-gray-400" />
            </Link>
            <Link
              to="/doctors"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiUsers className="h-5 w-5 text-gray-600" />
                </div>
                <span className="ml-3 font-medium text-gray-900">Find Doctors</span>
              </div>
              <FiArrowRight className="h-5 w-5 text-gray-400" />
            </Link>
            <Link
              to="/appointments"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiClock className="h-5 w-5 text-gray-600" />
                </div>
                <span className="ml-3 font-medium text-gray-900">
                  View All Appointments
                </span>
              </div>
              <FiArrowRight className="h-5 w-5 text-gray-400" />
            </Link>
            <Link
              to="/medical-history"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiFileText className="h-5 w-5 text-gray-600" />
                </div>
                <span className="ml-3 font-medium text-gray-900">
                  Medical History
                </span>
              </div>
              <FiArrowRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card
          title="Upcoming Appointments"
          action={
            upcomingAppointments.length > 0 && (
              <Link
                to="/appointments"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </Link>
            )
          }
          loading={loading}
        >
          {upcomingAppointments.length === 0 ? (
            <EmptyState
              icon={FiCalendar}
              title="No upcoming appointments"
              description="You don't have any scheduled appointments. Book one now to get started."
              actionLabel="Book Appointment"
              actionPath="/appointments/book"
            />
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.doctorName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.department}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        appointment.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-600">
                    <FiCalendar className="h-4 w-4 mr-2" />
                    {appointment.date} at {appointment.time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity" loading={loading}>
        <EmptyState
          icon={FiActivity}
          title="No recent activity"
          description="Your recent appointments and activities will appear here."
        />
      </Card>
    </>
  );

  // Doctor Dashboard
  const DoctorDashboard = () => {
    const [doctorStats, setDoctorStats] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);

    useEffect(() => {
      const loadDoctorData = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setDoctorStats({
          todayAppointments: 0,
          completedToday: 0,
          pending: 0,
          totalPatients: 0,
        });
        setTodayAppointments([]);
      };
      loadDoctorData();
    }, []);

    return (
      <>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome, Dr. {user?.lastName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your schedule and patient appointments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={FiCalendar}
            label="Today's Appointments"
            value={doctorStats?.todayAppointments || 0}
            color="blue"
            loading={loading}
          />
          <StatsCard
            icon={FiCheckCircle}
            label="Completed Today"
            value={doctorStats?.completedToday || 0}
            color="green"
            loading={loading}
          />
          <StatsCard
            icon={FiAlertCircle}
            label="Pending"
            value={doctorStats?.pending || 0}
            color="yellow"
            loading={loading}
          />
          <StatsCard
            icon={FiUsers}
            label="Total Patients"
            value={doctorStats?.totalPatients || 0}
            color="purple"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="Today's Schedule" loading={loading}>
            {todayAppointments.length === 0 ? (
              <EmptyState
                icon={FiClock}
                title="No appointments today"
                description="You don't have any appointments scheduled for today."
              />
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium">{apt.patientName}</p>
                    <p className="text-sm text-gray-500">{apt.time}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Quick Actions" loading={loading}>
            <div className="space-y-3">
              <Link
                to="/doctor/schedule"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">View Schedule</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                to="/doctor/patients"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiUsers className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">My Patients</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                to="/doctor/availability"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiClock className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Set Availability</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </Card>
        </div>
      </>
    );
  };

  // Admin Dashboard
  const AdminDashboard = () => {
    const [adminStats, setAdminStats] = useState(null);

    useEffect(() => {
      const loadAdminData = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAdminStats({
          totalDoctors: 0,
          totalPatients: 0,
          appointmentsToday: 0,
          departments: 0,
        });
      };
      loadAdminData();
    }, []);

    return (
      <>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">System overview and management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={FiUsers}
            label="Total Doctors"
            value={adminStats?.totalDoctors || 0}
            color="blue"
            loading={loading}
          />
          <StatsCard
            icon={FiUsers}
            label="Total Patients"
            value={adminStats?.totalPatients || 0}
            color="green"
            loading={loading}
          />
          <StatsCard
            icon={FiCalendar}
            label="Appointments Today"
            value={adminStats?.appointmentsToday || 0}
            color="yellow"
            loading={loading}
          />
          <StatsCard
            icon={FiActivity}
            label="Departments"
            value={adminStats?.departments || 0}
            color="purple"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="Quick Actions" loading={loading}>
            <div className="space-y-3">
              <Link
                to="/admin/doctors"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiUsers className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Manage Doctors</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                to="/admin/patients"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiUsers className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Manage Patients</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                to="/admin/departments"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiActivity className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Departments</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                to="/admin/reports"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiFileText className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-900">Reports</span>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </Card>

          <Card title="Recent Activity" loading={loading}>
            <EmptyState
              icon={FiActivity}
              title="No recent activity"
              description="System activities will appear here."
            />
          </Card>
        </div>
      </>
    );
  };

  // Render dashboard based on role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'PATIENT':
        return <PatientDashboard />;
      case 'DOCTOR':
        return <DoctorDashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default Dashboard;
