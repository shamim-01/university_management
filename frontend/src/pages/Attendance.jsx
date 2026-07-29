import { useState, useEffect } from 'react';
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
} from '@heroicons/react/24/outline';

const Attendance = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  });

  const canMarkAttendance = isAdmin() || isTeacher();

  // Filter students based on search
  const filteredStudents = students.filter(student => {
    const search = searchTerm.toLowerCase();
    return (
      student.studentId?.toLowerCase().includes(search) ||
      student.user?.name?.toLowerCase().includes(search)
    );
  });

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      const studentsData = response.data?.data || response.data?.students || [];
      setStudents(studentsData);
      console.log('✅ Students loaded:', studentsData.length);
      return studentsData;
    } catch (err) {
      console.error('Failed to fetch students:', err);
      return [];
    }
  };

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      const coursesData = response.data?.courses || response.data?.data || [];
      setCourses(coursesData);
      console.log('✅ Courses loaded:', coursesData.length);
      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0]._id);
      }
      return coursesData;
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      return [];
    }
  };

  // Fetch Attendance
  const fetchAttendance = async () => {
    if (!selectedCourse) return;

    try {
      setLoading(true);
      console.log('📥 Fetching attendance for course:', selectedCourse);

      const response = await api.get(`/attendance/course/${selectedCourse}`);
      console.log('📥 Response:', response.data);

      // ✅ Fix: সঠিকভাবে Data Parse করুন
      const data = response.data?.data || {};
      const attendance = data.attendance || [];
      const course = data.course || {};

      console.log('✅ Attendance loaded:', attendance.length);
      console.log('✅ Course info:', course);

      // ✅ attendanceData array হিসেবে Set করুন
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
        total: Array.isArray(attendance) ? attendance.length : students.length,
      });
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

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
  }, [selectedCourse]);

  // Mark Attendance
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

      console.log('📝 Marking attendance:', attendanceData);
      await api.post('/attendance', attendanceData);

      // Refresh attendance
      await fetchAttendance();
      alert('✅ Attendance marked successfully!');
    } catch (err) {
      console.error('Failed to mark attendance:', err);
      setError(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'absent':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'late':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'present':
        return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'absent':
        return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'late':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(139, 92, 246, 0.2)',
              borderTop: '3px solid #8b5cf6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: '#9ca3af' }}>Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span>Attendance</span>
              <span
                style={{
                  fontSize: '0.875rem',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#a78bfa',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontWeight: 'normal',
                }}
              >
                {students.length} Students
              </span>
            </h1>
            <p
              style={{
                color: '#9ca3af',
                fontSize: '0.875rem',
                marginTop: '0.25rem',
              }}
            >
              Role:{' '}
              <span style={{ color: '#a78bfa', textTransform: 'capitalize' }}>
                {user?.role}
              </span>
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Course Select */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                padding: '0.25rem 0.5rem',
              }}
            >
              <AcademicCapIcon
                style={{ width: '1rem', height: '1rem', color: '#6b7280' }}
              />
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                style={{
                  padding: '0.4rem 0.5rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.375rem',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.875rem',
                  minWidth: '180px',
                  cursor: 'pointer',
                }}
              >
                <option
                  value=""
                  style={{ background: '#1a1a1a', color: '#9ca3af' }}
                >
                  Select Course
                </option>
                {courses.map(course => (
                  <option
                    key={course._id}
                    value={course._id}
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Select */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                padding: '0.25rem 0.5rem',
              }}
            >
              <CalendarIcon
                style={{ width: '1rem', height: '1rem', color: '#6b7280' }}
              />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  padding: '0.4rem 0.5rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.375rem',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            maxWidth: '400px',
            transition: 'all 0.3s ease',
          }}
        >
          <MagnifyingGlassIcon
            style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }}
          />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontSize: '0.875rem',
              padding: '0.25rem 0',
            }}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          {error}
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.08)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(34, 197, 94, 0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircleIcon
              style={{ width: '1.25rem', height: '1.25rem', color: '#4ade80' }}
            />
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Present</p>
          </div>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#4ade80',
              marginTop: '0.25rem',
            }}
          >
            {stats.present}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <XCircleIcon
              style={{ width: '1.25rem', height: '1.25rem', color: '#f87171' }}
            />
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Absent</p>
          </div>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#f87171',
              marginTop: '0.25rem',
            }}
          >
            {stats.absent}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(234, 179, 8, 0.08)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(234, 179, 8, 0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(234, 179, 8, 0.15)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(234, 179, 8, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClockIcon
              style={{ width: '1.25rem', height: '1.25rem', color: '#facc15' }}
            />
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Late</p>
          </div>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#facc15',
              marginTop: '0.25rem',
            }}
          >
            {stats.late}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(139, 92, 246, 0.08)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserGroupIcon
              style={{ width: '1.25rem', height: '1.25rem', color: '#a78bfa' }}
            />
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Total</p>
          </div>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#a78bfa',
              marginTop: '0.25rem',
            }}
          >
            {stats.total}
          </p>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  background: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <th
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Student
                </th>
                <th
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'right',
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => {
                  // ✅ Find attendance - সঠিকভাবে Check করুন
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
                      style={{
                        borderBottom:
                          index === filteredStudents.length - 1
                            ? 'none'
                            : '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.03)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                          }}
                        >
                          <div
                            style={{
                              width: '2.25rem',
                              height: '2.25rem',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${student._id ? '#8b5cf6' : '#6b7280'}, ${student._id ? '#ec4899' : '#4b5563'})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                            }}
                          >
                            {student.user?.name?.charAt(0) || 'S'}
                          </div>
                          <span
                            style={{ color: 'white', fontSize: '0.875rem' }}
                          >
                            {student.user?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          color: '#9ca3af',
                          fontSize: '0.875rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        {student.studentId}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {attendance ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            {getStatusIcon(attendance.status)}
                            <span
                              style={{
                                padding: '0.2rem 0.6rem',
                                borderRadius: '9999px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                background: getStatusColor(
                                  attendance.status,
                                ).split(' ')[0],
                                color: getStatusColor(attendance.status).split(
                                  ' ',
                                )[1],
                              }}
                            >
                              {attendance.status}
                            </span>
                          </div>
                        ) : (
                          <span
                            style={{ color: '#6b7280', fontSize: '0.875rem' }}
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          color: '#9ca3af',
                          fontSize: '0.875rem',
                        }}
                      >
                        {attendance
                          ? new Date(attendance.date).toLocaleDateString()
                          : '—'}
                      </td>
                      <td
                        style={{ padding: '0.75rem 1rem', textAlign: 'right' }}
                      >
                        {canMarkAttendance ? (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: '0.25rem',
                            }}
                          >
                            <button
                              onClick={() =>
                                markAttendance(student._id, 'present')
                              }
                              style={{
                                padding: '0.25rem 0.6rem',
                                borderRadius: '0.25rem',
                                background: 'rgba(34, 197, 94, 0.15)',
                                color: '#4ade80',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.625rem',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background =
                                  'rgba(34, 197, 94, 0.3)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background =
                                  'rgba(34, 197, 94, 0.15)';
                              }}
                            >
                              P
                            </button>
                            <button
                              onClick={() =>
                                markAttendance(student._id, 'absent')
                              }
                              style={{
                                padding: '0.25rem 0.6rem',
                                borderRadius: '0.25rem',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#f87171',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.625rem',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background =
                                  'rgba(239, 68, 68, 0.3)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background =
                                  'rgba(239, 68, 68, 0.15)';
                              }}
                            >
                              A
                            </button>
                            <button
                              onClick={() =>
                                markAttendance(student._id, 'late')
                              }
                              style={{
                                padding: '0.25rem 0.6rem',
                                borderRadius: '0.25rem',
                                background: 'rgba(234, 179, 8, 0.15)',
                                color: '#facc15',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.625rem',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background =
                                  'rgba(234, 179, 8, 0.3)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background =
                                  'rgba(234, 179, 8, 0.15)';
                              }}
                            >
                              L
                            </button>
                          </div>
                        ) : (
                          <span
                            style={{ color: '#6b7280', fontSize: '0.75rem' }}
                          >
                            View Only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#6b7280',
                      fontSize: '0.875rem',
                    }}
                  >
                    {searchTerm
                      ? 'No students match your search'
                      : 'No students enrolled in this course'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default Attendance;
