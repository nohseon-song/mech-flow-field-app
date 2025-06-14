
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ConvertedReportProps {
  convertedData: string;
  guideline: string;
}

export const ConvertedReport = ({ convertedData, guideline }: ConvertedReportProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedData);
    toast({
      title: "복사 완료",
      description: "변환된 데이터가 클립보드에 복사되었습니다."
    });
  };

  if (!convertedData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            변환된 보고서
            {guideline === 'operation' ? 
              <span className="text-sm text-blue-600">(운용지침)</span> : 
              <span className="text-sm text-purple-600">(지식지침)</span>
            }
          </div>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-1" />
            복사
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
            {convertedData}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};
