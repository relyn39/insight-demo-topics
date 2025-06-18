
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InsightCard } from './insights/InsightCard';
import { GenerateInsightsButton } from './insights/GenerateInsightsButton';
import { Insight } from '@/types/insights';
import { useDemoMode } from '@/hooks/useDemoMode';

const fetchInsights = async (): Promise<Insight[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', null])
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching insights:', error);
    return [];
  }

  return data || [];
};

export const InsightsPanel = () => {
  const { isDemoMode, getDemoInsights } = useDemoMode();
  
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['insights'],
    queryFn: isDemoMode ? () => Promise.resolve(getDemoInsights()) : fetchInsights,
  });

  const activeInsights = insights.filter(insight => 
    !insight.status || insight.status === 'active'
  );

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Insights Recentes {isDemoMode && <Badge variant="secondary">DEMO</Badge>}
          </CardTitle>
          <GenerateInsightsButton />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Carregando insights...</span>
          </div>
        ) : activeInsights.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-muted-foreground mb-2">Nenhum insight disponível</h3>
            <p className="text-sm text-muted-foreground">
              {isDemoMode ? 
                "Os insights aparecerão aqui conforme novos feedbacks forem analisados." :
                "Configure suas integrações e aguarde a análise dos feedbacks para ver insights aqui."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
