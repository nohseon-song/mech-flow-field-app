
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateAnalysisPDF } from '@/utils/pdfGenerator';
import { AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { getRiskColor } from '@/utils/analysisResultsUtils';
import RiskIndicator from './analysis-results/RiskIndicator';
import EquipmentInfoSection from './analysis-results/EquipmentInfoSection';
import UserCommentSection from './analysis-results/UserCommentSection';
import AnalysisResultsSection from './analysis-results/AnalysisResultsSection';
import OriginalDataSection from './analysis-results/OriginalDataSection';
import WebhookResponseSection from './analysis-results/WebhookResponseSection';

interface AnalysisResultsCardProps {
  analysisResult: AdvancedAnalysisResult;
  equipmentName: string;
  location: string;
  referenceText: string;
  measurementText: string;
  userComment: string;
  onUserCommentChange: (comment: string) => void;
  webhookResponse?: any;
}

const AnalysisResultsCard = ({ 
  analysisResult, 
  equipmentName, 
  location,
  referenceText,
  measurementText,
  userComment,
  onUserCommentChange,
  webhookResponse 
}: AnalysisResultsCardProps) => {
  
  const handleDownloadPDF = () => {
    generateAnalysisPDF({
      equipmentName,
      location,
      analysisDate: new Date(analysisResult.timestamp).toLocaleString('ko-KR'),
      referenceData: referenceText,
      measurementData: measurementText,
      analysisResult,
      userComment,
      webhookResponse
    });
  };

  return (
    <Card className={`${getRiskColor(analysisResult.riskLevel)} border-2`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <RiskIndicator riskLevel={analysisResult.riskLevel} />
          📊 AI 분석 결과
          <div className="ml-auto">
            <Button
              onClick={handleDownloadPDF}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF 다운로드
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <EquipmentInfoSection 
          equipmentName={equipmentName}
          location={location}
          timestamp={analysisResult.timestamp}
        />

        <UserCommentSection 
          userComment={userComment}
          onUserCommentChange={onUserCommentChange}
        />

        <AnalysisResultsSection analysisResult={analysisResult} />

        <OriginalDataSection 
          referenceText={referenceText}
          measurementText={measurementText}
        />

        <WebhookResponseSection webhookResponse={webhookResponse} />
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsCard;
