
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const RegulationHelper = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [guideline, setGuideline] = useState('operation');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "질문을 입력해주세요",
        description: "기계설비 법규에 대한 질문을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Google Gemini API 호출 시뮬레이션
    setTimeout(() => {
      const mockAnswer = guideline === 'operation' ? 
        `**실무 중심 답변**

질문하신 "${question}"에 대해 실무적 관점에서 답변드리겠습니다.

**현장 적용 가이드**:
- 기계설비의 성능점검은 연 1회 이상 실시해야 합니다.
- 점검 시 체크리스트를 활용하여 누락 방지
- 점검 결과는 디지털 기록으로 3년간 보관

**실무 절차**:
1. 사전 점검 계획 수립 (설비별 맞춤 체크리스트)
2. 안전장비 착용 후 현장 점검 실시
3. 실시간 데이터 입력 및 사진 촬영
4. 이상 발견 시 즉시 조치 및 보고

**현장 팁**:
- 점검 앱을 활용하여 효율성 향상
- 예비부품 재고 확인 동시 진행
- 계절별 특이사항 사전 체크

**문의처**: 
- 현장 문제 발생 시: 설비관리팀 (내선 1234)
- 긴급상황: 24시간 핫라인 (1588-0000)
        ` :
        `**법규/표준 기준 답변**

질문하신 "${question}"에 대해 법규 및 표준에 근거하여 답변드리겠습니다.

**관련 법규**: 기계설비법 제15조, 기계설비법 시행규칙 제22조

**주요 내용**:
- 기계설비의 성능점검은 연 1회 이상 실시해야 합니다.
- 점검 결과는 3년간 보관해야 합니다.
- 점검 시 안전기준을 준수해야 합니다.

**법정 의무사항**:
1. 성능점검 실시 의무 (기계설비법 제15조)
2. 점검기록 작성 및 보관 (시행규칙 제22조)
3. 안전관리자 배치 (건축물관리법)
4. 정기 교육 이수 (산업안전보건법)

**표준 준수사항**:
- KS B 0251: 배관 설치 및 점검 기준
- KS C 4304: 전기설비 안전 기준
- 건축기계설비 표준시방서 적용

**참고 매뉴얼**: 
- 기계설비 안전관리 가이드라인 (국토교통부)
- 건축물 에너지관리 매뉴얼 (에너지공단)
- 산업안전보건법 관련 규정 (고용노동부)

**법적 책임**: 점검 미이행 시 과태료 부과 (기계설비법 제28조)

더 자세한 사항은 관련 법령을 직접 확인하시기 바랍니다.
        `;
      
      setAnswer(mockAnswer.trim());
      setIsLoading(false);
      
      toast({
        title: "답변 완료",
        description: `${guideline === 'operation' ? '실무 중심' : '법규/표준 기반'} AI 전문가가 답변을 완료했습니다.`
      });
    }, 2500);
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
                <BookOpen className="h-6 w-6 text-purple-600" />
                AI 규정 준수 도우미
              </h1>
              <p className="text-sm text-slate-600">기계설비법 전문 상담</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Guideline Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              답변 지침 선택
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

        {/* Question Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              법규 질문하기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                기계설비 법규에 대해 궁금한 점을 질문해주세요
              </label>
              <Textarea
                placeholder="예: 연평균 15,000제곱미터 복합건물의 기계설비 성능점검 주기는 어떻게 되나요?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button 
              onClick={handleAskQuestion}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  AI 답변 생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  질문하기
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Answer Section */}
        {answer && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                AI 전문가 답변
                {guideline === 'operation' ? 
                  <span className="text-sm text-blue-600">(운용지침)</span> : 
                  <span className="text-sm text-purple-600">(지식지침)</span>
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <pre className="whitespace-pre-wrap text-sm text-slate-700">
                  {answer}
                </pre>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700">
                  ⚠️ 본 답변은 AI가 생성한 참고용 정보입니다. 정확한 법적 해석은 관련 전문가나 관할 기관에 문의하시기 바랍니다.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RegulationHelper;
