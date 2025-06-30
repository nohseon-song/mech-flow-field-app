
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { performGoogleVisionOCR } from '@/utils/advancedAnalysis';
import { parseEquipmentText, type ParsedEquipmentData } from '@/utils/textDataParser';

export const useEnhancedOCRProcessing = () => {
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [measurementImage, setMeasurementImage] = useState<File | null>(null);
  const [referenceData, setReferenceData] = useState<ParsedEquipmentData | null>(null);
  const [measurementData, setMeasurementData] = useState<ParsedEquipmentData | null>(null);
  const [isProcessingRef, setIsProcessingRef] = useState(false);
  const [isProcessingMeas, setIsProcessingMeas] = useState(false);

  const handleReferenceImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "❌ 파일 형식 오류",
          description: "이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF, BMP)",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB 제한
        toast({
          title: "❌ 파일 크기 초과",
          description: "이미지 크기는 10MB 이하여야 합니다.",
          variant: "destructive"
        });
        return;
      }
      
      setReferenceImage(file);
      setReferenceData(null);
      
      toast({
        title: "✅ 기준값 이미지 선택됨",
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
      });
      
      console.log('✅ 기준값 이미지 선택됨:', file.name);
    }
  };

  const handleMeasurementImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "❌ 파일 형식 오류",
          description: "이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF, BMP)",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB 제한
        toast({
          title: "❌ 파일 크기 초과",
          description: "이미지 크기는 10MB 이하여야 합니다.",
          variant: "destructive"
        });
        return;
      }
      
      setMeasurementImage(file);
      setMeasurementData(null);
      
      toast({
        title: "✅ 측정값 이미지 선택됨",
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
      });
      
      console.log('✅ 측정값 이미지 선택됨:', file.name);
    }
  };

  const processReferenceOCR = async () => {
    if (!referenceImage) {
      toast({
        title: "❌ 이미지 없음",
        description: "먼저 기준값 이미지를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessingRef(true);
    const startTime = Date.now();
    
    try {
      console.log('🔍 기준값 이미지 OCR 처리 시작');
      
      // 15초 타임아웃으로 OCR 처리
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('OCR 처리 시간 초과 (15초)'));
        }, 15000);
      });
      
      const ocrPromise = performGoogleVisionOCR(referenceImage);
      const extractedText = await Promise.race([ocrPromise, timeoutPromise]);
      
      // Key:Value 구조로 파싱
      const parsedData = parseEquipmentText(extractedText);
      setReferenceData(parsedData);
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ 기준값 OCR 완료 (${processingTime}ms):`, parsedData);
      
      toast({
        title: "✅ 기준값 텍스트 추출 완료",
        description: `${Object.keys(parsedData.extractedData).length}개 Key:Value 데이터 추출됨 (${Math.round(processingTime/1000)}초)`
      });
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`❌ 기준값 OCR 오류 (${processingTime}ms):`, error);
      
      // 폴백 처리
      const fallbackData = parseEquipmentText(
        `OCR 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n` +
        `이미지 품질을 개선하여 다시 시도해주세요.\n` +
        `권장사항: 밝은 조명, 정면 촬영, 흔들림 없이 촬영`
      );
      
      setReferenceData(fallbackData);
      
      toast({
        title: "⚠️ OCR 처리 지연/실패",
        description: `${Math.round(processingTime/1000)}초 후 실패. 이미지 품질을 개선하여 다시 시도해주세요.`,
        variant: "destructive"
      });
    } finally {
      setIsProcessingRef(false);
    }
  };

  const processMeasurementOCR = async () => {
    if (!measurementImage) {
      toast({
        title: "❌ 이미지 없음",
        description: "먼저 측정값 이미지를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessingMeas(true);
    const startTime = Date.now();
    
    try {
      console.log('🔍 측정값 이미지 OCR 처리 시작');
      
      // 15초 타임아웃으로 OCR 처리
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('OCR 처리 시간 초과 (15초)'));
        }, 15000);
      });
      
      const ocrPromise = performGoogleVisionOCR(measurementImage);
      const extractedText = await Promise.race([ocrPromise, timeoutPromise]);
      
      // Key:Value 구조로 파싱
      const parsedData = parseEquipmentText(extractedText);
      setMeasurementData(parsedData);
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ 측정값 OCR 완료 (${processingTime}ms):`, parsedData);
      
      toast({
        title: "✅ 측정값 텍스트 추출 완료",
        description: `${Object.keys(parsedData.extractedData).length}개 Key:Value 데이터 추출됨 (${Math.round(processingTime/1000)}초)`
      });
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`❌ 측정값 OCR 오류 (${processingTime}ms):`, error);
      
      // 폴백 처리
      const fallbackData = parseEquipmentText(
        `OCR 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n` +
        `이미지 품질을 개선하여 다시 시도해주세요.\n` +
        `권장사항: 밝은 조명, 정면 촬영, 흔들림 없이 촬영`
      );
      
      setMeasurementData(fallbackData);
      
      toast({
        title: "⚠️ OCR 처리 지연/실패",
        description: `${Math.round(processingTime/1000)}초 후 실패. 이미지 품질을 개선하여 다시 시도해주세요.`,
        variant: "destructive"
      });
    } finally {
      setIsProcessingMeas(false);
    }
  };

  const resetOCRData = () => {
    setReferenceData(null);
    setMeasurementData(null);
    console.log('🔄 OCR 데이터 초기화 완료');
  };

  const retryReferenceOCR = () => {
    if (referenceImage) {
      processReferenceOCR();
    }
  };

  const retryMeasurementOCR = () => {
    if (measurementImage) {
      processMeasurementOCR();
    }
  };

  return {
    referenceImage,
    measurementImage,
    referenceData,
    measurementData,
    isProcessingRef,
    isProcessingMeas,
    handleReferenceImageSelect,
    handleMeasurementImageSelect,
    processReferenceOCR,
    processMeasurementOCR,
    resetOCRData,
    retryReferenceOCR,
    retryMeasurementOCR
  };
};
