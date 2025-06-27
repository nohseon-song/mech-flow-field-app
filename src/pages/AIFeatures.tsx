import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileImage, BookOpen, MessageCircle, Settings, Zap, Compare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIFeatures = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'nameplate-ocr',
      title: 'AI OCR 판독',
      description: '설비 명판 및 문서 텍스트 자동 추출',
      icon: FileImage,
      color: 'indigo',
      path: '/ai/nameplate-ocr'
    },
    {
      id: 'dual-image-ocr',
      title: '다중 장비 비교 분석',
      description: '설계 기준과 실측값 자동 비교 및 진단',
      icon: Compare,
      color: 'purple',
      path: '/ai/dual-image-ocr'
    },
    {
      title: 'AI 규정 준수 도우미',
      description: '기계설비법 전문 상담 및 규정 해석',
      icon: BookOpen,
      path: '/ai/regulation-helper',
      color: 'purple'
    },
    {
      title: 'AI 챗봇',
      description: '24시간 설비 관련 질문 답변',
      icon: MessageCircle,
      path: '/ai/chatbot',
      color: 'orange'
    },
    {
      title: 'AI 지침 설정',
      description: 'AI 응답 지침 및 지식 파일 관리',
      icon: Settings,
      path: '/ai/guidelines',
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      gray: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      gray: 'text-gray-600',
      indigo: 'text-indigo-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

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
                <Zap className="h-6 w-6 text-yellow-600" />
                AI 스마트 기능
              </h1>
              <p className="text-sm text-slate-600">인공지능 기반 스마트 관리</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.path}
              className={`${getColorClasses(feature.color)} border cursor-pointer transition-all duration-200 hover:shadow-md`}
              onClick={() => navigate(feature.path)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${getIconColor(feature.color)}`} />
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-center text-orange-800">
              🎯 AI 기능 활용 팁
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-orange-700 space-y-2">
              <li>• 정확한 결과를 위해 구체적인 정보를 입력하세요</li>
              <li>• 지침 설정에서 조직 맞춤형 가이드라인을 설정할 수 있습니다</li>
              <li>• OCR 판독 시 고화질 이미지를 업로드하세요</li>
              <li>• 규정 관련 질문은 구체적인 상황을 명시해주세요</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIFeatures;
