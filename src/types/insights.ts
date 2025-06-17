
export interface Insight {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'trend' | 'alert' | 'opportunity' | 'other';
  severity: 'info' | 'warning' | 'success' | 'error';
  action?: string;
  tags?: string[];
  created_at: string;
  status?: string;
  tribe_id?: string;
  squad_id?: string;
}

export interface CreateInsightData {
  title: string;
  description: string;
  type: 'trend' | 'alert' | 'opportunity' | 'other';
  severity: 'info' | 'warning' | 'success' | 'error';
  action?: string;
  tags?: string[];
}
