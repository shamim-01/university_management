import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔑 Login attempt:', { email });

      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.data);

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        console.log('✅ Token stored:', localStorage.getItem('token'));
        console.log('✅ User stored:', localStorage.getItem('user'));

        navigate('/dashboard');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(
        err.response?.data?.message || 'Login failed. Please try again.',
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
            Welcome Back
          </h1>
          <p
            style={{
              color: '#9ca3af',
              marginTop: '0.25rem',
              fontSize: '0.875rem',
            }}
          >
            Sign in to continue to your dashboard
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

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
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
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '0.95rem',
                }}
                placeholder="admin@university.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.4rem',
              }}
            >
              <label
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: '#d1d5db',
                  letterSpacing: '0.025em',
                }}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '0.75rem',
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#a78bfa';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#8b5cf6';
                }}
              >
                Forgot Password?
              </Link>
            </div>
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
              position: 'relative',
              overflow: 'hidden',
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
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Register Link */}
        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
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
            Create Account
          </Link>
        </div>

        {/* Demo Credentials */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.7rem',
              color: '#6b7280',
              marginBottom: '0.5rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Demo Credentials
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              fontSize: '0.75rem',
              color: '#9ca3af',
            }}
          >
            <span>
              <span style={{ color: '#6b7280' }}>Email:</span>{' '}
              <span style={{ color: '#d1d5db' }}>admin@university.com</span>
            </span>
            <span>
              <span style={{ color: '#6b7280' }}>Pass:</span>{' '}
              <span style={{ color: '#d1d5db' }}>admin123</span>
            </span>
          </div>
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

export default Login;
