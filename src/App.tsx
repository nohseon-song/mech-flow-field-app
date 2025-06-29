
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import Index from './pages/Index';
import GuidelineSettings from './pages/GuidelineSettings';
import NameplateOCR from './pages/NameplateOCR';
import { Toaster } from '@/components/ui/toaster';
import AIFeatures from './pages/AIFeatures';
import DualImageOCR from './pages/DualImageOCR';
import AIChatbot from './pages/AIChatbot';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ai" element={<AIFeatures />} />
                <Route path="/ai/chatbot" element={<AIChatbot />} />
                <Route path="/guideline-settings" element={<GuidelineSettings />} />
                <Route path="/ai/nameplate-ocr" element={<NameplateOCR />} />
                <Route path="/ai/dual-image-ocr" element={<DualImageOCR />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
