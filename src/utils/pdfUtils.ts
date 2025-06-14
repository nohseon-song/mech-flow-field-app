
import jsPDF from 'jspdf';

interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
}

export const downloadEquipmentPDF = (equipment: Equipment) => {
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

export const downloadAllEquipmentPDF = (equipmentData: Equipment[]) => {
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
