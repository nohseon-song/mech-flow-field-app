
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitCompare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { extractTextFromImage, type OCRResult } from '@/utils/ocrProcessor';
import { parseDualImageData, compareImageData, sendComparisonToWebhook, type DualImageAnalysis } from '@/utils/dualImageAnalysis';
import DeviceSettingsCard from '@/components/dual-image/DeviceSettingsCard';
import ImageUploadCard from '@/components/dual-image/ImageUploadCard';
import AnalysisControlCard from '@/components/dual-image/AnalysisControlCard';
import AnalysisResultsCard from '@/components/dual-image/AnalysisResultsCard';
import UsageGuideCard from '@/components/dual-image/UsageGuideCard';

const DualImageOCR = () => {
  const navigate = useNavigate();
  
  // Image states
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [measurementImage, setMeasurementImage] = useState<File | null>(null);
  
  // OCR states
  const [referenceOCR, setReferenceOCR] = useState<OCRResult | null>(null);
  const [measurementOCR, setMeasurementOCR] = useState<OCRResult | null>(null);
  const [referenceText, setReferenceText] = useState('');
  const [measurementText, setMeasurementText] = useState('');
  
  // Analysis states
  const [analysisResult, setAnalysisResult] = useState<DualImageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Settings
  const [deviceId, setDeviceId] = useState('');
  const [location, setLocation] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('https://hook.eu2.make.com/qdvne23w47e7qbnrfobit8vuaa61b5wl');
  
  // Processing states
  const [isProcessingRef, setIsProcessingRef] = useState(false);
  const [isProcessingMeas, setIsProcessingMeas] = useState(false);

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
    }
  };

  const processReferenceOCR = async () => {
    if (!referenceImage) return;
    
    setIsProcessingRef(true);
    try {
      const result = await extractTextFromImage(referenceImage);
      setReferenceOCR(result);
      setReferenceText(result.extractedText);
      
      toast({
        title: "설계 기준 OCR 완료",
        description: `신뢰도: ${Math.round(result.confidence * 100)}%`
      });
    } catch (error) {
      toast({
        title: "OCR 처리 실패",
        description: "설계 기준 이미지 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingRef(false);
    }
  };

  const processMeasurementOCR = async () => {
    if (!measurementImage) return;
    
    setIsProcessingMeas(true);
    try {
      const result = await extractTextFromImage(measurementImage);
      setMeasurementOCR(result);
      setMeasurementText(result.extractedText);
      
      toast({
        title: "실측 이미지 OCR 완료",
        description: `신뢰도: ${Math.round(result.confidence * 100)}%`
      });
    } catch (error) {
      toast({
        title: "OCR 처리 실패",
        description: "실측 이미지 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
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
      const referenceData = parseDualImageData(referenceText);
      const measurementData = parseDualImageData(measurementText);
      
      const analysis = compareImageData(
        referenceData, 
        measurementData, 
        referenceImage?.name || 'reference',
        measurementImage?.name || 'measurement',
        deviceId || 'AUTO-' + Date.now(),
        location || '미지정'
      );
      
      setAnalysisResult(analysis);
      
      toast({
        title: "비교 분석 완료",
        description: "두 이미지의 데이터 비교가 완료되었습니다."
      });
    } catch (error) {
      toast({
        title: "분석 실패",
        description: "데이터 비교 중 오류가 발생했습니다.",
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
        description: "먼저 비교 분석을 수행해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      const success = await sendComparisonToWebhook(analysisResult, webhookUrl);
      
      if (success) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <GitCompare className="h-6 w-6 text-indigo-600" />
                다중 장비 비교 분석
              </h1>
              <p className="text-sm text-slate-600">설계 기준과 실측값 자동 비교 및 진단</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Settings */}
        <DeviceSettingsCard
          deviceId={deviceId}
          setDeviceId={setDeviceId}
          location={location}
          setLocation={setLocation}
          webhookUrl={webhookUrl}
          setWebhookUrl={setWebhookUrl}
        />

        {/* Image Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadCard
            title="설계 기준 이미지"
            image={referenceImage}
            onImageSelect={handleReferenceImageSelect}
            onProcessOCR={processReferenceOCR}
            isProcessing={isProcessingRef}
            extractedText={referenceText}
            inputId="reference-upload"
            color="green"
          />

          <ImageUploadCard
            title="실측 이미지"
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
          <AnalysisResultsCard analysisResult={analysisResult} />
        )}

        {/* Usage Guide */}
        <UsageGuideCard />
      </div>
    </div>
  );
};

export default DualImageOCR;
