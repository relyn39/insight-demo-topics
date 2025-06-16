
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AddOpportunityDialog from './AddOpportunityDialog';
import { EditOpportunityDialog } from './EditOpportunityDialog';
import { useTribes } from '@/hooks/useTribes';

type OpportunityStatus = 'backlog' | 'próximo' | 'em_andamento' | 'concluído';
const statuses: OpportunityStatus[] = ['backlog', 'próximo', 'em_andamento', 'concluído'];

interface ProductOpportunity {
  id: string;
  title: string;
  description: string | null;
  status: OpportunityStatus;
  tribe_id?: string;
  squad_id?: string;
  tribe?: { name: string };
  squad?: { name: string };
}

const statusTranslations: Record<OpportunityStatus, string> = {
  backlog: 'Backlog',
  próximo: 'Próximo',
  em_andamento: 'Em Andamento',
  concluído: 'Concluído',
};

const fetchOpportunities = async (): Promise<ProductOpportunity[]> => {
  const { data, error } = await supabase
    .from('product_opportunities')
    .select(`
      *,
      tribe:tribes(name),
      squad:squads(name)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar oportunidades:', error);
    throw new Error('Não foi possível carregar as oportunidades do produto.');
  }
  return data as ProductOpportunity[];
};

const Roadmap = () => {
  const { tribes, squads } = useTribes();
  const [editingOpportunity, setEditingOpportunity] = useState<ProductOpportunity | null>(null);
  
  const { data: opportunities, isLoading, error } = useQuery<ProductOpportunity[]>({
    queryKey: ['product_opportunities'],
    queryFn: fetchOpportunities,
  });

  const handleEditOpportunity = (opportunity: ProductOpportunity) => {
    setEditingOpportunity(opportunity);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Roadmap Visual</CardTitle>
        <AddOpportunityDialog />
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            <p className="ml-2 text-gray-500">Carregando o roadmap...</p>
          </div>
        )}
        {error instanceof Error && (
            <div className="text-center py-16 text-red-500">
                <p>Ocorreu um erro ao carregar o roadmap.</p>
                <p className="text-sm">{error.message}</p>
            </div>
        )}
        {opportunities && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statuses.map(status => (
              <div key={status} className="bg-muted p-4 rounded-lg border">
                <h3 className="font-semibold capitalize text-foreground mb-4">{statusTranslations[status]}</h3>
                <div className="space-y-3 min-h-[100px]">
                  {opportunities.filter(o => o.status === status).map(opp => (
                    <Card key={opp.id} className="shadow-sm hover:shadow-md transition-shadow group">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-card-foreground">{opp.title}</h4>
                            {opp.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{opp.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {opp.tribe && (
                                <Badge variant="outline" className="text-xs">
                                  {opp.tribe.name}
                                </Badge>
                              )}
                              {opp.squad && (
                                <Badge variant="secondary" className="text-xs">
                                  {opp.squad.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                            onClick={() => handleEditOpportunity(opp)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {opportunities.filter(o => o.status === status).length === 0 && (
                      <div className="text-center text-xs text-muted-foreground py-4">
                          Nenhuma oportunidade nesta etapa.
                      </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && !error && !opportunities?.length && (
            <div className="text-center py-16">
                <p className="font-medium text-muted-foreground">Nenhuma oportunidade no roadmap.</p>
                <p className="mt-2 text-sm text-muted-foreground">Comece criando uma nova oportunidade para visualizar aqui.</p>
            </div>
        )}
      </CardContent>
      
      <EditOpportunityDialog
        opportunity={editingOpportunity}
        open={!!editingOpportunity}
        onOpenChange={(open) => !open && setEditingOpportunity(null)}
      />
    </Card>
  );
};

export default Roadmap;
