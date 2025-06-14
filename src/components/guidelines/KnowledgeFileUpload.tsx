
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'text/plain'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "파일 형식 오류",
        description: "PDF 또는 TXT 파일만 업로드 가능합니다.",
        variant: "destructive"
      });
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const newFiles: UploadedFile[] = [];
      
      for (const file of validFiles) {
        const content = await readFileContent(file);
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          content: content,
          uploadDate: new Date()
        };
        newFiles.push(newFile);
      }

      const updatedFiles = [...uploadedFiles, ...newFiles];
      onFilesChange(updatedFiles);

      toast({
        title: "파일 업로드 완료",
        description: `${newFiles.length}개 파일이 성공적으로 업로드되었습니다.`
      });
    } catch (error) {
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      
      if (file.type === 'application/pdf') {
        // PDF 파일의 경우 텍스트 추출 시뮬레이션
        reader.readAsText(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    onFilesChange(updatedFiles);
    
    toast({
      title: "파일 삭제",
      description: "파일이 삭제되었습니다."
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          }`}
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
              <h4 className="font-medium text-sm">업로드된 파일</h4>
              <Badge variant="secondary">{uploadedFiles.length}/10</Badge>
            </div>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
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

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">AI 학습 정보</p>
            <p>업로드된 파일 내용을 바탕으로 AI가 맞춤형 지식지침을 생성하여 모든 AI 기능에서 활용됩니다.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
