
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const RegulationHelper = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
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
      const mockAnswer = `
**기계설비법 관련 답변**

질문하신 "${question}"에 대해 답변드리겠습니다.

**관련 법규**: 기계설비법 제15조, 기계설비법 시행규칙 제22조

**주요 내용**:
- 기계설비의 성능점검은 연 1회 이상 실시해야 합니다.
- 점검 결과는 3년간 보관해야 합니다.
- 점검 시 안전기준을 준수해야 합니다.

**실무 적용**:
1. 점검 계획 수립
2. 전문가에 의한 점검 실시
3. 결과 기록 및 보관
4. 필요시 개선 조치

**참고 매뉴얼**: 
- 기계설비 안전관리 가이드라인
- 산업안전보건법 관련 규정

더 자세한 사항은 관련 법령을 직접 확인하시기 바랍니다.
      `;
      
      setAnswer(mockAnswer.trim());
      setIsLoading(false);
      
      toast({
        title: "답변 완료",
        description: "AI 전문가가 답변을 완료했습니다."
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
                  법규 질문하기
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  법규 질문하기
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
