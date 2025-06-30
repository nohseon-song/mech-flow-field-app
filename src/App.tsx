
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DualImageOCR from "./pages/DualImageOCR";
import EnhancedDualImageOCR from "./pages/EnhancedDualImageOCR";
import AIChatbot from "./pages/AIChatbot";
import EnhancedAIChatbot from "./pages/EnhancedAIChatbot";
import EquipmentInspection from "./pages/EquipmentInspection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai/dual-image-ocr" element={<DualImageOCR />} />
          <Route path="/ai/enhanced-dual-image-ocr" element={<EnhancedDualImageOCR />} />
          <Route path="/ai/chatbot" element={<AIChatbot />} />
          <Route path="/ai/enhanced-chatbot" element={<EnhancedAIChatbot />} />
          <Route path="/equipment-inspection" element={<EquipmentInspection />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
