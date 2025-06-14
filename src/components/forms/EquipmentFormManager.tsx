
import React, { useState, useEffect } from 'react';
import { EquipmentForm } from '@/types/equipment';
import { EQUIPMENT_TYPES } from '@/types/equipment';
import { defaultEquipmentForms, getDefaultFormForEquipmentType } from '@/data/equipmentForms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save } from 'lucide-react';
import FormFieldEditor from './FormFieldEditor';

interface EquipmentFormManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFormSave: (forms: EquipmentForm[]) => void;
}

const EquipmentFormManager = ({ open, onOpenChange, onFormSave }: EquipmentFormManagerProps) => {
  const [forms, setForms] = useState<EquipmentForm[]>(defaultEquipmentForms);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>('');
  const [currentForm, setCurrentForm] = useState<EquipmentForm | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 저장된 양식 불러오기
    const savedForms = localStorage.getItem('equipmentForms');
    if (savedForms) {
      setForms(JSON.parse(savedForms));
    }
  }, []);

  useEffect(() => {
    if (selectedEquipmentType) {
      const existingForm = forms.find(form => form.name === selectedEquipmentType);
      if (existingForm) {
        setCurrentForm(existingForm);
      } else {
        const defaultForm = getDefaultFormForEquipmentType(selectedEquipmentType);
        setCurrentForm(defaultForm);
      }
    }
  }, [selectedEquipmentType, forms]);

  const handleSaveForm = () => {
    if (!currentForm) return;

    const updatedForms = forms.filter(form => form.name !== currentForm.name);
    updatedForms.push(currentForm);
    
    setForms(updatedForms);
    localStorage.setItem('equipmentForms', JSON.stringify(updatedForms));
    onFormSave(updatedForms);
  };

  const handleFieldsChange = (fields: any[]) => {
    if (currentForm) {
      setCurrentForm({ ...currentForm, fields });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            설비 양식 관리
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>설비 종류 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedEquipmentType} onValueChange={setSelectedEquipmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="편집할 설비 종류를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {EQUIPMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {currentForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{currentForm.name} 양식 편집</CardTitle>
                  <Button onClick={handleSaveForm}>
                    <Save className="h-4 w-4 mr-2" />
                    양식 저장
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <FormFieldEditor
                  fields={currentForm.fields}
                  onFieldsChange={handleFieldsChange}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentFormManager;
