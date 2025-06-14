
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
      className={`hover:bg-slate-50/50 transition-colors border-b border-slate-100 ${
        index % 2 === 0 ? 'bg-white' : 'bg-slate-25/30'
      }`}
    >
      <TableCell className="py-4 px-6">
        <button 
          className="text-left w-full text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm"
          onClick={() => onEquipmentNameClick(equipment)}
        >
          {equipment.name}
        </button>
      </TableCell>
      
      <TableCell className="text-sm text-slate-600 py-4 px-6 font-medium">
        <div className="flex items-center">
          <span className="text-slate-700">{equipment.location}</span>
        </div>
      </TableCell>
      
      <TableCell className="text-sm py-4 px-6">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
          {equipment.inspectionDate}
        </span>
      </TableCell>
      
      <TableCell className="py-4 px-6">
        <div className="flex items-center justify-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDownloadPDF(equipment)}
            className="h-8 w-8 p-0 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
            title="PDF 다운로드"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEquipmentEdit(equipment)}
            className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
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
