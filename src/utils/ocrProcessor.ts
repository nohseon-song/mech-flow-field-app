
import type { OCRResult } from './ocr/types';
import { advancedImagePreprocessing } from './ocr/imagePreprocessing';
import { performRealOCR } from './ocr/ocrEngine';
import { calculateTextConfidence } from './ocr/confidenceCalculation';

export type { OCRResult } from './ocr/types';

export const extractTextFromImage = async (imageFile: File): Promise<OCRResult> => {
  return new Promise((resolve, reject) => {
    // 10초 타임아웃 설정
    const timeout = setTimeout(() => {
      reject(new Error('텍스트 추출에 실패하였습니다. 이미지 품질을 개선하여 다시 시도해 주세요.'));
    }, 10000);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        console.log('이미지 로드 완료:', { width: img.width, height: img.height });
        
        // 이미지 데이터 추출
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          clearTimeout(timeout);
          throw new Error('이미지 데이터를 가져올 수 없습니다.');
        }

        // 고급 이미지 전처리 (장비 화면 최적화)
        const processedData = advancedImagePreprocessing(imageData);
        
        // 실제 텍스트 추출 (향상된 알고리즘)
        const extractedText = performRealOCR(processedData, canvas.width, canvas.height);
        
        // 신뢰도 계산
        const confidence = calculateTextConfidence(extractedText, processedData);
        
        console.log('최종 OCR 결과:', { extractedText, confidence });
        
        // 타임아웃 해제
        clearTimeout(timeout);
        
        // 결과 반환
        const finalText = extractedText && extractedText.trim() 
          ? extractedText 
          : "이 이미지에는 추출 가능한 텍스트가 없습니다.";
          
        resolve({
          extractedText: finalText,
          confidence
        });
        
      } catch (error) {
        clearTimeout(timeout);
        console.error('이미지 처리 오류:', error);
        reject(new Error('이미지 처리 중 오류가 발생했습니다.'));
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('이미지를 로드할 수 없습니다.'));
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
};
