import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileImage, Zap, Copy, Edit, Save, Trash2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGuidelines } from '@/hooks/useGuidelines';
import { toast } from '@/hooks/use-toast';
import { extractTextFromImage, type OCRResult } from '@/utils/ocrProcessor';
import { parseOCRText, generateDiagnosis, sendToWebhook, type WebhookPayload } from '@/utils/ocrDataParser';

const NameplateOCR = () => {
  const navigate = useNavigate();
  const { getGuideline } = useGuidelines();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      
      setSelectedFile(file);
      setOcrResult(null);
      setExtractedText('');
      setIsEditing(false);
    }
  };

  const processOCR = async () => {
    if (!selectedFile) {
      toast({
        title: "이미지를 선택해주세요",
        description: "처리할 이미지를 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      toast({
        title: "OCR 처리 중",
        description: "이미지에서 텍스트를 추출하고 있습니다..."
      });

      // 실제 OCR 처리
      const result = await extractTextFromImage(selectedFile);
      
      // 지침 기반 후처리
      const operationGuideline = getGuideline('operation');
      const knowledgeGuideline = getGuideline('knowledge');
      
      let processedText = result.extractedText;
      
      if (operationGuideline || knowledgeGuideline) {
        processedText += '\n\n--- AI 지침 적용 ---';
        if (operationGuideline) {
          processedText += '\n• 운용지침: 실무 중심 해석 및 안전 고려사항 포함';
        }
        if (knowledgeGuideline) {
          processedText += '\n• 지식지침: 관련 법규 및 기술기준 준수사항 반영';
        }
      }

      setOcrResult(result);
      setExtractedText(processedText);
      setEditedText(processedText);
      setIsProcessing(false);

      toast({
        title: "OCR 추출 완료",
        description: `신뢰도: ${Math.round(result.confidence * 100)}%`
      });

    } catch (error) {
      console.error('OCR 처리 오류:', error);
      setIsProcessing(false);
      
      toast({
        title: "OCR 처리 실패",
        description: "텍스트 추출 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const sendToWebhookHandler = async () => {
    if (!extractedText) {
      toast({
        title: "추출된 텍스트가 없습니다",
        description: "먼저 OCR 처리를 완료해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSendingWebhook(true);

    try {
      // 측정 데이터 파싱
      const measurementData = parseOCRText(extractedText);
      
      // 진단 데이터 생성
      const diagnosis = generateDiagnosis(measurementData, extractedText);

      // Webhook 페이로드 구성
      const payload: WebhookPayload = {
        site_info: {
          device_id: selectedFile?.name.split('.')[0] || 'UNKNOWN',
          timestamp: new Date().toISOString()
        },
        measurement_data: measurementData,
        diagnosis: diagnosis,
        raw_text: extractedText
      };

      // Webhook 전송
      const success = await sendToWebhook(payload);

      if (success) {
        toast({
          title: "분석 데이터 전송 완료",
          description: "Make.com으로 데이터가 성공적으로 전송되었습니다."
        });
      } else {
        throw new Error('Webhook 전송 실패');
      }

    } catch (error) {
      console.error('Webhook 전송 오류:', error);
      toast({
        title: "OCR 또는 분석 중 오류 발생",
        description: "데이터 전송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSendingWebhook(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = isEditing ? editedText : extractedText;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "복사 완료", 
      description: "추출된 정보가 클립보드에 복사되었습니다."
    });
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedText(extractedText);
  };

  const saveEdit = () => {
    setExtractedText(editedText);
    setIsEditing(false);
    toast({
      title: "저장 완료",
      description: "텍스트가 성공적으로 저장되었습니다."
    });
  };

  const cancelEdit = () => {
    setEditedText(extractedText);
    setIsEditing(false);
  };

  const clearText = () => {
    setExtractedText('');
    setEditedText('');
    setOcrResult(null);
    setIsEditing(false);
    toast({
      title: "텍스트 삭제",
      description: "추출된 텍스트가 삭제되었습니다."
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
                AI OCR 판독
              </h1>
              <p className="text-sm text-slate-600">설비 명판 및 문서 텍스트 자동 추출</p>
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
              이미지 업로드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="ocr-upload"
              />
              <label
                htmlFor="ocr-upload"
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
                  alt="Selected image"
                  className="max-w-full h-auto rounded-lg border max-h-48 mx-auto"
                />
              </div>
            )}

            <Button 
              onClick={processOCR}
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
                  텍스트 추출하기
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 추출된 정보 */}
        {(extractedText || isEditing) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>추출된 정보</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={sendToWebhookHandler}
                    disabled={isSendingWebhook}
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  >
                    {isSendingWebhook ? (
                      <>
                        <Send className="h-4 w-4 mr-1 animate-spin" />
                        전송 중
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        분석 전송
                      </>
                    )}
                  </Button>
                  {!isEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={startEditing}>
                        <Edit className="h-4 w-4 mr-1" />
                        편집
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-1" />
                        복사
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearText}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={saveEdit}>
                        <Save className="h-4 w-4 mr-1" />
                        저장
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEdit}>
                        취소
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="min-h-32 text-sm"
                  placeholder="텍스트를 편집하세요..."
                />
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700">
                    {extractedText}
                  </pre>
                </div>
              )}
              
              {/* OCR 신뢰도 표시 */}
              {ocrResult && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">
                    📊 OCR 처리 결과
                  </p>
                  <div className="text-xs text-green-700 mt-1">
                    신뢰도: {Math.round(ocrResult.confidence * 100)}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Make.com 연동 정보 */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-sm text-green-800">🔗 Make.com 자동화 연동</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-green-700 space-y-1">
              <li>• OCR 추출 후 "분석 전송" 버튼으로 Make.com 워크플로우 실행</li>
              <li>• 측정값, 상태값, 진단 결과를 JSON으로 구조화하여 전송</li>
              <li>• Make.com에서 고급 GPT 분석 및 전문 보고서 자동 생성</li>
              <li>• 실시간 현장 데이터 수집 및 분석 파이프라인 완성</li>
            </ul>
          </CardContent>
        </Card>

        {/* 사용 팁 */}
        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-sm text-indigo-800">📋 OCR 사용 팁</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-indigo-700 space-y-1">
              <li>• 텍스트가 선명하게 보이는 고화질 이미지를 업로드하세요</li>
              <li>• 조명이 충분하고 그림자가 없는 상태에서 촬영하세요</li>
              <li>• 텍스트가 화면에 크게 나오도록 가까이서 촬영하세요</li>
              <li>• 기울어지지 않도록 정면에서 촬영하세요</li>
              <li>• 추출된 텍스트는 편집, 복사, 삭제가 가능합니다</li>
              <li>• AI 지침 설정에서 맞춤형 분석 지침을 설정할 수 있습니다</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NameplateOCR;
