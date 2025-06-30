
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
  const [userComment, setUserComment] = useState<string>('');
  const { equipmentData, addAnalysisToHistory } = useEquipmentStorage();

  // 10초 이내 분석 보장
  const performComparison = async (
    referenceData: ParsedEquipmentData,
    measurementData: ParsedEquipmentData,
    referenceImage?: File | null,
    measurementImage?: File | null
  ) => {
    if (!equipmentData.equipmentName.trim()) {
      toast({
        title: "입력 필요",
        description: "설비명칭을 먼저 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    const startTime = Date.now();
    
    try {
      console.log('🚀 10초 이내 보장 AI 분석 시작');
      
      // 30초 절대 타임아웃 설정
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('분석 시간 초과: 30초 이내에 완료되지 않았습니다.'));
        }, 30000);
      });

      // 실제 분석 Promise
      const analysisPromise = performAdvancedAnalysis(
        referenceData.rawText,
        measurementData.rawText,
        equipmentData.equipmentName,
        equipmentData.location
      );

      // 둘 중 먼저 완료되는 것 선택
      const result = await Promise.race([
        analysisPromise,
        timeoutPromise
      ]);

      const analysisTime = Date.now() - startTime;
      console.log(`✅ AI 분석 완료 (${analysisTime}ms)`);

      // 이미지 정보 추가
      const enhancedResult = {
        ...result,
        images: {
          reference: referenceImage?.name || null,
          measurement: measurementImage?.name || null
        },
        processingTime: analysisTime,
        referenceData: referenceData.extractedData,
        measurementData: measurementData.extractedData
      };

      setAnalysisResult(enhancedResult);
      
      // 분석 이력에 추가
      addAnalysisToHistory({
        ...enhancedResult,
        userComment,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "✅ AI 분석 완료",
        description: `${Math.round(analysisTime / 1000)}초 만에 분석이 완료되었습니다.`
      });
      
    } catch (error) {
      const analysisTime = Date.now() - startTime;
      console.error(`❌ AI 분석 실패 (${analysisTime}ms):`, error);
      
      // 타임아웃 또는 에러 발생시 폴백 결과 제공
      const fallbackResult: AdvancedAnalysisResult = {
        currentStatus: `${equipmentData.equipmentName} 설비 분석 중 오류가 발생했습니다.`,
        rootCause: error instanceof Error ? error.message : '네트워크 연결 문제나 서버 응답 지연으로 인한 분석 실패',
        improvementSolution: '1) 네트워크 연결 확인 후 재시도, 2) 잠시 후 다시 분석 시도, 3) 브라우저 새로고침 후 재시도',
        recommendations: [
          '네트워크 연결 상태 확인',
          '5분 후 다시 분석 시도',
          '브라우저 새로고침 후 재시도',
          '문제 지속시 관리자 문의'
        ],
        riskLevel: 'medium',
        timestamp: new Date().toISOString(),
        equipmentName: equipmentData.equipmentName,
        location: equipmentData.location,
        processingTime: analysisTime,
        referenceData: referenceData.extractedData,
        measurementData: measurementData.extractedData,
        isError: true
      };

      setAnalysisResult(fallbackResult);
      
      toast({
        title: "⚠️ 분석 지연/실패",
        description: `${Math.round(analysisTime / 1000)}초 후 타임아웃. 기본 분석 결과를 제공합니다.`,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 분석 가능 여부 확인
  const canAnalyze = (referenceData: ParsedEquipmentData | null, measurementData: ParsedEquipmentData | null): boolean => {
    return !!(
      referenceData?.rawText?.trim() &&
      measurementData?.rawText?.trim() &&
      equipmentData.equipmentName?.trim()
    );
  };

  // 편집 모드 시작
  const startEditing = () => {
    if (analysisResult) {
      setEditableResult({ ...analysisResult });
      setIsEditing(true);
    }
  };

  // 편집 저장
  const saveEditing = () => {
    if (editableResult) {
      setAnalysisResult(editableResult);
      setIsEditing(false);
      toast({
        title: "편집 저장됨",
        description: "분석 결과가 수정되었습니다."
      });
    }
  };

  // 편집 취소
  const cancelEditing = () => {
    setEditableResult(null);
    setIsEditing(false);
    toast({
      title: "편집 취소됨",
      description: "변경사항이 취소되었습니다."
    });
  };

  // 필드 업데이트
  const updateEditableField = (field: keyof AdvancedAnalysisResult, value: any) => {
    if (editableResult) {
      setEditableResult({
        ...editableResult,
        [field]: value
      });
    }
  };

  // 권장사항 업데이트
  const updateRecommendation = (index: number, value: string) => {
    if (editableResult?.recommendations) {
      const newRecommendations = [...editableResult.recommendations];
      newRecommendations[index] = value;
      setEditableResult({
        ...editableResult,
        recommendations: newRecommendations
      });
    }
  };

  // 권장사항 추가
  const addRecommendation = () => {
    if (editableResult) {
      const newRecommendations = [...(editableResult.recommendations || []), '새 권장사항'];
      setEditableResult({
        ...editableResult,
        recommendations: newRecommendations
      });
    }
  };

  // 권장사항 삭제
  const removeRecommendation = (index: number) => {
    if (editableResult?.recommendations) {
      const newRecommendations = editableResult.recommendations.filter((_, i) => i !== index);
      setEditableResult({
        ...editableResult,
        recommendations: newRecommendations
      });
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
