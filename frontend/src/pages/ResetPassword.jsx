import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FiLock, FiActivity, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import useForm from '../hooks/useForm';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import authService from '../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiError, setApiError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const token = searchParams.get('token');

  const validationRules = {
    newPassword: {
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
        if (value !== values.newPassword) {
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
  } = useForm({ newPassword: '', confirmPassword: '' }, validationRules);

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

  const passwordStrength = getPasswordStrength(values.newPassword);

  const onSubmit = async (formValues) => {
    setApiError('');
    try {
      await authService.resetPassword(token, formValues.newPassword);
      setResetSuccess(true);
      toast.success('Your password has been reset!', { title: 'Success' });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to reset password. Please try again.';
      setApiError(message);
      toast.error(message, { title: 'Reset Failed' });
    }
  };

  // No token in URL
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-primary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-soft-lg border border-white/50 sm:rounded-2xl sm:px-10 text-center">
            <Alert
              type="error"
              message="Invalid password reset link. Please request a new one."
              className="mb-6"
            />
            <Link
              to="/forgot-password"
              className="w-full inline-flex justify-center py-3 px-4 border-2 border-primary-500 rounded-xl shadow-sm text-sm font-semibold text-primary-600 bg-white dark:bg-gray-800 hover:bg-primary-50 hover:border-primary-600 transition-all duration-200"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          {resetSuccess ? 'Password Reset!' : 'Set New Password'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {resetSuccess
            ? 'Redirecting you to sign in...'
            : 'Create a strong password for your account'}
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-soft-lg border border-white/50 sm:rounded-2xl sm:px-10">
          {resetSuccess ? (
            /* Success State */
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <FiCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Your password has been reset successfully. You will be redirected to the login page shortly.
              </p>
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-primary-500 rounded-xl shadow-sm text-sm font-semibold text-primary-600 bg-white dark:bg-gray-800 hover:bg-primary-50 hover:border-primary-600 transition-all duration-200"
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            /* Form State */
            <>
              {apiError && (
                <Alert
                  type="error"
                  message={apiError}
                  onClose={() => setApiError('')}
                  className="mb-6"
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.newPassword}
                  touched={touched.newPassword}
                  placeholder="Create a strong password"
                  icon={FiLock}
                  autoComplete="new-password"
                  required
                />

                {/* Password Strength Indicator */}
                {values.newPassword && (
                  <div className="mb-4 -mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                        <FiCheck className={values.newPassword.length >= 8 ? 'text-success-500' : 'text-gray-300'} />
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-1">
                        <FiCheck className={/[A-Z]/.test(values.newPassword) ? 'text-success-500' : 'text-gray-300'} />
                        One uppercase letter
                      </li>
                      <li className="flex items-center gap-1">
                        <FiCheck className={/[a-z]/.test(values.newPassword) ? 'text-success-500' : 'text-gray-300'} />
                        One lowercase letter
                      </li>
                      <li className="flex items-center gap-1">
                        <FiCheck className={/[0-9]/.test(values.newPassword) ? 'text-success-500' : 'text-gray-300'} />
                        One number
                      </li>
                    </ul>
                  </div>
                )}

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

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
