import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/Home';
import AI from './pages/AI';
import ImageAnalysis from './pages/ImageAnalysis';
import GuidelineSettings from './pages/GuidelineSettings';
import NameplateOCR from './pages/NameplateOCR';
import { Toaster } from '@/components/ui/toaster';
import AIFeatures from './pages/AIFeatures';
import DualImageOCR from './pages/DualImageOCR';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai" element={<AIFeatures />} />
            <Route path="/image-analysis" element={<ImageAnalysis />} />
            <Route path="/guideline-settings" element={<GuidelineSettings />} />
            <Route path="/ai/nameplate-ocr" element={<NameplateOCR />} />
            <Route path="/ai/dual-image-ocr" element={<DualImageOCR />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
