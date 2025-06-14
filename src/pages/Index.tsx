
import React, { useState } from 'react';
import Header from '@/components/Header';
import AIFeaturesCard from '@/components/AIFeaturesCard';
import EquipmentStatusCard from '@/components/EquipmentStatusCard';
import RecentActivityCard from '@/components/RecentActivityCard';
import EquipmentRegistrationDialog from '@/components/EquipmentRegistrationDialog';
import EquipmentDetailsDialog from '@/components/EquipmentDetailsDialog';

const Index = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [equipmentData, setEquipmentData] = useState([
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
  ]);

  const handleEquipmentSave = (equipmentInfo) => {
    if (editingEquipment) {
      setEquipmentData(prev => prev.map(item => 
        item.id === editingEquipment.id ? { ...item, ...equipmentInfo } : item
      ));
    } else {
      const newEquipment = {
        id: Date.now(),
        ...equipmentInfo
      };
      setEquipmentData(prev => [...prev, newEquipment]);
    }
    setIsRegistrationOpen(false);
    setEditingEquipment(null);
  };

  const handleEquipmentEdit = (equipment) => {
    setEditingEquipment(equipment);
    setIsRegistrationOpen(true);
  };

  const handleEquipmentDelete = (equipmentId) => {
    setEquipmentData(prev => prev.filter(item => item.id !== equipmentId));
  };

  const handleEquipmentNameClick = (equipment) => {
    setSelectedEquipment(equipment);
    setIsDetailsOpen(true);
  };

  const handleDetailsEdit = (equipment) => {
    setEditingEquipment(equipment);
    setIsRegistrationOpen(true);
  };

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setIsRegistrationOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <AIFeaturesCard />

        <EquipmentStatusCard
          equipmentData={equipmentData}
          onEquipmentNameClick={handleEquipmentNameClick}
          onEquipmentEdit={handleEquipmentEdit}
          onAddEquipment={handleAddEquipment}
        />

        <RecentActivityCard />
      </div>

      <EquipmentRegistrationDialog
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        onSave={handleEquipmentSave}
        onDelete={handleEquipmentDelete}
        editingEquipment={editingEquipment}
      />

      <EquipmentDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        equipment={selectedEquipment}
        onEdit={handleDetailsEdit}
      />
    </div>
  );
};

export default Index;
