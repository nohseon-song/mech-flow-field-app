
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ChatHeader = () => {
  const navigate = useNavigate();

  return (
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
  );
};
