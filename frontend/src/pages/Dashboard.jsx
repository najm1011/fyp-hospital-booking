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
import { useToast } from '../context/ToastContext';
import { StatsCard, Card, EmptyState, Alert } from '../components/ui';
import AppointmentCard from '../components/AppointmentCard';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState(
    location.state?.accessDenied ? "You don't have permission to access that page." : null
  );

  // Fetch real data from API
  useEffect(() => {
    const loadPatientData = async () => {
      if (user?.role !== 'PATIENT') return;

      setLoading(true);
      try {
        // Fetch stats and upcoming appointments in parallel
        const [statsResponse, appointmentsResponse] = await Promise.all([
          api.get('/appointments/my-appointments/stats'),
          api.get('/appointments/my-appointments/upcoming'),
        ]);

        setStats({
          upcoming: statsResponse.data.upcoming || 0,
          completed: statsResponse.data.completed || 0,
          pending: statsResponse.data.pending || 0,
          doctorsVisited: statsResponse.data.uniqueDoctorsCount || 0,
        });

        // Get first 3 upcoming appointments for dashboard preview
        setUpcomingAppointments(appointmentsResponse.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Failed to load dashboard data');
        // Set default values on error
        setStats({
          upcoming: 0,
          completed: 0,
          pending: 0,
          doctorsVisited: 0,
        });
        setUpcomingAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [user?.role, toast]);

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
              className="flex items-center justify-between p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <FiPlus className="h-5 w-5 text-teal-600" />
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
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
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
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  variant="compact"
                  showActions={false}
                />
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
    const [doctorLoading, setDoctorLoading] = useState(true);

    useEffect(() => {
      const loadDoctorData = async () => {
        setDoctorLoading(true);
        try {
          // Fetch doctor stats and today's appointments in parallel
          const [statsResponse, todayResponse] = await Promise.all([
            api.get('/appointments/doctor/stats'),
            api.get('/appointments/doctor/appointments/today'),
          ]);

          setDoctorStats({
            todayAppointments: statsResponse.data.todayCount || 0,
            completedToday: statsResponse.data.completedTodayCount || 0,
            pending: statsResponse.data.pendingCount || 0,
            totalPatients: statsResponse.data.uniquePatientsCount || 0,
          });
          setTodayAppointments(todayResponse.data || []);
        } catch (err) {
          console.error('Error fetching doctor dashboard data:', err);
          toast.error('Failed to load dashboard data');
          setDoctorStats({
            todayAppointments: 0,
            completedToday: 0,
            pending: 0,
            totalPatients: 0,
          });
          setTodayAppointments([]);
        } finally {
          setDoctorLoading(false);
        }
      };
      loadDoctorData();
    }, [toast]);

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
            loading={doctorLoading}
          />
          <StatsCard
            icon={FiCheckCircle}
            label="Completed Today"
            value={doctorStats?.completedToday || 0}
            color="green"
            loading={doctorLoading}
          />
          <StatsCard
            icon={FiAlertCircle}
            label="Pending"
            value={doctorStats?.pending || 0}
            color="yellow"
            loading={doctorLoading}
          />
          <StatsCard
            icon={FiUsers}
            label="Total Patients"
            value={doctorStats?.totalPatients || 0}
            color="purple"
            loading={doctorLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="Today's Schedule" loading={doctorLoading}>
            {todayAppointments.length === 0 ? (
              <EmptyState
                icon={FiClock}
                title="No appointments today"
                description="You don't have any appointments scheduled for today."
              />
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    variant="compact"
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card title="Quick Actions" loading={doctorLoading}>
            <div className="space-y-3">
              <Link
                to="/doctor/schedule"
                className="flex items-center justify-between p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 text-teal-600 mr-3" />
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
    const [adminLoading, setAdminLoading] = useState(true);

    useEffect(() => {
      const loadAdminData = async () => {
        setAdminLoading(true);
        try {
          const statsResponse = await api.get('/appointments/admin/stats');
          setAdminStats({
            totalDoctors: statsResponse.data.totalDoctors || 0,
            totalPatients: statsResponse.data.totalPatients || 0,
            appointmentsToday: statsResponse.data.todayCount || 0,
            departments: statsResponse.data.totalDepartments || 0,
          });
        } catch (err) {
          console.error('Error fetching admin dashboard data:', err);
          toast.error('Failed to load dashboard data');
          setAdminStats({
            totalDoctors: 0,
            totalPatients: 0,
            appointmentsToday: 0,
            departments: 0,
          });
        } finally {
          setAdminLoading(false);
        }
      };
      loadAdminData();
    }, [toast]);

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
            loading={adminLoading}
          />
          <StatsCard
            icon={FiUsers}
            label="Total Patients"
            value={adminStats?.totalPatients || 0}
            color="green"
            loading={adminLoading}
          />
          <StatsCard
            icon={FiCalendar}
            label="Appointments Today"
            value={adminStats?.appointmentsToday || 0}
            color="yellow"
            loading={adminLoading}
          />
          <StatsCard
            icon={FiActivity}
            label="Departments"
            value={adminStats?.departments || 0}
            color="purple"
            loading={adminLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="Quick Actions" loading={adminLoading}>
            <div className="space-y-3">
              <Link
                to="/admin/doctors"
                className="flex items-center justify-between p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <div className="flex items-center">
                  <FiUsers className="h-5 w-5 text-teal-600 mr-3" />
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

          <Card title="Recent Activity" loading={adminLoading}>
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
