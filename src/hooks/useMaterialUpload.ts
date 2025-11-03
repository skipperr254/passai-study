import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  uploadMaterialWithExtraction,
  uploadMultipleMaterials,
  type UploadMaterialOptions,
  type UploadMaterialResult,
} from '@/services/materials-with-extraction.service';
import { useMaterials } from './useMaterials';

// ============================================================================
// Types
// ============================================================================

export interface FileUploadState {
  file: File;
  status: 'pending' | 'uploading' | 'extracting' | 'completed' | 'error';
  progress: number;
  statusMessage: string;
  result?: UploadMaterialResult;
  error?: string;
}

export interface UseMaterialUploadReturn {
  // State
  uploads: Map<string, FileUploadState>;
  isUploading: boolean;

  // Actions
  uploadFile: (subjectId: string, file: File, options?: UploadMaterialOptions) => Promise<void>;
  uploadFiles: (subjectId: string, files: File[]) => Promise<void>;
  cancelUpload: (fileId: string) => void;
  clearUploads: () => void;
  removeUpload: (fileId: string) => void;

  // Statistics
  stats: {
    total: number;
    pending: number;
    uploading: number;
    extracting: number;
    completed: number;
    failed: number;
    overallProgress: number;
  };
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for uploading materials with text extraction
 * Provides upload progress tracking, status updates, and batch processing
 *
 * @param userId - The authenticated user's ID
 * @returns Upload state and actions
 *
 * @example
 * ```tsx
 * const { uploadFile, uploads, stats } = useMaterialUpload(userId);
 *
 * const handleUpload = async (file: File) => {
 *   await uploadFile(subjectId, file);
 * };
 *
 * // Display progress
 * Array.from(uploads.values()).map(upload => (
 *   <div key={upload.file.name}>
 *     {upload.file.name}: {upload.progress}% - {upload.statusMessage}
 *   </div>
 * ))
 * ```
 */
export function useMaterialUpload(userId: string): UseMaterialUploadReturn {
  const [uploads, setUploads] = useState<Map<string, FileUploadState>>(new Map());
  const { fetchMaterials } = useMaterials(userId);

  // Generate unique file ID
  const getFileId = useCallback((file: File) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }, []);

  // Update a specific upload's state
  const updateUpload = useCallback((fileId: string, updates: Partial<FileUploadState>) => {
    setUploads(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(fileId);
      if (current) {
        newMap.set(fileId, { ...current, ...updates });
      }
      return newMap;
    });
  }, []);

  // Upload a single file
  const uploadFile = useCallback(
    async (subjectId: string, file: File, options: UploadMaterialOptions = {}) => {
      const fileId = getFileId(file);

      // Add to upload queue
      setUploads(prev => {
        const newMap = new Map(prev);
        newMap.set(fileId, {
          file,
          status: 'pending',
          progress: 0,
          statusMessage: 'Pending...',
        });
        return newMap;
      });

      try {
        // Start upload with progress tracking
        updateUpload(fileId, { status: 'uploading', statusMessage: 'Uploading...' });

        const result = await uploadMaterialWithExtraction(userId, subjectId, file, {
          ...options,
          onUploadProgress: progress => {
            if (progress < 50) {
              updateUpload(fileId, {
                status: 'uploading',
                progress,
                statusMessage: `Uploading... ${Math.round(progress)}%`,
              });
            }
            options.onUploadProgress?.(progress);
          },
          onExtractionProgress: progress => {
            updateUpload(fileId, {
              status: 'extracting',
              progress: 50 + progress / 2,
              statusMessage: `Extracting text... ${Math.round(progress)}%`,
            });
            options.onExtractionProgress?.(progress);
          },
          onStatusChange: status => {
            updateUpload(fileId, { statusMessage: status });
            options.onStatusChange?.(status);
          },
        });

        // Update with result
        if (result.extractionSuccess || !result.extractionError) {
          updateUpload(fileId, {
            status: 'completed',
            progress: 100,
            statusMessage: 'Completed!',
            result,
          });
          toast.success(`${file.name} uploaded successfully!`);
        } else {
          updateUpload(fileId, {
            status: 'error',
            progress: 100,
            statusMessage: 'Upload completed, but text extraction failed',
            error: result.extractionError,
            result,
          });
          toast.error(`${file.name}: Upload completed, but text extraction failed`);
        }

        // Refresh materials list
        await fetchMaterials();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updateUpload(fileId, {
          status: 'error',
          progress: 0,
          statusMessage: 'Failed',
          error: errorMessage,
        });
        toast.error(`${file.name}: ${errorMessage}`);
        console.error('Upload error:', error);
      }
    },
    [userId, getFileId, updateUpload, fetchMaterials]
  );

  // Upload multiple files
  const uploadFiles = useCallback(
    async (subjectId: string, files: File[]) => {
      // Limit to 10 files
      const filesToUpload = files.slice(0, 10);

      // Initialize all files in upload queue
      setUploads(prev => {
        const newMap = new Map(prev);
        filesToUpload.forEach(file => {
          const fileId = getFileId(file);
          newMap.set(fileId, {
            file,
            status: 'pending',
            progress: 0,
            statusMessage: 'Pending...',
          });
        });
        return newMap;
      });

      try {
        // Upload with batch processing
        await uploadMultipleMaterials(userId, subjectId, filesToUpload, {
          maxConcurrency: 3,
          onFileProgress: (fileIndex, progress) => {
            const file = filesToUpload[fileIndex];
            const fileId = getFileId(file);

            let status: FileUploadState['status'];
            let statusMessage: string;

            if (progress < 50) {
              status = 'uploading';
              statusMessage = `Uploading... ${Math.round(progress)}%`;
            } else {
              status = 'extracting';
              statusMessage = `Extracting text... ${Math.round(progress)}%`;
            }

            updateUpload(fileId, { status, progress, statusMessage });
          },
          onFileStatusChange: (fileIndex, status) => {
            const file = filesToUpload[fileIndex];
            const fileId = getFileId(file);
            updateUpload(fileId, { statusMessage: status });
          },
          onFileComplete: (fileIndex, result) => {
            const file = filesToUpload[fileIndex];
            const fileId = getFileId(file);

            if (result.extractionSuccess || !result.extractionError) {
              updateUpload(fileId, {
                status: 'completed',
                progress: 100,
                statusMessage: 'Completed!',
                result,
              });
            } else {
              updateUpload(fileId, {
                status: 'error',
                progress: 100,
                statusMessage: 'Upload completed, but text extraction failed',
                error: result.extractionError,
                result,
              });
            }
          },
          onFileError: (fileIndex, error) => {
            const file = filesToUpload[fileIndex];
            const fileId = getFileId(file);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            updateUpload(fileId, {
              status: 'error',
              progress: 0,
              statusMessage: 'Failed',
              error: errorMessage,
            });
          },
        });

        // Refresh materials list
        await fetchMaterials();
      } catch (error) {
        console.error('Batch upload error:', error);
      }
    },
    [userId, getFileId, updateUpload, fetchMaterials]
  );

  // Cancel upload (currently just marks as cancelled, actual cancellation would require AbortController)
  const cancelUpload = useCallback(
    (fileId: string) => {
      updateUpload(fileId, {
        status: 'error',
        statusMessage: 'Cancelled',
        error: 'Upload cancelled by user',
      });
    },
    [updateUpload]
  );

  // Clear all uploads
  const clearUploads = useCallback(() => {
    setUploads(new Map());
  }, []);

  // Remove specific upload
  const removeUpload = useCallback((fileId: string) => {
    setUploads(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileId);
      return newMap;
    });
  }, []);

  // Calculate statistics
  const stats = {
    total: uploads.size,
    pending: Array.from(uploads.values()).filter(u => u.status === 'pending').length,
    uploading: Array.from(uploads.values()).filter(u => u.status === 'uploading').length,
    extracting: Array.from(uploads.values()).filter(u => u.status === 'extracting').length,
    completed: Array.from(uploads.values()).filter(u => u.status === 'completed').length,
    failed: Array.from(uploads.values()).filter(u => u.status === 'error').length,
    overallProgress:
      uploads.size > 0
        ? Array.from(uploads.values()).reduce((sum, u) => sum + u.progress, 0) / uploads.size
        : 0,
  };

  const isUploading = stats.uploading > 0 || stats.extracting > 0 || stats.pending > 0;

  return {
    uploads,
    isUploading,
    uploadFile,
    uploadFiles,
    cancelUpload,
    clearUploads,
    removeUpload,
    stats,
  };
}
