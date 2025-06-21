
import React, { useState } from 'react';
import { MetricsOverview } from './MetricsOverview';
import { SentimentAnalysis } from './SentimentAnalysis';
import { LatestItems } from './LatestItems';
import { NaturalLanguageQuery } from './NaturalLanguageQuery';
import { InsightsPanel } from './InsightsPanel';
import { TrendChart } from './TrendChart';
import Roadmap from './Roadmap';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { syncIntegrations } from '@/services/integrationService';
import { useSearchParams } from 'react-router-dom';

export const FeedbackDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // Adicionar logs de auditoria para o dashboard
  React.useEffect(() => {
    console.log('📋 [AUDIT] FeedbackDashboard mounted:', {
      activeTab,
      timestamp: new Date().toISOString()
    });
  }, [activeTab]);

  const handleUpdate = async () => {
    console.log('🔄 [AUDIT] Starting manual data update:', new Date().toISOString());
    setIsUpdating(true);
    toast({
      title: "Atualizando dados...",
      description: "Buscando as informações mais recentes das suas integrações.",
    });

    try {
      await syncIntegrations(queryClient);
      console.log('🔄 [AUDIT] Manual data update succeeded');

      toast({
        title: "Sucesso!",
        description: "Os dados foram atualizados com sucesso.",
      });

    } catch (error: any) {
      console.error('🔄 [AUDIT] Manual data update failed:', error);
      if (error.message === "Nenhuma integração ativa para sincronizar.") {
        toast({
          title: "Nenhuma integração ativa",
          description: "Não há integrações ativas para sincronizar.",
        });
      } else {
        toast({
          title: "Erro ao atualizar",
          description: error.message || "Não foi possível buscar os dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTabChange = (value: string) => {
    console.log('📋 [AUDIT] Tab changed:', { from: activeTab, to: value });
    if (value === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Feedback</h1>
          <p className="text-muted-foreground mt-1">Análise inteligente de feedback dos usuários em tempo real</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar Dados'
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <MetricsOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NaturalLanguageQuery />
            <InsightsPanel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TrendChart />
            </div>
            <SentimentAnalysis />
          </div>

          <LatestItems />
        </TabsContent>
        
        <TabsContent value="roadmap" className="space-y-6">
          <Roadmap />
        </TabsContent>
      </Tabs>
    </div>
  );
};
