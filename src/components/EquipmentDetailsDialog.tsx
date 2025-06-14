
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Settings, Edit } from 'lucide-react';

interface EquipmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: any;
  onEdit: (equipment: any) => void;
}

const EquipmentDetailsDialog = ({ 
  open, 
  onOpenChange, 
  equipment, 
  onEdit 
}: EquipmentDetailsDialogProps) => {
  if (!equipment) return null;

  const handleEdit = () => {
    onEdit(equipment);
    onOpenChange(false);
  };

  const renderValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    return String(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              설비 상세 정보
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-1" />
              편집
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">설비명</label>
                  <p className="text-lg font-semibold">{equipment.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">설비 종류</label>
                  <p className="text-sm">{equipment.type || equipment.equipmentType || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">설치 위치</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <p className="text-sm">{equipment.location}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">점검 일자</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-sm">{equipment.inspectionDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 추가 정보 */}
          {Object.keys(equipment).filter(key => 
            !['id', 'name', 'type', 'equipmentType', 'location', 'inspectionDate'].includes(key)
          ).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">추가 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(equipment)
                    .filter(([key]) => 
                      !['id', 'name', 'type', 'equipmentType', 'location', 'inspectionDate'].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key}>
                        <label className="text-sm font-medium text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <p className="text-sm">{renderValue(value)}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 상태 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">상태 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  정상 운영
                </Badge>
                <span className="text-sm text-gray-600">
                  마지막 업데이트: {new Date().toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentDetailsDialog;
