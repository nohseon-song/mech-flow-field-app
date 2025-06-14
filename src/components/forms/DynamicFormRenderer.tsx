
import React from 'react';
import { Label } from '@/components/ui/label';
import { EquipmentForm, FormField } from '@/types/equipment';
import FormFieldRenderer from './FormFieldRenderer';

interface DynamicFormRendererProps {
  form: EquipmentForm;
  formData: Record<string, any>;
  onInputChange: (fieldName: string, value: any) => void;
}

const DynamicFormRenderer = ({ form, formData, onInputChange }: DynamicFormRendererProps) => {
  const groupedFields = form.fields.reduce((groups: Record<string, FormField[]>, field) => {
    const category = field.category || '기본 정보';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(field);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedFields).map(([category, fields]) => (
        <div key={category} className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">{category}</h3>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className={fields.length > 2 ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4"}>
                <div>
                  <Label htmlFor={field.name}>
                    {field.label} {field.required && '*'}
                  </Label>
                  <FormFieldRenderer
                    field={field}
                    value={formData[field.name]}
                    onChange={onInputChange}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicFormRenderer;
