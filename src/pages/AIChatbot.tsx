
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MessageCircle, Send, User, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "안녕하세요! CheckMate 전문가입니다. 🤖\n\n플랫폼 사용법, 기계설비 법규, 점검 노하우 등 무엇이든 물어보세요! 24시간 답변해 드립니다.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        content: getAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('점검') && input.includes('주기')) {
      return "기계설비 점검 주기에 대해 답변드리겠습니다.\n\n✅ **법정 점검 주기**:\n- 보일러: 월 1회 이상\n- 냉동기: 월 1회 이상\n- 환기설비: 분기 1회 이상\n\n📋 **성능점검**:\n- 연 1회 이상 실시\n- 전문가에 의한 점검 필요\n\n더 자세한 내용이 필요하시면 언제든 물어보세요!";
    }
    
    if (input.includes('사용법') || input.includes('앱')) {
      return "CheckMate 앱 사용법을 안내해드리겠습니다.\n\n📱 **주요 기능**:\n1. 설비 현황 조회\n2. 점검 체크리스트 작성\n3. AI 기능 활용\n4. 리포트 생성\n\n🚀 **시작하기**:\n1. 메인 화면에서 '새 점검' 클릭\n2. 설비 선택 후 점검 시작\n3. 체크리스트 작성\n4. 결과 저장\n\n궁금한 기능이 있으시면 말씀해주세요!";
    }
    
    if (input.includes('안전') || input.includes('주의')) {
      return "기계설비 점검 시 안전수칙을 안내해드리겠습니다.\n\n⚠️ **기본 안전수칙**:\n1. 개인보호구 착용 필수\n2. 설비 정지 후 점검\n3. 잠금장치(LOTO) 적용\n4. 가스 누출 확인\n\n🔧 **점검 전 준비**:\n- 점검 계획서 작성\n- 필요 공구 준비\n- 비상연락망 확인\n\n안전이 최우선입니다!";
    }
    
    return "질문해주셔서 감사합니다! 😊\n\n더 구체적인 질문을 해주시면 더 정확한 답변을 드릴 수 있습니다.\n\n**예시 질문**:\n- 보일러 점검 주기는?\n- 앱 사용법이 궁금해요\n- 안전수칙을 알려주세요\n- 법규 관련 문의\n\n무엇이든 편하게 물어보세요!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-teal-600" />
                CheckMate 전문가
              </h1>
              <p className="text-sm text-slate-600">AI 챗봇이 24시간 답변해드립니다</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-2 rounded-full ${message.isUser ? 'bg-blue-600' : 'bg-teal-600'}`}>
                {message.isUser ? 
                  <User className="h-4 w-4 text-white" /> : 
                  <Bot className="h-4 w-4 text-white" />
                }
              </div>
              <div className={`p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-200 text-slate-700'
              }`}>
                <pre className="whitespace-pre-wrap text-sm font-sans">
                  {message.content}
                </pre>
                <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                  {message.timestamp.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="p-2 rounded-full bg-teal-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isTyping}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
