
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { InsightList } from '@/components/insights/InsightList';
import { GenerateInsightsButton } from '@/components/insights/GenerateInsightsButton';
import { DemoModeSettings } from '@/components/DemoModeSettings';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Badge } from '@/components/ui/badge';

const fetchInsights = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', null])
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

const TopicsAnalysis = () => {
  const { isDemoMode, getDemoInsights } = useDemoMode();
  
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['insights'],
    queryFn: isDemoMode ? () => Promise.resolve(getDemoInsights()) : fetchInsights,
  });

  const activeInsights = insights?.filter(insight => 
    !insight.status || insight.status === 'active'
  ) || [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-background sm:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/78ca95af-4763-4050-8671-a00f99ef9220.png" alt="Feedback-Hub Logo" className="h-8 w-8 object-contain block dark:hidden" />
                <img src="/lovable-uploads/a29f8301-8f7b-48e8-be65-36b51d7c7c66.png" alt="Feedback-Hub Logo" className="h-8 w-8 object-contain hidden dark:block" />
                <h1 className="text-xl font-bold text-gray-900">
                  Insights {isDemoMode && <Badge variant="secondary">DEMO</Badge>}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GenerateInsightsButton />
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Dashboard
                </Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
            <DemoModeSettings />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Todos os Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InsightList 
                  insights={activeInsights} 
                  isLoading={isLoading} 
                  error={error} 
                />
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default TopicsAnalysis;
