import { AnalyticsData, PageView, DashboardAnalytics } from '../types/analytics';

// Generate mock analytics data
function generateMockPageViews(): PageView[] {
  const dashboards = [
    { id: 'teacher', name: 'Teacher Dashboard' },
    { id: 'ceo', name: 'CEO Dashboard' },
    { id: 'itSpecialist', name: 'IT Specialist Dashboard' },
    { id: 'teamLeader', name: 'Team Leader Dashboard' }
  ];

  const users = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'];
  const views: PageView[] = [];

  // Generate 100 mock page views over the last 30 days
  for (let i = 0; i < 100; i++) {
    const dashboard = dashboards[Math.floor(Math.random() * dashboards.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(Math.floor(Math.random() * 24));
    timestamp.setMinutes(Math.floor(Math.random() * 60));

    views.push({
      id: `view_${i}`,
      userId: user,
      dashboardId: dashboard.id,
      dashboardName: dashboard.name,
      timestamp,
      timeOnPage: Math.floor(Math.random() * 600) + 30, // 30 seconds to 10 minutes
      clicks: Math.floor(Math.random() * 15) // 0-15 clicks
    });
  }

  return views.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
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

    analytics.push({
      dashboardId,
      dashboardName: dashboardViews[0].dashboardName,
      pageViews,
      uniqueUsers,
      averageTimeOnPage,
      totalClicks,
      clickThroughRate,
      engagementScore,
      recentViews: dashboardViews.slice(0, 5)
    });
  });

  return analytics.sort((a, b) => b.engagementScore - a.engagementScore);
}

export function getAnalyticsData(): AnalyticsData {
  const pageViews = generateMockPageViews();
  const dashboards = calculateDashboardAnalytics(pageViews);
  
  return {
    totalPageViews: pageViews.length,
    totalUniqueUsers: new Set(pageViews.map(v => v.userId)).size,
    averageEngagement: dashboards.reduce((sum, d) => sum + d.engagementScore, 0) / dashboards.length,
    dashboards,
    recentActivity: pageViews.slice(0, 20)
  };
}