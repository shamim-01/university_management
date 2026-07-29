import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const AllResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    cgpa: 0,
  });

  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);

  const fetchResults = useCallback(async (search = '') => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      setIsSearching(true);
      setLoading(true);

      abortControllerRef.current = new AbortController();

      const res = await api.get('/results/student/all', {
        params: { search: search || undefined },
        signal: abortControllerRef.current.signal,
      });

      const data = res.data?.data || { results: [], summary: {} };
      setResults(data.results || []);
      setStats({
        total: data.summary?.totalCourses || 0,
        passed: data.summary?.passed || 0,
        failed: data.summary?.failed || 0,
        cgpa: data.summary?.cgpa || 0,
      });
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      console.error('❌ Failed to fetch results:', err);
      if (err.response?.status === 404) {
        setResults([]);
        setStats({ total: 0, passed: 0, failed: 0, cgpa: 0 });
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchResults(searchTerm);
    }, 400);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, fetchResults]);

  useEffect(() => {
    fetchResults('');
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getGradeColor = grade => {
    const colors = {
      'A+': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      A: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'A-': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'B+': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'B-': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'C+': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      C: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      D: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      F: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[grade] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Stat cards configuration
  const statCards = [
    {
      label: 'Total Results',
      value: stats.total,
      icon: ChartBarIcon,
      color: 'purple',
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      label: 'Passed',
      value: stats.passed,
      icon: CheckCircleIcon,
      color: 'emerald',
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Failed',
      value: stats.failed,
      icon: XCircleIcon,
      color: 'red',
      bg: 'from-red-500/10 to-red-500/5',
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
    },
    {
      label: 'CGPA',
      value: stats.cgpa || '0.00',
      icon: AcademicCapIcon,
      color: 'blue',
      bg: 'from-blue-500/10 to-blue-500/5',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
  ];

  if (loading && !results.length) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium">Loading results...</p>
          <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              📊 All Results
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Complete list of all student results • {results.length} records
            </p>
          </div>
          <button
            onClick={() => fetchResults(searchTerm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
          >
            <ArrowPathIcon
              className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-5 border ${stat.border} hover:scale-[1.02] transition-all duration-300 group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                    {stat.label}
                  </p>
                  <p
                    className={`text-2xl md:text-3xl font-bold text-${stat.color}-400 mt-1`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-2.5 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-lg mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by student, course, grade, or status..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
          )}
          {searchTerm && !isSearching && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          {searchTerm && (
            <div className="mt-2 text-sm">
              <span className="text-gray-400">
                Found{' '}
                <span className="text-purple-400 font-semibold">
                  {results.length}
                </span>{' '}
                result{results.length !== 1 ? 's' : ''} for "
                <span className="text-white font-medium">{searchTerm}</span>"
              </span>
              {searchTerm.length === 1 && (
                <span className="ml-3 text-yellow-400/70 text-xs">
                  💡 Try typing at least 2 characters for better results
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-3.5 h-3.5" />
                      Student
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <BookOpenIcon className="w-3.5 h-3.5" />
                      Course
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.length > 0 ? (
                  results.map((r, index) => (
                    <tr
                      key={r._id || index}
                      className="hover:bg-white/5 transition-all duration-200 group"
                    >
                      <td className="px-4 py-3.5 text-gray-500 text-xs font-medium">
                        #{String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-white font-medium group-hover:text-purple-400 transition-colors duration-200">
                          {r.student?.user?.name || 'N/A'}
                        </p>
                        <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5">
                          <span className="w-1 h-1 bg-gray-600 rounded-full" />
                          ID: {r.student?.studentId || 'N/A'}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-white font-medium">
                          {r.course?.code || 'N/A'}
                        </p>
                        <p className="text-gray-500 text-xs truncate max-w-[150px]">
                          {r.course?.name || ''}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg text-white text-xs">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          Sem {r.semester || 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-white font-semibold">
                          {r.marks || 0}
                        </span>
                        <span className="text-gray-500 text-xs ml-1">
                          / 100
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getGradeColor(r.grade)}`}
                        >
                          {r.grade || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            r.status === 'passed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              r.status === 'passed'
                                ? 'bg-emerald-400'
                                : 'bg-red-400'
                            }`}
                          />
                          {r.status === 'passed' ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                          <BookOpenIcon className="w-10 h-10 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">
                          {searchTerm
                            ? 'No results match your search'
                            : 'No results found'}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Results will appear here once available'}
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
          {results.length > 0 && (
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-gray-400 text-sm">
                  Showing{' '}
                  <span className="text-white font-medium">
                    {results.length}
                  </span>{' '}
                  result{results.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <ChartBarIcon className="w-4 h-4 text-purple-400" />
                    Total:{' '}
                    <span className="text-white font-medium">
                      {stats.total}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    Passed: <span className="font-medium">{stats.passed}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <XCircleIcon className="w-4 h-4" />
                    Failed: <span className="font-medium">{stats.failed}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <AcademicCapIcon className="w-4 h-4" />
                    CGPA:{' '}
                    <span className="font-medium">{stats.cgpa || '0.00'}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CSS Animations */}
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
        `}</style>
      </div>
    </div>
  );
};

export default AllResults;
