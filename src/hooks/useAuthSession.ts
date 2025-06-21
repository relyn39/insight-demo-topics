
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('🔐 [AUTH AUDIT] Initializing auth session monitoring');
    
    // Configurar listener de mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 [AUTH AUDIT] Auth state changed:', { 
          event, 
          hasSession: !!session,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });

        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);

        // Verificar se a sessão expirou
        if (event === 'TOKEN_REFRESHED') {
          console.log('🔐 [AUTH AUDIT] Token refreshed successfully');
          toast.success('Sessão renovada automaticamente');
        }

        if (event === 'SIGNED_OUT') {
          console.log('🔐 [AUTH AUDIT] User signed out');
          toast.info('Sessão encerrada');
        }

        if (event === 'USER_UPDATED') {
          console.log('🔐 [AUTH AUDIT] User data updated');
        }

        setIsLoading(false);
      }
    );

    // DEPOIS verificar sessão existente
    const checkSession = async () => {
      try {
        console.log('🔐 [AUTH AUDIT] Checking existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔐 [AUTH AUDIT] Error getting session:', error);
          setIsLoading(false);
          return;
        }

        console.log('🔐 [AUTH AUDIT] Initial session check:', {
          hasSession: !!session,
          userId: session?.user?.id,
          expiresAt: session?.expires_at,
          timestamp: new Date().toISOString()
        });

        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        setIsLoading(false);
      } catch (error) {
        console.error('🔐 [AUTH AUDIT] Unexpected error checking session:', error);
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      console.log('🔐 [AUTH AUDIT] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Função para verificar se a sessão ainda é válida
  const validateSession = async () => {
    if (!session) return false;
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.log('🔐 [AUTH AUDIT] Session validation failed, forcing refresh');
        await supabase.auth.refreshSession();
        return false;
      }
      return true;
    } catch (error) {
      console.error('🔐 [AUTH AUDIT] Session validation error:', error);
      return false;
    }
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    validateSession
  };
};
