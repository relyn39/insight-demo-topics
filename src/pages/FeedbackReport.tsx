
import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FeedbackReportContent } from '@/components/feedback/FeedbackReportContent';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FeedbackReport = () => {
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
                                <h1 className="text-xl font-bold text-gray-900">Feedback</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button variant="outline" asChild>
                                <Link to="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Voltar ao Dashboard
                                </Link>
                            </Button>
                        </div>
                    </header>
                    <main className="flex-1 p-6 space-y-6">
                        <FeedbackReportContent />
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default FeedbackReport;
