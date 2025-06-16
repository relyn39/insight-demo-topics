
-- Criar tabela para tribos
CREATE TABLE public.tribes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para squads
CREATE TABLE public.squads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tribe_id UUID NOT NULL REFERENCES public.tribes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  jira_board_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar colunas tribe_id e squad_id na tabela product_opportunities
ALTER TABLE public.product_opportunities 
ADD COLUMN tribe_id UUID REFERENCES public.tribes(id),
ADD COLUMN squad_id UUID REFERENCES public.squads(id);

-- Adicionar colunas tribe_id e squad_id na tabela insights
ALTER TABLE public.insights 
ADD COLUMN tribe_id UUID REFERENCES public.tribes(id),
ADD COLUMN squad_id UUID REFERENCES public.squads(id),
ADD COLUMN status TEXT DEFAULT 'active';

-- Habilitar RLS para as novas tabelas
ALTER TABLE public.tribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tribes
CREATE POLICY "Users can view their own tribes" 
  ON public.tribes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tribes" 
  ON public.tribes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tribes" 
  ON public.tribes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tribes" 
  ON public.tribes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para squads
CREATE POLICY "Users can view their own squads" 
  ON public.squads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own squads" 
  ON public.squads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own squads" 
  ON public.squads 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own squads" 
  ON public.squads 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_tribes_updated_at 
  BEFORE UPDATE ON public.tribes 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_squads_updated_at 
  BEFORE UPDATE ON public.squads 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
