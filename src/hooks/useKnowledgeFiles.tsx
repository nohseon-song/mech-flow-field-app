
import { useState, useEffect } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadDate: Date;
}

export const useKnowledgeFiles = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    // 저장된 파일 목록 불러오기
    const savedFiles = localStorage.getItem('knowledge-files');
    if (savedFiles) {
      const files = JSON.parse(savedFiles);
      // Date 객체 복원
      const restoredFiles = files.map((file: any) => ({
        ...file,
        uploadDate: new Date(file.uploadDate)
      }));
      setUploadedFiles(restoredFiles);
    }
  }, []);

  const saveFiles = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    localStorage.setItem('knowledge-files', JSON.stringify(files));
  };

  const generateEnhancedGuideline = (baseGuideline: string, files: UploadedFile[]): string => {
    if (files.length === 0) return baseGuideline;

    const fileContents = files.map(file => file.content).join('\n\n');
    
    return `${baseGuideline}

**업로드된 지식 파일 기반 맞춤 지침**:

${fileContents.substring(0, 2000)}${fileContents.length > 2000 ? '...' : ''}

**파일 기반 적용 원칙**:
- 업로드된 문서의 내용을 우선적으로 참조
- 조직의 고유한 규정과 절차 준수
- 실제 사례와 경험 데이터 활용
- 지속적인 지식 업데이트 반영

**참조 파일 목록**:
${files.map(file => `- ${file.name} (${new Date(file.uploadDate).toLocaleDateString()})`).join('\n')}`;
  };

  const getEnhancedKnowledgeGuideline = (baseGuideline: string): string => {
    return generateEnhancedGuideline(baseGuideline, uploadedFiles);
  };

  return {
    uploadedFiles,
    saveFiles,
    getEnhancedKnowledgeGuideline
  };
};
