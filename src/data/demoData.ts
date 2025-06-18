
import { Tables } from '@/integrations/supabase/types';

type Feedback = Tables<'feedbacks'>;
type Insight = Tables<'insights'>;

export const DEMO_FEEDBACKS: Feedback[] = [
  {
    id: 'demo-1',
    user_id: 'demo-user',
    integration_id: null,
    source: 'manual',
    status: 'new',
    priority: 'high',
    title: 'Bug no checkout - Pagamento não processado',
    description: 'O sistema de pagamento falha quando tento usar cartão de crédito. Aparece uma mensagem de erro genérica.',
    tags: ['bug', 'pagamento', 'checkout'],
    customer_name: 'Maria Silva',
    interviewee_name: null,
    metadata: {},
    analysis: {
      sentiment: 'negative',
      summary: 'Bug crítico no sistema de pagamento afetando conversões',
      tags: ['bug-critico', 'pagamento', 'ux']
    },
    external_id: null,
    external_created_at: null,
    external_updated_at: null,
    conversation_at: null,
    is_topic_analyzed: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'demo-2',
    user_id: 'demo-user',
    integration_id: null,
    source: 'jira',
    status: 'in_progress',
    priority: 'medium',
    title: 'Interface do dashboard poderia ser mais intuitiva',
    description: 'Adorei o produto! Só acho que o dashboard principal poderia ter os botões mais destacados e talvez cores mais vibrantes.',
    tags: ['ui', 'dashboard', 'usabilidade'],
    customer_name: 'João Santos',
    interviewee_name: null,
    metadata: {},
    analysis: {
      sentiment: 'positive',
      summary: 'Feedback positivo com sugestão de melhoria na interface',
      tags: ['melhoria-ui', 'dashboard', 'experiencia-positiva']
    },
    external_id: 'JIRA-123',
    external_created_at: '2024-01-14T14:20:00Z',
    external_updated_at: '2024-01-14T14:20:00Z',
    conversation_at: null,
    is_topic_analyzed: true,
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z'
  },
  {
    id: 'demo-3',
    user_id: 'demo-user',
    integration_id: null,
    source: 'notion',
    status: 'resolved',
    priority: 'low',
    title: 'Funcionalidade de relatórios é excelente',
    description: 'A nova funcionalidade de relatórios automatizados economizou muito tempo da nossa equipe. Parabéns!',
    tags: ['relatórios', 'automação', 'produtividade'],
    customer_name: 'Ana Costa',
    interviewee_name: null,
    metadata: {},
    analysis: {
      sentiment: 'positive',
      summary: 'Elogio à funcionalidade de relatórios automatizados',
      tags: ['feature-sucesso', 'produtividade', 'automacao']
    },
    external_id: 'NOTION-456',
    external_created_at: '2024-01-13T09:15:00Z',
    external_updated_at: '2024-01-13T09:15:00Z',
    conversation_at: null,
    is_topic_analyzed: true,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z'
  },
  {
    id: 'demo-4',
    user_id: 'demo-user',
    integration_id: null,
    source: 'manual',
    status: 'new',
    priority: 'medium',
    title: 'Performance lenta em dispositivos móveis',
    description: 'O app demora muito para carregar no meu celular. Às vezes trava completamente.',
    tags: ['performance', 'mobile', 'lentidão'],
    customer_name: 'Carlos Oliveira',
    interviewee_name: null,
    metadata: {},
    analysis: {
      sentiment: 'negative',
      summary: 'Problemas de performance em dispositivos móveis',
      tags: ['performance', 'mobile', 'otimizacao']
    },
    external_id: null,
    external_created_at: null,
    external_updated_at: null,
    conversation_at: null,
    is_topic_analyzed: true,
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z'
  },
  {
    id: 'demo-5',
    user_id: 'demo-user',
    integration_id: null,
    source: 'zapier',
    status: 'in_progress',
    priority: 'high',
    title: 'Integração com Slack não funciona',
    description: 'Configurei a integração com o Slack mas as notificações não estão chegando. Já tentei reconfigurar várias vezes.',
    tags: ['integração', 'slack', 'notificações'],
    customer_name: 'Fernanda Lima',
    interviewee_name: null,
    metadata: {},
    analysis: {
      sentiment: 'negative',
      summary: 'Falha na integração com Slack afetando notificações',
      tags: ['integracao', 'slack', 'notificacoes']
    },
    external_id: 'ZAP-789',
    external_created_at: '2024-01-11T11:30:00Z',
    external_updated_at: '2024-01-11T11:30:00Z',
    conversation_at: null,
    is_topic_analyzed: true,
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z'
  }
];

export const DEMO_INSIGHTS: Insight[] = [
  {
    id: 'demo-insight-1',
    title: 'Problemas de Performance Críticos',
    description: 'Usuários relatam lentidão significativa no carregamento das páginas principais e travamentos em dispositivos móveis.',
    type: 'alert',
    severity: 'error',
    action: 'Investigar problemas de performance e otimizar queries do banco de dados.',
    tags: ['performance', 'mobile', 'crítico'],
    created_at: new Date().toISOString(),
    user_id: 'demo',
    status: 'active',
    tribe_id: '',
    squad_id: ''
  },
  {
    id: 'demo-insight-2',
    title: 'Bugs no Sistema de Pagamento',
    description: 'Identificamos múltiplos relatos de falhas no processo de checkout que estão impactando as conversões.',
    type: 'alert',
    severity: 'error',
    action: 'Revisar e corrigir sistema de pagamento urgentemente.',
    tags: ['pagamento', 'bug', 'checkout'],
    created_at: new Date().toISOString(),
    user_id: 'demo',
    status: 'active',
    tribe_id: '',
    squad_id: ''
  },
  {
    id: 'demo-insight-3',
    title: 'Melhorias na Interface do Dashboard',
    description: 'Feedback positivo sobre nova interface, mas usuários sugerem melhorias no destaque dos botões e cores.',
    type: 'opportunity',
    severity: 'info',
    action: 'Realizar testes de usabilidade e ajustar design baseado no feedback.',
    tags: ['ui', 'dashboard', 'usabilidade'],
    created_at: new Date().toISOString(),
    user_id: 'demo',
    status: 'active',
    tribe_id: '',
    squad_id: ''
  },
  {
    id: 'demo-insight-4',
    title: 'Sucesso dos Relatórios Automatizados',
    description: 'Usuários muito satisfeitos com a funcionalidade de relatórios, mencionando ganhos de produtividade.',
    type: 'trend',
    severity: 'success',
    action: 'Considerar expandir funcionalidades de relatórios com base no feedback positivo.',
    tags: ['relatórios', 'automação', 'produtividade'],
    created_at: new Date().toISOString(),
    user_id: 'demo',
    status: 'active',
    tribe_id: '',
    squad_id: ''
  },
  {
    id: 'demo-insight-5',
    title: 'Problemas de Integração com Terceiros',
    description: 'Falhas recorrentes nas integrações com Slack e outras ferramentas estão afetando a experiência.',
    type: 'alert',
    severity: 'warning',
    action: 'Implementar retry automático e melhorar tratamento de erros nas integrações.',
    tags: ['integração', 'slack', 'estabilidade'],
    created_at: new Date().toISOString(),
    user_id: 'demo',
    status: 'active',
    tribe_id: '',
    squad_id: ''
  }
];

export const DEMO_LATEST_ITEMS = [
  {
    id: 'demo-item-1',
    title: 'Sistema de Pagamento',
    count: 15,
    sentiment: 'negative' as const,
    change_percentage: 25,
    keywords: ['checkout', 'cartão', 'erro', 'falha']
  },
  {
    id: 'demo-item-2',
    title: 'Interface do Dashboard',
    count: 12,
    sentiment: 'positive' as const,
    change_percentage: -8,
    keywords: ['ui', 'design', 'botões', 'cores']
  },
  {
    id: 'demo-item-3',
    title: 'Relatórios Automatizados',
    count: 10,
    sentiment: 'positive' as const,
    change_percentage: 15,
    keywords: ['produtividade', 'automação', 'tempo']
  }
];
