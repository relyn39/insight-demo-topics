
-- Create a new table for latest items (previously "most discussed topics")
CREATE TABLE public.latest_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  sentiment text NOT NULL DEFAULT 'neutral',
  change_percentage integer NOT NULL DEFAULT 0,
  keywords text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.latest_items ENABLE ROW LEVEL SECURITY;

-- Create policies for latest_items
CREATE POLICY "Users can view their own latest items" 
  ON public.latest_items 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own latest items" 
  ON public.latest_items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own latest items" 
  ON public.latest_items 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own latest items" 
  ON public.latest_items 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_latest_items_updated_at 
  BEFORE UPDATE ON public.latest_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
