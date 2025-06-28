
const GOOGLE_API_KEY = 'AIzaSyBgvOOeArqdsQFHD6zfAmjyLCptdKXRezc';

export interface AdvancedAnalysisResult {
  currentStatus: string;
  rootCause: string;
  improvementSolution: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  timestamp: string;
  equipmentName?: string;
  location?: string;
}

// Google Vision OCR 호출
export const performGoogleVisionOCR = async (imageFile: File): Promise<string> => {
  try {
    console.log('Google Vision OCR 시작:', imageFile.name);
    
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

    if (!response.ok) {
      throw new Error(`Google Vision API 오류: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Google Vision API 응답:', result);
    
    if (result.responses && result.responses[0].textAnnotations && result.responses[0].textAnnotations.length > 0) {
      const extractedText = result.responses[0].textAnnotations[0].description || '';
      console.log('추출된 텍스트:', extractedText);
      return extractedText;
    }
    
    console.warn('Google Vision API에서 텍스트를 찾지 못함');
    return '';
  } catch (error) {
    console.error('Google Vision OCR 오류:', error);
    throw new Error(`OCR 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

// GPT를 이용한 전문 공학적 분석 (시뮬레이션)
export const performAdvancedAnalysis = async (
  referenceText: string,
  measurementText: string,
  equipmentName: string,
  location: string
): Promise<AdvancedAnalysisResult> => {
  console.log('AI 분석 시작:', {
    equipmentName,
    location,
    referenceLength: referenceText.length,
    measurementLength: measurementText.length
  });

  // 실제 프로덕션에서는 OpenAI API를 사용하겠지만,
  // 여기서는 분석 로직을 기반으로 한 시뮬레이션을 제공합니다.
  
  try {
    // 텍스트에서 수치 데이터 추출 및 분석
    const analysisResult = await analyzeEquipmentData(referenceText, measurementText, equipmentName, location);
    
    console.log('AI 분석 완료:', analysisResult);
    return analysisResult;
    
  } catch (error) {
    console.error('AI 분석 오류:', error);
    throw new Error(`고급 분석 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};

// 설비 데이터 분석 로직
const analyzeEquipmentData = async (
  referenceText: string,
  measurementText: string,
  equipmentName: string,
  location: string
): Promise<AdvancedAnalysisResult> => {
  
  // 수치 데이터 추출
  const refNumbers = extractNumbers(referenceText);
  const measNumbers = extractNumbers(measurementText);
  
  console.log('추출된 수치:', { refNumbers, measNumbers });
  
  // 편차 계산
  const deviations = calculateDeviations(refNumbers, measNumbers);
  
  // 위험도 평가
  const riskLevel = assessRiskLevel(deviations);
  
  // 상태 분석
  const statusAnalysis = analyzeStatus(referenceText, measurementText, deviations);
  
  const result: AdvancedAnalysisResult = {
    currentStatus: statusAnalysis.currentStatus,
    rootCause: statusAnalysis.rootCause,
    improvementSolution: statusAnalysis.improvementSolution,
    riskLevel: riskLevel,
    recommendations: statusAnalysis.recommendations,
    timestamp: new Date().toISOString(),
    equipmentName,
    location
  };
  
  return result;
};

// 텍스트에서 수치 추출
const extractNumbers = (text: string): { [key: string]: number } => {
  const numbers: { [key: string]: number } = {};
  
  // Flow 값 추출 (m3/h)
  const flowMatch = text.match(/Flow\s*(\d+\.?\d*)\s*m3\/h/i);
  if (flowMatch) {
    numbers.flow = parseFloat(flowMatch[1]);
  }
  
  // Velocity 값 추출 (m/s)
  const velocityMatch = text.match(/(?:Vel|Velocity)\s*(\d+\.?\d*)\s*m\/s/i);
  if (velocityMatch) {
    numbers.velocity = parseFloat(velocityMatch[1]);
  }
  
  // Volume 값 추출 (m3)
  const volumeMatch = text.match(/[+\-]?(\d+)\s*m3/i);
  if (volumeMatch) {
    numbers.volume = parseInt(volumeMatch[1]);
  }
  
  // Signal 값들 추출
  const signalSMatch = text.match(/S=(\d+,?\d*)/i);
  if (signalSMatch) {
    numbers.signalS = parseFloat(signalSMatch[1].replace(',', ''));
  }
  
  const signalQMatch = text.match(/Q[=\-](\d+)/i);
  if (signalQMatch) {
    numbers.signalQ = parseInt(signalQMatch[1]);
  }
  
  return numbers;
};

// 편차 계산
const calculateDeviations = (refNumbers: { [key: string]: number }, measNumbers: { [key: string]: number }) => {
  const deviations: { [key: string]: number } = {};
  
  for (const key in refNumbers) {
    if (measNumbers[key] !== undefined) {
      const deviation = ((measNumbers[key] - refNumbers[key]) / refNumbers[key]) * 100;
      deviations[key] = deviation;
    }
  }
  
  return deviations;
};

// 위험도 평가
const assessRiskLevel = (deviations: { [key: string]: number }): 'low' | 'medium' | 'high' => {
  const maxDeviation = Math.max(...Object.values(deviations).map(Math.abs));
  
  if (maxDeviation > 15) return 'high';
  if (maxDeviation > 8) return 'medium';
  return 'low';
};

// 상태 분석
const analyzeStatus = (referenceText: string, measurementText: string, deviations: { [key: string]: number }) => {
  const hasSignificantDeviation = Object.values(deviations).some(dev => Math.abs(dev) > 5);
  const maxDeviation = Math.max(...Object.values(deviations).map(Math.abs));
  
  let currentStatus = '정상 - 설비가 정상 범위 내에서 작동하고 있습니다';
  let rootCause = '측정값이 기준값 범위 내에 있어 특별한 문제가 없습니다';
  let improvementSolution = '현재 상태를 유지하고 정기적인 모니터링을 지속하세요';
  let recommendations = [
    '주기적인 성능 점검 실시',
    '운전 조건 모니터링 강화',
    '예방 정비 계획 수립'
  ];
  
  if (hasSignificantDeviation) {
    if (maxDeviation > 15) {
      currentStatus = '위험 - 측정값이 기준값 대비 큰 편차를 보이고 있습니다';
      rootCause = '설비 노화, 센서 오차, 또는 운전 조건 변화로 인한 성능 저하';
      improvementSolution = '즉시 설비 점검 및 전문가 진단을 통한 원인 파악 필요';
      recommendations = [
        '즉시 설비 가동 중단 및 점검',
        '전문 기술자 진단 요청',
        '센서 및 계측기 재보정',
        '주요 부품 교체 검토'
      ];
    } else if (maxDeviation > 8) {
      currentStatus = '주의 - 측정값이 기준값 대비 편차를 보이고 있습니다';
      rootCause = '센서 드리프트, 환경 조건 변화, 또는 부분적 성능 저하';
      improvementSolution = '센서 재보정 및 운전 조건 최적화 필요';
      recommendations = [
        '센서 보정 주기 단축',
        '운전 조건 재검토',
        '예방 정비 강화',
        '모니터링 빈도 증가'
      ];
    }
  }
  
  return {
    currentStatus,
    rootCause,
    improvementSolution,
    recommendations
  };
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
