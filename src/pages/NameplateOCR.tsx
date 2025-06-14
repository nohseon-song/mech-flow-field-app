
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Camera, Upload, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const NameplateOCR = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const processImage = async () => {
    if (!selectedFile) {
      toast({
        title: "이미지를 선택해주세요",
        description: "명판 사진을 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Google Gemini Vision API 호출 시뮬레이션
    setTimeout(() => {
      const mockData = {
        manufacturer: "한국기계공업",
        model: "KMI-2024-B1",
        serialNumber: "KMI240615001",
        capacity: "500kW",
        voltage: "380V",
        frequency: "60Hz",
        manufactureDate: "2024.03",
        weight: "850kg"
      };

      setExtractedData(mockData);
      setIsProcessing(false);

      toast({
        title: "인식 완료",
        description: "명판 정보가 성공적으로 추출되었습니다."
      });
    }, 3000);
  };

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
                <Camera className="h-6 w-6 text-green-600" />
                AI 명판 OCR
              </h1>
              <p className="text-sm text-slate-600">명판 사진에서 자동 정보 추출</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              명판 사진 업로드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-3">설비 명판 사진을 업로드하세요</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mb-3"
              />
              {selectedFile && (
                <p className="text-sm text-green-600">
                  선택된 파일: {selectedFile.name}
                </p>
              )}
            </div>
            <Button 
              onClick={processImage}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  AI 인식 중...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  명판 사진 업로드
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {extractedData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5 text-green-600" />
                추출된 명판 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">제조사</label>
                  <Input value={extractedData.manufacturer} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">모델명</label>
                  <Input value={extractedData.model} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">시리얼번호</label>
                  <Input value={extractedData.serialNumber} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">용량</label>
                  <Input value={extractedData.capacity} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">전압</label>
                  <Input value={extractedData.voltage} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">주파수</label>
                  <Input value={extractedData.frequency} readOnly />
                </div>
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                설비 정보에 저장
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NameplateOCR;
