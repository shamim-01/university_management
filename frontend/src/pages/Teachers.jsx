import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  AcademicCapIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChartBarIcon,
  SparklesIcon,
  EnvelopeIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  CalendarIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

const Teachers = () => {
  const { user, isAdmin } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const filteredTeachers = teachers.filter(teacher => {
    const search = searchTerm.toLowerCase();
    return (
      teacher.employeeId?.toLowerCase().includes(search) ||
      teacher.user?.name?.toLowerCase().includes(search) ||
      teacher.user?.email?.toLowerCase().includes(search) ||
      teacher.designation?.toLowerCase().includes(search)
    );
  });

  const fetchTeachers = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await api.get('/teachers');
      const teachersData = response.data?.teachers || response.data?.data || [];
      setTeachers(teachersData);
      setError('');
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
      setError(err.response?.data?.message || 'Failed to fetch teachers');
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
    fetchTeachers();
    fetchDepartments();
  }, []);

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

  const handleCreate = async e => {
    e.preventDefault();
    setError('');

    if (!formData.department) {
      setError('Please select a department');
      return;
    }

    try {
      const teacherData = {
        ...formData,
        specialization: formData.specialization
          ? formData.specialization.split(',').map(s => s.trim())
          : [],
      };

      await api.post('/teachers', teacherData);
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
      await fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create teacher');
    }
  };

  const handleDelete = async id => {
    if (!isAdmin()) {
      setError('Only Admin can delete teachers');
      return;
    }

    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/teachers/${id}`);
        await fetchTeachers();
      } catch (err) {
        setError('Failed to delete teacher');
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getRandomColor = id => {
    const colors = [
      { from: 'from-violet-500', to: 'to-purple-600' },
      { from: 'from-blue-500', to: 'to-cyan-600' },
      { from: 'from-emerald-500', to: 'to-teal-600' },
      { from: 'from-rose-500', to: 'to-pink-600' },
      { from: 'from-amber-500', to: 'to-orange-600' },
      { from: 'from-indigo-500', to: 'to-purple-600' },
    ];
    const index = (id?.length || 0) % colors.length;
    return colors[index];
  };

  const getInitials = name => {
    if (!name) return 'T';
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium">Loading teachers...</p>
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
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="hidden md:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 items-center justify-center backdrop-blur-sm">
                <AcademicCapIcon className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    Teacher Management
                  </h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/20">
                    <SparklesIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-400 text-xs font-medium">
                      {teachers.length} Teachers
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Manage all faculty members and their details
                  </p>
                  <span className="hidden sm:flex text-xs text-gray-500">
                    • {teachers.filter(t => t.status !== 'inactive').length}{' '}
                    active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => fetchTeachers(true)}
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium text-sm hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                >
                  <UserPlusIcon className="w-5 h-5" />
                  Add Teacher
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
            placeholder="Search teachers by name, ID, or designation..."
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

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map(teacher => {
              const colors = getRandomColor(teacher._id);
              return (
                <div
                  key={teacher._id}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/40 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/20"
                >
                  {/* Header with gradient */}
                  <div
                    className={`relative bg-gradient-to-r ${colors.from} ${colors.to} p-5`}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -ml-12 -mb-12" />

                    <div className="relative flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/20 flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {getInitials(teacher.user?.name)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-lg truncate">
                            {teacher.user?.name || 'N/A'}
                          </h3>
                          <p className="text-white/80 text-sm font-medium">
                            {teacher.designation}
                          </p>
                        </div>
                      </div>
                      {isAdmin() && (
                        <button
                          onClick={() => handleDelete(teacher._id)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/70 hover:text-red-400 transition-all duration-200 flex-shrink-0 ml-2"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {teacher.bio && (
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        "{teacher.bio}"
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-all duration-200">
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">
                          Employee ID
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <BriefcaseIcon className="w-3.5 h-3.5 text-purple-400" />
                          <p className="text-white text-sm font-medium truncate">
                            {teacher.employeeId}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-all duration-200">
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">
                          Department
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <BuildingLibraryIcon className="w-3.5 h-3.5 text-blue-400" />
                          <p className="text-white text-sm font-medium truncate">
                            {teacher.department?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-2 bg-white/5 rounded-xl p-2.5 hover:bg-white/10 transition-all duration-200">
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">
                          Email
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <EnvelopeIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <p className="text-white text-sm font-medium truncate">
                            {teacher.user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {teacher.specialization &&
                      teacher.specialization.length > 0 && (
                        <div className="mt-3.5 pt-3.5 border-t border-white/5">
                          <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium mb-1.5">
                            Specializations
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {teacher.specialization.map((spec, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-purple-500/15 text-purple-400 rounded-lg text-[10px] font-medium border border-purple-500/20"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {(teacher.office?.room || teacher.office?.building) && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-gray-400 text-xs">
                        <AcademicCapIcon className="w-3.5 h-3.5 text-gray-500" />
                        <span>
                          Office:{' '}
                          {teacher.office?.room &&
                            `Room ${teacher.office.room}`}
                          {teacher.office?.room &&
                            teacher.office?.building &&
                            ' • '}
                          {teacher.office?.building && teacher.office.building}
                        </span>
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
                  <AcademicCapIcon className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400 text-lg font-medium">
                  {searchTerm
                    ? 'No teachers match your search'
                    : 'No teachers found'}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Click "Add Teacher" to create your first teacher profile'}
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
        {teachers.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-gray-400 text-sm bg-white/5 rounded-xl px-4 py-3 border border-white/5">
            <p>
              Showing{' '}
              <span className="text-white font-medium">
                {filteredTeachers.length}
              </span>{' '}
              of{' '}
              <span className="text-white font-medium">{teachers.length}</span>{' '}
              teachers
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-purple-400">
                <AcademicCapIcon className="w-4 h-4" />
                Total: <span className="font-medium">{teachers.length}</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <UserGroupIcon className="w-4 h-4" />
                Active:{' '}
                <span className="font-medium">
                  {teachers.filter(t => t.status !== 'inactive').length}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Add Teacher Modal */}
        {showModal && isAdmin() && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserPlusIcon className="w-5 h-5 text-purple-400" />
                  Add New Teacher
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
                    Full Name *
                  </label>
                  <input
                    name="name"
                    placeholder="e.g., Dr. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="teacher@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Password *
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Employee ID *
                  </label>
                  <input
                    name="employeeId"
                    placeholder="e.g., TCH2024001"
                    value={formData.employeeId}
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
                    Designation *
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition appearance-auto"
                  >
                    <option
                      value="Professor"
                      className="bg-gray-900 text-white"
                    >
                      Professor
                    </option>
                    <option
                      value="Associate Professor"
                      className="bg-gray-900 text-white"
                    >
                      Associate Professor
                    </option>
                    <option
                      value="Assistant Professor"
                      className="bg-gray-900 text-white"
                    >
                      Assistant Professor
                    </option>
                    <option value="Lecturer" className="bg-gray-900 text-white">
                      Lecturer
                    </option>
                    <option
                      value="Senior Lecturer"
                      className="bg-gray-900 text-white"
                    >
                      Senior Lecturer
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Bio
                  </label>
                  <input
                    name="bio"
                    placeholder="Brief biography"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Specializations (comma separated)
                  </label>
                  <input
                    name="specialization"
                    placeholder="e.g., Machine Learning, AI, Data Science"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Office Room
                    </label>
                    <input
                      name="office.room"
                      placeholder="e.g., 301"
                      value={formData.office.room}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Office Building
                    </label>
                    <input
                      name="office.building"
                      placeholder="e.g., Science Tower"
                      value={formData.office.building}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
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
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/25"
                  >
                    Add Teacher
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

export default Teachers;
