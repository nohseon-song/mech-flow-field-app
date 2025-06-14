
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
}

interface EquipmentDashboardProps {
  equipmentData: Equipment[];
}

const EquipmentDashboard = ({ equipmentData }: EquipmentDashboardProps) => {
  // 설비 상태 분석 (임시 로직 - 실제로는 점검 상태 데이터가 필요)
  const totalEquipment = equipmentData.length;
  const completedInspections = Math.floor(totalEquipment * 0.7); // 70% 완료로 가정
  const pendingInspections = totalEquipment - completedInspections;
  const issuesFound = Math.floor(totalEquipment * 0.1); // 10% 이상으로 가정

  const stats = [
    {
      label: '총 설비',
      value: totalEquipment,
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: '점검완료',
      value: completedInspections,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: '점검대기',
      value: pendingInspections,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      label: '이상발견',
      value: issuesFound,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-600" />
            설비 현황 대시보드
          </h3>
          <p className="text-sm text-slate-600">실시간 설비 점검 현황</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-3`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-slate-700">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}대</div>
              
              {/* 진행률 표시 (점검완료/대기의 경우) */}
              {(stat.label === '점검완료' || stat.label === '점검대기') && (
                <div className="mt-2">
                  <div className="text-xs text-slate-600 mb-1">
                    {Math.round((stat.value / totalEquipment) * 100)}%
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        stat.label === '점검완료' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${(stat.value / totalEquipment) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 요약 정보 */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">점검 진행률</span>
            <span className="font-semibold text-slate-800">
              {Math.round((completedInspections / totalEquipment) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedInspections / totalEquipment) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentDashboard;
