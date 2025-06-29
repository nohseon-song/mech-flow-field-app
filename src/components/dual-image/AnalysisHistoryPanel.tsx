
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { History, Download, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useEquipmentStorage } from '@/hooks/useEquipmentStorage';
import { generateEnhancedAnalysisPDF } from '@/utils/enhancedPdfGenerator';
import { toast } from '@/hooks/use-toast';

interface AnalysisHistoryPanelProps {
  onLoadHistory?: (historyItem: any) => void;
}

const AnalysisHistoryPanel = ({ onLoadHistory }: AnalysisHistoryPanelProps) => {
  const { equipmentData, saveEquipmentData } = useEquipmentStorage();
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const analysisHistory = equipmentData.analysisHistory || [];

  const handleViewHistory = (historyItem: any) => {
    setSelectedHistory(historyItem);
    setIsDialogOpen(true);
  };

  const handleLoadHistory = (historyItem: any) => {
    if (onLoadHistory) {
      onLoadHistory(historyItem);
      toast({
        title: "이력 불러오기 완료",
        description: "선택한 분석 결과가 현재 화면에 로드되었습니다."
      });
    }
  };

  const handleDownloadHistoryPDF = (historyItem: any) => {
    const pdfData = {
      equipmentName: historyItem.equipmentName || '미지정',
      location: historyItem.location || '미지정',
      analysisDate: new Date(historyItem.timestamp).toLocaleString('ko-KR'),
      referenceData: { extractedData: historyItem.referenceData || {} },
      measurementData: { extractedData: historyItem.measurementData || {} },
      analysisResult: historyItem,
      userComment: historyItem.userComment || ''
    };

    generateEnhancedAnalysisPDF(pdfData);
  };

  const handleDeleteHistory = (index: number) => {
    const confirmation = window.confirm('이 분석 이력을 삭제하시겠습니까?');
    if (confirmation) {
      const newHistory = analysisHistory.filter((_, i) => i !== index);
      saveEquipmentData({ ...equipmentData, analysisHistory: newHistory });
      toast({
        title: "이력 삭제 완료",
        description: "선택한 분석 이력이 삭제되었습니다."
      });
    }
  };

  const handleClearAllHistory = () => {
    const confirmation = window.confirm('모든 분석 이력을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (confirmation) {
      saveEquipmentData({ ...equipmentData, analysisHistory: [] });
      toast({
        title: "전체 이력 삭제 완료",
        description: "모든 분석 이력이 삭제되었습니다."
      });
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between text-gray-900 dark:text-white">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            분석 이력 관리 ({analysisHistory.length}건)
          </div>
          {analysisHistory.length > 0 && (
            <Button
              onClick={handleClearAllHistory}
              size="sm"
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              전체 삭제
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analysisHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>아직 분석 이력이 없습니다.</p>
            <p className="text-sm">AI 분석을 수행하면 이력이 자동으로 저장됩니다.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {analysisHistory.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.riskLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        item.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      }`}>
                        {item.riskLevel?.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.equipmentName || '미지정'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      📍 {item.location || '미지정'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      🕒 {new Date(item.timestamp).toLocaleString('ko-KR')}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {item.currentStatus?.substring(0, 100)}...
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-1 ml-4">
                    <Button
                      onClick={() => handleViewHistory(item)}
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:bg-blue-50 p-1"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleLoadHistory(item)}
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:bg-green-50 p-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleDownloadHistoryPDF(item)}
                      size="sm"
                      variant="ghost"
                      className="text-purple-600 hover:bg-purple-50 p-1"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteHistory(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 p-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 상세 보기 다이얼로그 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                분석 이력 상세보기
              </DialogTitle>
            </DialogHeader>
            
            {selectedHistory && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">설비명칭:</span>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedHistory.equipmentName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">설치위치:</span>
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedHistory.location}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">분석일시:</span>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {new Date(selectedHistory.timestamp).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">위험도:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedHistory.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                      selectedHistory.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedHistory.riskLevel?.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">현재 상태:</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 p-3 rounded border">
                      {selectedHistory.currentStatus}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">발생 원인:</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 p-3 rounded border">
                      {selectedHistory.rootCause}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">개선 솔루션:</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 p-3 rounded border">
                      {selectedHistory.improvementSolution}
                    </p>
                  </div>
                  
                  {selectedHistory.recommendations && selectedHistory.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">권장사항:</h4>
                      <ul className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 p-3 rounded border space-y-1">
                        {selectedHistory.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 font-bold">{index + 1}.</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleLoadHistory(selectedHistory)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    현재 화면에 불러오기
                  </Button>
                  <Button
                    onClick={() => handleDownloadHistoryPDF(selectedHistory)}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF 다운로드
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AnalysisHistoryPanel;
