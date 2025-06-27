
export interface ParsedImageData {
  Flow?: number;
  Velocity?: number;
  Volume?: number;
  Signal_S?: number;
  Signal_Q?: number;
  Status: string[];
  raw_values: { [key: string]: string };
}

export interface ComparisonResult {
  parameter: string;
  reference_value: number | string;
  measurement_value: number | string;
  deviation: string;
  status: 'normal' | 'caution' | 'danger';
}

export interface DualImageAnalysis {
  site_info: {
    device_id: string;
    location: string;
    timestamp: string;
  };
  reference_image: {
    filename: string;
    ocr_text: string;
    analysis: ParsedImageData;
  };
  measurement_image: {
    filename: string;
    ocr_text: string;
    analysis: ParsedImageData;
  };
  comparison_result: {
    comparisons: ComparisonResult[];
    overall_status: 'normal' | 'caution' | 'danger';
    recommendation: string;
  };
}

export const parseDualImageData = (rawText: string): ParsedImageData => {
  const data: ParsedImageData = {
    Status: [],
    raw_values: {}
  };

  // Flow 값 추출
  const flowMatch = rawText.match(/Flow\s*(\d+\.?\d*)\s*m3\/h/i);
  if (flowMatch) {
    data.Flow = parseFloat(flowMatch[1]);
    data.raw_values.Flow = `${flowMatch[1]} m3/h`;
  }

  // Velocity 값 추출
  const velocityMatch = rawText.match(/(?:Vel|Velocity)\s*(\d+\.?\d*)\s*m\/s/i);
  if (velocityMatch) {
    data.Velocity = parseFloat(velocityMatch[1]);
    data.raw_values.Velocity = `${velocityMatch[1]} m/s`;
  }

  // Volume 값 추출
  const volumeMatch = rawText.match(/[+\-]?(\d+)\s*m3/i);
  if (volumeMatch) {
    data.Volume = parseInt(volumeMatch[1]);
    data.raw_values.Volume = `${volumeMatch[1]} m3`;
  }

  // Signal S 값 추출
  const signalSMatch = rawText.match(/S=(\d+,?\d*)/i);
  if (signalSMatch) {
    const sValue = signalSMatch[1].replace(',', '');
    data.Signal_S = parseFloat(sValue);
    data.raw_values.Signal_S = signalSMatch[1];
  }

  // Signal Q 값 추출
  const signalQMatch = rawText.match(/Q[=\-](\d+)/i);
  if (signalQMatch) {
    data.Signal_Q = parseInt(signalQMatch[1]);
    data.raw_values.Signal_Q = signalQMatch[1];
  }

  // 상태 값들 추출
  const statusPatterns = ['CD', 'POS', 'ON', 'OFF', 'CHARGE', 'MENU'];
  statusPatterns.forEach(pattern => {
    if (rawText.includes(pattern)) {
      data.Status.push(pattern);
    }
  });

  return data;
};

export const compareImageData = (
  referenceData: ParsedImageData,
  measurementData: ParsedImageData,
  referenceFilename: string,
  measurementFilename: string,
  deviceId: string,
  location: string
): DualImageAnalysis => {
  const comparisons: ComparisonResult[] = [];
  
  // Flow 비교
  if (referenceData.Flow !== undefined && measurementData.Flow !== undefined) {
    const deviation = ((measurementData.Flow - referenceData.Flow) / referenceData.Flow * 100);
    comparisons.push({
      parameter: 'Flow',
      reference_value: referenceData.Flow,
      measurement_value: measurementData.Flow,
      deviation: `${deviation >= 0 ? '+' : ''}${deviation.toFixed(1)}%`,
      status: Math.abs(deviation) > 10 ? 'danger' : Math.abs(deviation) > 5 ? 'caution' : 'normal'
    });
  }

  // Velocity 비교
  if (referenceData.Velocity !== undefined && measurementData.Velocity !== undefined) {
    const deviation = ((measurementData.Velocity - referenceData.Velocity) / referenceData.Velocity * 100);
    comparisons.push({
      parameter: 'Velocity',
      reference_value: referenceData.Velocity,
      measurement_value: measurementData.Velocity,
      deviation: `${deviation >= 0 ? '+' : ''}${deviation.toFixed(1)}%`,
      status: Math.abs(deviation) > 15 ? 'danger' : Math.abs(deviation) > 8 ? 'caution' : 'normal'
    });
  }

  // Signal Q 비교
  if (referenceData.Signal_Q !== undefined && measurementData.Signal_Q !== undefined) {
    const difference = measurementData.Signal_Q - referenceData.Signal_Q;
    comparisons.push({
      parameter: 'Signal_Q',
      reference_value: referenceData.Signal_Q,
      measurement_value: measurementData.Signal_Q,
      deviation: `${difference >= 0 ? '+' : ''}${difference}`,
      status: Math.abs(difference) > 20 ? 'danger' : Math.abs(difference) > 10 ? 'caution' : 'normal'
    });
  }

  // 전반적 상태 평가
  const dangerCount = comparisons.filter(c => c.status === 'danger').length;
  const cautionCount = comparisons.filter(c => c.status === 'caution').length;
  
  let overallStatus: 'normal' | 'caution' | 'danger' = 'normal';
  let recommendation = '현재 상태가 양호합니다. 정기 점검을 유지하세요.';
  
  if (dangerCount > 0) {
    overallStatus = 'danger';
    recommendation = '즉시 점검이 필요합니다. 운전을 중단하고 전문가 진단을 받으세요.';
  } else if (cautionCount > 0) {
    overallStatus = 'caution';
    recommendation = '주의가 필요한 상태입니다. 면밀한 모니터링과 예방 정비를 실시하세요.';
  }

  return {
    site_info: {
      device_id: deviceId,
      location: location,
      timestamp: new Date().toISOString()
    },
    reference_image: {
      filename: referenceFilename,
      ocr_text: '', // Will be filled by the calling function
      analysis: referenceData
    },
    measurement_image: {
      filename: measurementFilename,
      ocr_text: '', // Will be filled by the calling function
      analysis: measurementData
    },
    comparison_result: {
      comparisons: comparisons,
      overall_status: overallStatus,
      recommendation: recommendation
    }
  };
};

export const sendComparisonToWebhook = async (analysis: DualImageAnalysis, webhookUrl: string): Promise<boolean> => {
  try {
    console.log('Webhook 전송 중:', analysis);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysis)
    });

    if (response.ok) {
      console.log('Webhook 전송 성공');
      return true;
    } else {
      console.error('Webhook 전송 실패:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Webhook 전송 오류:', error);
    return false;
  }
};
