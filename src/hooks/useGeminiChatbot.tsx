
import { useState } from 'react';
import { useGuidelines } from './useGuidelines';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const GEMINI_API_KEY = 'AIzaSyBgvOOeArqdsQFHD6zfAmjyLCptdKXRezc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export const useGeminiChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '안녕하세요! Gemini 1.5 기반 기계설비 전문 AI 어시스턴트입니다. 실시간 AI 분석을 통해 설비 관련 질문에 정확하고 전문적인 답변을 제공합니다. 설비 점검, 법규 준수, 고장 진단 등 무엇이든 문의해주세요.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getGuideline } = useGuidelines();

  const generateGeminiResponse = async (userMessage: string): Promise<string> => {
    const operationGuideline = getGuideline('operation');
    const knowledgeGuideline = getGuideline('knowledge');
    
    // 시스템 프롬프트 구성
    let systemPrompt = `당신은 기계설비 전문 AI 어시스턴트입니다. 다음 지침에 따라 답변해주세요:

1. 기계설비법, 산업안전보건법, KS 표준 등 관련 법규를 정확히 인용
2. 실무적이고 구체적인 해결방안 제시
3. 안전을 최우선으로 고려한 답변
4. 전문 용어는 쉽게 설명 추가
5. 단계별 작업 절차 제시

현재 사용자 질문: "${userMessage}"`;
    
    if (operationGuideline && operationGuideline.trim()) {
      systemPrompt += `\n\n운용지침 적용사항:\n${operationGuideline}`;
    }
    
    if (knowledgeGuideline && knowledgeGuideline.trim()) {
      systemPrompt += `\n\n지식지침 적용사항:\n${knowledgeGuideline}`;
    }
    
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API 오류:', errorData);
        throw new Error(`API 오류: ${response.status} - ${errorData.error?.message || '알 수 없는 오류'}`);
      }

      const data = await response.json();
      console.log('Gemini API 응답:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Gemini API 호출 실패:', error);
      throw error;
    }
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

    try {
      const aiResponse = await generateGeminiResponse(currentInput);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "응답 완료",
        description: "Gemini AI가 전문적인 답변을 제공했습니다."
      });
    } catch (error) {
      console.error('AI 응답 생성 오류:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `죄송합니다. AI 응답 생성 중 오류가 발생했습니다.\n\n오류 내용: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n네트워크 연결을 확인하거나, 잠시 후 다시 시도해주세요.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI 응답 오류",
        description: "네트워크 연결을 확인하고 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: '안녕하세요! Gemini 1.5 기반 기계설비 전문 AI 어시스턴트입니다. 실시간 AI 분석을 통해 설비 관련 질문에 정확하고 전문적인 답변을 제공합니다. 설비 점검, 법규 준수, 고장 진단 등 무엇이든 문의해주세요.',
        timestamp: new Date()
      }
    ]);
    toast({
      title: "대화 초기화",
      description: "채팅 기록이 초기화되었습니다."
    });
  };

  const exportChat = () => {
    const chatText = messages
      .map(msg => `[${msg.timestamp.toLocaleString('ko-KR')}] ${msg.type === 'user' ? '사용자' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI채팅기록_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "채팅 내보내기 완료",
      description: "대화 기록이 텍스트 파일로 저장되었습니다."
    });
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearChat,
    exportChat
  };
};
