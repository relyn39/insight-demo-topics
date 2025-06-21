
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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('🔍 [AUDIT] Error fetching users:', error);
        throw error;
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
