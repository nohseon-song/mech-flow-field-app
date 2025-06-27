
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, FileImage, Zap, Copy, Edit, Save, Trash2, Send, Compare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { extractTextFromImage, type OCRResult } from '@/utils/ocrProcessor';
import { parseDualImageData, compareImageData, sendComparisonToWebhook, type DualImageAnalysis } from '@/utils/dualImageAnalysis';

const DualImageOCR = () => {
  const navigate = useNavigate();
  
  // Image states
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [measurementImage, setMeasurementImage] = useState<File | null>(null);
  
  // OCR states
  const [referenceOCR, setReferenceOCR] = useState<OCRResult | null>(null);
  const [measurementOCR, setMeasurementOCR] = useState<OCRResult | null>(null);
  const [referenceText, setReferenceText] = useState('');
  const [measurementText, setMeasurementText] = useState('');
  
  // Analysis states
  const [analysisResult, setAnalysisResult] = useState<DualImageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Settings
  const [deviceId, setDeviceId] = useState('');
  const [location, setLocation] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('https://hook.eu2.make.com/qdvne23w47e7qbnrfobit8vuaa61b5wl');
  
  // Processing states
  const [isProcessingRef, setIsProcessingRef] = useState(false);
  const [isProcessingMeas, setIsProcessingMeas] = useState(false);

  const handleReferenceImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "파일 형식 오류",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive"
        });
        return;
      }
      setReferenceImage(file);
      setReferenceOCR(null);
      setReferenceText('');
      setAnalysisResult(null);
    }
  };

  const handleMeasurementImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "파일 형식 오류",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive"
        });
        return;
      }
      setMeasurementImage(file);
      setMeasurementOCR(null);
      setMeasurementText('');
      setAnalysisResult(null);
    }
  };

  const processReferenceOCR = async () => {
    if (!referenceImage) return;
    
    setIsProcessingRef(true);
    try {
      const result = await extractTextFromImage(referenceImage);
      setReferenceOCR(result);
      setReferenceText(result.extractedText);
      
      toast({
        title: "설계 기준 OCR 완료",
        description: `신뢰도: ${Math.round(result.confidence * 100)}%`
      });
    } catch (error) {
      toast({
        title: "OCR 처리 실패",
        description: "설계 기준 이미지 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingRef(false);
    }
  };

  const processMeasurementOCR = async () => {
    if (!measurementImage) return;
    
    setIsProcessingMeas(true);
    try {
      const result = await extractTextFromImage(measurementImage);
      setMeasurementOCR(result);
      setMeasurementText(result.extractedText);
      
      toast({
        title: "실측 이미지 OCR 완료",
        description: `신뢰도: ${Math.round(result.confidence * 100)}%`
      });
    } catch (error) {
      toast({
        title: "OCR 처리 실패",
        description: "실측 이미지 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingMeas(false);
    }
  };

  const performComparison = async () => {
    if (!referenceText || !measurementText) {
      toast({
        title: "데이터 부족",
        description: "두 이미지 모두 OCR 처리를 완료해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const referenceData = parseDualImageData(referenceText);
      const measurementData = parseDualImageData(measurementText);
      
      const analysis = compareImageData(
        referenceData, 
        measurementData, 
        referenceImage?.name || 'reference',
        measurementImage?.name || 'measurement',
        deviceId || 'AUTO-' + Date.now(),
        location || '미지정'
      );
      
      setAnalysisResult(analysis);
      
      toast({
        title: "비교 분석 완료",
        description: "두 이미지의 데이터 비교가 완료되었습니다."
      });
    } catch (error) {
      toast({
        title: "분석 실패",
        description: "데이터 비교 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendAnalysisToWebhook = async () => {
    if (!analysisResult) {
      toast({
        title: "분석 결과 없음",
        description: "먼저 비교 분석을 수행해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    try {
      const success = await sendComparisonToWebhook(analysisResult, webhookUrl);
      
      if (success) {
        toast({
          title: "분석 결과 전송 완료",
          description: "Make.com으로 데이터가 성공적으로 전송되었습니다."
        });
      } else {
        throw new Error('Webhook 전송 실패');
      }
    } catch (error) {
      toast({
        title: "전송 실패",
        description: "분석 결과 전송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyAnalysisResult = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
      toast({
        title: "복사 완료",
        description: "분석 결과가 클립보드에 복사되었습니다."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Compare className="h-6 w-6 text-indigo-600" />
                다중 장비 비교 분석
              </h1>
              <p className="text-sm text-slate-600">설계 기준과 실측값 자동 비교 및 진단</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              ⚙️ 장비 정보 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">장비 ID</label>
                <Input
                  placeholder="장비 고유 식별자 (예: TUF-001)"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">설치 위치</label>
                <Input
                  placeholder="현장명 또는 위치코드"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Webhook URL</label>
              <Input
                placeholder="Make.com Webhook URL"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reference Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileImage className="h-5 w-5 text-green-600" />
                설계 기준 이미지
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReferenceImageSelect}
                  className="hidden"
                  id="reference-upload"
                />
                <label
                  htmlFor="reference-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:bg-green-50"
                >
                  <FileImage className="h-8 w-8 text-green-400 mb-2" />
                  <span className="text-sm text-green-600">
                    {referenceImage ? referenceImage.name : '설계 기준 이미지 선택'}
                  </span>
                </label>
              </div>

              {referenceImage && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(referenceImage)}
                    alt="Reference image"
                    className="max-w-full h-auto rounded-lg border max-h-48 mx-auto"
                  />
                </div>
              )}

              <Button 
                onClick={processReferenceOCR}
                disabled={isProcessingRef || !referenceImage}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessingRef ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    텍스트 추출하기
                  </>
                )}
              </Button>

              {referenceText && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-green-700 max-h-32 overflow-y-auto">
                    {referenceText}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Measurement Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileImage className="h-5 w-5 text-blue-600" />
                실측 이미지
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMeasurementImageSelect}
                  className="hidden"
                  id="measurement-upload"
                />
                <label
                  htmlFor="measurement-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50"
                >
                  <FileImage className="h-8 w-8 text-blue-400 mb-2" />
                  <span className="text-sm text-blue-600">
                    {measurementImage ? measurementImage.name : '실측 이미지 선택'}
                  </span>
                </label>
              </div>

              {measurementImage && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(measurementImage)}
                    alt="Measurement image"
                    className="max-w-full h-auto rounded-lg border max-h-48 mx-auto"
                  />
                </div>
              )}

              <Button 
                onClick={processMeasurementOCR}
                disabled={isProcessingMeas || !measurementImage}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessingMeas ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    텍스트 추출하기
                  </>
                )}
              </Button>

              {measurementText && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-blue-700 max-h-32 overflow-y-auto">
                    {measurementText}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analysis Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Compare className="h-5 w-5 text-purple-600" />
              비교 분석
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={performComparison}
                disabled={isAnalyzing || !referenceText || !measurementText}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Compare className="h-4 w-4 mr-2 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Compare className="h-4 w-4 mr-2" />
                    분석하기
                  </>
                )}
              </Button>

              {analysisResult && (
                <>
                  <Button 
                    onClick={sendAnalysisToWebhook}
                    disabled={isSending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSending ? (
                      <>
                        <Send className="h-4 w-4 mr-2 animate-spin" />
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        분석 전송
                      </>
                    )}
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={copyAnalysisResult}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    복사
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                📊 분석 결과
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 max-h-96 overflow-y-auto">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Guide */}
        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-sm text-indigo-800">📋 사용 가이드</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="text-xs text-indigo-700 space-y-1 list-decimal list-inside">
              <li>장비 정보 설정에서 장비 ID와 위치를 입력하세요</li>
              <li>설계 기준 이미지를 업로드하고 "텍스트 추출하기"를 클릭하세요</li>
              <li>실측 이미지를 업로드하고 "텍스트 추출하기"를 클릭하세요</li>
              <li>"분석하기"를 클릭하여 두 이미지의 데이터를 비교하세요</li>
              <li>"분석 전송"을 클릭하여 결과를 Make.com으로 전송하세요</li>
              <li>다수 장비 분석 시 장비 ID를 변경하며 반복 사용하세요</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DualImageOCR;
