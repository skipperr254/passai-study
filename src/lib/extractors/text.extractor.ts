/**
 * Text File Extraction Utility
 *
 * Simple extraction for plain text files.
 */

export interface TextExtractionResult {
  text: string;
  encoding: string;
}

/**
 * Extract text from a plain text file
 * @param file - Text file to read
 * @returns Extracted text
 */
export async function extractTextFromTextFile(file: File): Promise<TextExtractionResult> {
  try {
    // Read file as text
    const text = await file.text();

    return {
      text: text.trim(),
      encoding: 'UTF-8',
    };
  } catch (error) {
    console.error('Error extracting text from text file:', error);
    throw new Error(
      `Failed to extract text from file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Detect if a file is a text file based on content
 * @param file - File to check
 * @returns True if file appears to be text
 */
export async function isTextFile(file: File): Promise<boolean> {
  try {
    // Read first 512 bytes
    const slice = file.slice(0, 512);
    const arrayBuffer = await slice.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Check for null bytes (binary indicator)
    for (let i = 0; i < uint8Array.length; i++) {
      if (uint8Array[i] === 0) {
        return false;
      }
    }

    // Check if most bytes are printable ASCII or UTF-8
    let printableCount = 0;
    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i];
      if (
        (byte >= 32 && byte <= 126) || // Printable ASCII
        byte === 9 || // Tab
        byte === 10 || // Line feed
        byte === 13 || // Carriage return
        byte >= 128 // UTF-8 multibyte
      ) {
        printableCount++;
      }
    }

    // If more than 95% are printable, consider it text
    return printableCount / uint8Array.length > 0.95;
  } catch (error) {
    return false;
  }
}
