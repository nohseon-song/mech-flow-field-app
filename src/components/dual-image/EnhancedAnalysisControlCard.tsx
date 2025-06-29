
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCompare, Send, Copy, AlertCircle, RotateCcw } from 'lucide-react';
import { AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { type ParsedEquipmentData } from '@/utils/textDataParser';

interface EnhancedAnalysisControlCardProps {
  onPerformComparison: () => void;
  isAnalyzing: boolean;
  referenceData: ParsedEquipmentData | null;
  measurementData: ParsedEquipmentData | null;
  analysisResult: AdvancedAnalysisResult | null;
  onSendToWebhook: () => void;
  isSending: boolean;
  onCopyResult: () => void;
  onRetryLastSend: () => void;
  canAnalyze?: boolean;
  lastSentData?: any;
}

const EnhancedAnalysisControlCard = ({
  onPerformComparison,
  isAnalyzing,
  referenceData,
  measurementData,
  analysisResult,
  onSendToWebhook,
  isSending,
  onCopyResult,
  onRetryLastSend,
  canAnalyze = false,
  lastSentData
}: EnhancedAnalysisControlCardProps) => {
  const hasReferenceData = referenceData !== null;
  const hasMeasurementData = measurementData !== null;
  
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <GitCompare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          고도화 AI 비교 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 분석 준비 상태 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${hasReferenceData ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <span className={`text-sm ${hasReferenceData ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              기준값 Key:Value: {hasReferenceData ? `${Object.keys(referenceData!.extractedData).length}개 추출됨` : '대기중'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${hasMeasurementData ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <span className={`text-sm ${hasMeasurementData ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              측정값 Key:Value: {hasMeasurementData ? `${Object.keys(measurementData!.extractedData).length}개 추출됨` : '대기중'}
            </span>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={onPerformComparison}
            disabled={!canAnalyze}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium px-6 py-2 min-w-[140px]"
          >
            {isAnalyzing ? (
              <>
                <GitCompare className="h-4 w-4 mr-2 animate-spin" />
                AI 분석 중...
              </>
            ) : (
              <>
                <GitCompare className="h-4 w-4 mr-2" />
                고도화 분석하기
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
                    Make.com 전송
                  </>
                )}
              </Button>

              <Button 
                variant="outline"
                onClick={onCopyResult}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium px-6 py-2"
              >
                <Copy className="h-4 w-4 mr-2" />
                결과 복사
              </Button>

              {lastSentData && (
                <Button 
                  variant="outline"
                  onClick={onRetryLastSend}
                  disabled={isSending}
                  className="border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-medium px-6 py-2"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  재전송
                </Button>
              )}
            </>
          )}
        </div>

        {/* 분석 버튼이 비활성화된 경우 안내 메시지 */}
        {!canAnalyze && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-700 dark:text-yellow-300">
              {!hasReferenceData && !hasMeasurementData 
                ? '두 이미지의 고도화 텍스트 추출을 먼저 완료해주세요.'
                : !hasReferenceData 
                ? '기준값 이미지의 텍스트 추출을 완료해주세요.'
                : !hasMeasurementData
                ? '측정값 이미지의 텍스트 추출을 완료해주세요.'
                : '설비명칭을 입력해주세요.'
              }
            </span>
          </div>
        )}

        {/* 데이터 검증 상태 */}
        {(hasReferenceData || hasMeasurementData) && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
              📊 데이터 추출 상태
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              {hasReferenceData && (
                <div>기준값: {Object.entries(referenceData!.extractedData).map(([k, v]) => `${k}=${v}`).join(', ')}</div>
              )}
              {hasMeasurementData && (
                <div>측정값: {Object.entries(measurementData!.extractedData).map(([k, v]) => `${k}=${v}`).join(', ')}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAnalysisControlCard;
