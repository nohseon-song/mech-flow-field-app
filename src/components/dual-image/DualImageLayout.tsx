
import React from 'react';
import AppHeader from './AppHeader';
import DeviceSettingsCard from './DeviceSettingsCard';
import ImageUploadSection from './ImageUploadSection';
import AnalysisControlCard from './AnalysisControlCard';
import AnalysisResultsCard from './AnalysisResultsCard';
import UsageGuideCard from './UsageGuideCard';
import { AdvancedAnalysisResult } from '@/utils/advancedAnalysis';

interface DualImageLayoutProps {
  equipmentName: string;
  location: string;
  onEquipmentNameChange: (name: string) => void;
  onLocationChange: (location: string) => void;
  
  referenceImage: File | null;
  measurementImage: File | null;
  referenceText: string;
  measurementText: string;
  isProcessingRef: boolean;
  isProcessingMeas: boolean;
  
  onReferenceImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMeasurementImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessReferenceOCR: () => void;
  onProcessMeasurementOCR: () => void;
  
  analysisResult: AdvancedAnalysisResult | null;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  onPerformComparison: () => void;
  
  isSending: boolean;
  onSendToWebhook: () => void;
  onCopyResult: () => void;
  
  webhookResponse?: any;
}

const DualImageLayout = ({
  equipmentName,
  location,
  onEquipmentNameChange,
  onLocationChange,
  
  referenceImage,
  measurementImage,
  referenceText,
  measurementText,
  isProcessingRef,
  isProcessingMeas,
  
  onReferenceImageSelect,
  onMeasurementImageSelect,
  onProcessReferenceOCR,
  onProcessMeasurementOCR,
  
  analysisResult,
  isAnalyzing,
  canAnalyze,
  onPerformComparison,
  
  isSending,
  onSendToWebhook,
  onCopyResult,
  
  webhookResponse
}: DualImageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AppHeader />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Settings */}
        <DeviceSettingsCard
          equipmentName={equipmentName}
          setEquipmentName={onEquipmentNameChange}
          location={location}
          setLocation={onLocationChange}
        />

        {/* Image Upload Section */}
        <ImageUploadSection
          referenceImage={referenceImage}
          measurementImage={measurementImage}
          referenceText={referenceText}
          measurementText={measurementText}
          isProcessingRef={isProcessingRef}
          isProcessingMeas={isProcessingMeas}
          onReferenceImageSelect={onReferenceImageSelect}
          onMeasurementImageSelect={onMeasurementImageSelect}
          onProcessReferenceOCR={onProcessReferenceOCR}
          onProcessMeasurementOCR={onProcessMeasurementOCR}
        />

        {/* Analysis Controls */}
        <AnalysisControlCard
          onPerformComparison={onPerformComparison}
          isAnalyzing={isAnalyzing}
          referenceText={referenceText}
          measurementText={measurementText}
          analysisResult={analysisResult}
          onSendToWebhook={onSendToWebhook}
          isSending={isSending}
          onCopyResult={onCopyResult}
          canAnalyze={canAnalyze}
        />

        {/* Analysis Results */}
        {analysisResult && (
          <AnalysisResultsCard 
            analysisResult={analysisResult}
            equipmentName={equipmentName}
            location={location}
            referenceText={referenceText}
            measurementText={measurementText}
            webhookResponse={webhookResponse}
          />
        )}

        {/* Usage Guide */}
        <UsageGuideCard />
      </div>
    </div>
  );
};

export default DualImageLayout;
