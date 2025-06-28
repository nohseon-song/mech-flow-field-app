
import jsPDF from 'jspdf';

export interface PDFData {
  equipmentName: string;
  location: string;
  analysisDate: string;
  referenceData: string;
  measurementData: string;
  analysisResult: any;
  webhookResponse?: any;
}

export const generateAnalysisPDF = (data: PDFData): void => {
  const doc = new jsPDF();
  
  // 한글 폰트 설정 (기본 폰트 사용)
  doc.setFont('helvetica');
  
  // 제목
  doc.setFontSize(20);
  doc.text('AI 다중 설비 분석 리포트', 20, 30);
  
  // 설비 정보
  doc.setFontSize(14);
  doc.text('설비 정보', 20, 50);
  doc.setFontSize(12);
  doc.text(`설비명칭: ${data.equipmentName}`, 20, 65);
  doc.text(`설치위치: ${data.location}`, 20, 75);
  doc.text(`분석일시: ${data.analysisDate}`, 20, 85);
  
  // 분석 결과
  doc.setFontSize(14);
  doc.text('분석 결과', 20, 105);
  doc.setFontSize(12);
  
  let yPosition = 120;
  
  if (data.analysisResult.currentStatus) {
    doc.text(`현재 상태: ${data.analysisResult.currentStatus}`, 20, yPosition);
    yPosition += 15;
  }
  
  if (data.analysisResult.rootCause) {
    doc.text(`발생 원인: ${data.analysisResult.rootCause}`, 20, yPosition);
    yPosition += 15;
  }
  
  if (data.analysisResult.improvementSolution) {
    doc.text(`개선 솔루션: ${data.analysisResult.improvementSolution}`, 20, yPosition);
    yPosition += 15;
  }
  
  // 권장사항
  if (data.analysisResult.recommendations && data.analysisResult.recommendations.length > 0) {
    doc.text('권장사항:', 20, yPosition + 10);
    yPosition += 25;
    
    data.analysisResult.recommendations.forEach((rec: string, index: number) => {
      doc.text(`${index + 1}. ${rec}`, 25, yPosition);
      yPosition += 10;
    });
  }
  
  // 웹훅 응답 결과 (있는 경우)
  if (data.webhookResponse) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Make.com 처리 결과', 20, 30);
    doc.setFontSize(12);
    doc.text(JSON.stringify(data.webhookResponse, null, 2), 20, 50);
  }
  
  // PDF 저장
  const fileName = `${data.equipmentName}_분석리포트_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
