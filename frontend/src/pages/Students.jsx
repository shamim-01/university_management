import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
  ArrowPathIcon,
  ChartBarIcon,
  SparklesIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const Students = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [students, setStudents] = useState([]);
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

  const fetchStudents = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await api.get('/students');
      const studentsData = response.data?.data || [];
      setStudents(studentsData);
      setError('');
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError(err.response?.data?.message || 'Failed to fetch students');
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
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getInitials = name => {
    if (!name) return 'S';
    return name.charAt(0).toUpperCase();
  };

  const getRandomColor = id => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-purple-500',
    ];
    const index = (id?.length || 0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium">Loading students...</p>
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
                <UserGroupIcon className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    Student Management
                  </h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/20">
                    <SparklesIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-400 text-xs font-medium">
                      {students.length} Students
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Manage all student profiles and their details
                  </p>
                  <span className="hidden sm:flex text-xs text-gray-500">
                    • {students.filter(s => s.status !== 'inactive').length}{' '}
                    active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => fetchStudents(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 disabled:opacity-50 backdrop-blur-sm"
              >
                <ArrowPathIcon
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              {canManageStudents && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                >
                  <UserPlusIcon className="w-5 h-5" />
                  Add Student
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

        {/* Search Bar - Fixed Background Issue */}
        <div className="relative max-w-md mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students by name, ID, or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
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

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5" />
                      Student
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-3.5 h-3.5" />
                      Email
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <AcademicCapIcon className="w-3.5 h-3.5" />
                      Semester
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-right text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={student._id}
                      className="hover:bg-white/5 transition-all duration-200 group"
                    >
                      <td className="px-4 py-3.5 text-gray-400 text-xs font-mono">
                        {student.studentId}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRandomColor(student._id)} flex items-center justify-center text-white text-xs font-bold`}
                          >
                            {getInitials(student.user?.name)}
                          </div>
                          <span className="text-white font-medium group-hover:text-purple-400 transition-colors duration-200">
                            {student.user?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs">
                        {student.user?.email || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg text-white text-xs">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          Sem {student.semester}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                            student.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              student.status === 'active'
                                ? 'bg-emerald-400'
                                : 'bg-red-400'
                            }`}
                          />
                          {student.status || 'active'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isAdmin() && (
                            <button
                              onClick={() => handleDelete(student._id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                          {!isAdmin() && (
                            <span className="text-gray-500 text-xs">
                              View Only
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                          <UserGroupIcon className="w-10 h-10 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">
                          {searchTerm
                            ? 'No students match your search'
                            : 'No students found'}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Click "Add Student" to create your first student profile'}
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
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {students.length > 0 && (
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-gray-400 text-sm">
                  Showing{' '}
                  <span className="text-white font-medium">
                    {filteredStudents.length}
                  </span>{' '}
                  of{' '}
                  <span className="text-white font-medium">
                    {students.length}
                  </span>{' '}
                  students
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <UserGroupIcon className="w-4 h-4" />
                    Total:{' '}
                    <span className="font-medium">{students.length}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ChartBarIcon className="w-4 h-4" />
                    Active:{' '}
                    <span className="font-medium">
                      {students.filter(s => s.status !== 'inactive').length}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Student Modal */}
        {showModal && canManageStudents && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserPlusIcon className="w-5 h-5 text-purple-400" />
                  Add New Student
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
                    placeholder="e.g., John Doe"
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
                    placeholder="student@university.edu"
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
                    Student ID *
                  </label>
                  <input
                    name="studentId"
                    placeholder="e.g., STU2024001"
                    value={formData.studentId}
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

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Batch *
                    </label>
                    <input
                      name="batch"
                      placeholder="e.g., 2024"
                      value={formData.batch}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1.5">
                    Guardian Name *
                  </label>
                  <input
                    name="guardian.name"
                    placeholder="Guardian full name"
                    value={formData.guardian.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Guardian Relation *
                    </label>
                    <input
                      name="guardian.relation"
                      placeholder="e.g., Father, Mother"
                      value={formData.guardian.relation}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Guardian Phone *
                    </label>
                    <input
                      name="guardian.phone"
                      placeholder="Phone number"
                      value={formData.guardian.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Date of Birth *
                    </label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-1.5">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition appearance-auto"
                    >
                      <option value="male" className="bg-gray-900 text-white">
                        Male
                      </option>
                      <option value="female" className="bg-gray-900 text-white">
                        Female
                      </option>
                      <option value="other" className="bg-gray-900 text-white">
                        Other
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
                    Add Student
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
          /* Fix for input background on autofill */
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-background-clip: text;
            -webkit-text-fill-color: white;
            transition: background-color 5000s ease-in-out 0s;
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Students;
