import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Settings, Save, FileUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useKnowledgeFiles } from '@/hooks/useKnowledgeFiles';
import { toast } from '@/hooks/use-toast';
import { KnowledgeFileUpload } from '@/components/guidelines/KnowledgeFileUpload';

const GuidelineSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { uploadedFiles, saveFiles } = useKnowledgeFiles();
  
  const [operationGuideline, setOperationGuideline] = useState('');
  const [knowledgeGuideline, setKnowledgeGuideline] = useState('');

  useEffect(() => {
    if (user) {
      // 사용자별 지침 로드
      const userGuidelinesKey = `ai-guidelines-${user.id}`;
      const savedGuidelines = localStorage.getItem(userGuidelinesKey);
      
      if (savedGuidelines) {
        const guidelines = JSON.parse(savedGuidelines);
        setOperationGuideline(guidelines.operation || '');
        setKnowledgeGuideline(guidelines.knowledge || '');
      } else {
        // 사용자별 지침이 없으면 전역 지침 확인 (호환성)
        const globalGuidelines = localStorage.getItem('ai-guidelines');
        if (globalGuidelines) {
          const guidelines = JSON.parse(globalGuidelines);
          setOperationGuideline(guidelines.operation || '');
          setKnowledgeGuideline(guidelines.knowledge || '');
        }
      }
    }
  }, [user]);

  const saveGuidelines = () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "지침을 저장하려면 로그인이 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    const guidelines = {
      operation: operationGuideline,
      knowledge: knowledgeGuideline
    };

    // 사용자별 지침 저장
    const userGuidelinesKey = `ai-guidelines-${user.id}`;
    localStorage.setItem(userGuidelinesKey, JSON.stringify(guidelines));

    toast({
      title: "저장 완료",
      description: "AI 지침이 성공적으로 저장되었습니다."
    });
  };

  const handleFilesChange = (files: any) => {
    saveFiles(files);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">로그인 필요</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              AI 지침 설정을 위해서는 로그인이 필요합니다.
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
                <Settings className="h-6 w-6 text-gray-600" />
                AI 지침 설정
              </h1>
              <p className="text-sm text-slate-600">AI 응답 가이드라인 관리</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 운용지침 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">운용지침 (실무 중심)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                현장 실무 중심의 AI 응답 지침을 설정하세요
              </label>
              <Textarea
                placeholder="예: 현장 안전을 최우선으로 하고, 실무 경험을 바탕으로 구체적이고 실행 가능한 조치 방안을 제시해주세요."
                value={operationGuideline}
                onChange={(e) => setOperationGuideline(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* 지식지침 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">지식지침 (법규/표준 중심)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                법규 및 표준 중심의 AI 응답 지침을 설정하세요
              </label>
              <Textarea
                placeholder="예: 기계설비법, 산업안전보건법 등 관련 법규를 정확히 인용하고, KS 표준 및 기술기준을 근거로 답변해주세요."
                value={knowledgeGuideline}
                onChange={(e) => setKnowledgeGuideline(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* 지식 파일 업로드 */}
        <KnowledgeFileUpload 
          onFilesChange={handleFilesChange}
          uploadedFiles={uploadedFiles}
        />

        {/* 저장 버튼 */}
        <Button onClick={saveGuidelines} className="w-full bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          지침 저장
        </Button>

        {/* 도움말 */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800">💡 설정 도움말</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 운용지침: 현장 작업자를 위한 실무 중심 응답</li>
              <li>• 지식지침: 법규 준수 및 기술 표준 중심 응답</li>
              <li>• 지식 파일: 조직 고유의 매뉴얼이나 규정 업로드</li>
              <li>• 설정한 지침은 사용자별로 개별 저장됩니다</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuidelineSettings;
