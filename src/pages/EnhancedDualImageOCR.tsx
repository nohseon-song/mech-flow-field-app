
import React from 'react';
import { useEnhancedOCRProcessing } from '@/hooks/useEnhancedOCRProcessing';
import { useEnhancedAnalysisProcessing } from '@/hooks/useEnhancedAnalysisProcessing';
import { useEnhancedWebhookOperations } from '@/hooks/useEnhancedWebhookOperations';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';
import EnhancedDualImageLayout from '@/components/dual-image/EnhancedDualImageLayout';

const EnhancedDualImageOCR = () => {
  // 향상된 훅들 사용
  const {
    referenceImage,
    measurementImage,
    referenceData,
    measurementData,
    isProcessingRef,
    isProcessingMeas,
    handleReferenceImageSelect,
    handleMeasurementImageSelect,
    processReferenceOCR,
    processMeasurementOCR,
    resetOCRData
  } = useEnhancedOCRProcessing();

  const {
    analysisResult,
    isAnalyzing,
    isEditing,
    editableResult,
    userComment,
    setUserComment,
    performComparison,
    canAnalyze,
    setAnalysisResult,
    startEditing,
    saveEditing,
    cancelEditing,
    updateEditableField,
    updateRecommendation,
    addRecommendation,
    removeRecommendation
  } = useEnhancedAnalysisProcessing();

  const {
    webhookResponse,
    isSending,
    lastSentData,
    sendAnalysisToWebhook,
    copyAnalysisResult,
    retryLastSend
  } = useEnhancedWebhookOperations();

  const { equipmentData, saveEquipmentData } = useEquipmentStorage();

  // 이미지 변경 시 분석 결과 초기화
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
    if (referenceData && measurementData) {
      performComparison(referenceData, measurementData, referenceImage, measurementImage);
    }
  };

  const handleSendToWebhook = () => {
    if (analysisResult && referenceData && measurementData) {
      sendAnalysisToWebhook(analysisResult, referenceData, measurementData, userComment);
    }
  };

  const handleCopyResult = () => {
    if (analysisResult && referenceData && measurementData) {
      copyAnalysisResult(analysisResult, referenceData, measurementData, userComment);
    }
  };

  const handleLoadHistory = (historyItem: any) => {
    setAnalysisResult(historyItem);
    setUserComment(historyItem.userComment || '');
  };

  // 분석 가능 여부 확인
  const isAnalysisEnabled = canAnalyze(referenceData, measurementData);

  console.log('향상된 분석 상태:', {
    referenceDataExists: !!referenceData,
    measurementDataExists: !!measurementData,
    equipmentName: equipmentData.equipmentName,
    canAnalyze: isAnalysisEnabled,
    isAnalyzing
  });

  return (
    <EnhancedDualImageLayout
      equipmentName={equipmentData.equipmentName}
      location={equipmentData.location}
      onEquipmentNameChange={(name) => saveEquipmentData({ equipmentName: name })}
      onLocationChange={(loc) => saveEquipmentData({ location: loc })}
      
      referenceImage={referenceImage}
      measurementImage={measurementImage}
      referenceData={referenceData}
      measurementData={measurementData}
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
      
      // 편집 관련
      isEditing={isEditing}
      editableResult={editableResult}
      onStartEditing={startEditing}
      onSaveEditing={saveEditing}
      onCancelEditing={cancelEditing}
      onUpdateField={updateEditableField}
      onUpdateRecommendation={updateRecommendation}
      onAddRecommendation={addRecommendation}
      onRemoveRecommendation={removeRecommendation}
      
      userComment={userComment}
      onUserCommentChange={setUserComment}
      
      isSending={isSending}
      onSendToWebhook={handleSendToWebhook}
      onCopyResult={handleCopyResult}
      onRetryLastSend={retryLastSend}
      
      webhookResponse={webhookResponse}
      lastSentData={lastSentData}
      
      onLoadHistory={handleLoadHistory}
    />
  );
};

export default EnhancedDualImageOCR;
