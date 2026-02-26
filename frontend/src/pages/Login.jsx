import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiActivity, FiUser, FiUserCheck, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useForm from '../hooks/useForm';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [apiError, setApiError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

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
      await login(formValues, rememberMe);
      toast.success('Welcome back!', { title: 'Login Successful' });
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';
      setApiError(message);
      toast.error(message, { title: 'Login Failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-primary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg shadow-primary-500/30">
            <FiActivity className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {selectedRole
            ? selectedRole === 'DOCTOR'
              ? 'Welcome, Doctor'
              : 'Welcome Back'
            : 'Welcome to MediBook'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {selectedRole
            ? selectedRole === 'DOCTOR'
              ? 'Sign in to manage your practice'
              : 'Sign in to manage your appointments'
            : 'How would you like to sign in?'}
        </p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-soft-lg border border-white/50 sm:rounded-2xl sm:px-10">

          {/* Step 1: Role Selection */}
          {!selectedRole && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedRole('PATIENT')}
                  className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50/50 transition-all duration-200 group"
                >
                  <div className="bg-primary-100 group-hover:bg-primary-200 p-4 rounded-xl transition-colors duration-200">
                    <FiUser className="h-8 w-8 text-primary-600" />
                  </div>
                  <span className="mt-3 text-sm font-semibold text-gray-900">I'm a Patient</span>
                  <span className="mt-1 text-xs text-gray-500 text-center">Book & manage appointments</span>
                </button>

                <button
                  onClick={() => setSelectedRole('DOCTOR')}
                  className="flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50/50 transition-all duration-200 group"
                >
                  <div className="bg-primary-100 group-hover:bg-primary-200 p-4 rounded-xl transition-colors duration-200">
                    <FiUserCheck className="h-8 w-8 text-primary-600" />
                  </div>
                  <span className="mt-3 text-sm font-semibold text-gray-900">I'm a Doctor</span>
                  <span className="mt-1 text-xs text-gray-500 text-center">Manage your practice</span>
                </button>
              </div>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white/80 text-gray-500 rounded-full">
                      New to MediBook?
                    </span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="mt-6">
                  <Link
                    to="/register"
                    className="w-full inline-flex justify-center py-3 px-4 border-2 border-primary-500 rounded-xl shadow-sm text-sm font-semibold text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-600 transition-all duration-200"
                  >
                    Create an Account
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Login Form */}
          {selectedRole && (
            <>
              {/* Back to role selection */}
              <button
                onClick={() => { setSelectedRole(null); setApiError(''); }}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
              >
                <FiArrowLeft className="h-4 w-4 mr-1" />
                Change role
              </button>

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
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
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
                      className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
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
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white/80 text-gray-500 rounded-full">
                      New to MediBook?
                    </span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="mt-6">
                  <Link
                    to="/register"
                    className="w-full inline-flex justify-center py-3 px-4 border-2 border-primary-500 rounded-xl shadow-sm text-sm font-semibold text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-600 transition-all duration-200"
                  >
                    Create an Account
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <span className="text-primary-600">Terms of Service</span>{' '}
          and{' '}
          <span className="text-primary-600">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
