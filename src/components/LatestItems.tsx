
import React from 'react';
import { Hash, ArrowUp, ArrowDown, Minus, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLatestItems } from '@/hooks/useLatestItems';
import { useDemoMode } from '@/hooks/useDemoMode';

export const LatestItems = () => {
  const { latestItems, isLoading, isError, error, generateLatestItems, isGenerating } = useLatestItems();
  const { isDemoMode } = useDemoMode();

  const sentimentColors = {
    positive: 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800',
    negative: 'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800',
    neutral: 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700'
  };

  const handleGenerateItems = () => {
    generateLatestItems();
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            Últimos Itens {isDemoMode && <span className="text-sm text-muted-foreground">(DEMO)</span>}
          </h3>
          <p className="text-sm text-muted-foreground">Itens mais mencionados nos feedbacks recentes</p>
        </div>
        <Button 
          onClick={handleGenerateItems}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Atualizar Itens
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
        )}

        {!isLoading && (isError || (!latestItems || latestItems.length === 0)) && !isDemoMode && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {isError ? "Ocorreu um erro ao buscar os últimos itens." : "Nenhum item encontrado."}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isError ? (error as Error)?.message : "Clique em \"Atualizar Itens\" para gerar os primeiros dados."}
            </p>
          </div>
        )}
        
        {!isLoading && !isError && latestItems && latestItems.map((item) => {
          const ChangeIcon = item.change_percentage > 0 ? ArrowUp : item.change_percentage < 0 ? ArrowDown : Minus;
          const changeColor = item.change_percentage > 0 ? 'text-green-600' : item.change_percentage < 0 ? 'text-red-600' : 'text-muted-foreground';

          return (
            <div key={item.id} className={`p-4 rounded-lg border ${sentimentColors[item.sentiment]}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
                <div className="flex items-center space-x-3">
                  <Hash className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <h4 className="font-medium text-card-foreground">{item.title}</h4>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-foreground">{item.count.toLocaleString()} menções</span>
                  <div className={`flex items-center space-x-1 ${changeColor}`}>
                    <ChangeIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">{Math.abs(item.change_percentage)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {item.keywords.map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-background/60 text-xs text-foreground rounded-md">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
