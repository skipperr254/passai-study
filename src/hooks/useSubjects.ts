import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStats,
  type CreateSubjectDto,
  type UpdateSubjectDto,
} from '@/services/subjects.service';
import type { Subject } from '@/types/subject';

export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all subjects
  const fetchSubjects = useCallback(async () => {
    if (!user?.id) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getSubjects(user.id);
      setSubjects(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subjects';
      setError(message);
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load subjects on mount
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Create a new subject
  const addSubject = async (dto: CreateSubjectDto): Promise<Subject | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const newSubject = await createSubject(user.id, dto);
      setSubjects(prev => [newSubject, ...prev]);
      return newSubject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create subject';
      setError(message);
      console.error('Error creating subject:', err);
      return null;
    }
  };

  // Update an existing subject
  const editSubject = async (subjectId: string, dto: UpdateSubjectDto): Promise<Subject | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const updatedSubject = await updateSubject(subjectId, user.id, dto);
      setSubjects(prev =>
        prev.map(subject => (subject.id === subjectId ? updatedSubject : subject))
      );
      return updatedSubject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update subject';
      setError(message);
      console.error('Error updating subject:', err);
      return null;
    }
  };

  // Delete a subject
  const removeSubject = async (subjectId: string): Promise<boolean> => {
    if (!user?.id) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      await deleteSubject(subjectId, user.id);
      setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete subject';
      setError(message);
      console.error('Error deleting subject:', err);
      return false;
    }
  };

  // Get a single subject by ID
  const getSubject = async (subjectId: string): Promise<Subject | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      return await getSubjectById(subjectId, user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subject';
      setError(message);
      console.error('Error fetching subject:', err);
      return null;
    }
  };

  // Get subject statistics
  const getStats = async (subjectId: string) => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      return await getSubjectStats(subjectId, user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch subject stats';
      setError(message);
      console.error('Error fetching subject stats:', err);
      return null;
    }
  };

  // Fetch subjects with stats
  const fetchSubjectsWithStats = useCallback(async () => {
    if (!user?.id) {
      return [];
    }

    try {
      const subjectsData = await getSubjects(user.id);

      // Fetch stats for each subject in parallel
      const subjectsWithStats = await Promise.all(
        subjectsData.map(async subject => {
          const stats = await getSubjectStats(subject.id, user.id);
          return {
            ...subject,
            totalMaterials: stats.totalMaterials,
            totalQuizzes: stats.totalQuizzes,
            hoursStudied: stats.hoursStudied,
          };
        })
      );

      return subjectsWithStats;
    } catch (err) {
      console.error('Error fetching subjects with stats:', err);
      return [];
    }
  }, [user?.id]);

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    fetchSubjectsWithStats,
    addSubject,
    editSubject,
    removeSubject,
    getSubject,
    getStats,
  };
}
