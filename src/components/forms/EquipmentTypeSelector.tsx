
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EQUIPMENT_TYPES } from '@/types/equipment';

interface EquipmentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const EquipmentTypeSelector = ({ value, onChange }: EquipmentTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="equipmentType">설비 종류</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
};

export default EquipmentTypeSelector;
