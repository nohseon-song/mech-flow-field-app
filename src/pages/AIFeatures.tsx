
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Bot, GitCompare, FileImage } from 'lucide-react';

const AIFeatures = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">AI 스마트 기능</h1>
            <p className="text-slate-600 dark:text-gray-300">현장용 AI 기능을 활용해보세요</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AI ChatBot - 통합된 단일 카드 */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            onClick={() => navigate('/ai/chatbot')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Bot className="h-5 w-5" />
                AI ChatBot
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                통합 AI 어시스턴트 - 규정 준수, 챗봇, 지침 설정을 하나로
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                • AI 규정 및 지침 자동 검토<br/>
                • 실시간 질의응답 채팅<br/>
                • 맞춤형 가이드라인 설정<br/>
                • 현장 업무 지원
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                시작하기
              </Button>
            </CardContent>
          </Card>

          {/* AI 다중 설비 분석 */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            onClick={() => navigate('/ai/dual-image-ocr')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <GitCompare className="h-5 w-5" />
                AI 다중 설비 분석
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                기준값과 측정값 자동 비교 및 진단
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                • 이미지 OCR 텍스트 추출<br/>
                • AI 기반 설비 상태 분석<br/>
                • 전문적 진단 및 권장사항<br/>
                • Make.com 자동 연동
              </p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                분석 시작
              </Button>
            </CardContent>
          </Card>

          {/* 네임플레이트 OCR */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            onClick={() => navigate('/ai/nameplate-ocr')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <FileImage className="h-5 w-5" />
                네임플레이트 OCR
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                설비 명판 정보 자동 인식
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                • 설비 명판 자동 스캔<br/>
                • 텍스트 데이터 추출<br/>
                • 구조화된 정보 변환<br/>
                • 데이터베이스 자동 입력
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                스캔 시작
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 로컬 스토리지 정보 표시 */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300 text-lg">📊 데이터 저장 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">로컬 스토리지 키값</h4>
                <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                  <li>• <code>equipment-data</code> - 설비 정보 및 분석 이력</li>
                  <li>• <code>theme</code> - 다크/라이트 모드 설정</li>
                  <li>• <code>ai-analysis-history</code> - AI 분석 결과 이력</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">저장되는 데이터</h4>
                <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                  <li>• 설비명칭, 설치위치</li>
                  <li>• OCR 추출 텍스트</li>
                  <li>• AI 분석 결과</li>
                  <li>• 사용자 입력 코멘트</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIFeatures;
