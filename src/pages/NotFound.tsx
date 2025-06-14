
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-6 text-center">
        <div className="space-y-6">
          <div>
            <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">페이지를 찾을 수 없습니다</h2>
            <p className="text-slate-600">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Home className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
            
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전 페이지로
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
