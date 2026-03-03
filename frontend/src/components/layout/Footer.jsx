import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'Book Appointment', path: '/appointments/book' },
    { name: 'Register', path: '/register' },
    { name: 'Sign In', path: '/login' },
  ];

  const departments = [
    { name: 'Cardiology' },
    { name: 'Neurology' },
    { name: 'Orthopedics' },
    { name: 'Pediatrics' },
    { name: 'Dermatology' },
    { name: 'General Medicine' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-5">
              <div className="bg-primary-600 p-2.5 rounded-xl shadow-primary-sm">
                <FiActivity className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                MediBook
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Your trusted partner in healthcare. Book appointments with top doctors
              easily and conveniently.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <FiMapPin className="h-4 w-4 mr-3 text-primary-400" />
                <span>123 Medical Center Drive, London, UK</span>
              </div>
              <div className="flex items-center text-sm">
                <FiPhone className="h-4 w-4 mr-3 text-primary-400" />
                <span>+44 20 1234 5678</span>
              </div>
              <div className="flex items-center text-sm">
                <FiMail className="h-4 w-4 mr-3 text-primary-400" />
                <span>contact@medibook.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-white font-semibold mb-4">Departments</h3>
            <ul className="space-y-2">
              {departments.map((dept) => (
                <li key={dept.name}>
                  <span className="text-sm text-gray-400">
                    {dept.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="text-sm">
                <span className="text-gray-400">Mon - Fri:</span>
                <span className="text-gray-300 ml-2">8:00 AM - 6:00 PM</span>
              </li>
              <li className="text-sm">
                <span className="text-gray-400">Saturday:</span>
                <span className="text-gray-300 ml-2">9:00 AM - 2:00 PM</span>
              </li>
              <li className="text-sm">
                <span className="text-gray-400">Sunday:</span>
                <span className="text-gray-300 ml-2">Closed</span>
              </li>
              <li className="text-sm mt-3">
                <span className="text-gray-400">Emergency:</span>
                <span className="text-gray-300 ml-2">24/7</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © {currentYear} Hospital Booking System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
