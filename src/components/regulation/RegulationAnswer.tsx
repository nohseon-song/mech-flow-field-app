
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface RegulationAnswerProps {
  answer: string;
  guideline?: string;
}

export const RegulationAnswer = ({ answer, guideline }: RegulationAnswerProps) => {
  if (!answer) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          AI 전문가 답변
          <span className="text-sm text-purple-600">(설정된 지침 자동 적용)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <pre className="whitespace-pre-wrap text-sm text-slate-700">
            {answer}
          </pre>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            ⚠️ 본 답변은 AI가 생성한 참고용 정보입니다. 정확한 법적 해석은 관련 전문가나 관할 기관에 문의하시기 바랍니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
