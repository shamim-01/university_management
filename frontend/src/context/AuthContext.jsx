// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ User loaded from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('❌ Error parsing user data:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login Response:', response.data);

      if (response.data.success) {
        const { token, user } = response.data.data;
        console.log('✅ User Role:', user.role);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return { success: true, user };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('❌ Login Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ✅ Updated: Proper API call with backend response
  const updateProfile = async data => {
    try {
      const response = await api.put('/users/profile', data);
      console.log('✅ Profile Update Response:', response.data);

      if (response.data.success) {
        const updatedUser = response.data.data || { ...user, ...data };

        // Update localStorage with latest user data
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Update state
        setUser(updatedUser);

        return {
          success: true,
          data: updatedUser,
          message: response.data.message || 'Profile updated successfully',
        };
      }
      return {
        success: false,
        error: response.data.message || 'Failed to update profile',
      };
    } catch (error) {
      console.error('❌ Update Profile Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  // ✅ Updated: Change Password with correct method
  const changePassword = async data => {
    try {
      const response = await api.put('/auth/change-password', data);
      console.log('✅ Password Change Response:', response.data);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Password changed successfully',
        };
      }
      return {
        success: false,
        error: response.data.message || 'Failed to change password',
      };
    } catch (error) {
      console.error('❌ Change Password Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to change password',
      };
    }
  };

  // ✅ New: Get fresh user data from server
  const refreshUser = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data.success) {
        const userData = response.data.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, data: userData };
      }
      return { success: false };
    } catch (error) {
      console.error('❌ Refresh User Error:', error);
      return { success: false };
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isTeacher = () => user?.role === 'teacher';
  const isStudent = () => user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateProfile,
        changePassword,
        refreshUser, // ✅ New function added
        isAdmin,
        isTeacher,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
