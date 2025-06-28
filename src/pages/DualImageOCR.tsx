
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { extractTextFromImage, type OCRResult } from '@/utils/ocrProcessor';
import { parseDualImageData, compareImageData, sendComparisonToWebhook, type DualImageAnalysis } from '@/utils/dualImageAnalysis';
import { performGoogleVisionOCR, performAdvancedAnalysis, type AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';
import AppHeader from '@/components/dual-image/AppHeader';
import DeviceSettingsCard from '@/components/dual-image/DeviceSettingsCard';
import ImageUploadCard from '@/components/dual-image/ImageUploadCard';
import AnalysisControlCard from '@/components/dual-image/AnalysisControlCard';
import AnalysisResultsCard from '@/components/dual-image/AnalysisResultsCard';
import UsageGuideCard from '@/components/dual-image/UsageGuideCard';

const DualImageOCR = () => {
  // Image states
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [measurementImage, setMeasurementImage] = useState<File | null>(null);
  
  // OCR states
  const [referenceOCR, setReferenceOCR] = useState<OCRResult | null>(null);
  const [measurementOCR, setMeasurementOCR] = useState<OCRResult | null>(null);
  const [referenceText, setReferenceText] = useState('');
  const [measurementText, setMeasurementText] = useState('');
  
  // Analysis states
  const [analysisResult, setAnalysisResult] = useState<AdvancedAnalysisResult | null>(null);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Equipment storage hook
  const { equipmentData, saveEquipmentData, addAnalysisToHistory } = useEquipmentStorage();
  
  // Processing states
  const [isProcessingRef, setIsProcessingRef] = useState(false);
  const [isProcessingMeas, setIsProcessingMeas] = useState(false);

  // Fixed webhook URL (hidden from UI)
  const webhookUrl = 'https://hook.eu2.make.com/qdvne23w47e7qbnrfobit8vuaa61b5wl';

  const handleReferenceImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "파일 형식 오류",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive"
        });
        return;
      }
      setReferenceImage(file);
      setReferenceOCR(null);
      setReferenceText('');
      setAnalysisResult(null);
      setWebhookResponse(null);
      
      console.log('기준값 이미지 선택됨:', file.name);
    }
  };

  const handleMeasurementImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "파일 형식 오류",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive"
        });
        return;
      }
      setMeasurementImage(file);
      setMeasurementOCR(null);
      setMeasurementText('');
      setAnalysisResult(null);
      setWebhookResponse(null);
      
      console.log('측정값 이미지 선택됨:', file.name);
    }
  };

  const processReferenceOCR = async () => {
    if (!referenceImage) {
      toast({
        title: "이미지 없음",
        description: "먼저 기준값 이미지를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessingRef(true);
    console.log('기준값 이미지 OCR 처리 시작');
    
    try {
      // Google Vision API 사용
      const extractedText = await performGoogleVisionOCR(referenceImage);
      setReferenceText(extractedText);
      
      console.log('기준값 OCR 완료:', extractedText);
      
      toast({
        title: "기준값 이미지 OCR 완료",
        description: `텍스트 추출이 완료되었습니다. (${extractedText.length}자)`
      });
    } catch (error) {
      console.error('기준값 OCR 오류:', error);
      // 백업으로 기본 OCR 사용
      try {
        const result = await extractTextFromImage(referenceImage);
        setReferenceOCR(result);
        setReferenceText(result.extractedText);
        
        console.log('기준값 백업 OCR 완료:', result);
        
        toast({
          title: "기준값 이미지 OCR 완료",
          description: `신뢰도: ${Math.round(result.confidence * 100)}%`
        });
      } catch (backupError) {
        console.error('기준값 백업 OCR 오류:', backupError);
        toast({
          title: "OCR 처리 실패",
          description: "기준값 이미지 처리 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessingRef(false);
    }
  };

  const processMeasurementOCR = async () => {
    if (!measurementImage) {
      toast({
        title: "이미지 없음",
        description: "먼저 측정값 이미지를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessingMeas(true);
    console.log('측정값 이미지 OCR 처리 시작');
    
    try {
      // Google Vision API 사용
      const extractedText = await performGoogleVisionOCR(measurementImage);
      setMeasurementText(extractedText);
      
      console.log('측정값 OCR 완료:', extractedText);
      
      toast({
        title: "측정값 이미지 OCR 완료",
        description: `텍스트 추출이 완료되었습니다. (${extractedText.length}자)`
      });
    } catch (error) {
      console.error('측정값 OCR 오류:', error);
      // 백업으로 기본 OCR 사용
      try {
        const result = await extractTextFromImage(measurementImage);
        setMeasurementOCR(result);
        setMeasurementText(result.extractedText);
        
        console.log('측정값 백업 OCR 완료:', result);
        
        toast({
          title: "측정값 이미지 OCR 완료",
          description: `신뢰도: ${Math.round(result.confidence * 100)}%`
        });
      } catch (backupError) {
        console.error('측정값 백업 OCR 오류:', backupError);
        toast({
          title: "OCR 처리 실패",
          description: "측정값 이미지 처리 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessingMeas(false);
    }
  };

  const performComparison = async () => {
    console.log('분석 시작 - 기준값:', referenceText.length, '측정값:', measurementText.length);
    
    if (!referenceText.trim() || !measurementText.trim()) {
      toast({
        title: "데이터 부족",
        description: "두 이미지 모두 OCR 처리를 완료해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (!equipmentData.equipmentName.trim()) {
      toast({
        title: "설비 정보 입력 필요",
        description: "설비명칭을 먼저 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    const analysisStartTime = new Date().toISOString();
    
    try {
      console.log('AI 분석 시작:', {
        equipmentName: equipmentData.equipmentName,
        location: equipmentData.location,
        referenceLength: referenceText.length,
        measurementLength: measurementText.length
      });
      
      // 고급 AI 분석 수행
      const analysis = await performAdvancedAnalysis(
        referenceText,
        measurementText,
        equipmentData.equipmentName || '미지정',
        equipmentData.location || '미지정'
      );
      
      // 분석 시간 추가
      analysis.timestamp = analysisStartTime;
      
      setAnalysisResult(analysis);
      
      // 분석 결과를 히스토리에 저장
      addAnalysisToHistory({
        ...analysis,
        referenceText,
        measurementText,
        images: {
          reference: referenceImage?.name,
          measurement: measurementImage?.name
        }
      });
      
      console.log('AI 분석 완료:', analysis);
      
      toast({
        title: "AI 분석 완료",
        description: "전문 공학적 분석이 완료되었습니다."
      });
    } catch (error) {
      console.error('분석 오류:', error);
      toast({
        title: "분석 실패",
        description: "AI 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendAnalysisToWebhook = async () => {
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

  const copyAnalysisResult = () => {
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

  // 분석 버튼 활성화 조건 확인
  const canAnalyze = referenceText.trim().length > 0 && 
                     measurementText.trim().length > 0 && 
                     equipmentData.equipmentName.trim().length > 0 && 
                     !isAnalyzing;

  console.log('분석 버튼 상태:', {
    referenceTextLength: referenceText.length,
    measurementTextLength: measurementText.length,
    equipmentName: equipmentData.equipmentName,
    canAnalyze,
    isAnalyzing
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AppHeader />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Settings */}
        <DeviceSettingsCard
          equipmentName={equipmentData.equipmentName}
          setEquipmentName={(name) => saveEquipmentData({ equipmentName: name })}
          location={equipmentData.location}
          setLocation={(loc) => saveEquipmentData({ location: loc })}
        />

        {/* Image Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUploadCard
            title="기준값(설계값) 이미지"
            image={referenceImage}
            onImageSelect={handleReferenceImageSelect}
            onProcessOCR={processReferenceOCR}
            isProcessing={isProcessingRef}
            extractedText={referenceText}
            inputId="reference-upload"
            color="green"
          />

          <ImageUploadCard
            title="측정값 이미지"
            image={measurementImage}
            onImageSelect={handleMeasurementImageSelect}
            onProcessOCR={processMeasurementOCR}
            isProcessing={isProcessingMeas}
            extractedText={measurementText}
            inputId="measurement-upload"
            color="blue"
          />
        </div>

        {/* Analysis Controls */}
        <AnalysisControlCard
          onPerformComparison={performComparison}
          isAnalyzing={isAnalyzing}
          referenceText={referenceText}
          measurementText={measurementText}
          analysisResult={analysisResult}
          onSendToWebhook={sendAnalysisToWebhook}
          isSending={isSending}
          onCopyResult={copyAnalysisResult}
          canAnalyze={canAnalyze}
        />

        {/* Analysis Results */}
        {analysisResult && (
          <AnalysisResultsCard 
            analysisResult={analysisResult}
            equipmentName={equipmentData.equipmentName}
            location={equipmentData.location}
            referenceText={referenceText}
            measurementText={measurementText}
            webhookResponse={webhookResponse}
          />
        )}

        {/* Usage Guide */}
        <UsageGuideCard />
      </div>
    </div>
  );
};

export default DualImageOCR;
