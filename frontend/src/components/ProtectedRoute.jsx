import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from './ui/PageLoader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, sessionError } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return <PageLoader message="Verifying your session..." fullScreen transparent />;
  }

  // Not logged in - redirect to login with session error message if any
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          sessionError: sessionError,
        }}
        replace
      />
    );
  }

  // Check role if allowedRoles specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      // User doesn't have required role - redirect to dashboard with message
      return (
        <Navigate
          to="/dashboard"
          state={{ accessDenied: true }}
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;
