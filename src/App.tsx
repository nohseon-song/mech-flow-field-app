
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import AIFeatures from "./pages/AIFeatures";
import MemoConverter from "./pages/MemoConverter";
import NameplateOCR from "./pages/NameplateOCR";
import PhotoAnalysis from "./pages/PhotoAnalysis";
import RegulationHelper from "./pages/RegulationHelper";
import AIChatbot from "./pages/AIChatbot";
import GuidelineSettings from "./pages/GuidelineSettings";
import MobileWorkflow from "./pages/MobileWorkflow";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/workflow" element={<MobileWorkflow />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/ai" element={<AIFeatures />} />
              <Route path="/ai/memo-converter" element={<MemoConverter />} />
              <Route path="/ai/nameplate-ocr" element={<NameplateOCR />} />
              <Route path="/ai/photo-analysis" element={<PhotoAnalysis />} />
              <Route path="/ai/regulation-helper" element={<RegulationHelper />} />
              <Route path="/ai/chatbot" element={<AIChatbot />} />
              <Route path="/ai/guidelines" element={<GuidelineSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
