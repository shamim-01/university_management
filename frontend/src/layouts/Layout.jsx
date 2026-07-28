import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout, isAdmin, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Students', path: '/students' },
    { name: 'Teachers', path: '/teachers' },
    { name: 'Courses', path: '/courses' },
    { name: 'Departments', path: '/departments' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Results', path: '/results' },
    { name: 'Notices', path: '/notices' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '250px',
          background: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          position: 'fixed',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #a78bfa, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            University MS
          </h1>
          <p
            style={{
              color: '#6b7280',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            Role:{' '}
            <span style={{ color: '#a78bfa', textTransform: 'capitalize' }}>
              {user?.role || 'Unknown'}
            </span>
          </p>
        </div>

        <nav
          style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
        >
          {navigation.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  color: isActive ? 'white' : '#9ca3af',
                  background: isActive
                    ? 'rgba(139, 92, 246, 0.2)'
                    : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s',
                }}
              >
                {item.name}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              color: '#f87171',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '1rem',
              marginTop: '1rem',
              transition: 'all 0.2s',
            }}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
