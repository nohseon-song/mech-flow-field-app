
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Plus, Edit, Download } from 'lucide-react';
import jsPDF from 'jspdf';

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
  
  const downloadEquipmentPDF = (equipment: Equipment) => {
    const doc = new jsPDF();
    
    // Set font for Korean text support
    doc.setFont('helvetica');
    
    // Add title
    doc.setFontSize(20);
    doc.text('설비 현황 보고서', 20, 30);
    
    // Add equipment details
    doc.setFontSize(14);
    doc.text(`설비명: ${equipment.name}`, 20, 60);
    doc.text(`설치위치: ${equipment.location}`, 20, 80);
    doc.text(`점검일자: ${equipment.inspectionDate}`, 20, 100);
    
    // Add generation date
    doc.setFontSize(10);
    const currentDate = new Date().toLocaleDateString('ko-KR');
    doc.text(`생성일: ${currentDate}`, 20, 120);
    
    // Save the PDF
    doc.save(`${equipment.name}_설비현황.pdf`);
  };

  const downloadAllEquipmentPDF = () => {
    const doc = new jsPDF();
    
    // Set font for Korean text support
    doc.setFont('helvetica');
    
    // Add title
    doc.setFontSize(20);
    doc.text('전체 설비 현황 보고서', 20, 30);
    
    // Add summary
    doc.setFontSize(12);
    doc.text(`총 설비 수: ${equipmentData.length}대`, 20, 50);
    
    // Add equipment list
    let yPosition = 70;
    equipmentData.forEach((equipment, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${equipment.name}`, 20, yPosition);
      doc.setFontSize(10);
      doc.text(`   위치: ${equipment.location}`, 20, yPosition + 10);
      doc.text(`   점검일: ${equipment.inspectionDate}`, 20, yPosition + 20);
      
      yPosition += 35;
    });
    
    // Add generation date
    doc.setFontSize(10);
    const currentDate = new Date().toLocaleDateString('ko-KR');
    doc.text(`생성일: ${currentDate}`, 20, yPosition + 10);
    
    // Save the PDF
    doc.save('전체_설비현황.pdf');
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">설비 현황</h3>
              <p className="text-sm text-slate-500 font-normal">등록된 설비 목록</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-semibold">
              {equipmentData.length}대
            </Badge>
            <Button 
              size="sm" 
              variant="outline"
              onClick={downloadAllEquipmentPDF}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-1" />
              전체 다운로드
            </Button>
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
      <CardContent className="pt-0">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-sm font-bold text-slate-700 py-4">설비명</TableHead>
                <TableHead className="text-sm font-bold text-slate-700 py-4">설치위치</TableHead>
                <TableHead className="text-sm font-bold text-slate-700 py-4">점검일자</TableHead>
                <TableHead className="text-sm font-bold text-slate-700 py-4 text-center">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentData.map((equipment, index) => (
                <TableRow 
                  key={equipment.id} 
                  className={`hover:bg-slate-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                  }`}
                >
                  <TableCell className="py-4">
                    <div 
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors"
                      onClick={() => onEquipmentNameClick(equipment)}
                    >
                      {equipment.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 py-4">
                    {equipment.location}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      {equipment.inspectionDate}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadEquipmentPDF(equipment)}
                        className="h-8 w-8 p-0 hover:bg-green-100 text-green-600"
                        title="PDF 다운로드"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEquipmentEdit(equipment)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                        title="편집"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {equipmentData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    등록된 설비가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentStatusCard;
