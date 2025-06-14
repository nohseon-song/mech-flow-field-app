
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, Sparkles, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const MemoConverter = () => {
  const navigate = useNavigate();
  const [memo, setMemo] = useState('');
  const [convertedData, setConvertedData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async () => {
    if (!memo.trim()) {
      toast({
        title: "메모를 입력해주세요",
        description: "변환할 현장 메모를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Google Gemini API 호출 시뮬레이션
    setTimeout(() => {
      const mockConvertedData = `
## 점검 보고서

**설비명**: ${memo.includes('보일러') ? '보일러 #1' : '설비명 미기재'}
**점검일시**: ${new Date().toLocaleDateString('ko-KR')}
**점검자**: 홍길동

### 점검 항목
- 외관 상태: ${memo.includes('정상') || memo.includes('양호') ? '정상' : '확인 필요'}
- 작동 상태: ${memo.includes('이상') ? '이상 감지' : '정상'}
- 안전 상태: 점검 완료

### 특이사항
${memo}

### 조치사항
- 정기 점검 완료
- 다음 점검 예정일: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
      `;
      
      setConvertedData(mockConvertedData.trim());
      setIsLoading(false);
      
      toast({
        title: "변환 완료",
        description: "현장 메모가 구조화된 보고서로 변환되었습니다."
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedData);
    toast({
      title: "복사 완료",
      description: "변환된 데이터가 클립보드에 복사되었습니다."
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
                <FileText className="h-6 w-6 text-blue-600" />
                AI 현장 메모 변환기
              </h1>
              <p className="text-sm text-slate-600">메모를 구조화된 보고서로 변환</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              현장 메모 입력
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                현장에서 작성한 메모를 입력하세요
              </label>
              <Textarea
                placeholder="예: 보일러2호 85% 가동 미달, 펌프 p-1 진동 심함, 배관 누수 의심"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button 
              onClick={handleConvert}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  AI 변환 중...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  변환하기
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        {convertedData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  변환된 보고서
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
        )}
      </div>
    </div>
  );
};

export default MemoConverter;
