
import jsPDF from 'jspdf';

interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
}

// 한글을 위한 HTML 템플릿 생성
const createHTMLTemplate = (equipment: Equipment, isAll: boolean = false, equipmentList?: Equipment[]) => {
  if (isAll && equipmentList) {
    return `
      <div style="font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif; padding: 40px; background: white; width: 800px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 28px; color: #333; margin: 0; font-weight: bold;">전체 설비 현황 보고서</h1>
          <div style="height: 2px; background: #ddd; margin: 20px 0;"></div>
          <p style="font-size: 16px; color: #666; margin: 10px 0;">총 설비 수: ${equipmentList.length}대</p>
        </div>
        
        <div style="margin-bottom: 40px;">
          ${equipmentList.map((eq, index) => `
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px; background: #fafafa;">
              <h3 style="font-size: 18px; color: #333; margin: 0 0 15px 0; font-weight: bold;">${index + 1}. ${eq.name}</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <strong style="color: #555;">설비 ID:</strong>
                  <span style="margin-left: 10px; color: #333;">${eq.id}</span>
                </div>
                <div>
                  <strong style="color: #555;">점검일자:</strong>
                  <span style="margin-left: 10px; color: #333;">${eq.inspectionDate}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #888;">생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
        </div>
      </div>
    `;
  }

  return `
    <div style="font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif; padding: 40px; background: white; width: 800px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 28px; color: #333; margin: 0; font-weight: bold;">설비 현황 보고서</h1>
        <div style="height: 2px; background: #ddd; margin: 20px 0;"></div>
      </div>
      
      <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
        <div style="margin-bottom: 25px;">
          <h3 style="font-size: 16px; color: #555; margin: 0 0 8px 0; font-weight: normal;">설비명</h3>
          <p style="font-size: 20px; color: #333; margin: 0; font-weight: bold;">${equipment.name}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
          <div>
            <h3 style="font-size: 16px; color: #555; margin: 0 0 8px 0; font-weight: normal;">설비 ID</h3>
            <p style="font-size: 18px; color: #333; margin: 0; font-weight: bold;">${equipment.id}</p>
          </div>
          <div>
            <h3 style="font-size: 16px; color: #555; margin: 0 0 8px 0; font-weight: normal;">점검일자</h3>
            <p style="font-size: 18px; color: #333; margin: 0; font-weight: bold;">${equipment.inspectionDate}</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #888;">생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
      </div>
    </div>
  `;
};

// HTML을 이미지로 변환하여 PDF에 추가
const htmlToPDF = async (htmlContent: string, filename: string) => {
  return new Promise<void>((resolve) => {
    // 임시 div 생성
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);

    // html2canvas를 동적으로 import
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(tempDiv.firstElementChild as HTMLElement, {
        width: 800,
        height: tempDiv.scrollHeight,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 190;
        const pageHeight = 290;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        // 첫 페이지에 이미지 추가
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // 페이지가 넘어가는 경우 처리
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 10;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // 임시 div 제거
        document.body.removeChild(tempDiv);
        
        pdf.save(filename);
        resolve();
      }).catch(() => {
        document.body.removeChild(tempDiv);
        resolve();
      });
    }).catch(() => {
      document.body.removeChild(tempDiv);
      resolve();
    });
  });
};

export const downloadEquipmentPDF = async (equipment: Equipment) => {
  const htmlContent = createHTMLTemplate(equipment);
  const sanitizedName = equipment.name.replace(/[^\w\s가-힣]/gi, '');
  const filename = `${sanitizedName}_설비현황_${equipment.id}.pdf`;
  
  await htmlToPDF(htmlContent, filename);
};

export const downloadAllEquipmentPDF = async (equipmentData: Equipment[]) => {
  const htmlContent = createHTMLTemplate({} as Equipment, true, equipmentData);
  const filename = '전체_설비현황_보고서.pdf';
  
  await htmlToPDF(htmlContent, filename);
};
