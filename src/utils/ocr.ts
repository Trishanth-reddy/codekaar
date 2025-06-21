import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

export class OCRService {
  private static instance: OCRService;
  private worker: Tesseract.Worker | null = null;

  private constructor() {}

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  async initialize(): Promise<void> {
    if (this.worker) return;

    this.worker = await Tesseract.createWorker('eng+tel', 1, {
      logger: m => console.log(m)
    });

    await this.worker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:-/()అఆఇఈఉఊఋఌఎఏఐఒఓఔకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరలవశషసహళక్షజ్ఞ',
    });
  }

  async extractText(imageFile: File | string, language: 'eng' | 'tel' | 'eng+tel' = 'eng+tel'): Promise<OCRResult> {
    if (!this.worker) {
      await this.initialize();
    }

    try {
      const { data } = await this.worker!.recognize(imageFile);
      
      return {
        text: this.cleanText(data.text),
        confidence: data.confidence,
        words: data.words.map(word => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox
        }))
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  private cleanText(text: string): string {
    // Auto-correct common OCR errors
    const corrections: { [key: string]: string } = {
      '0': 'O', // Zero to O in names
      '1': 'I', // One to I in names
      '5': 'S', // Five to S
      '8': 'B', // Eight to B
      '@': 'a',
      '|': 'l',
      '!': 'i',
      '()': 'o',
      '[]': 'o',
      '{}': 'o'
    };

    let cleanedText = text;
    
    // Apply corrections
    Object.entries(corrections).forEach(([wrong, correct]) => {
      cleanedText = cleanedText.replace(new RegExp(wrong, 'g'), correct);
    });

    // Remove extra whitespace
    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    
    // Fix common Telugu OCR issues
    cleanedText = cleanedText.replace(/[్]+/g, '్'); // Multiple halants to single
    cleanedText = cleanedText.replace(/\u200C+/g, ''); // Remove zero-width non-joiners
    
    return cleanedText;
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const ocrService = OCRService.getInstance();