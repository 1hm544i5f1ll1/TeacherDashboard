export interface PageView {
  id: string;
  userId: string;
  userName: string;
  dashboardId: string;
  dashboardName: string;
  timestamp: Date;
  timeOnPage: number; // in seconds
  clicks: number;
}

export interface UserAnalytics {
  userId: string;
  userName: string;
  totalPageViews: number;
  totalTimeOnPage: number;
  averageTimeOnPage: number;
  totalClicks: number;
  averageClicksPerSession: number;
  engagementScore: number;
  dashboardsVisited: string[];
  mostVisitedDashboard: string;
  lastActivity: Date;
  sessions: PageView[];
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
  topUsers: UserAnalytics[];
}

export interface AnalyticsData {
  totalPageViews: number;
  totalUniqueUsers: number;
  averageEngagement: number;
  dashboards: DashboardAnalytics[];
  recentActivity: PageView[];
  users: UserAnalytics[];
  topPerformers: UserAnalytics[];
  aiRecommendations: AIRecommendation[];
}

export interface AIRecommendation {
  id: string;
  dashboardId: string;
  dashboardName: string;
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
  reasoning: string;
  kpiImpact: string;
  suggestedActions: string[];
  confidence: number; // 0-100
}