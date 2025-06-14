
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemoConverter } from '@/hooks/useMemoConverter';
import { GuidelineSelector } from '@/components/memo/GuidelineSelector';
import { MemoInput } from '@/components/memo/MemoInput';
import { ConvertedReport } from '@/components/memo/ConvertedReport';

const MemoConverter = () => {
  const navigate = useNavigate();
  const {
    memo,
    setMemo,
    guideline,
    setGuideline,
    convertedData,
    isLoading,
    handleConvert
  } = useMemoConverter();

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
                <FileText className="h-6 w-6 text-blue-600" />
                AI 현장 메모 변환기
              </h1>
              <p className="text-sm text-slate-600">메모를 구조화된 보고서로 변환</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <GuidelineSelector 
          guideline={guideline} 
          onGuidelineChange={setGuideline} 
        />
        
        <MemoInput
          memo={memo}
          onMemoChange={setMemo}
          onConvert={handleConvert}
          isLoading={isLoading}
        />

        <ConvertedReport 
          convertedData={convertedData}
          guideline={guideline}
        />
      </div>
    </div>
  );
};

export default MemoConverter;
