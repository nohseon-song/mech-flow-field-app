
const GOOGLE_API_KEY = 'AIzaSyBgvOOeArqdsQFHD6zfAmjyLCptdKXRezc';

export interface AdvancedAnalysisResult {
  currentStatus: string;
  rootCause: string;
  improvementSolution: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  timestamp: string;
}

// Google Vision OCR 호출
export const performGoogleVisionOCR = async (imageFile: File): Promise<string> => {
  try {
    const base64Image = await fileToBase64(imageFile);
    const base64Data = base64Image.split(',')[1]; // Remove data:image/... prefix

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Data
          },
          features: [{
            type: 'TEXT_DETECTION',
            maxResults: 10
          }]
        }]
      })
    });

    const result = await response.json();
    
    if (result.responses && result.responses[0].textAnnotations) {
      return result.responses[0].textAnnotations[0].description || '';
    }
    
    return '';
  } catch (error) {
    console.error('Google Vision OCR Error:', error);
    throw new Error('OCR 처리 중 오류가 발생했습니다.');
  }
};

// GPT를 이용한 전문 공학적 분석
export const performAdvancedAnalysis = async (
  referenceText: string,
  measurementText: string,
  equipmentName: string,
  location: string
): Promise<AdvancedAnalysisResult> => {
  const engineeringPrompt = `
당신은 현장 설비 진단 전문가입니다. 아래 데이터를 분석하여 전문적인 진단 결과를 제공해주세요.

설비정보:
- 설비명칭: ${equipmentName}
- 설치위치: ${location}

기준값 데이터: ${referenceText}
측정값 데이터: ${measurementText}

다음 형태로 분석 결과를 제공해주세요:

1. 현재 상태: (정상/주의/위험 중 하나와 상세 설명)
2. 발생 원인: (기술적 원인 분석)
3. 개선 솔루션: (구체적인 조치 방안)
4. 위험도: (low/medium/high)
5. 권장사항: (예방 정비 및 모니터링 방안)

전문적이고 실용적인 분석을 해주세요.
  `;

  try {
    // 실제 환경에서는 OpenAI API 키가 필요합니다
    // 여기서는 시뮬레이션된 분석 결과를 반환합니다
    const simulatedAnalysis: AdvancedAnalysisResult = {
      currentStatus: '주의 - 측정값이 기준값 대비 편차를 보이고 있습니다',
      rootCause: '센서 드리프트 또는 환경 조건 변화로 인한 측정값 변동',
      improvementSolution: '센서 재보정 실시 및 환경 조건 점검 필요',
      riskLevel: 'medium',
      recommendations: [
        '주 1회 정기 점검 실시',
        '센서 보정 주기 단축 검토',
        '환경 모니터링 강화'
      ],
      timestamp: new Date().toISOString()
    };

    return simulatedAnalysis;
  } catch (error) {
    console.error('Advanced Analysis Error:', error);
    throw new Error('고급 분석 처리 중 오류가 발생했습니다.');
  }
};

// 파일을 Base64로 변환
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
