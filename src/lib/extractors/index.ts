/**
 * Text Extraction Service
 *
 * Orchestrates text extraction from various file types.
 * Supports PDF, DOCX, PPTX, images (OCR), and plain text files.
 */

import { extractTextFromPDF, type PDFExtractionResult } from './pdf.extractor';
import { extractTextFromDOCX, type DOCXExtractionResult } from './docx.extractor';
import { extractTextFromPPTX, type PPTXExtractionResult } from './pptx.extractor';
import { extractTextFromImage, type OCRExtractionResult } from './image.extractor';
import { extractTextFromTextFile, type TextExtractionResult } from './text.extractor';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ExtractionResult {
  text: string;
  success: boolean;
  error?: string;
  metadata?: {
    pageCount?: number;
    slideCount?: number;
    confidence?: number;
    [key: string]: any;
  };
}

export interface BatchExtractionResult {
  results: Map<string, ExtractionResult>;
  totalFiles: number;
  successCount: number;
  failureCount: number;
}

export interface ExtractionOptions {
  onProgress?: (fileIndex: number, progress: number, total: number) => void;
  onFileComplete?: (fileName: string, result: ExtractionResult) => void;
  ocrLanguage?: string;
  maxPDFPages?: number;
}

// ============================================================================
// Main Extraction Functions
// ============================================================================

/**
 * Extract text from a file based on its MIME type
 * @param file - File to extract text from
 * @param options - Extraction options
 * @returns Extraction result
 */
export async function extractText(
  file: File,
  options: ExtractionOptions = {}
): Promise<ExtractionResult> {
  try {
    const mimeType = file.type;

    // PDF files
    if (mimeType === 'application/pdf') {
      const result = await extractTextFromPDF(file, {
        maxPages: options.maxPDFPages,
        onProgress: progress => options.onProgress?.(0, progress, 1),
      });

      return {
        text: result.text,
        success: true,
        metadata: {
          pageCount: result.pageCount,
          ...result.metadata,
        },
      };
    }

    // Word documents (.docx)
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      const result = await extractTextFromDOCX(file);

      return {
        text: result.text,
        success: true,
        metadata: {
          warnings: result.messages.length > 0 ? result.messages : undefined,
        },
      };
    }

    // PowerPoint presentations (.pptx)
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      mimeType === 'application/vnd.ms-powerpoint'
    ) {
      const result = await extractTextFromPPTX(file);

      return {
        text: result.text,
        success: true,
        metadata: {
          slideCount: result.slideCount,
        },
      };
    }

    // Images (OCR)
    if (mimeType.startsWith('image/')) {
      const result = await extractTextFromImage(file, {
        lang: options.ocrLanguage || 'eng',
        onProgress: progress => options.onProgress?.(0, progress, 1),
      });

      return {
        text: result.text,
        success: true,
        metadata: {
          confidence: result.confidence,
          ocrUsed: true,
        },
      };
    }

    // Plain text files
    if (mimeType === 'text/plain' || mimeType.startsWith('text/')) {
      const result = await extractTextFromTextFile(file);

      return {
        text: result.text,
        success: true,
        metadata: {
          encoding: result.encoding,
        },
      };
    }

    // Unsupported file type
    return {
      text: '',
      success: false,
      error: `Unsupported file type: ${mimeType}`,
    };
  } catch (error) {
    console.error(`Error extracting text from ${file.name}:`, error);

    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Extract text from multiple files (batch processing)
 * @param files - Array of files to extract text from (max 10)
 * @param options - Extraction options
 * @returns Batch extraction results
 */
export async function extractTextBatch(
  files: File[],
  options: ExtractionOptions = {}
): Promise<BatchExtractionResult> {
  // Limit to 10 files
  const filesToProcess = files.slice(0, 10);
  const results = new Map<string, ExtractionResult>();

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < filesToProcess.length; i++) {
    const file = filesToProcess[i];

    try {
      const result = await extractText(file, {
        ...options,
        onProgress: (_, progress) => {
          options.onProgress?.(i, progress, filesToProcess.length);
        },
      });

      results.set(file.name, result);

      if (result.success) {
        successCount++;
      } else {
        failureCount++;
      }

      options.onFileComplete?.(file.name, result);
    } catch (error) {
      const result: ExtractionResult = {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      results.set(file.name, result);
      failureCount++;

      options.onFileComplete?.(file.name, result);
    }
  }

  return {
    results,
    totalFiles: filesToProcess.length,
    successCount,
    failureCount,
  };
}

/**
 * Check if text extraction is supported for a file
 * @param file - File to check
 * @returns True if extraction is supported
 */
export function isExtractionSupported(file: File): boolean {
  const mimeType = file.type;

  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'text/plain',
  ];

  // Check exact mime types
  if (supportedTypes.includes(mimeType)) {
    return true;
  }

  // Check image types
  if (mimeType.startsWith('image/')) {
    return true;
  }

  // Check generic text types
  if (mimeType.startsWith('text/')) {
    return true;
  }

  return false;
}

/**
 * Get extraction method for a file
 * @param file - File to check
 * @returns Extraction method name
 */
export function getExtractionMethod(file: File): string {
  const mimeType = file.type;

  if (mimeType === 'application/pdf') return 'PDF.js';
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return 'Mammoth';
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mimeType === 'application/vnd.ms-powerpoint'
  ) {
    return 'PizZip';
  }
  if (mimeType.startsWith('image/')) return 'Tesseract OCR';
  if (mimeType.startsWith('text/')) return 'Plain Text';

  return 'Unknown';
}

/**
 * Estimate extraction time for a file (in seconds)
 * @param file - File to estimate
 * @returns Estimated time in seconds
 */
export function estimateExtractionTime(file: File): number {
  const mimeType = file.type;
  const sizeInMB = file.size / (1024 * 1024);

  // PDF: ~2 seconds per MB
  if (mimeType === 'application/pdf') {
    return Math.max(2, Math.round(sizeInMB * 2));
  }

  // Word/PowerPoint: ~1 second per MB
  if (mimeType.includes('wordprocessingml') || mimeType.includes('presentationml')) {
    return Math.max(1, Math.round(sizeInMB));
  }

  // Images (OCR): ~5 seconds per MB (slower due to OCR)
  if (mimeType.startsWith('image/')) {
    return Math.max(3, Math.round(sizeInMB * 5));
  }

  // Text files: ~0.5 seconds per MB (fast)
  if (mimeType.startsWith('text/')) {
    return Math.max(1, Math.round(sizeInMB * 0.5));
  }

  return 2; // Default estimate
}
