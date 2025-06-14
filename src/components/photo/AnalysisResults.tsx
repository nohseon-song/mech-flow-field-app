
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, AlertTriangle, Wrench } from 'lucide-react';

interface AnalysisResultsProps {
  analysisResult: {
    causes: string[];
    symptoms: string[];
    improvements: string[];
  };
  guideline: string;
}

export const AnalysisResults = ({ analysisResult, guideline }: AnalysisResultsProps) => {
  return (
    <div className="space-y-4">
      {/* 원인 분석 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-red-600" />
            원인 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysisResult.causes.map((cause: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-slate-700">{cause}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 징후 분석 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            징후 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysisResult.symptoms.map((symptom: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-slate-700">{symptom}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 개선방안 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5 text-green-600" />
            개선방안
            {guideline === 'operation' ? 
              <span className="text-sm text-blue-600">(운용지침)</span> : 
              <span className="text-sm text-purple-600">(지식지침)</span>
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysisResult.improvements.map((improvement: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-slate-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
