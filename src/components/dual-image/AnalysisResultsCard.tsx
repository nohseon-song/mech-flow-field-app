
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { generateAnalysisPDF } from '@/utils/pdfGenerator';

interface AnalysisResultsCardProps {
  analysisResult: any;
  equipmentName: string;
  location: string;
  referenceText: string;
  measurementText: string;
  webhookResponse?: any;
}

const AnalysisResultsCard = ({ 
  analysisResult, 
  equipmentName, 
  location,
  referenceText,
  measurementText,
  webhookResponse 
}: AnalysisResultsCardProps) => {
  
  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20';
      case 'high':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20';
    }
  };

  const handleDownloadPDF = () => {
    generateAnalysisPDF({
      equipmentName,
      location,
      analysisDate: new Date().toLocaleString('ko-KR'),
      referenceData: referenceText,
      measurementData: measurementText,
      analysisResult,
      webhookResponse
    });
  };

  return (
    <Card className={`${getRiskColor(analysisResult.riskLevel)} border-2`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {getRiskIcon(analysisResult.riskLevel)}
          📊 분석 결과
          <Button
            onClick={handleDownloadPDF}
            size="sm"
            className="ml-auto bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF 다운로드
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-1">현재 상태</h4>
              <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                {analysisResult.currentStatus}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-1">발생 원인</h4>
              <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                {analysisResult.rootCause}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-1">개선 솔루션</h4>
              <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                {analysisResult.improvementSolution}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-1">권장사항</h4>
              <ul className="text-sm bg-white dark:bg-gray-800 p-3 rounded border space-y-1">
                {analysisResult.recommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {webhookResponse && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">
              Make.com 처리 결과
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(webhookResponse, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsCard;
