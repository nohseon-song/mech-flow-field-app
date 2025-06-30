
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import DualImageOCR from "./pages/DualImageOCR";
import EnhancedDualImageOCR from "./pages/EnhancedDualImageOCR";
import AIChatbot from "./pages/AIChatbot";
import EnhancedAIChatbot from "./pages/EnhancedAIChatbot";
import EquipmentInspection from "./pages/EquipmentInspection";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">페이지를 불러오는 중...</p>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ai/dual-image-ocr" element={
                  <ErrorBoundary>
                    <DualImageOCR />
                  </ErrorBoundary>
                } />
                <Route path="/ai/enhanced-dual-image-ocr" element={
                  <ErrorBoundary>
                    <EnhancedDualImageOCR />
                  </ErrorBoundary>
                } />
                <Route path="/ai/chatbot" element={
                  <ErrorBoundary>
                    <AIChatbot />
                  </ErrorBoundary>
                } />
                <Route path="/ai/enhanced-chatbot" element={
                  <ErrorBoundary>
                    <EnhancedAIChatbot />
                  </ErrorBoundary>
                } />
                <Route path="/equipment-inspection" element={
                  <ErrorBoundary>
                    <EquipmentInspection />
                  </ErrorBoundary>
                } />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
