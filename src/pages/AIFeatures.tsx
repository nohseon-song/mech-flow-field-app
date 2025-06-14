
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, FileText, Camera, BookOpen, MessageCircle, ArrowLeft, ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIFeatures = () => {
  const navigate = useNavigate();

  const aiFeatures = [
    {
      id: 1,
      title: "AI 현장 메모 변환기",
      description: "현장에서 급하게 작성한 메모를 입력하면, AI가 보고서에 바로 사용할 수 있는 구조화된 데이터로 자동 변환해 줍니다.",
      icon: FileText,
      color: "bg-blue-500",
      route: "/ai/memo-converter"
    },
    {
      id: 2,
      title: "AI 명판 OCR",
      description: "설비 명판 사진을 업로드하면 AI가 텍스트를 인식해 자동으로 필드를 채워줍니다.",
      icon: Camera,
      color: "bg-green-500",
      route: "/ai/nameplate-ocr"
    },
    {
      id: 3,
      title: "AI 사진 분석",
      description: "설비 사진을 업로드하면 AI가 원인, 징후, 개선방안을 자동으로 분석해 줍니다.",
      icon: ImageIcon,
      color: "bg-orange-500",
      route: "/ai/photo-analysis"
    },
    {
      id: 4,
      title: "AI 규정 준수 도우미",
      description: "복잡한 기계설비 법규가 궁금하신가요? 질문을 입력하면 AI가 「기계설비법」과 표준 매뉴얼에 근거하여 전문가처럼 답변해 드립니다.",
      icon: BookOpen,
      color: "bg-purple-500",
      route: "/ai/regulation-helper"
    },
    {
      id: 5,
      title: "AI 챗봇 (CheckMate 전문가)",
      description: "플랫폼 사용법, 기계설비 법규, 점검 노하우 등 무엇이든 물어보세요! AI 전문가가 24시간 답변해 드립니다.",
      icon: MessageCircle,
      color: "bg-teal-500",
      route: "/ai/chatbot"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                AI 기능
              </h1>
              <p className="text-sm text-slate-600">AI 기반 스마트 점검 도구</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* AI Features Grid */}
        {aiFeatures.map((feature) => (
          <Card key={feature.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(feature.route)}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${feature.color} bg-opacity-10`}>
                    <feature.icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-slate-800">{feature.title}</span>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">{feature.description}</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                시작하기
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Google Gemini AI 기반</h3>
            </div>
            <p className="text-sm text-blue-700">
              최신 AI 기술을 활용하여 현장 작업의 효율성을 극대화합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIFeatures;
