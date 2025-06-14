
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const selectedGuideline = getGuideline(guideline as 'operation' | 'knowledge');
      
      const responses = guideline === 'operation' ? [
        "실무 관점에서 말씀드리면, 해당 설비의 운전 조건을 먼저 확인해보시기 바랍니다. 온도, 압력, 진동 등의 주요 파라미터를 점검하고, 이상 징후가 발견되면 즉시 운전을 중단하는 것이 안전합니다.",
        "현장에서 자주 발생하는 문제로 보입니다. 먼저 안전을 확보한 후, 육안으로 외관을 점검해보세요. 누유, 균열, 부식 등이 있는지 확인하고, 필요시 전문 업체의 도움을 받으시길 권합니다.",
        "이런 증상은 보통 정기 점검 주기가 지났거나, 운전 조건이 설계 기준을 벗어났을 때 나타납니다. 즉시 운전을 중단하고 전문가의 진단을 받아보시기 바랍니다."
      ] : [
        "기계설비법 제15조에 따르면, 해당 설비는 정기 성능점검을 받아야 합니다. 관련 기술기준 KS B 0251을 참조하여 점검 기준을 확인하시고, 전문기관에 점검을 의뢰하시기 바랍니다.",
        "산업안전보건법 제36조의 정기점검 의무 조항에 해당합니다. 점검 결과는 반드시 기록하여 3년간 보존해야 하며, 필요시 관계 기관에 제출할 의무가 있습니다.",
        "해당 사안은 기계설비법 시행령 제20조의 점검 방법 기준을 적용해야 합니다. 관련 기술 표준을 준수하고, 점검 결과에 따른 개선 조치를 취하시기 바랍니다."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse,
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
