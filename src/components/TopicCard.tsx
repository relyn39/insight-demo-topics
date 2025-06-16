
import { MessageCircle, TrendingUp, Users, Clock } from 'lucide-react';

interface TopicCardProps {
  topic: {
    id: number;
    title: string;
    description: string;
    discussionCount: number;
    participantCount: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
    lastActivity: string;
    category: string;
    isHot?: boolean;
  };
}

const TopicCard = ({ topic }: TopicCardProps) => {
  const getTrendColor = () => {
    switch (topic.trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getCategoryColor = () => {
    const colors = {
      'Tecnologia': 'bg-blue-100 text-blue-800',
      'Política': 'bg-red-100 text-red-800',
      'Esportes': 'bg-green-100 text-green-800',
      'Entretenimento': 'bg-purple-100 text-purple-800',
      'Economia': 'bg-yellow-100 text-yellow-800',
      'Ciência': 'bg-cyan-100 text-cyan-800',
    };
    return colors[topic.category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
      topic.isHot ? 'border-l-red-500 animate-pulse-glow' : 'border-l-purple-500'
    } hover:-translate-y-1`}>
      {topic.isHot && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
          🔥 HOT
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}>
          {topic.category}
        </span>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">{topic.trendPercentage}%</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
        {topic.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {topic.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{topic.discussionCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{topic.participantCount}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>{topic.lastActivity}</span>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
