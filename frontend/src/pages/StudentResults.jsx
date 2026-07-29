import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // ✅ আপনার api.js ইম্পোর্ট করুন
import {
  UserIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const StudentResults = () => {
  const { studentId } = useParams();
  const { user, isAdmin, isTeacher } = useAuth();
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    cgpa: 0,
    passRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gradeDistribution, setGradeDistribution] = useState([]);

  const canManage = isAdmin() || isTeacher();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('📥 Fetching student data for ID:', studentId);

        // Fetch student details
        const studentRes = await api.get(`/students/${studentId}`);
        console.log('✅ Student data:', studentRes.data);
        setStudent(studentRes.data?.data || studentRes.data);

        // Fetch student results - এখানে public-dashboard ব্যবহার করছি না
        const resultsRes = await api.get(`/results/student/${studentId}`);
        console.log('✅ Results data:', resultsRes.data);

        const data = resultsRes.data?.data || { results: [], summary: {} };
        const resultsData = data.results || [];

        setResults(resultsData);
        setSummary({
          total: data.summary?.totalCourses || 0,
          passed: data.summary?.passed || 0,
          failed: data.summary?.failed || 0,
          cgpa: data.summary?.cgpa || 0,
          passRate:
            data.summary?.totalCourses > 0
              ? (
                  ((data.summary?.passed || 0) /
                    (data.summary?.totalCourses || 1)) *
                  100
                ).toFixed(1)
              : 0,
        });

        // Calculate grade distribution
        const gradeCount = {};
        resultsData.forEach(r => {
          gradeCount[r.grade] = (gradeCount[r.grade] || 0) + 1;
        });
        setGradeDistribution(
          Object.entries(gradeCount).map(([grade, count]) => ({
            grade,
            count,
          })),
        );
      } catch (err) {
        console.error('❌ Failed to fetch student data:', err);
        if (err.response?.status === 404) {
          setError('Student not found');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to server. Please check your connection.');
        } else {
          setError(
            err.response?.data?.message || 'Failed to load student data',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  // Export to CSV
  const exportToCSV = () => {
    if (!results.length) return;

    const headers = [
      'Course',
      'Semester',
      'Marks',
      'Grade',
      'Grade Point',
      'Status',
      'Credits',
    ];
    const rows = results.map(r => [
      r.course?.code || 'N/A',
      r.semester || 1,
      r.marks || 0,
      r.grade || 'N/A',
      r.gradePoint?.toFixed(2) || '0.00',
      r.status || 'N/A',
      r.course?.credits || 3,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student?.studentId || 'student'}-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Get grade color
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

  // Get grade point
  const getGradePoint = grade => {
    const points = {
      'A+': 4.0,
      A: 3.75,
      'A-': 3.5,
      'B+': 3.25,
      B: 3.0,
      'B-': 2.75,
      'C+': 2.5,
      C: 2.25,
      D: 2.0,
      F: 0.0,
    };
    return points[grade] || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading student results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg">{error}</p>
          <Link
            to={canManage ? '/results' : '/dashboard'}
            className="inline-flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto print:p-0">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          to={canManage ? '/results' : '/dashboard'}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Results
        </Link>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm"
          >
            <PrinterIcon className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Student Profile */}
      <div className="bg-gradient-to-br from-white/5 to-white/3 rounded-2xl p-6 border border-white/10 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-500/25">
              {student?.user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {student?.user?.name || 'Unknown Student'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <p className="text-gray-400 text-sm">
                  ID:{' '}
                  <span className="text-white font-medium">
                    {student?.studentId || 'N/A'}
                  </span>
                </p>
                <p className="text-gray-400 text-sm">
                  Department:{' '}
                  <span className="text-white">
                    {student?.department?.name || 'N/A'}
                  </span>
                </p>
                <p className="text-gray-400 text-sm">
                  Email:{' '}
                  <span className="text-white">
                    {student?.user?.email || 'N/A'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="md:ml-auto flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-400">CGPA</p>
              <p className="text-3xl font-bold text-purple-400">
                {summary.cgpa || '0.00'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">Pass Rate</p>
              <p className="text-3xl font-bold text-blue-400">
                {summary.passRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4 text-purple-400" />
            <p className="text-gray-400 text-sm">Total Courses</p>
          </div>
          <p className="text-2xl font-bold text-white mt-1">{summary.total}</p>
        </div>

        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <p className="text-gray-400 text-sm">Passed</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {summary.passed}
          </p>
        </div>

        <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
          <div className="flex items-center gap-2">
            <XCircleIcon className="w-4 h-4 text-red-400" />
            <p className="text-gray-400 text-sm">Failed</p>
          </div>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {summary.failed}
          </p>
        </div>

        <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="w-4 h-4 text-blue-400" />
            <p className="text-gray-400 text-sm">Grade Points</p>
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {results
              .reduce(
                (acc, r) => acc + (r.gradePoint || getGradePoint(r.grade)),
                0,
              )
              .toFixed(1)}
          </p>
        </div>
      </div>

      {/* Grade Distribution */}
      {gradeDistribution.length > 0 && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            Grade Distribution
          </h3>
          <div className="flex flex-wrap gap-2">
            {gradeDistribution.map(({ grade, count }) => (
              <div
                key={grade}
                className={`px-3 py-1.5 rounded-lg ${getGradeColor(grade)} border border-current/10`}
              >
                <span className="font-bold">{grade}</span>
                <span className="ml-2 text-sm opacity-75">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                  #
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
                  Grade Point
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Credits
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
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {index + 1}
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
                    <td className="px-4 py-3 text-white font-medium">
                      {r.gradePoint?.toFixed(2) ||
                        getGradePoint(r.grade).toFixed(2)}
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
                    <td className="px-4 py-3 text-white">
                      {r.course?.credits || 3}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <AcademicCapIcon className="w-12 h-12 text-gray-600 mb-3" />
                      <p className="text-gray-400">
                        No results found for this student
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Results will appear here once added
                      </p>
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
            Showing {results.length} course{results.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-4">
            <span>📊 Total: {summary.total}</span>
            <span>✅ Passed: {summary.passed}</span>
            <span>❌ Failed: {summary.failed}</span>
            <span>🎯 CGPA: {summary.cgpa || '0.00'}</span>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media print {
          .print\\:p-0 { padding: 0; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default StudentResults;
