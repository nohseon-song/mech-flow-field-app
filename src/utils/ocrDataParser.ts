
export interface ParsedMeasurementData {
  Flow?: string;
  Velocity?: string;
  Volume?: string;
  Signal_S?: string;
  Signal_Q?: string;
  Status: string[];
}

export interface DiagnosisData {
  CurrentStatus: string;
  ProbableCause: string;
  RecommendedAction: string;
}

export interface WebhookPayload {
  site_info: {
    device_id: string;
    timestamp: string;
  };
  measurement_data: ParsedMeasurementData;
  diagnosis: DiagnosisData;
  raw_text: string;
}

export const parseOCRText = (rawText: string): ParsedMeasurementData => {
  const data: ParsedMeasurementData = {
    Status: []
  };

  // Flow 값 추출
  const flowMatch = rawText.match(/Flow\s*(\d+\.?\d*)\s*m3\/h/i);
  if (flowMatch) {
    data.Flow = `${flowMatch[1]} m3/h`;
  }

  // Velocity 값 추출
  const velocityMatch = rawText.match(/(?:Vel|Velocity)\s*(\d+\.?\d*)\s*m\/s/i);
  if (velocityMatch) {
    data.Velocity = `${velocityMatch[1]} m/s`;
  }

  // Volume 값 추출
  const volumeMatch = rawText.match(/[+\-]?(\d+)\s*m3/i);
  if (volumeMatch) {
    data.Volume = `${volumeMatch[1]} m3`;
  }

  // Signal S 값 추출
  const signalSMatch = rawText.match(/S=(\d+,?\d*)/i);
  if (signalSMatch) {
    data.Signal_S = signalSMatch[1];
  }

  // Signal Q 값 추출
  const signalQMatch = rawText.match(/Q=(\d+)/i);
  if (signalQMatch) {
    data.Signal_Q = signalQMatch[1];
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

export const generateDiagnosis = (measurementData: ParsedMeasurementData, rawText: string): DiagnosisData => {
  let currentStatus = "정상 작동";
  let probableCause = "해당 없음";
  let recommendedAction = "정기 점검 유지";

  // 상태 분석
  if (measurementData.Status.includes('ON')) {
    currentStatus = "장비 가동 중";
  } else if (measurementData.Status.includes('OFF')) {
    currentStatus = "장비 비가동 상태";
    probableCause = "수동 정지 또는 유지보수";
    recommendedAction = "가동 필요성 확인 후 재시작";
  }

  // Flow 값 분석
  if (measurementData.Flow) {
    const flowValue = parseFloat(measurementData.Flow);
    if (flowValue > 1000) {
      currentStatus = "고유량 운전 중";
      probableCause = "수요 증가 또는 밸브 전개";
      recommendedAction = "유량 적정성 검토";
    } else if (flowValue < 100) {
      currentStatus = "저유량 운전";
      probableCause = "수요 감소 또는 배관 막힘";
      recommendedAction = "배관 상태 점검 필요";
    }
  }

  // ULTRASONIC FLOWMETER 특화 분석
  if (rawText.includes('ULTRASONIC FLOWMETER')) {
    if (measurementData.Signal_S && measurementData.Signal_Q) {
      const signalS = parseFloat(measurementData.Signal_S.replace(',', ''));
      const signalQ = parseFloat(measurementData.Signal_Q);
      
      if (signalS < 500 || signalQ < 50) {
        currentStatus = "신호 품질 저하";
        probableCause = "센서 오염 또는 배관 내 기포";
        recommendedAction = "센서 청소 및 캘리브레이션 필요";
      }
    }
  }

  return {
    CurrentStatus: currentStatus,
    ProbableCause: probableCause,
    RecommendedAction: recommendedAction
  };
};

export const sendToWebhook = async (payload: WebhookPayload): Promise<boolean> => {
  const webhookUrl = 'https://hook.eu2.make.com/qdvne23w47e7qbnrfobit8vuaa61b5wl';
  
  try {
    console.log('Webhook 전송 중:', payload);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
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
