
-- Adicionar tabelas de relacionamento para rastrear fontes dos insights e oportunidades
-- Criar tabela para vincular feedbacks aos insights
CREATE TABLE public.insight_feedbacks (
  insight_id uuid NOT NULL REFERENCES public.insights(id) ON DELETE CASCADE,
  feedback_id uuid NOT NULL REFERENCES public.feedbacks(id) ON DELETE CASCADE,
  PRIMARY KEY (insight_id, feedback_id)
);

-- Adicionar RLS para insight_feedbacks
ALTER TABLE public.insight_feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own insight feedbacks" ON public.insight_feedbacks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.insights 
      WHERE insights.id = insight_feedbacks.insight_id 
      AND insights.user_id = (select auth.uid())
    )
  );

-- Adicionar campo tags na tabela insights se não existir
ALTER TABLE public.insights ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Adicionar campo para múltiplas integrações da mesma fonte
ALTER TABLE public.integrations ADD COLUMN IF NOT EXISTS query_filter text;

-- Adicionar campo external_created_at se não existir em feedbacks
-- (este campo já existe baseado no schema atual)

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_insight_feedbacks_insight_id ON public.insight_feedbacks(insight_id);
CREATE INDEX IF NOT EXISTS idx_insight_feedbacks_feedback_id ON public.insight_feedbacks(feedback_id);
CREATE INDEX IF NOT EXISTS idx_insights_created_at ON public.insights(created_at);
CREATE INDEX IF NOT EXISTS idx_feedbacks_source ON public.feedbacks(source);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON public.feedbacks(created_at);
