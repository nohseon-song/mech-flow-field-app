
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, Zap } from 'lucide-react';

interface ImageUploadCardProps {
  title: string;
  image: File | null;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessOCR: () => void;
  isProcessing: boolean;
  extractedText: string;
  inputId: string;
  color: 'green' | 'blue';
}

const ImageUploadCard = ({
  title,
  image,
  onImageSelect,
  onProcessOCR,
  isProcessing,
  extractedText,
  inputId,
  color
}: ImageUploadCardProps) => {
  const colorClasses = {
    green: {
      border: 'border-green-300',
      bg: 'hover:bg-green-50',
      text: 'text-green-600',
      icon: 'text-green-400',
      button: 'bg-green-600 hover:bg-green-700',
      result: 'bg-green-50 text-green-700'
    },
    blue: {
      border: 'border-blue-300',
      bg: 'hover:bg-blue-50',
      text: 'text-blue-600',
      icon: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700',
      result: 'bg-blue-50 text-blue-700'
    }
  };

  const classes = colorClasses[color];

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`text-lg flex items-center gap-2`}>
          <FileImage className={`h-5 w-5 ${classes.text}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={onImageSelect}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed ${classes.border} rounded-lg cursor-pointer ${classes.bg}`}
          >
            <FileImage className={`h-8 w-8 ${classes.icon} mb-2`} />
            <span className={`text-sm ${classes.text}`}>
              {image ? image.name : `${title} 선택`}
            </span>
          </label>
        </div>

        {image && (
          <div className="text-center">
            <img
              src={URL.createObjectURL(image)}
              alt={title}
              className="max-w-full h-auto rounded-lg border max-h-48 mx-auto"
            />
          </div>
        )}

        <Button 
          onClick={onProcessOCR}
          disabled={isProcessing || !image}
          className={`w-full ${classes.button}`}
        >
          {isProcessing ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-spin" />
              처리 중...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              텍스트 추출하기
            </>
          )}
        </Button>

        {extractedText && (
          <div className={`${classes.result} p-3 rounded-lg`}>
            <pre className="whitespace-pre-wrap text-sm max-h-32 overflow-y-auto">
              {extractedText}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadCard;
