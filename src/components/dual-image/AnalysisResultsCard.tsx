import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Settings, MessageSquare } from 'lucide-react';
import { generateAnalysisPDF } from '@/utils/pdfGenerator';
import { AdvancedAnalysisResult } from '@/utils/advancedAnalysis';

interface AnalysisResultsCardProps {
  analysisResult: AdvancedAnalysisResult;
  equipmentName: string;
  location: string;
  referenceText: string;
  measurementText: string;
  userComment: string;
  onUserCommentChange: (comment: string) => void;
  webhookResponse?: any;
}

const AnalysisResultsCard = ({ 
  analysisResult, 
  equipmentName, 
  location,
  referenceText,
  measurementText,
  userComment,
  onUserCommentChange,
  webhookResponse 
}: AnalysisResultsCardProps) => {
  
  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'high':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700';
    }
  };

  const getRiskText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return { text: '낮음', color: 'text-green-700 dark:text-green-300' };
      case 'medium':
        return { text: '보통', color: 'text-yellow-700 dark:text-yellow-300' };
      case 'high':
        return { text: '높음', color: 'text-red-700 dark:text-red-300' };
      default:
        return { text: '미정', color: 'text-gray-700 dark:text-gray-300' };
    }
  };

  const handleDownloadPDF = () => {
    generateAnalysisPDF({
      equipmentName,
      location,
      analysisDate: new Date(analysisResult.timestamp).toLocaleString('ko-KR'),
      referenceData: referenceText,
      measurementData: measurementText,
      analysisResult,
      userComment,
      webhookResponse
    });
  };

  const riskInfo = getRiskText(analysisResult.riskLevel);

  return (
    <Card className={`${getRiskColor(analysisResult.riskLevel)} border-2`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          {getRiskIcon(analysisResult.riskLevel)}
          📊 AI 분석 결과
          <div className="ml-auto flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${riskInfo.color} bg-white dark:bg-gray-800`}>
              위험도: {riskInfo.text}
            </div>
            <Button
              onClick={handleDownloadPDF}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF 다운로드
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 설비 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">설비명칭</p>
              <p className="font-medium text-gray-900 dark:text-white">{equipmentName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">설치위치</p>
              <p className="font-medium text-gray-900 dark:text-white">{location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">분석일시</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(analysisResult.timestamp).toLocaleString('ko-KR')}
              </p>
            </div>
          </div>
        </div>

        {/* 현장 의견 입력 섹션 */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            💬 현장 의견 입력
          </h4>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <Textarea
              value={userComment}
              onChange={(e) => onUserCommentChange(e.target.value)}
              placeholder="현장에서 확인된 추가 정보나 의견을 입력해주세요..."
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              이 의견은 PDF 리포트와 Make.com 전송에 포함됩니다.
            </p>
          </div>
        </div>

        {/* 분석 결과 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                📋 현재 상태
              </h4>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                  {analysisResult.currentStatus}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                🔍 발생 원인
              </h4>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                  {analysisResult.rootCause}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                🛠️ 개선 솔루션
              </h4>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                  {analysisResult.improvementSolution}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                ✅ 권장사항
              </h4>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <ul className="text-sm text-gray-900 dark:text-gray-100 space-y-2">
                  {analysisResult.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 원본 데이터 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">
              📄 기준값 데이터 ({referenceText.length}자)
            </h4>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 max-h-32 overflow-y-auto">
              <pre className="text-xs text-green-800 dark:text-green-200 whitespace-pre-wrap">
                {referenceText}
              </pre>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2">
              📄 측정값 데이터 ({measurementText.length}자)
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 max-h-32 overflow-y-auto">
              <pre className="text-xs text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                {measurementText}
              </pre>
            </div>
          </div>
        </div>

        {/* Webhook 응답 결과 */}
        {webhookResponse && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
              🔗 Make.com 처리 결과
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <pre className="text-xs text-blue-800 dark:text-blue-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {JSON.stringify(webhookResponse, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsCard;
