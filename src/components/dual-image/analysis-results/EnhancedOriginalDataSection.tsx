
import React from 'react';
import { type ParsedEquipmentData } from '@/utils/textDataParser';

interface EnhancedOriginalDataSectionProps {
  referenceData: ParsedEquipmentData | null;
  measurementData: ParsedEquipmentData | null;
}

const EnhancedOriginalDataSection = ({ 
  referenceData, 
  measurementData 
}: EnhancedOriginalDataSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">
          📊 기준값 Key:Value 데이터 ({referenceData ? Object.keys(referenceData.extractedData).length : 0}개)
        </h4>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 max-h-40 overflow-y-auto">
          {referenceData ? (
            <div className="space-y-2">
              {Object.keys(referenceData.extractedData).length > 0 ? (
                Object.entries(referenceData.extractedData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-xs bg-white dark:bg-gray-800 p-2 rounded">
                    <span className="font-medium text-green-700 dark:text-green-400">{key}:</span>
                    <span className="text-green-800 dark:text-green-200">{value}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-green-600 dark:text-green-400">
                  구조화된 데이터를 찾을 수 없습니다.
                </div>
              )}
              {referenceData.rawText && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer text-green-600 dark:text-green-400">
                    원시 텍스트 보기 ({referenceData.rawText.length}자)
                  </summary>
                  <pre className="text-xs text-green-700 dark:text-green-300 mt-1 whitespace-pre-wrap">
                    {referenceData.rawText}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <div className="text-xs text-green-600 dark:text-green-400">
              기준값 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">
          📊 측정값 Key:Value 데이터 ({measurementData ? Object.keys(measurementData.extractedData).length : 0}개)
        </h4>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 max-h-40 overflow-y-auto">
          {measurementData ? (
            <div className="space-y-2">
              {Object.keys(measurementData.extractedData).length > 0 ? (
                Object.entries(measurementData.extractedData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-xs bg-white dark:bg-gray-800 p-2 rounded">
                    <span className="font-medium text-blue-700 dark:text-blue-400">{key}:</span>
                    <span className="text-blue-800 dark:text-blue-200">{value}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  구조화된 데이터를 찾을 수 없습니다.
                </div>
              )}
              {measurementData.rawText && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer text-blue-600 dark:text-blue-400">
                    원시 텍스트 보기 ({measurementData.rawText.length}자)
                  </summary>
                  <pre className="text-xs text-blue-700 dark:text-blue-300 mt-1 whitespace-pre-wrap">
                    {measurementData.rawText}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <div className="text-xs text-blue-600 dark:text-blue-400">
              측정값 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedOriginalDataSection;
