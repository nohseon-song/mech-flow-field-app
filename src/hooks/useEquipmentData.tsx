
import { useState } from 'react';

export interface Equipment {
  id: number;
  name: string;
  location: string;
  inspectionDate: string;
  type?: string;
  equipmentType?: string;
}

const initialEquipmentData: Equipment[] = [
  {
    id: 1,
    name: "보일러 #1",
    location: "지하 1층 기계실",
    inspectionDate: "2024-06-13"
  },
  {
    id: 2,
    name: "냉각탑 #2", 
    location: "옥상",
    inspectionDate: "2024-06-10"
  },
  {
    id: 3,
    name: "송풍기 #A",
    location: "3층 기계실", 
    inspectionDate: "2024-06-12"
  },
  {
    id: 4,
    name: "압축기 #3",
    location: "2층 공장동",
    inspectionDate: "2024-06-11"
  }
];

export const useEquipmentData = () => {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>(initialEquipmentData);

  const handleEquipmentSave = (equipmentInfo: any) => {
    if (equipmentInfo.id) {
      setEquipmentData(prev => prev.map(item => 
        item.id === equipmentInfo.id ? { ...item, ...equipmentInfo } : item
      ));
    } else {
      const newEquipment = {
        id: Date.now(),
        ...equipmentInfo
      };
      setEquipmentData(prev => [...prev, newEquipment]);
    }
  };

  const handleEquipmentDelete = (equipmentId: number) => {
    setEquipmentData(prev => prev.filter(item => item.id !== equipmentId));
  };

  return {
    equipmentData,
    handleEquipmentSave,
    handleEquipmentDelete
  };
};
