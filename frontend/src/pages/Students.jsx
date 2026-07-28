import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Students = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    semester: 1,
    batch: '2024',
    department: '',
    guardian: { name: '', relation: '', phone: '' },
    dateOfBirth: '',
    gender: 'male',
  });

  const canManageStudents = isAdmin() || isTeacher();

  const filteredStudents = students.filter(student => {
    const search = searchTerm.toLowerCase();
    return (
      student.studentId?.toLowerCase().includes(search) ||
      student.user?.name?.toLowerCase().includes(search) ||
      student.user?.email?.toLowerCase().includes(search)
    );
  });

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      if (response.data && response.data.data) {
        setStudents(response.data.data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments');
      setDepartments(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch departments');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.includes('guardian.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        guardian: { ...formData.guardian, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');

    if (!formData.department) {
      setError('Please select a department');
      return;
    }

    try {
      await api.post('/students', formData);
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        studentId: '',
        semester: 1,
        batch: '2024',
        department: '',
        guardian: { name: '', relation: '', phone: '' },
        dateOfBirth: '',
        gender: 'male',
      });
      await fetchStudents();
      alert('✅ Student added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student');
    }
  };

  const handleDelete = async id => {
    if (!isAdmin()) {
      setError('Only Admin can delete students');
      return;
    }

    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        await fetchStudents();
        alert('✅ Student deleted successfully!');
      } catch (err) {
        setError('Failed to delete student');
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
          <p style={{ color: '#9ca3af' }}>Loading students...</p>
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
              <span>Students</span>
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
                {students.length}
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
          {canManageStudents && (
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
              <span>Add Student</span>
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
                  Email
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
                  Semester
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
              {filteredStudents && filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
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
                        <span style={{ color: 'white', fontSize: '0.875rem' }}>
                          {student.user?.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        color: '#9ca3af',
                        fontSize: '0.875rem',
                      }}
                    >
                      {student.user?.email || 'N/A'}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        color: 'white',
                        fontSize: '0.875rem',
                      }}
                    >
                      Semester {student.semester}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          background:
                            student.status === 'active'
                              ? 'rgba(34, 197, 94, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          color:
                            student.status === 'active' ? '#4ade80' : '#f87171',
                        }}
                      >
                        {student.status || 'active'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: '0.25rem',
                        }}
                      >
                        {isAdmin() && (
                          <button
                            onClick={() => handleDelete(student._id)}
                            style={{
                              padding: '0.3rem 0.6rem',
                              borderRadius: '0.375rem',
                              background: 'transparent',
                              color: '#f87171',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background =
                                'rgba(239, 68, 68, 0.15)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <TrashIcon
                              style={{ width: '1rem', height: '1rem' }}
                            />
                          </button>
                        )}
                        {!isAdmin() && (
                          <span
                            style={{ color: '#6b7280', fontSize: '0.75rem' }}
                          >
                            View Only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#6b7280',
                      fontSize: '0.875rem',
                    }}
                  >
                    {searchTerm
                      ? 'No students match your search'
                      : 'No students found. Click "Add Student" to create one.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && canManageStudents && (
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
                Add New Student
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
                  name="studentId"
                  placeholder="Student ID *"
                  value={formData.studentId}
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
                <input
                  name="batch"
                  placeholder="Batch *"
                  value={formData.batch}
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
                  name="guardian.name"
                  placeholder="Guardian Name *"
                  value={formData.guardian.name}
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
                  name="guardian.relation"
                  placeholder="Guardian Relation *"
                  value={formData.guardian.relation}
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
                  name="guardian.phone"
                  placeholder="Guardian Phone *"
                  value={formData.guardian.phone}
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
                  name="dateOfBirth"
                  type="date"
                  placeholder="Date of Birth *"
                  value={formData.dateOfBirth}
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

                <select
                  name="gender"
                  value={formData.gender}
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
                    value="male"
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    Male
                  </option>
                  <option
                    value="female"
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    Female
                  </option>
                  <option
                    value="other"
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    Other
                  </option>
                </select>
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
                  Add Student
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

export default Students;
