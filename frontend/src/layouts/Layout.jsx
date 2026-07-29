import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  MegaphoneIcon,
  ChartBarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isResultsOpen, setIsResultsOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Students', path: '/students', icon: UserGroupIcon },
    { name: 'Teachers', path: '/teachers', icon: AcademicCapIcon },
    { name: 'Departments', path: '/departments', icon: BuildingLibraryIcon },
    { name: 'Courses', path: '/courses', icon: BookOpenIcon },
    { name: 'Attendance', path: '/attendance', icon: CalendarIcon },
  ];

  const resultsSubMenu = [
    {
      name: 'All Results',
      path: '/results/all',
      icon: ClipboardDocumentListIcon,
    },
    {
      name: 'Result Dashboard',
      path: '/results/dashboard',
      icon: ChartBarIcon,
    },
  ];

  const otherNavigation = [
    { name: 'Notices', path: '/notices', icon: MegaphoneIcon },
    { name: 'Analytics', path: '/analytics', icon: ChartBarIcon },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isResultsActive = location.pathname.startsWith('/results');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '260px',
          background: 'rgba(17, 24, 39, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '1.5rem',
          position: 'fixed',
          height: '100%',
          overflowY: 'auto',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '2rem', flexShrink: 0 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 'bold',
              }}
            >
              U
            </div>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #a78bfa, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              University MS
            </h1>
          </div>
          <p
            style={{
              color: '#6b7280',
              fontSize: '0.7rem',
              marginTop: '0.5rem',
              paddingLeft: '0.25rem',
            }}
          >
            Role:{' '}
            <span style={{ color: '#a78bfa', textTransform: 'capitalize' }}>
              {user?.role || 'Unknown'}
            </span>
          </p>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.15rem',
          }}
        >
          {/* Main Navigation */}
          {navigation.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '0.5rem',
                  color: isActive ? 'white' : '#9ca3af',
                  background: isActive
                    ? 'rgba(139, 92, 246, 0.15)'
                    : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.15s',
                  fontSize: '0.85rem',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon
                  style={{
                    width: '1.2rem',
                    height: '1.2rem',
                    color: isActive ? '#a78bfa' : '#6b7280',
                  }}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Results Dropdown */}
          <div style={{ marginTop: '0.25rem' }}>
            <button
              onClick={() => setIsResultsOpen(!isResultsOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '0.5rem',
                color: isResultsActive ? 'white' : '#9ca3af',
                background: isResultsActive
                  ? 'rgba(139, 92, 246, 0.1)'
                  : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: isResultsActive ? '600' : '400',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                if (!isResultsActive) {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.04)';
                }
              }}
              onMouseLeave={e => {
                if (!isResultsActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <ClipboardDocumentListIcon
                  style={{
                    width: '1.2rem',
                    height: '1.2rem',
                    color: isResultsActive ? '#a78bfa' : '#6b7280',
                  }}
                />
                <span>Results</span>
              </div>
              {isResultsOpen ? (
                <ChevronDownIcon
                  style={{ width: '1rem', height: '1rem', color: '#6b7280' }}
                />
              ) : (
                <ChevronRightIcon
                  style={{ width: '1rem', height: '1rem', color: '#6b7280' }}
                />
              )}
            </button>

            {isResultsOpen && (
              <div
                style={{
                  marginLeft: '0.5rem',
                  paddingLeft: '0.5rem',
                  borderLeft: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {resultsSubMenu.map(item => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 0.8rem',
                        borderRadius: '0.5rem',
                        color: isActive ? 'white' : '#9ca3af',
                        background: isActive
                          ? 'rgba(139, 92, 246, 0.12)'
                          : 'transparent',
                        textDecoration: 'none',
                        fontWeight: isActive ? '600' : '400',
                        transition: 'all 0.15s',
                        fontSize: '0.8rem',
                        marginLeft: '0.5rem',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.04)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <Icon
                        style={{
                          width: '1rem',
                          height: '1rem',
                          color: isActive ? '#a78bfa' : '#6b7280',
                        }}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Other Navigation */}
          {otherNavigation.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '0.5rem',
                  color: isActive ? 'white' : '#9ca3af',
                  background: isActive
                    ? 'rgba(139, 92, 246, 0.15)'
                    : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.15s',
                  fontSize: '0.85rem',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon
                  style={{
                    width: '1.2rem',
                    height: '1.2rem',
                    color: isActive ? '#a78bfa' : '#6b7280',
                  }}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: '0.5rem',
              color: '#f87171',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.85rem',
              marginTop: '0.5rem',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <ArrowRightOnRectangleIcon
              style={{ width: '1.2rem', height: '1.2rem' }}
            />
            <span>Logout</span>
          </button>
        </nav>

        {/* User Info at Bottom */}
        <div
          style={{
            flexShrink: 0,
            marginTop: 'auto',
            padding: '0.75rem 0.8rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.name || 'User'}
              </p>
              <p
                style={{
                  color: '#6b7280',
                  fontSize: '0.6rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        style={{
          marginLeft: '260px',
          flex: 1,
          padding: '2rem',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
