
import { useState } from 'react';
import { useGuidelines } from './useGuidelines';
import { toast } from '@/hooks/use-toast';

export const useMemoConverter = () => {
  const [memo, setMemo] = useState('');
  const [guideline, setGuideline] = useState('operation');
  const [convertedData, setConvertedData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getGuideline } = useGuidelines();

  const generateConvertedReport = (memoContent: string, guidelineType: 'operation' | 'knowledge') => {
    const selectedGuideline = getGuideline(guidelineType);
    const currentDate = new Date().toLocaleDateString('ko-KR');
    
    // 메모 내용 분석
    const keywords = {
      누수: ['누수', '물', '습기', '젖음'],
      진동: ['진동', '떨림', '소음', '울림'],
      온도: ['뜨거움', '차가움', '온도', '열'],
      압력: ['압력', '압', '게이지'],
      전기: ['전기', '전원', '스위치', '모터'],
      배관: ['배관', '파이프', '밸브', '연결부']
    };

    let issueCategory = '일반';
    for (const [key, words] of Object.entries(keywords)) {
      if (words.some(word => memoContent.includes(word))) {
        issueCategory = key;
        break;
      }
    }

    let convertedResult = '';

    if (guidelineType === 'operation') {
      // 실무 중심 보고서
      convertedResult = `**현장 점검 보고서**

**점검일시**: ${currentDate}
**점검자**: 현장 담당자
**보고서 유형**: 실무 중심 점검 보고

**현장 메모 내용**:
${memoContent}

**상황 분석**:`;

      switch (issueCategory) {
        case '누수':
          convertedResult += `
- 누수 발생 위치 및 정도 확인
- 주변 시설물 피해 범위 조사
- 긴급 조치 필요성 판단`;
          break;
        case '진동':
          convertedResult += `
- 진동 발생 원인 추정 (불균형, 정렬불량 등)
- 주변 구조물 영향도 확인
- 운전 중단 여부 검토`;
          break;
        case '온도':
          convertedResult += `
- 비정상 온도 발생 원인 분석
- 열 손실 또는 과열 위험도 평가
- 효율 저하 영향 검토`;
          break;
        default:
          convertedResult += `
- 설비 성능 저하 징후 확인
- 안전상 주의 사항 발견
- 운전 조건 이상 여부 점검`;
      }

      convertedResult += `

**즉시 조치 사항**:
- 현장 안전 확보 및 위험 요소 제거
- 관련 부서 신속 보고 및 협조 요청
- 임시 조치를 통한 기능 유지

**후속 조치 계획**:
- 전문 업체 정밀 점검 의뢰 예정
- 필요 부품 및 자재 조달 계획 수립
- 예방 정비 계획 수정 검토

**권장 사항**:
- 정기 점검 주기 단축 고려
- 운전 조건 재설정 검토
- 관련 교육 및 매뉴얼 보완`;

    } else {
      // 법규 중심 보고서
      convertedResult = `**기계설비 법규 준수 점검 보고서**

**보고일**: ${currentDate}
**관련 법규**: 기계설비법 제15조, 산업안전보건법 제36조
**점검 기준**: KS 표준 및 관련 기술기준 준용
**보고서 유형**: 법규 준수 중심 점검

**현장 상황 기록**:
${memoContent}

**법규 준수 상태 분석**:`;

      switch (issueCategory) {
        case '누수':
          convertedResult += `
- 기계설비법 시행령 제20조 점검 기준 적용
- KS B 0251 배관 접합 기준 준수 여부 확인
- 산업안전보건법 안전기준 적합성 검토`;
          break;
        case '진동':
          convertedResult += `
- KS B 0256 진동 허용 기준 초과 여부 확인
- 기계설비법 성능 기준 적합성 평가
- 구조 안전성 관련 건축법 기준 검토`;
          break;
        case '온도':
          convertedResult += `
- 에너지이용합리화법 효율 기준 준수 확인
- 기계설비법 안전 온도 기준 적용
- 관련 KS 표준 온도 규격 준수 여부`;
          break;
        default:
          convertedResult += `
- 기계설비법 제15조 성능점검 의무 이행 필요
- 관련 기술기준 및 안전 기준 준수 확인
- 정기점검 및 기록 보존 의무 점검`;
      }

      convertedResult += `

**법정 의무 이행 사항**:
- 기계설비법 제15조에 따른 성능점검 실시 필요
- 점검 결과 관할청 보고 의무 (점검 후 30일 이내)
- 점검 기록 3년간 보존 의무 이행

**기술기준 적용**:
- 관련 KS 표준 및 기술기준 엄격 준수
- 제조사 권장 기준과 법정 기준 중 엄격한 기준 적용
- 안전 관련 기준 우선 적용 원칙

**규정 준수 조치 계획**:
- 법정 점검 일정 수립 및 전문기관 점검 의뢰
- 기술 기준 준수 확인 및 개선 조치
- 관련 서류 작성 및 관할청 제출 준비

**참고 규정**:
- 기계설비법 시행령 제20조 (점검방법)
- 관련 기술기준 KEMCO-G-2024
- 산업안전보건법 시행령 제38조`;
    }

    // 사용자 설정 지침 추가 반영
    if (selectedGuideline && selectedGuideline.trim()) {
      convertedResult += `\n\n**맞춤 지침 적용**:\n${selectedGuideline.substring(0, 200)}${selectedGuideline.length > 200 ? '...' : ''}`;
    }

    return convertedResult;
  };

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
      const convertedResult = generateConvertedReport(memo, guideline as 'operation' | 'knowledge');
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
