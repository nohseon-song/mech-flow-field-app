
import { useState } from 'react';
import { useGuidelines } from './useGuidelines';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAIChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '안녕하세요! 기계설비 전문 AI 어시스턴트입니다. 설정하신 AI 지침이 자동으로 적용되어 맞춤형 답변을 제공합니다. 설비 관련 질문이나 도움이 필요한 것이 있으시면 언제든 말씀해주세요.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getGuideline } = useGuidelines();

  const generateAIResponse = (userMessage: string) => {
    const operationGuideline = getGuideline('operation');
    const knowledgeGuideline = getGuideline('knowledge');
    
    // 키워드 기반 응답 생성
    const keywords = {
      점검: ['점검', '검사', '확인', '체크'],
      안전: ['안전', '위험', '사고', '주의'],
      설비: ['설비', '장비', '기계', '시설'],
      법규: ['법규', '규정', '기준', '표준', '조항'],
      고장: ['고장', '불량', '문제', '이상', '트러블'],
      정비: ['정비', '수리', '보수', '교체', '정비']
    };

    let category = '일반';
    for (const [key, words] of Object.entries(keywords)) {
      if (words.some(word => userMessage.includes(word))) {
        category = key;
        break;
      }
    }

    let baseResponse = '';
    
    // 지식지침을 우선 적용
    switch (category) {
      case '점검':
        baseResponse = `**설비 점검 관련 답변**

기계설비법 제15조에 따른 성능점검 의무를 준수해야 합니다.

**관련 법규:**
- 기계설비법 제15조 (성능점검)
- 기계설비법 시행령 제20조 (점검방법)
- 관련 기술기준 KS B 표준 적용

**법정 요구사항:**
- 정기점검 주기 준수 (연 1회 이상)
- 전문기관 점검 의뢰
- 점검 결과 기록 보존 (3년)

**실무 조치사항:**
- 설비 운전 조건을 먼저 확인
- 온도, 압력, 진동 등의 주요 파라미터 점검
- 이상 징후 발견시 즉시 운전 중단`;
        break;
      case '안전':
        baseResponse = `**안전 관련 종합 대응**

산업안전보건법에 따른 안전관리 의무를 이행해야 합니다.

**관련 법규:**
- 산업안전보건법 제36조 (정기점검)
- 동법 시행령 제38조 (점검 기준)
- 안전보건관리규정 준수

**법적 의무사항:**
- 위험성 평가 실시
- 안전교육 이행
- 사고 발생시 즉시 신고

**현장 안전 조치:**
- 즉시 작업 중단 및 현장 격리
- 관련 부서 신속 보고
- 전문가 자문 요청
- 안전 확인 후 작업 재개`;
        break;
      case '고장':
        baseResponse = `**설비 고장 대응**

**법규 준수사항:**
- 기계설비법에 따른 사고 신고 의무
- 안전 조치 우선 이행
- 정비 기록 작성 및 보존

**현장 대응 절차:**
1. 설비 즉시 정지 및 안전 확보
2. 육안 점검 (누유, 균열, 부식 등)
3. 운전 이력 및 데이터 검토
4. 필요시 전문 업체 연락`;
        break;
      case '정비':
        baseResponse = `**설비 정비 관리**

**법규 기준:**
- 기계설비법령 준수
- KS 표준 및 기술기준 적용
- 안전 관련 법규 우선 적용
- 정기 점검 및 기록 보존 의무

**실무 절차:**
1. 설비 이력 및 정비 기록 검토
2. 부품 재고 및 공구 준비 상태 확인
3. 작업 일정 및 인력 배치 계획
4. 안전 작업 절차서 숙지`;
        break;
      default:
        baseResponse = `**설비 관련 종합 답변**

**법규 준수 기준:**
- 기계설비법령 준수
- KS 표준 및 기술기준 적용
- 안전 관련 법규 우선 적용
- 정기 점검 및 기록 보존 의무

**실무 대응 방안:**
- 설비 운전 상태 확인
- 관련 매뉴얼 및 도면 검토
- 안전 수칙 준수
- 필요시 전문가 협조 요청`;
    }

    // 설정된 지침들을 자동으로 적용
    if (operationGuideline && operationGuideline.trim()) {
      baseResponse += `\n\n**운용지침 적용:**\n${operationGuideline.substring(0, 200)}${operationGuideline.length > 200 ? '...' : ''}`;
    }

    if (knowledgeGuideline && knowledgeGuideline.trim()) {
      baseResponse += `\n\n**지식지침 적용:**\n${knowledgeGuideline.substring(0, 200)}${knowledgeGuideline.length > 200 ? '...' : ''}`;
    }

    return baseResponse;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // AI 응답 생성
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: '안녕하세요! 기계설비 전문 AI 어시스턴트입니다. 설정하신 AI 지침이 자동으로 적용되어 맞춤형 답변을 제공합니다. 설비 관련 질문이나 도움이 필요한 것이 있으시면 언제든 말씀해주세요.',
        timestamp: new Date()
      }
    ]);
    toast({
      title: "대화 초기화",
      description: "채팅 기록이 초기화되었습니다."
    });
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearChat
  };
};
