import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
  AcademicCapIcon,
  ArrowPathIcon,
  ChartBarIcon,
  SparklesIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const Courses = () => {
  const { user, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const filteredCourses = courses.filter(course => {
    const search = searchTerm.toLowerCase();
    return (
      course.code?.toLowerCase().includes(search) ||
      course.name?.toLowerCase().includes(search) ||
      course.department?.name?.toLowerCase().includes(search)
    );
  });

  const fetchCourses = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await api.get('/courses');
      const coursesData = response.data?.courses || response.data?.data || [];
      setCourses(coursesData);
      setError('');
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
      setRefreshing(false);
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
    fetchCourses();
    fetchDepartments();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError('');

    if (!formData.department) {
      setError('Please select a department');
      return;
    }

    try {
      await api.post('/courses', formData);
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleDelete = async id => {
    if (!isAdmin()) {
      setError('Only Admin can delete courses');
      return;
    }

    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        await fetchCourses();
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getRandomColor = id => {
    const colors = [
      { from: 'from-violet-500', to: 'to-purple-600', bg: 'bg-violet-500/20' },
      { from: 'from-blue-500', to: 'to-cyan-600', bg: 'bg-blue-500/20' },
      { from: 'from-emerald-500', to: 'to-teal-600', bg: 'bg-emerald-500/20' },
      { from: 'from-rose-500', to: 'to-pink-600', bg: 'bg-rose-500/20' },
      { from: 'from-amber-500', to: 'to-orange-600', bg: 'bg-amber-500/20' },
      { from: 'from-indigo-500', to: 'to-purple-600', bg: 'bg-indigo-500/20' },
    ];
    const index = (id?.length || 0) % colors.length;
    return colors[index];
  };

  const getStatusColor = status => {
    return status === 'active'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium">Loading courses...</p>
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
                <BookOpenIcon className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    Course Management
                  </h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/20">
                    <SparklesIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-400 text-xs font-medium">
                      {courses.length} Courses
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Manage all available courses and their details
                  </p>
                  <span className="hidden sm:flex text-xs text-gray-500">
                    • {courses.filter(c => c.status !== 'inactive').length}{' '}
                    active
                  </span>
                  <span className="hidden sm:flex text-xs text-gray-500">
                    • {departments.length} departments
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => fetchCourses(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 disabled:opacity-50 backdrop-blur-sm"
              >
                <ArrowPathIcon
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              {isAdmin() && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Course
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

        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses by name, code, or department..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white group"
            >
              <XMarkIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}
        </div>

        {/* Courses Grid - Improved Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => {
              const colors = getRandomColor(course._id);
              return (
                <div
                  key={course._id}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/40 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/20"
                >
                  {/* Header with gradient  */}
                  <div
                    className={`relative bg-gradient-to-r ${colors.from} ${colors.to} p-5`}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -ml-12 -mb-12" />

                    <div className="relative flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/20 flex-shrink-0">
                          <BookOpenIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold text-lg truncate">
                              {course.code}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(course.status)} flex-shrink-0`}
                            >
                              {course.status || 'active'}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm truncate">
                            {course.name}
                          </p>
                        </div>
                      </div>
                      {isAdmin() && (
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/70 hover:text-red-400 transition-all duration-200 flex-shrink-0 ml-2"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content  */}
                  <div className="p-5">
                    {course.description && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {course.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-all duration-200">
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">
                          Department
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <UserGroupIcon className="w-3.5 h-3.5 text-purple-400" />
                          <p className="text-white text-sm font-medium truncate">
                            {course.department?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-all duration-200">
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">
                          Credits
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <AcademicCapIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <p className="text-white text-sm font-medium">
                            {course.credits}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-all duration-200">
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">
                          Semester
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <ClockIcon className="w-3.5 h-3.5 text-blue-400" />
                          <p className="text-white text-sm font-medium">
                            {course.semester}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-all duration-200">
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">
                          Students
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <UserGroupIcon className="w-3.5 h-3.5 text-pink-400" />
                          <p className="text-white text-sm font-medium">
                            {course.students?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {course.teacher && (
                      <div className="mt-3.5 pt-3.5 border-t border-white/5 flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {course.teacher?.name?.charAt(0) || 'T'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-400 text-xs">Instructor</p>
                          <p className="text-gray-200 text-sm font-medium truncate">
                            {course.teacher?.name || 'Not Assigned'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpenIcon className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400 text-lg font-medium">
                  {searchTerm
                    ? 'No courses match your search'
                    : 'No courses found'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Click "Add Course" to create your first course'}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 text-sm transition-all duration-200"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {courses.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-gray-400 text-sm bg-white/5 rounded-xl px-4 py-3 border border-white/5">
            <p>
              Showing{' '}
              <span className="text-white font-medium">
                {filteredCourses.length}
              </span>{' '}
              of{' '}
              <span className="text-white font-medium">{courses.length}</span>{' '}
              courses
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-purple-400">
                <BookOpenIcon className="w-4 h-4" />
                Total: <span className="font-medium">{courses.length}</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ChartBarIcon className="w-4 h-4" />
                Active:{' '}
                <span className="font-medium">
                  {courses.filter(c => c.status !== 'inactive').length}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Add Course Modal */}
        {showModal && isAdmin() && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PlusIcon className="w-5 h-5 text-purple-400" />
                  Add New Course
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
                    Course Code *
                  </label>
                  <input
                    name="code"
                    placeholder="e.g., CSE401"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Course Name *
                  </label>
                  <input
                    name="name"
                    placeholder="e.g., Artificial Intelligence"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition appearance-auto"
                    required
                  >
                    <option value="" className="bg-gray-900 text-gray-400">
                      Select Department
                    </option>
                    {departments.map(dept => (
                      <option
                        key={dept._id}
                        value={dept._id}
                        className="bg-gray-900 text-white"
                      >
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Description
                  </label>
                  <input
                    name="description"
                    placeholder="Brief description of the course"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Credits *
                    </label>
                    <input
                      name="credits"
                      type="number"
                      min="1"
                      max="6"
                      value={formData.credits}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Semester *
                    </label>
                    <input
                      name="semester"
                      type="number"
                      min="1"
                      max="12"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition"
                      required
                    />
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
                    Add Course
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
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Courses;
