
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileImage, MessageCircle, Zap, GitCompare } from 'lucide-react';
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
      title: 'AI 다중 설비 분석',
      description: '기준값과 측정값 자동 비교 및 진단',
      icon: GitCompare,
      color: 'purple',
      path: '/ai/dual-image-ocr'
    },
    {
      title: 'AI ChatBot',
      description: '24시간 설비 관련 질문 답변 및 규정 준수 도우미',
      icon: MessageCircle,
      path: '/ai/chatbot',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-800/30',
      green: 'bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-800/30',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:hover:bg-purple-800/30',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:hover:bg-orange-800/30',
      gray: 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-900/20 dark:border-gray-800 dark:hover:bg-gray-800/30',
      indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:hover:bg-indigo-800/30'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      orange: 'text-orange-600 dark:text-orange-400',
      gray: 'text-gray-600 dark:text-gray-400',
      indigo: 'text-indigo-600 dark:text-indigo-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-600" />
                AI 스마트 기능
              </h1>
              <p className="text-sm text-slate-600 dark:text-gray-300">인공지능 기반 스마트 관리</p>
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
                <CardTitle className="text-lg flex items-center gap-3 text-gray-900 dark:text-white">
                  <Icon className={`h-6 w-6 ${getIconColor(feature.color)}`} />
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-center text-orange-800 dark:text-orange-200">
              🎯 AI 기능 활용 팁
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-2">
              <li>• 정확한 결과를 위해 구체적인 정보를 입력하세요</li>
              <li>• OCR 판독 시 고화질 이미지를 업로드하세요</li>
              <li>• 설비 분석은 명확한 기준값과 측정값을 제공하세요</li>
              <li>• ChatBot 활용 시 구체적인 상황을 명시해주세요</li>
            </ul>
          </CardContent>
        </Card>

        {/* 저장 데이터 정보 표시 */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg text-center text-blue-800 dark:text-blue-200">
              💾 데이터 저장 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p><strong>저장 위치:</strong> 브라우저 로컬 스토리지</p>
              <p><strong>설비 데이터 키:</strong> equipment-data</p>
              <p><strong>포함 내용:</strong> 설비명칭, 설치위치, 분석이력</p>
              <p><strong>데이터 유지:</strong> 브라우저 캐시 삭제 전까지 영구 보관</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIFeatures;
