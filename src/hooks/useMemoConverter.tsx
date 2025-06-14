
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useGuidelines } from '@/hooks/useGuidelines';

export const useMemoConverter = () => {
  const { getGuideline } = useGuidelines();
  const [memo, setMemo] = useState('');
  const [guideline, setGuideline] = useState('operation');
  const [convertedData, setConvertedData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Google Gemini API 호출 시뮬레이션 (실제로는 저장된 지침 사용)
    setTimeout(() => {
      const userGuideline = getGuideline(guideline as 'operation' | 'knowledge');
      const baseData = {
        equipment: memo.includes('보일러') ? '보일러 #1' : '설비명 미기재',
        date: new Date().toLocaleDateString('ko-KR'),
        inspector: '홍길동',
        status: memo.includes('정상') || memo.includes('양호') ? '정상' : '확인 필요',
        operation: memo.includes('이상') ? '이상 감지' : '정상',
        notes: memo
      };

      // 사용자 지침이 있으면 그에 따라, 없으면 기본 로직 사용
      const mockConvertedData = userGuideline ? 
        `## 점검 보고서 (${guideline === 'operation' ? '운용지침' : '지식지침'} 기반)

**설비명**: ${baseData.equipment}
**점검일시**: ${baseData.date}
**점검자**: ${baseData.inspector}

### 적용된 지침
${userGuideline.substring(0, 200)}...

### 현장 메모
${baseData.notes}

### 지침 기반 분석 결과
- 설비 상태: ${baseData.status}
- 작동 상태: ${baseData.operation}
- 지침 준수 여부: 확인 완료

### 다음 조치사항
- 사용자 지침에 따른 맞춤형 조치 권장
- 정기 점검 스케줄 확인
- 지침 업데이트 필요시 설정에서 수정 가능
        ` : 
        guideline === 'operation' ? 
        `## 점검 보고서 (기본 운용지침)

**설비명**: ${baseData.equipment}
**점검일시**: ${baseData.date}
**점검자**: ${baseData.inspector}

### 점검 항목
- 외관 상태: ${baseData.status}
- 작동 상태: ${baseData.operation}
- 안전 상태: 점검 완료

### 현장 메모
${baseData.notes}

### 실무 조치사항
- 일일 점검: 외관 및 소음 확인
- 주간 점검: 진동 및 온도 측정
- 월간 점검: 윤활유 교체 및 필터 청소
- 다음 점검 예정일: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}

### 예상 문제점 및 대응방안
- 설비 노후화 징후 모니터링 강화
- 예비부품 재고 확인 필요

⚠️ 맞춤형 지침을 설정하려면 AI 기능 → 지침설정에서 운용지침을 등록하세요.
        ` : 
        `## 점검 보고서 (기본 지식지침)

**설비명**: ${baseData.equipment}
**점검일시**: ${baseData.date}
**점검자**: ${baseData.inspector}

### 법규 준수 점검 항목
- 기계설비법 제15조: 성능점검 실시 ✓
- 산업안전보건법 제36조: 정기점검 이행 ✓
- 건축물 에너지절약법: 효율 기준 적합성 확인 ✓

### 현장 메모
${baseData.notes}

### 표준 매뉴얼 기준 조치사항
- KS B 0251 기준: 배관 접합부 점검
- KS C 4304 기준: 전기설비 절연상태 확인
- 안전관리 규정: 개인보호구 착용 확인

### 법정 기록 보관
- 점검 결과 3년간 보관 의무 (기계설비법 시행규칙 제22조)
- 차기 점검일: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')} (연 1회)

⚠️ 맞춤형 지침을 설정하려면 AI 기능 → 지침설정에서 지식지침을 등록하세요.
        `;
      
      setConvertedData(mockConvertedData.trim());
      setIsLoading(false);
      
      toast({
        title: "변환 완료",
        description: `현장 메모가 ${guideline === 'operation' ? '운용지침' : '지식지침'} 기반 보고서로 변환되었습니다.`
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
