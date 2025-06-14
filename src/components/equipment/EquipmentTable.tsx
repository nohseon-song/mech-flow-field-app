
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
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 border-b border-slate-200">
            <TableHead className="text-sm font-bold text-slate-700 py-4 px-6 w-1/3">
              설비명
            </TableHead>
            <TableHead className="text-sm font-bold text-slate-700 py-4 px-6 w-1/3">
              설치위치
            </TableHead>
            <TableHead className="text-sm font-bold text-slate-700 py-4 px-6 w-1/4">
              점검일자
            </TableHead>
            <TableHead className="text-sm font-bold text-slate-700 py-4 px-6 w-20 text-center">
              액션
            </TableHead>
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
              <TableCell colSpan={4} className="text-center py-16 text-slate-500">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-4 bg-slate-100 rounded-full">
                    <Settings className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-slate-600">등록된 설비가 없습니다</p>
                    <p className="text-sm text-slate-400 mt-1">새로운 설비를 등록해보세요</p>
                  </div>
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
