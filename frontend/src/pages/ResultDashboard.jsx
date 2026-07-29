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
} from '@heroicons/react/24/outline';

const ResultDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/results/public-dashboard');
        setData(res.data.data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center p-8">{error}</div>;
  }

  const { summary, gradeDistribution, deptPerformance, recentResults } =
    data || {};

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">📊 Result Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of all student results</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Results',
            value: summary?.totalResults || 0,
            color: 'text-white',
          },
          {
            label: 'Passed',
            value: summary?.passedResults || 0,
            color: 'text-green-400',
          },
          {
            label: 'Failed',
            value: summary?.failedResults || 0,
            color: 'text-red-400',
          },
          {
            label: 'Pass Rate',
            value: `${summary?.passRate || 0}%`,
            color: 'text-purple-400',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color} mt-1`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">
            Grade Distribution
          </h2>
          <div className="space-y-2">
            {gradeDistribution?.map(g => {
              const percent =
                summary?.totalResults > 0
                  ? (g.count / summary.totalResults) * 100
                  : 0;
              const color =
                g._id === 'F'
                  ? 'bg-red-500'
                  : g._id === 'A+' || g._id === 'A'
                    ? 'bg-green-500'
                    : 'bg-blue-500';
              return (
                <div key={g._id}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Grade {g._id}</span>
                    <span className="text-white">
                      {g.count} ({percent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">
            Department-wise Performance
          </h2>
          <div className="space-y-3">
            {deptPerformance?.map(dept => (
              <div
                key={dept._id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{dept.deptName}</p>
                  <p className="text-gray-400 text-sm">Avg: {dept.avgMarks}%</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-medium ${dept.passRate >= 70 ? 'text-green-400' : 'text-yellow-400'}`}
                  >
                    {dept.passRate.toFixed(0)}%
                  </span>
                  <p className="text-gray-500 text-xs">
                    {dept.passed}/{dept.total} passed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Results
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-2 text-left text-gray-400">Student</th>
                <th className="px-4 py-2 text-left text-gray-400">Course</th>
                <th className="px-4 py-2 text-left text-gray-400">Marks</th>
                <th className="px-4 py-2 text-left text-gray-400">Grade</th>
                <th className="px-4 py-2 text-left text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentResults?.map(r => (
                <tr key={r._id} className="border-b border-white/5">
                  <td className="px-4 py-2 text-white">
                    {r.student?.studentId}
                  </td>
                  <td className="px-4 py-2 text-gray-300">{r.course?.code}</td>
                  <td className="px-4 py-2 text-white">{r.marks}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`font-bold ${r.grade === 'F' ? 'text-red-400' : 'text-green-400'}`}
                    >
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${r.status === 'passed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;
