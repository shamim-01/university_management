import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    departments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Real Data
  const fetchDashboardData = async () => {
    try {
      console.log('📥 1. Fetching dashboard data...');

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

      setStats({
        students: students.length,
        teachers: teachers.length,
        courses: courses.length,
        departments: departments.length,
      });

      console.log('✅ 6. Stats updated:', {
        students: students.length,
        teachers: teachers.length,
        courses: courses.length,
        departments: departments.length,
      });
    } catch (err) {
      console.error('❌ 7. Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ---- Design-only helpers ----
  const ICONS = {
    students: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="currentColor" />
        <path
          d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
    ),
    teachers: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill="currentColor" />
        <path
          d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
    courses: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinejoin="round"
        />
        <path
          d="M4 5.5A2.5 2.5 0 0 0 6.5 8H20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
    departments: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 21V8l8-5 8 5v13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M9 21v-6h6v6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  };

  const statItems = [
    {
      key: 'students',
      label: 'Total Students',
      value: stats.students,
      accent: '#60a5fa',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      glow: 'rgba(59, 130, 246, 0.35)',
    },
    {
      key: 'teachers',
      label: 'Total Teachers',
      value: stats.teachers,
      accent: '#4ade80',
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      glow: 'rgba(34, 197, 94, 0.35)',
    },
    {
      key: 'courses',
      label: 'Total Courses',
      value: stats.courses,
      accent: '#c084fc',
      gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
      glow: 'rgba(168, 85, 247, 0.35)',
    },
    {
      key: 'departments',
      label: 'Departments',
      value: stats.departments,
      accent: '#fb923c',
      gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
      glow: 'rgba(249, 115, 22, 0.35)',
    },
  ];

  const glassCard = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  };

  if (loading) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <div
          style={{
            height: '2.5rem',
            width: '16rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{ ...glassCard, padding: '1.5rem', height: '7.5rem' }}
              className="skeleton-pulse"
            />
          ))}
        </div>
        <style>{`
          .skeleton-pulse {
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 25%,
              rgba(255,255,255,0.09) 37%,
              rgba(255,255,255,0.04) 63%
            );
            background-size: 400% 100%;
            animation: skeleton-shimmer 1.4s ease infinite;
          }
          @keyframes skeleton-shimmer {
            0% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <style>{`
        .stat-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
        }
        .activity-row, .event-row {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .activity-row:hover, .event-row:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(2px);
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Welcome back, {user?.name || 'Admin'}{' '}
            <span aria-hidden="true">👋</span>
          </h1>
          <p
            style={{
              color: '#9ca3af',
              marginTop: '0.375rem',
              fontSize: '0.9375rem',
            }}
          >
            Here's what's happening with your university today.
          </p>
          {error && (
            <p
              style={{
                color: '#f87171',
                fontSize: '0.875rem',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <span
                style={{
                  width: '0.375rem',
                  height: '0.375rem',
                  borderRadius: '9999px',
                  background: '#f87171',
                  display: 'inline-block',
                }}
              />
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        {statItems.map(stat => (
          <div
            key={stat.key}
            className="stat-card"
            style={{
              ...glassCard,
              padding: '1.5rem',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = stat.glow;
              e.currentTarget.style.boxShadow = `0 12px 30px -12px ${stat.glow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: '0.75rem',
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 6px 16px -6px ${stat.glow}`,
                }}
              >
                {ICONS[stat.key]}
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: '600',
                  color: '#4ade80',
                  background: 'rgba(74, 222, 128, 0.12)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  letterSpacing: '0.02em',
                }}
              >
                ● Live
              </span>
            </div>
            <p
              style={{
                color: '#9ca3af',
                fontSize: '0.8125rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                color: 'white',
                marginTop: '0.25rem',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
              }}
            >
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div style={{ ...glassCard, padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.0625rem',
                fontWeight: '600',
                color: 'white',
                margin: 0,
              }}
            >
              Recent Activities
            </h2>
            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
              Last 24h
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.375rem',
            }}
          >
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="activity-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.625rem',
                }}
              >
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    minWidth: '2.5rem',
                    borderRadius: '9999px',
                    background:
                      'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(139,92,246,0.12))',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#c4b5fd',
                      fontSize: '0.6875rem',
                      fontWeight: 'bold',
                    }}
                  >
                    U
                  </span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      margin: 0,
                    }}
                  >
                    New student registered
                  </p>
                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.75rem',
                      margin: '0.125rem 0 0',
                    }}
                  >
                    {i * 2} minutes ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...glassCard, padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <h2
              style={{
                fontSize: '1.0625rem',
                fontWeight: '600',
                color: 'white',
                margin: 0,
              }}
            >
              Upcoming Events
            </h2>
            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
              This month
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.375rem',
            }}
          >
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="event-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.625rem',
                }}
              >
                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    minWidth: '3.25rem',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 6px 16px -6px rgba(139, 92, 246, 0.4)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.04em',
                    }}
                  >
                    JAN
                  </span>
                  <span
                    style={{
                      fontSize: '1.0625rem',
                      fontWeight: 'bold',
                      lineHeight: 1,
                    }}
                  >
                    {20 + i}
                  </span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      margin: 0,
                    }}
                  >
                    {i === 1
                      ? 'Semester Final Exam'
                      : i === 2
                        ? 'Faculty Meeting'
                        : 'Results Publication'}
                  </p>
                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.75rem',
                      margin: '0.125rem 0 0',
                    }}
                  >
                    {i === 1
                      ? '10:00 AM - 1:00 PM'
                      : i === 2
                        ? '3:00 PM - 5:00 PM'
                        : '12:00 PM'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
