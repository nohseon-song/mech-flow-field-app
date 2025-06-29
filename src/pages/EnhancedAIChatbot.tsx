
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Download, 
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const GOOGLE_GEMINI_API_KEY = "AIzaSyBgvOOeArqdsQFHD6zfAmjyLCptdKXRezc";

const EnhancedAIChatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 초기화 및 API 상태 확인
  useEffect(() => {
    checkApiConnection();
    loadChatHistory();
    
    // 환영 메시지
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'bot',
      content: `안녕하세요! 저는 AI 설비 분석 전문 상담 챗봇입니다. 🤖

다음과 같은 도움을 드릴 수 있습니다:
• 설비 운전 및 유지보수 상담
• 고장 진단 및 해결 방안 제시  
• 성능 최적화 조언
• 예방정비 계획 수립
• 기술적 질문 답변

궁금한 것이 있으시면 언제든 물어보세요!`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, []);

  // 메시지 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // API 연결 상태 확인
  const checkApiConnection = async () => {
    try {
      setApiStatus('checking');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }]
        })
      });
      
      if (response.ok) {
        setApiStatus('connected');
        console.log('✅ Gemini API 연결 성공');
      } else {
        throw new Error(`API 오류: ${response.status}`);
      }
    } catch (error) {
      setApiStatus('error');
      console.error('❌ Gemini API 연결 실패:', error);
      toast({
        title: "API 연결 실패",
        description: "Gemini API 연결에 문제가 있습니다. 새로고침해주세요.",
        variant: "destructive"
      });
    }
  };

  // 채팅 이력 로드
  const loadChatHistory = () => {
    try {
      const saved = localStorage.getItem('ai-chatbot-history');
      if (saved) {
        const parsedMessages = JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        if (parsedMessages.length > 1) { // 환영 메시지 제외
          setMessages(prev => [...prev, ...parsedMessages]);
        }
      }
    } catch (error) {
      console.warn('채팅 이력 로드 실패:', error);
    }
  };

  // 채팅 이력 저장
  const saveChatHistory = (newMessages: ChatMessage[]) => {
    try {
      const toSave = newMessages.filter(msg => msg.id !== 'welcome');
      localStorage.setItem('ai-chatbot-history', JSON.stringify(toSave));
    } catch (error) {
      console.warn('채팅 이력 저장 실패:', error);
    }
  };

  // 메시지 전송
  const sendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isLoading) return;

    if (apiStatus !== 'connected') {
      toast({
        title: "연결 오류",
        description: "AI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
      return;
    }

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: trimmedMessage,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // AI 응답 요청
      const aiResponse = await getAIResponse(trimmedMessage, updatedMessages);
      
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

      toast({
        title: "응답 완료",
        description: "AI 분석이 완료되었습니다."
      });

    } catch (error) {
      console.error('AI 응답 오류:', error);
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'bot',
        content: `죄송합니다. 응답 생성 중 오류가 발생했습니다. 🔧

오류 내용: ${error instanceof Error ? error.message : '알 수 없는 오류'}

다시 시도해주시거나, 질문을 다르게 표현해보세요.`,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      
      toast({
        title: "응답 실패",
        description: "AI 응답 생성에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // AI 응답 생성
  const getAIResponse = async (userMessage: string, chatHistory: ChatMessage[]): Promise<string> => {
    const systemPrompt = `당신은 산업설비 전문가 AI 어시스턴트입니다. 다음 역할을 수행하세요:

1. 설비 운전, 유지보수, 고장 진단 전문 상담
2. 구체적이고 실용적인 해결방안 제시
3. 안전을 최우선으로 하는 조언
4. 한국의 산업 현장 상황을 고려한 답변
5. 전문 용어 사용 시 쉬운 설명 병행

답변 스타일:
- 친근하고 이해하기 쉽게
- 단계별 설명으로 구체적으로
- 안전 주의사항 반드시 포함
- 필요시 추가 질문 유도`;

    // 대화 컨텍스트 구성
    const conversationContext = chatHistory
      .slice(-10) // 최근 10개 메시지만
      .filter(msg => msg.id !== 'welcome')
      .map(msg => `${msg.type === 'user' ? '사용자' : 'AI'}: ${msg.content}`)
      .join('\n\n');

    const fullPrompt = `${systemPrompt}

이전 대화:
${conversationContext}

현재 질문: ${userMessage}

위 내용을 바탕으로 전문적이고 도움이 되는 답변을 제공해주세요.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 오류: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('AI 응답을 생성할 수 없습니다.');
    }

    return generatedText.trim();
  };

  // 채팅 초기화
  const clearChat = () => {
    if (window.confirm('모든 대화 내용을 삭제하시겠습니까?')) {
      setMessages([{
        id: 'welcome',
        type: 'bot',
        content: '새로운 대화를 시작합니다! 무엇을 도와드릴까요? 🤖',
        timestamp: new Date()
      }]);
      localStorage.removeItem('ai-chatbot-history');
      toast({
        title: "채팅 초기화",
        description: "모든 대화 내용이 삭제되었습니다."
      });
    }
  };

  // 채팅 다운로드
  const downloadChat = () => {
    const chatContent = messages
      .filter(msg => msg.id !== 'welcome')
      .map(msg => {
        const time = msg.timestamp.toLocaleString('ko-KR');
        const sender = msg.type === 'user' ? '사용자' : 'AI 어시스턴트';
        return `[${time}] ${sender}:\n${msg.content}\n`;
      })
      .join('\n---\n\n');

    const blob = new Blob([`AI 설비 상담 대화록\n생성일: ${new Date().toLocaleString('ko-KR')}\n\n${chatContent}`], 
      { type: 'text/plain;charset=utf-8' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI상담_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "다운로드 완료",
      description: "대화 내용이 텍스트 파일로 저장되었습니다."
    });
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* 헤더 */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                돌아가기
              </Button>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI 설비 전문 상담
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={apiStatus === 'connected' ? 'default' : apiStatus === 'error' ? 'destructive' : 'secondary'}
                className="flex items-center gap-1"
              >
                {apiStatus === 'checking' && <Loader2 className="h-3 w-3 animate-spin" />}
                {apiStatus === 'connected' && <CheckCircle className="h-3 w-3" />}
                {apiStatus === 'error' && <AlertCircle className="h-3 w-3" />}
                {apiStatus === 'checking' ? '연결 확인 중' : 
                 apiStatus === 'connected' ? 'Gemini 1.5 연결됨' : '연결 오류'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                AI 상담 채팅
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadChat} disabled={messages.length <= 1}>
                  <Download className="h-4 w-4 mr-1" />
                  저장
                </Button>
                <Button variant="outline" size="sm" onClick={clearChat}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  초기화
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* 메시지 영역 */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      
                      <div className={`rounded-lg px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        <div className={`text-xs mt-2 opacity-70 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString('ko-KR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI가 답변을 생성하고 있습니다...
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* 입력 영역 */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="설비 관련 질문을 입력하세요... (예: 펌프 진동이 심해요, 온도가 너무 높아요)"
                  disabled={isLoading || apiStatus !== 'connected'}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isLoading || apiStatus !== 'connected'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                💡 팁: 구체적인 상황을 설명하면 더 정확한 답변을 받을 수 있습니다
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedAIChatbot;
