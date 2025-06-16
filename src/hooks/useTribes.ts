
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as tribesService from '@/services/tribesService';

export const useTribes = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tribes = [], isLoading: isLoadingTribes } = useQuery({
    queryKey: ['tribes'],
    queryFn: tribesService.fetchTribes,
  });

  const { data: squads = [], isLoading: isLoadingSquads } = useQuery({
    queryKey: ['squads'],
    queryFn: tribesService.fetchSquads,
  });

  const createTribeMutation = useMutation({
    mutationFn: tribesService.createTribe,
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tribo criada com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['tribes'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const createSquadMutation = useMutation({
    mutationFn: tribesService.createSquad,
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Squad criada com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['squads'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const updateTribeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tribesService.updateTribe(id, data),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tribo atualizada com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['tribes'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const updateSquadMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tribesService.updateSquad(id, data),
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Squad atualizada com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['squads'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const deleteTribeMutation = useMutation({
    mutationFn: tribesService.deleteTribe,
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Tribo deletada com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['tribes'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const deleteSquadMutation = useMutation({
    mutationFn: tribesService.deleteSquad,
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Squad deletada com sucesso" });
      queryClient.invalidateQueries({ queryKey: ['squads'] });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  return {
    tribes,
    squads,
    isLoading: isLoadingTribes || isLoadingSquads,
    createTribe: createTribeMutation,
    createSquad: createSquadMutation,
    updateTribe: updateTribeMutation,
    updateSquad: updateSquadMutation,
    deleteTribe: deleteTribeMutation,
    deleteSquad: deleteSquadMutation,
  };
};
