
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAIChatbot } from '@/hooks/useAIChatbot';
import { ChatMessages } from '@/components/chatbot/ChatMessages';
import { ChatInput } from '@/components/chatbot/ChatInput';

const AIChatbot = () => {
  const navigate = useNavigate();
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearChat
  } = useAIChatbot();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-orange-600" />
                AI 챗봇
              </h1>
              <p className="text-sm text-slate-600">24시간 설비 전문 상담 (설정된 지침 자동 적용)</p>
            </div>
            <Button variant="outline" size="sm" onClick={clearChat}>
              초기화
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <ChatMessages messages={messages} isLoading={isLoading} />
        
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AIChatbot;
