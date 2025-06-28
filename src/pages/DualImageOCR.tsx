
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
    }
  };

  const processReferenceOCR = async () => {
    if (!referenceImage) return;
    
    setIsProcessingRef(true);
    try {
      // Google Vision API 사용
      const extractedText = await performGoogleVisionOCR(referenceImage);
      setReferenceText(extractedText);
      
      toast({
        title: "기준값 이미지 OCR 완료",
        description: "Google Vision API로 텍스트 추출이 완료되었습니다."
      });
    } catch (error) {
      // 백업으로 기본 OCR 사용
      try {
        const result = await extractTextFromImage(referenceImage);
        setReferenceOCR(result);
        setReferenceText(result.extractedText);
        
        toast({
          title: "기준값 이미지 OCR 완료",
          description: `신뢰도: ${Math.round(result.confidence * 100)}%`
        });
      } catch (backupError) {
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
    if (!measurementImage) return;
    
    setIsProcessingMeas(true);
    try {
      // Google Vision API 사용
      const extractedText = await performGoogleVisionOCR(measurementImage);
      setMeasurementText(extractedText);
      
      toast({
        title: "측정값 이미지 OCR 완료",
        description: "Google Vision API로 텍스트 추출이 완료되었습니다."
      });
    } catch (error) {
      // 백업으로 기본 OCR 사용
      try {
        const result = await extractTextFromImage(measurementImage);
        setMeasurementOCR(result);
        setMeasurementText(result.extractedText);
        
        toast({
          title: "측정값 이미지 OCR 완료",
          description: `신뢰도: ${Math.round(result.confidence * 100)}%`
        });
      } catch (backupError) {
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
    if (!referenceText || !measurementText) {
      toast({
        title: "데이터 부족",
        description: "두 이미지 모두 OCR 처리를 완료해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // 고급 AI 분석 수행
      const analysis = await performAdvancedAnalysis(
        referenceText,
        measurementText,
        equipmentData.equipmentName || '미지정',
        equipmentData.location || '미지정'
      );
      
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
      
      toast({
        title: "AI 분석 완료",
        description: "전문 공학적 분석이 완료되었습니다."
      });
    } catch (error) {
      toast({
        title: "분석 실패",
        description: "AI 분석 중 오류가 발생했습니다.",
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
    try {
      const webhookData = {
        equipment: {
          name: equipmentData.equipmentName,
          location: equipmentData.location
        },
        analysis: analysisResult,
        timestamp: new Date().toISOString()
      };

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
        
        toast({
          title: "분석 결과 전송 완료",
          description: "Make.com으로 데이터가 성공적으로 전송되었습니다."
        });
      } else {
        throw new Error('Webhook 전송 실패');
      }
    } catch (error) {
      toast({
        title: "전송 실패",
        description: "분석 결과 전송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyAnalysisResult = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
      toast({
        title: "복사 완료",
        description: "분석 결과가 클립보드에 복사되었습니다."
      });
    }
  };

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
