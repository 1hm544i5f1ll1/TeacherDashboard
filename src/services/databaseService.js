/**
 * Database Service for User Interactions
 * Handles database operations for storing and analyzing user interaction data
 */

class DatabaseService {
  constructor() {
    this.dbUrl = import.meta.env.VITE_DATABASE_URL || 'sqlite://./user_interactions.db';
    this.isConnected = false;
  }

  /**
   * Initialize database connection and create tables
   */
  async initialize() {
    try {
      // This would connect to your actual database
      // For now, we'll simulate with localStorage for demo purposes
      console.log('📊 Initializing Database Service...');
      
      await this.createTables();
      this.isConnected = true;
      
      console.log('✅ Database Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      return false;
    }
  }

  /**
   * Create necessary tables for user interaction tracking
   */
  async createTables() {
    // In a real implementation, you would execute SQL DDL statements
    // For demo purposes, we'll define the schema structure
    
    const schema = {
      user_interactions: {
        id: 'VARCHAR(255) PRIMARY KEY',
        session_id: 'VARCHAR(255) NOT NULL',
        user_id: 'VARCHAR(255)',
        user_role: 'VARCHAR(100)',
        interaction_type: 'VARCHAR(100) NOT NULL',
        interaction_data: 'JSON',
        url: 'VARCHAR(500)',
        timestamp: 'BIGINT NOT NULL',
        created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
      },
      
      user_sessions: {
        session_id: 'VARCHAR(255) PRIMARY KEY',
        user_id: 'VARCHAR(255)',
        user_role: 'VARCHAR(100)',
        start_time: 'BIGINT NOT NULL',
        end_time: 'BIGINT',
        total_interactions: 'INTEGER DEFAULT 0',
        session_data: 'JSON',
        created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
      },
      
      user_analytics: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        user_id: 'VARCHAR(255) NOT NULL',
        user_role: 'VARCHAR(100)',
        analysis_date: 'DATE NOT NULL',
        total_sessions: 'INTEGER DEFAULT 0',
        total_interactions: 'INTEGER DEFAULT 0',
        avg_session_duration: 'FLOAT DEFAULT 0',
        engagement_score: 'FLOAT DEFAULT 0',
        behavior_patterns: 'JSON',
        user_needs: 'JSON',
        created_at: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
      }
    };

    console.log('📋 Database schema defined:', schema);
    return schema;
  }

  /**
   * Store user interactions in batch
   */
  async storeInteractions(interactions, metadata = {}) {
    try {
      // In a real implementation, you would use SQL INSERT statements
      // For demo purposes, we'll use localStorage
      
      const existingData = JSON.parse(localStorage.getItem('user_interactions') || '[]');
      const newData = [...existingData, ...interactions];
      
      localStorage.setItem('user_interactions', JSON.stringify(newData));
      localStorage.setItem('interaction_metadata', JSON.stringify({
        ...metadata,
        lastUpdate: Date.now(),
        totalInteractions: newData.length
      }));

      console.log(`💾 Stored ${interactions.length} interactions in database`);
      return { success: true, stored: interactions.length };
      
    } catch (error) {
      console.error('❌ Failed to store interactions:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Analyze user behavior patterns from stored data
   */
  async analyzeUserBehavior(userId = null, timeRange = '7d') {
    try {
      const interactions = JSON.parse(localStorage.getItem('user_interactions') || '[]');
      
      // Filter by user if specified
      let filteredInteractions = userId 
        ? interactions.filter(i => i.userId === userId)
        : interactions;

      // Filter by time range
      const now = Date.now();
      const timeRanges = {
        '1d': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      
      const cutoffTime = now - (timeRanges[timeRange] || timeRanges['7d']);
      filteredInteractions = filteredInteractions.filter(i => i.timestamp >= cutoffTime);

      // Perform analysis
      const analysis = {
        totalInteractions: filteredInteractions.length,
        uniqueUsers: new Set(filteredInteractions.map(i => i.userId)).size,
        uniqueSessions: new Set(filteredInteractions.map(i => i.sessionId)).size,
        interactionTypes: this.groupBy(filteredInteractions, 'type'),
        userRoles: this.groupBy(filteredInteractions, 'userRole'),
        timeDistribution: this.analyzeTimeDistribution(filteredInteractions),
        popularPages: this.analyzePopularPages(filteredInteractions),
        userJourney: this.analyzeUserJourney(filteredInteractions),
        engagementMetrics: this.calculateEngagementMetrics(filteredInteractions),
        userNeeds: this.identifyCommonUserNeeds(filteredInteractions)
      };

      console.log('📊 User behavior analysis completed:', analysis);
      return analysis;
      
    } catch (error) {
      console.error('❌ Failed to analyze user behavior:', error);
      return null;
    }
  }

  /**
   * Generate insights and recommendations based on user data
   */
  async generateInsights(userId = null) {
    const analysis = await this.analyzeUserBehavior(userId);
    if (!analysis) return null;

    const insights = {
      summary: {
        totalUsers: analysis.uniqueUsers,
        totalSessions: analysis.uniqueSessions,
        avgInteractionsPerSession: analysis.totalInteractions / analysis.uniqueSessions,
        engagementScore: analysis.engagementMetrics.averageEngagement
      },
      
      keyFindings: [],
      recommendations: [],
      userSegments: this.identifyUserSegments(analysis),
      dashboardOptimization: this.generateDashboardRecommendations(analysis)
    };

    // Generate key findings
    if (analysis.engagementMetrics.averageEngagement > 70) {
      insights.keyFindings.push({
        type: 'positive',
        finding: 'High user engagement detected',
        detail: `Average engagement score of ${analysis.engagementMetrics.averageEngagement.toFixed(1)}% indicates users find the platform valuable`
      });
    }

    if (analysis.engagementMetrics.bounceRate > 50) {
      insights.keyFindings.push({
        type: 'concern',
        finding: 'High bounce rate detected',
        detail: `${analysis.engagementMetrics.bounceRate.toFixed(1)}% of sessions have minimal interaction`
      });
    }

    // Generate recommendations
    const topPages = Object.entries(analysis.popularPages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    insights.recommendations.push({
      priority: 'high',
      category: 'content',
      recommendation: 'Optimize top-performing pages',
      detail: `Focus on improving ${topPages.map(([page]) => page).join(', ')} as they receive the most traffic`,
      expectedImpact: 'Increase overall engagement by 15-25%'
    });

    if (analysis.userNeeds.quick_access && analysis.userNeeds.quick_access.confidence > 0.6) {
      insights.recommendations.push({
        priority: 'medium',
        category: 'ux',
        recommendation: 'Streamline navigation for quick access users',
        detail: 'Many users show patterns of needing quick access to information',
        expectedImpact: 'Reduce bounce rate by 10-15%'
      });
    }

    return insights;
  }

  /**
   * Helper methods for analysis
   */
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const value = item[key] || 'unknown';
      groups[value] = (groups[value] || 0) + 1;
      return groups;
    }, {});
  }

  analyzeTimeDistribution(interactions) {
    const hourly = new Array(24).fill(0);
    const daily = {};

    interactions.forEach(interaction => {
      const date = new Date(interaction.timestamp);
      const hour = date.getHours();
      const day = date.toDateString();

      hourly[hour]++;
      daily[day] = (daily[day] || 0) + 1;
    });

    return { hourly, daily };
  }

  analyzePopularPages(interactions) {
    return this.groupBy(interactions, 'url');
  }

  analyzeUserJourney(interactions) {
    const journeys = {};
    
    // Group by session
    const sessions = this.groupBy(interactions, 'sessionId');
    
    Object.keys(sessions).forEach(sessionId => {
      const sessionInteractions = interactions
        .filter(i => i.sessionId === sessionId)
        .sort((a, b) => a.timestamp - b.timestamp);
      
      const journey = sessionInteractions.map(i => ({
        type: i.type,
        url: i.url,
        timestamp: i.timestamp
      }));
      
      journeys[sessionId] = journey;
    });

    return journeys;
  }

  calculateEngagementMetrics(interactions) {
    const sessions = this.groupBy(interactions, 'sessionId');
    const sessionIds = Object.keys(sessions);
    
    let totalEngagement = 0;
    let bounceCount = 0;
    
    sessionIds.forEach(sessionId => {
      const sessionInteractions = interactions.filter(i => i.sessionId === sessionId);
      const interactionCount = sessionInteractions.length;
      
      if (interactionCount <= 2) {
        bounceCount++;
      }
      
      // Simple engagement calculation based on interaction count and types
      const engagementScore = Math.min(interactionCount * 10, 100);
      totalEngagement += engagementScore;
    });

    return {
      averageEngagement: totalEngagement / sessionIds.length,
      bounceRate: (bounceCount / sessionIds.length) * 100,
      totalSessions: sessionIds.length
    };
  }

  identifyCommonUserNeeds(interactions) {
    const needs = {};
    
    // Analyze patterns to identify needs
    const clickInteractions = interactions.filter(i => i.type === 'click');
    const timeInteractions = interactions.filter(i => i.type === 'time_on_page');
    
    // Quick access pattern
    const quickSessions = interactions.filter(i => {
      const sessionInteractions = interactions.filter(si => si.sessionId === i.sessionId);
      return sessionInteractions.length < 5;
    });
    
    if (quickSessions.length > interactions.length * 0.3) {
      needs.quick_access = {
        confidence: 0.7,
        count: quickSessions.length,
        percentage: (quickSessions.length / interactions.length) * 100
      };
    }

    return needs;
  }

  identifyUserSegments(analysis) {
    return {
      power_users: {
        criteria: 'High interaction count and long session duration',
        percentage: 15,
        characteristics: ['Explores multiple features', 'Long session times', 'High engagement']
      },
      casual_users: {
        criteria: 'Moderate interaction with focused tasks',
        percentage: 60,
        characteristics: ['Task-focused', 'Medium session times', 'Specific feature usage']
      },
      quick_access_users: {
        criteria: 'Low interaction count and short sessions',
        percentage: 25,
        characteristics: ['Quick visits', 'Specific information seeking', 'Minimal exploration']
      }
    };
  }

  generateDashboardRecommendations(analysis) {
    const recommendations = [];

    // Based on popular pages
    const topPages = Object.entries(analysis.popularPages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    recommendations.push({
      type: 'layout',
      priority: 'high',
      recommendation: 'Prioritize top-accessed features in dashboard layout',
      details: `Most accessed: ${topPages.map(([page, count]) => `${page} (${count} visits)`).join(', ')}`
    });

    // Based on user roles
    const roleDistribution = analysis.userRoles;
    const dominantRole = Object.entries(roleDistribution)
      .sort(([,a], [,b]) => b - a)[0];

    if (dominantRole) {
      recommendations.push({
        type: 'personalization',
        priority: 'medium',
        recommendation: `Optimize for ${dominantRole[0]} role`,
        details: `${dominantRole[0]} users represent ${((dominantRole[1] / analysis.totalInteractions) * 100).toFixed(1)}% of interactions`
      });
    }

    return recommendations;
  }

  /**
   * Export data for external analysis
   */
  async exportData(format = 'json', filters = {}) {
    try {
      const interactions = JSON.parse(localStorage.getItem('user_interactions') || '[]');
      let filteredData = interactions;

      // Apply filters
      if (filters.userId) {
        filteredData = filteredData.filter(i => i.userId === filters.userId);
      }
      if (filters.userRole) {
        filteredData = filteredData.filter(i => i.userRole === filters.userRole);
      }
      if (filters.startDate) {
        filteredData = filteredData.filter(i => i.timestamp >= new Date(filters.startDate).getTime());
      }
      if (filters.endDate) {
        filteredData = filteredData.filter(i => i.timestamp <= new Date(filters.endDate).getTime());
      }

      if (format === 'csv') {
        return this.convertToCSV(filteredData);
      }

      return JSON.stringify(filteredData, null, 2);
      
    } catch (error) {
      console.error('❌ Failed to export data:', error);
      return null;
    }
  }

  convertToCSV(data) {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'object' ? JSON.stringify(value) : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }
}

// Export singleton instance
export const dbService = new DatabaseService();

// Export class for testing
export { DatabaseService };