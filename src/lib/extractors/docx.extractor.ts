/**
 * Word Document (DOCX) Text Extraction Utility
 *
 * Uses mammoth to extract text from Word documents.
 */

import mammoth from 'mammoth';

export interface DOCXExtractionResult {
  text: string;
  messages: string[];
}

/**
 * Extract text from a Word document (DOCX)
 * @param file - DOCX file to extract text from
 * @returns Extracted text
 */
export async function extractTextFromDOCX(file: File): Promise<DOCXExtractionResult> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Extract text using mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });

    return {
      text: result.value.trim(),
      messages: result.messages.map(msg => msg.message),
    };
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error(
      `Failed to extract text from Word document: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract text with HTML formatting from a Word document
 * @param file - DOCX file
 * @returns HTML content
 */
export async function extractHTMLFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.convertToHtml({ arrayBuffer });

    return result.value;
  } catch (error) {
    console.error('Error extracting HTML from DOCX:', error);
    throw new Error('Failed to extract HTML from Word document');
  }
}
