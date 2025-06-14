
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useGuidelines } from '@/hooks/useGuidelines';

export const useRegulationHelper = () => {
  const { getGuideline } = useGuidelines();
  const [question, setQuestion] = useState('');
  const [guideline, setGuideline] = useState('operation');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "질문을 입력해주세요",
        description: "기계설비 법규에 대한 질문을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Google Gemini API 호출 시뮬레이션 (실제로는 저장된 지침 사용)
    setTimeout(() => {
      const userGuideline = getGuideline(guideline as 'operation' | 'knowledge');
      
      const mockAnswer = userGuideline ? 
        `**사용자 지침 기반 답변**

질문: "${question}"

**적용된 지침**:
${userGuideline.substring(0, 300)}...

**지침 기반 답변**:
사용자가 설정한 ${guideline === 'operation' ? '운용지침' : '지식지침'}에 따라 다음과 같이 답변드립니다:

- 설정된 지침의 우선순위에 따른 접근 방식 적용
- 맞춤형 기준과 절차에 따른 구체적 가이드 제공
- 사용자 조직의 특성을 반영한 실무적 해결책 제시

**추가 권장사항**:
- 지침 업데이트가 필요한 경우 설정 메뉴에서 수정 가능
- 새로운 규정 변경사항이 있을 경우 지침 재검토 권장

더 구체적인 답변을 원하시면 지침을 더 세부적으로 설정해보세요.
        ` :
        guideline === 'operation' ? 
        `**기본 실무 중심 답변**

질문하신 "${question}"에 대해 실무적 관점에서 답변드리겠습니다.

**현장 적용 가이드**:
- 기계설비의 성능점검은 연 1회 이상 실시해야 합니다.
- 점검 시 체크리스트를 활용하여 누락 방지
- 점검 결과는 디지털 기록으로 3년간 보관

**실무 절차**:
1. 사전 점검 계획 수립 (설비별 맞춤 체크리스트)
2. 안전장비 착용 후 현장 점검 실시
3. 실시간 데이터 입력 및 사진 촬영
4. 이상 발견 시 즉시 조치 및 보고

**현장 팁**:
- 점검 앱을 활용하여 효율성 향상
- 예비부품 재고 확인 동시 진행
- 계절별 특이사항 사전 체크

⚠️ 조직 맞춤형 운용지침을 설정하려면 AI 기능 → 지침설정을 이용하세요.
        ` :
        `**기본 법규/표준 기준 답변**

질문하신 "${question}"에 대해 법규 및 표준에 근거하여 답변드리겠습니다.

**관련 법규**: 기계설비법 제15조, 기계설비법 시행규칙 제22조

**주요 내용**:
- 기계설비의 성능점검은 연 1회 이상 실시해야 합니다.
- 점검 결과는 3년간 보관해야 합니다.
- 점검 시 안전기준을 준수해야 합니다.

**법정 의무사항**:
1. 성능점검 실시 의무 (기계설비법 제15조)
2. 점검기록 작성 및 보관 (시행규칙 제22조)
3. 안전관리자 배치 (건축물관리법)
4. 정기 교육 이수 (산업안전보건법)

**표준 준수사항**:
- KS B 0251: 배관 설치 및 점검 기준
- KS C 4304: 전기설비 안전 기준
- 건축기계설비 표준시방서 적용

⚠️ 조직 맞춤형 지식지침을 설정하려면 AI 기능 → 지침설정을 이용하세요.
        `;
      
      setAnswer(mockAnswer.trim());
      setIsLoading(false);
      
      toast({
        title: "답변 완료",
        description: `${guideline === 'operation' ? '실무 중심' : '법규/표준 기반'} AI 전문가가 답변을 완료했습니다.`
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
