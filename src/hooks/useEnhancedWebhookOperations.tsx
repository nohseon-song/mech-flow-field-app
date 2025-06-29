
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { type AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';
import { prepareWebhookData, validateJSON, sanitizeData, type ParsedEquipmentData } from '@/utils/textDataParser';

export const useEnhancedWebhookOperations = () => {
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [lastSentData, setLastSentData] = useState<any>(null);
  const [sendHistory, setSendHistory] = useState<any[]>([]);
  const { equipmentData } = useEquipmentStorage();

  const webhookUrl = 'https://hook.eu2.make.com/qdvne23w47e7qbnrfobit8vuaa61b5wl';

  // 100% 신뢰성 있는 Webhook 전송
  const sendAnalysisToWebhook = async (
    analysisResult: AdvancedAnalysisResult,
    referenceData: ParsedEquipmentData,
    measurementData: ParsedEquipmentData,
    userComment: string = ''
  ) => {
    if (!analysisResult) {
      toast({
        title: "전송 불가", 
        description: "먼저 AI 분석을 완료해주세요.",
        variant: "destructive"
      });
      return false;
    }

    setIsSending(true);
    console.log('🚀 향상된 Webhook 전송 시작');
    
    let attemptCount = 0;
    const maxAttempts = 3;

    while (attemptCount < maxAttempts) {
      attemptCount++;
      
      try {
        console.log(`📡 전송 시도 ${attemptCount}/${maxAttempts}`);
        
        // 1단계: 데이터 준비 및 정제
        let webhookData = prepareWebhookData(
          equipmentData.equipmentName,
          equipmentData.location,
          referenceData,
          measurementData,
          analysisResult,
          userComment
        );

        // 2단계: 데이터 정제 (null, undefined 제거)
        webhookData = sanitizeData(webhookData);

        // 3단계: JSON 유효성 사전 검증
        if (!validateJSON(webhookData)) {
          throw new Error('데이터 구조가 올바르지 않습니다. 입력값을 확인해주세요.');
        }

        console.log(`✅ 전송 데이터 검증 완료 (시도 ${attemptCount}):`, webhookData);
        setLastSentData(webhookData);

        // 4단계: 실제 전송
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15초 타임아웃

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'AI-Equipment-Analysis-App/2.0'
          },
          body: JSON.stringify(webhookData),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log(`📊 응답 상태: ${response.status} ${response.statusText}`);

        // 5단계: 응답 처리
        let responseData;
        const contentType = response.headers.get('content-type');
        
        try {
          if (contentType?.includes('application/json')) {
            responseData = await response.json();
          } else {
            const responseText = await response.text();
            
            // JSON 파싱 시도
            try {
              responseData = JSON.parse(responseText);
            } catch {
              // JSON이 아닌 경우 텍스트로 처리
              responseData = { 
                status: response.ok ? 'success' : 'error',
                message: responseText || 'Webhook processed successfully',
                statusCode: response.status,
                timestamp: new Date().toISOString()
              };
            }
          }
        } catch (parseError) {
          console.warn('응답 파싱 경고:', parseError);
          responseData = {
            status: response.ok ? 'success' : 'error',
            message: response.ok ? 'Webhook processed successfully' : 'Request failed',
            statusCode: response.status,
            timestamp: new Date().toISOString()
          };
        }
        
        setWebhookResponse(responseData);
        
        // 6단계: 성공/실패 판단
        if (response.ok || response.status === 200 || response.status === 201) {
          // 성공 처리
          const successData = {
            ...responseData,
            sentData: webhookData,
            timestamp: new Date().toISOString(),
            attemptCount
          };
          
          // 전송 이력 저장
          setSendHistory(prev => [successData, ...prev.slice(0, 9)]);
          
          toast({
            title: "✅ 전송 완료",
            description: `Make.com으로 모든 분석 데이터가 성공적으로 전송되었습니다. (시도: ${attemptCount}/${maxAttempts})`
          });
          
          console.log('🎉 Webhook 전송 성공:', successData);
          return true;
        } else {
          throw new Error(`HTTP ${response.status}: ${responseData.message || response.statusText}`);
        }

      } catch (error) {
        console.error(`❌ 전송 시도 ${attemptCount} 실패:`, error);
        
        if (attemptCount >= maxAttempts) {
          // 모든 시도 실패
          const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
          
          const shouldRetry = window.confirm(
            `🚨 전송에 실패했습니다.\n\n` +
            `오류 내용: ${errorMessage}\n` +
            `시도 횟수: ${attemptCount}/${maxAttempts}\n\n` +
            `다시 시도하시겠습니까?\n\n` +
            `💡 해결 방법:\n` +
            `• 네트워크 연결 상태 확인\n` +
            `• 입력 데이터 재확인\n` +
            `• 잠시 후 다시 시도`
          );
          
          if (shouldRetry) {
            // 재시도
            setTimeout(() => {
              sendAnalysisToWebhook(analysisResult, referenceData, measurementData, userComment);
            }, 2000);
            return false;
          }
          
          toast({
            title: "🚨 전송 실패",
            description: `${attemptCount}번 시도 후 전송에 실패했습니다. 네트워크를 확인하고 다시 시도해주세요.`,
            variant: "destructive"
          });
          
          return false;
        } else {
          // 다음 시도 전 잠시 대기
          console.log(`⏳ ${attemptCount + 1}번째 시도 준비 중... (2초 대기)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    return false;
  };

  // 향상된 결과 복사
  const copyAnalysisResult = (
    analysisResult: AdvancedAnalysisResult, 
    referenceData: ParsedEquipmentData,
    measurementData: ParsedEquipmentData,
    userComment: string = ''
  ) => {
    if (!analysisResult || !referenceData || !measurementData) {
      toast({
        title: "복사 불가",
        description: "복사할 데이터가 없습니다.",
        variant: "destructive"
      });
      return;
    }

    const resultText = `
=== 🤖 AI 다중 설비 분석 리포트 (고도화 v2.0) ===
📅 생성일시: ${new Date().toLocaleString('ko-KR')}
🏭 설비명칭: ${equipmentData.equipmentName || '미입력'}
📍 설치위치: ${equipmentData.location || '미입력'}

📊 === 기준값(설계값) 데이터 ===
${Object.entries(referenceData.extractedData || {}).length > 0 
  ? Object.entries(referenceData.extractedData).map(([key, value]) => `  • ${key}: ${value}`).join('\n')
  : '  데이터 없음'}

📊 === 측정값 데이터 ===
${Object.entries(measurementData.extractedData || {}).length > 0
  ? Object.entries(measurementData.extractedData).map(([key, value]) => `  • ${key}: ${value}`).join('\n')
  : '  데이터 없음'}

🔍 === AI 분석 결과 ===
📋 현재 상태: ${analysisResult.currentStatus || '분석 중'}

🔍 발생 원인: ${analysisResult.rootCause || '원인 분석 중'}

🛠️ 개선 솔루션: ${analysisResult.improvementSolution || '솔루션 검토 중'}

⚠️ 위험도: ${(analysisResult.riskLevel || 'medium').toUpperCase()}

✅ 권장사항:
${(analysisResult.recommendations || ['정기 점검 필요']).map((rec, i) => `  ${i + 1}. ${rec}`).join('\n')}

💬 === 현장 의견 ===
${userComment || '없음'}

🔗 === 전송 정보 ===
전송 상태: ${lastSentData ? '✅ 완료' : '⏳ 대기중'}
${webhookResponse ? `응답 상태: ${webhookResponse.status || 'unknown'}` : ''}

==========================================
🚀 앱 버전: 2.0.0 (고도화 Key:Value 추출)
🤖 AI 엔진: Google Gemini 1.5 Flash
📡 전송: Make.com Webhook
==========================================
    `;
    
    navigator.clipboard.writeText(resultText.trim());
    toast({
      title: "📋 복사 완료",
      description: "향상된 분석 결과가 클립보드에 복사되었습니다."
    });
  };

  // 재전송 기능
  const retryLastSend = async () => {
    if (!lastSentData) {
      toast({
        title: "재전송 불가",
        description: "재전송할 데이터가 없습니다.",
        variant: "destructive"
      });
      return;
    }

    const confirmation = window.confirm(
      `🔄 마지막 전송 데이터를 다시 전송하시겠습니까?\n\n` +
      `📊 설비: ${lastSentData.equipment?.name || '미입력'}\n` +
      `📍 위치: ${lastSentData.equipment?.location || '미입력'}\n` +
      `⏰ 원본 전송 시간: ${new Date(lastSentData.timestamp).toLocaleString('ko-KR')}`
    );
    
    if (!confirmation) return;

    setIsSending(true);
    
    try {
      console.log('🔄 재전송 시작:', lastSentData);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
          ...lastSentData,
          retryTimestamp: new Date().toISOString(),
          isRetry: true
        })
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = {
          status: response.ok ? 'success' : 'error',
          message: response.ok ? 'Retry successful' : 'Retry failed',
          statusCode: response.status
        };
      }
      
      setWebhookResponse(responseData);
      
      if (response.ok) {
        toast({
          title: "🔄 재전송 완료",
          description: "데이터가 성공적으로 재전송되었습니다."
        });
      } else {
        throw new Error(`재전송 실패: ${response.status}`);
      }
    } catch (error) {
      console.error('재전송 실패:', error);
      toast({
        title: "🚨 재전송 실패",
        description: "재전송 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // 전송 이력 조회
  const getSendHistory = () => sendHistory;

  // 전송 이력 초기화
  const clearSendHistory = () => {
    setSendHistory([]);
    toast({
      title: "이력 초기화",
      description: "전송 이력이 초기화되었습니다."
    });
  };

  return {
    webhookResponse,
    isSending,
    lastSentData,
    sendHistory,
    sendAnalysisToWebhook,
    copyAnalysisResult,
    retryLastSend,
    getSendHistory,
    clearSendHistory
  };
};
