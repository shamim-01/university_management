import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const ResultDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await api.get('/results/public-dashboard');
      setData(res.data.data);
      setError('');
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    fetchDashboard(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 mt-4 font-medium">Loading dashboard...</p>
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
            <span className="text-red-400 text-5xl">⚠️</span>
          </div>
          <p className="text-red-400 text-lg font-medium">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-all duration-200"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    summary,
    gradeDistribution,
    deptPerformance,
    recentResults,
    semesterStats,
  } = data || {};

  // Stat cards configuration
  const statCards = [
    {
      label: 'Total Results',
      value: summary?.totalResults || 0,
      icon: ChartBarIcon,
      color: 'purple',
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      textColor: 'text-white',
    },
    {
      label: 'Passed',
      value: summary?.passedResults || 0,
      icon: CheckCircleIcon,
      color: 'emerald',
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Failed',
      value: summary?.failedResults || 0,
      icon: XCircleIcon,
      color: 'red',
      bg: 'from-red-500/10 to-red-500/5',
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      textColor: 'text-red-400',
    },
    {
      label: 'Pass Rate',
      value: `${summary?.passRate || 0}%`,
      icon: ArrowTrendingUpIcon,
      color: 'blue',
      bg: 'from-blue-500/10 to-blue-500/5',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-400',
    },
  ];

  // Grade color mapping
  const getGradeBarColor = grade => {
    const colors = {
      'A+': 'bg-emerald-500',
      A: 'bg-emerald-400',
      'A-': 'bg-emerald-300',
      'B+': 'bg-blue-500',
      B: 'bg-blue-400',
      'B-': 'bg-blue-300',
      'C+': 'bg-yellow-500',
      C: 'bg-yellow-400',
      D: 'bg-orange-400',
      F: 'bg-red-500',
    };
    return colors[grade] || 'bg-gray-500';
  };

  const getGradeBadgeColor = grade => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              📊 Result Dashboard
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Overview of all student results
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className={`group bg-gradient-to-br ${stat.bg} rounded-2xl p-5 border ${stat.border} hover:scale-[1.02] transition-all duration-300`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                    {stat.label}
                  </p>
                  <p
                    className={`text-2xl md:text-3xl font-bold ${stat.textColor} mt-1`}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Grade Distribution */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-purple-400" />
              Grade Distribution
            </h2>
            <div className="space-y-3">
              {gradeDistribution?.map(g => {
                const percent =
                  summary?.totalResults > 0
                    ? (g.count / summary.totalResults) * 100
                    : 0;
                return (
                  <div key={g._id} className="group">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${getGradeBarColor(g._id)}`}
                        />
                        Grade {g._id}
                      </span>
                      <span className="text-white font-medium">
                        {g.count} ({percent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getGradeBarColor(g._id)} transition-all duration-1000 group-hover:opacity-80`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-blue-400" />
              Department-wise Performance
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {deptPerformance?.length > 0 ? (
                deptPerformance.map(dept => (
                  <div
                    key={dept._id}
                    className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium group-hover:text-purple-400 transition-colors duration-200">
                        {dept.deptName}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <AcademicCapIcon className="w-3 h-3 text-blue-400" />
                          Avg:{' '}
                          <span className="text-white">{dept.avgMarks}%</span>
                        </span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">
                            {dept.passed}
                          </span>
                        </span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <XCircleIcon className="w-3 h-3 text-red-400" />
                          <span className="text-red-400">{dept.failed}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-lg font-bold ${
                          dept.passRate >= 70
                            ? 'text-emerald-400'
                            : dept.passRate >= 40
                              ? 'text-yellow-400'
                              : 'text-red-400'
                        }`}
                      >
                        {dept.passRate.toFixed(0)}%
                      </span>
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden ml-auto mt-1">
                        <div
                          className={`h-full rounded-full ${
                            dept.passRate >= 70
                              ? 'bg-emerald-500'
                              : dept.passRate >= 40
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(dept.passRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <UserGroupIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p>No department data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Semester Stats */}
        {semesterStats && semesterStats.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-pink-400" />
              Semester-wise Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {semesterStats.map(sem => (
                <div
                  key={sem._id}
                  className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center transition-all duration-200"
                >
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                    Semester {sem._id}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {sem.count}
                  </p>
                  <p className="text-sm text-gray-400">
                    Avg:{' '}
                    <span className="text-blue-400 font-medium">
                      {sem.avgMarks.toFixed(1)}%
                    </span>
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircleIcon className="w-3 h-3" />
                      {sem.passed}
                    </span>
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircleIcon className="w-3 h-3" />
                      {sem.count - sem.passed}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Results */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/5">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-purple-400" />
              Recent Results
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({recentResults?.length || 0} records)
              </span>
            </h2>
            <Link
              to="/results"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center gap-1"
            >
              View All
              <EyeIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase tracking-wider">
                    Course
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
                {recentResults?.length > 0 ? (
                  recentResults.map(r => (
                    <tr
                      key={r._id}
                      className="hover:bg-white/5 transition-all duration-200 group"
                    >
                      <td className="px-4 py-3">
                        <p className="text-white font-medium group-hover:text-purple-400 transition-colors duration-200">
                          {r.student?.studentId || 'N/A'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">
                          {r.course?.code || 'N/A'}
                        </p>
                        <p className="text-gray-500 text-xs truncate max-w-[150px]">
                          {r.course?.name || ''}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white font-semibold">
                          {r.marks || 0}
                        </span>
                        <span className="text-gray-500 text-xs ml-1">
                          / 100
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getGradeBadgeColor(r.grade)}`}
                        >
                          {r.grade || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
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
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                          <BookOpenIcon className="w-10 h-10 text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-lg font-medium">
                          No recent results
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Results will appear here once available
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {recentResults?.length > 0 && (
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-gray-400 text-sm">
                  Showing{' '}
                  <span className="text-white font-medium">
                    {recentResults.length}
                  </span>{' '}
                  recent results
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <ChartBarIcon className="w-4 h-4 text-purple-400" />
                    Total:{' '}
                    <span className="text-white font-medium">
                      {summary?.totalResults || 0}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    Passed:{' '}
                    <span className="font-medium">
                      {summary?.passedResults || 0}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-red-400">
                    <XCircleIcon className="w-4 h-4" />
                    Failed:{' '}
                    <span className="font-medium">
                      {summary?.failedResults || 0}
                    </span>
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
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.5);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ResultDashboard;
