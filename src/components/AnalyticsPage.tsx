import React from 'react';
import { 
  BarChart3, Users, Clock, MousePointer, TrendingUp, 
  ArrowLeft, ChevronDown, AlertTriangle, Info, CheckCircle, User, Brain, Activity
} from 'lucide-react';
import { getAnalyticsData } from '../data/analyticsData';
import { KPIChart } from './KPIChart';
import { userTracker } from '../services/userInteractionTracker';
import { dbService } from '../services/databaseService';

interface AnalyticsPageProps {
  onBack: () => void;
}

interface UserAnalytics {
  userName: string;
  mostVisitedDashboard: string;
  engagementScore: number;
  totalPageViews: number;
  averageTimeOnPage: number;
  averageClicksPerSession: number;
  dashboardsVisited: string[];
  lastActivity: Date;
}

interface DashboardAnalytics {
  dashboardName: string;
  engagementScore: number;
  pageViews: number;
  uniqueUsers: number;
  averageTimeOnPage: number;
  clickThroughRate: number;
  topUsers: UserAnalytics[];
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const analyticsData = getAnalyticsData();
  const [selectedRole, setSelectedRole] = React.useState<string>('all');
  const [showRoleDropdown, setShowRoleDropdown] = React.useState(false);
  const [userBehaviorData, setUserBehaviorData] = React.useState<any>(null);
  const [insights, setInsights] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Initialize user interaction tracking
  React.useEffect(() => {
    const initializeTracking = async () => {
      // Initialize database service
      await dbService.initialize();
      
      // Start tracking this analytics page view
      userTracker.trackPageView('/analytics', {
        role: selectedRole,
        timestamp: Date.now()
      });

      // Track analytics page interaction
      userTracker.trackDashboardEvent('analytics_page_view', {
        selectedRole,
        viewType: 'kpi_dashboard'
      });
    };

    initializeTracking();

    // Cleanup on unmount
    return () => {
      userTracker.trackDashboardEvent('analytics_page_exit', {
        timeSpent: Date.now() - Date.now(), // This would be calculated properly
        selectedRole
      });
    };
  }, [selectedRole]);

  // Load user behavior analysis
  const loadUserBehaviorAnalysis = async () => {
    setIsLoading(true);
    try {
      const behaviorData = await dbService.analyzeUserBehavior(null, '30d');
      const insightsData = await dbService.generateInsights();
      
      setUserBehaviorData(behaviorData);
      setInsights(insightsData);
      
      // Track analysis request
      userTracker.trackDashboardEvent('behavior_analysis_requested', {
        timeRange: '30d',
        dataPoints: behaviorData?.totalInteractions || 0
      });
      
    } catch (error) {
      console.error('Failed to load user behavior analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle role selection change
  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    setShowRoleDropdown(false);
    
    // Track role selection
    userTracker.trackDashboardEvent('analytics_role_changed', {
      newRole: roleId,
      previousRole: selectedRole
    });
  };

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

  return (
    <div className="min-h-screen nature-bg">
      <header className="nature-card bg-white/95 p-6 organic-shape mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-xl hover:bg-green-100 smooth-transition"
            >
              <ArrowLeft className="h-6 w-6 text-green-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold nature-heading flex items-center">
            <h1 className="text-2xl font-bold nature-heading flex items-center">
              <Brain className="h-7 w-7 mr-3 text-purple-600" />
              User Interaction Tracking & Analysis System
            </h1>
            <p className="nature-subtext mt-2 text-base">
              JavaScript module that gathers user interactions with the system, records them into database, 
              and analyzes patterns to understand user needs and behavior
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={loadUserBehaviorAnalysis}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 smooth-transition disabled:opacity-50 font-medium"
            >
              <Activity className="h-5 w-5" />
              <span className="font-medium">
                {isLoading ? 'Analyzing Interactions...' : 'Start Interaction Analysis'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="space-y-8">
        {/* System Overview */}
        <div className="nature-card bg-white/95 p-8 organic-shape">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold nature-heading mb-3">
              JavaScript User Interaction Tracking Module
            </h2>
            <p className="text-lg nature-subtext max-w-3xl mx-auto leading-relaxed">
              This system automatically captures every user interaction with the dashboard - clicks, scrolls, 
              time spent on pages, form inputs, and navigation patterns. All data is stored in a database 
              and analyzed using AI algorithms to understand user behavior and identify their specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50/50 rounded-xl border border-blue-200">
              <MousePointer className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-800 mb-2">Data Collection</h3>
              <p className="text-sm text-blue-700">
                Tracks clicks, scrolls, time-on-page, form interactions, and user journeys in real-time
              </p>
            </div>
            <div className="text-center p-6 bg-green-50/50 rounded-xl border border-green-200">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">Database Storage</h3>
              <p className="text-sm text-green-700">
                Stores interaction data in structured SQL database with user sessions and analytics tables
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50/50 rounded-xl border border-purple-200">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-800 mb-2">AI Analysis</h3>
              <p className="text-sm text-purple-700">
                Analyzes patterns to identify user needs, preferences, and optimization opportunities
              </p>
            </div>
          </div>
        </div>

        {/* User Behavior Analysis Results */}
        {userBehaviorData && (
          <div className="nature-card bg-white/95 p-8 organic-shape">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold nature-heading flex items-center">
                <Activity className="h-6 w-6 mr-3 text-purple-600" />
                Interaction Analysis Results
              </h2>
              <div className="text-sm nature-subtext">Real user interaction data • AI-powered insights</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                icon={<User className="h-6 w-6 text-blue-600" />}
                title="Tracked Users"
                value={userBehaviorData.uniqueUsers}
                subtitle="Users with recorded interactions"
                color="blue"
              />
              <MetricCard
                icon={<MousePointer className="h-6 w-6 text-green-600" />}
                title="Interactions Captured"
                value={userBehaviorData.totalInteractions.toLocaleString()}
                subtitle="Total interactions in database"
                color="green"
              />
              <MetricCard
                icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
                title="Engagement Score"
                value={`${Math.round(userBehaviorData.engagementMetrics?.averageEngagement || 0)}%`}
                subtitle="AI-calculated user engagement"
                color="purple"
              />
              <MetricCard
                icon={<Activity className="h-6 w-6 text-orange-600" />}
                title="Sessions Analyzed"
                value={userBehaviorData.uniqueSessions}
                subtitle="User sessions in database"
                color="orange"
              />
            </div>

            {/* User Needs Analysis */}
            {userBehaviorData.userNeeds && Object.keys(userBehaviorData.userNeeds).length > 0 && (
              <div className="border-t border-green-100 pt-6">
                <h3 className="text-xl font-bold nature-heading mb-4">🎯 AI-Identified User Needs</h3>
                <p className="text-sm nature-subtext mb-4">
                  Based on interaction patterns, the system has identified these user behavior types:
                </p>
                <div className="space-y-3">
                  {Object.entries(userBehaviorData.userNeeds).map(([need, data]: [string, any]) => (
                    <div key={need} className="p-4 bg-blue-50/50 rounded-xl border-l-4 border-blue-400">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-800 capitalize">
                          {need.replace('_', ' ')} Pattern Detected
                        </h4>
                        <span className="text-sm text-blue-600">
                          AI Confidence: {(data.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-blue-700 text-sm">
                        {data.count} users ({data.percentage.toFixed(1)}%) exhibit this interaction behavior
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Insights and Recommendations */}
        {insights && (
          <div className="nature-card bg-white/95 p-8 organic-shape">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold nature-heading flex items-center">
                <Brain className="h-6 w-6 mr-3 text-purple-600" />
                AI Analysis Conclusions & Recommendations
              </h2>
              <div className="text-sm nature-subtext">Conclusions drawn from interaction data analysis</div>
            </div>

            {/* Key Findings */}
            {insights.keyFindings && insights.keyFindings.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold nature-heading mb-4">🔍 Key Findings from Data Analysis</h3>
                <div className="space-y-3">
                  {insights.keyFindings.map((finding: any, index: number) => (
                    <div key={index} className={`p-4 rounded-xl border-l-4 ${
                      finding.type === 'positive' ? 'bg-green-50/50 border-green-400' :
                      finding.type === 'concern' ? 'bg-red-50/50 border-red-400' :
                      'bg-blue-50/50 border-blue-400'
                    }`}>
                      <h4 className={`font-semibold mb-2 ${
                        finding.type === 'positive' ? 'text-green-800' :
                        finding.type === 'concern' ? 'text-red-800' :
                        'text-blue-800'
                      }`}>
                        {finding.finding}
                      </h4>
                      <p className={`text-sm ${
                        finding.type === 'positive' ? 'text-green-700' :
                        finding.type === 'concern' ? 'text-red-700' :
                        'text-blue-700'
                      }`}>
                        {finding.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {insights.recommendations && insights.recommendations.length > 0 && (
              <div className="border-t border-green-100 pt-6">
                <h3 className="text-lg font-bold nature-heading mb-4">💡 System Recommendations</h3>
                <p className="text-sm nature-subtext mb-4">
                  Based on the interaction analysis, here are AI-generated recommendations to better serve user needs:
                </p>
                <div className="space-y-4">
                  {insights.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-6 bg-purple-50/50 rounded-xl border border-purple-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-red-500 text-white' :
                            rec.priority === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                          }`}>
                            {rec.priority.toUpperCase()} PRIORITY
                          </div>
                          <span className="text-sm text-purple-600 font-medium">
                            {rec.category.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-purple-800 mb-2">{rec.recommendation}</h4>
                      <p className="text-purple-700 text-sm mb-3">{rec.detail}</p>
                      <div className="text-xs text-purple-600 bg-purple-100 px-3 py-1 rounded-full inline-block">
                        Expected Impact: {rec.expectedImpact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Session Analytics */}
        <div className="nature-card bg-white/95 p-8 organic-shape">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold nature-heading flex items-center">
              <Activity className="h-6 w-6 mr-3 text-blue-600" />
              Live Interaction Tracking
            </h2>
            <button
              onClick={() => {
                const sessionAnalytics = userTracker.getSessionAnalytics();
                console.log('Current Session:', sessionAnalytics);
                alert(`Session ID: ${sessionAnalytics.sessionId}\nDuration: ${Math.round(sessionAnalytics.sessionDuration / 1000)}s\nInteractions: ${sessionAnalytics.totalInteractions}`);
              }}
              className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 smooth-transition"
            >
              View Current Session Data
            </button>
          </div>
          
          <p className="text-sm nature-subtext mb-6">
            The JavaScript module is actively tracking your interactions on this page in real-time:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50/50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round((Date.now() - Date.now()) / 1000)}s
              </div>
              <div className="text-sm text-blue-600">Current Session Time</div>
            </div>
            <div className="text-center p-4 bg-green-50/50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-700">Active</div>
              <div className="text-sm text-green-600">JS Module Status</div>
            </div>
            <div className="text-center p-4 bg-purple-50/50 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">Analytics</div>
              <div className="text-sm text-purple-600">Page Being Tracked</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}