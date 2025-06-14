
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

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
      setSelectedFile(file);
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

    // Google Gemini Vision API 호출 시뮬레이션
    setTimeout(() => {
      const mockAnalysis = {
        causes: [
          "배관 연결부 노후화로 인한 실링 불량",
          "과도한 진동으로 인한 볼트 풀림",
          "온도 변화에 따른 열팽창/수축"
        ],
        symptoms: [
          "배관 연결부에서 미량 누수 발견",
          "주변 바닥에 물방울 흔적 확인",
          "연결부 주변 녹 발생 징후"
        ],
        improvements: guideline === 'operation' ? [
          "연결부 조임 토크 재점검 (권장: 50Nm)",
          "실링재 교체 후 누수 재확인",
          "정기 점검 주기를 월 1회로 단축",
          "진동 저감을 위한 댐퍼 설치 검토"
        ] : [
          "기계설비법 제15조에 따른 성능점검 실시",
          "KS B 0251 배관 접합 기준 준수",
          "산업안전보건법 제36조 정기점검 이행",
          "설비 운전 매뉴얼 개정 필요"
        ]
      };

      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);

      toast({
        title: "분석 완료",
        description: "사진 분석이 완료되었습니다."
      });
    }, 3000);
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
