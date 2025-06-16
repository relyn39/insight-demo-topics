
import Navigation from '@/components/Navigation';
import TopicCard from '@/components/TopicCard';
import { mockTopics, trendingStats } from '@/data/mockData';
import { TrendingUp, MessageCircle, Users, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Tópicos Mais Discutidos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Acompanhe as discussões mais relevantes e trending topics em tempo real. 
            Descubra o que está movimentando as conversas hoje.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Discussões</p>
                <p className="text-2xl font-bold text-purple-600">{trendingStats.totalDiscussions.toLocaleString()}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Participantes Ativos</p>
                <p className="text-2xl font-bold text-cyan-600">{trendingStats.totalParticipants.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-cyan-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tópicos Ativos</p>
                <p className="text-2xl font-bold text-green-600">{trendingStats.activeTopics}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Crescimento</p>
                <p className="text-2xl font-bold text-orange-600">+{trendingStats.growthRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Trending Now Badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full shadow-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <span className="animate-bounce">🔥</span>
              <span className="font-semibold">TRENDING AGORA</span>
              <span className="animate-bounce">🔥</span>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTopics.map((topic, index) => (
            <div key={topic.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <TopicCard topic={topic} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Quer ver análises mais detalhadas?</h2>
          <p className="text-xl mb-6 opacity-90">
            Acesse nossa página de Insights para gráficos e métricas avançadas
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            Ver Insights Detalhados
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
