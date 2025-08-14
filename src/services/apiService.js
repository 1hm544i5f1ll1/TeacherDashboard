// Client-side API service for making HTTP requests to the backend
const API_BASE_URL = 'http://localhost:3001/api';

export const apiService = {
  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Store user interactions (for the userInteractionTracker)
  async storeInteractions(interactions, metadata = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interactions),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to store interactions:', error);
      throw error;
    }
  },

  // User interactions
  async trackUserInteraction(interactionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interactionData),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to track user interaction:', error);
      throw error;
    }
  },

  // Get user behavior analysis
  async getUserBehaviorAnalysis(userId = null, timeRange = '7d') {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      params.append('timeRange', timeRange);
      
      const response = await fetch(`${API_BASE_URL}/user-behavior?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get user behavior analysis:', error);
      throw error;
    }
  },

  // Get user list
  async getUserList() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get user list:', error);
      throw error;
    }
  },

  // ChatGPT advice
  async getChatGPTAdvice(question, context = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/chatgpt-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, context }),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to get ChatGPT advice:', error);
      throw error;
    }
  },

  // Get advice history
  async getAdviceHistory(userId, dashboardType = null) {
    try {
      const params = new URLSearchParams({ userId });
      if (dashboardType) params.append('dashboardType', dashboardType);
      
      const response = await fetch(`${API_BASE_URL}/advice-history?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get advice history:', error);
      throw error;
    }
  },

  // Analytics endpoints
  async getAnalyticsData(timeRange = '7d') {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics?timeRange=${timeRange}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get analytics data:', error);
      throw error;
    }
  },

  // Attendance tracking
  async trackAttendance(attendanceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to track attendance:', error);
      throw error;
    }
  },

  // Course selection tracking
  async trackCourseSelection(courseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/course-selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to track course selection:', error);
      throw error;
    }
  }
};

export default apiService;