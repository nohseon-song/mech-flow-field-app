
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EquipmentStatusHeader from './equipment/EquipmentStatusHeader';
import EquipmentTable from './equipment/EquipmentTable';
import { downloadEquipmentPDF, downloadAllEquipmentPDF } from '@/utils/pdfUtils';

interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
}

interface EquipmentStatusCardProps {
  equipmentData: Equipment[];
  onEquipmentNameClick: (equipment: Equipment) => void;
  onEquipmentEdit: (equipment: Equipment) => void;
  onAddEquipment: () => void;
}

const EquipmentStatusCard = ({ 
  equipmentData, 
  onEquipmentNameClick, 
  onEquipmentEdit, 
  onAddEquipment 
}: EquipmentStatusCardProps) => {
  const handleDownloadAll = () => {
    downloadAllEquipmentPDF(equipmentData);
  };

  const handleDownloadPDF = (equipment: Equipment) => {
    downloadEquipmentPDF(equipment);
  };

  return (
    <Card className="shadow-lg border-0 bg-white rounded-xl">
      <CardHeader className="pb-4 px-6 pt-6">
        <EquipmentStatusHeader
          equipmentCount={equipmentData.length}
          onAddEquipment={onAddEquipment}
          onDownloadAll={handleDownloadAll}
        />
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <EquipmentTable
          equipmentData={equipmentData}
          onEquipmentNameClick={onEquipmentNameClick}
          onEquipmentEdit={onEquipmentEdit}
          onDownloadPDF={handleDownloadPDF}
        />
      </CardContent>
    </Card>
  );
};

export default EquipmentStatusCard;
