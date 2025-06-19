
import { supabase } from '@/integrations/supabase/client';
import { Insight } from '@/types/insights';

export const fetchInsights = async (timeFilter: 'all' | 'lastMonth' = 'lastMonth'): Promise<Insight[]> => {
  // Verificar se o modo demonstração está ativo
  const isDemoMode = localStorage.getItem('feedback-hub-demo-mode') === 'true';
  
  if (isDemoMode) {
    // Retornar dados de demonstração
    return [
      {
        id: 'insight-1',
        user_id: 'demo-user',
        type: 'trend',
        severity: 'error',
        title: 'Aumento de 40% em bugs de pagamento',
        description: 'Identificamos um padrão crescente de problemas relacionados ao sistema de pagamento nas últimas duas semanas. Isso pode estar impactando significativamente as conversões.',
        action: 'Priorizar correção do módulo de pagamento e implementar testes automatizados mais robustos.',
        tags: ['pagamento', 'bugs', 'conversao'],
        created_at: '2024-01-15T08:00:00Z'
      },
      {
        id: 'insight-2',
        user_id: 'demo-user',
        type: 'opportunity',
        severity: 'success',
        title: 'Sentimento positivo sobre relatórios',
        description: 'Os usuários estão muito satisfeitos com a nova funcionalidade de relatórios automatizados, mencionando ganhos significativos de produtividade.',
        action: 'Considerar expandir as funcionalidades de relatórios com base no feedback positivo.',
        tags: ['relatorios', 'produtividade', 'satisfacao'],
        created_at: '2024-01-14T12:00:00Z'
      },
      {
        id: 'insight-3',
        user_id: 'demo-user',
        type: 'other',
        severity: 'info',
        title: 'Demanda por melhorias na interface',
        description: 'Vários usuários sugerem melhorias na interface do dashboard, focando em maior destaque para botões principais e cores mais vibrantes.',
        action: 'Agendar sessão de design para revisar e atualizar a interface do dashboard.',
        tags: ['ui', 'dashboard', 'design'],
        created_at: '2024-01-13T15:30:00Z'
      }
    ];
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");

  let query = supabase
    .from('insights')
    .select(`
      *,
      insight_feedbacks!inner(
        feedback_id,
        feedbacks(id, title, source, created_at)
      )
    `)
    .eq('user_id', user.id);

  // Aplicar filtro de tempo - sempre usar lastMonth como padrão
  if (timeFilter === 'lastMonth') {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    query = query.gte('created_at', oneMonthAgo.toISOString());
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const generateInsights = async () => {
    // Verificar se o modo demonstração está ativo
    const isDemoMode = localStorage.getItem('feedback-hub-demo-mode') === 'true';
    
    if (isDemoMode) {
        // Simular geração de insights em modo demo
        return { message: 'Insights de demonstração gerados com sucesso!' };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado.");

    const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { user_id: user.id }
    });

    if (error) {
        throw new Error(`Falha ao gerar insights: ${error.message}`);
    }
    
    if (data?.message) {
      console.log(data.message)
    }

    return data;
};

export const deleteInsight = async (insightId: string) => {
  const { error } = await supabase
    .from('insights')
    .delete()
    .eq('id', insightId);
  
  if (error) throw error;
};
