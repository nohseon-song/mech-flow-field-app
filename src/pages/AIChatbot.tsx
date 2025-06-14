
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageCircle, Send, User, Bot, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
  guideline?: string;
}

const AIChatbot = () => {
  const navigate = useNavigate();
  const [guideline, setGuideline] = useState('operation');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "안녕하세요! CheckMate 전문가입니다. 🤖\n\n플랫폼 사용법, 기계설비 법규, 점검 노하우 등 무엇이든 물어보세요! 24시간 답변해 드립니다.\n\n💡 답변 지침을 선택하시면 더 맞춤형 답변을 받을 수 있습니다.",
      isUser: false,
      timestamp: new Date(),
      guideline: 'operation'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
      guideline
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        content: getAIResponse(inputMessage, guideline),
        isUser: false,
        timestamp: new Date(),
        guideline
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string, currentGuideline: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('점검') && input.includes('주기')) {
      return currentGuideline === 'operation' ? 
        "기계설비 점검 주기 실무 가이드를 안내해드리겠습니다.\n\n📋 **현장 점검 주기**:\n- 일일점검: 외관, 소음, 진동 확인\n- 주간점검: 윤활유, 필터 상태 점검\n- 월간점검: 벨트 장력, 배관 누수 확인\n- 분기점검: 전문업체 의뢰 정밀점검\n\n⚡ **효율적 점검 팁**:\n- 체크리스트 앱 활용으로 누락 방지\n- 사진 촬영으로 변화 추이 관리\n- 예비부품 재고와 연계 점검\n\n더 구체적인 설비별 주기가 궁금하시면 설비명을 말씀해주세요!" :
        "기계설비 점검 주기 법규 기준을 안내해드리겠습니다.\n\n📜 **법정 점검 주기**:\n- 성능점검: 연 1회 이상 (기계설비법 제15조)\n- 안전점검: 월 1회 이상 (산업안전보건법)\n- 정밀점검: 2년마다 (건축물관리법)\n\n📋 **의무 기록사항**:\n- 점검결과서 3년간 보관\n- 점검자 자격 및 서명 필수\n- 이상 발견 시 즉시 조치 및 신고\n\n⚖️ **미이행시 처벌**:\n- 과태료: 300만원 이하\n- 사업정지: 최대 6개월\n\n세부 법령이 궁금하시면 구체적으로 질문해주세요!";
    }
    
    if (input.includes('사용법') || input.includes('앱')) {
      return currentGuideline === 'operation' ? 
        "CheckMate 앱 실무 활용법을 안내해드리겠습니다.\n\n📱 **효율적 사용 순서**:\n1. 설비 등록: QR코드로 빠른 식별\n2. 점검 시작: 위치 기반 자동 체크리스트 로드\n3. 실시간 입력: 음성인식으로 빠른 메모\n4. 사진 첨부: 이상부위 즉시 촬영\n5. 자동 리포트: AI가 구조화된 보고서 생성\n\n💡 **현장 활용 팁**:\n- 오프라인 모드로 통신 두절시에도 사용\n- 블루투스 측정기와 연동 가능\n- 팀원과 실시간 점검 현황 공유\n\n특정 기능 사용법이 궁금하시면 말씀해주세요!" :
        "CheckMate 앱 표준 사용 절차를 안내해드리겠습니다.\n\n📋 **표준 사용 프로세스**:\n1. 사용자 인증 및 권한 확인\n2. 법정 점검항목 준수 확인\n3. 표준 양식에 따른 데이터 입력\n4. 디지털 서명 및 인증\n5. 법정 보관 기준에 따른 저장\n\n📜 **준수 기준**:\n- 개인정보보호법: 데이터 암호화 저장\n- 전자문서법: 디지털 서명 유효성\n- 기계설비법: 법정 양식 준수\n\n🔐 **보안 요구사항**:\n- 접근권한 관리 (역할 기반)\n- 감사 로그 자동 생성\n- 백업 및 복구 시스템\n\n규정 준수 관련 문의는 언제든 해주세요!";
    }
    
    if (input.includes('안전') || input.includes('주의')) {
      return currentGuideline === 'operation' ? 
        "현장 안전 실무 수칙을 안내해드리겠습니다.\n\n⚡ **점검 전 필수 확인**:\n- 개인보호구 5종 세트 착용 확인\n- 작업 전 안전교육 이수 체크\n- 응급처치 키트 위치 파악\n- 비상연락망 숙지\n\n🔧 **실제 점검시 주의사항**:\n- 설비 완전 정지 후 점검 시작\n- 두 사람 이상 팀워크 점검\n- 가스 검지기 상시 휴대\n- 고소작업시 안전벨트 필수\n\n📱 **앱 내 안전 기능**:\n- SOS 버튼: 위급시 즉시 신고\n- 위치 추적: 실시간 작업자 위치 공유\n- 안전 체크리스트: 점검 전 안전 확인\n\n현장에서 안전이 최우선입니다!" :
        "기계설비 점검 안전 법규를 안내해드리겠습니다.\n\n⚖️ **법정 안전 기준**:\n- 산업안전보건법 제5조: 사업주 안전 의무\n- 산업안전보건기준규칙: 개인보호구 착용\n- 위험물안전관리법: 위험물 취급 기준\n\n📜 **의무 교육**:\n- 신규자: 8시간 이상 안전교육\n- 기존자: 분기별 2시간 보수교육\n- 관리감독자: 연 16시간 이상\n\n🔍 **법정 점검사항**:\n- 작업환경측정: 6개월마다\n- 안전장치 점검: 월 1회 이상\n- 비상대피시설 점검: 분기 1회\n\n⚠️ **위반시 처벌**:\n- 안전조치 미이행: 5년 이하 징역\n- 중대재해 발생시: 중대재해처벌법 적용\n\n안전 관련 법규는 엄격히 준수해야 합니다!";
    }
    
    return currentGuideline === 'operation' ?
      "질문해주셔서 감사합니다! 😊\n\n현장 실무 관점에서 더 구체적인 질문을 해주시면 실용적인 답변을 드릴 수 있습니다.\n\n**실무 질문 예시**:\n- 보일러 점검 시 확인해야 할 실제 포인트는?\n- 현장에서 자주 발생하는 문제와 해결법은?\n- 점검 시간 단축을 위한 노하우는?\n- 팀원들과 효율적인 업무 분담 방법은?\n\n실무 경험을 바탕으로 도움을 드리겠습니다!" :
      "질문해주셔서 감사합니다! 😊\n\n법규 및 표준 기준으로 더 구체적인 질문을 해주시면 정확한 답변을 드릴 수 있습니다.\n\n**법규 질문 예시**:\n- 기계설비법 시행령 세부 조항은?\n- 건축물 에너지절약 설계기준은?\n- KS 표준 인증 요구사항은?\n- 법정 점검 면제 조건은?\n\n관련 법령과 표준을 기준으로 정확한 정보를 제공해드리겠습니다!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-teal-600" />
                CheckMate 전문가
              </h1>
              <p className="text-sm text-slate-600">AI 챗봇이 24시간 답변해드립니다</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guideline Selection */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <RadioGroup value={guideline} onValueChange={setGuideline} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="operation" id="operation-chat" />
                <Label htmlFor="operation-chat" className="text-sm">실무 중심</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="knowledge" id="knowledge-chat" />
                <Label htmlFor="knowledge-chat" className="text-sm">법규 중심</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-2 rounded-full ${message.isUser ? 'bg-blue-600' : 'bg-teal-600'}`}>
                {message.isUser ? 
                  <User className="h-4 w-4 text-white" /> : 
                  <Bot className="h-4 w-4 text-white" />
                }
              </div>
              <div className={`p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-200 text-slate-700'
              }`}>
                <pre className="whitespace-pre-wrap text-sm font-sans">
                  {message.content}
                </pre>
                <div className={`text-xs mt-1 flex items-center gap-1 ${message.isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                  {message.timestamp.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {!message.isUser && message.guideline && (
                    <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                      message.guideline === 'operation' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {message.guideline === 'operation' ? '실무' : '법규'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="p-2 rounded-full bg-teal-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || isTyping}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
