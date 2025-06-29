
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, Zap, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { type ParsedEquipmentData } from '@/utils/textDataParser';

interface EnhancedImageUploadCardProps {
  title: string;
  image: File | null;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessOCR: () => void;
  isProcessing: boolean;
  parsedData: ParsedEquipmentData | null;
  inputId: string;
  color: 'green' | 'blue';
}

const EnhancedImageUploadCard = ({
  title,
  image,
  onImageSelect,
  onProcessOCR,
  isProcessing,
  parsedData,
  inputId,
  color
}: EnhancedImageUploadCardProps) => {
  const [showRawText, setShowRawText] = React.useState(false);
  
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
          {parsedData && (
            <div className="flex items-center gap-2 ml-auto">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">
                {Object.keys(parsedData.extractedData).length}개 데이터 추출
              </span>
            </div>
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
                `${title} 선택 (권장: 고해상도 이미지)`
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
              AI 텍스트 추출 중...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              고도화 텍스트 추출하기
            </>
          )}
        </Button>

        {parsedData && (
          <div className={`${classes.result} p-4 rounded-lg border space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-sm">Key:Value 추출 완료</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRawText(!showRawText)}
                className="text-xs"
              >
                {showRawText ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                {showRawText ? '원시텍스트 숨기기' : '원시텍스트 보기'}
              </Button>
            </div>
            
            {/* Key:Value 구조화된 데이터 표시 */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                📊 구조화된 데이터:
              </div>
              {Object.keys(parsedData.extractedData).length > 0 ? (
                <div className="space-y-1">
                  {Object.entries(parsedData.extractedData).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-1 px-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{key}:</span>
                      <span className="text-gray-900 dark:text-gray-100">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  구조화된 데이터를 찾을 수 없습니다. 원시 텍스트를 확인해주세요.
                </div>
              )}
            </div>
            
            {/* 원시 텍스트 (선택적 표시) */}
            {showRawText && (
              <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  📄 원시 텍스트 ({parsedData.rawText.length}자):
                </div>
                <pre className="whitespace-pre-wrap text-xs max-h-32 overflow-y-auto text-gray-700 dark:text-gray-300">
                  {parsedData.rawText}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedImageUploadCard;
