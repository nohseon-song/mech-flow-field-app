
import jsPDF from 'jspdf';

export interface PDFData {
  equipmentName: string;
  location: string;
  analysisDate: string;
  referenceData: string;
  measurementData: string;
  analysisResult: any;
  userComment?: string;
  webhookResponse?: any;
}

// 한글 텍스트를 처리하는 함수
const processKoreanText = (text: string, maxWidth: number = 170): string[] => {
  const lines = text.split('\n');
  const processedLines: string[] = [];
  
  lines.forEach(line => {
    if (line.length > maxWidth / 4) { // 대략적인 문자 수 계산
      const words = line.split(' ');
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + word).length > maxWidth / 4) {
          if (currentLine.trim()) {
            processedLines.push(currentLine.trim());
          }
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      });
      
      if (currentLine.trim()) {
        processedLines.push(currentLine.trim());
      }
    } else {
      processedLines.push(line);
    }
  });
  
  return processedLines;
};

export const generateAnalysisPDF = (data: PDFData): void => {
  const doc = new jsPDF();
  
  // 한글 폰트 설정 - helvetica로 설정 (기본 폰트)
  doc.setFont('helvetica');
  
  let yPosition = 20;
  
  // 제목
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('AI 다중 설비 분석 리포트', 105, yPosition, { align: 'center' });
  
  // 구분선
  doc.setLineWidth(0.5);
  doc.line(20, yPosition + 5, 190, yPosition + 5);
  yPosition += 20;
  
  // 설비 정보 섹션
  doc.setFontSize(16);
  doc.setTextColor(0, 100, 200);
  doc.text('설비 정보', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`설비명칭: ${data.equipmentName}`, 25, yPosition);
  yPosition += 8;
  doc.text(`설치위치: ${data.location}`, 25, yPosition);
  yPosition += 8;
  doc.text(`분석일시: ${data.analysisDate}`, 25, yPosition);
  yPosition += 15;
  
  // 기준값 데이터 섹션
  doc.setFontSize(16);
  doc.setTextColor(0, 150, 0);
  doc.text('기준값(설계값) 데이터', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const referenceLines = processKoreanText(data.referenceData);
  referenceLines.slice(0, 10).forEach(line => { // 최대 10줄만 표시
    doc.text(line, 25, yPosition);
    yPosition += 5;
  });
  yPosition += 10;
  
  // 측정값 데이터 섹션
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 200);
  doc.text('측정값 데이터', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const measurementLines = processKoreanText(data.measurementData);
  measurementLines.slice(0, 10).forEach(line => { // 최대 10줄만 표시
    doc.text(line, 25, yPosition);
    yPosition += 5;
  });
  yPosition += 10;
  
  // 새 페이지 추가 (내용이 많을 경우)
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  // AI 분석 결과 섹션
  doc.setFontSize(16);
  doc.setTextColor(200, 0, 0);
  doc.text('AI 분석 결과', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  if (data.analysisResult.currentStatus) {
    doc.text('현재 상태:', 25, yPosition);
    yPosition += 8;
    const statusLines = processKoreanText(data.analysisResult.currentStatus);
    statusLines.forEach(line => {
      doc.setFontSize(10);
      doc.text(`  ${line}`, 30, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }
  
  if (data.analysisResult.rootCause) {
    doc.setFontSize(12);
    doc.text('발생 원인:', 25, yPosition);
    yPosition += 8;
    const causeLines = processKoreanText(data.analysisResult.rootCause);
    causeLines.forEach(line => {
      doc.setFontSize(10);
      doc.text(`  ${line}`, 30, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }
  
  if (data.analysisResult.improvementSolution) {
    doc.setFontSize(12);
    doc.text('개선 솔루션:', 25, yPosition);
    yPosition += 8;
    const solutionLines = processKoreanText(data.analysisResult.improvementSolution);
    solutionLines.forEach(line => {
      doc.setFontSize(10);
      doc.text(`  ${line}`, 30, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }
  
  // 권장사항
  if (data.analysisResult.recommendations && data.analysisResult.recommendations.length > 0) {
    doc.setFontSize(12);
    doc.text('권장사항:', 25, yPosition);
    yPosition += 8;
    
    data.analysisResult.recommendations.forEach((rec: string, index: number) => {
      const recLines = processKoreanText(`${index + 1}. ${rec}`);
      recLines.forEach(line => {
        doc.setFontSize(10);
        doc.text(`  ${line}`, 30, yPosition);
        yPosition += 6;
      });
      yPosition += 2;
    });
  }
  
  // 사용자 코멘트
  if (data.userComment && data.userComment.trim()) {
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('현장 의견:', 25, yPosition);
    yPosition += 8;
    const commentLines = processKoreanText(data.userComment);
    commentLines.forEach(line => {
      doc.setFontSize(10);
      doc.text(`  ${line}`, 30, yPosition);
      yPosition += 6;
    });
  }
  
  // 웹훅 응답 결과 (있는 경우)
  if (data.webhookResponse) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 100, 0);
    doc.text('Make.com 처리 결과', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const responseText = JSON.stringify(data.webhookResponse, null, 2);
    const responseLines = processKoreanText(responseText);
    let responseY = 50;
    responseLines.slice(0, 30).forEach(line => { // 최대 30줄만 표시
      doc.text(line, 25, responseY);
      responseY += 5;
    });
  }
  
  // 푸터
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleDateString('ko-KR')} - Page ${i}/${pageCount}`, 105, 285, { align: 'center' });
  }
  
  // PDF 저장
  const fileName = `${data.equipmentName.replace(/[^\w\s가-힣]/gi, '')}_AI분석리포트_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
