
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Plus, Edit } from 'lucide-react';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-600" />
            설비 현황
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{equipmentData.length}대</Badge>
            <Button 
              size="sm" 
              onClick={onAddEquipment}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              설비등록
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-bold">명칭</TableHead>
                <TableHead className="text-xs font-bold">설치위치</TableHead>
                <TableHead className="text-xs font-bold">점검일자</TableHead>
                <TableHead className="text-xs font-bold w-16">편집</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentData.map((equipment) => (
                <TableRow key={equipment.id}>
                  <TableCell 
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    onClick={() => onEquipmentNameClick(equipment)}
                  >
                    {equipment.name}
                  </TableCell>
                  <TableCell className="text-xs">{equipment.location}</TableCell>
                  <TableCell className="text-xs">{equipment.inspectionDate}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEquipmentEdit(equipment)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentStatusCard;
