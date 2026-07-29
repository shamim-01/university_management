import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  MegaphoneIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  XMarkIcon,
  ArrowPathIcon,
  SparklesIcon,
  ChartBarIcon,
  EyeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Notices = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const fetchNotices = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await api.get('/notices');
      const noticesData = response.data?.data || [];
      setNotices(noticesData);
      setError('');
    } catch (err) {
      console.error('Failed to fetch notices:', err);
      setError('Failed to fetch notices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/notices', formData);
      setShowModal(false);
      setFormData({
        title: '',
        content: '',
        category: 'general',
        priority: 'medium',
        targetAudience: ['all'],
      });
      await fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create notice');
    }
  };

  const handleDelete = async id => {
    if (!isAdmin()) {
      setError('Only Admin can delete notices');
      return;
    }

    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/notices/${id}`);
        await fetchNotices();
      } catch (err) {
        setError('Failed to delete notice');
      }
    }
  };

  const getPriorityColor = priority => {
    const colors = {
      urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
      high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };
    return (
      colors[priority] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    );
  };

  const getCategoryColor = category => {
    const colors = {
      academic: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      administrative: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      event: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      emergency: 'bg-red-500/10 text-red-400 border-red-500/20',
      general: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return (
      colors[category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    );
  };

  const getPriorityIcon = priority => {
    switch (priority) {
      case 'urgent':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MegaphoneIcon className="w-6 h-6 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium">Loading notices...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-10">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="hidden md:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 items-center justify-center backdrop-blur-sm">
                <MegaphoneIcon className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    Notice Board
                  </h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/20">
                    <SparklesIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-400 text-xs font-medium">
                      {notices.length} Notices
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Stay updated with the latest announcements
                  </p>
                  <span className="hidden sm:flex text-xs text-gray-500">
                    • {notices.filter(n => n.isPublished).length} published
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => fetchNotices(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 disabled:opacity-50 backdrop-blur-sm"
              >
                <ArrowPathIcon
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              {canManageNotices && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Notice
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <XMarkIcon className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Notices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {notices.length > 0 ? (
            notices.map(notice => (
              <div
                key={notice._id}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/40 hover:scale-[1.02] transition-all duration-300 overflow-hidden shadow-lg shadow-purple-500/5 hover:shadow-purple-500/20"
              >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-5 border-b border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16" />

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25">
                        <MegaphoneIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg truncate">
                          {notice.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryColor(notice.category)}`}
                          >
                            {notice.category}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getPriorityColor(notice.priority)}`}
                          >
                            {getPriorityIcon(notice.priority)} {notice.priority}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                              notice.isPublished
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                            }`}
                          >
                            {notice.isPublished ? '📢 Published' : '📝 Draft'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isAdmin() && (
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-200 flex-shrink-0 ml-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {notice.content}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(notice.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {new Date(notice.createdAt).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </span>
                    </div>
                    {notice.targetAudience &&
                      notice.targetAudience.length > 0 && (
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {notice.targetAudience.includes('all')
                              ? 'All Users'
                              : notice.targetAudience.join(', ')}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MegaphoneIcon className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400 text-lg font-medium">
                  No notices found
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {canManageNotices
                    ? 'Click "Add Notice" to create your first notice'
                    : 'No notices available at the moment'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {notices.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-gray-400 text-sm bg-white/5 rounded-xl px-4 py-3 border border-white/5">
            <p>
              Showing{' '}
              <span className="text-white font-medium">{notices.length}</span>{' '}
              notices
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-purple-400">
                <MegaphoneIcon className="w-4 h-4" />
                Total: <span className="font-medium">{notices.length}</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ChartBarIcon className="w-4 h-4" />
                Published:{' '}
                <span className="font-medium">
                  {notices.filter(n => n.isPublished).length}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Add Notice Modal */}
        {showModal && canManageNotices && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PlusIcon className="w-5 h-5 text-purple-400" />
                  Add New Notice
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Notice Title *
                  </label>
                  <input
                    name="title"
                    placeholder="Enter notice title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Notice Content *
                  </label>
                  <textarea
                    name="content"
                    placeholder="Write your notice content here..."
                    value={formData.content}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition appearance-auto"
                    >
                      <option
                        value="academic"
                        className="bg-gray-900 text-white"
                      >
                        📚 Academic
                      </option>
                      <option
                        value="administrative"
                        className="bg-gray-900 text-white"
                      >
                        🏛️ Administrative
                      </option>
                      <option value="event" className="bg-gray-900 text-white">
                        🎉 Event
                      </option>
                      <option
                        value="emergency"
                        className="bg-gray-900 text-white"
                      >
                        🚨 Emergency
                      </option>
                      <option
                        value="general"
                        className="bg-gray-900 text-white"
                      >
                        📌 General
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition appearance-auto"
                    >
                      <option value="low" className="bg-gray-900 text-white">
                        🔵 Low
                      </option>
                      <option value="medium" className="bg-gray-900 text-white">
                        🟡 Medium
                      </option>
                      <option value="high" className="bg-gray-900 text-white">
                        🟠 High
                      </option>
                      <option value="urgent" className="bg-gray-900 text-white">
                        🔴 Urgent
                      </option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/25"
                  >
                    Add Notice
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CSS */}
        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% auto;
            animation: gradient 3s ease infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Notices;
