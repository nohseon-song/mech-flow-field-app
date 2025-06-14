
import { useState } from 'react';
import { useGuidelines } from './useGuidelines';
import { toast } from '@/hooks/use-toast';

export const useRegulationHelper = () => {
  const [question, setQuestion] = useState('');
  const [guideline, setGuideline] = useState('knowledge');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getGuideline } = useGuidelines();

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "질문을 입력해주세요",
        description: "기계설비법 관련 질문을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const selectedGuideline = getGuideline(guideline as 'operation' | 'knowledge');
      
      const mockAnswer = guideline === 'operation' ? 
        `**실무 중심 답변**

질문: ${question}

**실무 대응 방안**:
1. **즉시 조치사항**
   - 현장 안전 확보 최우선
   - 설비 운전 중단 여부 판단
   - 관련 부서 신속 보고

2. **점검 절차**
   - 육안 점검 및 계측기 활용
   - 관련 도면 및 매뉴얼 확인
   - 전문가 자문 요청

3. **보고 및 기록**
   - 점검 결과 상세 기록
   - 사진 촬영 및 증빙 자료 수집
   - 관련 부서 공유 및 보고

**주의사항**:
- 안전 수칙 철저 준수
- 무리한 작업 금지
- 전문가 도움 적극 활용` :
        `**법규 기준 답변**

질문: ${question}

**관련 법규**:
- 기계설비법 제15조 (성능점검)
- 기계설비법 시행령 제20조 (점검방법)
- 산업안전보건법 제36조 (정기점검)

**법적 요구사항**:
1. **성능점검 의무**
   - 정기점검 주기 준수 (연 1회 이상)
   - 전문기관 점검 의뢰
   - 점검 결과 보고서 작성

2. **기술기준 준수**
   - KS B 관련 표준 적용
   - 제조사 권장 기준 따름
   - 안전 기준 우선 적용

3. **기록 보존 의무**
   - 점검 기록 3년간 보존
   - 정부 요청 시 제출 의무
   - 디지털 기록 권장

**벌칙 조항**:
- 미점검 시 과태료 부과
- 허위 기록 시 형사처벌
- 사고 발생 시 가중처벌`;

      setAnswer(mockAnswer);
      setIsLoading(false);

      toast({
        title: "답변 완료",
        description: "규정 관련 답변이 생성되었습니다."
      });
    }, 2500);
  };

  return {
    question,
    setQuestion,
    guideline,
    setGuideline,
    answer,
    isLoading,
    handleAskQuestion
  };
};
