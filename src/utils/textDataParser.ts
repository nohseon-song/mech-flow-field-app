
export interface ParsedEquipmentData {
  extractedData: Record<string, string>;
  rawText: string;
  formattedDisplay: string;
  confidence: number;
}

// 무조건 성공하는 텍스트 파싱 시스템
export const parseEquipmentText = (rawText: string): ParsedEquipmentData => {
  console.log('고도화 텍스트 파싱 시작:', rawText);
  
  if (!rawText || rawText.trim().length === 0) {
    return {
      extractedData: {},
      rawText: '',
      formattedDisplay: '텍스트가 없습니다.',
      confidence: 0
    };
  }

  const extractedData: Record<string, string> = {};
  let confidence = 0;

  // 1단계: 명확한 Key:Value 패턴 추출
  const explicitPatterns = [
    // 콜론 구분자
    /([가-힣A-Za-z]+)\s*:\s*([0-9.,\s]+[가-힣A-Za-z/%°]*)/g,
    // 등호 구분자  
    /([가-힣A-Za-z]+)\s*=\s*([0-9.,\s]+[가-힣A-Za-z/%°]*)/g,
    // 공백 구분자 (숫자+단위)
    /([가-힣A-Za-z]+)\s+([0-9.,]+\s*[가-힣A-Za-z/%°]+)/g
  ];

  explicitPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(rawText)) !== null) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key.length > 0 && value.length > 0) {
        extractedData[key] = value;
        confidence += 0.3;
      }
    }
  });

  // 2단계: 설비별 특화 패턴 인식
  const specializedPatterns = [
    // 유량 관련
    { pattern: /유량[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '유량' },
    { pattern: /flow[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '유량' },
    // 압력 관련
    { pattern: /압력[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '압력' },
    { pattern: /pressure[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '압력' },
    // 온도 관련
    { pattern: /온도[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '온도' },
    { pattern: /temp[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '온도' },
    // 레벨/수위 관련
    { pattern: /(?:레벨|수위|level)[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '레벨' },
    // 속도 관련
    { pattern: /(?:속도|rpm|speed)[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '속도' },
    // 전력 관련
    { pattern: /(?:전력|power|전류|current)[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '전력' },
    // 체적/용량 관련
    { pattern: /(?:체적|용량|volume)[^\d]*([0-9.,]+)\s*([^0-9\s]*)/gi, key: '체적' }
  ];

  specializedPatterns.forEach(({ pattern, key }) => {
    let match;
    while ((match = pattern.exec(rawText)) !== null) {
      const value = match[1].trim();
      const unit = match[2] ? match[2].trim() : '';
      if (value && !extractedData[key]) {
        extractedData[key] = unit ? `${value} ${unit}` : value;
        confidence += 0.2;
      }
    }
  });

  // 3단계: 숫자+단위 일반 패턴
  const numericPatterns = [
    /([0-9]+\.?[0-9]*)\s*(m3\/h|㎥\/h|리터\/분|L\/min|bar|kPa|MPa|°C|℃|rpm|Hz|kW|A|V)/gi,
    /([0-9]+\.?[0-9]*)\s*([가-힣]+)/g
  ];

  numericPatterns.forEach((pattern, index) => {
    let match;
    let counter = 1;
    while ((match = pattern.exec(rawText)) !== null) {
      const value = match[1].trim();
      const unit = match[2].trim();
      const key = index === 0 ? `측정값${counter}` : `데이터${counter}`;
      
      if (value && !Object.values(extractedData).includes(`${value} ${unit}`)) {
        extractedData[key] = `${value} ${unit}`;
        confidence += 0.1;
        counter++;
      }
    }
  });

  // 4단계: 폴백 - 모든 숫자 추출
  if (Object.keys(extractedData).length === 0) {
    const numbers = rawText.match(/\d+\.?\d*/g);
    if (numbers) {
      numbers.forEach((num, index) => {
        if (index < 5) { // 최대 5개까지만
          extractedData[`값${index + 1}`] = num;
          confidence += 0.05;
        }
      });
    }
  }

  // 5단계: 최종 폴백 - 텍스트 요약
  if (Object.keys(extractedData).length === 0) {
    const words = rawText.split(/\s+/).filter(word => word.length > 1);
    if (words.length > 0) {
      extractedData['텍스트내용'] = words.slice(0, 10).join(' ');
      confidence = 0.1;
    }
  }

  // 신뢰도 정규화
  confidence = Math.min(1.0, confidence);

  // 포맷된 표시 텍스트 생성
  const formattedDisplay = Object.keys(extractedData).length > 0
    ? Object.entries(extractedData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
    : rawText;

  console.log('파싱 결과:', {
    추출된데이터: extractedData,
    신뢰도: confidence,
    원본길이: rawText.length
  });

  return {
    extractedData,
    rawText,
    formattedDisplay,
    confidence
  };
};

// Webhook 전송용 데이터 준비 (100% 신뢰성)
export const prepareWebhookData = (
  equipmentName: string,
  location: string,
  referenceData: ParsedEquipmentData,
  measurementData: ParsedEquipmentData,
  analysisResult: any,
  userComment: string
) => {
  const webhookData = {
    timestamp: new Date().toISOString(),
    equipment: {
      name: equipmentName || '미입력',
      location: location || '미입력'
    },
    data: {
      reference: {
        keyValuePairs: referenceData.extractedData,
        rawText: referenceData.rawText,
        confidence: referenceData.confidence
      },
      measurement: {
        keyValuePairs: measurementData.extractedData,
        rawText: measurementData.rawText,
        confidence: measurementData.confidence
      }
    },
    analysis: {
      currentStatus: analysisResult.currentStatus || '',
      rootCause: analysisResult.rootCause || '',
      improvementSolution: analysisResult.improvementSolution || '',
      recommendations: analysisResult.recommendations || [],
      riskLevel: analysisResult.riskLevel || 'medium',
      timestamp: analysisResult.timestamp || new Date().toISOString()
    },
    userComment: userComment || '',
    metadata: {
      version: '2.0.0',
      source: 'AI Equipment Analysis App'
    }
  };

  console.log('Webhook 데이터 준비 완료:', webhookData);
  return webhookData;
};

// JSON 유효성 검증
export const validateJSON = (data: any): boolean => {
  try {
    const jsonString = JSON.stringify(data);
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    console.error('JSON 유효성 검증 실패:', error);
    return false;
  }
};

// 데이터 정제 및 검증
export const sanitizeData = (data: any): any => {
  const sanitized = JSON.parse(JSON.stringify(data));
  
  // null, undefined 처리
  const processValue = (obj: any): any => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj.trim();
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = processValue(value);
      }
      return result;
    }
    if (Array.isArray(obj)) {
      return obj.map(processValue);
    }
    return obj;
  };
  
  return processValue(sanitized);
};
