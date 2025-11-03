/**
 * PDF Text Extraction Utility
 *
 * Uses pdfjs-dist to extract text from PDF files.
 * Uses local worker file to avoid CDN issues.
 */

import * as pdfjsLib from 'pdfjs-dist';

import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set worker source
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/wasm/openjpeg_nowasm_fallback.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// Type definition for PDF metadata
interface PDFMetadata {
  Title?: string;
  Author?: string;
  Subject?: string;
  Creator?: string;
  Producer?: string;
  CreationDate?: string;
  ModDate?: string;
}

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  };
}

export interface PDFExtractionOptions {
  maxPages?: number;
  onProgress?: (progress: number) => void;
}

/**
 * Extract text from a PDF file
 * @param file - PDF file to extract text from
 * @param options - Extraction options
 * @returns Extracted text and metadata
 */
export async function extractTextFromPDF(
  file: File,
  options: PDFExtractionOptions = {}
): Promise<PDFExtractionResult> {
  const { maxPages, onProgress } = options;

  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const totalPages = maxPages ? Math.min(pdf.numPages, maxPages) : pdf.numPages;

    // Extract metadata
    const metadata = await pdf.getMetadata().catch(() => ({ info: {} }));
    const info = metadata.info || {};

    // Extract text from each page
    const textByPage: string[] = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Concatenate text items
      const pageText = textContent.items
        .map(item => ('str' in item ? item.str : ''))
        .join(' ')
        .trim();

      if (pageText) {
        textByPage.push(pageText);
      }

      // Report progress
      onProgress?.(Math.round((pageNum / totalPages) * 100));

      // Cleanup
      page.cleanup();
    }

    const pdfInfo = info as PDFMetadata;
    return {
      text: textByPage.join('\n\n'),
      pageCount: pdf.numPages,
      metadata: {
        title: pdfInfo.Title || undefined,
        author: pdfInfo.Author || undefined,
        subject: pdfInfo.Subject || undefined,
        creator: pdfInfo.Creator || undefined,
      },
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract text from a specific page range in a PDF
 * @param file - PDF file
 * @param startPage - Starting page (1-indexed)
 * @param endPage - Ending page (1-indexed)
 * @returns Extracted text
 */
export async function extractTextFromPDFRange(
  file: File,
  startPage: number,
  endPage: number
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    const textByPage: string[] = [];

    const start = Math.max(1, startPage);
    const end = Math.min(pdf.numPages, endPage);

    for (let pageNum = start; pageNum <= end; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map(item => ('str' in item ? item.str : ''))
        .join(' ')
        .trim();

      if (pageText) {
        textByPage.push(`[Page ${pageNum}]\n${pageText}`);
      }

      page.cleanup();
    }

    return textByPage.join('\n\n');
  } catch (error) {
    console.error('Error extracting text from PDF range:', error);
    throw new Error('Failed to extract text from PDF range');
  }
}

/**
 * Get page count from a PDF file
 * @param file - PDF file
 * @returns Number of pages
 */
export async function getPDFPageCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
    });

    const pdf = await loadingTask.promise;
    return pdf.numPages;
  } catch (error) {
    console.error('Error getting PDF page count:', error);
    return 0;
  }
}
