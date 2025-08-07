import React from 'react';
import { 
  BarChart3, Users, Clock, MousePointer, TrendingUp, 
  ArrowLeft, Eye, Calendar, Activity, User, Award, Target,
  Brain, AlertTriangle, CheckCircle, Info, ArrowUp, ArrowDown,
  Filter, Search, Table
} from 'lucide-react';
import { getAnalyticsData } from '../data/analyticsData';
import { DashboardAnalytics, UserAnalytics, AIRecommendation } from '../types/analytics';

interface AnalyticsPageProps {
  onBack: () => void;
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const analyticsData = getAnalyticsData();
  const [selectedView, setSelectedView] = React.useState<'overview' | 'users' | 'dashboards' | 'ai-insights'>('overview');
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
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-green-100 pt-4">
        <h4 className="text-sm font-semibold nature-heading mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {dashboard.recentViews.slice(0, 3).map((view) => (
            <div key={view.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="nature-subtext">{view.userName}</span>
              </div>
              <div className="flex items-center space-x-4 text-xs nature-subtext">
                <span>{formatTime(view.timeOnPage)}</span>
                <span>{view.clicks} clicks</span>
                <span>{formatDate(view.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fefffe 0%, #f8f9fa 100%)' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-6 p-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full smooth-transition"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <div className="w-12 h-12 nature-gradient rounded-full flex items-center justify-center mr-6">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold nature-heading">Analytics Dashboard</h1>
                  <p className="text-sm nature-subtext font-medium">Career Platform Usage Insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-white rounded-full p-1 border border-green-200">
                <button
                  onClick={() => setSelectedView('overview')}
                  className={`px-4 py-2 rounded-full text-sm font-medium smooth-transition ${
                    selectedView === 'overview' 
                      ? 'bg-green-500 text-white' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSelectedView('users')}
                  className={`px-4 py-2 rounded-full text-sm font-medium smooth-transition ${
                    selectedView === 'users' 
                      ? 'bg-green-500 text-white' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setSelectedView('dashboards')}
                  className={`px-4 py-2 rounded-full text-sm font-medium smooth-transition ${
                    selectedView === 'dashboards' 
                      ? 'bg-green-500 text-white' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  Dashboards
                </button>
                <button
                  onClick={() => setSelectedView('ai-insights')}
                  className={`px-4 py-2 rounded-full text-sm font-medium smooth-transition ${
                    selectedView === 'ai-insights' 
                      ? 'bg-green-500 text-white' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  AI Insights
                </button>
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Last 30 Days
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="space-y-8">
          {selectedView === 'overview' && (
            <>
              {/* Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  icon={<Eye className="h-6 w-6 text-green-600" />}
                  title="Total Page Views"
                  value={analyticsData.totalPageViews}
                  subtitle="Across all dashboards"
                  color="green"
                />
                <MetricCard
                  icon={<Users className="h-6 w-6 text-blue-600" />}
                  title="Unique Users"
                  value={analyticsData.totalUniqueUsers}
                  subtitle="Active users this period"
                  color="blue"
                />
                <MetricCard
                  icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
                  title="Avg. Engagement"
                  value={`${analyticsData.averageEngagement.toFixed(1)}%`}
                  subtitle="Overall platform engagement"
                  color="purple"
                />
              </div>

              {/* Top Performers */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold nature-heading flex items-center">
                    <Award className="h-6 w-6 mr-3 text-green-600" />
                    Top Performers
                  </h2>
                  <div className="text-sm nature-subtext">Highest engagement users</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analyticsData.topPerformers.slice(0, 6).map((user) => (
                    <UserAnalyticsCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedView === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold nature-heading flex items-center">
                  <Table className="h-6 w-6 mr-3 text-green-600" />
                  User Analytics Table
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400"
                    />
                  </div>
                  <div className="text-sm nature-subtext">
                    {sortedUsers.length} users • Sorted by {sortBy} ({sortOrder})
                  </div>
                </div>
              </div>
              
              {/* User Analytics Table */}
              <div className="nature-card bg-white/95 overflow-hidden organic-shape">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-50/50 border-b border-green-100">
                      <tr>
                        <th className="text-left p-4 font-semibold nature-heading">User</th>
                        <th 
                          className="text-left p-4 font-semibold nature-heading cursor-pointer hover:bg-green-100/50 transition-colors"
                          onClick={() => handleSort('engagement')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Engagement</span>
                            {sortBy === 'engagement' && (
                              sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 font-semibold nature-heading cursor-pointer hover:bg-green-100/50 transition-colors"
                          onClick={() => handleSort('pageViews')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Page Views</span>
                            {sortBy === 'pageViews' && (
                              sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 font-semibold nature-heading cursor-pointer hover:bg-green-100/50 transition-colors"
                          onClick={() => handleSort('timeOnPage')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Avg. Time</span>
                            {sortBy === 'timeOnPage' && (
                              sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-left p-4 font-semibold nature-heading">Clicks</th>
                        <th 
                          className="text-left p-4 font-semibold nature-heading cursor-pointer hover:bg-green-100/50 transition-colors"
                          onClick={() => handleSort('users')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Dashboards</span>
                            {sortBy === 'users' && (
                              sortOrder === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-left p-4 font-semibold nature-heading">Most Used</th>
                        <th className="text-left p-4 font-semibold nature-heading">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUsers.map((user, index) => (
                        <tr 
                          key={user.userId} 
                          className={`border-b border-green-50 hover:bg-green-50/30 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-green-25/20'
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{user.userName.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-semibold nature-heading">{user.userName}</div>
                                <div className="text-sm nature-subtext">User #{index + 1}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getEngagementBadge(user.engagementScore)}`}>
                                {user.engagementScore.toFixed(1)}%
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold nature-heading">{user.totalPageViews}</div>
                            <div className="text-sm nature-subtext">visits</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold nature-heading">{formatTime(Math.round(user.averageTimeOnPage))}</div>
                            <div className="text-sm nature-subtext">per session</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold nature-heading">{user.averageClicksPerSession.toFixed(1)}</div>
                            <div className="text-sm nature-subtext">per session</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold nature-heading">{user.dashboardsVisited.length}</div>
                            <div className="text-sm nature-subtext">explored</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium nature-heading text-sm">{user.mostVisitedDashboard}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm nature-subtext">{formatDate(user.lastActivity)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'dashboards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold nature-heading flex items-center">
                  <Target className="h-6 w-6 mr-3 text-green-600" />
                  Dashboard Performance
                </h2>
                <div className="text-sm nature-subtext">Sorted by engagement score</div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analyticsData.dashboards.map((dashboard) => (
                  <DashboardAnalyticsCard key={dashboard.dashboardId} dashboard={dashboard} />
                ))}
              </div>
            </div>
          )}

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
      </main>
    </div>
  );
}