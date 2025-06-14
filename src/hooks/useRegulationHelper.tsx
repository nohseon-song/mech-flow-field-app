
import { useState } from 'react';
import { useGuidelines } from './useGuidelines';
import { toast } from '@/hooks/use-toast';

export const useRegulationHelper = () => {
  const [question, setQuestion] = useState('');
  const [guideline, setGuideline] = useState('knowledge');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getGuideline } = useGuidelines();

  const generateRegulationAnswer = (userQuestion: string, guidelineType: 'operation' | 'knowledge') => {
    const selectedGuideline = getGuideline(guidelineType);
    
    // 질문 키워드 분석
    const keywords = {
      성능점검: ['성능점검', '점검주기', '정기점검'],
      면적기준: ['면적', '제곱미터', '규모', '크기'],
      건물용도: ['복합건물', '업무시설', '판매시설', '숙박시설'],
      설비종류: ['냉난방', '급탕', '환기', '보일러', '냉동기'],
      벌칙: ['벌칙', '과태료', '처벌', '제재'],
      신고: ['신고', '보고', '제출', '접수']
    };

    let category = '일반';
    for (const [key, words] of Object.entries(keywords)) {
      if (words.some(word => userQuestion.includes(word))) {
        category = key;
        break;
      }
    }

    let response = '';

    if (guidelineType === 'operation') {
      // 실무 중심 답변
      switch (category) {
        case '성능점검':
          response = `**실무 중심 성능점검 가이드**

질문: ${userQuestion}

**실무 대응 방안:**
1. **점검 주기 확인**
   - 연면적 15,000㎡ 이상 복합건물: 연 1회
   - 연면적 3,000㎡ 이상: 2년 1회
   - 신축 건물: 최초 가동 후 3년 이내

2. **점검 준비사항**
   - 설비 운전일지 및 정비기록 준비
   - 준공도서 및 설계도면 확인
   - 점검업체 자격 확인 (전문기관)

3. **점검 실행 단계**
   - 사전 안전조치 및 작업 허가
   - 체계적 점검 실시 (성능, 안전, 효율)
   - 점검 결과 즉시 검토 및 조치

**주의사항:**
- 점검 중 안전사고 예방 최우선
- 이상 발견시 즉시 운전 중단 검토
- 점검 결과는 반드시 기록 보존`;
          break;
        case '면적기준':
          response = `**면적 기준 실무 적용**

질문: ${userQuestion}

**실무 확인 절차:**
1. **연면적 산정**
   - 건축물대장 또는 건축허가서 확인
   - 실제 사용 면적과 법적 면적 구분
   - 증축/개축 이력 반영

2. **적용 기준**
   - 15,000㎡ 이상: 연 1회 점검
   - 3,000㎡ 이상: 2년 1회 점검
   - 3,000㎡ 미만: 자체 점검 가능

3. **실무 팁**
   - 면적 경계선 근처는 사전 확인 필수
   - 용도별 면적 합산 방법 숙지
   - 관할청 사전 문의 권장`;
          break;
        default:
          response = `**실무 중심 답변**

질문: ${userQuestion}

**기본 대응 방안:**
1. **관련 법규 확인**
   - 기계설비법 및 시행령 검토
   - 지자체 조례 추가 확인
   - 최신 개정사항 반영

2. **실무 절차**
   - 담당 부서 사전 협의
   - 필요 서류 준비 및 제출
   - 이행 일정 수립 및 관리

3. **주의사항**
   - 법정 기한 엄수
   - 관련 기록 철저한 보존
   - 변경사항 즉시 반영`;
      }
    } else {
      // 법규 중심 답변
      switch (category) {
        case '성능점검':
          response = `**기계설비법 성능점검 규정**

질문: ${userQuestion}

**관련 법규:**
- 기계설비법 제15조 (성능점검)
- 기계설비법 시행령 제20조 (점검방법 및 주기)
- 기계설비법 시행규칙 제12조 (점검기관)

**법정 점검 주기:**
1. **연면적 15,000㎡ 이상 복합건물**
   - 점검주기: 매년 1회
   - 점검기관: 전문기관 (법 시행령 별표4)
   - 점검시기: 전년도 점검일로부터 1년 이내

2. **연면적 3,000㎡ 이상 15,000㎡ 미만**
   - 점검주기: 2년마다 1회
   - 점검기관: 전문기관 또는 자체점검
   - 점검시기: 전차 점검일로부터 2년 이내

**점검 결과 보고:**
- 보고기한: 점검완료 후 30일 이내
- 보고기관: 관할 시·도지사
- 보고서류: 성능점검 결과보고서 (별지 제7호 서식)

**벌칙 조항:**
- 미점검시: 1천만원 이하 과태료 (법 제34조)
- 허위보고시: 2년 이하 징역 또는 2천만원 이하 벌금`;
          break;
        case '면적기준':
          response = `**기계설비법 면적 기준 적용**

질문: ${userQuestion}

**법적 면적 기준:**
- 기계설비법 시행령 제20조 제1항
- 연면적 산정: 건축법 시행령 제119조 준용

**세부 기준:**
1. **15,000㎡ 이상**
   - 적용대상: 업무시설, 판매시설, 숙박시설 등
   - 점검주기: 매년 1회
   - 점검기관: 전문기관 필수

2. **3,000㎡ 이상 15,000㎡ 미만**
   - 점검주기: 2년마다 1회
   - 점검방법: 전문기관 또는 자체점검 선택

3. **3,000㎡ 미만**
   - 법정 점검 의무 없음
   - 단, 자체 안전관리 권장

**면적 산정 기준:**
- 건축물대장상 연면적 기준
- 증축·개축시 합산 면적 적용
- 용도별 면적 구분 없이 전체 연면적`;
          break;
        default:
          response = `**기계설비법 규정 준수 답변**

질문: ${userQuestion}

**관련 법규 체계:**
- 기계설비법 (법률 제18298호)
- 기계설비법 시행령 (대통령령 제32678호)
- 기계설비법 시행규칙 (부령 제976호)

**주요 준수사항:**
1. **성능점검 의무**
   - 법 제15조에 따른 정기 성능점검
   - 점검결과 관할청 보고 의무
   - 점검기록 3년간 보존

2. **기술기준 준수**
   - 관련 KS 표준 적용
   - 에너지효율 기준 준수
   - 안전기준 우선 적용

3. **신고 및 보고 의무**
   - 설치신고 (법 제9조)
   - 변경신고 (법 제11조)
   - 사고신고 (법 제26조)

**벌칙 및 과태료:**
- 무허가 설치: 2년 이하 징역 또는 2천만원 이하 벌금
- 미점검: 1천만원 이하 과태료
- 허위신고: 500만원 이하 과태료`;
      }
    }

    // 사용자 설정 지침 추가 반영
    if (selectedGuideline && selectedGuideline.trim()) {
      response += `\n\n**맞춤 지침 적용:**\n${selectedGuideline.substring(0, 300)}${selectedGuideline.length > 300 ? '...' : ''}`;
    }

    return response;
  };

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

    // AI 응답 생성
    setTimeout(() => {
      const generatedAnswer = generateRegulationAnswer(question, guideline as 'operation' | 'knowledge');
      setAnswer(generatedAnswer);
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
