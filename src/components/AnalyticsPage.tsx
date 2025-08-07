import React from 'react';
import { 
  BarChart3, Users, Clock, MousePointer, TrendingUp, 
  ArrowLeft, ChevronDown
} from 'lucide-react';
import { getAnalyticsData } from '../data/analyticsData';
import { KPIChart } from './KPIChart';

interface AnalyticsPageProps {
  onBack: () => void;
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const analyticsData = getAnalyticsData();
  const [selectedRole, setSelectedRole] = React.useState<string>('all');
  const [showRoleDropdown, setShowRoleDropdown] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'engagement' | 'pageViews' | 'timeOnPage' | 'users'>('engagement');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = React.useState('');

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEngagementColor = (score: number): string => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getEngagementBadge = (score: number): string => {
    if (score >= 80) return 'bg-green-500 text-white';
    if (score >= 60) return 'bg-yellow-500 text-white';
    if (score >= 40) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const roles = [
    { id: 'all', name: 'All Roles', icon: '👥' },
    { id: 'teacher', name: 'Teacher', icon: '👩‍🏫' },
    { id: 'ceo', name: 'CEO', icon: '👔' },
    { id: 'itSpecialist', name: 'IT Specialist', icon: '💻' },
    { id: 'teamLeader', name: 'Team Leader', icon: '👨‍💼' }
  ];

  const selectedRoleData = roles.find(role => role.id === selectedRole) || roles[0];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Info className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  // Sort and filter users
  const sortedUsers = React.useMemo(() => {
    let filtered = analyticsData.users.filter(user =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mostVisitedDashboard.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'engagement':
          aValue = a.engagementScore;
          bValue = b.engagementScore;
          break;
        case 'pageViews':
          aValue = a.totalPageViews;
          bValue = b.totalPageViews;
          break;
        case 'timeOnPage':
          aValue = a.averageTimeOnPage;
          bValue = b.averageTimeOnPage;
          break;
        case 'users':
          aValue = a.dashboardsVisited.length;
          bValue = b.dashboardsVisited.length;
          break;
        default:
          aValue = a.engagementScore;
          bValue = b.engagementScore;
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
  }, [analyticsData.users, searchTerm, sortBy, sortOrder]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const MetricCard = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    color = 'green' 
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <div className="nature-card bg-white/95 p-6 organic-shape">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl soft-gradient`}>
          {icon}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          color === 'green' ? 'bg-green-100 text-green-700' :
          color === 'blue' ? 'bg-blue-100 text-blue-700' :
          color === 'purple' ? 'bg-purple-100 text-purple-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {title}
        </div>
      </div>
      <div className="text-3xl font-bold nature-heading mb-1">{value}</div>
      {subtitle && <div className="text-sm nature-subtext">{subtitle}</div>}
    </div>
  );

  const UserAnalyticsCard = ({ user }: { user: UserAnalytics }) => (
    <div className="nature-card bg-white/95 p-6 organic-shape">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold nature-heading">{user.userName}</h3>
            <p className="text-sm nature-subtext">Most Active: {user.mostVisitedDashboard}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEngagementBadge(user.engagementScore)}`}>
          {user.engagementScore.toFixed(1)}%
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50/50 rounded-xl">
          <div className="text-xl font-bold text-blue-700">{user.totalPageViews}</div>
          <div className="text-xs text-blue-600">Page Views</div>
        </div>
        <div className="text-center p-3 bg-purple-50/50 rounded-xl">
          <div className="text-xl font-bold text-purple-700">{formatTime(Math.round(user.averageTimeOnPage))}</div>
          <div className="text-xs text-purple-600">Avg. Time</div>
        </div>
        <div className="text-center p-3 bg-orange-50/50 rounded-xl">
          <div className="text-xl font-bold text-orange-700">{user.averageClicksPerSession.toFixed(1)}</div>
          <div className="text-xs text-orange-600">Avg. Clicks</div>
        </div>
        <div className="text-center p-3 bg-green-50/50 rounded-xl">
          <div className="text-xl font-bold text-green-700">{user.dashboardsVisited.length}</div>
          <div className="text-xs text-green-600">Dashboards</div>
        </div>
      </div>

      <div className="border-t border-green-100 pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="nature-subtext">Last Activity:</span>
          <span className="font-medium nature-heading">{formatDate(user.lastActivity)}</span>
        </div>
      </div>
    </div>
  );

  const DashboardAnalyticsCard = ({ dashboard }: { dashboard: DashboardAnalytics }) => (
    <div className="nature-card bg-white/95 p-6 organic-shape">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold nature-heading">{dashboard.dashboardName}</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEngagementColor(dashboard.engagementScore)}`}>
          {dashboard.engagementScore.toFixed(1)}% Engagement
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50/50 rounded-xl">
          <div className="text-2xl font-bold text-green-700">{dashboard.pageViews}</div>
          <div className="text-sm text-green-600">Page Views</div>
        </div>
        <div className="text-center p-3 bg-blue-50/50 rounded-xl">
          <div className="text-2xl font-bold text-blue-700">{dashboard.uniqueUsers}</div>
          <div className="text-sm text-blue-600">Unique Users</div>
        </div>
        <div className="text-center p-3 bg-purple-50/50 rounded-xl">
          <div className="text-2xl font-bold text-purple-700">{formatTime(Math.round(dashboard.averageTimeOnPage))}</div>
          <div className="text-sm text-purple-600">Avg. Time</div>
        </div>
        <div className="text-center p-3 bg-orange-50/50 rounded-xl">
          <div className="text-2xl font-bold text-orange-700">{dashboard.clickThroughRate.toFixed(1)}</div>
          <div className="text-sm text-orange-600">Avg. Clicks</div>
        </div>
      </div>

      <div className="border-t border-green-100 pt-4 mb-4">
        <h4 className="text-sm font-semibold nature-heading mb-3">Top Users</h4>
        <div className="space-y-2">
          {dashboard.topUsers.slice(0, 3).map((user) => (
            <div key={user.userId} className="flex items-center justify-between text-sm p-2 bg-green-50/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{user.userName.charAt(0)}</span>
                </div>
                <span className="font-medium nature-heading">{user.userName}</span>
              </div>
              <div className="flex items-center space-x-3 text-xs nature-subtext">
                <span>{user.totalPageViews} views</span>
                <span className={`px-2 py-1 rounded-full ${getEngagementBadge(user.engagementScore)}`}>
                  {user.engagementScore.toFixed(0)}%
          {/* KPI Chart - Always Visible */}
          <KPIChart analyticsData={analyticsData} selectedRole={selectedRole} />

          {selectedView === 'ai-insights' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold nature-heading flex items-center">
                  <Brain className="h-6 w-6 mr-3 text-green-600" />
                  AI-Powered Dashboard Insights
                </h2>
                <div className="text-sm nature-subtext">Intelligent recommendations based on KPI analysis</div>
              </div>
              
              {/* AI Recommendations */}
              <div className="space-y-4">
                {analyticsData.aiRecommendations.map((rec) => (
                  <div key={rec.id} className="nature-card bg-white/95 p-6 organic-shape">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                          {getPriorityIcon(rec.priority)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold nature-heading">{rec.dashboardName}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                              {rec.priority.toUpperCase()} PRIORITY
                            </span>
                            <span className="text-sm nature-subtext">
                              AI Confidence: {rec.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50/50 rounded-xl border-l-4 border-blue-400">
                        <h4 className="font-semibold text-blue-800 mb-2">🤖 AI Recommendation</h4>
                        <p className="text-blue-700">{rec.recommendation}</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50/50 rounded-xl border-l-4 border-purple-400">
                        <h4 className="font-semibold text-purple-800 mb-2">📊 Data Analysis</h4>
                        <p className="text-purple-700">{rec.reasoning}</p>
                      </div>
                      
                      <div className="p-4 bg-orange-50/50 rounded-xl border-l-4 border-orange-400">
                        <h4 className="font-semibold text-orange-800 mb-2">🎯 KPI Impact</h4>
                        <p className="text-orange-700">{rec.kpiImpact}</p>
                      </div>
                      
                      <div className="p-4 bg-green-50/50 rounded-xl border-l-4 border-green-400">
                        <h4 className="font-semibold text-green-800 mb-2">✅ Suggested Actions</h4>
                        <ul className="text-green-700 space-y-1">
                          {rec.suggestedActions.map((action, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="nature-card bg-white/95 p-8 organic-shape">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold nature-heading flex items-center">
                    <Activity className="h-6 w-6 mr-3 text-green-600" />
                    Recent Activity Feed
                  </h2>
                  <div className="text-sm nature-subtext">Last 20 interactions</div>
                </div>
                
                <div className="space-y-3">
                  {analyticsData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-green-50/30 rounded-xl hover:bg-green-50/50 smooth-transition">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <div>
                          <div className="font-medium nature-heading">
                            {activity.userName} visited {activity.dashboardName}
                          </div>
                          <div className="text-sm nature-subtext">
                            Spent {formatTime(activity.timeOnPage)} • {activity.clicks} clicks
                          </div>
                        </div>
                      </div>
                      <div className="text-sm nature-subtext flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}