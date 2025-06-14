
import React, { useState } from 'react';
import { FormField } from '@/types/equipment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';

interface FormFieldEditorProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
}

const FormFieldEditor = ({ fields, onFieldsChange }: FormFieldEditorProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text'
  });

  const handleAddField = () => {
    if (!newField.label || !newField.name) return;
    
    const field: FormField = {
      id: Date.now().toString(),
      name: newField.name!,
      label: newField.label!,
      type: newField.type as FormField['type'],
      required: newField.required || false,
      placeholder: newField.placeholder || '',
      unit: newField.unit || '',
      category: newField.category || ''
    };

    onFieldsChange([...fields, field]);
    setNewField({ type: 'text' });
  };

  const handleUpdateField = (index: number, updatedField: FormField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    onFieldsChange(newFields);
    setEditingField(null);
  };

  const handleDeleteField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    onFieldsChange(newFields);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">새 필드 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>필드명</Label>
              <Input
                value={newField.label || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '') }))}
                placeholder="필드명"
              />
            </div>
            <div>
              <Label>타입</Label>
              <Select value={newField.type} onValueChange={(value) => setNewField(prev => ({ ...prev, type: value as FormField['type'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">텍스트</SelectItem>
                  <SelectItem value="number">숫자</SelectItem>
                  <SelectItem value="select">선택</SelectItem>
                  <SelectItem value="date">날짜</SelectItem>
                  <SelectItem value="measurement">측정값</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>카테고리</Label>
              <Input
                value={newField.category || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, category: e.target.value }))}
                placeholder="카테고리 (선택사항)"
              />
            </div>
            <div>
              <Label>단위</Label>
              <Input
                value={newField.unit || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="단위 (선택사항)"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleAddField} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              필드 추가
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-4">
              {editingField === field.id ? (
                <EditFieldForm 
                  field={field}
                  onSave={(updatedField) => handleUpdateField(index, updatedField)}
                  onCancel={() => setEditingField(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{field.label}</div>
                    <div className="text-sm text-gray-500">
                      타입: {field.type} {field.unit && `| 단위: ${field.unit}`} {field.category && `| 카테고리: ${field.category}`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingField(field.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteField(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface EditFieldFormProps {
  field: FormField;
  onSave: (field: FormField) => void;
  onCancel: () => void;
}

const EditFieldForm = ({ field, onSave, onCancel }: EditFieldFormProps) => {
  const [editedField, setEditedField] = useState<FormField>({ ...field });

  const handleSave = () => {
    onSave(editedField);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>필드명</Label>
          <Input
            value={editedField.label}
            onChange={(e) => setEditedField(prev => ({ ...prev, label: e.target.value }))}
          />
        </div>
        <div>
          <Label>타입</Label>
          <Select value={editedField.type} onValueChange={(value) => setEditedField(prev => ({ ...prev, type: value as FormField['type'] }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">텍스트</SelectItem>
              <SelectItem value="number">숫자</SelectItem>
              <SelectItem value="select">선택</SelectItem>
              <SelectItem value="date">날짜</SelectItem>
              <SelectItem value="measurement">측정값</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>카테고리</Label>
          <Input
            value={editedField.category || ''}
            onChange={(e) => setEditedField(prev => ({ ...prev, category: e.target.value }))}
          />
        </div>
        <div>
          <Label>단위</Label>
          <Input
            value={editedField.unit || ''}
            onChange={(e) => setEditedField(prev => ({ ...prev, unit: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm">
          <Check className="h-4 w-4 mr-1" />
          저장
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X className="h-4 w-4 mr-1" />
          취소
        </Button>
      </div>
    </div>
  );
};

export default FormFieldEditor;
