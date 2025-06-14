
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText, Sparkles, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useGuidelines } from '@/hooks/useGuidelines';

const MemoConverter = () => {
  const navigate = useNavigate();
  const { getGuideline } = useGuidelines();
  const [memo, setMemo] = useState('');
  const [guideline, setGuideline] = useState('operation');
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
    
    // Google Gemini API 호출 시뮬레이션 (실제로는 저장된 지침 사용)
    setTimeout(() => {
      const userGuideline = getGuideline(guideline as 'operation' | 'knowledge');
      const baseData = {
        equipment: memo.includes('보일러') ? '보일러 #1' : '설비명 미기재',
        date: new Date().toLocaleDateString('ko-KR'),
        inspector: '홍길동',
        status: memo.includes('정상') || memo.includes('양호') ? '정상' : '확인 필요',
        operation: memo.includes('이상') ? '이상 감지' : '정상',
        notes: memo
      };

      // 사용자 지침이 있으면 그에 따라, 없으면 기본 로직 사용
      const mockConvertedData = userGuideline ? 
        `## 점검 보고서 (${guideline === 'operation' ? '운용지침' : '지식지침'} 기반)

**설비명**: ${baseData.equipment}
**점검일시**: ${baseData.date}
**점검자**: ${baseData.inspector}

### 적용된 지침
${userGuideline.substring(0, 200)}...

### 현장 메모
${baseData.notes}

### 지침 기반 분석 결과
- 설비 상태: ${baseData.status}
- 작동 상태: ${baseData.operation}
- 지침 준수 여부: 확인 완료

### 다음 조치사항
- 사용자 지침에 따른 맞춤형 조치 권장
- 정기 점검 스케줄 확인
- 지침 업데이트 필요시 설정에서 수정 가능
        ` : 
        guideline === 'operation' ? 
        `## 점검 보고서 (기본 운용지침)

**설비명**: ${baseData.equipment}
**점검일시**: ${baseData.date}
**점검자**: ${baseData.inspector}

### 점검 항목
- 외관 상태: ${baseData.status}
- 작동 상태: ${baseData.operation}
- 안전 상태: 점검 완료

### 현장 메모
${baseData.notes}

### 실무 조치사항
- 일일 점검: 외관 및 소음 확인
- 주간 점검: 진동 및 온도 측정
- 월간 점검: 윤활유 교체 및 필터 청소
- 다음 점검 예정일: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}

### 예상 문제점 및 대응방안
- 설비 노후화 징후 모니터링 강화
- 예비부품 재고 확인 필요

⚠️ 맞춤형 지침을 설정하려면 AI 기능 → 지침설정에서 운용지침을 등록하세요.
        ` : 
        `## 점검 보고서 (기본 지식지침)

**설비명**: ${baseData.equipment}
**점검일시**: ${baseData.date}
**점검자**: ${baseData.inspector}

### 법규 준수 점검 항목
- 기계설비법 제15조: 성능점검 실시 ✓
- 산업안전보건법 제36조: 정기점검 이행 ✓
- 건축물 에너지절약법: 효율 기준 적합성 확인 ✓

### 현장 메모
${baseData.notes}

### 표준 매뉴얼 기준 조치사항
- KS B 0251 기준: 배관 접합부 점검
- KS C 4304 기준: 전기설비 절연상태 확인
- 안전관리 규정: 개인보호구 착용 확인

### 법정 기록 보관
- 점검 결과 3년간 보관 의무 (기계설비법 시행규칙 제22조)
- 차기 점검일: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')} (연 1회)

⚠️ 맞춤형 지침을 설정하려면 AI 기능 → 지침설정에서 지식지침을 등록하세요.
        `;
      
      setConvertedData(mockConvertedData.trim());
      setIsLoading(false);
      
      toast({
        title: "변환 완료",
        description: `현장 메모가 ${guideline === 'operation' ? '운용지침' : '지식지침'} 기반 보고서로 변환되었습니다.`
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
        {/* Guideline Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              변환 지침 선택
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
        )}
      </div>
    </div>
  );
};

export default MemoConverter;
