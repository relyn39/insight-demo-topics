
import Navigation from '@/components/Navigation';
import TopicCard from '@/components/TopicCard';
import { mockTopics, trendingStats } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Eye, Clock, Award } from 'lucide-react';

const Insights = () => {
  // Dados para os gráficos
  const categoryData = [
    { name: 'Tecnologia', value: 35, color: '#3b82f6' },
    { name: 'Política', value: 28, color: '#ef4444' },
    { name: 'Esportes', value: 18, color: '#10b981' },
    { name: 'Entretenimento', value: 12, color: '#a855f7' },
    { name: 'Economia', value: 7, color: '#f59e0b' }
  ];

  const weeklyTrendData = [
    { day: 'Segunda', discussions: 1200 },
    { day: 'Terça', discussions: 1450 },
    { day: 'Quarta', discussions: 1680 },
    { day: 'Quinta', discussions: 1920 },
    { day: 'Sexta', discussions: 2350 },
    { day: 'Sábado', discussions: 2100 },
    { day: 'Domingo', discussions: 1800 }
  ];

  const hourlyActivity = [
    { hour: '6h', activity: 15 },
    { hour: '9h', activity: 45 },
    { hour: '12h', activity: 85 },
    { hour: '15h', activity: 65 },
    { hour: '18h', activity: 95 },
    { hour: '21h', activity: 75 },
    { hour: '24h', activity: 25 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Insights Detalhados
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Análise profunda dos dados de discussão, tendências e engajamento em tempo real.
          </p>
        </div>

        {/* Métricas em Destaque */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-1">Visualizações Hoje</p>
                <p className="text-3xl font-bold">47.2K</p>
                <p className="text-sm text-purple-200">+12% vs ontem</p>
              </div>
              <Eye className="h-10 w-10 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 mb-1">Tempo Médio</p>
                <p className="text-3xl font-bold">8m 34s</p>
                <p className="text-sm text-cyan-200">+2min vs semana</p>
              </div>
              <Clock className="h-10 w-10 text-cyan-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">Top Categoria</p>
                <p className="text-2xl font-bold">Tecnologia</p>
                <p className="text-sm text-green-200">35% do total</p>
              </div>
              <Award className="h-10 w-10 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 mb-1">Crescimento</p>
                <p className="text-3xl font-bold">+{trendingStats.growthRate}%</p>
                <p className="text-sm text-orange-200">Este mês</p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Distribuição por Categoria */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Distribuição por Categoria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tendência Semanal */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Discussões por Dia</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="discussions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Atividade por Hora */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-12">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Atividade por Horário</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="activity" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tópicos Mais Discutidos - Mesmo conteúdo da página principal */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Tópicos Mais Discutidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockTopics.map((topic, index) => (
              <div key={topic.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <TopicCard topic={topic} />
              </div>
            ))}
          </div>
        </div>

        {/* Insights Finais */}
        <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Resumo dos Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="font-semibold mb-2">Pico de Atividade</h4>
              <p className="text-sm opacity-90">As discussões são mais intensas entre 18h-21h, com foco em tecnologia e política.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="font-semibold mb-2">Tendência Principal</h4>
              <p className="text-sm opacity-90">IA e criptomoedas dominam as conversas, com crescimento de 23% em engajamento.</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="font-semibold mb-2">Comportamento</h4>
              <p className="text-sm opacity-90">Usuários passam mais tempo em discussões técnicas e econômicas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
