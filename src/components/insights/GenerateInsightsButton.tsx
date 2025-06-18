
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDemoMode } from '@/hooks/useDemoMode';
import { generateInsights } from '@/services/insightsService';

export const GenerateInsightsButton = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isDemoMode } = useDemoMode();

  const generateInsightsMutation = useMutation({
    mutationFn: isDemoMode ? 
      () => Promise.resolve() : 
      generateInsights,
    onSuccess: () => {
      if (isDemoMode) {
        toast({ title: "Insights gerados! (DEMO)", description: "Os insights foram atualizados em modo demonstração." });
      } else {
        toast({ title: "Insights gerados!", description: "Novos insights foram criados com base nos feedbacks." });
      }
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao gerar insights", description: err.message, variant: 'destructive' });
    },
  });

  return (
    <Button 
      onClick={() => generateInsightsMutation.mutate()}
      disabled={generateInsightsMutation.isPending}
    >
      {generateInsightsMutation.isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="mr-2 h-4 w-4" />
      )}
      Gerar Novos Insights
    </Button>
  );
};
