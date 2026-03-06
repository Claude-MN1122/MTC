import React, { useState, useEffect } from 'react';
import { FiAward, FiAlertCircle, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { getAcademicPerformanceAnalytics } from '../../services/analyticsApi';
import type { AcademicPerformance } from '../../services/analyticsApi';

export const AcademicPerformancePanel: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<AcademicPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerformanceAnalytics = async () => {
      try {
        const data = await getAcademicPerformanceAnalytics({ semester: 'current' });
        setPerformanceData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load academic performance analytics');
      } finally {
        setLoading(false);
      }
    };

    loadPerformanceAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700">
        <FiAlertCircle className="inline mr-2" />
        {error}
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="text-text-500 text-center py-12">
        No academic performance data available
      </div>
    );
  }

  const getGPAPerformanceColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-success-600 bg-success-50';
    if (gpa >= 3.0) return 'text-blue-600 bg-blue-50';
    if (gpa >= 2.5) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };

  const getGPARangeColor = (range: string) => {
    if (range.includes('3.5') || range.includes('4.0')) return 'bg-success-500';
    if (range.includes('3.0')) return 'bg-blue-500';
    if (range.includes('2.0')) return 'bg-warning-500';
    return 'bg-error-500';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Average GPA</h3>
            <FiAward className="text-white/80" />
          </div>
          <div className="text-4xl font-bold mb-2">{performanceData.average_gpa.toFixed(2)}</div>
          <div className="text-sm opacity-90">System-wide average</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium opacity-90">Top Performers</h3>
            <FiTrendingUp className="text-white/80" />
          </div>
          <div className="text-4xl font-bold mb-2">{performanceData.top_performers.length}</div>
          <div className="text-sm opacity-90">Students with GPA ≥ 3.5</div>
        </div>
      </div>

      {/* GPA Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4">GPA Distribution</h3>
        <div className="space-y-4">
          {performanceData.gpa_distribution.map((range) => (
            <div key={range.range} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-700">{range.range}</span>
                <span className="text-sm text-text-500">
                  {range.count} students ({range.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-bg-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getGPARangeColor(range.range)}`}
                  style={{ width: `${range.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-text-900 mb-4 flex items-center">
          <FiAward className="mr-2 text-yellow-500" />
          Top Performing Students
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                  Student Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-500 uppercase tracking-wider">
                  GPA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-200">
              {performanceData.top_performers.slice(0, 10).map((student, index) => (
                <tr key={student.student_number} className="hover:bg-bg-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-900">{student.full_name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-text-500">{student.student_number}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGPAPerformanceColor(student.gpa)}`}>
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* At-Risk Students */}
      {performanceData.at_risk_students.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-text-900 mb-4 flex items-center">
            <FiAlertCircle className="mr-2 text-error-500" />
            Students Requiring Academic Support
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-error-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-error-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-error-700 uppercase tracking-wider">
                    Student Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-error-700 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-error-700 uppercase tracking-wider">
                    Failed Subjects
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-200">
                {performanceData.at_risk_students.slice(0, 10).map((student) => (
                  <tr key={student.student_number} className="hover:bg-bg-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-900">{student.full_name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-text-500">{student.student_number}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error-700">
                        {student.gpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-error-100 text-error-700">
                        {student.failed_subjects}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-text-500">
            Showing {Math.min(performanceData.at_risk_students.length, 10)} of {performanceData.at_risk_students.length} at-risk students
          </div>
        </div>
      )}
    </div>
  );
};
