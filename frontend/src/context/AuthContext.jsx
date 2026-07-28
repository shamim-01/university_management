import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Update Profile - Student/Teacher/Admin 
  const updateProfile = async data => {
    try {
      const response = await api.put('/auth/profile', data);
      const updatedUser = response.data.data;

      // Update localStorage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Profile updated successfully!');
      return { success: true, data: updatedUser };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change Password - Student/Teacher/Admin 
  const changePassword = async data => {
    try {
      await api.put('/auth/change-password', data);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      return { success: false, error: message };
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
        isAdmin,
        isTeacher,
        isStudent,
        role: user?.role,
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
