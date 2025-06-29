
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
          title: "파일 형식 오류",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive"
        });
        return;
      }
      setReferenceImage(file);
      setReferenceData(null);
      
      toast({
        title: "기준값 이미지 선택됨",
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
      });
      
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
      setMeasurementData(null);
      
      toast({
        title: "측정값 이미지 선택됨",
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
      });
      
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
    
    try {
      console.log('기준값 이미지 OCR 처리 시작');
      
      const extractedText = await performGoogleVisionOCR(referenceImage);
      const parsedData = parseEquipmentText(extractedText);
      
      setReferenceData(parsedData);
      
      console.log('기준값 OCR 완료:', parsedData);
      
      toast({
        title: "기준값 텍스트 추출 완료",
        description: `${Object.keys(parsedData.extractedData).length}개 데이터 추출됨`
      });
    } catch (error) {
      console.error('기준값 OCR 오류:', error);
      toast({
        title: "OCR 처리 실패",
        description: "기준값 이미지 처리 중 오류가 발생했습니다. 이미지 품질을 확인해주세요.",
        variant: "destructive"
      });
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
    
    try {
      console.log('측정값 이미지 OCR 처리 시작');
      
      const extractedText = await performGoogleVisionOCR(measurementImage);
      const parsedData = parseEquipmentText(extractedText);
      
      setMeasurementData(parsedData);
      
      console.log('측정값 OCR 완료:', parsedData);
      
      toast({
        title: "측정값 텍스트 추출 완료",
        description: `${Object.keys(parsedData.extractedData).length}개 데이터 추출됨`
      });
    } catch (error) {
      console.error('측정값 OCR 오류:', error);
      toast({
        title: "OCR 처리 실패",
        description: "측정값 이미지 처리 중 오류가 발생했습니다. 이미지 품질을 확인해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingMeas(false);
    }
  };

  const resetOCRData = () => {
    setReferenceData(null);
    setMeasurementData(null);
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
    resetOCRData
  };
};
