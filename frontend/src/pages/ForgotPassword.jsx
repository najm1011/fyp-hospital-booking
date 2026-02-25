import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiActivity, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import useForm from '../hooks/useForm';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import authService from '../services/authService';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [apiError, setApiError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const validationRules = {
    email: {
      required: { message: 'Email is required' },
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Please enter a valid email address',
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
  } = useForm({ email: '' }, validationRules);

  const onSubmit = async (formValues) => {
    setApiError('');
    try {
      await authService.forgotPassword(formValues.email);
      setSentEmail(formValues.email);
      setEmailSent(true);
      toast.success('Password reset email sent!', { title: 'Check Your Inbox' });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.';
      setApiError(message);
      toast.error(message, { title: 'Error' });
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
          {emailSent ? 'Check Your Email' : 'Forgot Password?'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {emailSent
            ? 'We\'ve sent you a password reset link'
            : 'Enter your email and we\'ll send you a reset link'}
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-soft-lg border border-white/50 sm:rounded-2xl sm:px-10">
          {emailSent ? (
            /* Success State */
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <FiCheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-700 mb-2">
                We've sent a password reset link to:
              </p>
              <p className="font-semibold text-gray-900 mb-6">{sentEmail}</p>
              <p className="text-sm text-gray-500 mb-8">
                The link will expire in 1 hour. If you don't see the email, check your spam folder.
              </p>
              <Link
                to="/login"
                className="w-full inline-flex justify-center py-3 px-4 border-2 border-primary-500 rounded-xl shadow-sm text-sm font-semibold text-primary-600 bg-white hover:bg-primary-50 hover:border-primary-600 transition-all duration-200"
              >
                Back to Sign In
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

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  <FiArrowLeft className="mr-1 h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
