import React from 'react';
import { 
  BarChart3, Users, Clock, MousePointer, TrendingUp, 
  ArrowLeft, Eye, Calendar, Activity, User, Award, Target
} from 'lucide-react';
import { getAnalyticsData } from '../data/analyticsData';
import { DashboardAnalytics, UserAnalytics } from '../types/analytics';

interface AnalyticsPageProps {
  onBack: () => void;
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const analyticsData = getAnalyticsData();
  const [selectedView, setSelectedView] = React.useState<'overview' | 'users' | 'dashboards'>('overview');

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
                  <Users className="h-6 w-6 mr-3 text-green-600" />
                  Individual User Analytics
                </h2>
                <div className="text-sm nature-subtext">Dynamically sorted by engagement score</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyticsData.users.map((user) => (
                  <UserAnalyticsCard key={user.userId} user={user} />
                ))}
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

          {/* Recent Activity Feed */}
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
      </main>
    </div>
  );
}