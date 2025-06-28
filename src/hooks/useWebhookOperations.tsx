
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

  const sendAnalysisToWebhook = async (analysisResult: AdvancedAnalysisResult) => {
    if (!analysisResult) {
      toast({
        title: "분석 결과 없음",
        description: "먼저 분석을 수행해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    console.log('Webhook 전송 시작');
    
    try {
      const webhookData = {
        equipment: {
          name: equipmentData.equipmentName,
          location: equipmentData.location
        },
        analysis: analysisResult,
        timestamp: new Date().toISOString()
      };

      console.log('Webhook 데이터:', webhookData);

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
        
        console.log('Webhook 응답:', responseData);
        
        toast({
          title: "분석 결과 전송 완료",
          description: "Make.com으로 데이터가 성공적으로 전송되었습니다."
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Webhook 전송 오류:', error);
      toast({
        title: "전송 실패",
        description: "분석 결과 전송에 실패했습니다. 네트워크를 확인하고 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyAnalysisResult = (analysisResult: AdvancedAnalysisResult) => {
    if (analysisResult) {
      const resultText = `
=== AI 다중 설비 분석 결과 ===
설비명칭: ${equipmentData.equipmentName}
설치위치: ${equipmentData.location}
분석일시: ${new Date(analysisResult.timestamp).toLocaleString('ko-KR')}

현재 상태: ${analysisResult.currentStatus}
발생 원인: ${analysisResult.rootCause}
개선 솔루션: ${analysisResult.improvementSolution}
위험도: ${analysisResult.riskLevel}

권장사항:
${analysisResult.recommendations?.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
      `;
      
      navigator.clipboard.writeText(resultText);
      toast({
        title: "복사 완료",
        description: "분석 결과가 클립보드에 복사되었습니다."
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
