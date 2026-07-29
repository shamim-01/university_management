import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  UserIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  BriefcaseIcon,
  InformationCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ User Data থেকে Role নিন
  const [profile, setProfile] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@university.com',
    role: user?.role || 'Student', // ✅ Role সেট করুন
    department: user?.department || 'Computer Science',
    phone: user?.phone || '+880 1234 567890',
    bio: user?.bio || 'Passionate about learning and technology',
    avatar: user?.avatar || '',
    joinDate: user?.createdAt || new Date().toISOString(),
  });

  const [formData, setFormData] = useState(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // ✅ Role Change হলে Profile Update করুন
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || 'User',
        email: user.email || 'user@university.com',
        role: user.role || 'Student',
        department: user.department || 'Computer Science',
        phone: user.phone || '+880 1234 567890',
        bio: user.bio || 'Passionate about learning and technology',
        avatar: user.avatar || '',
        joinDate: user.createdAt || new Date().toISOString(),
      });
      setFormData({
        name: user.name || 'User',
        email: user.email || 'user@university.com',
        role: user.role || 'Student',
        department: user.department || 'Computer Science',
        phone: user.phone || '+880 1234 567890',
        bio: user.bio || 'Passionate about learning and technology',
        avatar: user.avatar || '',
        joinDate: user.createdAt || new Date().toISOString(),
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile({
        name: formData.name,
        phoneNumber: formData.phone,
        bio: formData.bio,
        department: formData.department,
      });

      if (result.success) {
        setProfile(formData);
        setIsEditing(false);
        setSuccess('✅ Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        setSuccess('🔒 Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordForm(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setError('');
  };

  // ✅ Role অনুযায়ী Color
  const getRoleColor = role => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/20';
      case 'teacher':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'student':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  // ✅ Role অনুযায়ী Icon
  const getRoleIcon = role => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '👑';
      case 'teacher':
        return '👨‍🏫';
      case 'student':
        return '🎓';
      default:
        return '👤';
    }
  };

  // ✅ Role অনুযায়ী Gradient
  const getGradientColor = role => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'from-purple-500 to-pink-500';
      case 'teacher':
        return 'from-blue-500 to-cyan-500';
      case 'student':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  // ✅ Role Label
  const getRoleLabel = role => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'teacher':
        return 'Faculty Member';
      case 'student':
        return 'Student';
      default:
        return 'User';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-gray-400 text-lg font-medium">
            Please login to view profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="hidden md:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 items-center justify-center backdrop-blur-sm">
                <UserIcon className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    My Profile
                  </h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/20">
                    <SparklesIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-400 text-xs font-medium">
                      {getRoleLabel(profile.role)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm flex items-center gap-2 mt-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Manage your personal information and account settings
                </p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <PencilIcon className="w-5 h-5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium text-sm hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                  <CheckIcon className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 text-red-400 rounded-xl font-medium text-sm hover:bg-red-500/30 transition-all duration-200 border border-red-500/20"
                >
                  <XMarkIcon className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <XMarkIcon className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <CheckIcon className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

          <div className="relative p-6 md:p-8">
            {/* Profile Header with Avatar */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="relative">
                <div
                  className={`w-28 h-28 rounded-full bg-gradient-to-r ${getGradientColor(profile.role)} flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-purple-500/30 border-3 border-white/10`}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-1 right-1 p-2 bg-purple-500 rounded-full border-2 border-gray-900 hover:bg-purple-600 transition-all duration-200 hover:scale-110 shadow-lg">
                  <CameraIcon className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {profile.name}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(profile.role)}`}
                  >
                    {getRoleIcon(profile.role)}{' '}
                    {profile.role.charAt(0).toUpperCase() +
                      profile.role.slice(1)}
                  </span>
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Joined{' '}
                    {new Date(profile.joinDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-purple-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                      Full Name
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-purple-500/30 text-white text-sm font-medium outline-none focus:border-purple-500 transition-all duration-200 py-1"
                        autoFocus
                      />
                    ) : (
                      <p className="text-white text-sm font-medium truncate">
                        {profile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-pink-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                      Email
                    </p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-purple-500/30 text-white text-sm font-medium outline-none focus:border-purple-500 transition-all duration-200 py-1"
                      />
                    ) : (
                      <p className="text-white text-sm font-medium truncate">
                        {profile.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-emerald-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                      Phone
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={e =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-purple-500/30 text-white text-sm font-medium outline-none focus:border-purple-500 transition-all duration-200 py-1"
                      />
                    ) : (
                      <p className="text-white text-sm font-medium truncate">
                        {profile.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <BuildingLibraryIcon className="w-5 h-5 text-blue-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                      Department
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.department}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border-b border-purple-500/30 text-white text-sm font-medium outline-none focus:border-purple-500 transition-all duration-200 py-1"
                      />
                    ) : (
                      <p className="text-white text-sm font-medium truncate">
                        {profile.department}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
                      Bio
                    </p>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={e =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        rows="2"
                        className="w-full bg-transparent border-b border-purple-500/30 text-white text-sm outline-none focus:border-purple-500 transition-all duration-200 py-1 resize-none"
                      />
                    ) : (
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {profile.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all duration-200 text-sm font-medium"
              >
                <ShieldCheckIcon className="w-5 h-5" />
                {showPasswordForm ? 'Hide' : 'Change'} Password
              </button>

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="password"
                      placeholder="Current Password *"
                      value={passwordData.currentPassword}
                      onChange={e =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      required
                    />
                    <input
                      type="password"
                      placeholder="New Password *"
                      value={passwordData.newPassword}
                      onChange={e =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password *"
                      value={passwordData.confirmPassword}
                      onChange={e =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50"
                    >
                      {loading ? 'Changing...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                      className="px-6 py-2.5 bg-white/5 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-all duration-200 border border-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* CSS */}
        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% auto;
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Profile;
