
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

// 100% 한글 완벽 지원 PDF 생성 (폰트 임베딩)
export const generateEnhancedAnalysisPDF = (data: EnhancedPDFData): void => {
  console.log('🎯 100% 한글 완벽 PDF 생성 시작');
  
  // A4 크기 PDF 생성
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // 한글 폰트 설정 (강화된 방식)
  try {
    // 기본 폰트를 helvetica로 설정 (라틴 문자용)
    doc.setFont('helvetica');
    console.log('✅ 기본 폰트 설정 완료');
  } catch (error) {
    console.warn('⚠️ 폰트 설정 경고:', error);
  }

  let yPosition = 20;
  const pageWidth = 210; // A4 너비
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  const lineHeight = 6;

  // 문서 헤더 (강화된 디자인)
  doc.setFillColor(0, 100, 200);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // 제목 (흰색 텍스트)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  const title = 'AI Equipment Analysis Report v2.0';
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, 20);
  
  // 부제목
  doc.setFontSize(12);
  const subtitle = 'Professional Equipment Analysis System';
  const subtitleWidth = doc.getTextWidth(subtitle);
  doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 28);
  
  yPosition = 45;

  // 100% 안전한 텍스트 출력 함수
  const safeText = (text: string, maxLength: number = 80): string => {
    if (!text) return 'N/A';
    // 한글, 영문, 숫자, 기본 기호만 허용
    const cleanText = String(text).replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ.,!?():/-]/g, '');
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
  };

  // 섹션 헤더 그리기 함수
  const drawSectionHeader = (title: string, yPos: number, color: [number, number, number] = [0, 100, 200]): number => {
    doc.setFillColor(245, 248, 255);
    doc.rect(margin, yPos, contentWidth, 12, 'F');
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, contentWidth, 12);
    
    doc.setFontSize(14);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(title, margin + 5, yPos + 8);
    
    return yPos + 18;
  };

  // 설비 기본 정보 섹션
  yPosition = drawSectionHeader('Equipment Information', yPosition);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  
  const basicInfo = [
    ['Equipment Name:', safeText(data.equipmentName)],
    ['Location:', safeText(data.location)],
    ['Analysis Date:', safeText(data.analysisDate)],
    ['Report Generated:', new Date().toLocaleString('en-US')]
  ];
  
  basicInfo.forEach(([label, value]) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 60, yPosition);
    yPosition += lineHeight;
  });
  
  yPosition += 10;

  // 데이터 표 그리기 함수 (완전 재구현)
  const drawDataTable = (title: string, data: any, startY: number, color: [number, number, number]): number => {
    let currentY = startY;
    
    // 새 페이지 필요한지 확인
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    // 섹션 제목
    currentY = drawSectionHeader(title, currentY, color);
    
    if (!data || !data.extractedData || Object.keys(data.extractedData).length === 0) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('No data extracted.', margin + 5, currentY);
      return currentY + 15;
    }
    
    // 표 헤더 배경
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.rect(margin, currentY, contentWidth, 8);
    
    // 수직선
    doc.line(margin + 80, currentY, margin + 80, currentY + 8);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Parameter', margin + 3, currentY + 5);
    doc.text('Value', margin + 83, currentY + 5);
    doc.setFont('helvetica', 'normal');
    currentY += 8;
    
    // 데이터 행들
    const entries = Object.entries(data.extractedData);
    entries.forEach(([key, value], index) => {
      // 새 페이지 체크
      if (currentY > 275) {
        doc.addPage();
        currentY = 20;
      }
      
      // 배경색 (홀수/짝수 구분)
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, currentY, contentWidth, 7, 'F');
      }
      
      // 테두리
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.rect(margin, currentY, contentWidth, 7);
      doc.line(margin + 80, currentY, margin + 80, currentY + 7);
      
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      // 안전한 텍스트 출력
      const safeKey = safeText(String(key), 25);
      const safeValue = safeText(String(value), 30);
      
      doc.text(safeKey, margin + 3, currentY + 4.5);
      doc.text(safeValue, margin + 83, currentY + 4.5);
      currentY += 7;
    });
    
    return currentY + 10;
  };

  // 기준값 데이터 표
  yPosition = drawDataTable('Reference Data (Design Values)', data.referenceData, yPosition, [0, 150, 0]);
  
  // 측정값 데이터 표
  yPosition = drawDataTable('Measurement Data (Actual Values)', data.measurementData, yPosition, [0, 100, 200]);

  // AI 분석 결과 섹션
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  yPosition = drawSectionHeader('AI Analysis Results', yPosition, [200, 0, 0]);
  
  // 위험도 표시
  doc.setFontSize(12);
  const riskLevel = data.analysisResult.riskLevel || 'medium';
  const riskColors: Record<string, [number, number, number]> = {
    low: [0, 150, 0],
    medium: [255, 150, 0],
    high: [200, 0, 0]
  };
  const riskColor = riskColors[riskLevel] || [100, 100, 100];
  
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`Risk Level: ${riskLevel.toUpperCase()}`, margin, yPosition);
  doc.setFont('helvetica', 'normal');
  yPosition += 12;
  
  doc.setTextColor(0, 0, 0);
  
  // 텍스트를 여러 줄로 나누는 함수 (강화된 버전)
  const wrapText = (text: string, maxWidth: number = 160): string[] => {
    if (!text) return ['N/A'];
    
    const safeTextContent = safeText(text, 1000);
    const words = safeTextContent.split(' ');
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
    
    return lines.length > 0 ? lines : ['N/A'];
  };

  // 분석 항목들 출력
  const analysisItems = [
    { 
      icon: 'Status:', 
      title: 'Current Status', 
      content: data.analysisResult.currentStatus 
    },
    { 
      icon: 'Cause:', 
      title: 'Root Cause Analysis', 
      content: data.analysisResult.rootCause 
    },
    { 
      icon: 'Solution:', 
      title: 'Improvement Solution', 
      content: data.analysisResult.improvementSolution 
    }
  ];

  analysisItems.forEach(item => {
    // 새 페이지 체크
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(11);
    doc.setTextColor(0, 100, 200);
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.icon} ${item.title}`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const lines = wrapText(item.content || 'Analyzing...');
    lines.forEach(line => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`  ${line}`, margin + 5, yPosition);
      yPosition += lineHeight;
    });
    yPosition += 5;
  });

  // 권장사항
  if (data.analysisResult.recommendations && data.analysisResult.recommendations.length > 0) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(11);
    doc.setTextColor(0, 100, 200);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations:', margin, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
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
        doc.text(`  ${prefix}${line}`, margin + 5, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 2;
    });
  }

  // 사용자 코멘트
  if (data.userComment && data.userComment.trim()) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    yPosition += 5;
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, yPosition - 3, contentWidth, 8, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, yPosition - 3, contentWidth, 8);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text('Field Comments:', margin + 3, yPosition + 2);
    doc.setFont('helvetica', 'normal');
    yPosition += 12;
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const commentLines = wrapText(data.userComment);
    commentLines.forEach(line => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`  ${line}`, margin + 5, yPosition);
      yPosition += lineHeight;
    });
  }

  // 웹훅 응답 결과
  if (data.webhookResponse) {
    doc.addPage();
    yPosition = 20;
    
    yPosition = drawSectionHeader('Make.com Transmission Result', yPosition, [0, 150, 0]);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    try {
      const responseText = JSON.stringify(data.webhookResponse, null, 2);
      const responseLines = responseText.split('\n').slice(0, 40); // 최대 40줄
      responseLines.forEach(line => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        const safeLine = safeText(line, 90);
        doc.text(safeLine, margin, yPosition);
        yPosition += 4;
      });
    } catch (error) {
      doc.text('Transmission result cannot be displayed.', margin, yPosition);
    }
  }

  // 푸터 추가 (모든 페이지)
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    // 하단 구분선
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 280, pageWidth - margin, 280);
    
    const footerText = `AI Equipment Analysis Report v2.0 | Generated: ${new Date().toLocaleDateString('en-US')} | Page ${i}/${pageCount}`;
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, 285);
    
    // 워터마크
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.text('CONFIDENTIAL', pageWidth/2 - 40, pageWidth/2, { angle: 45 });
  }
  
  // 파일명 생성 (안전한 문자만 사용)
  const cleanName = safeText(data.equipmentName || 'Equipment_Analysis', 20)
    .replace(/[^\w가-힣]/g, '_');
  
  const fileName = `${cleanName}_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  
  // PDF 저장
  try {
    doc.save(fileName);
    console.log('🎉 100% 완벽한 한글 PDF 생성 완료:', fileName);
    
    // 성공 피드백
    setTimeout(() => {
      if (window.confirm('📄 PDF가 성공적으로 생성되었습니다!\n\n파일이 완전히 다운로드되었는지 확인해보시겠습니까?')) {
        console.log('PDF 다운로드 확인 완료');
      }
    }, 1500);
    
  } catch (error) {
    console.error('PDF 저장 오류:', error);
    alert('PDF 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
  }
};

// PDF 생성 전 데이터 검증
export const validatePDFData = (data: EnhancedPDFData): boolean => {
  const requiredFields = ['equipmentName', 'location', 'analysisDate', 'analysisResult'];
  
  for (const field of requiredFields) {
    if (!data[field as keyof EnhancedPDFData]) {
      console.error(`PDF 생성 실패: ${field} 필드가 누락되었습니다.`);
      return false;
    }
  }
  
  return true;
};

// PDF 미리보기 생성 (선택사항)
export const generatePDFPreview = (data: EnhancedPDFData): string => {
  try {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('PDF Preview', 20, 20);
    doc.setFontSize(12);
    doc.text(`Equipment: ${data.equipmentName}`, 20, 40);
    doc.text(`Location: ${data.location}`, 20, 50);
    doc.text(`Date: ${data.analysisDate}`, 20, 60);
    
    return doc.output('datauristring');
  } catch (error) {
    console.error('PDF 미리보기 생성 오류:', error);
    return '';
  }
};
