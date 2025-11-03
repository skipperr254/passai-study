import { supabase } from '@/lib/supabase';
import type { Material } from '@/types/material';
import {
  createMaterial as createMaterialBase,
  uploadFile,
  updateMaterial,
  type CreateMaterialDto,
} from './materials.service';
import { extractText, isExtractionSupported } from '@/lib/extractors';
import type { ExtractionOptions } from '@/lib/extractors';

// ============================================================================
// Enhanced Upload with Text Extraction
// ============================================================================

/**
 * Options for uploading materials with text extraction
 */
export interface UploadMaterialOptions {
  /** Progress callback for file upload (0-50%) */
  onUploadProgress?: (progress: number) => void;
  /** Progress callback for text extraction (50-100%) */
  onExtractionProgress?: (progress: number) => void;
  /** Overall status updates */
  onStatusChange?: (status: string) => void;
  /** Extraction options */
  extractionOptions?: ExtractionOptions;
}

/**
 * Result of material upload with extraction
 */
export interface UploadMaterialResult {
  material: Material;
  extractionSuccess: boolean;
  extractionError?: string;
  extractedTextLength?: number;
  metadata?: {
    pageCount?: number;
    slideCount?: number;
    confidence?: number;
    duration?: number;
  };
}

/**
 * Upload a file and extract text from it
 * This is the main function to use for uploading materials
 *
 * Flow:
 * 1. Upload file to storage (0-40% progress)
 * 2. Create material record with status='processing' (40-50%)
 * 3. Extract text from file (50-90%)
 * 4. Update material with extracted text (90-100%)
 *
 * @param userId - The authenticated user's ID
 * @param subjectId - The subject ID
 * @param file - The file to upload
 * @param options - Upload and extraction options
 * @returns Upload result with material and extraction status
 */
export async function uploadMaterialWithExtraction(
  userId: string,
  subjectId: string,
  file: File,
  options: UploadMaterialOptions = {}
): Promise<UploadMaterialResult> {
  const {
    onUploadProgress,
    onExtractionProgress,
    onStatusChange,
    extractionOptions = {},
  } = options;

  try {
    // Step 1: Upload file to storage (0-40%)
    onStatusChange?.('Uploading file...');
    onUploadProgress?.(0);

    const uploadResult = await uploadFile(file, userId, subjectId);
    onUploadProgress?.(40);

    // Step 2: Create material record (40-50%)
    onStatusChange?.('Creating material record...');

    const materialDto: CreateMaterialDto = {
      subjectId,
      name: file.name,
      filePath: uploadResult.path,
      fileSize: file.size,
      fileType: detectMaterialType(file),
      mimeType: file.type || 'application/octet-stream',
    };

    const material = await createMaterialBase(userId, materialDto);
    onUploadProgress?.(50);

    // Step 3: Extract text if supported (50-90%)
    let extractionSuccess = false;
    let extractionError: string | undefined;
    let extractedTextLength: number | undefined;
    let metadata: UploadMaterialResult['metadata'] | undefined;

    if (isExtractionSupported(file)) {
      onStatusChange?.('Extracting text...');
      onExtractionProgress?.(0);

      try {
        const extractionResult = await extractText(file, {
          ...extractionOptions,
          onProgress: progress => {
            // Map extraction progress to 50-90% range
            const mappedProgress = 50 + (progress * 40) / 100;
            onExtractionProgress?.(progress);
            onUploadProgress?.(mappedProgress);
          },
        });

        if (extractionResult.success && extractionResult.text) {
          extractionSuccess = true;
          extractedTextLength = extractionResult.text.length;

          // Extract metadata from result
          metadata = {
            pageCount: extractionResult.metadata?.pageCount,
            slideCount: extractionResult.metadata?.slideCount,
            confidence: extractionResult.metadata?.confidence,
            duration: extractionResult.metadata?.duration,
          };

          // Step 4: Update material with extracted text (90-100%)
          onStatusChange?.('Saving extracted text...');
          await updateMaterial(material.id, userId, {
            extractedText: extractionResult.text,
            status: 'completed',
            processedAt: new Date().toISOString(),
            pageCount: metadata.pageCount,
            durationSeconds: metadata.duration,
          });

          onUploadProgress?.(100);
          onExtractionProgress?.(100);
          onStatusChange?.('Upload complete!');
        } else {
          // Extraction failed but file uploaded successfully
          extractionError = extractionResult.error || 'Unknown extraction error';
          await updateMaterial(material.id, userId, {
            status: 'failed',
            processedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        extractionError = error instanceof Error ? error.message : 'Unknown error';
        console.error('Text extraction error:', error);

        // Mark material as failed
        await updateMaterial(material.id, userId, {
          status: 'failed',
          processedAt: new Date().toISOString(),
        });
      }
    } else {
      // File type doesn't support text extraction - mark as completed
      onStatusChange?.('Upload complete (no text extraction available)');
      await updateMaterial(material.id, userId, {
        status: 'completed',
        processedAt: new Date().toISOString(),
      });
      onUploadProgress?.(100);
      extractionSuccess = true; // Not an error, just not supported
    }

    // Fetch updated material
    const { data: updatedMaterial } = await supabase
      .from('materials')
      .select('*')
      .eq('id', material.id)
      .single();

    return {
      material: updatedMaterial ? mapMaterialFromDb(updatedMaterial) : material,
      extractionSuccess,
      extractionError,
      extractedTextLength,
      metadata,
    };
  } catch (error) {
    console.error('Upload material error:', error);
    throw error;
  }
}

/**
 * Upload multiple materials with text extraction
 * Processes files in parallel with a maximum concurrency limit
 *
 * @param userId - The authenticated user's ID
 * @param subjectId - The subject ID
 * @param files - Array of files to upload (max 10)
 * @param options - Upload options with per-file callbacks
 * @returns Array of upload results
 */
export async function uploadMultipleMaterials(
  userId: string,
  subjectId: string,
  files: File[],
  options: {
    onFileProgress?: (fileIndex: number, progress: number) => void;
    onFileStatusChange?: (fileIndex: number, status: string) => void;
    onFileComplete?: (fileIndex: number, result: UploadMaterialResult) => void;
    onFileError?: (fileIndex: number, error: Error) => void;
    maxConcurrency?: number;
  } = {}
): Promise<UploadMaterialResult[]> {
  const {
    maxConcurrency = 3,
    onFileProgress,
    onFileStatusChange,
    onFileComplete,
    onFileError,
  } = options;

  // Limit to 10 files as per requirements
  const filesToProcess = files.slice(0, 10);
  const results: UploadMaterialResult[] = [];
  const errors: Error[] = [];

  // Process files with concurrency limit
  for (let i = 0; i < filesToProcess.length; i += maxConcurrency) {
    const batch = filesToProcess.slice(i, i + maxConcurrency);
    const batchPromises = batch.map((file, batchIndex) => {
      const fileIndex = i + batchIndex;

      return uploadMaterialWithExtraction(userId, subjectId, file, {
        onUploadProgress: progress => onFileProgress?.(fileIndex, progress),
        onStatusChange: status => onFileStatusChange?.(fileIndex, status),
      })
        .then(result => {
          onFileComplete?.(fileIndex, result);
          return result;
        })
        .catch(error => {
          onFileError?.(fileIndex, error);
          errors.push(error);
          return null;
        });
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter((r): r is UploadMaterialResult => r !== null));
  }

  return results;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Map database row to Material type
 */
interface MaterialDbRow {
  id: string;
  user_id: string;
  subject_id: string;
  name: string;
  file_path: string;
  file_size: number;
  type: Material['fileType'];
  mime_type: string;
  status: Material['status'];
  thumbnail_url: string | null;
  page_count: number | null;
  duration_seconds: number | null;
  extracted_text: string | null;
  uploaded_at: string;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapMaterialFromDb(row: MaterialDbRow): Material {
  return {
    id: row.id,
    userId: row.user_id,
    subjectId: row.subject_id,
    name: row.name,
    filePath: row.file_path,
    fileSize: row.file_size,
    fileType: row.type,
    mimeType: row.mime_type,
    status: row.status,
    thumbnailUrl: row.thumbnail_url,
    pageCount: row.page_count,
    durationSeconds: row.duration_seconds,
    extractedText: row.extracted_text,
    uploadedAt: row.uploaded_at,
    processedAt: row.processed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Detect material type from file
 */
function detectMaterialType(file: File): Material['fileType'] {
  const mimeType = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // PDFs
  if (mimeType.includes('pdf') || extension === 'pdf') {
    return 'pdf';
  }

  // Word documents
  if (
    mimeType.includes('word') ||
    mimeType.includes('document') ||
    ['doc', 'docx'].includes(extension)
  ) {
    return 'document';
  }

  // PowerPoint presentations
  if (
    mimeType.includes('presentation') ||
    mimeType.includes('powerpoint') ||
    ['ppt', 'pptx'].includes(extension)
  ) {
    return 'presentation';
  }

  // Images
  if (
    mimeType.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)
  ) {
    return 'image';
  }

  // Videos
  if (
    mimeType.startsWith('video/') ||
    ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension)
  ) {
    return 'video';
  }

  // Audio
  if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
    return 'audio';
  }

  // Text files
  if (
    mimeType.startsWith('text/') ||
    ['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts'].includes(extension)
  ) {
    return 'text';
  }

  // Default to other
  return 'other';
}
