
import { useState, useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';

type Feedback = Tables<'feedbacks'>;
type Insight = Tables<'insights'>;

const DEMO_FEEDBACKS: Feedback[] = [
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

const getDemoInsights = (): Insight[] => [
  {
    id: 'demo-1',
    user_id: 'demo',
    type: 'trend',
    severity: 'error',
    title: 'Tendência de queda na satisfação',
    description: 'Identificamos uma tendência de declínio na satisfação dos usuários nas últimas 2 semanas.',
    action: 'Investigar causas e implementar melhorias urgentes na experiência do usuário.',
    tags: ['satisfação', 'tendência', 'urgente'],
    created_at: new Date().toISOString(),
    status: 'active',
    tribe_id: '',
    squad_id: ''
  },
  {
    id: 'demo-2',
    user_id: 'demo',
    type: 'opportunity',
    severity: 'success',
    title: 'Oportunidade de melhoria na performance',
    description: 'Usuários reportam lentidão, mas há soluções técnicas viáveis para otimização.',
    action: 'Implementar cache e otimizar queries do banco de dados.',
    tags: ['performance', 'otimização', 'técnico'],
    created_at: new Date().toISOString(),
    status: 'active',
    tribe_id: '',
    squad_id: ''
  },
  {
    id: 'demo-3',
    user_id: 'demo',
    type: 'other',
    severity: 'info',
    title: 'Feedback sobre nova funcionalidade',
    description: 'Usuários estão se adaptando bem à nova interface, com comentários positivos gerais.',
    action: 'Continuar monitorando e coletar mais feedback para futuras iterações.',
    tags: ['interface', 'feedback', 'adaptação'],
    created_at: new Date().toISOString(),
    status: 'active',
    tribe_id: '',
    squad_id: ''
  }
];

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

  return {
    isDemoMode,
    toggleDemoMode,
    getDemoFeedbacks,
    getDemoInsights
  };
};
