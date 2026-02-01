import { useState } from 'react';
import {
  FiUser,
  FiLock,
  FiPhone,
  FiMail,
  FiSave,
} from 'react-icons/fi';
import api from '../services/api';
import { getErrorMessage } from '../utils/errorMessages';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Input, Alert, Card } from '../components/ui';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [profileTouched, setProfileTouched] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordTouched, setPasswordTouched] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  // Profile validation
  const getProfileErrors = () => {
    const errors = {};
    if (!profileForm.firstName.trim()) errors.firstName = 'First name is required';
    else if (profileForm.firstName.trim().length < 2) errors.firstName = 'Must be at least 2 characters';
    if (!profileForm.lastName.trim()) errors.lastName = 'Last name is required';
    else if (profileForm.lastName.trim().length < 2) errors.lastName = 'Must be at least 2 characters';
    return errors;
  };

  // Password validation
  const getPasswordErrors = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) errors.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 8) errors.newPassword = 'Must be at least 8 characters';
    if (!passwordForm.confirmPassword) errors.confirmPassword = 'Please confirm your new password';
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const profileErrors = getProfileErrors();
  const passwordErrors = getPasswordErrors();

  // Profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileBlur = (e) => {
    const { name } = e.target;
    setProfileTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileTouched({ firstName: true, lastName: true, phoneNumber: true });

    if (Object.keys(profileErrors).length > 0) return;

    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await api.put('/users/me/profile', {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phoneNumber: profileForm.phoneNumber.trim() || null,
      });

      // Update auth context
      updateUser({
        ...user,
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phoneNumber: profileForm.phoneNumber.trim() || null,
      });

      setProfileSuccess('Profile updated successfully');
      toast.success('Profile updated successfully');
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to update profile. Please try again.');
      setProfileError(message);
      toast.error(message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Password handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordBlur = (e) => {
    const { name } = e.target;
    setPasswordTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordTouched({ currentPassword: true, newPassword: true, confirmPassword: true });

    if (Object.keys(passwordErrors).length > 0) return;

    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      await api.put('/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordTouched({});
      setPasswordSuccess('Password changed successfully');
      toast.success('Password changed successfully');
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to change password. Please check your current password.');
      setPasswordError(message);
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Initials for avatar
  const getInitials = () => {
    const first = profileForm.firstName?.[0] || '';
    const last = profileForm.lastName?.[0] || '';
    return (first + last).toUpperCase();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Profile Information</h2>
          <p className="text-sm text-gray-500 mb-6">Update your personal details</p>

          {profileSuccess && (
            <Alert type="success" message={profileSuccess} onClose={() => setProfileSuccess(null)} className="mb-4" />
          )}
          {profileError && (
            <Alert type="error" message={profileError} onClose={() => setProfileError(null)} className="mb-4" />
          )}

          {/* Avatar & Name Display */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary-500/20 mr-4">
              {getInitials()}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {profileForm.firstName} {profileForm.lastName}
              </p>
              <p className="text-sm text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={profileForm.firstName}
                onChange={handleProfileChange}
                onBlur={handleProfileBlur}
                error={profileErrors.firstName}
                touched={profileTouched.firstName}
                icon={FiUser}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={profileForm.lastName}
                onChange={handleProfileChange}
                onBlur={handleProfileBlur}
                error={profileErrors.lastName}
                touched={profileTouched.lastName}
                icon={FiUser}
                required
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              value={user?.email || ''}
              onChange={() => {}}
              icon={FiMail}
              disabled
              helpText="Email cannot be changed"
            />

            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={profileForm.phoneNumber}
              onChange={handleProfileChange}
              onBlur={handleProfileBlur}
              icon={FiPhone}
              placeholder="e.g. +44 7911 123456"
            />

            <div className="pt-2">
              <Button type="submit" disabled={profileLoading}>
                {profileLoading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Password Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Change Password</h2>
          <p className="text-sm text-gray-500 mb-6">Update your password to keep your account secure</p>

          {passwordSuccess && (
            <Alert type="success" message={passwordSuccess} onClose={() => setPasswordSuccess(null)} className="mb-4" />
          )}
          {passwordError && (
            <Alert type="error" message={passwordError} onClose={() => setPasswordError(null)} className="mb-4" />
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordErrors.currentPassword}
              touched={passwordTouched.currentPassword}
              icon={FiLock}
              required
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordErrors.newPassword}
              touched={passwordTouched.newPassword}
              icon={FiLock}
              required
              helpText="Must be at least 8 characters"
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={passwordErrors.confirmPassword}
              touched={passwordTouched.confirmPassword}
              icon={FiLock}
              required
            />

            <div className="pt-2">
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? (
                  <>Changing...</>
                ) : (
                  <>
                    <FiLock className="mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
