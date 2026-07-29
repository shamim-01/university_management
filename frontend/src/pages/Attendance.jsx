import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ArrowPathIcon,
  ChartBarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Attendance = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  });

  const canMarkAttendance = isAdmin() || isTeacher();

  const filteredStudents = students.filter(student => {
    const search = searchTerm.toLowerCase();
    return (
      student.studentId?.toLowerCase().includes(search) ||
      student.user?.name?.toLowerCase().includes(search)
    );
  });

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      const studentsData = response.data?.data || response.data?.students || [];
      setStudents(studentsData);
      return studentsData;
    } catch (err) {
      console.error('Failed to fetch students:', err);
      return [];
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      const coursesData = response.data?.courses || response.data?.data || [];
      setCourses(coursesData);
      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0]._id);
      }
      return coursesData;
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      return [];
    }
  };

  const fetchAttendance = useCallback(
    async (showRefresh = false) => {
      if (!selectedCourse) return;

      try {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);

        const response = await api.get(`/attendance/course/${selectedCourse}`);
        const data = response.data?.data || {};
        const attendance = data.attendance || [];

        setAttendanceData(Array.isArray(attendance) ? attendance : []);

        const present = Array.isArray(attendance)
          ? attendance.filter(a => a.status === 'present').length
          : 0;
        const absent = Array.isArray(attendance)
          ? attendance.filter(a => a.status === 'absent').length
          : 0;
        const late = Array.isArray(attendance)
          ? attendance.filter(a => a.status === 'late').length
          : 0;

        setStats({
          present,
          absent,
          late,
          total: Array.isArray(attendance)
            ? attendance.length
            : students.length,
        });
        setError('');
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
        setError('Failed to load attendance data');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedCourse, students.length],
  );

  useEffect(() => {
    const loadData = async () => {
      await fetchCourses();
      await fetchStudents();
      await fetchAttendance();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAttendance();
    }
  }, [selectedCourse, fetchAttendance]);

  const markAttendance = async (studentId, status) => {
    if (!canMarkAttendance) {
      setError('You do not have permission to mark attendance');
      return;
    }

    try {
      const attendanceData = {
        course: selectedCourse,
        student: studentId,
        date: date,
        status: status,
        remarks: '',
      };

      await api.post('/attendance', attendanceData);
      await fetchAttendance(true);
    } catch (err) {
      console.error('Failed to mark attendance:', err);
      setError(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="w-4 h-4 text-emerald-400" />;
      case 'absent':
        return <XCircleIcon className="w-4 h-4 text-red-400" />;
      case 'late':
        return <ClockIcon className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'absent':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'late':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const statCards = [
    {
      label: 'Present',
      value: stats.present,
      icon: CheckCircleIcon,
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Absent',
      value: stats.absent,
      icon: XCircleIcon,
      bg: 'from-red-500/10 to-red-500/5',
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      textColor: 'text-red-400',
    },
    {
      label: 'Late',
      value: stats.late,
      icon: ClockIcon,
      bg: 'from-yellow-500/10 to-yellow-500/5',
      border: 'border-yellow-500/20',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-400',
    },
    {
      label: 'Total Students',
      value: stats.total,
      icon: UserGroupIcon,
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      textColor: 'text-white',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium">
            Loading attendance...
          </p>
          <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              📋 Attendance
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Manage student attendance • {students.length} students
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Course Select */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <AcademicCapIcon className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="bg-transparent border-none text-white text-sm outline-none cursor-pointer min-w-[150px]"
              >
                <option value="" className="bg-gray-900 text-gray-400">
                  Select Course
                </option>
                {courses.map(course => (
                  <option
                    key={course._id}
                    value={course._id}
                    className="bg-gray-900 text-white"
                  >
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Select */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="bg-transparent border-none text-white text-sm outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => fetchAttendance(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 disabled:opacity-50"
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
            <XCircleIcon className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className={`group bg-gradient-to-br ${stat.bg} rounded-2xl p-5 border ${stat.border} hover:scale-[1.02] transition-all duration-300`}
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
            </div>
          ))}
        </div>

        {/* Search Bar with Cross Button */}
        <div className="relative max-w-md mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students by name or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white group"
            >
              <XMarkIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-3.5 h-3.5" />
                      Student
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-4 text-right text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => {
                    const attendance = Array.isArray(attendanceData)
                      ? attendanceData.find(
                          a =>
                            a.student?._id === student._id ||
                            a.student === student._id,
                        )
                      : null;

                    return (
                      <tr
                        key={student._id}
                        className="hover:bg-white/5 transition-all duration-200 group"
                      >
                        <td className="px-4 py-3.5 text-gray-500 text-xs font-medium">
                          #{String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold`}
                            >
                              {student.user?.name?.charAt(0) || 'S'}
                            </div>
                            <span className="text-white font-medium group-hover:text-purple-400 transition-colors duration-200">
                              {student.user?.name || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400 text-xs font-mono">
                          {student.studentId}
                        </td>
                        <td className="px-4 py-3.5">
                          {attendance ? (
                            <div className="flex items-center gap-2">
                              {getStatusIcon(attendance.status)}
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(attendance.status)}`}
                              >
                                {attendance.status}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-gray-400 text-xs">
                          {attendance
                            ? new Date(attendance.date).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {canMarkAttendance ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() =>
                                  markAttendance(student._id, 'present')
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold transition-all duration-200 border border-emerald-500/20 hover:border-emerald-500/40"
                              >
                                P
                              </button>
                              <button
                                onClick={() =>
                                  markAttendance(student._id, 'absent')
                                }
                                className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 text-xs font-bold transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                              >
                                A
                              </button>
                              <button
                                onClick={() =>
                                  markAttendance(student._id, 'late')
                                }
                                className="px-2.5 py-1 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/30 text-yellow-400 text-xs font-bold transition-all duration-200 border border-yellow-500/20 hover:border-yellow-500/40"
                              >
                                L
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              View Only
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                          <UserGroupIcon className="w-10 h-10 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">
                          {searchTerm
                            ? 'No students match your search'
                            : 'No students enrolled'}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Students will appear here once enrolled'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {students.length > 0 && (
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-gray-400 text-sm">
                  Showing{' '}
                  <span className="text-white font-medium">
                    {filteredStudents.length}
                  </span>{' '}
                  of{' '}
                  <span className="text-white font-medium">
                    {students.length}
                  </span>{' '}
                  students
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    Present:{' '}
                    <span className="font-medium">{stats.present}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <XCircleIcon className="w-4 h-4" />
                    Absent: <span className="font-medium">{stats.absent}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-yellow-400">
                    <ClockIcon className="w-4 h-4" />
                    Late: <span className="font-medium">{stats.late}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <ChartBarIcon className="w-4 h-4" />
                    Total: <span className="font-medium">{stats.total}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
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

export default Attendance;
