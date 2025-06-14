
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileImage, Zap, Copy } from 'lucide-react';
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
      setExtractedData(null);
    }
  };

  const processImage = async () => {
    if (!selectedFile) {
      toast({
        title: "이미지를 선택해주세요",
        description: "처리할 네임플레이트 이미지를 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // OCR 처리 시뮬레이션
    setTimeout(() => {
      const mockData = {
        manufacturer: "ABC 산업기계",
        model: "Model: ABC-2024-PRO",
        serialNumber: "Serial No: 20240601-001",
        capacity: "Capacity: 500kW",
        voltage: "Voltage: 440V, 3Phase",
        current: "Current: 850A",
        frequency: "Frequency: 60Hz",
        manufacturingDate: "제조일자: 2024.06.01",
        certificateNumber: "검정번호: KC-2024-0601-001"
      };

      setExtractedData(mockData);
      setIsProcessing(false);

      toast({
        title: "추출 완료",
        description: "네임플레이트 정보가 성공적으로 추출되었습니다."
      });
    }, 3000);
  };

  const copyToClipboard = () => {
    if (!extractedData) return;

    const text = Object.entries(extractedData)
      .map(([key, value]) => `${value}`)
      .join('\n');

    navigator.clipboard.writeText(text);
    toast({
      title: "복사 완료",
      description: "추출된 정보가 클립보드에 복사되었습니다."
    });
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
                <FileImage className="h-6 w-6 text-indigo-600" />
                네임플레이트 OCR
              </h1>
              <p className="text-sm text-slate-600">설비 명판 정보 자동 추출</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 이미지 업로드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileImage className="h-5 w-5 text-indigo-600" />
              네임플레이트 이미지 업로드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="nameplate-upload"
              />
              <label
                htmlFor="nameplate-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
              >
                <FileImage className="h-8 w-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-600">
                  {selectedFile ? selectedFile.name : '이미지를 선택하세요'}
                </span>
              </label>
            </div>

            {selectedFile && (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected nameplate"
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
            )}

            <Button 
              onClick={processImage}
              disabled={isProcessing || !selectedFile}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isProcessing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  OCR 처리 중...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  정보 추출하기
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 추출된 정보 */}
        {extractedData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>추출된 정보</span>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  복사
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-slate-700">{value as string}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 사용 팁 */}
        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-sm text-indigo-800">📋 OCR 사용 팁</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-indigo-700 space-y-1">
              <li>• 네임플레이트가 선명하게 보이는 고화질 이미지를 업로드하세요</li>
              <li>• 조명이 충분하고 그림자가 없는 상태에서 촬영하세요</li>
              <li>• 네임플레이트가 화면에 크게 나오도록 가까이서 촬영하세요</li>
              <li>• 기울어지지 않도록 정면에서 촬영하세요</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NameplateOCR;
