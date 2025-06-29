
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RiskIndicatorProps {
  riskLevel: 'low' | 'medium' | 'high';
}

const RiskIndicator = ({ riskLevel }: RiskIndicatorProps) => {
  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'high':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'low':
        return { text: '낮음', color: 'text-green-700 dark:text-green-300' };
      case 'medium':
        return { text: '보통', color: 'text-yellow-700 dark:text-yellow-300' };
      case 'high':
        return { text: '높음', color: 'text-red-700 dark:text-red-300' };
      default:
        return { text: '미정', color: 'text-gray-700 dark:text-gray-300' };
    }
  };

  const riskInfo = getRiskText(riskLevel);

  return (
    <>
      {getRiskIcon(riskLevel)}
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${riskInfo.color} bg-white dark:bg-gray-800`}>
        위험도: {riskInfo.text}
      </div>
    </>
  );
};

export default RiskIndicator;
