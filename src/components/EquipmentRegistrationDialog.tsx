
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

const equipmentTypes = [
  '냉동기(일반)',
  '냉동기(흡수식)',
  '흡수식 냉온수기',
  '공랭식 냉동기',
  '냉각탑',
  '축열조',
  '보일러',
  '열교환기',
  '팽창탱크',
  '펌프(냉ㆍ난방)',
  '신재생에너지시스템(지열)',
  '신재생에너지시스템(태양열)',
  '신재생에너지시스템(연료전지)',
  '패키지에어컨',
  '항온항습기',
  '공기조화기',
  '팬코일유닛',
  '환기설비',
  '필터',
  '고·저수조',
  '오수정화설비',
  '물 재이용설비',
  '자동제어 시스템'
];

interface EquipmentRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (equipment: any) => void;
  onDelete: (equipmentId: number) => void;
  editingEquipment?: any;
}

const EquipmentRegistrationDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  onDelete, 
  editingEquipment 
}: EquipmentRegistrationDialogProps) => {
  const [formData, setFormData] = useState({
    equipmentType: '',
    name: '',
    location: '',
    inspectionDate: ''
  });

  useEffect(() => {
    if (editingEquipment) {
      setFormData({
        equipmentType: editingEquipment.type || '',
        name: editingEquipment.name || '',
        location: editingEquipment.location || '',
        inspectionDate: editingEquipment.inspectionDate || ''
      });
    } else {
      setFormData({
        equipmentType: '',
        name: '',
        location: '',
        inspectionDate: ''
      });
    }
  }, [editingEquipment, open]);

  const handleSave = () => {
    if (!formData.name || !formData.location) {
      alert('설비명과 설치위치를 입력해주세요.');
      return;
    }

    onSave({
      name: formData.name,
      location: formData.location,
      inspectionDate: formData.inspectionDate || new Date().toISOString().split('T')[0],
      type: formData.equipmentType
    });
  };

  const handleDelete = () => {
    if (editingEquipment) {
      onDelete(editingEquipment.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingEquipment ? '설비 정보 수정' : '새 설비 등록'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="equipmentType">설비 종류</Label>
            <Select 
              value={formData.equipmentType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, equipmentType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="설비 종류를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {equipmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">설비명 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="예: 보일러 #1"
            />
          </div>

          <div>
            <Label htmlFor="location">설치위치 *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="예: 지하 1층 기계실"
            />
          </div>

          <div>
            <Label htmlFor="inspectionDate">점검일자</Label>
            <Input
              id="inspectionDate"
              type="date"
              value={formData.inspectionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, inspectionDate: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {editingEquipment && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>설비 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 설비를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentRegistrationDialog;
