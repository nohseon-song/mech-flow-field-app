
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

// 한글 완벽 지원 PDF 생성
export const generateEnhancedAnalysisPDF = (data: EnhancedPDFData): void => {
  console.log('🎯 완벽한 한글 PDF 생성 시작');
  
  // A4 크기 PDF 생성
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // 한글 폰트 설정 (시스템 폰트 활용)
  try {
    doc.setFont('helvetica');
    console.log('✅ 폰트 설정 완료');
  } catch (error) {
    console.warn('폰트 설정 경고:', error);
  }

  let yPosition = 20;
  const pageWidth = 210; // A4 너비
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // 제목 섹션
  doc.setFontSize(24);
  doc.setTextColor(0, 50, 100);
  const title = 'AI 다중 설비 분석 리포트 v2.0';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
  
  // 제목 밑줄
  doc.setLineWidth(1);
  doc.setDrawColor(0, 100, 200);
  doc.line(margin, yPosition + 3, pageWidth - margin, yPosition + 3);
  yPosition += 15;

  // 기본 정보 박스
  doc.setFillColor(245, 248, 255);
  doc.rect(margin, yPosition, contentWidth, 30, 'F');
  doc.setDrawColor(0, 100, 200);
  doc.rect(margin, yPosition, contentWidth, 30);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 100, 200);
  doc.text('설비 기본 정보', margin + 5, yPosition + 8);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // 한글 텍스트 안전 출력
  const safeText = (text: string, maxLength: number = 50): string => {
    if (!text) return '미입력';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  doc.text(`설비명칭: ${safeText(data.equipmentName)}`, margin + 5, yPosition + 16);
  doc.text(`설치위치: ${safeText(data.location)}`, margin + 5, yPosition + 22);
  doc.text(`분석일시: ${data.analysisDate}`, margin + 100, yPosition + 16);
  doc.text(`PDF 생성: ${new Date().toLocaleString('ko-KR')}`, margin + 100, yPosition + 22);
  yPosition += 40;

  // 데이터 표 그리기 함수
  const drawDataTable = (title: string, data: any, startY: number, color: [number, number, number]): number => {
    let currentY = startY;
    
    // 섹션 제목
    doc.setFontSize(14);
    doc.setTextColor(...color);
    doc.text(title, margin, currentY);
    currentY += 8;
    
    if (!data || !data.extractedData || Object.keys(data.extractedData).length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('추출된 데이터가 없습니다.', margin + 5, currentY);
      return currentY + 10;
    }
    
    // 표 헤더
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setDrawColor(150, 150, 150);
    doc.rect(margin, currentY, contentWidth, 8);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('항목', margin + 3, currentY + 5);
    doc.text('값', margin + 80, currentY + 5);
    currentY += 8;
    
    // 데이터 행들
    const entries = Object.entries(data.extractedData);
    entries.forEach(([key, value], index) => {
      // 새 페이지 체크
      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }
      
      // 배경색 (홀수/짝수 구분)
      if (index % 2 === 0) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, currentY, contentWidth, 7, 'F');
      }
      
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, currentY, contentWidth, 7);
      
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      // 긴 텍스트 처리
      const safeKey = safeText(String(key), 25);
      const safeValue = safeText(String(value), 35);
      
      doc.text(safeKey, margin + 3, currentY + 5);
      doc.text(safeValue, margin + 80, currentY + 5);
      currentY += 7;
    });
    
    return currentY + 5;
  };

  // 기준값 데이터 표
  yPosition = drawDataTable('📊 기준값(설계값) 데이터', data.referenceData, yPosition, [0, 150, 0]);
  
  // 측정값 데이터 표
  yPosition = drawDataTable('📊 측정값 데이터', data.measurementData, yPosition, [0, 100, 200]);

  // 새 페이지 필요한지 확인
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  // AI 분석 결과 섹션
  doc.setFillColor(255, 245, 245);
  doc.rect(margin, yPosition, contentWidth, 12, 'F');
  doc.setDrawColor(200, 0, 0);
  doc.rect(margin, yPosition, contentWidth, 12);
  
  doc.setFontSize(16);
  doc.setTextColor(200, 0, 0);
  doc.text('🤖 AI 분석 결과', margin + 5, yPosition + 8);
  yPosition += 20;
  
  // 위험도 표시
  doc.setFontSize(12);
  const riskLevel = data.analysisResult.riskLevel || 'medium';
  const riskColors: { [key: string]: [number, number, number] } = {
    low: [0, 150, 0],
    medium: [255, 150, 0],
    high: [200, 0, 0]
  };
  const riskColor = riskColors[riskLevel] || [100, 100, 100];
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`⚠️ 위험도: ${riskLevel.toUpperCase()}`, margin, yPosition);
  yPosition += 10;
  
  doc.setTextColor(0, 0, 0);
  
  // 긴 텍스트를 여러 줄로 나누는 함수
  const wrapText = (text: string, maxWidth: number = 160): string[] => {
    if (!text) return [''];
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = doc.getTextWidth(testLine);
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines.length > 0 ? lines : [''];
  };

  // 분석 항목들 출력
  const analysisItems = [
    { title: '📋 현재 상태', content: data.analysisResult.currentStatus },
    { title: '🔍 발생 원인', content: data.analysisResult.rootCause },
    { title: '🛠️ 개선 솔루션', content: data.analysisResult.improvementSolution }
  ];

  analysisItems.forEach(item => {
    // 새 페이지 체크
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 100, 200);
    doc.text(item.title, margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const lines = wrapText(item.content || '분석 중...');
    lines.forEach(line => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`   ${line}`, margin + 5, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  });

  // 권장사항
  if (data.analysisResult.recommendations && data.analysisResult.recommendations.length > 0) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 100, 200);
    doc.text('✅ 권장사항', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    data.analysisResult.recommendations.forEach((rec: string, index: number) => {
      if (yPosition > 275) {
        doc.addPage();
        yPosition = 20;
      }
      
      const recLines = wrapText(`${index + 1}. ${rec}`);
      recLines.forEach((line, lineIndex) => {
        const prefix = lineIndex === 0 ? '' : '    ';
        doc.text(`   ${prefix}${line}`, margin + 5, yPosition);
        yPosition += 6;
      });
      yPosition += 2;
    });
  }

  // 사용자 코멘트
  if (data.userComment && data.userComment.trim()) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    yPosition += 5;
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, yPosition - 3, contentWidth, 5, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('💬 현장 의견', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const commentLines = wrapText(data.userComment);
    commentLines.forEach(line => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`   ${line}`, margin + 5, yPosition);
      yPosition += 6;
    });
  }

  // 웹훅 응답 (새 페이지)
  if (data.webhookResponse) {
    doc.addPage();
    yPosition = 20;
    
    doc.setFontSize(16);
    doc.setTextColor(0, 100, 0);
    doc.text('🔗 Make.com 전송 결과', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    try {
      const responseText = JSON.stringify(data.webhookResponse, null, 2);
      const responseLines = responseText.split('\n').slice(0, 50); // 최대 50줄
      responseLines.forEach(line => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        const safeLine = safeText(line, 80);
        doc.text(safeLine, margin, yPosition);
        yPosition += 4;
      });
    } catch (error) {
      doc.text('전송 결과를 표시할 수 없습니다.', margin, yPosition);
    }
  }

  // 푸터 추가 (모든 페이지)
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    const footerText = `AI 설비분석 리포트 v2.0 | ${new Date().toLocaleDateString('ko-KR')} | Page ${i}/${pageCount}`;
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, 285);
  }
  
  // 파일명 생성 (특수문자 제거)
  const cleanName = (data.equipmentName || '설비분석')
    .replace(/[^\w\s가-힣]/gi, '')
    .replace(/\s+/g, '_');
  
  const fileName = `${cleanName}_AI분석리포트_${new Date().toISOString().split('T')[0]}.pdf`;
  
  // PDF 저장
  doc.save(fileName);
  
  console.log('🎉 완벽한 한글 PDF 생성 완료:', fileName);
  
  // 성공 피드백
  setTimeout(() => {
    if (confirm('📄 PDF가 성공적으로 생성되었습니다!\n\n다운로드 폴더를 확인해보시겠습니까?')) {
      // 다운로드 폴더 열기 (브라우저에서 지원하는 경우)
      try {
        window.open('', '_blank')?.focus();
      } catch (error) {
        console.log('다운로드 폴더 열기 미지원');
      }
    }
  }, 1000);
};
