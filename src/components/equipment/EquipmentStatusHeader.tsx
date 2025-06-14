
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Plus, Download } from 'lucide-react';

interface EquipmentStatusHeaderProps {
  equipmentCount: number;
  onAddEquipment: () => void;
  onDownloadAll: () => void;
}

const EquipmentStatusHeader = ({
  equipmentCount,
  onAddEquipment,
  onDownloadAll
}: EquipmentStatusHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 헤더 타이틀 영역 */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-50 rounded-xl shadow-sm">
          <Settings className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">설비 현황</h3>
          <p className="text-sm text-slate-500 mt-1">등록된 설비 목록을 관리하세요</p>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className="flex items-center justify-between">
        <Badge 
          variant="secondary" 
          className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 text-sm"
        >
          총 {equipmentCount}대
        </Badge>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={onDownloadAll}
            className="text-green-600 border-green-200 hover:bg-green-50 font-medium px-4"
          >
            <Download className="h-4 w-4 mr-2" />
            전체 다운로드
          </Button>
          <Button 
            size="sm" 
            onClick={onAddEquipment}
            className="bg-blue-600 hover:bg-blue-700 font-medium px-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            설비등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentStatusHeader;
