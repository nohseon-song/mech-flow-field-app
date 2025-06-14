
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRegulationHelper } from '@/hooks/useRegulationHelper';
import { GuidelineSelector } from '@/components/memo/GuidelineSelector';
import { RegulationQuestion } from '@/components/regulation/RegulationQuestion';
import { RegulationAnswer } from '@/components/regulation/RegulationAnswer';

const RegulationHelper = () => {
  const navigate = useNavigate();
  const {
    question,
    setQuestion,
    guideline,
    setGuideline,
    answer,
    isLoading,
    handleAskQuestion
  } = useRegulationHelper();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-purple-600" />
                AI 규정 준수 도우미
              </h1>
              <p className="text-sm text-slate-600">기계설비법 전문 상담</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <GuidelineSelector 
          guideline={guideline} 
          onGuidelineChange={setGuideline} 
        />

        <RegulationQuestion
          question={question}
          onQuestionChange={setQuestion}
          onAskQuestion={handleAskQuestion}
          isLoading={isLoading}
        />

        <RegulationAnswer 
          answer={answer}
          guideline={guideline}
        />
      </div>
    </div>
  );
};

export default RegulationHelper;
