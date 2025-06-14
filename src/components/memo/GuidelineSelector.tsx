
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface GuidelineSelectorProps {
  guideline: string;
  onGuidelineChange: (value: string) => void;
}

export const GuidelineSelector = ({ guideline, onGuidelineChange }: GuidelineSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          변환 지침 선택
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={guideline} onValueChange={onGuidelineChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="operation" id="operation" />
            <Label htmlFor="operation">운용지침 (실무 중심)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="knowledge" id="knowledge" />
            <Label htmlFor="knowledge">지식지침 (법규/표준 중심)</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
