
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Download } from 'lucide-react';

interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
}

interface EquipmentTableRowProps {
  equipment: Equipment;
  index: number;
  onEquipmentNameClick: (equipment: Equipment) => void;
  onEquipmentEdit: (equipment: Equipment) => void;
  onDownloadPDF: (equipment: Equipment) => void;
}

const EquipmentTableRow = ({
  equipment,
  index,
  onEquipmentNameClick,
  onEquipmentEdit,
  onDownloadPDF
}: EquipmentTableRowProps) => {
  return (
    <TableRow 
      className={`hover:bg-slate-50 transition-colors border-b border-slate-100 ${
        index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
      }`}
    >
      <TableCell className="py-5 px-6">
        <div 
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors"
          onClick={() => onEquipmentNameClick(equipment)}
        >
          {equipment.name}
        </div>
      </TableCell>
      <TableCell className="text-sm text-slate-600 py-5 px-6 font-medium">
        {equipment.location}
      </TableCell>
      <TableCell className="text-sm text-slate-600 py-5 px-6">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          {equipment.inspectionDate}
        </span>
      </TableCell>
      <TableCell className="py-5 px-6">
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDownloadPDF(equipment)}
            className="h-9 w-9 p-0 hover:bg-green-100 text-green-600 rounded-lg"
            title="PDF 다운로드"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEquipmentEdit(equipment)}
            className="h-9 w-9 p-0 hover:bg-blue-100 text-blue-600 rounded-lg"
            title="편집"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EquipmentTableRow;
