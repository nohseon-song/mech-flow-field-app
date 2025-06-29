
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { performAdvancedAnalysis, type AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';

export const useAnalysisProcessing = () => {
  const [analysisResult, setAnalysisResult] = useState<AdvancedAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableResult, setEditableResult] = useState<AdvancedAnalysisResult | null>(null);
  const [userComment, setUserComment] = useState('');
  const { equipmentData, addAnalysisToHistory } = useEquipmentStorage();

  const performComparison = async (
    referenceText: string,
    measurementText: string,
    referenceImage: File | null,
    measurementImage: File | null
  ) => {
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
      
      const analysis = await performAdvancedAnalysis(
        referenceText,
        measurementText,
        equipmentData.equipmentName || '미지정',
        equipmentData.location || '미지정'
      );
      
      analysis.timestamp = analysisStartTime;
      analysis.equipmentName = equipmentData.equipmentName;
      analysis.location = equipmentData.location;
      
      setAnalysisResult(analysis);
      setEditableResult(analysis);
      
      const historyData = {
        ...analysis,
        referenceText,
        measurementText,
        userComment: '',
        images: {
          reference: referenceImage?.name,
          measurement: measurementImage?.name
        }
      };
      
      addAnalysisToHistory(historyData);
      
      console.log('AI 분석 완료:', analysis);
      
      toast({
        title: "AI 분석 완료",
        description: "전문 공학적 분석이 완료되었습니다. 결과를 편집하실 수 있습니다."
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

  const canAnalyze = (referenceText: string, measurementText: string) => {
    return referenceText.trim().length > 0 && 
           measurementText.trim().length > 0 && 
           equipmentData.equipmentName.trim().length > 0 && 
           !isAnalyzing;
  };

  const startEditing = () => {
    if (analysisResult) {
      setEditableResult({ ...analysisResult });
      setIsEditing(true);
    }
  };

  const saveEditing = () => {
    if (editableResult) {
      setAnalysisResult(editableResult);
      setIsEditing(false);
      toast({
        title: "편집 완료",
        description: "분석 결과가 수정되었습니다."
      });
    }
  };

  const cancelEditing = () => {
    setEditableResult(analysisResult);
    setIsEditing(false);
  };

  const updateEditableResult = (field: keyof AdvancedAnalysisResult, value: any) => {
    if (editableResult) {
      setEditableResult({ ...editableResult, [field]: value });
    }
  };

  return {
    analysisResult,
    isAnalyzing,
    isEditing,
    editableResult,
    userComment,
    setUserComment,
    performComparison,
    canAnalyze,
    setAnalysisResult,
    startEditing,
    saveEditing,
    cancelEditing,
    updateEditableResult
  };
};
