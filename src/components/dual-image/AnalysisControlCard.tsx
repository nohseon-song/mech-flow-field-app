
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCompare, Send, Copy, AlertCircle } from 'lucide-react';
import { AdvancedAnalysisResult } from '@/utils/advancedAnalysis';

interface AnalysisControlCardProps {
  onPerformComparison: () => void;
  isAnalyzing: boolean;
  referenceText: string;
  measurementText: string;
  analysisResult: AdvancedAnalysisResult | null;
  onSendToWebhook: () => void;
  isSending: boolean;
  onCopyResult: () => void;
  canAnalyze?: boolean;
}

const AnalysisControlCard = ({
  onPerformComparison,
  isAnalyzing,
  referenceText,
  measurementText,
  analysisResult,
  onSendToWebhook,
  isSending,
  onCopyResult,
  canAnalyze = false
}: AnalysisControlCardProps) => {
  const hasReferenceText = referenceText.trim().length > 0;
  const hasMeasurementText = measurementText.trim().length > 0;
  
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <GitCompare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          비교 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 분석 준비 상태 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${hasReferenceText ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <span className={`text-sm ${hasReferenceText ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              기준값 텍스트: {hasReferenceText ? '준비됨' : '대기중'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${hasMeasurementText ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <span className={`text-sm ${hasMeasurementText ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              측정값 텍스트: {hasMeasurementText ? '준비됨' : '대기중'}
            </span>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={onPerformComparison}
            disabled={!canAnalyze}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium px-6 py-2 min-w-[120px]"
          >
            {isAnalyzing ? (
              <>
                <GitCompare className="h-4 w-4 mr-2 animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <GitCompare className="h-4 w-4 mr-2" />
                분석하기
              </>
            )}
          </Button>

          {analysisResult && (
            <>
              <Button 
                onClick={onSendToWebhook}
                disabled={isSending}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium px-6 py-2 min-w-[120px]"
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
                onClick={onCopyResult}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium px-6 py-2"
              >
                <Copy className="h-4 w-4 mr-2" />
                복사
              </Button>
            </>
          )}
        </div>

        {/* 분석 버튼이 비활성화된 경우 안내 메시지 */}
        {!canAnalyze && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-700 dark:text-yellow-300">
              {!hasReferenceText && !hasMeasurementText 
                ? '두 이미지의 텍스트 추출을 먼저 완료해주세요.'
                : !hasReferenceText 
                ? '기준값 이미지의 텍스트 추출을 완료해주세요.'
                : !hasMeasurementText
                ? '측정값 이미지의 텍스트 추출을 완료해주세요.'
                : '설비명칭을 입력해주세요.'
              }
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisControlCard;
