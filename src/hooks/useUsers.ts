
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useUsers = () => {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('🔍 [AUDIT] Fetching users from profiles table...');
      console.log('🔍 [AUDIT] Query timestamp:', new Date().toISOString());
      
      // Primeiro verificar se há usuário autenticado
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log('🔍 [AUDIT] Current user for profiles query:', { 
        userId: currentUser?.id, 
        email: currentUser?.email 
      });

      if (!currentUser) {
        console.log('🔍 [AUDIT] No authenticated user, returning empty array');
        return [];
      }

      // Tentar buscar todos os perfis (pode falhar se não houver política para isso)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('🔍 [AUDIT] Error fetching users:', error);
        console.log('🔍 [AUDIT] Trying to fetch only current user profile as fallback');
        
        // Fallback: buscar apenas o perfil do usuário atual
        const { data: currentUserProfile, error: currentUserError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (currentUserError) {
          console.error('🔍 [AUDIT] Error fetching current user profile:', currentUserError);
          return [];
        }

        console.log('🔍 [AUDIT] Fetched current user profile only:', currentUserProfile);
        return currentUserProfile ? [currentUserProfile] : [];
      }

      console.log('🔍 [AUDIT] Users fetched successfully:', {
        count: data?.length || 0,
        users: data?.map(u => ({ id: u.id, email: u.email, name: u.full_name })),
        timestamp: new Date().toISOString()
      });
      
      return data as UserProfile[];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always refetch to avoid cache issues
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      console.log('🗑️ [AUDIT] Deleting user:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('🗑️ [AUDIT] Error deleting user:', error);
        throw error;
      }
      
      console.log('🗑️ [AUDIT] User deleted successfully:', userId);
      return userId;
    },
    onSuccess: () => {
      console.log('🗑️ [AUDIT] Delete mutation succeeded, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users,
    isLoading,
    error,
    deleteUser,
  };
};
