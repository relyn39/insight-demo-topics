
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/auth' 
}) => {
  const { isAuthenticated, isLoading } = useAuthSession();

  console.log('🛡️ [AUTH GUARD] Auth state:', { 
    isAuthenticated, 
    isLoading,
    timestamp: new Date().toISOString()
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🛡️ [AUTH GUARD] Redirecting to auth page');
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
