
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, Zap, CheckCircle } from 'lucide-react';

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
      border: 'border-green-300 dark:border-green-700',
      bg: 'hover:bg-green-50 dark:hover:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      icon: 'text-green-400 dark:text-green-500',
      button: 'bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600',
      result: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
    },
    blue: {
      border: 'border-blue-300 dark:border-blue-700',
      bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-400 dark:text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600',
      result: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    }
  };

  const classes = colorClasses[color];

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <FileImage className={`h-5 w-5 ${classes.text}`} />
          {title}
          {extractedText && (
            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
          )}
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
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed ${classes.border} rounded-lg cursor-pointer ${classes.bg} transition-colors`}
          >
            <FileImage className={`h-8 w-8 ${classes.icon} mb-2`} />
            <span className={`text-sm ${classes.text} text-center px-2`}>
              {image ? (
                <div>
                  <div className="font-medium">{image.name}</div>
                  <div className="text-xs opacity-75">
                    {(image.size / 1024 / 1024).toFixed(2)}MB
                  </div>
                </div>
              ) : (
                `${title} 선택`
              )}
            </span>
          </label>
        </div>

        {image && (
          <div className="text-center">
            <img
              src={URL.createObjectURL(image)}
              alt={title}
              className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600 max-h-48 mx-auto shadow-sm"
            />
          </div>
        )}

        <Button 
          onClick={onProcessOCR}
          disabled={isProcessing || !image}
          className={`w-full ${classes.button} text-white font-medium py-2`}
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
          <div className={`${classes.result} p-4 rounded-lg border`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium text-sm">추출된 텍스트 ({extractedText.length}자)</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <pre className="whitespace-pre-wrap text-sm max-h-32 overflow-y-auto text-gray-900 dark:text-gray-100">
                {extractedText}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadCard;
