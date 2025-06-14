
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Camera, Upload, Sparkles, AlertTriangle, Search, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const PhotoAnalysis = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [guideline, setGuideline] = useState('operation');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const analyzePhoto = async () => {
    if (!selectedFile) {
      toast({
        title: "사진을 선택해주세요",
        description: "분석할 설비 사진을 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Google Gemini Vision API 호출 시뮬레이션
    setTimeout(() => {
      const mockAnalysis = {
        causes: [
          "배관 연결부 노후화로 인한 실링 불량",
          "과도한 진동으로 인한 볼트 풀림",
          "온도 변화에 따른 열팽창/수축"
        ],
        symptoms: [
          "배관 연결부에서 미량 누수 발견",
          "주변 바닥에 물방울 흔적 확인",
          "연결부 주변 녹 발생 징후"
        ],
        improvements: guideline === 'operation' ? [
          "연결부 조임 토크 재점검 (권장: 50Nm)",
          "실링재 교체 후 누수 재확인",
          "정기 점검 주기를 월 1회로 단축",
          "진동 저감을 위한 댐퍼 설치 검토"
        ] : [
          "기계설비법 제15조에 따른 성능점검 실시",
          "KS B 0251 배관 접합 기준 준수",
          "산업안전보건법 제36조 정기점검 이행",
          "설비 운전 매뉴얼 개정 필요"
        ]
      };

      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);

      toast({
        title: "분석 완료",
        description: "사진 분석이 완료되었습니다."
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              분석 지침 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={guideline} onValueChange={setGuideline}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="operation" id="operation" />
                <Label htmlFor="operation">운용지침 (실무 중심)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="knowledge" id="knowledge" />
                <Label htmlFor="knowledge">지식지침 (법규/표준 중심)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Upload Section */}
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
              onClick={analyzePhoto}
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

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-4">
            {/* 원인 분석 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5 text-red-600" />
                  원인 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.causes.map((cause: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-slate-700">{cause}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 징후 분석 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  징후 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.symptoms.map((symptom: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-slate-700">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 개선방안 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-green-600" />
                  개선방안
                  {guideline === 'operation' ? 
                    <span className="text-sm text-blue-600">(운용지침)</span> : 
                    <span className="text-sm text-purple-600">(지식지침)</span>
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-slate-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoAnalysis;
