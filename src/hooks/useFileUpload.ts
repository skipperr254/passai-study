import { useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { uploadFile, detectMaterialType } from '@/services/materials.service';
import { validateFile, formatFileSize } from '@/lib/upload.utils';
import type { Material } from '@/types/material';

/**
 * Upload state for a single file
 */
export interface FileUploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  material?: Material;
}

/**
 * Options for file upload
 */
export interface UseFileUploadOptions {
  subjectId: string;
  onSuccess?: (material: Material) => void;
  onError?: (error: Error) => void;
  onProgress?: (fileId: string, progress: number) => void;
}

/**
 * Hook for managing file uploads with progress tracking
 */
export function useFileUpload(options: UseFileUploadOptions) {
  const { user } = useAuth();
  const { subjectId, onSuccess, onError, onProgress } = options;

  const [uploads, setUploads] = useState<Map<string, FileUploadState>>(new Map());
  const [isUploading, setIsUploading] = useState(false);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  /**
   * Generate unique ID for file
   */
  const generateFileId = useCallback((file: File): string => {
    return `${file.name}-${file.size}-${Date.now()}`;
  }, []);

  /**
   * Add files to upload queue
   */
  const addFiles = useCallback(
    (files: File[]): void => {
      setUploads(prev => {
        const newUploads = new Map(prev);

        files.forEach(file => {
          const fileId = generateFileId(file);
          const validation = validateFile(file);

          if (!validation.valid) {
            newUploads.set(fileId, {
              file,
              progress: 0,
              status: 'error',
              error: validation.error,
            });
          } else {
            newUploads.set(fileId, {
              file,
              progress: 0,
              status: 'pending',
            });
          }
        });

        return newUploads;
      });
    },
    [generateFileId]
  );

  /**
   * Update upload progress
   */
  const updateProgress = useCallback(
    (fileId: string, progress: number) => {
      setUploads(prev => {
        const newUploads = new Map(prev);
        const upload = newUploads.get(fileId);

        if (upload) {
          newUploads.set(fileId, {
            ...upload,
            progress,
          });
        }

        return newUploads;
      });

      onProgress?.(fileId, progress);
    },
    [onProgress]
  );

  /**
   * Update upload status
   */
  const updateStatus = useCallback(
    (
      fileId: string,
      status: FileUploadState['status'],
      data?: {
        error?: string;
        material?: Material;
      }
    ) => {
      setUploads(prev => {
        const newUploads = new Map(prev);
        const upload = newUploads.get(fileId);

        if (upload) {
          newUploads.set(fileId, {
            ...upload,
            status,
            error: data?.error,
            material: data?.material,
          });
        }

        return newUploads;
      });
    },
    []
  );

  /**
   * Upload a single file
   */
  const uploadSingleFile = useCallback(
    async (
      fileId: string,
      file: File,
      createMaterial: (dto: {
        subjectId: string;
        name: string;
        filePath: string;
        fileSize: number;
        fileType: string;
        mimeType: string;
      }) => Promise<Material | null>
    ): Promise<void> => {
      if (!user?.id) {
        updateStatus(fileId, 'error', {
          error: 'User not authenticated',
        });
        return;
      }

      try {
        // Update status to uploading
        updateStatus(fileId, 'uploading');
        updateProgress(fileId, 10);

        // Upload file to storage
        const uploadResult = await uploadFile(file, user.id, subjectId);
        updateProgress(fileId, 60);

        // Create material record in database
        updateStatus(fileId, 'processing');
        const material = await createMaterial({
          subjectId,
          name: file.name,
          filePath: uploadResult.path,
          fileSize: file.size,
          fileType: detectMaterialType(file.type),
          mimeType: file.type,
        });

        if (!material) {
          throw new Error('Failed to create material record');
        }

        updateProgress(fileId, 100);
        updateStatus(fileId, 'completed', { material });

        onSuccess?.(material);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed');
        updateStatus(fileId, 'error', {
          error: error.message,
        });
        onError?.(error);
      }
    },
    [user?.id, subjectId, updateStatus, updateProgress, onSuccess, onError]
  );

  /**
   * Start uploading all pending files
   */
  const startUpload = useCallback(
    async (
      createMaterial: (dto: {
        subjectId: string;
        name: string;
        filePath: string;
        fileSize: number;
        fileType: string;
        mimeType: string;
      }) => Promise<Material | null>
    ): Promise<void> => {
      setIsUploading(true);

      try {
        const uploadPromises: Promise<void>[] = [];

        uploads.forEach((upload, fileId) => {
          if (upload.status === 'pending') {
            uploadPromises.push(uploadSingleFile(fileId, upload.file, createMaterial));
          }
        });

        await Promise.all(uploadPromises);
      } finally {
        setIsUploading(false);
      }
    },
    [uploads, uploadSingleFile]
  );

  /**
   * Cancel an upload
   */
  const cancelUpload = useCallback(
    (fileId: string): void => {
      const controller = abortControllersRef.current.get(fileId);
      controller?.abort();
      abortControllersRef.current.delete(fileId);

      updateStatus(fileId, 'error', {
        error: 'Upload cancelled',
      });
    },
    [updateStatus]
  );

  /**
   * Remove a file from the upload queue
   */
  const removeFile = useCallback(
    (fileId: string): void => {
      cancelUpload(fileId);

      setUploads(prev => {
        const newUploads = new Map(prev);
        newUploads.delete(fileId);
        return newUploads;
      });
    },
    [cancelUpload]
  );

  /**
   * Clear all completed or failed uploads
   */
  const clearCompleted = useCallback((): void => {
    setUploads(prev => {
      const newUploads = new Map(prev);

      prev.forEach((upload, fileId) => {
        if (upload.status === 'completed' || upload.status === 'error') {
          newUploads.delete(fileId);
        }
      });

      return newUploads;
    });
  }, []);

  /**
   * Clear all uploads
   */
  const clearAll = useCallback((): void => {
    // Cancel all active uploads
    abortControllersRef.current.forEach(controller => controller.abort());
    abortControllersRef.current.clear();

    setUploads(new Map());
  }, []);

  /**
   * Get upload statistics
   */
  const getStats = useCallback(() => {
    const stats = {
      total: uploads.size,
      pending: 0,
      uploading: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      totalSize: 0,
      uploadedSize: 0,
    };

    uploads.forEach(upload => {
      stats.totalSize += upload.file.size;
      stats.uploadedSize += (upload.file.size * upload.progress) / 100;

      switch (upload.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'uploading':
          stats.uploading++;
          break;
        case 'processing':
          stats.processing++;
          break;
        case 'completed':
          stats.completed++;
          break;
        case 'error':
          stats.failed++;
          break;
      }
    });

    return {
      ...stats,
      totalSizeFormatted: formatFileSize(stats.totalSize),
      uploadedSizeFormatted: formatFileSize(stats.uploadedSize),
      overallProgress:
        stats.total > 0 ? Math.round((stats.uploadedSize / stats.totalSize) * 100) : 0,
    };
  }, [uploads]);

  return {
    uploads: Array.from(uploads.entries()).map(([id, state]) => ({
      id,
      ...state,
    })),
    isUploading,
    addFiles,
    startUpload,
    cancelUpload,
    removeFile,
    clearCompleted,
    clearAll,
    getStats: getStats(),
  };
}
