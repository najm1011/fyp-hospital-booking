import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiUsers,
  FiClock,
  FiShield,
  FiHeart,
  FiArrowRight,
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
      icon: FiShield,
      title: 'Secure & Private',
      description: 'Your health information is protected with industry-standard security.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white -m-4 sm:-m-6 lg:-m-8 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <FiHeart className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-xl sm:text-2xl text-teal-100 max-w-3xl mx-auto mb-10">
              Book appointments with top doctors easily and conveniently.
              Quality healthcare is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-50 transition-colors"
                >
                  Go to Dashboard
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-50 transition-colors"
                  >
                    Get Started
                    <FiArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best healthcare booking experience with modern technology and caring service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="bg-teal-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-teal-600">50+</p>
              <p className="text-gray-600 mt-2">Expert Doctors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-teal-600">10k+</p>
              <p className="text-gray-600 mt-2">Happy Patients</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-teal-600">15+</p>
              <p className="text-gray-600 mt-2">Departments</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-teal-600">24/7</p>
              <p className="text-gray-600 mt-2">Online Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of patients who trust us with their healthcare needs.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 transition-colors"
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
