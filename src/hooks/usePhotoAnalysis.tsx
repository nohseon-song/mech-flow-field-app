
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { analyzeEquipmentImage } from '@/utils/imageAnalysis';

export const usePhotoAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [guideline, setGuideline] = useState('operation');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    causes: string[];
    symptoms: string[];
    improvements: string[];
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        toast({
          title: "파일 형식 오류",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive"
        });
        return;
      }
      
      // 파일 크기 확인 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: "10MB 이하의 이미지 파일을 업로드해주세요.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      // 이전 분석 결과 초기화
      setAnalysisResult(null);
      console.log('선택된 파일:', file.name, file.type, `${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }
  };

  const analyzePhoto = async () => {
    if (!selectedFile) {
      toast({
        title: "사진을 선택해주세요",
        description: "분석할 설비 사진을 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    console.log('실제 이미지 분석 시작:', selectedFile.name);

    try {
      toast({
        title: "분석 진행 중",
        description: "이미지를 픽셀 단위로 분석하고 있습니다..."
      });

      // 실제 이미지 분석 수행
      const baseAnalysis = await analyzeEquipmentImage(selectedFile);
      
      // 지침에 따른 개선방안 조정
      const enhancedAnalysis = {
        ...baseAnalysis,
        improvements: guideline === 'operation' 
          ? enhanceWithOperationalGuidelines(baseAnalysis.improvements)
          : enhanceWithKnowledgeGuidelines(baseAnalysis.improvements)
      };

      setAnalysisResult(enhancedAnalysis);
      setIsAnalyzing(false);

      toast({
        title: "분석 완료",
        description: `${selectedFile.name} 실제 이미지 분석이 완료되었습니다.`
      });
      
      console.log('실제 분석 완료:', enhancedAnalysis);
      
    } catch (error) {
      console.error('사진 분석 오류:', error);
      setIsAnalyzing(false);
      
      toast({
        title: "분석 실패",
        description: "이미지 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  };

  // 운용지침 기반 개선방안 강화
  const enhanceWithOperationalGuidelines = (improvements: string[]) => {
    return improvements.map(improvement => {
      return `${improvement} (운용지침: 작업자 안전 확보 및 운전 중단 최소화 원칙 적용)`;
    });
  };

  // 지식지침 기반 개선방안 강화
  const enhanceWithKnowledgeGuidelines = (improvements: string[]) => {
    return improvements.map(improvement => {
      return `${improvement} (관련법규: 기계설비법 제15조, 산업안전보건법 제36조 준수 및 기술기준 적용)`;
    });
  };

  return {
    selectedFile,
    guideline,
    setGuideline,
    isAnalyzing,
    analysisResult,
    handleFileSelect,
    analyzePhoto
  };
};
