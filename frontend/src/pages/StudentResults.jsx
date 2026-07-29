import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  UserIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  BookOpenIcon,
  UserGroupIcon,
  EnvelopeIcon,
  IdentificationIcon,
  ArrowPathIcon,
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

        const studentRes = await api.get(`/students/${studentId}`);
        console.log('✅ Student data:', studentRes.data);
        setStudent(studentRes.data?.data || studentRes.data);

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

  const handlePrint = () => {
    window.print();
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
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium">
            Loading student results...
          </p>
          <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="text-red-400 text-5xl">⚠️</div>
          </div>
          <p className="text-red-400 text-lg font-medium">{error}</p>
          <Link
            to={canManage ? '/results' : '/dashboard'}
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-all duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-6 print:p-0">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            to={canManage ? '/results' : '/dashboard'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Results
          </Link>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-400 transition-all duration-200 text-sm border border-emerald-500/20 hover:border-emerald-500/30"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-all duration-200 text-sm border border-blue-500/20 hover:border-blue-500/30"
            >
              <PrinterIcon className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Student Profile */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 rounded-2xl p-6 md:p-8 border border-white/10 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-purple-500/30">
                  {student?.user?.name?.charAt(0) || 'S'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">✓</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {student?.user?.name || 'Unknown Student'}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <IdentificationIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium">
                      {student?.studentId || 'N/A'}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <UserGroupIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-white">
                      {student?.department?.name || 'N/A'}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <EnvelopeIcon className="w-4 h-4 text-pink-400" />
                    <span className="text-white">
                      {student?.user?.email || 'N/A'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="md:ml-auto flex items-center gap-8">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  CGPA
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {summary.cgpa || '0.00'}
                </p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Pass Rate
                </p>
                <p className="text-4xl font-bold text-blue-400">
                  {summary.passRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="group bg-gradient-to-br from-white/5 to-white/3 rounded-2xl p-5 border border-white/10 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {summary.total}
                </p>
              </div>
              <div className="p-2.5 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <ChartBarIcon className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-2xl p-5 border border-emerald-500/20 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                  Passed
                </p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {summary.passed}
                </p>
              </div>
              <div className="p-2.5 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-2xl p-5 border border-red-500/20 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                  Failed
                </p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  {summary.failed}
                </p>
              </div>
              <div className="p-2.5 bg-red-500/20 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <XCircleIcon className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-5 border border-blue-500/20 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                  Grade Points
                </p>
                <p className="text-2xl font-bold text-blue-400 mt-1">
                  {results
                    .reduce(
                      (acc, r) =>
                        acc + (r.gradePoint || getGradePoint(r.grade)),
                      0,
                    )
                    .toFixed(1)}
                </p>
              </div>
              <div className="p-2.5 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <AcademicCapIcon className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        {gradeDistribution.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 text-purple-400" />
              Grade Distribution
            </h3>
            <div className="flex flex-wrap gap-2">
              {gradeDistribution.map(({ grade, count }) => (
                <div
                  key={grade}
                  className={`px-4 py-2 rounded-xl ${getGradeColor(grade)} border border-current/10 transition-all duration-200 hover:scale-105 cursor-default`}
                >
                  <span className="font-bold text-sm">{grade}</span>
                  <span className="ml-2 text-xs opacity-75 bg-white/10 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
                    Grade Point
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Credits
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
                          {r.course?.code || 'N/A'}
                        </p>
                        <p className="text-gray-500 text-xs truncate max-w-[200px]">
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
                      <td className="px-4 py-3.5 text-white font-medium">
                        {r.gradePoint?.toFixed(2) ||
                          getGradePoint(r.grade).toFixed(2)}
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
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-lg text-white text-xs">
                          <AcademicCapIcon className="w-3 h-3 text-purple-400" />
                          {r.course?.credits || 3}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                          <BookOpenIcon className="w-10 h-10 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">
                          No results found
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

          {/* Footer */}
          {results.length > 0 && (
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-gray-400 text-sm">
                  Showing{' '}
                  <span className="text-white font-medium">
                    {results.length}
                  </span>{' '}
                  course{results.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <ChartBarIcon className="w-4 h-4 text-purple-400" />
                    Total:{' '}
                    <span className="text-white font-medium">
                      {summary.total}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    Passed:{' '}
                    <span className="font-medium">{summary.passed}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <XCircleIcon className="w-4 h-4" />
                    Failed:{' '}
                    <span className="font-medium">{summary.failed}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <AcademicCapIcon className="w-4 h-4" />
                    CGPA:{' '}
                    <span className="font-medium">
                      {summary.cgpa || '0.00'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CSS */}
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
    </div>
  );
};

export default StudentResults;
