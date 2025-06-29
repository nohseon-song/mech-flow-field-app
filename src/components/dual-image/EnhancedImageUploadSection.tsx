
import React from 'react';
import EnhancedImageUploadCard from './EnhancedImageUploadCard';
import { type ParsedEquipmentData } from '@/utils/textDataParser';

interface EnhancedImageUploadSectionProps {
  referenceImage: File | null;
  measurementImage: File | null;
  referenceData: ParsedEquipmentData | null;
  measurementData: ParsedEquipmentData | null;
  isProcessingRef: boolean;
  isProcessingMeas: boolean;
  onReferenceImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMeasurementImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessReferenceOCR: () => void;
  onProcessMeasurementOCR: () => void;
}

const EnhancedImageUploadSection = ({
  referenceImage,
  measurementImage,
  referenceData,
  measurementData,
  isProcessingRef,
  isProcessingMeas,
  onReferenceImageSelect,
  onMeasurementImageSelect,
  onProcessReferenceOCR,
  onProcessMeasurementOCR
}: EnhancedImageUploadSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <EnhancedImageUploadCard
        title="기준값(설계값) 이미지"
        image={referenceImage}
        onImageSelect={onReferenceImageSelect}
        onProcessOCR={onProcessReferenceOCR}
        isProcessing={isProcessingRef}
        parsedData={referenceData}
        inputId="reference-upload"
        color="green"
      />

      <EnhancedImageUploadCard
        title="측정값 이미지"
        image={measurementImage}
        onImageSelect={onMeasurementImageSelect}
        onProcessOCR={onProcessMeasurementOCR}
        isProcessing={isProcessingMeas}
        parsedData={measurementData}
        inputId="measurement-upload"
        color="blue"
      />
    </div>
  );
};

export default EnhancedImageUploadSection;
