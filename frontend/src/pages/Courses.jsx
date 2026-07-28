import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Courses = () => {
  const { user, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    department: '',
    credits: 3,
    semester: 1,
  });

  // Filter courses based on search
  const filteredCourses = courses.filter(course => {
    const search = searchTerm.toLowerCase();
    return (
      course.code?.toLowerCase().includes(search) ||
      course.name?.toLowerCase().includes(search) ||
      course.department?.name?.toLowerCase().includes(search)
    );
  });

  // Fetch Courses from API
  const fetchCourses = async () => {
    try {
      console.log('📥 1. Fetching courses from API...');
      const response = await api.get('/courses');
      console.log('📥 2. API Response:', response);
      console.log('📥 3. Response data:', response.data);

      const coursesData = response.data?.courses || response.data?.data || [];
      console.log('📥 4. Courses data:', coursesData);

      if (coursesData.length > 0) {
        setCourses(coursesData);
        console.log('✅ 5. Courses set! Count:', coursesData.length);
      } else {
        console.warn('⚠️ 6. No courses found in API');
        setCourses([]);
      }
    } catch (err) {
      console.error('❌ 7. Error fetching courses:', err);
      console.error('❌ 8. Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('🔄 Courses state updated:', courses);
    console.log('🔄 Courses count:', courses.length);
  }, [courses]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create Course
  const handleCreate = async e => {
    e.preventDefault();
    setError('');

    if (!formData.department) {
      setError('Please select a department');
      return;
    }

    try {
      console.log('📝 Creating course:', formData);
      const response = await api.post('/courses', formData);
      console.log('✅ Course created:', response.data);

      setShowModal(false);
      setFormData({
        code: '',
        name: '',
        description: '',
        department: '',
        credits: 3,
        semester: 1,
      });
      await fetchCourses();
      alert('✅ Course added successfully!');
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || 'Failed to create course');
    }
  };

  // Delete Course
  const handleDelete = async id => {
    if (!isAdmin()) {
      setError('Only Admin can delete courses');
      return;
    }

    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        await fetchCourses();
        alert('✅ Course deleted successfully!');
      } catch (err) {
        setError('Failed to delete course');
      }
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
          <p style={{ color: '#9ca3af' }}>Loading courses...</p>
        </div>
      </div>
    );
  }

  console.log('🔍 Rendering courses in UI:', courses);
  console.log('🔍 Courses count in UI:', courses?.length);

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
              <span>Courses</span>
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
                {courses.length}
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
          {isAdmin() && (
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.5rem',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 25px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 15px rgba(139, 92, 246, 0.3)';
              }}
            >
              <PlusIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Add Course</span>
            </button>
          )}
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
            placeholder="Search courses..."
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
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
            >
              <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          )}
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

      {/* Courses Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filteredCourses && filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div
              key={course._id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 30px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Decorative gradient line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                  opacity: 0.5,
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      background: `linear-gradient(135deg, ${course._id ? '#8b5cf6' : '#6b7280'}, ${course._id ? '#ec4899' : '#4b5563'})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpenIcon
                      style={{ width: '1.25rem', height: '1.25rem' }}
                    />
                  </div>
                  <div>
                    <h3
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                      }}
                    >
                      {course.name}
                    </h3>
                    <p
                      style={{
                        color: '#a78bfa',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                      }}
                    >
                      {course.code}
                    </p>
                  </div>
                </div>
                {isAdmin() && (
                  <button
                    onClick={() => handleDelete(course._id)}
                    style={{
                      padding: '0.3rem',
                      borderRadius: '0.375rem',
                      background: 'transparent',
                      color: '#6b7280',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#f87171';
                      e.currentTarget.style.background =
                        'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#6b7280';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                  </button>
                )}
              </div>

              {course.description && (
                <p
                  style={{
                    marginTop: '0.75rem',
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}
                >
                  {course.description}
                </p>
              )}

              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '0.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <p style={{ color: '#6b7280' }}>Department</p>
                  <p style={{ color: '#d1d5db', fontWeight: '500' }}>
                    {course.department?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#6b7280' }}>Credits</p>
                  <p style={{ color: '#d1d5db', fontWeight: '500' }}>
                    {course.credits}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#6b7280' }}>Semester</p>
                  <p style={{ color: '#d1d5db', fontWeight: '500' }}>
                    Semester {course.semester}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#6b7280' }}>Status</p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.625rem',
                      fontWeight: '500',
                      background:
                        course.status === 'active'
                          ? 'rgba(34, 197, 94, 0.15)'
                          : 'rgba(239, 68, 68, 0.15)',
                      color: course.status === 'active' ? '#4ade80' : '#f87171',
                    }}
                  >
                    {course.status || 'active'}
                  </span>
                </div>
              </div>

              {course.teacher && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <AcademicCapIcon
                    style={{
                      width: '0.875rem',
                      height: '0.875rem',
                      color: '#6b7280',
                    }}
                  />
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    Instructor:{' '}
                    <span style={{ color: '#d1d5db' }}>
                      {course.teacher?.name || 'Not Assigned'}
                    </span>
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '1rem',
              border: '1px dashed rgba(255, 255, 255, 0.06)',
            }}
          >
            {searchTerm
              ? 'No courses match your search'
              : 'No courses found. Click "Add Course" to create one.'}
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showModal && isAdmin() && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: '1rem',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                }}
              >
                Add New Course
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}
              >
                <input
                  name="code"
                  placeholder="Course Code *"
                  value={formData.code}
                  onChange={handleChange}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  required
                />
                <input
                  name="name"
                  placeholder="Course Name *"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  required
                />
                <input
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                />

                {/* Fixed: Select Department - White Text Issue Fixed */}
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={{
                    gridColumn: '1 / -1',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                    appearance: 'auto',
                    WebkitAppearance: 'auto',
                    MozAppearance: 'auto',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  required
                >
                  <option
                    value=""
                    style={{ background: '#1a1a1a', color: '#9ca3af' }}
                  >
                    Select Department *
                  </option>
                  {departments.map(dept => (
                    <option
                      key={dept._id}
                      value={dept._id}
                      style={{
                        background: '#1a1a1a',
                        color: 'white',
                        padding: '0.5rem',
                      }}
                    >
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>

                <input
                  name="credits"
                  type="number"
                  placeholder="Credits *"
                  value={formData.credits}
                  onChange={handleChange}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  required
                />
                <input
                  name="semester"
                  type="number"
                  placeholder="Semester *"
                  value={formData.semester}
                  onChange={handleChange}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#8b5cf6';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  required
                />
              </div>

              <div
                style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}
              >
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 15px rgba(139, 92, 246, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Add Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Courses;
