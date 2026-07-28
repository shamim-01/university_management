import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      console.log('📝 Register attempt:', {
        email: formData.email,
        name: formData.name,
      });

      const { confirmPassword, ...registerData } = formData;
      const response = await api.post('/auth/register', registerData);

      console.log('✅ Register response:', response.data);

      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('❌ Register error:', err);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Circles */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(236, 72, 153, 0.1), transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.05), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(24px)',
          borderRadius: '1.5rem',
          padding: '2.5rem',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'white',
              boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)',
            }}
          >
            U
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '-0.025em',
            }}
          >
            Create Account
          </h1>
          <p
            style={{
              color: '#9ca3af',
              marginTop: '0.25rem',
              fontSize: '0.875rem',
            }}
          >
            Join us and get started today
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.15)',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.12)',
              color: '#4ade80',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              textAlign: 'center',
              border: '1px solid rgba(34, 197, 94, 0.15)',
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.4rem',
                letterSpacing: '0.025em',
              }}
            >
              Full Name
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0.75rem',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px rgba(139, 92, 246, 0.15)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <UserIcon
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: '#6b7280',
                  marginLeft: '1rem',
                  flexShrink: 0,
                }}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '0.95rem',
                }}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.4rem',
                letterSpacing: '0.025em',
              }}
            >
              Email Address
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0.75rem',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px rgba(139, 92, 246, 0.15)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <EnvelopeIcon
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: '#6b7280',
                  marginLeft: '1rem',
                  flexShrink: 0,
                }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '0.95rem',
                }}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.4rem',
                letterSpacing: '0.025em',
              }}
            >
              Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0.75rem',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px rgba(139, 92, 246, 0.15)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <LockClosedIcon
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: '#6b7280',
                  marginLeft: '1rem',
                  flexShrink: 0,
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '0.95rem',
                }}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#d1d5db';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                {showPassword ? (
                  <EyeSlashIcon
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                ) : (
                  <EyeIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.4rem',
                letterSpacing: '0.025em',
              }}
            >
              Confirm Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0.75rem',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px rgba(139, 92, 246, 0.15)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <LockClosedIcon
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: '#6b7280',
                  marginLeft: '1rem',
                  flexShrink: 0,
                }}
              />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '0.95rem',
                }}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#d1d5db';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                ) : (
                  <EyeIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                )}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '0.4rem',
                letterSpacing: '0.025em',
              }}
            >
              Role
            </label>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border:
                    formData.role === 'student'
                      ? '2px solid #8b5cf6'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  background:
                    formData.role === 'student'
                      ? 'rgba(139, 92, 246, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)',
                  color: formData.role === 'student' ? '#c4b5fd' : '#9ca3af',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={e => {
                  if (formData.role !== 'student') {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.08)';
                  }
                }}
                onMouseLeave={e => {
                  if (formData.role !== 'student') {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.05)';
                  }
                }}
              >
                <UserGroupIcon style={{ width: '1rem', height: '1rem' }} />
                Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'teacher' })}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border:
                    formData.role === 'teacher'
                      ? '2px solid #8b5cf6'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  background:
                    formData.role === 'teacher'
                      ? 'rgba(139, 92, 246, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)',
                  color: formData.role === 'teacher' ? '#c4b5fd' : '#9ca3af',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={e => {
                  if (formData.role !== 'teacher') {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.08)';
                  }
                }}
                onMouseLeave={e => {
                  if (formData.role !== 'teacher') {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.05)';
                  }
                }}
              >
                <UserIcon style={{ width: '1rem', height: '1rem' }} />
                Teacher
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1,
              boxShadow: loading
                ? 'none'
                : '0 4px 20px rgba(139, 92, 246, 0.35)',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 30px rgba(139, 92, 246, 0.45)';
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 20px rgba(139, 92, 246, 0.35)';
              }
            }}
          >
            {loading ? (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#a78bfa';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#8b5cf6';
            }}
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;
