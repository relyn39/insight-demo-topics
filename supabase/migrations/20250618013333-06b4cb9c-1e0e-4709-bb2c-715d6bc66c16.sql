
-- Otimização das políticas RLS para melhor performance
-- Substitui auth.uid() por (select auth.uid()) para evitar re-avaliação por linha

-- Profiles policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;  
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = id);

-- Integrations policies
DROP POLICY IF EXISTS "Users can manage their own integrations" ON public.integrations;

CREATE POLICY "Users can manage their own integrations" ON public.integrations
  FOR ALL USING ((select auth.uid()) = user_id);

-- Feedbacks policies  
DROP POLICY IF EXISTS "Users can manage their own feedbacks" ON public.feedbacks;

CREATE POLICY "Users can manage their own feedbacks" ON public.feedbacks
  FOR ALL USING ((select auth.uid()) = user_id);

-- Feedback comments policies
DROP POLICY IF EXISTS "Users can manage comments on their feedbacks" ON public.feedback_comments;

CREATE POLICY "Users can manage comments on their feedbacks" ON public.feedback_comments
  FOR ALL USING (
    (select auth.uid()) = user_id OR 
    EXISTS (
      SELECT 1 FROM public.feedbacks 
      WHERE feedbacks.id = feedback_comments.feedback_id 
      AND feedbacks.user_id = (select auth.uid())
    )
  );

-- Sync logs policies
DROP POLICY IF EXISTS "Users can view their own sync logs" ON public.sync_logs;

CREATE POLICY "Users can view their own sync logs" ON public.sync_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.integrations 
      WHERE integrations.id = sync_logs.integration_id 
      AND integrations.user_id = (select auth.uid())
    )
  );

-- AI configurations policies
DROP POLICY IF EXISTS "Users can manage their own AI configuration" ON public.ai_configurations;

CREATE POLICY "Users can manage their own AI configuration" ON public.ai_configurations
  FOR ALL USING ((select auth.uid()) = user_id);

-- Insights policies
DROP POLICY IF EXISTS "Users can view their own insights" ON public.insights;

CREATE POLICY "Users can view their own insights" ON public.insights
  FOR ALL USING ((select auth.uid()) = user_id);

-- Product opportunities policies
DROP POLICY IF EXISTS "Usuários podem gerenciar suas próprias oportunidades de produ" ON public.product_opportunities;

CREATE POLICY "Users can manage their own product opportunities" ON public.product_opportunities
  FOR ALL USING ((select auth.uid()) = user_id);

-- Opportunity insights policies
DROP POLICY IF EXISTS "Usuários podem gerenciar links para suas próprias oportunidad" ON public.opportunity_insights;

CREATE POLICY "Users can manage their own opportunity insights" ON public.opportunity_insights
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.product_opportunities 
      WHERE product_opportunities.id = opportunity_insights.opportunity_id 
      AND product_opportunities.user_id = (select auth.uid())
    )
  );

-- Topic analysis results policies
DROP POLICY IF EXISTS "Users can manage their own topic analysis results" ON public.topic_analysis_results;

CREATE POLICY "Users can manage their own topic analysis results" ON public.topic_analysis_results
  FOR ALL USING ((select auth.uid()) = user_id);

-- Tribes policies
DROP POLICY IF EXISTS "Users can view their own tribes" ON public.tribes;
DROP POLICY IF EXISTS "Users can create their own tribes" ON public.tribes;
DROP POLICY IF EXISTS "Users can update their own tribes" ON public.tribes;
DROP POLICY IF EXISTS "Users can delete their own tribes" ON public.tribes;

CREATE POLICY "Users can view their own tribes" ON public.tribes
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own tribes" ON public.tribes
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own tribes" ON public.tribes
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own tribes" ON public.tribes
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Squads policies
DROP POLICY IF EXISTS "Users can view their own squads" ON public.squads;
DROP POLICY IF EXISTS "Users can create their own squads" ON public.squads;
DROP POLICY IF EXISTS "Users can update their own squads" ON public.squads;
DROP POLICY IF EXISTS "Users can delete their own squads" ON public.squads;

CREATE POLICY "Users can view their own squads" ON public.squads
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own squads" ON public.squads
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own squads" ON public.squads
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own squads" ON public.squads
  FOR DELETE USING ((select auth.uid()) = user_id);

-- Latest items policies
DROP POLICY IF EXISTS "Users can view their own latest items" ON public.latest_items;
DROP POLICY IF EXISTS "Users can create their own latest items" ON public.latest_items;
DROP POLICY IF EXISTS "Users can update their own latest items" ON public.latest_items;
DROP POLICY IF EXISTS "Users can delete their own latest items" ON public.latest_items;

CREATE POLICY "Users can view their own latest items" ON public.latest_items
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own latest items" ON public.latest_items
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own latest items" ON public.latest_items
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own latest items" ON public.latest_items
  FOR DELETE USING ((select auth.uid()) = user_id);
