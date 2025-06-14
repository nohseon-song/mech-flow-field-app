
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Sparkles } from 'lucide-react';

interface MemoInputProps {
  memo: string;
  onMemoChange: (value: string) => void;
  onConvert: () => void;
  isLoading: boolean;
}

export const MemoInput = ({ memo, onMemoChange, onConvert, isLoading }: MemoInputProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          현장 메모 입력
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            현장에서 작성한 메모를 입력하세요
          </label>
          <Textarea
            placeholder="예: 보일러2호 85% 가동 미달, 펌프 p-1 진동 심함, 배관 누수 의심"
            value={memo}
            onChange={(e) => onMemoChange(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <Button 
          onClick={onConvert}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              AI 변환 중...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              변환하기
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
