
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Sparkles } from 'lucide-react';

interface RegulationQuestionProps {
  question: string;
  onQuestionChange: (value: string) => void;
  onAskQuestion: () => void;
  isLoading: boolean;
}

export const RegulationQuestion = ({ 
  question, 
  onQuestionChange, 
  onAskQuestion, 
  isLoading 
}: RegulationQuestionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          법규 질문하기
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            기계설비 법규에 대해 궁금한 점을 질문해주세요
          </label>
          <Textarea
            placeholder="예: 연평균 15,000제곱미터 복합건물의 기계설비 성능점검 주기는 어떻게 되나요?"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button 
          onClick={onAskQuestion}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              AI 답변 생성 중...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              질문하기
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
