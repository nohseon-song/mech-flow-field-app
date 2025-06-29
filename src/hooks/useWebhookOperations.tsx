
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { type AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';

export const useWebhookOperations = () => {
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const { equipmentData } = useEquipmentStorage();

  // Fixed webhook URL (hidden from UI)
  const webhookUrl = 'https://hook.eu2.make.com/qdvne23w47e7qbnrfobit8vuaa61b5wl';

  const sendAnalysisToWebhook = async (
    analysisResult: AdvancedAnalysisResult,
    referenceText: string,
    measurementText: string,
    userComment: string = ''
  ) => {
    if (!analysisResult) {
      toast({
        title: "분석 결과 없음", 
        description: "먼저 분석을 수행해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    console.log('Webhook 전송 시작 - 완전한 데이터 패킷');
    
    try {
      // 완전한 데이터 패킷 구성
      const webhookData = {
        equipment_info: {
          name: equipmentData.equipmentName,
          location: equipmentData.location,
          timestamp: new Date().toISOString()
        },
        reference_data: {
          raw_text: referenceText,
          extracted_values: extractKeyValues(referenceText)
        },
        measurement_data: {
          raw_text: measurementText,
          extracted_values: extractKeyValues(measurementText)
        },
        ai_analysis: {
          current_status: analysisResult.currentStatus,
          root_cause: analysisResult.rootCause,
          improvement_solution: analysisResult.improvementSolution,
          risk_level: analysisResult.riskLevel,
          recommendations: analysisResult.recommendations,
          analysis_timestamp: analysisResult.timestamp
        },
        user_comment: userComment,
        metadata: {
          app_version: "1.0.0",
          analysis_type: "dual_image_comparison",
          sent_at: new Date().toISOString()
        }
      };

      console.log('전송할 Webhook 데이터:', webhookData);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        const responseData = await response.json();
        setWebhookResponse(responseData);
        
        console.log('Webhook 응답 성공:', responseData);
        
        toast({
          title: "분석 결과 전송 완료",
          description: "Make.com으로 모든 데이터가 성공적으로 전송되었습니다."
        });
        
        return responseData;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Webhook 전송 오류:', error);
      
      // 재시도 옵션 제공
      const shouldRetry = window.confirm(
        "전송에 실패했습니다. 다시 시도하시겠습니까?\n\n오류: " + 
        (error instanceof Error ? error.message : "알 수 없는 오류")
      );
      
      if (shouldRetry) {
        // 재시도
        setTimeout(() => {
          sendAnalysisToWebhook(analysisResult, referenceText, measurementText, userComment);
        }, 2000);
        return;
      }
      
      toast({
        title: "전송 실패",
        description: "분석 결과 전송에 실패했습니다. 네트워크를 확인하고 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyAnalysisResult = (analysisResult: AdvancedAnalysisResult, userComment: string = '') => {
    if (analysisResult) {
      const resultText = `
=== AI 다중 설비 분석 결과 ===
설비명칭: ${equipmentData.equipmentName}
설치위치: ${equipmentData.location}
분석일시: ${new Date(analysisResult.timestamp).toLocaleString('ko-KR')}

📋 현재 상태: ${analysisResult.currentStatus}
🔍 발생 원인: ${analysisResult.rootCause}
🛠️ 개선 솔루션: ${analysisResult.improvementSolution}
⚠️ 위험도: ${analysisResult.riskLevel}

✅ 권장사항:
${analysisResult.recommendations?.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

💬 현장 의견: ${userComment || '없음'}

---
생성일: ${new Date().toLocaleString('ko-KR')}
      `;
      
      navigator.clipboard.writeText(resultText);
      toast({
        title: "복사 완료",
        description: "전체 분석 결과가 클립보드에 복사되었습니다."
      });
    }
  };

  return {
    webhookResponse,
    isSending,
    sendAnalysisToWebhook,
    copyAnalysisResult
  };
};

// Key:Value 추출 헬퍼 함수
const extractKeyValues = (text: string): {[key: string]: string} => {
  const keyValues: {[key: string]: string} = {};
  
  // Flow 값 추출
  const flowMatch = text.match(/Flow\s*(\d+\.?\d*)\s*m3\/h/i);
  if (flowMatch) keyValues.flow_rate = `${flowMatch[1]} m3/h`;
  
  // Velocity 값 추출
  const velocityMatch = text.match(/(?:Vel|Velocity)\s*(\d+\.?\d*)\s*m\/s/i);
  if (velocityMatch) keyValues.velocity = `${velocityMatch[1]} m/s`;
  
  // Volume 값 추출 - Fixed the regex pattern
  const volumeMatch = text.match(/[+\-]?(\d+)\s*m3/i);
  if (volumeMatch) keyValues.volume = `${volumeMatch[1]} m3`;
  
  // Signal 값들 추출
  const signalSMatch = text.match(/S=(\d+,?\d*)/i);
  if (signalSMatch) keyValues.signal_s = signalSMatch[1];
  
  const signalQMatch = text.match(/Q[=\-](\d+)/i);
  if (signalQMatch) keyValues.signal_q = signalQMatch[1];
  
  // POS 값 추출
  const posMatch = text.match(/POS\s*([+\-]?\d+)/i);
  if (posMatch) keyValues.position = posMatch[1];
  
  return keyValues;
};
