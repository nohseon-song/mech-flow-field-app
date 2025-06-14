
import React from 'react';
import { User, Bot } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
  guideline?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatMessages = ({ messages, isTyping }: ChatMessagesProps) => {
  return (
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
              <div className={`text-xs mt-1 flex items-center gap-1 ${message.isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                {message.timestamp.toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                {!message.isUser && message.guideline && (
                  <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                    message.guideline === 'operation' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {message.guideline === 'operation' ? '실무' : '법규'}
                  </span>
                )}
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
  );
};
