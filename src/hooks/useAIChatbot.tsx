
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
      content: '안녕하세요! 기계설비 전문 AI 어시스턴트입니다. 설비 관련 질문이나 도움이 필요한 것이 있으시면 언제든 말씀해주세요.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [guideline, setGuideline] = useState('operation');
  const [isLoading, setIsLoading] = useState(false);
  const { getGuideline } = useGuidelines();

  const generateAIResponse = (userMessage: string, guidelineType: 'operation' | 'knowledge') => {
    const selectedGuideline = getGuideline(guidelineType);
    
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
    
    if (guidelineType === 'operation') {
      // 운용지침 기반 실무 중심 응답
      switch (category) {
        case '점검':
          baseResponse = `실무 관점에서 말씀드리면, 해당 설비의 운전 조건을 먼저 확인해보시기 바랍니다. 온도, 압력, 진동 등의 주요 파라미터를 점검하고, 이상 징후가 발견되면 즉시 운전을 중단하는 것이 안전합니다.\n\n**즉시 확인사항:**\n- 설비 외관 상태 육안 점검\n- 운전 데이터 정상 범위 확인\n- 이상음, 진동, 발열 체크`;
          break;
        case '안전':
          baseResponse = `현장 안전이 최우선입니다. 즉시 작업을 중단하고 안전 조치를 취하시기 바랍니다.\n\n**안전 조치 절차:**\n1. 즉시 작업 중단 및 현장 격리\n2. 관련 부서 신속 보고\n3. 전문가 자문 요청\n4. 안전 확인 후 작업 재개`;
          break;
        case '고장':
          baseResponse = `현장에서 자주 발생하는 문제로 보입니다. 먼저 안전을 확보한 후, 다음 순서로 진행하세요.\n\n**문제 해결 순서:**\n1. 설비 즉시 정지 및 안전 확보\n2. 육안 점검 (누유, 균열, 부식 등)\n3. 운전 이력 및 데이터 검토\n4. 필요시 전문 업체 연락`;
          break;
        case '정비':
          baseResponse = `효과적인 정비를 위해 체계적인 접근이 필요합니다.\n\n**정비 계획 수립:**\n1. 설비 이력 및 정비 기록 검토\n2. 부품 재고 및 공구 준비 상태 확인\n3. 작업 일정 및 인력 배치 계획\n4. 안전 작업 절차서 숙지`;
          break;
        default:
          baseResponse = `현장 실무 경험을 바탕으로 말씀드리면, 체계적인 접근이 중요합니다.\n\n**기본 점검사항:**\n- 설비 운전 상태 확인\n- 관련 매뉴얼 및 도면 검토\n- 안전 수칙 준수\n- 필요시 전문가 협조 요청`;
      }
    } else {
      // 지식지침 기반 법규 중심 응답
      switch (category) {
        case '점검':
          baseResponse = `기계설비법 제15조에 따른 성능점검 의무를 준수해야 합니다.\n\n**관련 법규:**\n- 기계설비법 제15조 (성능점검)\n- 기계설비법 시행령 제20조 (점검방법)\n- 관련 기술기준 KS B 표준 적용\n\n**법정 요구사항:**\n- 정기점검 주기 준수 (연 1회 이상)\n- 전문기관 점검 의뢰\n- 점검 결과 기록 보존 (3년)`;
          break;
        case '안전':
          baseResponse = `산업안전보건법에 따른 안전관리 의무를 이행해야 합니다.\n\n**관련 법규:**\n- 산업안전보건법 제36조 (정기점검)\n- 동법 시행령 제38조 (점검 기준)\n- 안전보건관리규정 준수\n\n**법적 의무사항:**\n- 위험성 평가 실시\n- 안전교육 이행\n- 사고 발생시 즉시 신고`;
          break;
        case '법규':
          baseResponse = `해당 사안은 관련 법규의 정확한 적용이 필요합니다.\n\n**주요 관련 법규:**\n- 기계설비법 및 시행령\n- 산업안전보건법\n- 에너지이용합리화법\n- 관련 KS 표준 및 기술기준\n\n**준수사항:**\n- 법정 기준 엄격 적용\n- 관련 서류 작성 및 보존\n- 관계기관 보고 의무 이행`;
          break;
        default:
          baseResponse = `관련 법규 및 기술기준을 정확히 적용해야 합니다.\n\n**적용 기준:**\n- 기계설비법령 준수\n- KS 표준 및 기술기준 적용\n- 안전 관련 법규 우선 적용\n- 정기 점검 및 기록 보존 의무`;
      }
    }

    // 사용자 설정 지침이 있으면 추가 반영
    if (selectedGuideline && selectedGuideline.trim()) {
      baseResponse += `\n\n**맞춤 지침 적용:**\n${selectedGuideline.substring(0, 200)}${selectedGuideline.length > 200 ? '...' : ''}`;
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
      const aiResponse = generateAIResponse(currentInput, guideline as 'operation' | 'knowledge');

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
        content: '안녕하세요! 기계설비 전문 AI 어시스턴트입니다. 설비 관련 질문이나 도움이 필요한 것이 있으시면 언제든 말씀해주세요.',
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
    guideline,
    setGuideline,
    isLoading,
    sendMessage,
    clearChat
  };
};
