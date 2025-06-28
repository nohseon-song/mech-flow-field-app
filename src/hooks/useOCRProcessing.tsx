
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { extractTextFromImage, type OCRResult } from '@/utils/ocrProcessor';
import { performGoogleVisionOCR } from '@/utils/advancedAnalysis';

export const useOCRProcessing = () => {
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [measurementImage, setMeasurementImage] = useState<File | null>(null);
  const [referenceOCR, setReferenceOCR] = useState<OCRResult | null>(null);
  const [measurementOCR, setMeasurementOCR] = useState<OCRResult | null>(null);
  const [referenceText, setReferenceText] = useState('');
  const [measurementText, setMeasurementText] = useState('');
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
      const extractedText = await performGoogleVisionOCR(referenceImage);
      setReferenceText(extractedText);
      
      console.log('기준값 OCR 완료:', extractedText);
      
      toast({
        title: "기준값 이미지 OCR 완료",
        description: `텍스트 추출이 완료되었습니다. (${extractedText.length}자)`
      });
    } catch (error) {
      console.error('기준값 OCR 오류:', error);
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
      const extractedText = await performGoogleVisionOCR(measurementImage);
      setMeasurementText(extractedText);
      
      console.log('측정값 OCR 완료:', extractedText);
      
      toast({
        title: "측정값 이미지 OCR 완료",
        description: `텍스트 추출이 완료되었습니다. (${extractedText.length}자)`
      });
    } catch (error) {
      console.error('측정값 OCR 오류:', error);
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

  const resetOCRData = () => {
    setReferenceText('');
    setMeasurementText('');
    setReferenceOCR(null);
    setMeasurementOCR(null);
  };

  return {
    referenceImage,
    measurementImage,
    referenceOCR,
    measurementOCR,
    referenceText,
    measurementText,
    isProcessingRef,
    isProcessingMeas,
    handleReferenceImageSelect,
    handleMeasurementImageSelect,
    processReferenceOCR,
    processMeasurementOCR,
    resetOCRData
  };
};
