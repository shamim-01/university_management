import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AllResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    cgpa: 0,
  });

  const fetchResults = async (search = '') => {
    try {
      setLoading(true);

      // ✅ পরিবর্তন: 'all' studentId দিয়ে কল করুন
      const res = await api.get('/results/student/all', {
        params: { search: search || undefined },
      });

      console.log('📊 All results fetched:', res.data);

      const data = res.data?.data || { results: [], summary: {} };
      setResults(data.results || []);
      setStats({
        total: data.summary?.totalCourses || 0,
        passed: data.summary?.passed || 0,
        failed: data.summary?.failed || 0,
        cgpa: data.summary?.cgpa || 0,
      });
    } catch (err) {
      console.error('Failed to fetch results:', err);
      if (err.response?.status === 404) {
        // Fallback: যদি route না থাকে
        setResults([]);
        setStats({ total: 0, passed: 0, failed: 0, cgpa: 0 });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get grade color
  const getGradeColor = grade => {
    const colors = {
      'A+': 'text-emerald-400 bg-emerald-500/20',
      A: 'text-emerald-400 bg-emerald-500/20',
      'A-': 'text-emerald-400 bg-emerald-500/20',
      'B+': 'text-blue-400 bg-blue-500/20',
      B: 'text-blue-400 bg-blue-500/20',
      'B-': 'text-blue-400 bg-blue-500/20',
      'C+': 'text-yellow-400 bg-yellow-500/20',
      C: 'text-yellow-400 bg-yellow-500/20',
      D: 'text-orange-400 bg-orange-500/20',
      F: 'text-red-400 bg-red-500/20',
    };
    return colors[grade] || 'text-gray-400 bg-gray-500/20';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            📋 All Results
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Complete list of all student results • {results.length} records
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-gray-400 text-xs uppercase">Total</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
          <p className="text-gray-400 text-xs uppercase">Passed</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {stats.passed}
          </p>
        </div>
        <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
          <p className="text-gray-400 text-xs uppercase">Failed</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{stats.failed}</p>
        </div>
        <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/20">
          <p className="text-gray-400 text-xs uppercase">CGPA</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {stats.cgpa || '0.00'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by student, course, grade..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.length > 0 ? (
                results.map((r, index) => (
                  <tr
                    key={r._id || index}
                    className="hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">
                        {r.student?.user?.name || 'N/A'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        ID: {r.student?.studentId || 'N/A'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">
                        {r.course?.code || 'N/A'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {r.course?.name || ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-white">
                      Sem {r.semester || 1}
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">
                      {r.marks || 0}
                      <span className="text-gray-500 text-xs ml-1">/100</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${getGradeColor(r.grade)}`}
                      >
                        {r.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          r.status === 'passed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {r.status === 'passed' ? '✅ Passed' : '❌ Failed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-3">📭</div>
                      <p className="text-gray-400">
                        {searchTerm
                          ? 'No results match your search'
                          : 'No results found'}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="mt-2 text-purple-400 hover:text-purple-300 text-sm transition"
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
      </div>

      {/* Footer */}
      {results.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-gray-400 text-sm">
          <p>
            Showing {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-4">
            <span>📊 Total: {stats.total}</span>
            <span>✅ Passed: {stats.passed}</span>
            <span>❌ Failed: {stats.failed}</span>
            <span>🎯 CGPA: {stats.cgpa || '0.00'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllResults;
