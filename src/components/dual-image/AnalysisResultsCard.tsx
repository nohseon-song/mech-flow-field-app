
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DualImageAnalysis } from '@/utils/dualImageAnalysis';

interface AnalysisResultsCardProps {
  analysisResult: DualImageAnalysis;
}

const AnalysisResultsCard = ({ analysisResult }: AnalysisResultsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📊 분석 결과
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm text-slate-700 max-h-96 overflow-y-auto">
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsCard;
