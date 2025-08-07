export interface PageView {
  id: string;
  userId: string;
  dashboardId: string;
  dashboardName: string;
  timestamp: Date;
  timeOnPage: number; // in seconds
  clicks: number;
}

export interface DashboardAnalytics {
  dashboardId: string;
  dashboardName: string;
  pageViews: number;
  uniqueUsers: number;
  averageTimeOnPage: number;
  totalClicks: number;
  clickThroughRate: number;
  engagementScore: number;
  recentViews: PageView[];
}

export interface AnalyticsData {
  totalPageViews: number;
  totalUniqueUsers: number;
  averageEngagement: number;
  dashboards: DashboardAnalytics[];
  recentActivity: PageView[];
}