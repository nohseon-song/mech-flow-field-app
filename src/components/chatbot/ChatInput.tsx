
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ 
  input, 
  onInputChange, 
  onSendMessage, 
  isLoading 
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
          />
          <Button 
            onClick={onSendMessage} 
            disabled={!input.trim() || isLoading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
