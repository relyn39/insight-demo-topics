
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
  console.log('📊 [AUDIT] Fetching latest items...');
  console.log('📊 [AUDIT] Fetch timestamp:', new Date().toISOString());
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('📊 [AUDIT] No user found for latest items fetch');
    return [];
  }

  const { data, error } = await supabase
    .from('latest_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('📊 [AUDIT] Erro ao buscar últimos itens:', error);
    throw new Error('Não foi possível carregar os últimos itens.');
  }

  console.log('📊 [AUDIT] Latest items fetched successfully:', {
    count: data?.length || 0,
    items: data?.map(item => ({ id: item.id, title: item.title })),
    timestamp: new Date().toISOString()
  });

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
  console.log('⚡ [AUDIT] Generating latest items...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase.functions.invoke('generate-latest-items', {
    body: { user_id: user.id }
  });

  if (error) {
    console.error('⚡ [AUDIT] Error generating latest items:', error);
    throw new Error(`Falha ao gerar últimos itens: ${error.message}`);
  }

  console.log('⚡ [AUDIT] Latest items generated successfully');
  return data;
};

export const useLatestItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isDemoMode, getDemoLatestItems } = useDemoMode();

  const { data: latestItems, isLoading, isError, error } = useQuery({
    queryKey: ['latest-items'],
    queryFn: isDemoMode ? () => {
      console.log('📊 [AUDIT] Using demo mode for latest items');
      return Promise.resolve(getDemoLatestItems());
    } : fetchLatestItems,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always refetch to avoid cache issues
  });

  const generateLatestItemsMutation = useMutation({
    mutationFn: isDemoMode ? () => {
      console.log('⚡ [AUDIT] Demo mode: simulating latest items generation');
      return Promise.resolve();
    } : generateLatestItemsFunction,
    onSuccess: () => {
      if (isDemoMode) {
        console.log('⚡ [AUDIT] Demo mode: latest items updated');
        toast({ title: "Últimos itens atualizados! (DEMO)", description: "Os itens foram atualizados em modo demonstração." });
      } else {
        console.log('⚡ [AUDIT] Latest items generation succeeded');
        toast({ title: "Últimos itens atualizados!", description: "Os itens mais mencionados foram atualizados." });
      }
      queryClient.invalidateQueries({ queryKey: ['latest-items'] });
    },
    onError: (err: Error) => {
      console.error('⚡ [AUDIT] Latest items generation failed:', err);
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
