
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface ChatGuidelineSelectorProps {
  guideline: string;
  onGuidelineChange: (value: string) => void;
}

export const ChatGuidelineSelector = ({ guideline, onGuidelineChange }: ChatGuidelineSelectorProps) => {
  return (
    <div className="bg-white border-b">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Sparkles className="h-4 w-4 text-teal-600" />
          <RadioGroup value={guideline} onValueChange={onGuidelineChange} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="operation" id="operation-chat" />
              <Label htmlFor="operation-chat" className="text-sm">실무 중심</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="knowledge" id="knowledge-chat" />
              <Label htmlFor="knowledge-chat" className="text-sm">법규 중심</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
