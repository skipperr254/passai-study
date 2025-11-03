/**
 * PowerPoint (PPTX) Text Extraction Utility
 *
 * Uses pizzip to extract text from PowerPoint presentations.
 */

import PizZip from 'pizzip';

export interface PPTXExtractionResult {
  text: string;
  slideCount: number;
}

/**
 * Extract text from a PowerPoint presentation (PPTX)
 * @param file - PPTX file to extract text from
 * @returns Extracted text and slide count
 */
export async function extractTextFromPPTX(file: File): Promise<PPTXExtractionResult> {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PPTX file with PizZip
    const zip = new PizZip(arrayBuffer);

    // Get list of slides
    const slideFiles = Object.keys(zip.files).filter(filename =>
      filename.match(/ppt\/slides\/slide\d+\.xml/)
    );

    const slideTexts: string[] = [];

    // Extract text from each slide
    for (const slideFile of slideFiles) {
      try {
        const slideXML = zip.file(slideFile)?.asText();
        if (slideXML) {
          // Extract text from XML (between <a:t> tags)
          const textMatches = slideXML.match(/<a:t[^>]*>([^<]+)<\/a:t>/g);

          if (textMatches) {
            const slideText = textMatches
              .map(match => {
                const text = match.replace(/<a:t[^>]*>|<\/a:t>/g, '');
                return text.trim();
              })
              .filter(text => text.length > 0)
              .join(' ');

            if (slideText) {
              slideTexts.push(slideText);
            }
          }
        }
      } catch (err) {
        console.error(`Error extracting slide ${slideFile}:`, err);
        // Continue with other slides
      }
    }

    return {
      text: slideTexts.join('\n\n'),
      slideCount: slideFiles.length,
    };
  } catch (error) {
    console.error('Error extracting text from PPTX:', error);
    throw new Error(
      `Failed to extract text from PowerPoint: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get slide count from a PowerPoint file
 * @param file - PPTX file
 * @returns Number of slides
 */
export async function getPPTXSlideCount(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = new PizZip(arrayBuffer);

    const slideFiles = Object.keys(zip.files).filter(filename =>
      filename.match(/ppt\/slides\/slide\d+\.xml/)
    );

    return slideFiles.length;
  } catch (error) {
    console.error('Error getting PPTX slide count:', error);
    return 0;
  }
}
