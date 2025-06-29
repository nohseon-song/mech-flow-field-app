
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { generateEnhancedAnalysisPDF } from '@/utils/enhancedPdfGenerator';
import { AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { getRiskColor } from '@/utils/analysisResultsUtils';
import { type ParsedEquipmentData } from '@/utils/textDataParser';
import RiskIndicator from './analysis-results/RiskIndicator';
import EquipmentInfoSection from './analysis-results/EquipmentInfoSection';
import UserCommentSection from './analysis-results/UserCommentSection';
import EditableAnalysisSection from './analysis-results/EditableAnalysisSection';
import EnhancedOriginalDataSection from './analysis-results/EnhancedOriginalDataSection';
import WebhookResponseSection from './analysis-results/WebhookResponseSection';

interface EnhancedAnalysisResultsCardProps {
  analysisResult: AdvancedAnalysisResult;
  equipmentName: string;
  location: string;
  referenceData: ParsedEquipmentData | null;
  measurementData: ParsedEquipmentData | null;
  userComment: string;
  onUserCommentChange: (comment: string) => void;
  webhookResponse?: any;
  
  // 편집 관련
  isEditing: boolean;
  editableResult: AdvancedAnalysisResult | null;
  onStartEditing: () => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onUpdateField: (field: keyof AdvancedAnalysisResult, value: any) => void;
  onUpdateRecommendation: (index: number, value: string) => void;
  onAddRecommendation: () => void;
  onRemoveRecommendation: (index: number) => void;
}

const EnhancedAnalysisResultsCard = ({ 
  analysisResult, 
  equipmentName, 
  location,
  referenceData,
  measurementData,
  userComment,
  onUserCommentChange,
  webhookResponse,
  
  // 편집 관련
  isEditing,
  editableResult,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onUpdateField,
  onUpdateRecommendation,
  onAddRecommendation,
  onRemoveRecommendation
}: EnhancedAnalysisResultsCardProps) => {
  
  const handleDownloadPDF = () => {
    generateEnhancedAnalysisPDF({
      equipmentName,
      location,
      analysisDate: new Date(analysisResult.timestamp).toLocaleString('ko-KR'),
      referenceData: referenceData || { extractedData: {} },
      measurementData: measurementData || { extractedData: {} },
      analysisResult,
      userComment,
      webhookResponse
    });
  };

  const currentResult = isEditing ? editableResult : analysisResult;

  return (
    <Card className={`${getRiskColor(currentResult?.riskLevel || 'low')} border-2`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <RiskIndicator riskLevel={currentResult?.riskLevel || 'low'} />
          🤖 고도화 AI 분석 결과 v2.0
          <div className="ml-auto">
            <Button
              onClick={handleDownloadPDF}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              향상된 PDF 다운로드
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

        <EditableAnalysisSection
          analysisResult={analysisResult}
          editableResult={editableResult}
          isEditing={isEditing}
          onStartEditing={onStartEditing}
          onSaveEditing={onSaveEditing}
          onCancelEditing={onCancelEditing}
          onUpdateField={onUpdateField}
          onUpdateRecommendation={onUpdateRecommendation}
          onAddRecommendation={onAddRecommendation}
          onRemoveRecommendation={onRemoveRecommendation}
        />

        <EnhancedOriginalDataSection 
          referenceData={referenceData}
          measurementData={measurementData}
        />

        <WebhookResponseSection webhookResponse={webhookResponse} />
      </CardContent>
    </Card>
  );
};

export default EnhancedAnalysisResultsCard;
