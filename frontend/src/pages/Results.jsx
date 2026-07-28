import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ClipboardDocumentCheckIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserGroupIcon,
  BookOpenIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Results = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    passRate: 0,
  });
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    semester: 1,
    marks: '',
    remarks: '',
  });

  const canManageResults = isAdmin() || isTeacher();

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
      return coursesData;
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      return [];
    }
  };

  // Fetch Results for a student
  const fetchResults = async studentId => {
    if (!studentId) {
      setResults([]);
      setStats({ total: 0, passed: 0, failed: 0, passRate: 0 });
      return;
    }

    try {
      setLoading(true);
      console.log('📥 Fetching results for student:', studentId);

      const response = await api.get(`/results/student/${studentId}`);
      const data = response.data?.data || response.data || { results: [] };

      const resultsData = data.results || [];
      console.log('✅ Results loaded:', resultsData.length);

      setResults(resultsData);

      const passed = resultsData.filter(r => r.status === 'passed').length;
      const failed = resultsData.filter(r => r.status === 'failed').length;
      const total = resultsData.length;

      setStats({
        total,
        passed,
        failed,
        passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
      });
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const studentsData = await fetchStudents();
      await fetchCourses();
      if (studentsData.length > 0) {
        setSelectedStudent(studentsData[0]._id);
        await fetchResults(studentsData[0]._id);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchResults(selectedStudent);
    }
  }, [selectedStudent]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Result
  const handleAddResult = async e => {
    e.preventDefault();
    setError('');

    try {
      const resultData = {
        ...formData,
        marks: parseInt(formData.marks),
      };

      console.log('📝 Adding result:', resultData);
      await api.post('/results', resultData);

      setShowModal(false);
      setFormData({
        student: '',
        course: '',
        semester: 1,
        marks: '',
        remarks: '',
      });
      await fetchResults(selectedStudent);
      alert('✅ Result added successfully!');
    } catch (err) {
      console.error('Failed to add result:', err);
      setError(err.response?.data?.message || 'Failed to add result');
    }
  };

  // Update Result
  const handleUpdateResult = async (resultId, newMarks) => {
    if (!canManageResults) {
      setError('You do not have permission to update results');
      return;
    }

    try {
      await api.put(`/results/${resultId}`, { marks: newMarks });
      await fetchResults(selectedStudent);
      alert('✅ Result updated successfully!');
    } catch (err) {
      console.error('Failed to update result:', err);
      setError(err.response?.data?.message || 'Failed to update result');
    }
  };

  const getGradeColor = grade => {
    if (grade === 'A+' || grade === 'A' || grade === 'A-')
      return 'bg-green-500/20 text-green-400';
    if (grade === 'B+' || grade === 'B' || grade === 'B-')
      return 'bg-blue-500/20 text-blue-400';
    if (grade === 'C+' || grade === 'C' || grade === 'D')
      return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
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
          <p style={{ color: '#9ca3af' }}>Loading results...</p>
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
              <span>Results</span>
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
                {stats.total} Results
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
            {/* ✅ Fixed: White text issue - Added proper styling */}
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
              <UserGroupIcon
                style={{ width: '1rem', height: '1rem', color: '#6b7280' }}
              />
              <select
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
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
                  Select Student
                </option>
                {students.map(student => (
                  <option
                    key={student._id}
                    value={student._id}
                    style={{ background: '#1a1a1a', color: 'white' }}
                  >
                    {student.user?.name} ({student.studentId})
                  </option>
                ))}
              </select>
            </div>

            {canManageResults && (
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
                <span>Add Result</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar - Student Filter */}
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
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardDocumentCheckIcon
              style={{ width: '1.25rem', height: '1.25rem', color: '#a78bfa' }}
            />
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Total Results
            </p>
          </div>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: 'white',
              marginTop: '0.25rem',
            }}
          >
            {stats.total}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(34,197,94,0.08)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(34,197,94,0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(34,197,94,0.15)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(34,197,94,0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AcademicCapIcon
              style={{ width: '1.25rem', height: '1.25rem', color: '#4ade80' }}
            />
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Passed</p>
          </div>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#4ade80',
              marginTop: '0.25rem',
            }}
          >
            {stats.passed}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(239,68,68,0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <XMarkIcon
              style={{ width: '1.25rem', height: '1.25rem', color: '#f87171' }}
            />
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Failed</p>
          </div>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#f87171',
              marginTop: '0.25rem',
            }}
          >
            {stats.failed}
          </p>
        </div>

        <div
          style={{
            background: 'rgba(139,92,246,0.08)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(139,92,246,0.15)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.15)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpenIcon
              style={{ width: '1.25rem', height: '1.25rem', color: '#a78bfa' }}
            />
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Pass Rate</p>
          </div>
          <p
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#a78bfa',
              marginTop: '0.25rem',
            }}
          >
            {stats.passRate}%
          </p>
        </div>
      </div>

      {/* Results Table */}
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
                  Course
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
                  Marks
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
                  Grade
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
              {results.length > 0 ? (
                results.map((result, index) => (
                  <tr
                    key={result._id}
                    style={{
                      borderBottom:
                        index === results.length - 1
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
                      <div>
                        <span
                          style={{
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                          }}
                        >
                          {result.course?.code || result.course}
                        </span>
                        <span
                          style={{
                            color: '#6b7280',
                            fontSize: '0.75rem',
                            display: 'block',
                          }}
                        >
                          {result.course?.name || ''}
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
                      Semester {result.semester}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                      }}
                    >
                      {result.marks}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          background: getGradeColor(result.grade).split(' ')[0],
                          color: getGradeColor(result.grade).split(' ')[1],
                        }}
                      >
                        {result.grade}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          background:
                            result.status === 'passed'
                              ? 'rgba(34,197,94,0.15)'
                              : 'rgba(239,68,68,0.15)',
                          color:
                            result.status === 'passed' ? '#4ade80' : '#f87171',
                        }}
                      >
                        {result.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      {canManageResults ? (
                        <button
                          onClick={() => {
                            const newMarks = prompt(
                              'Enter new marks:',
                              result.marks,
                            );
                            if (newMarks !== null) {
                              handleUpdateResult(
                                result._id,
                                parseInt(newMarks),
                              );
                            }
                          }}
                          style={{
                            padding: '0.3rem 0.8rem',
                            borderRadius: '0.375rem',
                            background: 'rgba(139,92,246,0.15)',
                            color: '#a78bfa',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background =
                              'rgba(139,92,246,0.3)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background =
                              'rgba(139,92,246,0.15)';
                          }}
                        >
                          Edit
                        </button>
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                          View Only
                        </span>
                      )}
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
                    No results found for this student
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Result Modal */}
      {showModal && canManageResults && (
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
                Add New Result
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

            <form onSubmit={handleAddResult}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}
              >
                <select
                  name="student"
                  value={formData.student}
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
                >
                  <option
                    value=""
                    style={{ background: '#1a1a1a', color: '#9ca3af' }}
                  >
                    Select Student *
                  </option>
                  {students.map(student => (
                    <option
                      key={student._id}
                      value={student._id}
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      {student.user?.name} ({student.studentId})
                    </option>
                  ))}
                </select>

                <select
                  name="course"
                  value={formData.course}
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
                >
                  <option
                    value=""
                    style={{ background: '#1a1a1a', color: '#9ca3af' }}
                  >
                    Select Course *
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
                  name="marks"
                  type="number"
                  placeholder="Marks * (0-100)"
                  value={formData.marks}
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
                  name="remarks"
                  placeholder="Remarks (Optional)"
                  value={formData.remarks}
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
                  Add Result
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

export default Results;
