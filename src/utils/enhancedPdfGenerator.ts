
import jsPDF from 'jspdf';

export interface EnhancedPDFData {
  equipmentName: string;
  location: string;
  analysisDate: string;
  referenceData: any;
  measurementData: any;
  analysisResult: any;
  userComment?: string;
  webhookResponse?: any;
}

// 한글 텍스트를 처리하는 향상된 함수
const processKoreanTextEnhanced = (text: string, maxWidth: number = 170, fontSize: number = 10): string[] => {
  if (!text) return [''];
  
  const lines = text.split('\n');
  const processedLines: string[] = [];
  const charactersPerLine = Math.floor(maxWidth / (fontSize * 0.5));
  
  lines.forEach(line => {
    if (line.length <= charactersPerLine) {
      processedLines.push(line);
    } else {
      // 긴 줄을 적절히 분할
      const words = line.split(' ');
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + word).length <= charactersPerLine) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) {
            processedLines.push(currentLine);
          }
          currentLine = word;
        }
      });
      
      if (currentLine) {
        processedLines.push(currentLine);
      }
    }
  });
  
  return processedLines;
};

// 테이블 그리기 함수
const drawTable = (doc: jsPDF, data: any, startY: number, title: string): number => {
  let currentY = startY;
  
  // 테이블 제목
  doc.setFontSize(14);
  doc.setTextColor(0, 100, 200);
  doc.text(title, 20, currentY);
  currentY += 10;
  
  // 테이블 헤더
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.rect(20, currentY, 170, 8);
  doc.setFillColor(230, 230, 230);
  doc.rect(20, currentY, 170, 8, 'F');
  doc.text('항목', 25, currentY + 5);
  doc.text('값', 100, currentY + 5);
  currentY += 8;
  
  // 테이블 데이터
  if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      doc.rect(20, currentY, 170, 8);
      doc.text(String(key), 25, currentY + 5);
      doc.text(String(value), 100, currentY + 5);
      currentY += 8;
    });
  }
  
  return currentY + 5;
};

export const generateEnhancedAnalysisPDF = (data: EnhancedPDFData): void => {
  const doc = new jsPDF();
  
  // 한글 폰트 설정 시도 (기본 폰트 사용)
  doc.setFont('helvetica');
  
  let yPosition = 20;
  
  // 제목
  doc.setFontSize(24);
  doc.setTextColor(0, 50, 100);
  doc.text('AI 다중 설비 분석 리포트 (고도화)', 105, yPosition, { align: 'center' });
  
  // 구분선
  doc.setLineWidth(1);
  doc.setDrawColor(0, 100, 200);
  doc.line(20, yPosition + 5, 190, yPosition + 5);
  yPosition += 20;
  
  // 기본 정보 박스
  doc.setFillColor(245, 248, 255);
  doc.rect(20, yPosition, 170, 25, 'F');
  doc.setDrawColor(0, 100, 200);
  doc.rect(20, yPosition, 170, 25);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 100, 200);
  doc.text('설비 기본 정보', 25, yPosition + 8);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`설비명칭: ${data.equipmentName}`, 25, yPosition + 16);
  doc.text(`설치위치: ${data.location}`, 25, yPosition + 22);
  doc.text(`분석일시: ${data.analysisDate}`, 110, yPosition + 16);
  doc.text(`버전: 2.0.0 (고도화)`, 110, yPosition + 22);
  yPosition += 35;
  
  // 기준값 데이터 테이블
  if (data.referenceData && data.referenceData.extractedData) {
    yPosition = drawTable(doc, data.referenceData.extractedData, yPosition, '📊 기준값(설계값) 데이터');
  }
  
  // 측정값 데이터 테이블
  if (data.measurementData && data.measurementData.extractedData) {
    yPosition = drawTable(doc, data.measurementData.extractedData, yPosition, '📊 측정값 데이터');
  }
  
  // 새 페이지 추가 확인
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }
  
  // AI 분석 결과 섹션
  doc.setFillColor(255, 245, 245);
  doc.rect(20, yPosition, 170, 8, 'F');
  doc.setDrawColor(200, 0, 0);
  doc.rect(20, yPosition, 170, 8);
  
  doc.setFontSize(16);
  doc.setTextColor(200, 0, 0);
  doc.text('🤖 AI 분석 결과', 25, yPosition + 6);
  yPosition += 18;
  
  // 위험도 표시
  doc.setFontSize(12);
  const riskColors = {
    low: [0, 150, 0],
    medium: [255, 150, 0],
    high: [200, 0, 0]
  };
  const riskColor = riskColors[data.analysisResult.riskLevel as keyof typeof riskColors] || [100, 100, 100];
  doc.setTextColor(...riskColor);
  doc.text(`⚠️ 위험도: ${data.analysisResult.riskLevel?.toUpperCase()}`, 25, yPosition);
  yPosition += 10;
  
  doc.setTextColor(0, 0, 0);
  
  // 현재 상태
  if (data.analysisResult.currentStatus) {
    doc.setFontSize(12);
    doc.text('📋 현재 상태:', 25, yPosition);
    yPosition += 8;
    const statusLines = processKoreanTextEnhanced(data.analysisResult.currentStatus, 160, 10);
    statusLines.forEach(line => {
      doc.setFontSize(10);
      doc.text(`   ${line}`, 30, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }
  
  // 발생 원인
  if (data.analysisResult.rootCause) {
    doc.setFontSize(12);
    doc.text('🔍 발생 원인:', 25, yPosition);
    yPosition += 8;
    const causeLines = processKoreanTextEnhanced(data.analysisResult.rootCause, 160, 10);
    causeLines.forEach(line => {
      doc.setFontSize(10);
      doc.text(`   ${line}`, 30, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }
  
  // 개선 솔루션
  if (data.analysisResult.improvementSolution) {
    doc.setFontSize(12);
    doc.text('🛠️ 개선 솔루션:', 25, yPosition);
    yPosition += 8;
    const solutionLines = processKoreanTextEnhanced(data.analysisResult.improvementSolution, 160, 10);
    solutionLines.forEach(line => {
      doc.setFontSize(10);
      doc.text(`   ${line}`, 30, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  }
  
  // 권장사항
  if (data.analysisResult.recommendations && data.analysisResult.recommendations.length > 0) {
    // 새 페이지 필요한지 확인
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.text('✅ 권장사항:', 25, yPosition);
    yPosition += 8;
    
    data.analysisResult.recommendations.forEach((rec: string, index: number) => {
      const recLines = processKoreanTextEnhanced(`${index + 1}. ${rec}`, 155, 10);
      recLines.forEach(line => {
        doc.setFontSize(10);
        doc.text(`   ${line}`, 30, yPosition);
        yPosition += 6;
      });
      yPosition += 2;
    });
  }
  
  // 사용자 코멘트
  if (data.userComment && data.userComment.trim()) {
    yPosition += 10;
    doc.setFillColor(250, 250, 250);
    doc.rect(20, yPosition - 5, 170, 5, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('💬 현장 의견:', 25, yPosition);
    yPosition += 8;
    const commentLines = processKoreanTextEnhanced(data.userComment, 160, 10);
    commentLines.forEach(line => {
      doc.setFontSize(10);
      doc.text(`   ${line}`, 30, yPosition);
      yPosition += 6;
    });
  }
  
  // 웹훅 응답 결과 (새 페이지에)
  if (data.webhookResponse) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 100, 0);
    doc.text('🔗 Make.com 처리 결과', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const responseText = JSON.stringify(data.webhookResponse, null, 2);
    const responseLines = processKoreanTextEnhanced(responseText, 170, 8);
    let responseY = 50;
    responseLines.slice(0, 40).forEach(line => {
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
    doc.text(
      `고도화 AI 분석 리포트 v2.0 | ${new Date().toLocaleDateString('ko-KR')} | Page ${i}/${pageCount}`, 
      105, 285, 
      { align: 'center' }
    );
  }
  
  // PDF 저장
  const fileName = `${data.equipmentName.replace(/[^\w\s가-힣]/gi, '')}_AI고도화분석_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  console.log('향상된 PDF 생성 완료:', fileName);
};
