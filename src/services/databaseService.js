/**
 * Database Service for User Interactions
 * Handles database operations for storing and analyzing user interaction data
 */

class DatabaseService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    this.isConnected = false;
  }

  /**
   * Initialize database connection
   */
  async initialize() {
    try {
      console.log('📊 Initializing Database Service...');
      
      // Test connection
      const response = await fetch(`${this.apiUrl}/api/health`);
      if (response.ok) {
        this.isConnected = true;
        console.log('✅ Database Service connected successfully');
        return true;
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Store user interactions in database with clean data format
   */
  async storeInteractions(interactions, metadata = {}) {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      // Clean and format interactions for MySQL database
      const cleanInteractions = interactions.map(interaction => {
        const cleanInteraction = {
          type: this.mapEventType(interaction.type),
          url: interaction.url || metadata.url,
          duration_ms: interaction.duration || 0,
          scroll_pct: interaction.maxDepth || null,
          action: interaction.action || interaction.type,
          elem_ref: interaction.elementRef || null,
          x: interaction.x || null,
          y: interaction.y || null,
          media_pos_ms: interaction.mediaPosition || null,
          zoom_pct: interaction.zoomLevel || null,
          downloaded: interaction.downloaded || false,
          props: JSON.stringify({
            count: interaction.count || 1,
            timestamp: interaction.timestamp,
            userAgent: metadata.userAgent,
            sessionId: metadata.sessionId,
            userId: metadata.userId,
            userRole: metadata.userRole,
            userName: metadata.userName
          })
        };
        
        return cleanInteraction;
      });

      const response = await fetch(`${this.apiUrl}/api/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interactions: cleanInteractions,
          metadata: {
            sessionId: metadata.sessionId,
            userId: metadata.userId,
            userRole: metadata.userRole,
            userName: metadata.userName,
            url: metadata.url,
            userAgent: metadata.userAgent,
            timestamp: Date.now()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`💾 Stored ${cleanInteractions.length} interactions in database`);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to store interactions:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Map interaction types to database event types
   */
  mapEventType(interactionType) {
    const typeMap = {
      'click': 'click',
      'pageview': 'pageview',
      'scroll': 'scroll',
      'form': 'custom',
      'form_focus': 'custom',
      'form_input': 'custom',
      'form_change': 'custom',
      'form_submit': 'custom',
      'hover': 'custom',
      'keydown': 'custom',
      'keyup': 'custom',
      'drag_start': 'custom',
      'drop': 'custom',
      'media_play': 'play',
      'media_pause': 'pause',
      'media_seek': 'custom',
      'media_volume_change': 'custom',
      'media_fullscreen_change': 'custom',
      'media_time_update': 'custom',
      'media_ended': 'custom',
      'media_error': 'custom',
      'image_click': 'custom',
      'image_load': 'custom',
      'image_error': 'custom',
      'image_right_click': 'custom',
      'image_double_click': 'custom',
      'element_visible': 'custom',
      'element_hidden': 'custom',
      'page_visibility_change': 'custom',
      'window_resize': 'custom',
      'page_unload': 'custom',
      'attendance_change': 'custom'
    };
    
    return typeMap[interactionType] || 'custom';
  }

  /**
   * Get user behavior analysis from database
   */
  async analyzeUserBehavior(userId = null, timeRange = '7d') {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (timeRange) params.append('timeRange', timeRange);

      const response = await fetch(`${this.apiUrl}/api/analytics?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const analysis = await response.json();
      console.log('📊 User behavior analysis completed:', analysis);
      return analysis;
      
    } catch (error) {
      console.error('❌ Failed to analyze user behavior:', error);
      return null;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      apiUrl: this.apiUrl
    };
  }

  /**
   * Test database connection
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.apiUrl}/api/health`);
      this.isConnected = response.ok;
      return {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Connected' : 'Connection failed'
      };
    } catch (error) {
      this.isConnected = false;
      return {
        success: false,
        status: 0,
        message: error.message
      };
    }
  }
}

// Export singleton instance
export const dbService = new DatabaseService();

// Export class for testing
export { DatabaseService };