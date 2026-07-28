import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  MegaphoneIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const Notices = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    targetAudience: ['all'],
  });

  const canManageNotices = isAdmin() || isTeacher();

  // Fetch Notices
  const fetchNotices = async () => {
    try {
      console.log('📥 1. Fetching notices...');
      const response = await api.get('/notices');
      console.log('📥 2. Response:', response.data);

      const noticesData = response.data?.data || [];
      console.log('📥 3. Notices:', noticesData);

      setNotices(noticesData);
    } catch (err) {
      console.error('❌ Error fetching notices:', err);
      setError('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create Notice
  const handleCreate = async e => {
    e.preventDefault();
    setError('');

    try {
      console.log('📝 Creating notice:', formData);
      const response = await api.post('/notices', formData);
      console.log('✅ Notice created:', response.data);

      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'general',
        priority: 'medium',
        targetAudience: ['all'],
      });
      await fetchNotices();
      alert('✅ Notice added successfully!');
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || 'Failed to create notice');
    }
  };

  // Delete Notice
  const handleDelete = async id => {
    if (!isAdmin()) {
      setError('Only Admin can delete notices');
      return;
    }

    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/notices/${id}`);
        await fetchNotices();
        alert('✅ Notice deleted successfully!');
      } catch (err) {
        setError('Failed to delete notice');
      }
    }
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400';
      case 'high':
        return 'bg-orange-500/20 text-orange-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = category => {
    switch (category) {
      case 'academic':
        return 'bg-purple-500/20 text-purple-400';
      case 'administrative':
        return 'bg-blue-500/20 text-blue-400';
      case 'event':
        return 'bg-green-500/20 text-green-400';
      case 'emergency':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
        Loading notices...
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
            Notices
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
          <p
            style={{
              color: '#6b7280',
              fontSize: '0.75rem',
              marginTop: '0.25rem',
            }}
          >
            Total Notices: {notices?.length || 0}
          </p>
        </div>

        {canManageNotices && (
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
            + Add Notice
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

      {/* Notices List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notices && notices.length > 0 ? (
          notices.map(notice => (
            <div
              key={notice._id}
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
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
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
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MegaphoneIcon
                      style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        color: 'white',
                      }}
                    />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      {notice.title}
                    </h3>
                    <p
                      style={{
                        color: '#9ca3af',
                        fontSize: '0.875rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      {notice.content}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        marginTop: '0.75rem',
                      }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: '#6b7280',
                          fontSize: '0.75rem',
                        }}
                      >
                        <CalendarIcon
                          style={{ width: '1rem', height: '1rem' }}
                        />
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        style={{
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.625rem',
                          background: getCategoryColor(notice.category).split(
                            ' ',
                          )[0],
                          color: getCategoryColor(notice.category).split(
                            ' ',
                          )[1],
                        }}
                      >
                        {notice.category}
                      </span>
                      <span
                        style={{
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.625rem',
                          background: getPriorityColor(notice.priority).split(
                            ' ',
                          )[0],
                          color: getPriorityColor(notice.priority).split(
                            ' ',
                          )[1],
                        }}
                      >
                        {notice.priority}
                      </span>
                      <span
                        style={{
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.625rem',
                          background: notice.isPublished
                            ? 'rgba(34,197,94,0.2)'
                            : 'rgba(107,114,128,0.2)',
                          color: notice.isPublished ? '#4ade80' : '#6b7280',
                        }}
                      >
                        {notice.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
                {isAdmin() && (
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      onClick={() => handleDelete(notice._id)}
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
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '1rem',
            }}
          >
            No notices found. Click "Add Notice" to create one.
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      {showModal && canManageNotices && (
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
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Add Notice</h2>
            <form onSubmit={handleCreate}>
              <input
                name="title"
                placeholder="Notice Title *"
                value={formData.title}
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
              <textarea
                name="content"
                placeholder="Notice Content *"
                value={formData.content}
                onChange={handleChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  marginBottom: '0.75rem',
                  resize: 'vertical',
                }}
                required
              />
              <select
                name="category"
                value={formData.category}
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
              >
                <option value="academic">Academic</option>
                <option value="administrative">Administrative</option>
                <option value="event">Event</option>
                <option value="emergency">Emergency</option>
                <option value="general">General</option>
              </select>
              <select
                name="priority"
                value={formData.priority}
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
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
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
                  Add Notice
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

export default Notices;
