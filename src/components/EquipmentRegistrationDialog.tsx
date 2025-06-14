
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { EquipmentForm } from '@/types/equipment';
import { getDefaultFormForEquipmentType } from '@/data/equipmentForms';
import EquipmentFormManager from '@/components/forms/EquipmentFormManager';
import EquipmentTypeSelector from '@/components/forms/EquipmentTypeSelector';
import DynamicFormRenderer from '@/components/forms/DynamicFormRenderer';
import FormActions from '@/components/forms/FormActions';

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
            <EquipmentTypeSelector
              value={selectedEquipmentType}
              onChange={setSelectedEquipmentType}
            />

            {currentForm && (
              <DynamicFormRenderer
                form={currentForm}
                formData={formData}
                onInputChange={handleInputChange}
              />
            )}
          </div>

          <FormActions
            editingEquipment={editingEquipment}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={() => onOpenChange(false)}
          />
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
