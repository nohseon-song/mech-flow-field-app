
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, ClipboardCheck, BarChart3, History, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EquipmentCard from '@/components/EquipmentCard';
import QuickStats from '@/components/QuickStats';

const Index = () => {
  const navigate = useNavigate();

  const equipmentData = [
    {
      id: 1,
      name: "보일러 #1",
      type: "가열설비",
      status: "정상",
      lastCheck: "2024-06-13",
      nextCheck: "2024-06-20",
      location: "지하 1층 기계실"
    },
    {
      id: 2,
      name: "냉각탑 #2",
      type: "냉각설비",
      status: "점검필요",
      lastCheck: "2024-06-10",
      nextCheck: "2024-06-17",
      location: "옥상"
    },
    {
      id: 3,
      name: "송풍기 #A",
      type: "환기설비",
      status: "정상",
      lastCheck: "2024-06-12",
      nextCheck: "2024-06-19",
      location: "3층 기계실"
    },
    {
      id: 4,
      name: "압축기 #3",
      type: "압축설비",
      status: "이상",
      lastCheck: "2024-06-11",
      nextCheck: "2024-06-18",
      location: "2층 공장동"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">기계설비 점검</h1>
              <p className="text-sm text-slate-600">현장작업 관리시스템</p>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <QuickStats />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
              빠른 작업
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-16 flex flex-col gap-1 bg-blue-600 hover:bg-blue-700">
                <ClipboardCheck className="h-6 w-6" />
                <span className="text-sm">새 점검</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">리포트</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              AI 스마트 기능
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                NEW
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 mb-4">
              Google Gemini AI로 현장 작업을 더욱 스마트하게!
            </p>
            <Button 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => navigate('/ai')}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI 기능 둘러보기
            </Button>
          </CardContent>
        </Card>

        {/* Equipment List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-600" />
                설비 현황
              </div>
              <Badge variant="secondary">{equipmentData.length}대</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {equipmentData.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-slate-600" />
              최근 활동
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">보일러 #1 점검 완료</p>
                <p className="text-xs text-slate-600">2시간 전</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">압축기 #3 이상 감지</p>
                <p className="text-xs text-slate-600">5시간 전</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
