import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiActivity, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useForm from '../hooks/useForm';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
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
      { label: 'Weak', color: 'bg-error-500' },
      { label: 'Fair', color: 'bg-orange-500' },
      { label: 'Good', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-success-500' },
      { label: 'Very Strong', color: 'bg-success-600' },
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
      toast.success('Your account has been created successfully!', {
        title: 'Registration Successful',
        duration: 4000,
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      setApiError(message);
      toast.error(message, { title: 'Registration Failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-full">
            <FiActivity className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Join Hospital Booking to manage your appointments
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10">
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
                placeholder="Enter your first name"
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
                placeholder="Enter your last name"
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
              placeholder="07700 900000"
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
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength.strength <= 2 ? 'text-error-500' :
                    passwordStrength.strength <= 3 ? 'text-yellow-500' : 'text-success-500'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li className="flex items-center gap-1">
                    <FiCheck className={values.password.length >= 8 ? 'text-success-500' : 'text-gray-300'} />
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-1">
                    <FiCheck className={/[A-Z]/.test(values.password) ? 'text-success-500' : 'text-gray-300'} />
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-1">
                    <FiCheck className={/[a-z]/.test(values.password) ? 'text-success-500' : 'text-gray-300'} />
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-1">
                    <FiCheck className={/[0-9]/.test(values.password) ? 'text-success-500' : 'text-gray-300'} />
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
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-primary-600 rounded-lg shadow-sm text-sm font-semibold text-primary-600 bg-white dark:bg-gray-800 hover:bg-primary-50 transition-colors duration-200"
              >
                Sign In Instead
              </Link>
            </div>
          </div>

          {/* Doctor Notice */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Are you a healthcare professional?</span>{' '}
              Doctor accounts are created by hospital administrators. Please contact your hospital's admin team to get your account set up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
