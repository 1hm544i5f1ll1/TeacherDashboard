import React from 'react';
import { 
  BarChart3, TrendingUp, Users, Clock, MousePointer, 
  Brain, Target, Award, AlertTriangle, CheckCircle,
  ArrowUp, ArrowDown, Minus, Eye, Activity
} from 'lucide-react';
import { AnalyticsData, DashboardAnalytics } from '../types/analytics';

interface KPIChartProps {
  analyticsData: AnalyticsData;
}

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  unit: string;
}

interface AIPrompt {
  role: string;
  kpis: {
    engagement: number;
    pageViews: number;
    timeOnPage: number;
    clickRate: number;
  };
  prompt: string;
  recommendedOrder: string[];
  reasoning: string;
}

export function KPIChart({ analyticsData }: KPIChartProps) {
  // Calculate KPI metrics with simulated changes
  const kpiMetrics: KPIMetric[] = [
    {
      id: 'totalPageViews',
      name: 'Total Page Views',
      value: analyticsData.totalPageViews,
      change: 12.5,
      icon: <Eye className="h-6 w-6" />,
      color: 'blue',
      unit: 'views'
    },
    {
      id: 'uniqueUsers',
      name: 'Unique Users',
      value: analyticsData.totalUniqueUsers,
      change: 8.3,
      icon: <Users className="h-6 w-6" />,
      color: 'green',
      unit: 'users'
    },
    {
      id: 'avgEngagement',
      name: 'Avg Engagement',
      value: analyticsData.averageEngagement,
      change: -2.1,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'purple',
      unit: '%'
    },
    {
      id: 'avgTimeOnPage',
      name: 'Avg Time on Page',
      value: analyticsData.dashboards.reduce((sum, d) => sum + d.averageTimeOnPage, 0) / analyticsData.dashboards.length,
      change: 15.7,
      icon: <Clock className="h-6 w-6" />,
      color: 'orange',
      unit: 's'
    },
    {
      id: 'avgClickRate',
      name: 'Avg Click Rate',
      value: analyticsData.dashboards.reduce((sum, d) => sum + d.clickThroughRate, 0) / analyticsData.dashboards.length,
      change: 5.2,
      icon: <MousePointer className="h-6 w-6" />,
      color: 'red',
      unit: 'clicks'
    },
    {
      id: 'activeUsers',
      name: 'Active Users (24h)',
      value: Math.floor(analyticsData.totalUniqueUsers * 0.65),
      change: 18.9,
      icon: <Activity className="h-6 w-6" />,
      color: 'teal',
      unit: 'users'
    }
  ];

  // Generate AI prompts for different user roles
  const generateAIPrompts = (): AIPrompt[] => {
    const roles = ['Teacher', 'CEO', 'IT Specialist', 'Team Leader'];
    const prompts: AIPrompt[] = [];

    roles.forEach(role => {
      const roleData = analyticsData.dashboards.find(d => d.dashboardName.includes(role));
      if (!roleData) return;

      let prompt = '';
      let recommendedOrder: string[] = [];
      let reasoning = '';

      // AI Logic based on role and KPIs
      if (role === 'Teacher') {
        if (roleData.engagementScore > 70) {
          prompt = `For ${role} with high engagement (${roleData.engagementScore.toFixed(1)}%), prioritize interactive learning tools and student progress tracking. Focus on gradebook and attendance features first.`;
          recommendedOrder = ['Gradebook', 'Attendance', 'Student Analytics', 'Lesson Planning', 'Parent Communication', 'Course Selection'];
          reasoning = 'High engagement indicates active teaching workflow. Prioritize core academic functions.';
        } else {
          prompt = `For ${role} with moderate engagement (${roleData.engagementScore.toFixed(1)}%), simplify interface and highlight most-used features. Start with attendance and communication tools.`;
          recommendedOrder = ['Attendance', 'Parent Communication', 'Gradebook', 'Course Selection', 'Lesson Planning', 'Student Analytics'];
          reasoning = 'Lower engagement suggests need for simplified workflow focusing on essential daily tasks.';
        }
      } else if (role === 'CEO') {
        if (roleData.averageTimeOnPage > 200) {
          prompt = `For ${role} spending ${Math.round(roleData.averageTimeOnPage)}s per session, provide comprehensive analytics dashboard with strategic insights first, followed by team management tools.`;
          recommendedOrder = ['Company Analytics', 'Strategic Planning', 'Financial Planning', 'Team Management', 'Board Meetings', 'Executive Communications'];
          reasoning = 'Extended session time indicates deep analysis needs. Prioritize strategic overview tools.';
        } else {
          prompt = `For ${role} with quick sessions (${Math.round(roleData.averageTimeOnPage)}s), create executive summary view with key metrics upfront and quick action items.`;
          recommendedOrder = ['Executive Communications', 'Company Analytics', 'Team Management', 'Financial Planning', 'Strategic Planning', 'Board Meetings'];
          reasoning = 'Short sessions suggest need for quick decision-making tools and summary views.';
        }
      } else if (role === 'IT Specialist') {
        if (roleData.clickThroughRate > 8) {
          prompt = `For ${role} with high interaction (${roleData.clickThroughRate.toFixed(1)} clicks/session), provide detailed system monitoring and ticket management with advanced controls.`;
          recommendedOrder = ['System Monitoring', 'Ticket System', 'Security Management', 'Software Deployment', 'User Management', 'Help Desk'];
          reasoning = 'High click rate indicates technical user comfortable with detailed interfaces.';
        } else {
          prompt = `For ${role} with standard interaction (${roleData.clickThroughRate.toFixed(1)} clicks/session), streamline critical alerts and automate routine tasks.`;
          recommendedOrder = ['Ticket System', 'Security Management', 'System Monitoring', 'Help Desk', 'User Management', 'Software Deployment'];
          reasoning = 'Standard interaction suggests preference for streamlined, alert-focused interface.';
        }
      } else if (role === 'Team Leader') {
        if (roleData.uniqueUsers > 15) {
          prompt = `For ${role} managing ${roleData.uniqueUsers} team interactions, emphasize team overview and goal tracking with collaborative features.`;
          recommendedOrder = ['Team Overview', 'Goal Tracking', 'Performance Reviews', 'Recognition Program', 'Meeting Scheduler', 'Team Communication'];
          reasoning = 'High team interaction indicates need for comprehensive team management tools.';
        } else {
          prompt = `For ${role} with focused team (${roleData.uniqueUsers} interactions), prioritize direct communication and individual performance tracking.`;
          recommendedOrder = ['Team Communication', 'Performance Reviews', 'Team Overview', 'Meeting Scheduler', 'Goal Tracking', 'Recognition Program'];
          reasoning = 'Focused team size suggests emphasis on direct communication and individual attention.';
        }
      }

      prompts.push({
        role,
        kpis: {
          engagement: roleData.engagementScore,
          pageViews: roleData.pageViews,
          timeOnPage: roleData.averageTimeOnPage,
          clickRate: roleData.clickThroughRate
        },
        prompt,
        recommendedOrder,
        reasoning
      });
    });

    return prompts;
  };

  const aiPrompts = generateAIPrompts();

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-50';
    if (change < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}${unit}`;
    if (unit === 's') return `${Math.round(value)}${unit}`;
    if (unit === 'clicks') return `${value.toFixed(1)}`;
    return Math.round(value).toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* KPI Overview Chart */}
      <div className="nature-card bg-white/95 p-8 organic-shape">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold nature-heading flex items-center">
            <BarChart3 className="h-8 w-8 mr-4 text-green-600" />
            KPI Performance Dashboard
          </h2>
          <div className="text-sm nature-subtext">Real-time metrics • Last 30 days</div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiMetrics.map((metric) => (
            <div key={metric.id} className="p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-green-100 hover:shadow-lg smooth-transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  metric.color === 'green' ? 'bg-green-100 text-green-600' :
                  metric.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  metric.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  metric.color === 'red' ? 'bg-red-100 text-red-600' :
                  'bg-teal-100 text-teal-600'
                }`}>
                  {metric.icon}
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getChangeColor(metric.change)}`}>
                  {getChangeIcon(metric.change)}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
              <div className="text-3xl font-bold nature-heading mb-2">
                {formatValue(metric.value, metric.unit)}
              </div>
              <div className="text-sm nature-subtext font-medium">{metric.name}</div>
            </div>
          ))}
        </div>

        {/* Dashboard Performance Chart */}
        <div className="border-t border-green-100 pt-8">
          <h3 className="text-xl font-bold nature-heading mb-6 flex items-center">
            <Target className="h-6 w-6 mr-3 text-green-600" />
            Dashboard Performance Comparison
          </h3>
          <div className="space-y-4">
            {analyticsData.dashboards.map((dashboard, index) => (
              <div key={dashboard.dashboardId} className="p-4 bg-green-50/30 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-green-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}>
                      #{index + 1}
                    </div>
                    <h4 className="text-lg font-semibold nature-heading">{dashboard.dashboardName}</h4>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    dashboard.engagementScore >= 70 ? 'bg-green-500 text-white' :
                    dashboard.engagementScore >= 50 ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {dashboard.engagementScore.toFixed(1)}% Engagement
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-xl font-bold text-blue-700">{dashboard.pageViews}</div>
                    <div className="text-xs text-blue-600">Page Views</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-xl font-bold text-green-700">{dashboard.uniqueUsers}</div>
                    <div className="text-xs text-green-600">Unique Users</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-xl font-bold text-purple-700">{Math.round(dashboard.averageTimeOnPage)}s</div>
                    <div className="text-xs text-purple-600">Avg Time</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <div className="text-xl font-bold text-orange-700">{dashboard.clickThroughRate.toFixed(1)}</div>
                    <div className="text-xs text-orange-600">Click Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Dashboard Organization Prompts */}
      <div className="nature-card bg-white/95 p-8 organic-shape">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold nature-heading flex items-center">
            <Brain className="h-8 w-8 mr-4 text-purple-600" />
            AI Dashboard Organization
          </h2>
          <div className="text-sm nature-subtext">Intelligent layout recommendations based on user behavior</div>
        </div>

        <div className="space-y-6">
          {aiPrompts.map((aiPrompt, index) => (
            <div key={aiPrompt.role} className="p-6 bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-2xl border border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-green-500' :
                    index === 1 ? 'bg-blue-500' :
                    index === 2 ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}>
                    {aiPrompt.role.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold nature-heading">{aiPrompt.role} Dashboard</h3>
                    <div className="flex items-center space-x-4 text-sm nature-subtext">
                      <span>Engagement: {aiPrompt.kpis.engagement.toFixed(1)}%</span>
                      <span>Views: {aiPrompt.kpis.pageViews}</span>
                      <span>Time: {Math.round(aiPrompt.kpis.timeOnPage)}s</span>
                      <span>Clicks: {aiPrompt.kpis.clickRate.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">AI Generated</span>
                </div>
              </div>

              {/* AI Prompt */}
              <div className="mb-6 p-4 bg-white/70 rounded-xl border-l-4 border-purple-400">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  AI Recommendation
                </h4>
                <p className="text-purple-700 leading-relaxed">{aiPrompt.prompt}</p>
              </div>

              {/* Recommended Dashboard Order */}
              <div className="mb-4">
                <h4 className="font-semibold nature-heading mb-3 flex items-center">
                  <Award className="h-4 w-4 mr-2 text-green-600" />
                  Recommended Dashboard Organization
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {aiPrompt.recommendedOrder.map((item, itemIndex) => (
                    <div key={item} className="flex items-center space-x-3 p-3 bg-white/80 rounded-lg border border-green-100">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {itemIndex + 1}
                      </div>
                      <span className="text-sm font-medium nature-heading">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="p-4 bg-blue-50/50 rounded-xl border-l-4 border-blue-400">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  AI Reasoning
                </h4>
                <p className="text-blue-700 text-sm">{aiPrompt.reasoning}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}