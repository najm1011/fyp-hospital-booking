import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiHeart, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validation rules
  const validationRules = {
    firstName: {
      required: { message: 'First name is required' },
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters',
      },
      maxLength: {
        value: 100,
        message: 'First name must not exceed 100 characters',
      },
    },
    lastName: {
      required: { message: 'Last name is required' },
      minLength: {
        value: 2,
        message: 'Last name must be at least 2 characters',
      },
      maxLength: {
        value: 100,
        message: 'Last name must not exceed 100 characters',
      },
    },
    email: {
      required: { message: 'Email is required' },
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Please enter a valid email address',
      },
    },
    phoneNumber: {
      pattern: {
        value: /^[0-9+\-\s()]*$/,
        message: 'Please enter a valid phone number',
      },
      maxLength: {
        value: 20,
        message: 'Phone number must not exceed 20 characters',
      },
    },
    password: {
      required: { message: 'Password is required' },
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters',
      },
      custom: (value) => {
        if (!/[A-Z]/.test(value)) {
          return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(value)) {
          return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(value)) {
          return 'Password must contain at least one number';
        }
        return '';
      },
    },
    confirmPassword: {
      required: { message: 'Please confirm your password' },
      custom: (value, values) => {
        if (value !== values.password) {
          return 'Passwords do not match';
        }
        return '';
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
  } = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    validationRules
  );

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: '', color: '' },
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-orange-500' },
      { label: 'Good', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-green-500' },
      { label: 'Very Strong', color: 'bg-green-600' },
    ];

    return { strength, ...levels[strength] };
  };

  const passwordStrength = getPasswordStrength(values.password);

  // Handle form submission
  const onSubmit = async (formValues) => {
    setApiError('');
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formValues;
      await register(userData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
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
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join Hospital Booking to manage your appointments
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10">
          {/* Success Alert */}
          {success && (
            <Alert
              type="success"
              title="Registration Successful!"
              message="Your account has been created. Redirecting to dashboard..."
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

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name Fields - Two columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                touched={touched.firstName}
                placeholder="John"
                icon={FiUser}
                autoComplete="given-name"
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                type="text"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
                touched={touched.lastName}
                placeholder="Doe"
                icon={FiUser}
                autoComplete="family-name"
                required
              />
            </div>

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

            {/* Phone Field */}
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phoneNumber}
              touched={touched.phoneNumber}
              placeholder="+1 (555) 000-0000"
              icon={FiPhone}
              autoComplete="tel"
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
              placeholder="Create a strong password"
              icon={FiLock}
              autoComplete="new-password"
              required
            />

            {/* Password Strength Indicator */}
            {values.password && (
              <div className="mb-4 -mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength.strength <= 2 ? 'text-red-500' :
                    passwordStrength.strength <= 3 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <ul className="mt-2 text-xs text-gray-500 space-y-1">
                  <li className="flex items-center gap-1">
                    <FiCheck className={values.password.length >= 8 ? 'text-green-500' : 'text-gray-300'} />
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-1">
                    <FiCheck className={/[A-Z]/.test(values.password) ? 'text-green-500' : 'text-gray-300'} />
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-1">
                    <FiCheck className={/[a-z]/.test(values.password) ? 'text-green-500' : 'text-gray-300'} />
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-1">
                    <FiCheck className={/[0-9]/.test(values.password) ? 'text-green-500' : 'text-gray-300'} />
                    One number
                  </li>
                </ul>
              </div>
            )}

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              placeholder="Confirm your password"
              icon={FiLock}
              autoComplete="new-password"
              required
            />

            {/* Terms Agreement */}
            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting || success}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-blue-600 rounded-lg shadow-sm text-sm font-semibold text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
