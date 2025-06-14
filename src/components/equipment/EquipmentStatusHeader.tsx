
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Plus, Download } from 'lucide-react';

interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
}

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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 rounded-xl">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-800">설비 현황</h3>
          <p className="text-sm text-slate-500 font-normal">등록된 설비 목록</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-semibold px-3 py-1">
          {equipmentCount}대
        </Badge>
        <Button 
          size="sm" 
          variant="outline"
          onClick={onDownloadAll}
          className="text-green-600 border-green-200 hover:bg-green-50 font-medium"
        >
          <Download className="h-4 w-4 mr-2" />
          전체 다운로드
        </Button>
        <Button 
          size="sm" 
          onClick={onAddEquipment}
          className="bg-blue-600 hover:bg-blue-700 font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          설비등록
        </Button>
      </div>
    </div>
  );
};

export default EquipmentStatusHeader;
