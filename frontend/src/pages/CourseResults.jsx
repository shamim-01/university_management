import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const CourseResults = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    passRate: 0,
    avgMarks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course details
        const courseRes = await api.get(`/courses/${courseId}`);
        setCourse(courseRes.data.data);

        // Fetch course results
        const resultsRes = await api.get(`/results/course/${courseId}`);
        const data = resultsRes.data?.data || [];
        setResults(data);

        // Calculate stats
        const total = data.length;
        const passed = data.filter(r => r.status === 'passed').length;
        const failed = data.filter(r => r.status === 'failed').length;
        const avgMarks =
          total > 0 ? data.reduce((sum, r) => sum + r.marks, 0) / total : 0;
        setStats({
          total,
          passed,
          failed,
          passRate: total > 0 ? (passed / total) * 100 : 0,
          avgMarks: avgMarks.toFixed(1),
        });
      } catch (err) {
        setError('Failed to load course data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading course results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center p-8">{error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        to="/results/all"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Results
      </Link>

      {/* Course Info */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{course?.name}</h1>
            <p className="text-gray-400">Code: {course?.code}</p>
            <p className="text-gray-400 text-sm">
              Department: {course?.department?.name || 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Pass Rate</p>
            <p className="text-3xl font-bold text-green-400">
              {stats.passRate.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Students', value: stats.total, color: 'text-white' },
          { label: 'Passed', value: stats.passed, color: 'text-green-400' },
          { label: 'Failed', value: stats.failed, color: 'text-red-400' },
          {
            label: 'Average Marks',
            value: stats.avgMarks,
            color: 'text-blue-400',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-white/5 rounded-xl p-4 border border-white/5 text-center"
          >
            <p className="text-gray-400 text-xs uppercase">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Results Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase">
                  Marks
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium text-xs uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.map(r => (
                <tr key={r._id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 text-white">
                    {r.student?.user?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {r.student?.studentId || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-white font-semibold">
                    {r.marks}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${
                        r.grade === 'F'
                          ? 'text-red-400'
                          : r.grade === 'A+' || r.grade === 'A'
                            ? 'text-green-400'
                            : 'text-blue-400'
                      }`}
                    >
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.status === 'passed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
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

export default CourseResults;
