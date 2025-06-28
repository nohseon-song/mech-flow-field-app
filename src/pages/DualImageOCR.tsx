
import React from 'react';
import { useOCRProcessing } from '@/hooks/useOCRProcessing';
import { useAnalysisProcessing } from '@/hooks/useAnalysisProcessing';
import { useWebhookOperations } from '@/hooks/useWebhookOperations';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';
import AppHeader from '@/components/dual-image/AppHeader';
import DeviceSettingsCard from '@/components/dual-image/DeviceSettingsCard';
import ImageUploadCard from '@/components/dual-image/ImageUploadCard';
import AnalysisControlCard from '@/components/dual-image/AnalysisControlCard';
import AnalysisResultsCard from '@/components/dual-image/AnalysisResultsCard';
import UsageGuideCard from '@/components/dual-image/UsageGuideCard';

const DualImageOCR = () => {
  // Custom hooks for different concerns
  const {
    referenceImage,
    measurementImage,
    referenceText,
    measurementText,
    isProcessingRef,
    isProcessingMeas,
    handleReferenceImageSelect,
    handleMeasurementImageSelect,
    processReferenceOCR,
    processMeasurementOCR,
    resetOCRData
  } = useOCRProcessing();

  const {
    analysisResult,
    isAnalyzing,
    performComparison,
    canAnalyze,
    setAnalysisResult
  } = useAnalysisProcessing();

  const {
    webhookResponse,
    isSending,
    sendAnalysisToWebhook,
    copyAnalysisResult
  } = useWebhookOperations();

  const { equipmentData, saveEquipmentData } = useEquipmentStorage();

  // Reset analysis when images change
  const handleImageChange = () => {
    setAnalysisResult(null);
    resetOCRData();
  };

  const handlePerformComparison = () => {
    performComparison(referenceText, measurementText, referenceImage, measurementImage);
  };

  const handleSendToWebhook = () => {
    if (analysisResult) {
      sendAnalysisToWebhook(analysisResult);
    }
  };

  const handleCopyResult = () => {
    if (analysisResult) {
      copyAnalysisResult(analysisResult);
    }
  };

  // Check if analysis button can be enabled
  const isAnalysisEnabled = canAnalyze(referenceText, measurementText);

  console.log('분석 버튼 상태:', {
    referenceTextLength: referenceText.length,
    measurementTextLength: measurementText.length,
    equipmentName: equipmentData.equipmentName,
    canAnalyze: isAnalysisEnabled,
    isAnalyzing
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AppHeader />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Settings */}
        <DeviceSettingsCard
          equipmentName={equipmentData.equipmentName}
          setEquipmentName={(name) => saveEquipmentData({ equipmentName: name })}
          location={equipmentData.location}
          setLocation={(loc) => saveEquipmentData({ location: loc })}
        />

        {/* Image Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUploadCard
            title="기준값(설계값) 이미지"
            image={referenceImage}
            onImageSelect={(e) => {
              handleReferenceImageSelect(e);
              handleImageChange();
            }}
            onProcessOCR={processReferenceOCR}
            isProcessing={isProcessingRef}
            extractedText={referenceText}
            inputId="reference-upload"
            color="green"
          />

          <ImageUploadCard
            title="측정값 이미지"
            image={measurementImage}
            onImageSelect={(e) => {
              handleMeasurementImageSelect(e);
              handleImageChange();
            }}
            onProcessOCR={processMeasurementOCR}
            isProcessing={isProcessingMeas}
            extractedText={measurementText}
            inputId="measurement-upload"
            color="blue"
          />
        </div>

        {/* Analysis Controls */}
        <AnalysisControlCard
          onPerformComparison={handlePerformComparison}
          isAnalyzing={isAnalyzing}
          referenceText={referenceText}
          measurementText={measurementText}
          analysisResult={analysisResult}
          onSendToWebhook={handleSendToWebhook}
          isSending={isSending}
          onCopyResult={handleCopyResult}
          canAnalyze={isAnalysisEnabled}
        />

        {/* Analysis Results */}
        {analysisResult && (
          <AnalysisResultsCard 
            analysisResult={analysisResult}
            equipmentName={equipmentData.equipmentName}
            location={equipmentData.location}
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

export default DualImageOCR;
