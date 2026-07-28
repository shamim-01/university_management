import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setValidToken(false);
      setError('Invalid reset link');
    }
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      console.log('✅ Reset password response:', response.data);

      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(24px)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1rem',
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
            }}
          >
            ❌
          </div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
            Invalid Reset Link
          </h2>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
            The password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: 'white',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

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
      {/* Background Decorations */}
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
          maxWidth: '420px',
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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1rem',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'white',
              boxShadow: '0 8px 30px rgba(34, 197, 94, 0.3)',
            }}
          >
            🔑
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '-0.025em',
            }}
          >
            Reset Password
          </h1>
          <p
            style={{
              color: '#9ca3af',
              marginTop: '0.25rem',
              fontSize: '0.875rem',
            }}
          >
            Enter your new password below
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
          {/* New Password */}
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
              New Password
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
                value={password}
                onChange={e => setPassword(e.target.value)}
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
              Confirm New Password
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
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
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
                : '0 4px 20px rgba(34, 197, 94, 0.35)',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 30px rgba(34, 197, 94, 0.45)';
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 20px rgba(34, 197, 94, 0.35)';
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
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
          }}
        >
          <Link
            to="/login"
            style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
