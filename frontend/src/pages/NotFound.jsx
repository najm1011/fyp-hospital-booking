import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
        <Link
          to="/"
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
