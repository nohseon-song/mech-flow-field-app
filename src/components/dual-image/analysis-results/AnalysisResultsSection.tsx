
import React from 'react';
import { AdvancedAnalysisResult } from '@/utils/advancedAnalysis';

interface AnalysisResultsSectionProps {
  analysisResult: AdvancedAnalysisResult;
}

const AnalysisResultsSection = ({ analysisResult }: AnalysisResultsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
            📋 현재 상태
          </h4>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
              {analysisResult.currentStatus}
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
            🔍 발생 원인
          </h4>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
              {analysisResult.rootCause}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
            🛠️ 개선 솔루션
          </h4>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
              {analysisResult.improvementSolution}
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
            ✅ 권장사항
          </h4>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <ul className="text-sm text-gray-900 dark:text-gray-100 space-y-2">
              {analysisResult.recommendations?.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultsSection;
