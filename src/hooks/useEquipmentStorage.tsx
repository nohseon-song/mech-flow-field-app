
import { useState, useEffect } from 'react';

export interface EquipmentData {
  equipmentName: string;
  location: string;
  lastAnalysis?: any;
  analysisHistory: any[];
}

const STORAGE_KEY = 'equipment-data';

export const useEquipmentStorage = () => {
  const [equipmentData, setEquipmentData] = useState<EquipmentData>({
    equipmentName: '',
    location: '',
    analysisHistory: []
  });

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setEquipmentData(parsed);
      } catch (error) {
        console.error('Failed to parse saved equipment data:', error);
      }
    }
  }, []);

  // 데이터 저장
  const saveEquipmentData = (data: Partial<EquipmentData>) => {
    const newData = { ...equipmentData, ...data };
    setEquipmentData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  // 분석 결과 히스토리에 추가
  const addAnalysisToHistory = (analysis: any) => {
    const newHistory = [...equipmentData.analysisHistory, analysis];
    const updatedData = {
      ...equipmentData,
      lastAnalysis: analysis,
      analysisHistory: newHistory
    };
    setEquipmentData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  };

  return {
    equipmentData,
    saveEquipmentData,
    addAnalysisToHistory
  };
};
