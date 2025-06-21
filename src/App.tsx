
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthGuard } from "@/components/AuthGuard";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Se for erro de autenticação, não tentar novamente
        if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
          console.log('🔄 [QUERY CLIENT] Auth error detected, not retrying');
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false, // Evitar refetch desnecessário
    },
  },
});

function App() {
  useEffect(() => {
    // Configurar automaticamente o Gemini 2.0 Flash-Lite se necessário
    setupGeminiConfig();
    
    console.log('🚀 [APP] Application initialized:', new Date().toISOString());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/" 
                element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/feedback" 
                element={
                  <AuthGuard>
                    <Navigate to="/feedback-report" replace />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/feedback/:source" 
                element={
                  <AuthGuard>
                    <FeedbackReport />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/feedback-report" 
                element={
                  <AuthGuard>
                    <FeedbackReport />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <AuthGuard>
                    <Settings />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/settings/integrations" 
                element={
                  <AuthGuard>
                    <SettingsIntegrations />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/settings/ai" 
                element={
                  <AuthGuard>
                    <SettingsAi />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/settings/users" 
                element={
                  <AuthGuard>
                    <SettingsUsers />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/topics-analysis" 
                element={
                  <AuthGuard>
                    <TopicsAnalysis />
                  </AuthGuard>
                } 
              />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
