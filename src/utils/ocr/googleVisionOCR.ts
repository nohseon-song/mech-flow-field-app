
// Google Vision API를 사용한 OCR 처리기
export interface GoogleVisionOCRResult {
  extractedText: string;
  confidence: number;
}

const GOOGLE_VISION_API_KEY = "AIzaSyC7AEM1EzlPI1H3ohXCOh8Yim2Ps-2yaXM";

export const extractTextWithGoogleVision = async (imageFile: File): Promise<GoogleVisionOCRResult> => {
  return new Promise((resolve, reject) => {
    // 15초 타임아웃 설정
    const timeout = setTimeout(() => {
      reject(new Error('처리 실패: 이미지 품질을 개선해 주세요.'));
    }, 15000);

    console.log('Google Vision API를 사용한 OCR 시작:', imageFile.name);

    // 이미지를 Base64로 변환
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Image = (reader.result as string).split(',')[1];
        
        console.log('이미지 Base64 변환 완료, Google Vision API 호출 중...');

        // Google Vision API 호출
        const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                    maxResults: 50
                  }
                ],
                imageContext: {
                  languageHints: ['ko', 'en'] // 한글, 영어 우선 처리
                }
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`Google Vision API 오류: ${response.status}`);
        }

        const result = await response.json();
        console.log('Google Vision API 응답:', result);

        // 타임아웃 해제
        clearTimeout(timeout);

        // 응답 처리
        if (result.responses && result.responses[0]) {
          const annotations = result.responses[0].textAnnotations;
          
          if (annotations && annotations.length > 0) {
            // 전체 텍스트 추출 (첫 번째 annotation이 전체 텍스트)
            const fullText = annotations[0].description || '';
            
            // 개별 텍스트들의 신뢰도 계산
            let totalConfidence = 0;
            let confidenceCount = 0;
            
            annotations.slice(1).forEach((annotation: any) => {
              if (annotation.confidence) {
                totalConfidence += annotation.confidence;
                confidenceCount++;
              }
            });
            
            const averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0.8;
            
            console.log('Google Vision OCR 결과:', {
              extractedText: fullText,
              confidence: averageConfidence,
              totalAnnotations: annotations.length
            });

            resolve({
              extractedText: fullText.trim() || "이 이미지에는 추출 가능한 텍스트가 없습니다.",
              confidence: averageConfidence
            });
          } else {
            // 텍스트가 감지되지 않은 경우
            console.log('Google Vision API에서 텍스트를 감지하지 못함');
            resolve({
              extractedText: "이 이미지에는 추출 가능한 텍스트가 없습니다.",
              confidence: 0
            });
          }
        } else {
          throw new Error('Google Vision API 응답 형식 오류');
        }

      } catch (error) {
        clearTimeout(timeout);
        console.error('Google Vision OCR 오류:', error);
        reject(new Error('처리 실패: 이미지 품질을 개선해 주세요.'));
      }
    };

    reader.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('이미지 파일을 읽을 수 없습니다.'));
    };

    reader.readAsDataURL(imageFile);
  });
};
