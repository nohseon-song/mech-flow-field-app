
import React from 'react';
import { ChatHeader } from '@/components/chatbot/ChatHeader';
import { ChatGuidelineSelector } from '@/components/chatbot/ChatGuidelineSelector';
import { ChatMessages } from '@/components/chatbot/ChatMessages';
import { ChatInput } from '@/components/chatbot/ChatInput';
import { useAIChatbot } from '@/hooks/useAIChatbot';

const AIChatbot = () => {
  const {
    guideline,
    setGuideline,
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    sendMessage
  } = useAIChatbot();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <ChatHeader />
      <ChatGuidelineSelector 
        guideline={guideline} 
        onGuidelineChange={setGuideline} 
      />
      <ChatMessages messages={messages} isTyping={isTyping} />
      <ChatInput
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSendMessage={sendMessage}
        onKeyPress={handleKeyPress}
        isTyping={isTyping}
      />
    </div>
  );
};

export default AIChatbot;
