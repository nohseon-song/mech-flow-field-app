
import React from 'react';
import ImageUploadCard from './ImageUploadCard';

interface ImageUploadSectionProps {
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
}

const ImageUploadSection = ({
  referenceImage,
  measurementImage,
  referenceText,
  measurementText,
  isProcessingRef,
  isProcessingMeas,
  onReferenceImageSelect,
  onMeasurementImageSelect,
  onProcessReferenceOCR,
  onProcessMeasurementOCR
}: ImageUploadSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ImageUploadCard
        title="기준값(설계값) 이미지"
        image={referenceImage}
        onImageSelect={onReferenceImageSelect}
        onProcessOCR={onProcessReferenceOCR}
        isProcessing={isProcessingRef}
        extractedText={referenceText}
        inputId="reference-upload"
        color="green"
      />

      <ImageUploadCard
        title="측정값 이미지"
        image={measurementImage}
        onImageSelect={onMeasurementImageSelect}
        onProcessOCR={onProcessMeasurementOCR}
        isProcessing={isProcessingMeas}
        extractedText={measurementText}
        inputId="measurement-upload"
        color="blue"
      />
    </div>
  );
};

export default ImageUploadSection;
