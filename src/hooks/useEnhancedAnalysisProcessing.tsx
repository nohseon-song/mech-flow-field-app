
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { performAdvancedAnalysis, type AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';
import { type ParsedEquipmentData } from '@/utils/textDataParser';

export const useEnhancedAnalysisProcessing = () => {
  const [analysisResult, setAnalysisResult] = useState<AdvancedAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableResult, setEditableResult] = useState<AdvancedAnalysisResult | null>(null);
  const [userComment, setUserComment] = useState('');
  const { equipmentData, addAnalysisToHistory } = useEquipmentStorage();

  const performComparison = async (
    referenceData: ParsedEquipmentData,
    measurementData: ParsedEquipmentData,
    referenceImage: File | null,
    measurementImage: File | null
  ) => {
    console.log('향상된 AI 분석 시작');
    
    if (!referenceData || !measurementData) {
      toast({
        title: "데이터 부족",
        description: "두 이미지 모두 텍스트 추출을 완료해주세요.",
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
      const analysis = await performAdvancedAnalysis(
        referenceData.formattedDisplay,
        measurementData.formattedDisplay,
        equipmentData.equipmentName,
        equipmentData.location
      );
      
      analysis.timestamp = analysisStartTime;
      analysis.equipmentName = equipmentData.equipmentName;
      analysis.location = equipmentData.location;
      
      setAnalysisResult(analysis);
      setEditableResult({ ...analysis });
      
      const historyData = {
        ...analysis,
        referenceData: referenceData.extractedData,
        measurementData: measurementData.extractedData,
        userComment: '',
        images: {
          reference: referenceImage?.name,
          measurement: measurementImage?.name
        }
      };
      
      addAnalysisToHistory(historyData);
      
      console.log('향상된 AI 분석 완료:', analysis);
      
      toast({
        title: "AI 분석 완료",
        description: "전문 공학적 분석이 완료되었습니다. 결과를 편집하거나 전송할 수 있습니다."
      });
    } catch (error) {
      console.error('분석 오류:', error);
      toast({
        title: "분석 실패",
        description: "AI 분석 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = (referenceData: ParsedEquipmentData | null, measurementData: ParsedEquipmentData | null) => {
    return referenceData !== null && 
           measurementData !== null && 
           equipmentData.equipmentName.trim().length > 0 && 
           !isAnalyzing;
  };

  const startEditing = () => {
    if (analysisResult) {
      setEditableResult({ ...analysisResult });
      setIsEditing(true);
      toast({
        title: "편집 모드 시작",
        description: "분석 결과를 수정할 수 있습니다. 완료 후 저장 버튼을 클릭해주세요."
      });
    }
  };

  const saveEditing = () => {
    if (editableResult) {
      setAnalysisResult({ ...editableResult });
      setIsEditing(false);
      toast({
        title: "편집 완료",
        description: "분석 결과가 성공적으로 수정되었습니다."
      });
    }
  };

  const cancelEditing = () => {
    setEditableResult(analysisResult ? { ...analysisResult } : null);
    setIsEditing(false);
    toast({
      title: "편집 취소",
      description: "변경사항이 취소되었습니다."
    });
  };

  const updateEditableField = (field: keyof AdvancedAnalysisResult, value: any) => {
    if (editableResult) {
      setEditableResult({ ...editableResult, [field]: value });
    }
  };

  const updateRecommendation = (index: number, value: string) => {
    if (editableResult && editableResult.recommendations) {
      const newRecommendations = [...editableResult.recommendations];
      newRecommendations[index] = value;
      setEditableResult({ ...editableResult, recommendations: newRecommendations });
    }
  };

  const addRecommendation = () => {
    if (editableResult) {
      const newRecommendations = [...(editableResult.recommendations || []), '새로운 권장사항을 입력하세요'];
      setEditableResult({ ...editableResult, recommendations: newRecommendations });
    }
  };

  const removeRecommendation = (index: number) => {
    if (editableResult && editableResult.recommendations) {
      const newRecommendations = editableResult.recommendations.filter((_, i) => i !== index);
      setEditableResult({ ...editableResult, recommendations: newRecommendations });
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
    updateEditableField,
    updateRecommendation,
    addRecommendation,
    removeRecommendation
  };
};
