
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Settings, Save, FileText, BookOpen, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { KnowledgeFileUpload } from '@/components/guidelines/KnowledgeFileUpload';
import { useKnowledgeFiles } from '@/hooks/useKnowledgeFiles';
import { useAuth } from '@/hooks/useAuth';

interface Guidelines {
  operation: string;
  knowledge: string;
}

const GuidelineSettings = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { uploadedFiles, saveFiles, getEnhancedKnowledgeGuideline } = useKnowledgeFiles();
  const [guidelines, setGuidelines] = useState<Guidelines>({
    operation: '',
    knowledge: ''
  });
  const [activeTab, setActiveTab] = useState<'operation' | 'knowledge'>('operation');

  // 로그인하지 않은 사용자는 리다이렉트
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "접근 권한 없음",
        description: "지침 설정은 로그인한 사용자만 이용할 수 있습니다.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      // 사용자별 지침 불러오기
      const userGuidelinesKey = `ai-guidelines-${user.id}`;
      const savedGuidelines = localStorage.getItem(userGuidelinesKey);
      if (savedGuidelines) {
        setGuidelines(JSON.parse(savedGuidelines));
      } else {
        // 기본 지침 설정
        setGuidelines({
          operation: `현장 실무 중심 운용지침:

1. 실무 우선 접근
- 현장에서 바로 적용 가능한 실용적 해답 제공
- 구체적인 작업 절차와 단계별 가이드 포함
- 실제 경험과 노하우 기반 조언

2. 효율성 중시
- 작업 시간 단축을 위한 팁과 방법 제시
- 도구 활용법과 스마트한 작업 방식 안내
- 팀워크와 협업 방안 포함

3. 안전 실무
- 현장 안전 수칙과 주의사항 강조
- 실제 위험 상황과 대처 방법
- 개인보호구 활용법과 응급상황 대응

4. 문제 해결
- 자주 발생하는 문제와 즉시 해결 방법
- 임시 조치와 근본적 해결책 구분
- 예방 점검과 사전 대비 방안`,
          knowledge: `법규 및 표준 기준 지식지침:

1. 법규 준수 우선
- 기계설비법, 산업안전보건법 등 관련 법령 준수
- 법정 의무사항과 규정 준수 여부 확인
- 위반시 처벌 규정과 법적 책임 명시

2. 표준 기준 적용
- KS 표준, ISO 규격 등 국제 표준 준수
- 제조사 매뉴얼과 기술 기준 참조
- 인증 요구사항과 검사 기준 적용

3. 문서화 및 기록
- 법정 기록 보관 의무와 기간 준수
- 표준 양식과 서식 활용
- 디지털 기록과 전자 서명 유효성

4. 전문성과 자격
- 관련 자격증과 교육 이수 요구사항
- 전문가 자문과 공식 매뉴얼 참조
- 기술 표준과 업계 모범 사례 적용`
        });
      }
    }
  }, [user]);

  const saveGuidelines = () => {
    if (!user) {
      toast({
        title: "저장 실패",
        description: "로그인이 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    // 사용자별 지침 저장
    const userGuidelinesKey = `ai-guidelines-${user.id}`;
    const finalGuidelines = {
      ...guidelines,
      knowledge: activeTab === 'knowledge' && uploadedFiles.length > 0 
        ? getEnhancedKnowledgeGuideline(guidelines.knowledge)
        : guidelines.knowledge
    };
    
    localStorage.setItem(userGuidelinesKey, JSON.stringify(finalGuidelines));
    
    // 호환성을 위해 기존 키에도 저장 (현재 사용자의 지침을 전역으로)
    localStorage.setItem('ai-guidelines', JSON.stringify(finalGuidelines));
    
    toast({
      title: "지침 저장 완료",
      description: `${activeTab === 'operation' ? '운용지침' : '지식지침'}이 성공적으로 저장되었습니다.`
    });
  };

  const handleGuidelineChange = (value: string) => {
    if (!user) {
      toast({
        title: "편집 권한 없음",
        description: "로그인한 사용자만 지침을 편집할 수 있습니다.",
        variant: "destructive"
      });
      return;
    }
    
    setGuidelines(prev => ({
      ...prev,
      [activeTab]: value
    }));
  };

  // 로딩 중이거나 로그인하지 않은 사용자에게 표시할 화면
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-xl text-red-600">접근 권한이 필요합니다</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              지침 설정은 로그인한 사용자만 이용할 수 있습니다.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              로그인하러 가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <Settings className="h-6 w-6 text-blue-600" />
                AI 지침 설정
              </h1>
              <p className="text-sm text-slate-600">
                {user.email}님의 맞춤 지침 설정
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Tab Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'operation' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('operation')}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                운용지침
              </Button>
              <Button
                variant={activeTab === 'knowledge' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('knowledge')}
                className="flex-1"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                지식지침
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge File Upload (only for knowledge tab) */}
        {activeTab === 'knowledge' && (
          <KnowledgeFileUpload 
            uploadedFiles={uploadedFiles}
            onFilesChange={saveFiles}
          />
        )}

        {/* Guideline Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {activeTab === 'operation' ? 
                <FileText className="h-5 w-5 text-blue-600" /> : 
                <BookOpen className="h-5 w-5 text-purple-600" />
              }
              {activeTab === 'operation' ? '운용지침 편집' : '지식지침 편집'}
              <Lock className="h-4 w-4 text-green-600" title="로그인 사용자만 편집 가능" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {activeTab === 'operation' ? 
                  'AI가 실무 중심으로 답변하도록 하는 운용지침을 작성하세요' : 
                  'AI가 법규/표준 기준으로 답변하도록 하는 지식지침을 작성하세요'
                }
              </label>
              <Textarea
                value={guidelines[activeTab]}
                onChange={(e) => handleGuidelineChange(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder={activeTab === 'operation' ? 
                  '현장 실무 중심의 운용지침을 입력하세요...' : 
                  '법규 및 표준 기준의 지식지침을 입력하세요...'
                }
              />
            </div>
            <Button 
              onClick={saveGuidelines}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              지침 저장
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">개인화된 지침 활용</h3>
            </div>
            <p className="text-sm text-blue-700">
              설정한 지침은 {user.email}님 전용으로 저장되어 AI 현장 메모 변환기, AI 규정 준수 도우미, AI 챗봇에서 자동으로 적용됩니다.
              {activeTab === 'knowledge' && ' 업로드된 파일 내용도 함께 학습되어 더욱 정확한 답변이 가능합니다.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuidelineSettings;
