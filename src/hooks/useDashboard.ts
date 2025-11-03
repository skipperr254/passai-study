import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useSubjects } from './useSubjects';
import {
  getDashboardStats,
  getSubjectPerformance,
  getRecentActivity,
  getProgressData,
  type DashboardStats,
  type SubjectPerformance,
  type RecentActivity,
  type ProgressData,
} from '@/services/dashboard.service';

export function useDashboard(subjectId?: string) {
  const { user } = useAuth();
  const { subjects } = useSubjects();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [statsData, activityData, progressChartData] = await Promise.all([
        getDashboardStats(user.id),
        getRecentActivity(user.id),
        getProgressData(user.id, subjectId, 10),
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
      setProgressData(progressChartData);

      // Fetch subject performance after subjects are loaded
      if (subjects.length > 0) {
        const performanceData = await getSubjectPerformance(user.id, subjects);
        setSubjectPerformance(performanceData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, subjects, subjectId]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refresh dashboard data
  const refresh = useCallback(() => {
    return fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    subjectPerformance,
    recentActivity,
    progressData,
    loading,
    error,
    refresh,
  };
}
