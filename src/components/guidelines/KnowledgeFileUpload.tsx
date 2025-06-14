
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { readFileContent, validateFileType, formatFileSize } from '@/utils/fileUtils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string;
  uploadDate: Date;
}

interface KnowledgeFileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
}

export const KnowledgeFileUpload = ({ onFilesChange, uploadedFiles }: KnowledgeFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = async (files: File[]) => {
    if (uploadedFiles.length + files.length > 10) {
      toast({
        title: "업로드 제한",
        description: "최대 10개 파일까지만 업로드 가능합니다.",
        variant: "destructive"
      });
      return;
    }

    // 파일 타입 검증
    const validFiles = files.filter(file => validateFileType(file));
    const invalidFiles = files.filter(file => !validateFileType(file));

    if (invalidFiles.length > 0) {
      toast({
        title: "지원하지 않는 파일 형식",
        description: `${invalidFiles.map(f => f.name).join(', ')} - PDF 또는 TXT 파일만 업로드 가능합니다.`,
        variant: "destructive"
      });
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const newFiles: UploadedFile[] = [];
      
      for (const file of validFiles) {
        try {
          console.log(`파일 처리 시작: ${file.name} (${file.type})`);
          const content = await readFileContent(file);
          
          if (!content || content.trim().length === 0) {
            throw new Error('파일 내용을 읽을 수 없습니다.');
          }

          const newFile: UploadedFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            content: content,
            uploadDate: new Date()
          };
          
          newFiles.push(newFile);
          console.log(`파일 처리 완료: ${file.name}`);
        } catch (fileError) {
          console.error(`파일 처리 실패 (${file.name}):`, fileError);
          toast({
            title: `${file.name} 업로드 실패`,
            description: "파일을 읽는 중 오류가 발생했습니다.",
            variant: "destructive"
          });
        }
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...uploadedFiles, ...newFiles];
        onFilesChange(updatedFiles);

        toast({
          title: "파일 업로드 성공",
          description: `${newFiles.length}개 파일이 성공적으로 업로드되어 지식지침에 반영되었습니다.`,
          variant: "default"
        });

        // 업로드 성공 시 추가 안내
        if (newFiles.some(f => f.type === 'application/pdf')) {
          toast({
            title: "PDF 파일 처리 완료",
            description: "PDF 내용이 지식지침에 자동으로 반영됩니다. AI 기능에서 활용 가능합니다.",
            variant: "default"
          });
        }
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 예기치 않은 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    onFilesChange(updatedFiles);
    
    toast({
      title: "파일 삭제 완료",
      description: "파일이 삭제되고 지식지침에서 제외되었습니다."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5 text-purple-600" />
          지식 파일 업로드
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            PDF 또는 TXT 파일을 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-xs text-gray-500 mb-4">
            최대 10개 파일, 각 파일 최대 10MB
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || uploadedFiles.length >= 10}
          >
            {isUploading ? '업로드 중...' : '파일 선택'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.txt"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                업로드된 파일 (지식지침 반영됨)
              </h4>
              <Badge variant="secondary">{uploadedFiles.length}/10</Badge>
            </div>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Info */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">지식지침 자동 반영</p>
            <p>업로드된 파일 내용이 자동으로 지식지침에 반영되어 모든 AI 기능(챗봇, 메모변환, 규정도우미)에서 활용됩니다. PDF 파일의 텍스트 내용도 자동으로 추출되어 적용됩니다.</p>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="text-xs text-green-700">
              <p className="font-medium mb-1">활성화된 지식 파일: {uploadedFiles.length}개</p>
              <p>현재 업로드된 파일들이 AI 응답에 활용되고 있습니다. 새로운 파일을 추가하거나 기존 파일을 삭제하면 즉시 반영됩니다.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
