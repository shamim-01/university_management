import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; // ✅ যোগ করুন
import ResetPassword from './pages/ResetPassword'; // ✅ যোগ করুন
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Courses from './pages/Courses';
import Departments from './pages/Departments';
import Attendance from './pages/Attendance';
import Results from './pages/Results';
import Notices from './pages/Notices';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />{' '}
      {/* ✅ যোগ করুন */}
      <Route path="/reset-password/:token" element={<ResetPassword />} />{' '}
      {/* ✅ যোগ করুন */}
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="courses" element={<Courses />} />
        <Route path="departments" element={<Departments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="results" element={<Results />} />
        <Route path="notices" element={<Notices />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
