/**
 * Image OCR Text Extraction Utility
 *
 * Uses tesseract.js to extract text from images via OCR.
 */

import Tesseract from 'tesseract.js';

export interface OCRExtractionResult {
  text: string;
  confidence: number;
}

export interface OCROptions {
  lang?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Extract text from an image using OCR
 * @param file - Image file (JPEG, PNG, etc.)
 * @param options - OCR options
 * @returns Extracted text and confidence
 */
export async function extractTextFromImage(
  file: File,
  options: OCROptions = {}
): Promise<OCRExtractionResult> {
  const { lang = 'eng', onProgress } = options;

  try {
    // Create a worker
    const worker = await Tesseract.createWorker(lang, 1, {
      logger: m => {
        // Report progress
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });

    // Recognize text
    const {
      data: { text, confidence },
    } = await worker.recognize(file);

    // Terminate worker
    await worker.terminate();

    return {
      text: text.trim(),
      confidence,
    };
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error(
      `Failed to extract text from image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract text from multiple images
 * @param files - Array of image files
 * @param options - OCR options
 * @returns Array of extraction results
 */
export async function extractTextFromImages(
  files: File[],
  options: OCROptions = {}
): Promise<OCRExtractionResult[]> {
  const results: OCRExtractionResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      const result = await extractTextFromImage(file, {
        ...options,
        onProgress: progress => {
          // Calculate overall progress
          const overallProgress = (i / files.length) * 100 + progress / files.length;
          options.onProgress?.(Math.round(overallProgress));
        },
      });

      results.push(result);
    } catch (error) {
      console.error(`Error extracting text from image ${file.name}:`, error);
      // Continue with other images
      results.push({
        text: '',
        confidence: 0,
      });
    }
  }

  return results;
}

/**
 * Check if OCR is available for a language
 * @param lang - Language code (e.g., 'eng', 'spa', 'fra')
 * @returns True if language is supported
 */
export function isOCRLanguageSupported(lang: string): boolean {
  // Common languages supported by Tesseract.js
  const supportedLanguages = [
    'afr',
    'amh',
    'ara',
    'asm',
    'aze',
    'aze_cyrl',
    'bel',
    'ben',
    'bod',
    'bos',
    'bre',
    'bul',
    'cat',
    'ceb',
    'ces',
    'chi_sim',
    'chi_tra',
    'chr',
    'cos',
    'cym',
    'dan',
    'deu',
    'div',
    'dzo',
    'ell',
    'eng',
    'enm',
    'epo',
    'equ',
    'est',
    'eus',
    'fao',
    'fas',
    'fil',
    'fin',
    'fra',
    'frk',
    'frm',
    'fry',
    'gla',
    'gle',
    'glg',
    'grc',
    'guj',
    'hat',
    'heb',
    'hin',
    'hrv',
    'hun',
    'hye',
    'iku',
    'ind',
    'isl',
    'ita',
    'ita_old',
    'jav',
    'jpn',
    'kan',
    'kat',
    'kat_old',
    'kaz',
    'khm',
    'kir',
    'kmr',
    'kor',
    'kor_vert',
    'lao',
    'lat',
    'lav',
    'lit',
    'ltz',
    'mal',
    'mar',
    'mkd',
    'mlt',
    'mon',
    'mri',
    'msa',
    'mya',
    'nep',
    'nld',
    'nor',
    'oci',
    'ori',
    'osd',
    'pan',
    'pol',
    'por',
    'pus',
    'que',
    'ron',
    'rus',
    'san',
    'sin',
    'slk',
    'slv',
    'snd',
    'spa',
    'spa_old',
    'sqi',
    'srp',
    'srp_latn',
    'sun',
    'swa',
    'swe',
    'syr',
    'tam',
    'tat',
    'tel',
    'tgk',
    'tha',
    'tir',
    'ton',
    'tur',
    'uig',
    'ukr',
    'urd',
    'uzb',
    'uzb_cyrl',
    'vie',
    'yid',
    'yor',
  ];

  return supportedLanguages.includes(lang);
}
