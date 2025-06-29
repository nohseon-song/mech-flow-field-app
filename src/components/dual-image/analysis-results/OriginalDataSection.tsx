
import React from 'react';

interface OriginalDataSectionProps {
  referenceText: string;
  measurementText: string;
}

const OriginalDataSection = ({ referenceText, measurementText }: OriginalDataSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">
          📄 기준값 데이터 ({referenceText.length}자)
        </h4>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 max-h-32 overflow-y-auto">
          <pre className="text-xs text-green-800 dark:text-green-200 whitespace-pre-wrap">
            {referenceText}
          </pre>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">
          📄 측정값 데이터 ({measurementText.length}자)
        </h4>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 max-h-32 overflow-y-auto">
          <pre className="text-xs text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
            {measurementText}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default OriginalDataSection;
