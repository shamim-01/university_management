import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BuildingLibraryIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const Departments = () => {
  const { user, isAdmin } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  // Fetch Departments from API
  const fetchDepartments = async () => {
    try {
      console.log('📥 1. Fetching departments from API...');
      const response = await api.get('/departments');
      console.log('📥 2. API Response:', response);
      console.log('📥 3. Response data:', response.data);

      const departmentsData = response.data?.data || [];
      console.log('📥 4. Departments data:', departmentsData);

      if (departmentsData.length > 0) {
        setDepartments(departmentsData);
        console.log('✅ 5. Departments set! Count:', departmentsData.length);
      } else {
        console.warn('⚠️ 6. No departments found');
        setDepartments([]);
      }
    } catch (err) {
      console.error('❌ 7. Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    console.log('🔄 Departments state updated:', departments);
    console.log('🔄 Departments count:', departments.length);
  }, [departments]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create Department
  const handleCreate = async e => {
    e.preventDefault();
    setError('');

    try {
      console.log('📝 Creating department:', formData);
      const response = await api.post('/departments', formData);
      console.log('✅ Department created:', response.data);

      setShowModal(false);
      setFormData({ name: '', code: '', description: '' });
      await fetchDepartments();
      alert('✅ Department added successfully!');
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || 'Failed to create department');
    }
  };

  // Delete Department
  const handleDelete = async id => {
    if (!isAdmin()) {
      setError('Only Admin can delete departments');
      return;
    }

    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/departments/${id}`);
        await fetchDepartments();
        alert('✅ Department deleted successfully!');
      } catch (err) {
        setError('Failed to delete department');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
        Loading...
      </div>
    );
  }

  console.log('🔍 Rendering departments in UI:', departments);
  console.log('🔍 Departments count in UI:', departments?.length);

  return (
    <div style={{ padding: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
            Departments
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Role:{' '}
            <span style={{ color: '#a78bfa', textTransform: 'capitalize' }}>
              {user?.role}
            </span>
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
            Total Departments: {departments?.length || 0}
          </p>
        </div>

        {isAdmin() && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.5rem 1.5rem',
              background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            + Add Department
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {departments && departments.length > 0 ? (
          departments.map(dept => {
            console.log('🔍 Rendering department:', dept);
            return (
              <div
                key={dept._id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor =
                    'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
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
                        background:
                          'linear-gradient(to right, #f97316, #ef4444)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BuildingLibraryIcon
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          color: 'white',
                        }}
                      />
                    </div>
                    <div>
                      <h3 style={{ color: 'white', fontWeight: '600' }}>
                        {dept.name}
                      </h3>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                        Code: {dept.code}
                      </p>
                    </div>
                  </div>
                  {isAdmin() && (
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        onClick={() => handleDelete(dept._id)}
                        style={{
                          padding: '0.375rem',
                          borderRadius: '0.5rem',
                          background: 'transparent',
                          color: '#f87171',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background =
                            'rgba(239, 68, 68, 0.2)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                      </button>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <div>
                    <p style={{ color: '#6b7280' }}>Description</p>
                    <p style={{ color: 'white', fontWeight: '600' }}>
                      {dept.description || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280' }}>Established</p>
                    <p style={{ color: 'white', fontWeight: '600' }}>
                      {dept.establishedYear || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
            }}
          >
            No departments found. Click "Add Department" to create one.
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showModal && isAdmin() && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#1a1a1a',
              padding: '2rem',
              borderRadius: '1rem',
              maxWidth: '500px',
              width: '90%',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>
              Add Department
            </h2>
            <form onSubmit={handleCreate}>
              <input
                name="name"
                placeholder="Department Name *"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  marginBottom: '0.75rem',
                }}
                required
              />
              <input
                name="code"
                placeholder="Department Code *"
                value={formData.code}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  marginBottom: '0.75rem',
                }}
                required
              />
              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  marginBottom: '0.75rem',
                }}
              />
              <div
                style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}
              >
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Add Department
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
