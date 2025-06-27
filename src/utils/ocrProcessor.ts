
import type { OCRResult } from './ocr/types';
import { extractTextWithGoogleVision } from './ocr/googleVisionOCR';

export type { OCRResult } from './ocr/types';

export const extractTextFromImage = async (imageFile: File): Promise<OCRResult> => {
  console.log('Google Vision API를 사용한 텍스트 추출 시작:', imageFile.name);

  try {
    // Google Vision API로 텍스트 추출
    const result = await extractTextWithGoogleVision(imageFile);
    
    console.log('Google Vision OCR 최종 결과:', result);
    
    return {
      extractedText: result.extractedText,
      confidence: result.confidence
    };
    
  } catch (error) {
    console.error('Google Vision OCR 처리 오류:', error);
    
    // 오류 발생 시 기본 메시지 반환
    return {
      extractedText: error instanceof Error ? error.message : "처리 실패: 이미지 품질을 개선해 주세요.",
      confidence: 0
    };
  }
};
