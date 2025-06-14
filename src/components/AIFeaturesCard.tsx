
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Workflow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIFeaturesCard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            <span className="font-bold">AI 스마트 기능</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs font-extrabold">
              NEW
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white mb-3"
            onClick={() => navigate('/ai')}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI 기능 둘러보기
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Workflow className="h-5 w-5 text-blue-600" />
            <span className="font-bold">현장 작업 가이드</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs font-extrabold">
              모바일 최적화
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/workflow')}
          >
            <Workflow className="h-4 w-4 mr-2" />
            단계별 작업 시작
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeaturesCard;
