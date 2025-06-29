
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { type AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';
import { prepareWebhookData, validateJSON, type ParsedEquipmentData } from '@/utils/textDataParser';

export const useEnhancedWebhookOperations = () => {
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [lastSentData, setLastSentData] = useState<any>(null);
  const { equipmentData } = useEquipmentStorage();

  const webhookUrl = 'https://hook.eu2.make.com/qdvne23w47e7qbnrfobit8vuaa61b5wl';

  const sendAnalysisToWebhook = async (
    analysisResult: AdvancedAnalysisResult,
    referenceData: ParsedEquipmentData,
    measurementData: ParsedEquipmentData,
    userComment: string = ''
  ) => {
    if (!analysisResult) {
      toast({
        title: "분석 결과 없음", 
        description: "먼저 AI 분석을 수행해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    console.log('향상된 Webhook 전송 시작');
    
    try {
      const webhookData = prepareWebhookData(
        equipmentData.equipmentName,
        equipmentData.location,
        referenceData,
        measurementData,
        analysisResult,
        userComment
      );

      // JSON 유효성 검증
      if (!validateJSON(webhookData)) {
        throw new Error('데이터 구조가 올바르지 않습니다.');
      }

      console.log('전송할 Webhook 데이터:', webhookData);
      setLastSentData(webhookData);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      let responseText = '';
      try {
        responseText = await response.text();
        console.log('Webhook 원시 응답:', responseText);
        
        // JSON 응답인지 확인
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch {
          // JSON이 아닌 경우 텍스트로 처리
          responseData = { 
            status: response.ok ? 'success' : 'error',
            message: responseText || response.statusText,
            statusCode: response.status
          };
        }
        
        setWebhookResponse(responseData);
        
        if (response.ok) {
          toast({
            title: "분석 결과 전송 완료",
            description: "Make.com으로 모든 데이터가 성공적으로 전송되었습니다."
          });
          
          console.log('Webhook 전송 성공:', responseData);
          return responseData;
        } else {
          throw new Error(`HTTP ${response.status}: ${responseText || response.statusText}`);
        }
      } catch (parseError) {
        // 응답 파싱 실패시에도 성공으로 처리 (일부 웹훅은 JSON을 반환하지 않음)
        if (response.ok) {
          const successResponse = {
            status: 'success',
            message: 'Webhook successfully processed',
            statusCode: response.status,
            rawResponse: responseText
          };
          setWebhookResponse(successResponse);
          
          toast({
            title: "분석 결과 전송 완료",
            description: "Make.com으로 데이터가 성공적으로 전송되었습니다."
          });
          
          return successResponse;
        } else {
          throw parseError;
        }
      }
    } catch (error) {
      console.error('Webhook 전송 오류:', error);
      
      const shouldRetry = window.confirm(
        `전송에 실패했습니다. 다시 시도하시겠습니까?\n\n오류 내용: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }\n\n네트워크 연결 상태를 확인해주세요.`
      );
      
      if (shouldRetry) {
        setTimeout(() => {
          sendAnalysisToWebhook(analysisResult, referenceData, measurementData, userComment);
        }, 2000);
        return;
      }
      
      toast({
        title: "전송 실패",
        description: "분석 결과 전송에 실패했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyAnalysisResult = (
    analysisResult: AdvancedAnalysisResult, 
    referenceData: ParsedEquipmentData,
    measurementData: ParsedEquipmentData,
    userComment: string = ''
  ) => {
    if (analysisResult && referenceData && measurementData) {
      const resultText = `
=== AI 다중 설비 분석 결과 (향상된 버전) ===
설비명칭: ${equipmentData.equipmentName}
설치위치: ${equipmentData.location}
분석일시: ${new Date(analysisResult.timestamp).toLocaleString('ko-KR')}

📊 기준값 데이터:
${Object.entries(referenceData.extractedData).map(([key, value]) => `  ${key}: ${value}`).join('\n')}

📊 측정값 데이터:
${Object.entries(measurementData.extractedData).map(([key, value]) => `  ${key}: ${value}`).join('\n')}

📋 현재 상태: ${analysisResult.currentStatus}
🔍 발생 원인: ${analysisResult.rootCause}
🛠️ 개선 솔루션: ${analysisResult.improvementSolution}
⚠️ 위험도: ${analysisResult.riskLevel}

✅ 권장사항:
${analysisResult.recommendations?.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

💬 현장 의견: ${userComment || '없음'}

🔗 전송 데이터 검증: ${lastSentData ? '완료' : '대기중'}

---
생성일: ${new Date().toLocaleString('ko-KR')}
앱 버전: 2.0.0 (향상된 Key:Value 추출)
      `;
      
      navigator.clipboard.writeText(resultText);
      toast({
        title: "복사 완료",
        description: "향상된 분석 결과가 클립보드에 복사되었습니다."
      });
    }
  };

  const retryLastSend = () => {
    if (lastSentData) {
      const confirmation = window.confirm(
        "마지막 전송을 다시 시도하시겠습니까?\n\n이전 전송 데이터를 동일하게 재전송합니다."
      );
      
      if (confirmation) {
        setIsSending(true);
        
        fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lastSentData)
        })
        .then(response => response.json())
        .then(data => {
          setWebhookResponse(data);
          toast({
            title: "재전송 완료",
            description: "데이터가 성공적으로 재전송되었습니다."
          });
        })
        .catch(error => {
          console.error('재전송 실패:', error);
          toast({
            title: "재전송 실패",
            description: "재전송 중 오류가 발생했습니다.",
            variant: "destructive"
          });
        })
        .finally(() => {
          setIsSending(false);
        });
      }
    } else {
      toast({
        title: "재전송 불가",
        description: "재전송할 데이터가 없습니다.",
        variant: "destructive"
      });
    }
  };

  return {
    webhookResponse,
    isSending,
    lastSentData,
    sendAnalysisToWebhook,
    copyAnalysisResult,
    retryLastSend
  };
};
