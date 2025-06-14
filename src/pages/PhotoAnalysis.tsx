
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Camera, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GuidelineSelector } from '@/components/memo/GuidelineSelector';
import { PhotoUpload } from '@/components/photo/PhotoUpload';
import { AnalysisResults } from '@/components/photo/AnalysisResults';
import { usePhotoAnalysis } from '@/hooks/usePhotoAnalysis';

const PhotoAnalysis = () => {
  const navigate = useNavigate();
  const {
    selectedFile,
    guideline,
    setGuideline,
    isAnalyzing,
    analysisResult,
    handleFileSelect,
    analyzePhoto
  } = usePhotoAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Camera className="h-6 w-6 text-orange-600" />
                AI 사진 분석
              </h1>
              <p className="text-sm text-slate-600">설비 사진 원인/징후/개선방안 분석</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Guideline Selection */}
        <GuidelineSelector 
          guideline={guideline}
          onGuidelineChange={setGuideline}
        />

        {/* Upload Section */}
        <PhotoUpload
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onAnalyze={analyzePhoto}
          isAnalyzing={isAnalyzing}
        />

        {/* Analysis Results */}
        {analysisResult && (
          <AnalysisResults 
            analysisResult={analysisResult}
            guideline={guideline}
          />
        )}
      </div>
    </div>
  );
};

export default PhotoAnalysis;
