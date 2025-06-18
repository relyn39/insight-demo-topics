
import { useState, useEffect } from 'react';
import { DEMO_FEEDBACKS, DEMO_INSIGHTS, DEMO_LATEST_ITEMS } from '@/data/demoData';

export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const stored = localStorage.getItem('feedback-hub-demo-mode');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('feedback-hub-demo-mode', isDemoMode.toString());
  }, [isDemoMode]);

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  const getDemoFeedbacks = () => DEMO_FEEDBACKS;
  const getDemoInsights = () => DEMO_INSIGHTS;
  const getDemoLatestItems = () => DEMO_LATEST_ITEMS;

  return {
    isDemoMode,
    toggleDemoMode,
    getDemoFeedbacks,
    getDemoInsights,
    getDemoLatestItems
  };
};
