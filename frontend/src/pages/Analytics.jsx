import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    attendanceRate: 0,
  });
  const [deptData, setDeptData] = useState([]);
  const [coursePerformance, setCoursePerformance] = useState([]);

  // Fetch Analytics Data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      console.log('📥 1. Fetching analytics data...');

      // Parallel API calls
      const [studentsRes, teachersRes, coursesRes, departmentsRes] =
        await Promise.all([
          api.get('/students'),
          api.get('/teachers'),
          api.get('/courses'),
          api.get('/departments'),
        ]);

      console.log('📥 2. Students:', studentsRes.data);
      console.log('📥 3. Teachers:', teachersRes.data);
      console.log('📥 4. Courses:', coursesRes.data);
      console.log('📥 5. Departments:', departmentsRes.data);

      // Extract data
      const students =
        studentsRes.data?.data || studentsRes.data?.students || [];
      const teachers =
        teachersRes.data?.teachers || teachersRes.data?.data || [];
      const courses = coursesRes.data?.courses || coursesRes.data?.data || [];
      const departments = departmentsRes.data?.data || [];

      // Set stats
      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
        attendanceRate: Math.round(Math.random() * 20 + 75), // Simulated attendance
      });

      // Department-wise student distribution
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

      // Course performance (from courses with students)
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

      console.log('✅ 6. Analytics data loaded!');
    } catch (err) {
      console.error('❌ Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
        Loading analytics...
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: UsersIcon,
      change: '+12%',
    },
    {
      label: 'Total Teachers',
      value: stats.totalTeachers,
      icon: AcademicCapIcon,
      change: '+8%',
    },
    {
      label: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpenIcon,
      change: '+5%',
    },
    {
      label: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: UserGroupIcon,
      change: '+3%',
    },
  ];

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: '#9ca3af', marginTop: '0.25rem' }}>
          Role:{' '}
          <span style={{ color: '#a78bfa', textTransform: 'capitalize' }}>
            {user?.role}
          </span>
        </p>
        {error && (
          <p
            style={{
              color: '#f87171',
              fontSize: '0.875rem',
              marginTop: '0.5rem',
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {statItems.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  {stat.label}
                </p>
                <p
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginTop: '0.25rem',
                  }}
                >
                  {stat.value}
                </p>
              </div>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a78bfa',
                }}
              >
                <stat.icon style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
            </div>
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#4ade80',
                fontSize: '0.875rem',
              }}
            >
              <span>📈</span>
              <span>{stat.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Department-wise Students */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              marginBottom: '1.5rem',
            }}
          >
            Department-wise Students
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {deptData && deptData.length > 0 ? (
              deptData.map(item => (
                <div key={item.dept}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.875rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span style={{ color: '#d1d5db' }}>{item.dept}</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      {item.students}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '0.5rem',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: item.color,
                        borderRadius: '9999px',
                        width:
                          stats.totalStudents > 0
                            ? `${(item.students / stats.totalStudents) * 100}%`
                            : '0%',
                        transition: 'width 1s ease',
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center' }}>
                No department data available
              </p>
            )}
          </div>
        </div>

        {/* Course Performance */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              marginBottom: '1.5rem',
            }}
          >
            Course Performance
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {coursePerformance && coursePerformance.length > 0 ? (
              coursePerformance.map((course, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div>
                    <p style={{ color: 'white', fontWeight: '500' }}>
                      {course.course}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {course.teacher}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ color: 'white', fontWeight: '600' }}>
                      {course.passRate}%
                    </span>
                    <span
                      style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.625rem',
                        background:
                          course.status === 'Excellent'
                            ? 'rgba(34,197,94,0.2)'
                            : course.status === 'Good'
                              ? 'rgba(59,130,246,0.2)'
                              : 'rgba(234,179,8,0.2)',
                        color:
                          course.status === 'Excellent'
                            ? '#4ade80'
                            : course.status === 'Good'
                              ? '#60a5fa'
                              : '#facc15',
                      }}
                    >
                      {course.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center' }}>
                No course performance data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
