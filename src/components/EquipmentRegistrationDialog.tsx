
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Settings } from 'lucide-react';
import { EQUIPMENT_TYPES, EquipmentForm, FormField } from '@/types/equipment';
import { getDefaultFormForEquipmentType } from '@/data/equipmentForms';
import EquipmentFormManager from '@/components/forms/EquipmentFormManager';

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
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedEquipmentType, setSelectedEquipmentType] = useState('');
  const [currentForm, setCurrentForm] = useState<EquipmentForm | null>(null);
  const [equipmentForms, setEquipmentForms] = useState<EquipmentForm[]>([]);
  const [isFormManagerOpen, setIsFormManagerOpen] = useState(false);

  useEffect(() => {
    // 저장된 양식 불러오기
    const savedForms = localStorage.getItem('equipmentForms');
    if (savedForms) {
      setEquipmentForms(JSON.parse(savedForms));
    }
  }, []);

  useEffect(() => {
    if (editingEquipment) {
      setSelectedEquipmentType(editingEquipment.type || editingEquipment.equipmentType || '');
      setFormData(editingEquipment);
    } else {
      setFormData({});
      setSelectedEquipmentType('');
    }
  }, [editingEquipment, open]);

  useEffect(() => {
    if (selectedEquipmentType) {
      const savedForm = equipmentForms.find(form => form.name === selectedEquipmentType);
      const form = savedForm || getDefaultFormForEquipmentType(selectedEquipmentType);
      setCurrentForm(form);
    } else {
      setCurrentForm(null);
    }
  }, [selectedEquipmentType, equipmentForms]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSave = () => {
    if (!currentForm) return;
    
    const requiredFields = currentForm.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    
    if (missingFields.length > 0) {
      alert(`다음 필수 항목을 입력해주세요: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    onSave({
      ...formData,
      type: selectedEquipmentType,
      equipmentType: selectedEquipmentType,
      inspectionDate: formData.inspectionDate || new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = () => {
    if (editingEquipment) {
      onDelete(editingEquipment.id);
      onOpenChange(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'select':
        return (
          <Select 
            value={value} 
            onValueChange={(val) => handleInputChange(field.name, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `${field.label}을 선택하세요`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        );

      case 'measurement':
        return (
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder || field.label}
            />
            {field.unit && (
              <span className="flex items-center text-sm text-gray-500 min-w-fit px-2">
                {field.unit}
              </span>
            )}
          </div>
        );

      default:
        return (
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder || field.label}
            />
            {field.unit && (
              <span className="flex items-center text-sm text-gray-500 min-w-fit px-2">
                {field.unit}
              </span>
            )}
          </div>
        );
    }
  };

  const groupedFields = currentForm?.fields.reduce((groups: Record<string, FormField[]>, field) => {
    const category = field.category || '기본 정보';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(field);
    return groups;
  }, {}) || {};

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {editingEquipment ? '설비 정보 수정' : '새 설비 등록'}
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFormManagerOpen(true)}
              >
                <Settings className="h-4 w-4 mr-1" />
                양식 관리
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 설비 종류 선택 */}
            <div>
              <Label htmlFor="equipmentType">설비 종류</Label>
              <Select 
                value={selectedEquipmentType} 
                onValueChange={setSelectedEquipmentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="설비 종류를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {EQUIPMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 동적 양식 렌더링 */}
            {currentForm && Object.entries(groupedFields).map(([category, fields]) => (
              <div key={category} className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className={fields.length > 2 ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4"}>
                      <div>
                        <Label htmlFor={field.name}>
                          {field.label} {field.required && '*'}
                        </Label>
                        {renderField(field)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

      <EquipmentFormManager
        open={isFormManagerOpen}
        onOpenChange={setIsFormManagerOpen}
        onFormSave={setEquipmentForms}
      />
    </>
  );
};

export default EquipmentRegistrationDialog;
