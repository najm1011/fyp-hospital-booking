import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Validation rules
  const validationRules = {
    email: {
      required: { message: 'Email is required' },
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Please enter a valid email address',
      },
    },
    password: {
      required: { message: 'Password is required' },
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters',
      },
    },
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({ email: '', password: '' }, validationRules);

  // Handle form submission
  const onSubmit = async (formValues) => {
    setApiError('');
    try {
      await login(formValues);
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';
      setApiError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-full">
            <FiHeart className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your Hospital Booking account
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10">
          {/* Session Error Alert (from expired token) */}
          {location.state?.sessionError && (
            <Alert
              type="warning"
              message={location.state.sessionError}
              className="mb-6"
            />
          )}

          {/* API Error Alert */}
          {apiError && (
            <Alert
              type="error"
              message={apiError}
              onClose={() => setApiError('')}
              className="mb-6"
            />
          )}

          {/* Redirect Message */}
          {location.state?.from && !location.state?.sessionError && (
            <Alert
              type="info"
              message="Please log in to access that page."
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder="you@example.com"
              icon={FiMail}
              autoComplete="email"
              required
            />

            {/* Password Field */}
            <Input
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              placeholder="Enter your password"
              icon={FiLock}
              autoComplete="current-password"
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to Hospital Booking?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6">
              <Link
                to="/register"
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-blue-600 rounded-lg shadow-sm text-sm font-semibold text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
