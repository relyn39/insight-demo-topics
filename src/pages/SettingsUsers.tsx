
import React from 'react';
import { TribesManagement } from '@/components/TribesManagement';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const SettingsUsers = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        </div>
        <TribesManagement />
      </main>
    </SidebarProvider>
  );
};

export default SettingsUsers;
