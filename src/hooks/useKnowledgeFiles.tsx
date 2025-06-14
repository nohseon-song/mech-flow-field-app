
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

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
      try {
        const files = JSON.parse(savedFiles);
        // Date 객체 복원
        const restoredFiles = files.map((file: any) => ({
          ...file,
          uploadDate: new Date(file.uploadDate)
        }));
        setUploadedFiles(restoredFiles);
        console.log(`지식 파일 로드 완료: ${restoredFiles.length}개`);
      } catch (error) {
        console.error('지식 파일 로드 오류:', error);
        setUploadedFiles([]);
      }
    }
  }, []);

  const saveFiles = (files: UploadedFile[]) => {
    try {
      setUploadedFiles(files);
      localStorage.setItem('knowledge-files', JSON.stringify(files));
      console.log(`지식 파일 저장 완료: ${files.length}개`);
      
      // 파일이 추가되었을 때 사용자에게 안내
      if (files.length > 0) {
        console.log('업로드된 파일들이 지식지침에 자동 반영됨');
      }
    } catch (error) {
      console.error('지식 파일 저장 오류:', error);
      toast({
        title: "저장 실패",
        description: "파일 정보 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const generateEnhancedGuideline = (baseGuideline: string, files: UploadedFile[]): string => {
    if (files.length === 0) return baseGuideline;

    // 파일 내용을 합쳐서 지식 베이스 생성
    const knowledgeBase = files.map(file => {
      return `[${file.name}]\n${file.content}`;
    }).join('\n\n--- 파일 구분선 ---\n\n');
    
    // 기본 지침과 파일 기반 지식을 결합
    const enhancedGuideline = `${baseGuideline}

**업로드된 지식 파일 기반 맞춤 지침**:

${knowledgeBase.substring(0, 3000)}${knowledgeBase.length > 3000 ? '\n\n... (내용이 길어 일부만 표시됨)' : ''}

**파일 기반 적용 원칙**:
- 업로드된 문서의 내용을 우선적으로 참조하여 답변
- 조직의 고유한 규정과 절차를 반영한 맞춤형 응답 제공
- 실제 사례와 경험 데이터를 활용한 구체적인 조치 방안 제시
- 최신 업로드된 지식을 바탕으로 한 정확한 정보 제공

**현재 활성화된 지식 파일 목록** (${files.length}개):
${files.map(file => `• ${file.name} (${file.type === 'application/pdf' ? 'PDF' : 'TXT'}) - ${new Date(file.uploadDate).toLocaleDateString('ko-KR')} 업로드`).join('\n')}

**중요**: 위 파일들의 내용이 모든 AI 응답에 반영되어 보다 정확하고 맞춤형 답변을 제공합니다.`;

    return enhancedGuideline;
  };

  const getEnhancedKnowledgeGuideline = (baseGuideline: string): string => {
    const enhanced = generateEnhancedGuideline(baseGuideline, uploadedFiles);
    console.log(`지식지침 생성 완료 (파일 ${uploadedFiles.length}개 반영)`);
    return enhanced;
  };

  return {
    uploadedFiles,
    saveFiles,
    getEnhancedKnowledgeGuideline
  };
};
