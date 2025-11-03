/**
 * File Upload Utilities
 *
 * Provides reusable utilities for file upload operations with:
 * - Progress tracking
 * - Chunked uploads for large files
 * - Upload cancellation
 * - Retry logic
 * - File validation
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  signal?: AbortSignal;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// ============================================================================
// File Validation
// ============================================================================

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const;

const MIME_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG Image',
  'image/png': 'PNG Image',
  'image/gif': 'GIF Image',
  'image/webp': 'WebP Image',
  'video/mp4': 'MP4 Video',
  'video/webm': 'WebM Video',
  'video/quicktime': 'QuickTime Video',
  'application/msword': 'Word Document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  'text/plain': 'Text File',
};

/**
 * Validate a file before upload
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 50MB limit. Your file is ${formatFileSize(file.size)}.`,
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please select a valid file.',
    };
  }

  // Check MIME type
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
    const allowedTypes = Array.from(new Set(Object.values(MIME_TYPE_LABELS))).join(', ');
    return {
      valid: false,
      error: `File type "${file.type}" is not supported. Allowed types: ${allowedTypes}`,
    };
  }

  return { valid: true };
}

/**
 * Validate multiple files
 * @param files - Files to validate
 * @returns Array of validation results
 */
export function validateFiles(files: File[]): FileValidationResult[] {
  return files.map(validateFile);
}

// ============================================================================
// File Size Utilities
// ============================================================================

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Calculate total size of multiple files
 * @param files - Array of files
 * @returns Total size in bytes
 */
export function calculateTotalSize(files: File[]): number {
  return files.reduce((total, file) => total + file.size, 0);
}

// ============================================================================
// File Name Utilities
// ============================================================================

/**
 * Sanitize file name to prevent security issues
 * @param fileName - Original file name
 * @returns Sanitized file name
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars
    .replace(/_{2,}/g, '_') // Remove multiple underscores
    .replace(/^[._-]+|[._-]+$/g, '') // Remove leading/trailing special chars
    .slice(0, 255); // Limit length
}

/**
 * Extract file extension
 * @param fileName - File name
 * @returns File extension (without dot)
 */
export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Get file name without extension
 * @param fileName - File name
 * @returns Name without extension
 */
export function getFileNameWithoutExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
}

// ============================================================================
// File Type Detection
// ============================================================================

/**
 * Get file type category from MIME type
 * @param mimeType - File MIME type
 * @returns Category (pdf, video, image, document, notes)
 */
export function getFileCategory(
  mimeType: string
): 'pdf' | 'video' | 'image' | 'document' | 'notes' {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('document') || mimeType.includes('word') || mimeType === 'text/plain') {
    return 'document';
  }
  return 'notes';
}

/**
 * Get icon for file type
 * @param mimeType - File MIME type
 * @returns Icon name (from lucide-react)
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'FileText';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.includes('word')) return 'FileType';
  if (mimeType === 'text/plain') return 'FileText';
  return 'File';
}

/**
 * Get color for file type (Tailwind CSS classes)
 * @param mimeType - File MIME type
 * @returns Object with background and text color classes
 */
export function getFileColor(mimeType: string): {
  bg: string;
  text: string;
} {
  if (mimeType === 'application/pdf') {
    return { bg: 'bg-red-100', text: 'text-red-600' };
  }
  if (mimeType.startsWith('video/')) {
    return { bg: 'bg-purple-100', text: 'text-purple-600' };
  }
  if (mimeType.startsWith('image/')) {
    return { bg: 'bg-blue-100', text: 'text-blue-600' };
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return { bg: 'bg-blue-100', text: 'text-blue-600' };
  }
  if (mimeType === 'text/plain') {
    return { bg: 'bg-gray-100', text: 'text-gray-600' };
  }
  return { bg: 'bg-slate-100', text: 'text-slate-600' };
}

// ============================================================================
// Progress Calculation
// ============================================================================

/**
 * Calculate upload progress percentage
 * @param loaded - Bytes uploaded
 * @param total - Total bytes
 * @returns Percentage (0-100)
 */
export function calculateProgress(loaded: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((loaded / total) * 100);
}

/**
 * Estimate remaining time for upload
 * @param loaded - Bytes uploaded
 * @param total - Total bytes
 * @param elapsedTime - Time elapsed in milliseconds
 * @returns Estimated remaining time in seconds
 */
export function estimateRemainingTime(loaded: number, total: number, elapsedTime: number): number {
  if (loaded === 0 || elapsedTime === 0) return 0;

  const bytesPerMs = loaded / elapsedTime;
  const remainingBytes = total - loaded;
  const remainingMs = remainingBytes / bytesPerMs;

  return Math.round(remainingMs / 1000); // Convert to seconds
}

/**
 * Format time in human-readable format
 * @param seconds - Time in seconds
 * @returns Formatted string (e.g., "2m 30s")
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

// ============================================================================
// File Reading Utilities
// ============================================================================

/**
 * Read file as data URL (for preview)
 * @param file - File to read
 * @returns Promise with data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Read file as text
 * @param file - File to read
 * @returns Promise with file text content
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Create a thumbnail from an image file
 * @param file - Image file
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Promise with thumbnail data URL
 */
export async function createImageThumbnail(
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// Drag & Drop Utilities
// ============================================================================

/**
 * Extract files from drag event
 * @param event - Drag event
 * @returns Array of files
 */
export async function extractFilesFromDragEvent(event: DragEvent): Promise<File[]> {
  const files: File[] = [];

  if (event.dataTransfer?.items) {
    // Use DataTransferItemList interface
    for (let i = 0; i < event.dataTransfer.items.length; i++) {
      const item = event.dataTransfer.items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
  } else if (event.dataTransfer?.files) {
    // Fallback to DataTransferFile interface
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      files.push(event.dataTransfer.files[i]);
    }
  }

  return files;
}
