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
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@university.com',
    role: user?.role || 'Student',
    department: 'Computer Science',
    phone: '+880 1234 567890',
    bio: 'Passionate about learning and technology',
    avatar: user?.avatar || '',
  });

  const [formData, setFormData] = useState(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile({
        name: formData.name,
        phoneNumber: formData.phone,
      });

      if (result.success) {
        setProfile(formData);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
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

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        setSuccess('Password changed successfully!');
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

  const getRoleColor = role => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-400';
      case 'teacher':
        return 'bg-blue-500/20 text-blue-400';
      case 'student':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (!user) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
        Please login to view profile
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <UserIcon
              style={{ width: '1.75rem', height: '1.75rem', color: '#a78bfa' }}
            />
            <span>My Profile</span>
          </h1>
          <p
            style={{
              color: '#9ca3af',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
            }}
          >
            Manage your personal information and account settings
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.5rem',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 6px 25px rgba(139, 92, 246, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 15px rgba(139, 92, 246, 0.3)';
            }}
          >
            <PencilIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.5rem',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <CheckIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={handleCancel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.5rem',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                borderRadius: '0.5rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              }}
            >
              <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#4ade80',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        >
          {success}
        </div>
      )}

      {/* Profile Card */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient circle */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(236, 72, 153, 0.05), transparent)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Avatar Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${profile.role === 'admin' ? '#8b5cf6' : profile.role === 'teacher' ? '#3b82f6' : '#22c55e'}, #ec4899)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)',
                  border: '3px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <button
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  padding: '0.5rem',
                  background: 'rgba(139, 92, 246, 0.9)',
                  borderRadius: '50%',
                  border: '2px solid #1a1a1a',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#8b5cf6';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.9)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <CameraIcon
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: 'white',
                  }}
                />
              </button>
            </div>
            <h2
              style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginTop: '1rem',
              }}
            >
              {profile.name}
            </h2>
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                background: getRoleColor(profile.role).split(' ')[0],
                color: getRoleColor(profile.role).split(' ')[1],
                marginTop: '0.25rem',
              }}
            >
              {profile.role}
            </span>
          </div>

          {/* Profile Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              width: '100%',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '0.75rem',
                padding: '1rem 1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <UserIcon
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#6b7280',
                  }}
                />
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    Full Name
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '0.4rem 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                      autoFocus
                    />
                  ) : (
                    <p
                      style={{
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      {profile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '0.75rem',
                padding: '1rem 1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <EnvelopeIcon
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#6b7280',
                  }}
                />
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '0.4rem 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      {profile.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '0.75rem',
                padding: '1rem 1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <PhoneIcon
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#6b7280',
                  }}
                />
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Phone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '0.4rem 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      {profile.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '0.75rem',
                padding: '1rem 1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <BriefcaseIcon
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#6b7280',
                  }}
                />
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Role</p>
                  {isEditing ? (
                    <select
                      value={formData.role}
                      onChange={e =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '0.4rem 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      <option value="Admin" style={{ background: '#1a1a1a' }}>
                        Admin
                      </option>
                      <option value="Teacher" style={{ background: '#1a1a1a' }}>
                        Teacher
                      </option>
                      <option value="Student" style={{ background: '#1a1a1a' }}>
                        Student
                      </option>
                    </select>
                  ) : (
                    <p
                      style={{
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                      }}
                    >
                      {profile.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '0.75rem',
                padding: '1rem 1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                gridColumn: isEditing ? '1 / -1' : 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}
              >
                <BuildingLibraryIcon
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#6b7280',
                    marginTop: '0.125rem',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    Department
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.department}
                      onChange={e =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      style={{
                        width: '100%',
                        padding: '0.4rem 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }}
                    >
                      {profile.department}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '0.75rem',
                padding: '1rem 1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                gridColumn: '1 / -1',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}
              >
                <InformationCircleIcon
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    color: '#6b7280',
                    marginTop: '0.125rem',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Bio</p>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={e =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows="2"
                      style={{
                        width: '100%',
                        padding: '0.4rem 0',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  ) : (
                    <p
                      style={{
                        color: '#d1d5db',
                        fontSize: '0.875rem',
                        lineHeight: '1.6',
                      }}
                    >
                      {profile.bio || 'No bio provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div
            style={{
              width: '100%',
              marginTop: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: '#a78bfa',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                padding: '0.5rem 0',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#c4b5fd';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#a78bfa';
              }}
            >
              🔒 {showPasswordForm ? 'Hide' : 'Change'} Password
            </button>

            {showPasswordForm && (
              <form
                onSubmit={handlePasswordChange}
                style={{ marginTop: '1rem' }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                  }}
                >
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
                    style={{
                      gridColumn: '1 / -1',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#8b5cf6';
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.08)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.06)';
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.05)';
                    }}
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
                    style={{
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#8b5cf6';
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.08)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.06)';
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.05)';
                    }}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password *"
                    value={passwordData.confirmPassword}
                    onChange={e =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    style={{
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#8b5cf6';
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.08)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.06)';
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.05)';
                    }}
                    required
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '0.75rem',
                  }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '0.6rem 1.5rem',
                      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      transition: 'all 0.3s ease',
                      opacity: loading ? 0.6 : 1,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 15px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
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
                    style={{
                      padding: '0.6rem 1.5rem',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#9ca3af',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.05)';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
