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
  SparklesIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = password => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    if (passwordStrength === 4) return 'Strong';
    return 'Very Strong';
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3e] to-[#0f0c29] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />

        {/* Floating Orbs */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="max-w-[440px] w-full bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-purple-500/10 relative z-10 hover:shadow-purple-500/20 transition-all duration-700 group">
        {/* Glass Reflection Effect */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl" />

        {/* Brand Section */}
        <div className="text-center mb-8 relative">
          <div className="relative inline-block group">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-purple-500/30 hover:scale-105 transition-all duration-500 group-hover:shadow-purple-500/50">
              <AcademicCapIcon className="w-10 h-10" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-emerald-400 rounded-full border-2 border-[#1a1a2e] flex items-center justify-center animate-pulse shadow-lg shadow-emerald-400/30">
              <SparklesIcon className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-5 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Join us and get started today
          </p>
          <div className="flex items-center justify-center gap-1 mt-3">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400/70 text-[10px] uppercase tracking-wider font-medium">
              Secure Registration
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-shake">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fadeIn">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="group">
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-all duration-300" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-white/10"
                placeholder="John Doe"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 transition-all duration-300 group-focus-within:from-purple-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-pink-500/5 pointer-events-none" />
            </div>
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-all duration-300" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-white/10"
                placeholder="john@example.com"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 transition-all duration-300 group-focus-within:from-purple-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-pink-500/5 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-all duration-300" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-white/10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-all duration-200"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 transition-all duration-300 group-focus-within:from-purple-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-pink-500/5 pointer-events-none" />
            </div>

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < passwordStrength
                          ? getStrengthColor()
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs font-medium ${getStrengthColor().replace('bg-', 'text-')}`}
                >
                  {getStrengthText()}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="group">
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-all duration-300" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-white/10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-all duration-200"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 transition-all duration-300 group-focus-within:from-purple-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-pink-500/5 pointer-events-none" />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.role === 'student'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/20'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <UserGroupIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'teacher' })}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.role === 'teacher'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/20'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Teacher</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white font-semibold text-base rounded-xl hover:scale-[1.02] transition-all duration-500 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/50 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-[#1a1a2e]/80 text-gray-500 backdrop-blur-sm">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center text-sm">
          <Link
            to="/login"
            className="text-gray-400 hover:text-white transition-all duration-200 font-medium inline-flex items-center gap-1 group"
          >
            Sign in instead
            <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest">
            © 2024 University Management System
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.2; 
          }
          25% { transform: translateY(-15px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-30px) translateX(0px); opacity: 0.8; }
          75% { transform: translateY(-15px) translateX(-10px); opacity: 0.6; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Register;
