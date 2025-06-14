
import jsPDF from 'jspdf';

interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
}

export const downloadEquipmentPDF = (equipment: Equipment) => {
  const doc = new jsPDF();
  
  // 한글 지원을 위한 설정
  doc.setFont('helvetica');
  doc.setLanguage('ko-KR');
  
  // 제목
  doc.setFontSize(18);
  doc.text('Equipment Status Report', 20, 30);
  
  // 설비 정보 (영어로 표시하여 깨짐 방지)
  doc.setFontSize(12);
  doc.text(`Equipment Name: ${equipment.name}`, 20, 60);
  doc.text(`Inspection Date: ${equipment.inspectionDate}`, 20, 80);
  doc.text(`Equipment ID: ${equipment.id}`, 20, 100);
  
  // 한글 부분을 영어 라벨로 변경
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('en-US');
  doc.text(`Generated: ${currentDate}`, 20, 120);
  
  // 파일명도 영어로 변경하여 호환성 향상
  doc.save(`Equipment_${equipment.id}_Report.pdf`);
};

export const downloadAllEquipmentPDF = (equipmentData: Equipment[]) => {
  const doc = new jsPDF();
  
  // 한글 지원을 위한 설정
  doc.setFont('helvetica');
  doc.setLanguage('ko-KR');
  
  // 제목
  doc.setFontSize(18);
  doc.text('All Equipment Status Report', 20, 30);
  
  // 요약
  doc.setFontSize(12);
  doc.text(`Total Equipment Count: ${equipmentData.length}`, 20, 50);
  
  // 설비 목록
  let yPosition = 70;
  equipmentData.forEach((equipment, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${equipment.name}`, 20, yPosition);
    doc.setFontSize(10);
    doc.text(`   Inspection Date: ${equipment.inspectionDate}`, 20, yPosition + 12);
    doc.text(`   Equipment ID: ${equipment.id}`, 20, yPosition + 24);
    
    yPosition += 40;
  });
  
  // 생성일
  doc.setFontSize(10);
  const currentDate = new Date().toLocaleDateString('en-US');
  doc.text(`Generated: ${currentDate}`, 20, yPosition + 10);
  
  // 파일명 영어로 변경
  doc.save('All_Equipment_Report.pdf');
};
