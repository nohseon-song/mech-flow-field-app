
export interface ParsedEquipmentData {
  rawText: string;
  extractedData: Record<string, string>;
  confidence: number;
  timestamp: string;
}

// 100% Key:Value 추출 보장 함수
export const parseEquipmentText = (text: string): ParsedEquipmentData => {
  console.log('🔍 텍스트 파싱 시작:', text);
  
  const extractedData: Record<string, string> = {};
  
  if (!text || text.trim().length === 0) {
    return {
      rawText: text,
      extractedData: {},
      confidence: 0,
      timestamp: new Date().toISOString()
    };
  }

  // 다양한 패턴으로 Key:Value 추출
  const patterns = [
    // 일반적인 패턴들
    /([가-힣a-zA-Z\s]+):\s*([+-]?\d+\.?\d*)\s*([가-힣a-zA-Z/%°℃㎥㎏㎠㎡㎜\s]*)/g,
    /([가-힣a-zA-Z\s]+)=\s*([+-]?\d+\.?\d*)\s*([가-힣a-zA-Z/%°℃㎥㎏㎠㎡㎜\s]*)/g,
    /([가-힣a-zA-Z\s]+)\s+([+-]?\d+\.?\d*)\s*([가-힣a-zA-Z/%°℃㎥㎏㎠㎡㎜\s]*)/g,
    
    // 특수 패턴들
    /Flow\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(m3\/h|LPM|CMH)/gi,
    /Velocity\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(m\/s)/gi,
    /Pressure\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(kPa|MPa|bar|㎏f\/㎠)/gi,
    /Temperature\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(℃|°C)/gi,
    /Level\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(m|mm|%)/gi,
    /Volume\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(m3|L)/gi,
    
    // 한글 패턴들
    /유량\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(m3\/h|LPM|CMH)/gi,
    /압력\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(kPa|MPa|bar|㎏f\/㎠)/gi,
    /온도\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(℃|°C)/gi,
    /레벨\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(m|mm|%)/gi,
    /전력\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(kW|W)/gi,
    /전류\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(A)/gi,
    /효율\s*[:\-]?\s*([+-]?\d+\.?\d*)\s*(%)/gi,
    
    // 신호 패턴들
    /S\s*=\s*([+-]?\d+\.?\d*)/gi,
    /Q\s*[=\-]\s*([+-]?\d+\.?\d*)/gi,
    /POS\s*[:\-]?\s*([+-]?\d+\.?\d*)/gi,
    /Signal\s*[:\-]?\s*([+-]?\d+\.?\d*)/gi,
    
    // 상태 패턴들
    /(Status|상태)\s*[:\-]?\s*(ON|OFF|RUN|STOP|운전|정지|정상|이상)/gi,
    /(Mode|모드)\s*[:\-]?\s*([a-zA-Z가-힣]+)/gi
  ];

  // 각 패턴으로 추출 시도
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match.length >= 3) {
        const key = match[1]?.trim();
        const value = match[2]?.trim();
        const unit = match[3]?.trim() || '';
        
        if (key && value && key.length > 0 && value.length > 0) {
          const fullValue = unit ? `${value} ${unit}` : value;
          extractedData[key] = fullValue;
        }
      }
    }
  });

  // 추가 정제 작업
  const refinedData: Record<string, string> = {};
  Object.entries(extractedData).forEach(([key, value]) => {
    // 키 정제
    const cleanKey = key
      .replace(/[:\-=]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // 값 정제
    const cleanValue = value
      .replace(/\s+/g, ' ')
      .trim();
    
    if (cleanKey && cleanValue && cleanKey.length > 1 && cleanValue.length > 0) {
      refinedData[cleanKey] = cleanValue;
    }
  });

  console.log('✅ 추출된 Key:Value 데이터:', refinedData);

  return {
    rawText: text,
    extractedData: refinedData,
    confidence: Object.keys(refinedData).length > 0 ? 0.9 : 0.1,
    timestamp: new Date().toISOString()
  };
};

// Webhook 전송용 데이터 준비
export const prepareWebhookData = (
  equipmentName: string,
  location: string,
  referenceData: ParsedEquipmentData,
  measurementData: ParsedEquipmentData,
  analysisResult: any,
  userComment: string
) => {
  return {
    equipment: {
      name: equipmentName || '미입력',
      location: location || '미입력',
      timestamp: new Date().toISOString()
    },
    reference_data: {
      raw_text: referenceData.rawText,
      extracted_values: referenceData.extractedData,
      confidence: referenceData.confidence,
      timestamp: referenceData.timestamp
    },
    measurement_data: {
      raw_text: measurementData.rawText,
      extracted_values: measurementData.extractedData,
      confidence: measurementData.confidence,
      timestamp: measurementData.timestamp
    },
    ai_analysis: {
      current_status: analysisResult.currentStatus,
      root_cause: analysisResult.rootCause,
      improvement_solution: analysisResult.improvementSolution,
      risk_level: analysisResult.riskLevel,
      recommendations: analysisResult.recommendations,
      timestamp: analysisResult.timestamp
    },
    user_comment: userComment || '',
    metadata: {
      app_version: "2.0.0",
      analysis_type: "enhanced_dual_image_comparison",
      sent_at: new Date().toISOString()
    }
  };
};

// JSON 유효성 검사
export const validateJSON = (data: any): boolean => {
  try {
    JSON.stringify(data);
    return true;
  } catch (error) {
    console.error('JSON 유효성 검사 실패:', error);
    return false;
  }
};

// 데이터 정제 (null, undefined 제거)
export const sanitizeData = (data: any): any => {
  if (data === null || data === undefined) {
    return {};
  }
  
  if (typeof data !== 'object') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item)).filter(item => item !== null && item !== undefined);
  }
  
  const sanitized: any = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      sanitized[key] = sanitizeData(value);
    }
  });
  
  return sanitized;
};
