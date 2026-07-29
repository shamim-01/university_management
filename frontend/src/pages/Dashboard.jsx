import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  SparklesIcon,
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon,
  UserPlusIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    departments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = async (showRefresh = false) => {
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
        students: students.length,
        teachers: teachers.length,
        courses: courses.length,
        departments: departments.length,
      });
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statItems = [
    {
      key: 'students',
      label: 'Total Students',
      value: stats.students,
      icon: UserGroupIcon,
      bg: 'from-blue-500/20 via-blue-500/10 to-transparent',
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500/30',
      iconColor: 'text-blue-400',
      textColor: 'text-white',
      change: '+12%',
      gradient: 'from-blue-500 to-cyan-400',
    },
    {
      key: 'teachers',
      label: 'Total Teachers',
      value: stats.teachers,
      icon: AcademicCapIcon,
      bg: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/30',
      iconColor: 'text-emerald-400',
      textColor: 'text-white',
      change: '+8%',
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      key: 'courses',
      label: 'Total Courses',
      value: stats.courses,
      icon: BookOpenIcon,
      bg: 'from-purple-500/20 via-purple-500/10 to-transparent',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500/30',
      iconColor: 'text-purple-400',
      textColor: 'text-white',
      change: '+5%',
      gradient: 'from-purple-500 to-pink-400',
    },
    {
      key: 'departments',
      label: 'Departments',
      value: stats.departments,
      icon: BuildingLibraryIcon,
      bg: 'from-orange-500/20 via-orange-500/10 to-transparent',
      border: 'border-orange-500/30',
      iconBg: 'bg-orange-500/30',
      iconColor: 'text-orange-400',
      textColor: 'text-white',
      change: '+3%',
      gradient: 'from-orange-500 to-red-400',
    },
  ];

  const activities = [
    {
      title: 'New student registered',
      time: '2 minutes ago',
      icon: '🎓',
      color: 'from-blue-500/20 to-blue-500/5',
    },
    {
      title: 'Course updated: CSE401',
      time: '15 minutes ago',
      icon: '📚',
      color: 'from-purple-500/20 to-purple-500/5',
    },
    {
      title: 'Attendance marked for 30 students',
      time: '1 hour ago',
      icon: '✅',
      color: 'from-emerald-500/20 to-emerald-500/5',
    },
    {
      title: 'New teacher joined the faculty',
      time: '3 hours ago',
      icon: '👨‍🏫',
      color: 'from-pink-500/20 to-pink-500/5',
    },
  ];

  const events = [
    {
      title: 'Semester Final Exam',
      date: 'Jan 21',
      time: '10:00 AM - 1:00 PM',
      color: 'from-purple-500 to-pink-500',
      day: '21',
    },
    {
      title: 'Faculty Meeting',
      date: 'Jan 22',
      time: '3:00 PM - 5:00 PM',
      color: 'from-blue-500 to-cyan-500',
      day: '22',
    },
    {
      title: 'Results Publication',
      date: 'Jan 23',
      time: '12:00 PM',
      color: 'from-emerald-500 to-teal-500',
      day: '23',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium text-lg">
            Loading dashboard...
          </p>
          <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Decorative Elements */}
        <div className="relative mb-12">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋
                  </h1>
                  <p className="text-gray-400 text-sm flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Here's what's happening with your university today
                  </p>
                </div>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium">
                  Live
                </span>
              </div>
              <button
                onClick={() => fetchDashboardData(true)}
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
        </div>

        {/* Stats Grid with Enhanced Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statItems.map(stat => (
            <div
              key={stat.key}
              className={`group relative bg-gradient-to-br ${stat.bg} rounded-2xl p-6 border ${stat.border} hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full blur-2xl -ml-12 -mb-12" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                    {stat.label}
                  </p>
                  <p
                    className={`text-3xl font-bold ${stat.textColor} mt-1 tracking-tight`}
                  >
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="relative mt-3 flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <span className="text-base">📈</span>
                <span>{stat.change} from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Activities & Events Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-shadow duration-300">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-purple-400" />
                Recent Activities
              </h2>
              <span className="text-gray-500 text-xs bg-white/5 px-3 py-1 rounded-full">
                Last 24h
              </span>
            </div>
            <div className="p-4 space-y-2">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className={`group flex items-center gap-3 p-3 bg-gradient-to-r ${activity.color} hover:bg-white/10 rounded-xl transition-all duration-200 cursor-default`}
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 text-xl border border-white/5">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium group-hover:text-purple-400 transition-colors duration-200 text-sm">
                      {activity.title}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400/30 group-hover:bg-purple-400 transition-colors duration-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-shadow duration-300">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-pink-400" />
                Upcoming Events
              </h2>
              <span className="text-gray-500 text-xs bg-white/5 px-3 py-1 rounded-full">
                This month
              </span>
            </div>
            <div className="p-4 space-y-3">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 cursor-default"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${event.color} flex flex-col items-center justify-center text-white flex-shrink-0 shadow-lg shadow-purple-500/20`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                      JAN
                    </span>
                    <span className="text-xl font-bold leading-none">
                      {event.day}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium group-hover:text-purple-400 transition-colors duration-200 text-sm">
                      {event.title}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {event.time}
                    </p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400/30 group-hover:bg-pink-400 transition-colors duration-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-gray-400 text-sm bg-white/5 rounded-xl px-5 py-3.5 border border-white/5">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-purple-400" />
            <p>
              Last updated:{' '}
              <span className="text-white font-medium">
                {new Date().toLocaleString()}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-purple-400">
              <UserGroupIcon className="w-4 h-4" />
              Total:{' '}
              <span className="text-white font-medium">
                {stats.students + stats.teachers}
              </span>
            </span>
            <span className="flex items-center gap-2 text-emerald-400">
              <BookOpenIcon className="w-4 h-4" />
              Courses:{' '}
              <span className="text-white font-medium">{stats.courses}</span>
            </span>
            <span className="flex items-center gap-2 text-orange-400">
              <BuildingLibraryIcon className="w-4 h-4" />
              Depts:{' '}
              <span className="text-white font-medium">
                {stats.departments}
              </span>
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
        `}</style>
      </div>
    </div>
  );
};

export default Dashboard;
