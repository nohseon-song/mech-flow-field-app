
export interface ExtractedData {
  [key: string]: string | number;
}

export interface ParsedEquipmentData {
  rawText: string;
  extractedData: ExtractedData;
  formattedDisplay: string;
}

// 텍스트에서 Key:Value 쌍 추출 및 구조화
export const parseEquipmentText = (rawText: string): ParsedEquipmentData => {
  const extractedData: ExtractedData = {};
  const lines: string[] = [];
  
  // 유량 관련 패턴들
  const flowPatterns = [
    { regex: /Flow[:\s]*(\d+\.?\d*)\s*m3\/h/gi, key: '유량', unit: 'm3/h' },
    { regex: /유량[:\s]*(\d+\.?\d*)\s*m3\/h/gi, key: '유량', unit: 'm3/h' },
    { regex: /(\d+\.?\d*)\s*m3\/h/gi, key: '유량', unit: 'm3/h' }
  ];
  
  // 속도 관련 패턴들
  const velocityPatterns = [
    { regex: /Vel(?:ocity)?[:\s]*(\d+\.?\d*)\s*m\/s/gi, key: '유속', unit: 'm/s' },
    { regex: /유속[:\s]*(\d+\.?\d*)\s*m\/s/gi, key: '유속', unit: 'm/s' },
    { regex: /(\d+\.?\d*)\s*m\/s/gi, key: '유속', unit: 'm/s' }
  ];
  
  // 부피/체적 패턴들
  const volumePatterns = [
    { regex: /Volume[:\s]*([+\-]?\d+)\s*m3/gi, key: '체적', unit: 'm3' },
    { regex: /체적[:\s]*([+\-]?\d+)\s*m3/gi, key: '체적', unit: 'm3' },
    { regex: /([+\-]?\d+)\s*m3/gi, key: '체적', unit: 'm3' }
  ];
  
  // 신호 관련 패턴들
  const signalPatterns = [
    { regex: /S[=:\s]*(\d+,?\d*)/gi, key: '신호_S', unit: '' },
    { regex: /Q[=:\s\-]*(\d+)/gi, key: '신호_Q', unit: '' },
    { regex: /POS[:\s]*([+\-]?\d+)/gi, key: '위치', unit: '' }
  ];
  
  // 압력 관련 패턴들
  const pressurePatterns = [
    { regex: /Pressure[:\s]*(\d+\.?\d*)\s*(?:bar|Pa|kPa|MPa)/gi, key: '압력', unit: 'bar' },
    { regex: /압력[:\s]*(\d+\.?\d*)\s*(?:bar|Pa|kPa|MPa)/gi, key: '압력', unit: 'bar' }
  ];
  
  // 온도 관련 패턴들
  const temperaturePatterns = [
    { regex: /Temp(?:erature)?[:\s]*(\d+\.?\d*)\s*°?C/gi, key: '온도', unit: '°C' },
    { regex: /온도[:\s]*(\d+\.?\d*)\s*°?C/gi, key: '온도', unit: '°C' }
  ];
  
  const allPatterns = [
    ...flowPatterns,
    ...velocityPatterns,
    ...volumePatterns,
    ...signalPatterns,
    ...pressurePatterns,
    ...temperaturePatterns
  ];
  
  // 각 패턴 적용하여 데이터 추출
  allPatterns.forEach(pattern => {
    const matches = Array.from(rawText.matchAll(pattern.regex));
    matches.forEach(match => {
      if (match[1] && !extractedData[pattern.key]) {
        const value = pattern.unit ? 
          `${match[1]} ${pattern.unit}` : 
          match[1].replace(',', '');
        extractedData[pattern.key] = value;
        lines.push(`${pattern.key}: ${value}`);
      }
    });
  });
  
  // 상태 정보 추출
  const statusKeywords = ['ON', 'OFF', 'CHARGE', 'MENU', 'CD', 'ALARM', 'NORMAL'];
  statusKeywords.forEach(keyword => {
    if (rawText.toUpperCase().includes(keyword)) {
      if (!extractedData['상태']) {
        extractedData['상태'] = keyword;
        lines.push(`상태: ${keyword}`);
      }
    }
  });
  
  // 장비 타입 추출
  const equipmentTypes = ['ULTRASONIC FLOWMETER', 'FLOW METER', 'PRESSURE SENSOR'];
  equipmentTypes.forEach(type => {
    if (rawText.toUpperCase().includes(type)) {
      extractedData['장비타입'] = type;
      lines.push(`장비타입: ${type}`);
    }
  });
  
  const formattedDisplay = lines.length > 0 ? 
    lines.join('\n') : 
    `원시 텍스트:\n${rawText}`;
  
  return {
    rawText,
    extractedData,
    formattedDisplay
  };
};

// JSON 유효성 검증
export const validateJSON = (obj: any): boolean => {
  try {
    JSON.stringify(obj);
    return true;
  } catch (error) {
    console.error('JSON 유효성 검증 실패:', error);
    return false;
  }
};

// Webhook 전송용 데이터 구조화
export const prepareWebhookData = (
  equipmentName: string,
  location: string,
  referenceData: ParsedEquipmentData,
  measurementData: ParsedEquipmentData,
  analysisResult: any,
  userComment: string
) => {
  const webhookPayload = {
    equipment_info: {
      name: equipmentName || '미지정',
      location: location || '미지정',
      timestamp: new Date().toISOString(),
      analysis_date: new Date().toLocaleString('ko-KR')
    },
    reference_data: {
      raw_text: referenceData.rawText,
      extracted_values: referenceData.extractedData,
      formatted_display: referenceData.formattedDisplay
    },
    measurement_data: {
      raw_text: measurementData.rawText,
      extracted_values: measurementData.extractedData,
      formatted_display: measurementData.formattedDisplay
    },
    ai_analysis: {
      current_status: analysisResult.currentStatus || '',
      root_cause: analysisResult.rootCause || '',
      improvement_solution: analysisResult.improvementSolution || '',
      risk_level: analysisResult.riskLevel || 'low',
      recommendations: analysisResult.recommendations || [],
      analysis_timestamp: analysisResult.timestamp || new Date().toISOString()
    },
    user_comment: userComment || '',
    metadata: {
      app_version: "2.0.0",
      analysis_type: "enhanced_dual_image_comparison",
      sent_at: new Date().toISOString(),
      data_validation: validateJSON({
        equipment_info: { name: equipmentName, location },
        analysis: analysisResult
      })
    }
  };
  
  return webhookPayload;
};
