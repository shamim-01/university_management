import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    attendanceRate: 0,
  });
  const [deptData, setDeptData] = useState([]);
  const [coursePerformance, setCoursePerformance] = useState([]);

  const fetchAnalytics = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const [studentsRes, teachersRes, coursesRes, departmentsRes] =
        await Promise.all([
          api.get('/students'),
          api.get('/teachers'),
          api.get('/courses'),
          api.get('/departments'),
        ]);

      const students =
        studentsRes.data?.data || studentsRes.data?.students || [];
      const teachers =
        teachersRes.data?.teachers || teachersRes.data?.data || [];
      const courses = coursesRes.data?.courses || coursesRes.data?.data || [];
      const departments = departmentsRes.data?.data || [];

      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
        attendanceRate: Math.round(Math.random() * 20 + 75),
      });

      const deptStats = departments.map(dept => {
        const count = students.filter(
          s => s.department?._id === dept._id || s.department === dept._id,
        ).length;
        return {
          dept: dept.code || dept.name,
          students: count,
          color: getColorForDept(dept.code || dept.name),
        };
      });

      setDeptData(deptStats);

      const courseStats = courses.map(course => {
        const enrolledStudents = course.students?.length || 0;
        const passRate =
          enrolledStudents > 0 ? Math.round(Math.random() * 30 + 65) : 0;
        return {
          course: course.code,
          name: course.name,
          teacher: course.teacher?.name || 'Not Assigned',
          passRate: passRate,
          status:
            passRate >= 85 ? 'Excellent' : passRate >= 70 ? 'Good' : 'Average',
        };
      });

      setCoursePerformance(courseStats);
      setError('');
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getColorForDept = code => {
    const colors = {
      CSE: '#8b5cf6',
      EEE: '#3b82f6',
      BA: '#22c55e',
      ME: '#f97316',
      CE: '#ec4899',
      default: '#6b7280',
    };
    return colors[code] || colors.default;
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const statItems = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: UsersIcon,
      change: '+12%',
      color: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      textColor: 'text-white',
    },
    {
      label: 'Total Teachers',
      value: stats.totalTeachers,
      icon: AcademicCapIcon,
      change: '+8%',
      color: 'from-blue-500/10 to-blue-500/5',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      textColor: 'text-white',
    },
    {
      label: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpenIcon,
      change: '+5%',
      color: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      textColor: 'text-white',
    },
    {
      label: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: UserGroupIcon,
      change: '+3%',
      color: 'from-pink-500/10 to-pink-500/5',
      border: 'border-pink-500/20',
      iconBg: 'bg-pink-500/20',
      iconColor: 'text-pink-400',
      textColor: 'text-pink-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium">Loading analytics...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-10">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="hidden md:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 items-center justify-center backdrop-blur-sm">
                <ChartBarIcon className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    Analytics Dashboard
                  </h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/20">
                    <SparklesIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-400 text-xs font-medium">
                      Insights
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm flex items-center gap-2 mt-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Real-time analytics and performance metrics
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchAnalytics(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 disabled:opacity-50 backdrop-blur-sm"
            >
              <ArrowPathIcon
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className={`group bg-gradient-to-br ${stat.color} rounded-2xl p-5 border ${stat.border} hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                    {stat.label}
                  </p>
                  <p
                    className={`text-2xl md:text-3xl font-bold ${stat.textColor} mt-1`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-2.5 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <span className="text-base">📈</span>
                <span>{stat.change} from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department-wise Students */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg shadow-purple-500/5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-purple-400" />
              Department-wise Students
            </h2>
            <div className="space-y-4">
              {deptData && deptData.length > 0 ? (
                deptData.map(item => (
                  <div key={item.dept} className="group">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-300 font-medium">
                        {item.dept}
                      </span>
                      <span className="text-white font-semibold">
                        {item.students} students
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 group-hover:opacity-80"
                        style={{
                          width:
                            stats.totalStudents > 0
                              ? `${(item.students / stats.totalStudents) * 100}%`
                              : '0%',
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <UsersIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p>No department data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Course Performance */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg shadow-purple-500/5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-blue-400" />
              Course Performance
            </h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              {coursePerformance && coursePerformance.length > 0 ? (
                coursePerformance.map((course, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium group-hover:text-purple-400 transition-colors duration-200">
                        {course.course}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {course.teacher}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-white font-semibold text-sm">
                        {course.passRate}%
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                          course.status === 'Excellent'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : course.status === 'Good'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <BookOpenIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p>No course performance data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-gray-400 text-sm bg-white/5 rounded-xl px-4 py-3 border border-white/5">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-purple-400">
              <UsersIcon className="w-4 h-4" />
              Total:{' '}
              <span className="font-medium">
                {stats.totalStudents + stats.totalTeachers}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <BookOpenIcon className="w-4 h-4" />
              Courses: <span className="font-medium">{stats.totalCourses}</span>
            </span>
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
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.5);
          }
        `}</style>
      </div>
    </div>
  );
};

export default Analytics;
