
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
}

// 한글 폰트 Base64 데이터 (간단한 대체 방법)
const addKoreanFont = (doc: jsPDF) => {
  // 기본 폰트 설정
  doc.setFont('helvetica');
};

export const downloadEquipmentPDF = (equipment: Equipment) => {
  const doc = new jsPDF();
  
  addKoreanFont(doc);
  
  // 제목
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('설비 현황 보고서', 20, 30);
  
  // 구분선
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 40, 190, 40);
  
  // 설비 정보
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  
  const infoY = 60;
  const lineHeight = 20;
  
  // 설비명을 영어와 한글로 모두 표시
  doc.text('설비명 (Equipment Name):', 20, infoY);
  doc.setTextColor(40, 40, 40);
  doc.text(equipment.name, 20, infoY + 10);
  
  doc.setTextColor(60, 60, 60);
  doc.text('점검일자 (Inspection Date):', 20, infoY + lineHeight * 1.5);
  doc.setTextColor(40, 40, 40);
  doc.text(equipment.inspectionDate, 20, infoY + lineHeight * 1.5 + 10);
  
  doc.setTextColor(60, 60, 60);
  doc.text('설비 ID (Equipment ID):', 20, infoY + lineHeight * 3);
  doc.setTextColor(40, 40, 40);
  doc.text(equipment.id.toString(), 20, infoY + lineHeight * 3 + 10);
  
  // 하단 정보
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  doc.text(`생성일: ${currentDate}`, 20, 200);
  
  // 파일명을 한글과 영어 조합으로 변경
  const sanitizedName = equipment.name.replace(/[^\w\s가-힣]/gi, '');
  doc.save(`${sanitizedName}_설비현황_${equipment.id}.pdf`);
};

export const downloadAllEquipmentPDF = (equipmentData: Equipment[]) => {
  const doc = new jsPDF();
  
  addKoreanFont(doc);
  
  // 제목
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('전체 설비 현황 보고서', 20, 30);
  
  // 구분선
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 40, 190, 40);
  
  // 요약 정보
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(`총 설비 수: ${equipmentData.length}대`, 20, 60);
  
  // 설비 목록
  let yPosition = 80;
  const pageHeight = 280;
  
  equipmentData.forEach((equipment, index) => {
    // 페이지 넘김 체크
    if (yPosition > pageHeight) {
      doc.addPage();
      yPosition = 30;
    }
    
    // 설비 번호와 이름
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`${index + 1}. ${equipment.name}`, 20, yPosition);
    
    // 상세 정보
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`   점검일자: ${equipment.inspectionDate}`, 25, yPosition + 10);
    doc.text(`   설비 ID: ${equipment.id}`, 25, yPosition + 20);
    
    // 구분선
    doc.setLineWidth(0.3);
    doc.setDrawColor(230, 230, 230);
    doc.line(20, yPosition + 25, 190, yPosition + 25);
    
    yPosition += 35;
  });
  
  // 생성일
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  doc.text(`생성일: ${currentDate}`, 20, yPosition + 15);
  
  doc.save('전체_설비현황_보고서.pdf');
};
