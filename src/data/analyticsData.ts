import { AnalyticsData, PageView, DashboardAnalytics, UserAnalytics } from '../types/analytics';

// Simulate AI recommendations based on KPIs
function generateAIRecommendations(dashboards: DashboardAnalytics[]): any[] {
  const recommendations = [];
  
  // Sort dashboards by different KPIs for AI analysis
  const sortedByEngagement = [...dashboards].sort((a, b) => b.engagementScore - a.engagementScore);
  const sortedByPageViews = [...dashboards].sort((a, b) => b.pageViews - a.pageViews);
  const sortedByTimeOnPage = [...dashboards].sort((a, b) => b.averageTimeOnPage - a.averageTimeOnPage);
  
  dashboards.forEach((dashboard, index) => {
    let priority: 'high' | 'medium' | 'low' = 'medium';
    let recommendation = '';
    let reasoning = '';
    let kpiImpact = '';
    let suggestedActions: string[] = [];
    let confidence = 75;
    
    // AI Logic: Analyze performance patterns
    if (dashboard.engagementScore < 40) {
      priority = 'high';
      recommendation = 'Critical: Redesign dashboard content and improve user experience';
      reasoning = `Low engagement score (${dashboard.engagementScore.toFixed(1)}%) indicates users are not finding value. Average time on page is ${Math.round(dashboard.averageTimeOnPage)}s which is below optimal.`;
      kpiImpact = 'High impact on user retention and platform adoption';
      suggestedActions = [
        'Conduct user interviews to identify pain points',
        'Redesign dashboard layout for better usability',
        'Add interactive tutorials or onboarding',
        'Implement gamification elements'
      ];
      confidence = 85;
    } else if (dashboard.engagementScore > 70) {
      priority = 'low';
      recommendation = 'Optimize: Leverage high performance to boost other dashboards';
      reasoning = `Excellent engagement score (${dashboard.engagementScore.toFixed(1)}%) with ${dashboard.pageViews} page views. Users spend an average of ${Math.round(dashboard.averageTimeOnPage)}s engaged.`;
      kpiImpact = 'Use as template for improving underperforming dashboards';
      suggestedActions = [
        'Document successful design patterns',
        'A/B test features with other dashboards',
        'Create user success stories',
        'Expand similar functionality'
      ];
      confidence = 90;
    } else if (dashboard.averageTimeOnPage < 120) {
      priority = 'medium';
      recommendation = 'Improve: Increase content engagement and time on page';
      reasoning = `Moderate engagement (${dashboard.engagementScore.toFixed(1)}%) but low time on page (${Math.round(dashboard.averageTimeOnPage)}s). Users visit but don't stay long.`;
      kpiImpact = 'Medium impact on user satisfaction and feature adoption';
      suggestedActions = [
        'Add more interactive content',
        'Implement progress tracking',
        'Create guided workflows',
        'Add contextual help and tips'
      ];
      confidence = 80;
    } else {
      recommendation = 'Monitor: Maintain current performance levels';
      reasoning = `Balanced performance with ${dashboard.engagementScore.toFixed(1)}% engagement. ${dashboard.uniqueUsers} unique users are actively using this dashboard.`;
      kpiImpact = 'Stable performance contributing to overall platform health';
      suggestedActions = [
        'Continue monitoring key metrics',
        'Gather user feedback regularly',
        'Make incremental improvements',
        'Test new features carefully'
      ];
      confidence = 75;
    }
    
    recommendations.push({
      id: `rec_${dashboard.dashboardId}`,
      dashboardId: dashboard.dashboardId,
      dashboardName: dashboard.dashboardName,
      priority,
      recommendation,
      reasoning,
      kpiImpact,
      suggestedActions,
      confidence
    });
  });
  
  // Sort recommendations by priority (high -> medium -> low) then by confidence
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.confidence - a.confidence;
  });
}

// Generate mock analytics data
function generateMockPageViews(): PageView[] {
  const dashboards = [
    { id: 'teacher', name: 'Teacher Dashboard' },
    { id: 'ceo', name: 'CEO Dashboard' },
    { id: 'itSpecialist', name: 'IT Specialist Dashboard' },
    { id: 'teamLeader', name: 'Team Leader Dashboard' }
  ];

  const users = [
    { id: 'user1', name: 'Sarah Mitchell' },
    { id: 'user2', name: 'David Chen' },
    { id: 'user3', name: 'Emma Rodriguez' },
    { id: 'user4', name: 'Michael Johnson' },
    { id: 'user5', name: 'Lisa Thompson' },
    { id: 'user6', name: 'James Wilson' },
    { id: 'user7', name: 'Maria Garcia' },
    { id: 'user8', name: 'Robert Davis' }
  ];
  const views: PageView[] = [];

  // Generate 150 mock page views over the last 30 days
  for (let i = 0; i < 150; i++) {
    const dashboard = dashboards[Math.floor(Math.random() * dashboards.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(Math.floor(Math.random() * 24));
    timestamp.setMinutes(Math.floor(Math.random() * 60));

    views.push({
      id: `view_${i}`,
      userId: user.id,
      userName: user.name,
      dashboardId: dashboard.id,
      dashboardName: dashboard.name,
      timestamp,
      timeOnPage: Math.floor(Math.random() * 600) + 30, // 30 seconds to 10 minutes
      clicks: Math.floor(Math.random() * 15) // 0-15 clicks
    });
  }

  return views.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function calculateUserAnalytics(views: PageView[]): UserAnalytics[] {
  const userMap = new Map<string, PageView[]>();
  
  // Group views by user
  views.forEach(view => {
    if (!userMap.has(view.userId)) {
      userMap.set(view.userId, []);
    }
    userMap.get(view.userId)!.push(view);
  });

  const userAnalytics: UserAnalytics[] = [];

  userMap.forEach((userViews, userId) => {
    const totalPageViews = userViews.length;
    const totalTimeOnPage = userViews.reduce((sum, v) => sum + v.timeOnPage, 0);
    const averageTimeOnPage = totalTimeOnPage / totalPageViews;
    const totalClicks = userViews.reduce((sum, v) => sum + v.clicks, 0);
    const averageClicksPerSession = totalClicks / totalPageViews;
    
    // Get unique dashboards visited
    const dashboardsVisited = [...new Set(userViews.map(v => v.dashboardName))];
    
    // Find most visited dashboard
    const dashboardCounts = new Map<string, number>();
    userViews.forEach(view => {
      dashboardCounts.set(view.dashboardName, (dashboardCounts.get(view.dashboardName) || 0) + 1);
    });
    const mostVisitedDashboard = [...dashboardCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    
    // Calculate engagement score: PV×0.2 + TTP×0.5 + CTR×0.3
    const normalizedPV = Math.min(totalPageViews / 20, 1); // Normalize to 0-1 scale
    const normalizedTTP = Math.min(averageTimeOnPage / 300, 1); // Normalize to 0-1 scale (5 min max)
    const normalizedCTR = Math.min(averageClicksPerSession / 10, 1); // Normalize to 0-1 scale
    const engagementScore = (normalizedPV * 0.2 + normalizedTTP * 0.5 + normalizedCTR * 0.3) * 100;

    userAnalytics.push({
      userId,
      userName: userViews[0].userName,
      totalPageViews,
      totalTimeOnPage,
      averageTimeOnPage,
      totalClicks,
      averageClicksPerSession,
      engagementScore,
      dashboardsVisited,
      mostVisitedDashboard,
      lastActivity: userViews[0].timestamp, // Most recent activity (views are sorted)
      sessions: userViews.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    });
  });

  return userAnalytics.sort((a, b) => b.engagementScore - a.engagementScore);
}

function calculateDashboardAnalytics(views: PageView[]): DashboardAnalytics[] {
  const dashboardMap = new Map<string, PageView[]>();
  
  // Group views by dashboard
  views.forEach(view => {
    if (!dashboardMap.has(view.dashboardId)) {
      dashboardMap.set(view.dashboardId, []);
    }
    dashboardMap.get(view.dashboardId)!.push(view);
  });

  const analytics: DashboardAnalytics[] = [];
  const allUsers = calculateUserAnalytics(views);

  dashboardMap.forEach((dashboardViews, dashboardId) => {
    const pageViews = dashboardViews.length;
    const uniqueUsers = new Set(dashboardViews.map(v => v.userId)).size;
    const totalTimeOnPage = dashboardViews.reduce((sum, v) => sum + v.timeOnPage, 0);
    const averageTimeOnPage = totalTimeOnPage / pageViews;
    const totalClicks = dashboardViews.reduce((sum, v) => sum + v.clicks, 0);
    const clickThroughRate = totalClicks / pageViews;
    
    // Engagement Score: PV×0.2 + TTP×0.5 + CTR×0.3
    const normalizedPV = Math.min(pageViews / 50, 1); // Normalize to 0-1 scale
    const normalizedTTP = Math.min(averageTimeOnPage / 300, 1); // Normalize to 0-1 scale (5 min max)
    const normalizedCTR = Math.min(clickThroughRate / 10, 1); // Normalize to 0-1 scale
    const engagementScore = (normalizedPV * 0.2 + normalizedTTP * 0.5 + normalizedCTR * 0.3) * 100;

    // Get top users for this dashboard
    const dashboardUsers = allUsers.filter(user => 
      user.sessions.some(session => session.dashboardId === dashboardId)
    ).slice(0, 5);

    analytics.push({
      dashboardId,
      dashboardName: dashboardViews[0].dashboardName,
      pageViews,
      uniqueUsers,
      averageTimeOnPage,
      totalClicks,
      clickThroughRate,
      engagementScore,
      recentViews: dashboardViews.slice(0, 5),
      topUsers: dashboardUsers
    });
  });

  return analytics.sort((a, b) => b.engagementScore - a.engagementScore);
}

export function getAnalyticsData(): AnalyticsData {
  const pageViews = generateMockPageViews();
  const dashboards = calculateDashboardAnalytics(pageViews);
  const users = calculateUserAnalytics(pageViews);
  
  return {
    totalPageViews: pageViews.length,
    totalUniqueUsers: new Set(pageViews.map(v => v.userId)).size,
    averageEngagement: dashboards.reduce((sum, d) => sum + d.engagementScore, 0) / dashboards.length,
    dashboards,
    recentActivity: pageViews.slice(0, 20),
    users,
    topPerformers: users.slice(0, 10),
    aiRecommendations: generateAIRecommendations(dashboards)
  };
}