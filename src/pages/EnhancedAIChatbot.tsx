
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Bot, Send, RotateCcw, Download, Settings } from 'lucide-react';
import { useGeminiChatbot } from '@/hooks/useGeminiChatbot';

const EnhancedAIChatbot = () => {
  const navigate = useNavigate();
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearChat,
    exportChat
  } = useGeminiChatbot();

  const handleSendMessage = async () => {
    await sendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/ai')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Bot className="h-8 w-8 text-purple-600" />
              Gemini 1.5 AI ChatBot (고도화)
            </h1>
            <p className="text-slate-600 dark:text-gray-300">
              실시간 Google Gemini AI 기반 기계설비 전문 어시스턴트
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/guideline-settings')}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              지침 설정
            </Button>
            <Button
              onClick={exportChat}
              variant="outline"
              size="sm"
              disabled={messages.length <= 1}
            >
              <Download className="h-4 w-4 mr-2" />
              대화 내보내기
            </Button>
            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              disabled={messages.length <= 1}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              🤖 Gemini 1.5 Flash 연결됨 - 실시간 AI 응답 활성화
            </span>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            운용지침 및 지식지침이 자동 적용되어 맞춤형 전문 답변을 제공합니다
          </p>
        </div>

        <Card className="h-[600px] flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center justify-between">
              <span>실시간 AI 대화</span>
              <span className="text-sm font-normal text-gray-500">
                총 {messages.length}개 메시지
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-700">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-4 rounded-br-sm'
                        : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white mr-4 border border-gray-200 dark:border-gray-500 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-4 w-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                          Gemini AI
                        </span>
                      </div>
                    )}
                    <div className={`text-sm whitespace-pre-wrap leading-relaxed ${
                      message.type === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {message.content}
                    </div>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' 
                        ? 'text-blue-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString('ko-KR')}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg mr-4 border border-gray-200 dark:border-gray-500 shadow-sm max-w-[85%]">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                        Gemini AI
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <span className="text-xs text-gray-500 ml-2">AI가 응답을 생성하고 있습니다...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="기계설비 관련 질문을 입력하세요... (예: 펌프 점검 주기, 법규 준수사항 등)"
                  className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  disabled={isLoading}
                  maxLength={500}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enter로 전송 • 최대 500자 • 운용지침 자동 적용
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {input.length}/500
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 사용 팁 */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">💡 효과적인 질문 방법</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-600 dark:text-blue-400">
            <div>
              <p className="font-medium mb-1">구체적인 설비명 포함:</p>
              <p>"원심펌프 정기점검 주기는?"</p>
            </div>
            <div>
              <p className="font-medium mb-1">법규 관련 질문:</p>
              <p>"기계설비법 점검 의무사항은?"</p>
            </div>
            <div>
              <p className="font-medium mb-1">고장 진단 요청:</p>
              <p>"모터 진동 증가 원인 분석해줘"</p>
            </div>
            <div>
              <p className="font-medium mb-1">안전 관련 문의:</p>
              <p>"압력용기 안전점검 절차는?"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIChatbot;
