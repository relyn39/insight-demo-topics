
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import FeedbackReport from "./pages/FeedbackReport";
import Settings from "./pages/Settings";
import SettingsIntegrations from "./pages/SettingsIntegrations";
import SettingsAi from "./pages/SettingsAi";
import SettingsUsers from "./pages/SettingsUsers";
import TopicsAnalysis from "./pages/TopicsAnalysis";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import { setupGeminiConfig } from "./utils/setupGeminiConfig";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Configurar automaticamente o Gemini 2.0 Flash-Lite se necessário
    setupGeminiConfig();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen w-full">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/feedback-report" element={<FeedbackReport />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/integrations" element={<SettingsIntegrations />} />
                <Route path="/settings/ai" element={<SettingsAi />} />
                <Route path="/settings/users" element={<SettingsUsers />} />
                <Route path="/topics-analysis" element={<TopicsAnalysis />} />
                <Route path="/update-password" element={<UpdatePasswordPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
