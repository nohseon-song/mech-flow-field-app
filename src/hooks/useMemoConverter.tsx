
import { useState } from 'react';
import { useGuidelines } from './useGuidelines';
import { toast } from '@/hooks/use-toast';

export const useMemoConverter = () => {
  const [memo, setMemo] = useState('');
  const [guideline, setGuideline] = useState('operation');
  const [convertedData, setConvertedData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getGuideline } = useGuidelines();

  const handleConvert = async () => {
    if (!memo.trim()) {
      toast({
        title: "메모를 입력해주세요",
        description: "변환할 현장 메모를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // AI 변환 시뮬레이션
    setTimeout(() => {
      const selectedGuideline = getGuideline(guideline as 'operation' | 'knowledge');
      
      const convertedResult = guideline === 'operation' ? 
        `**현장 점검 보고서**

**점검일시**: ${new Date().toLocaleDateString('ko-KR')}
**점검자**: 현장 담당자

**점검 내용**:
${memo}

**발견된 문제점**:
- 설비 성능 저하 징후 확인
- 안전상 주의 사항 발견

**조치 사항**:
- 즉시 보수 작업 필요
- 정기 점검 주기 단축 검토
- 운전 조건 재검토 필요

**후속 조치 계획**:
- 전문 업체 점검 의뢰
- 부품 교체 일정 수립
- 예방 정비 계획 수정` :
        `**기계설비 법규 준수 점검 보고서**

**관련 법규**: 기계설비법 제15조, 산업안전보건법 제36조
**점검 기준**: KS 표준 및 관련 기술기준

**현장 상황**:
${memo}

**법규 준수 상태**:
- 정기점검 의무 이행 여부 확인 필요
- 안전 기준 준수 여부 점검 요구
- 기술 기준 적합성 검토 필요

**규정 준수 조치**:
- 법정 점검 일정 수립
- 기술 기준 준수 확인
- 안전 관리 체계 보완

**참고 규정**:
- 기계설비법 시행령 제20조
- 관련 기술기준 KEMCO-2024`;

      setConvertedData(convertedResult);
      setIsLoading(false);

      toast({
        title: "변환 완료",
        description: "메모가 성공적으로 변환되었습니다."
      });
    }, 2000);
  };

  return {
    memo,
    setMemo,
    guideline,
    setGuideline,
    convertedData,
    isLoading,
    handleConvert
  };
};
