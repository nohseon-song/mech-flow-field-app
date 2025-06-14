
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AIFeatures from "./pages/AIFeatures";
import MemoConverter from "./pages/MemoConverter";
import NameplateOCR from "./pages/NameplateOCR";
import PhotoAnalysis from "./pages/PhotoAnalysis";
import RegulationHelper from "./pages/RegulationHelper";
import AIChatbot from "./pages/AIChatbot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai" element={<AIFeatures />} />
          <Route path="/ai/memo-converter" element={<MemoConverter />} />
          <Route path="/ai/nameplate-ocr" element={<NameplateOCR />} />
          <Route path="/ai/photo-analysis" element={<PhotoAnalysis />} />
          <Route path="/ai/regulation-helper" element={<RegulationHelper />} />
          <Route path="/ai/chatbot" element={<AIChatbot />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
