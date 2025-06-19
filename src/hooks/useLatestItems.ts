
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
  if (!user) return [];

  const { data, error } = await supabase
    .from('latest_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Erro ao buscar últimos itens:', error);
    throw new Error('Não foi possível carregar os últimos itens.');
  }

  return (data || []).map(item => ({
    id: item.id,
    title: item.title,
    count: item.count,
    sentiment: item.sentiment as 'positive' | 'negative' | 'neutral',
    change_percentage: item.change_percentage,
    keywords: item.keywords || []
  }));
};

const generateLatestItemsFunction = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase.functions.invoke('generate-latest-items', {
    body: { user_id: user.id }
  });

  if (error) {
    throw new Error(`Falha ao gerar últimos itens: ${error.message}`);
  }

  return data;
};

export const useLatestItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isDemoMode, getDemoLatestItems } = useDemoMode();

  const { data: latestItems, isLoading, isError, error } = useQuery({
    queryKey: ['latest-items'],
    queryFn: isDemoMode ? () => Promise.resolve(getDemoLatestItems()) : fetchLatestItems,
  });

  const generateLatestItemsMutation = useMutation({
    mutationFn: isDemoMode ? () => Promise.resolve() : generateLatestItemsFunction,
    onSuccess: () => {
      if (isDemoMode) {
        toast({ title: "Últimos itens atualizados! (DEMO)", description: "Os itens foram atualizados em modo demonstração." });
      } else {
        toast({ title: "Últimos itens atualizados!", description: "Os itens mais mencionados foram atualizados." });
      }
      queryClient.invalidateQueries({ queryKey: ['latest-items'] });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao atualizar itens", description: err.message, variant: 'destructive' });
    },
  });

  return {
    latestItems,
    isLoading,
    isError,
    error,
    generateLatestItems: generateLatestItemsMutation.mutate,
    isGenerating: generateLatestItemsMutation.isPending,
  };
};
