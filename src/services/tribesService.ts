
import { supabase } from '@/integrations/supabase/client';
import { Tribe, Squad, CreateTribeData, CreateSquadData } from '@/types/tribes';

export const fetchTribes = async (): Promise<Tribe[]> => {
  const { data, error } = await supabase
    .from('tribes')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
};

export const fetchSquads = async (): Promise<Squad[]> => {
  const { data, error } = await supabase
    .from('squads')
    .select('*, tribe:tribes(*)')
    .order('name');
  if (error) throw error;
  return data || [];
};

export const createTribe = async (tribeData: CreateTribeData): Promise<Tribe> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('tribes')
    .insert({ ...tribeData, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const createSquad = async (squadData: CreateSquadData): Promise<Squad> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('squads')
    .insert({ ...squadData, user_id: user.id })
    .select('*, tribe:tribes(*)')
    .single();
  if (error) throw error;
  return data;
};

export const updateTribe = async (id: string, tribeData: Partial<CreateTribeData>): Promise<Tribe> => {
  const { data, error } = await supabase
    .from('tribes')
    .update(tribeData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateSquad = async (id: string, squadData: Partial<CreateSquadData>): Promise<Squad> => {
  const { data, error } = await supabase
    .from('squads')
    .update(squadData)
    .eq('id', id)
    .select('*, tribe:tribes(*)')
    .single();
  if (error) throw error;
  return data;
};

export const deleteTribe = async (id: string): Promise<void> => {
  const { error } = await supabase.from('tribes').delete().eq('id', id);
  if (error) throw error;
};

export const deleteSquad = async (id: string): Promise<void> => {
  const { error } = await supabase.from('squads').delete().eq('id', id);
  if (error) throw error;
};
