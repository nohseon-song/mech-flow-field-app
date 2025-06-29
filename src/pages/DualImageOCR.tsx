
import React from 'react';
import { useOCRProcessing } from '@/hooks/useOCRProcessing';
import { useAnalysisProcessing } from '@/hooks/useAnalysisProcessing';
import { useWebhookOperations } from '@/hooks/useWebhookOperations';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';
import DualImageLayout from '@/components/dual-image/DualImageLayout';

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

  const handleReferenceImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleReferenceImageSelect(event);
    handleImageChange();
  };

  const handleMeasurementImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleMeasurementImageSelect(event);
    handleImageChange();
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
    <DualImageLayout
      equipmentName={equipmentData.equipmentName}
      location={equipmentData.location}
      onEquipmentNameChange={(name) => saveEquipmentData({ equipmentName: name })}
      onLocationChange={(loc) => saveEquipmentData({ location: loc })}
      
      referenceImage={referenceImage}
      measurementImage={measurementImage}
      referenceText={referenceText}
      measurementText={measurementText}
      isProcessingRef={isProcessingRef}
      isProcessingMeas={isProcessingMeas}
      
      onReferenceImageSelect={handleReferenceImageChange}
      onMeasurementImageSelect={handleMeasurementImageChange}
      onProcessReferenceOCR={processReferenceOCR}
      onProcessMeasurementOCR={processMeasurementOCR}
      
      analysisResult={analysisResult}
      isAnalyzing={isAnalyzing}
      canAnalyze={isAnalysisEnabled}
      onPerformComparison={handlePerformComparison}
      
      isSending={isSending}
      onSendToWebhook={handleSendToWebhook}
      onCopyResult={handleCopyResult}
      
      webhookResponse={webhookResponse}
    />
  );
};

export default DualImageOCR;
