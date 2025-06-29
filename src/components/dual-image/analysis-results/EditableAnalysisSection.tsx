
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { AdvancedAnalysisResult } from '@/utils/advancedAnalysis';

interface EditableAnalysisSectionProps {
  analysisResult: AdvancedAnalysisResult;
  editableResult: AdvancedAnalysisResult | null;
  isEditing: boolean;
  onStartEditing: () => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onUpdateField: (field: keyof AdvancedAnalysisResult, value: any) => void;
  onUpdateRecommendation: (index: number, value: string) => void;
  onAddRecommendation: () => void;
  onRemoveRecommendation: (index: number) => void;
}

const EditableAnalysisSection = ({
  analysisResult,
  editableResult,
  isEditing,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onUpdateField,
  onUpdateRecommendation,
  onAddRecommendation,
  onRemoveRecommendation
}: EditableAnalysisSectionProps) => {
  const currentResult = isEditing ? editableResult : analysisResult;
  
  if (!currentResult) return null;

  return (
    <div className="space-y-4">
      {/* 편집 제어 버튼 */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
          🤖 AI 분석 결과 {isEditing && <span className="text-orange-500">(편집 모드)</span>}
        </h4>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={onStartEditing}
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              편집
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={onSaveEditing}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-1" />
                저장
              </Button>
              <Button
                onClick={onCancelEditing}
                size="sm"
                variant="outline"
                className="text-gray-600"
              >
                <X className="h-4 w-4 mr-1" />
                취소
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* 현재 상태 */}
          <Card>
            <CardContent className="p-4">
              <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">📋 현재 상태</h5>
              {isEditing ? (
                <Textarea
                  value={currentResult.currentStatus}
                  onChange={(e) => onUpdateField('currentStatus', e.target.value)}
                  className="min-h-[80px] text-sm"
                  placeholder="현재 상태를 입력하세요..."
                />
              ) : (
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {currentResult.currentStatus}
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* 발생 원인 */}
          <Card>
            <CardContent className="p-4">
              <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">🔍 발생 원인</h5>
              {isEditing ? (
                <Textarea
                  value={currentResult.rootCause}
                  onChange={(e) => onUpdateField('rootCause', e.target.value)}
                  className="min-h-[80px] text-sm"
                  placeholder="발생 원인을 입력하세요..."
                />
              ) : (
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {currentResult.rootCause}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* 개선 솔루션 */}
          <Card>
            <CardContent className="p-4">
              <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">🛠️ 개선 솔루션</h5>
              {isEditing ? (
                <Textarea
                  value={currentResult.improvementSolution}
                  onChange={(e) => onUpdateField('improvementSolution', e.target.value)}
                  className="min-h-[80px] text-sm"
                  placeholder="개선 솔루션을 입력하세요..."
                />
              ) : (
                <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  {currentResult.improvementSolution}
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* 위험도 */}
          <Card>
            <CardContent className="p-4">
              <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">⚠️ 위험도</h5>
              {isEditing ? (
                <select
                  value={currentResult.riskLevel}
                  onChange={(e) => onUpdateField('riskLevel', e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                >
                  <option value="low">낮음 (Low)</option>
                  <option value="medium">보통 (Medium)</option>
                  <option value="high">높음 (High)</option>
                </select>
              ) : (
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  currentResult.riskLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                  currentResult.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  {currentResult.riskLevel?.toUpperCase()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 권장사항 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300">✅ 권장사항</h5>
            {isEditing && (
              <Button
                onClick={onAddRecommendation}
                size="sm"
                variant="outline"
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                추가
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {currentResult.recommendations?.map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-1 text-sm flex-shrink-0">{index + 1}.</span>
                {isEditing ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={rec}
                      onChange={(e) => onUpdateRecommendation(index, e.target.value)}
                      className="text-sm"
                      placeholder="권장사항을 입력하세요..."
                    />
                    <Button
                      onClick={() => onRemoveRecommendation(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 p-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed flex-1">
                    {rec}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditableAnalysisSection;
