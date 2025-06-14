
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings } from 'lucide-react';
import EquipmentTableRow from './EquipmentTableRow';

interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
}

interface EquipmentTableProps {
  equipmentData: Equipment[];
  onEquipmentNameClick: (equipment: Equipment) => void;
  onEquipmentEdit: (equipment: Equipment) => void;
  onDownloadPDF: (equipment: Equipment) => void;
}

const EquipmentTable = ({
  equipmentData,
  onEquipmentNameClick,
  onEquipmentEdit,
  onDownloadPDF
}: EquipmentTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 border-b border-slate-200">
            <TableHead className="text-sm font-bold text-slate-700 py-5 px-6">설비명</TableHead>
            <TableHead className="text-sm font-bold text-slate-700 py-5 px-6">설치위치</TableHead>
            <TableHead className="text-sm font-bold text-slate-700 py-5 px-6">점검일자</TableHead>
            <TableHead className="text-sm font-bold text-slate-700 py-5 px-6 text-center">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipmentData.map((equipment, index) => (
            <EquipmentTableRow
              key={equipment.id}
              equipment={equipment}
              index={index}
              onEquipmentNameClick={onEquipmentNameClick}
              onEquipmentEdit={onEquipmentEdit}
              onDownloadPDF={onDownloadPDF}
            />
          ))}
          {equipmentData.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                <div className="flex flex-col items-center gap-2">
                  <Settings className="h-8 w-8 text-slate-300" />
                  <p className="text-sm">등록된 설비가 없습니다.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EquipmentTable;
