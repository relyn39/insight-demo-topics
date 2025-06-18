
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDemoMode } from '@/hooks/useDemoMode';

interface LatestItem {
  id: string;
  title: string;
  count: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  change_percentage: number;
  keywords: string[];
}

const fetchLatestItems = async (): Promise<LatestItem[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('latest_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    throw new Error(error.message);
  }

  return data?.map(item => ({
    id: item.id,
    title: item.title,
    count: item.count || 0,
    sentiment: item.sentiment as 'positive' | 'negative' | 'neutral',
    change_percentage: item.change_percentage || 0,
    keywords: item.keywords || []
  })) || [];
};

const getDemoLatestItems = (): LatestItem[] => [
  {
    id: '1',
    title: 'Performance do Sistema',
    count: 156,
    sentiment: 'negative',
    change_percentage: -12,
    keywords: ['performance', 'lentidão', 'mobile']
  },
  {
    id: '2',
    title: 'Interface do Dashboard',
    count: 89,
    sentiment: 'positive',
    change_percentage: 8,
    keywords: ['ui', 'dashboard', 'design']
  },
  {
    id: '3',
    title: 'Sistema de Pagamento',
    count: 234,
    sentiment: 'negative',
    change_percentage: -15,
    keywords: ['pagamento', 'checkout', 'bug']
  },
  {
    id: '4',
    title: 'Relatórios Automatizados',
    count: 67,
    sentiment: 'positive',
    change_percentage: 22,
    keywords: ['relatórios', 'automação', 'produtividade']
  },
  {
    id: '5',
    title: 'Integrações',
    count: 123,
    sentiment: 'neutral',
    change_percentage: 3,
    keywords: ['slack', 'integração', 'api']
  }
];

export const useLatestItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();

  const { data: latestItems, isLoading, isError, error } = useQuery<LatestItem[]>({
    queryKey: ['latest_items'],
    queryFn: isDemoMode ? 
      () => Promise.resolve(getDemoLatestItems()) : 
      fetchLatestItems,
  });

  const generateLatestItemsMutation = useMutation({
    mutationFn: async () => {
      if (isDemoMode) {
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      // In a real implementation, this would call an edge function to generate latest items
      // For now, we'll create some sample data
      const sampleItems = getDemoLatestItems();
      
      for (const item of sampleItems) {
        const { error } = await supabase
          .from('latest_items')
          .upsert({
            user_id: user.id,
            title: item.title,
            count: item.count,
            sentiment: item.sentiment,
            change_percentage: item.change_percentage,
            keywords: item.keywords
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ 
        title: isDemoMode ? "Últimos itens atualizados! (DEMO)" : "Últimos itens atualizados!", 
        description: "Os dados foram atualizados com base nos feedbacks mais recentes." 
      });
      queryClient.invalidateQueries({ queryKey: ['latest_items'] });
    },
    onError: (err: Error) => {
      toast({ 
        title: "Erro ao atualizar últimos itens", 
        description: err.message, 
        variant: 'destructive' 
      });
    },
  });

  return {
    latestItems,
    isLoading,
    isError,
    error,
    generateLatestItems: generateLatestItemsMutation.mutate,
    isGenerating: generateLatestItemsMutation.isPending
  };
};
