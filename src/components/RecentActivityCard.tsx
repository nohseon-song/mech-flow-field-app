
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, AlertTriangle, CheckCircle } from 'lucide-react';

const RecentActivityCard = () => {
  return (
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
  );
};

export default RecentActivityCard;
