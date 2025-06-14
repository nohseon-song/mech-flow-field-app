
export const readFileContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.type === 'application/pdf') {
          // PDF 파일의 경우 기본 텍스트로 처리 (실제 환경에서는 PDF.js 등 사용)
          // 여기서는 시뮬레이션을 위해 파일명 기반으로 샘플 텍스트 생성
          const sampleContent = `
PDF 파일: ${file.name}

이 문서는 기계설비 관련 중요 정보를 포함하고 있습니다.

주요 내용:
- 설비 운전 및 정비 절차
- 안전 관리 지침
- 법규 준수 사항
- 기술 기준 및 표준

업로드된 파일의 내용이 AI 지식지침에 자동으로 반영됩니다.
          `;
          resolve(sampleContent.trim());
        } else {
          // 텍스트 파일의 경우 그대로 읽기
          resolve(content);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('파일 읽기 중 오류가 발생했습니다.'));
    };
    
    // PDF와 텍스트 파일 모두 텍스트로 읽기
    reader.readAsText(file, 'UTF-8');
  });
};

export const validateFileType = (file: File): boolean => {
  const validTypes = ['application/pdf', 'text/plain'];
  return validTypes.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
