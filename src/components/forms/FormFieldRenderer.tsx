
import React from 'react';
import { FormField } from '@/types/equipment';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (fieldName: string, value: any) => void;
}

const FormFieldRenderer = ({ field, value, onChange }: FormFieldRendererProps) => {
  switch (field.type) {
    case 'select':
      return (
        <Select 
          value={value || ''} 
          onValueChange={(val) => onChange(field.name, val)}
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
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );

    case 'measurement':
      return (
        <div className="flex gap-2">
          <Input
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
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
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
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

export default FormFieldRenderer;
