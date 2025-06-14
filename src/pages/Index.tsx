import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEquipmentData } from '@/hooks/useEquipmentData';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/Header';
import EquipmentDashboard from '@/components/EquipmentDashboard';
import AIFeaturesCard from '@/components/AIFeaturesCard';
import EquipmentStatusCard from '@/components/EquipmentStatusCard';
import EquipmentRegistrationDialog from '@/components/EquipmentRegistrationDialog';
import EquipmentDetailsDialog from '@/components/EquipmentDetailsDialog';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { equipmentData, handleEquipmentSave, handleEquipmentDelete } = useEquipmentData();
  
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginForm 
        onToggleMode={() => setIsSignupMode(!isSignupMode)}
        isSignupMode={isSignupMode}
      />
    );
  }

  const handleEquipmentSaveWrapper = (equipmentInfo: any) => {
    if (editingEquipment) {
      handleEquipmentSave({ ...equipmentInfo, id: editingEquipment.id });
    } else {
      handleEquipmentSave(equipmentInfo);
    }
    setIsRegistrationOpen(false);
    setEditingEquipment(null);
  };

  const handleEquipmentEdit = (equipment: any) => {
    setEditingEquipment(equipment);
    setIsRegistrationOpen(true);
  };

  const handleEquipmentNameClick = (equipment: any) => {
    setSelectedEquipment(equipment);
    setIsDetailsOpen(true);
  };

  const handleDetailsEdit = (equipment: any) => {
    setEditingEquipment(equipment);
    setIsRegistrationOpen(true);
  };

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setIsRegistrationOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header onAdminClick={() => navigate('/admin')} />

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <EquipmentDashboard equipmentData={equipmentData} />
        <AIFeaturesCard />
        <EquipmentStatusCard
          equipmentData={equipmentData}
          onEquipmentNameClick={handleEquipmentNameClick}
          onEquipmentEdit={handleEquipmentEdit}
          onAddEquipment={handleAddEquipment}
        />
      </div>

      <EquipmentRegistrationDialog
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        onSave={handleEquipmentSaveWrapper}
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
