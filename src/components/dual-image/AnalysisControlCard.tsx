
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCompare, Send, Copy } from 'lucide-react';
import { DualImageAnalysis } from '@/utils/dualImageAnalysis';

interface AnalysisControlCardProps {
  onPerformComparison: () => void;
  isAnalyzing: boolean;
  referenceText: string;
  measurementText: string;
  analysisResult: DualImageAnalysis | null;
  onSendToWebhook: () => void;
  isSending: boolean;
  onCopyResult: () => void;
}

const AnalysisControlCard = ({
  onPerformComparison,
  isAnalyzing,
  referenceText,
  measurementText,
  analysisResult,
  onSendToWebhook,
  isSending,
  onCopyResult
}: AnalysisControlCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-purple-600" />
          비교 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button 
            onClick={onPerformComparison}
            disabled={isAnalyzing || !referenceText || !measurementText}
            className="bg-purple-600 hover:bg-purple-700"
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
                onClick={onCopyResult}
              >
                <Copy className="h-4 w-4 mr-2" />
                복사
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisControlCard;
