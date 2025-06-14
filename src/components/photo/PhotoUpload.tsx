
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Camera, Sparkles } from 'lucide-react';

interface PhotoUploadProps {
  selectedFile: File | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const PhotoUpload = ({ selectedFile, onFileSelect, onAnalyze, isAnalyzing }: PhotoUploadProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5 text-orange-600" />
          설비 사진 업로드
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-3">분석할 설비 사진을 업로드하세요</p>
          <Input
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="mb-3"
          />
          {selectedFile && (
            <p className="text-sm text-green-600">
              선택된 파일: {selectedFile.name}
            </p>
          )}
        </div>
        <Button 
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              AI 분석 중...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              사진 분석하기
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
