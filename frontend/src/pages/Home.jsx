import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiUsers,
  FiClock,
  FiShield,
  FiActivity,
  FiArrowRight,
  FiMapPin,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FiCalendar,
      title: 'Easy Booking',
      description: 'Book appointments with just a few clicks. Choose your preferred doctor and time slot.',
    },
    {
      icon: FiUsers,
      title: 'Expert Doctors',
      description: 'Access to qualified healthcare professionals across multiple specializations.',
    },
    {
      icon: FiClock,
      title: '24/7 Access',
      description: 'Manage your appointments anytime, anywhere with our online platform.',
    },
    {
      icon: FiMapPin,
      title: 'NHS Hospitals',
      description: 'Browse real NHS hospital data and find healthcare services near you.',
    },
    {
      icon: FiShield,
      title: 'Secure & Private',
      description: 'Your health information is protected with industry-standard security.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white -m-4 sm:-m-6 lg:-m-8 px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/15 backdrop-blur-sm p-5 rounded-2xl shadow-lg shadow-primary-lg">
                <FiActivity className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Your Health, Our Priority
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-12 leading-relaxed">
              Book appointments with top doctors easily and conveniently.
              Quality healthcare is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Go to Dashboard
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Get Started
                    <FiArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center border-2 border-white/80 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <div className="mt-6">
              <Link
                to="/hospitals"
                className="inline-flex items-center text-primary-200 hover:text-white text-sm font-medium transition-colors"
              >
                <FiMapPin className="mr-1.5 h-4 w-4" />
                Browse NHS Hospitals
                <FiArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full mb-4">
              Our Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide the best healthcare booking experience with modern technology and caring service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft border border-gray-100/60 dark:border-gray-700/60 hover:shadow-soft-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-primary-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-primary-sm">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-gray-50 dark:from-gray-800 to-gray-100/80 dark:to-gray-900/80 py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <p className="text-4xl font-bold text-primary-600 tracking-tight">50+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Expert Doctors</p>
            </div>
            <div className="text-center p-6">
              <p className="text-4xl font-bold text-primary-600 tracking-tight">10k+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Happy Patients</p>
            </div>
            <div className="text-center p-6">
              <p className="text-4xl font-bold text-primary-600 tracking-tight">220+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">NHS Hospitals</p>
            </div>
            <div className="text-center p-6">
              <p className="text-4xl font-bold text-primary-600 tracking-tight">24/7</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Online Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
            Join thousands of patients who trust us with their healthcare needs.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 shadow-lg shadow-primary-sm hover:shadow-xl hover:shadow-primary transition-all duration-200"
            >
              Create Free Account
              <FiArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
