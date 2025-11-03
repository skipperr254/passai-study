import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getMaterialsBySubject,
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  uploadFile,
  downloadFile,
  getFileUrl,
  type CreateMaterialDto,
  type UpdateMaterialDto,
} from '@/services/materials.service';
import type { Material } from '@/types/material';

/**
 * Hook for managing materials for a specific subject
 * @param subjectId - Optional subject ID to filter materials
 */
export function useMaterials(subjectId?: string) {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch materials (filtered by subject or all)
   */
  const fetchMaterials = useCallback(async () => {
    if (!user?.id) {
      setMaterials([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = subjectId
        ? await getMaterialsBySubject(user.id, subjectId)
        : await getAllMaterials(user.id);

      setMaterials(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch materials';
      setError(message);
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, subjectId]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  /**
   * Create a new material record after upload
   */
  const addMaterial = async (dto: CreateMaterialDto): Promise<Material | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const newMaterial = await createMaterial(user.id, dto);
      setMaterials(prev => [newMaterial, ...prev]);
      return newMaterial;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create material';
      setError(message);
      console.error('Error creating material:', err);
      return null;
    }
  };

  /**
   * Update material metadata
   */
  const editMaterial = async (
    materialId: string,
    dto: UpdateMaterialDto
  ): Promise<Material | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const updatedMaterial = await updateMaterial(materialId, user.id, dto);
      setMaterials(prev =>
        prev.map(material => (material.id === materialId ? updatedMaterial : material))
      );
      return updatedMaterial;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update material';
      setError(message);
      console.error('Error updating material:', err);
      return null;
    }
  };

  /**
   * Delete a material and its file
   */
  const removeMaterial = async (materialId: string): Promise<boolean> => {
    if (!user?.id) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      await deleteMaterial(materialId, user.id);
      setMaterials(prev => prev.filter(material => material.id !== materialId));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete material';
      setError(message);
      console.error('Error deleting material:', err);
      return false;
    }
  };

  /**
   * Get a single material by ID
   */
  const getMaterial = async (materialId: string): Promise<Material | null> => {
    if (!user?.id) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      return await getMaterialById(materialId, user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch material';
      setError(message);
      console.error('Error fetching material:', err);
      return null;
    }
  };

  /**
   * Download a material file
   */
  const downloadMaterial = async (material: Material): Promise<void> => {
    try {
      setError(null);
      const blob = await downloadFile(material.filePath);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = material.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download material';
      setError(message);
      console.error('Error downloading material:', err);
    }
  };

  /**
   * Get public URL for a material (for preview)
   */
  const getMaterialUrl = async (material: Material): Promise<string | null> => {
    try {
      setError(null);
      return await getFileUrl(material.filePath);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get material URL';
      setError(message);
      console.error('Error getting material URL:', err);
      return null;
    }
  };

  return {
    materials,
    loading,
    error,
    fetchMaterials,
    addMaterial,
    editMaterial,
    removeMaterial,
    getMaterial,
    downloadMaterial,
    getMaterialUrl,
  };
}
