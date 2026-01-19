import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'Book Appointment', path: '/appointments/book' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Accessibility', path: '/accessibility' },
  ];

  const departments = [
    { name: 'Cardiology', path: '/departments/cardiology' },
    { name: 'Neurology', path: '/departments/neurology' },
    { name: 'Orthopedics', path: '/departments/orthopedics' },
    { name: 'Pediatrics', path: '/departments/pediatrics' },
    { name: 'Dermatology', path: '/departments/dermatology' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FiFacebook, url: 'https://facebook.com' },
    { name: 'Twitter', icon: FiTwitter, url: 'https://twitter.com' },
    { name: 'Instagram', icon: FiInstagram, url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: FiLinkedin, url: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-2 rounded-lg">
                <FiActivity className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                Hospital Booking
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Your trusted partner in healthcare. Book appointments with top doctors
              easily and conveniently.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <FiMapPin className="h-4 w-4 mr-3 text-teal-500" />
                <span>123 Medical Center Drive, London, UK</span>
              </div>
              <div className="flex items-center text-sm">
                <FiPhone className="h-4 w-4 mr-3 text-teal-500" />
                <span>+44 20 1234 5678</span>
              </div>
              <div className="flex items-center text-sm">
                <FiMail className="h-4 w-4 mr-3 text-teal-500" />
                <span>contact@hospitalbooking.com</span>
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
                    className="text-sm hover:text-teal-400 transition-colors"
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
                <li key={dept.path}>
                  <Link
                    to={dept.path}
                    className="text-sm hover:text-teal-400 transition-colors"
                  >
                    {dept.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-teal-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-semibold mb-2">
                Subscribe to our Newsletter
              </h3>
              <p className="text-sm text-gray-400">
                Get health tips and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-500 w-64"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-r-lg hover:from-teal-600 hover:to-cyan-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Copyright */}
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {currentYear} Hospital Booking System. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
