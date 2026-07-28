import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  AcademicCapIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Teachers = () => {
  const { user, isAdmin } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    designation: 'Professor',
    bio: '',
    specialization: '',
    office: {
      room: '',
      building: '',
    },
  });

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(teacher => {
    const search = searchTerm.toLowerCase();
    return (
      teacher.employeeId?.toLowerCase().includes(search) ||
      teacher.user?.name?.toLowerCase().includes(search) ||
      teacher.user?.email?.toLowerCase().includes(search) ||
      teacher.designation?.toLowerCase().includes(search)
    );
  });

  // Fetch Teachers
  const fetchTeachers = async () => {
    try {
      console.log('📥 1. Fetching teachers started...');
      const token = localStorage.getItem('token');
      console.log('📥 2. Token exists?', token ? 'Yes' : 'No');

      const response = await api.get('/teachers');
      console.log('📥 3. Response status:', response.status);
      console.log('📥 4. Response data:', response.data);
      console.log(
        '📥 5. Teachers array:',
        response.data?.teachers || response.data?.data,
      );

      const teachersData = response.data?.teachers || response.data?.data || [];

      if (teachersData.length > 0) {
        setTeachers(teachersData);
        console.log('✅ 6. Teachers set! Count:', teachersData.length);
      } else {
        console.warn('⚠️ 7. No teachers found');
        setTeachers([]);
      }
    } catch (err) {
      console.error('❌ 8. Error:', err);
      console.error('❌ 9. Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      console.log('📥 Fetching departments...');
      const response = await api.get('/departments');
      setDepartments(response.data.data || []);
      console.log('✅ Departments loaded:', response.data.data?.length || 0);
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  // Log state changes
  useEffect(() => {
    console.log('🔄 Teachers state updated:', teachers);
    console.log('🔄 Teachers count:', teachers.length);
  }, [teachers]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.includes('office.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        office: { ...formData.office, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Create Teacher
  const handleCreate = async e => {
    e.preventDefault();
    setError('');

    if (!formData.department) {
      setError('Please select a department');
      return;
    }

    try {
      console.log('📝 1. Creating teacher with data:', formData);

      const teacherData = {
        ...formData,
        specialization: formData.specialization
          ? formData.specialization.split(',').map(s => s.trim())
          : [],
      };

      console.log('📝 2. Teacher data to send:', teacherData);

      const response = await api.post('/teachers', teacherData);
      console.log('✅ 3. Teacher created:', response.data);

      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        employeeId: '',
        department: '',
        designation: 'Professor',
        bio: '',
        specialization: '',
        office: { room: '', building: '' },
      });

      console.log('📥 4. Refreshing teacher list...');
      await fetchTeachers();
      alert('✅ Teacher added successfully!');
    } catch (err) {
      console.error('❌ 5. Error:', err);
      console.error('❌ 6. Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to create teacher');
    }
  };

  // Delete Teacher
  const handleDelete = async id => {
    if (!isAdmin()) {
      setError('Only Admin can delete teachers');
      return;
    }

    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/teachers/${id}`);
        await fetchTeachers();
        alert('✅ Teacher deleted successfully!');
      } catch (err) {
        setError('Failed to delete teacher');
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
          <p style={{ color: '#9ca3af' }}>Loading teachers...</p>
        </div>
      </div>
    );
  }

  console.log('🔍 Rendering teachers in UI:', teachers);
  console.log('🔍 Teachers count in UI:', teachers?.length);

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
              <span>Teachers</span>
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
                {teachers.length}
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
              <UserPlusIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Add Teacher</span>
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
            placeholder="Search teachers..."
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

      {/* Teachers Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filteredTeachers && filteredTeachers.length > 0 ? (
          filteredTeachers.map(teacher => (
            <div
              key={teacher._id}
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
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${teacher._id ? '#8b5cf6' : '#6b7280'}, ${teacher._id ? '#ec4899' : '#4b5563'})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      flexShrink: 0,
                    }}
                  >
                    {teacher.user?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <h3
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                      }}
                    >
                      {teacher.user?.name || 'N/A'}
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      {teacher.designation}
                    </p>
                  </div>
                </div>
                {isAdmin() && (
                  <button
                    onClick={() => handleDelete(teacher._id)}
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
                  <p style={{ color: '#6b7280' }}>Employee ID</p>
                  <p style={{ color: '#d1d5db', fontWeight: '500' }}>
                    {teacher.employeeId}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#6b7280' }}>Department</p>
                  <p style={{ color: '#d1d5db', fontWeight: '500' }}>
                    {teacher.department?.name || 'N/A'}
                  </p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ color: '#6b7280' }}>Email</p>
                  <p
                    style={{
                      color: '#d1d5db',
                      fontWeight: '500',
                      wordBreak: 'break-all',
                    }}
                  >
                    {teacher.user?.email || 'N/A'}
                  </p>
                </div>
                {teacher.specialization &&
                  teacher.specialization.length > 0 && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ color: '#6b7280' }}>Specialization</p>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.25rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        {teacher.specialization.map((spec, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '0.125rem 0.5rem',
                              background: 'rgba(139, 92, 246, 0.15)',
                              color: '#a78bfa',
                              borderRadius: '9999px',
                              fontSize: '0.625rem',
                            }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {teacher.bio && (
                <p
                  style={{
                    marginTop: '0.75rem',
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                    paddingTop: '0.75rem',
                  }}
                >
                  "{teacher.bio}"
                </p>
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
              ? 'No teachers match your search'
              : 'No teachers found. Click "Add Teacher" to create one.'}
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
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
                Add New Teacher
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
                  name="name"
                  placeholder="Full Name *"
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
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
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
                  name="password"
                  type="password"
                  placeholder="Password *"
                  value={formData.password}
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
                  name="employeeId"
                  placeholder="Employee ID *"
                  value={formData.employeeId}
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

                {/* ✅ Fixed: Select Department - White Text Issue Fixed */}
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

                <select
                  name="designation"
                  value={formData.designation}
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
                >
                  <option
                    value="Professor"
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    Professor
                  </option>
                  <option
                    value="Associate Professor"
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    Associate Professor
                  </option>
                  <option
                    value="Assistant Professor"
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    Assistant Professor
                  </option>
                  <option
                    value="Lecturer"
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    Lecturer
                  </option>
                  <option
                    value="Senior Lecturer"
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    Senior Lecturer
                  </option>
                </select>

                <input
                  name="bio"
                  placeholder="Bio (Optional)"
                  value={formData.bio}
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

                <input
                  name="specialization"
                  placeholder="Specialization (comma separated)"
                  value={formData.specialization}
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

                <input
                  name="office.room"
                  placeholder="Office Room"
                  value={formData.office.room}
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
                />

                <input
                  name="office.building"
                  placeholder="Office Building"
                  value={formData.office.building}
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
                  Add Teacher
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

export default Teachers;
