/**
 * User Flow Tracking System
 * Tracks session ID, time spent, clicks, scroll depth, and user interactions
 * Includes MySQL database placeholder functions
 */

class UserFlowTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.userName = null;
    this.userRole = null;
    this.currentPage = null;
    this.pageStartTime = null;
    this.sessionStartTime = Date.now();
    this.totalClicks = 0;
    this.maxScrollDepth = 0;
    this.currentScrollDepth = 0;
    this.pageViews = [];
    this.clickEvents = [];
    this.scrollEvents = [];
    this.navigationHistory = [];
    this.isTracking = false;
    
    // Bind methods
    this.handleClick = this.handleClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
  }

  /**
   * Initialize tracking for a user session
   */
  init(userId, userName, userRole) {
    this.userId = userId;
    this.userName = userName;
    this.userRole = userRole;
    this.isTracking = true;
    
    console.log(`🔍 User Flow Tracking initialized for ${userName} (${userRole})`);
    console.log(`📊 Session ID: ${this.sessionId}`);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Track session start
    this.trackEvent('session_start', {
      sessionId: this.sessionId,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });
  }

  /**
   * Set up event listeners for tracking
   */
  setupEventListeners() {
    // Click tracking
    document.addEventListener('click', this.handleClick, true);
    
    // Scroll tracking (throttled)
    let scrollTimeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(this.handleScroll, 100);
    }, { passive: true });

    // Page unload tracking
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  /**
   * Start tracking a new page
   */
  startPageTracking(pageName, pageUrl = window.location.pathname) {
    // End previous page tracking if exists
    if (this.currentPage && this.pageStartTime) {
      this.endPageTracking();
    }

    this.currentPage = pageName;
    this.pageStartTime = Date.now();
    this.maxScrollDepth = 0;
    this.currentScrollDepth = 0;

    const pageView = {
      page: pageName,
      url: pageUrl,
      startTime: this.pageStartTime,
      sessionId: this.sessionId,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole
    };

    this.pageViews.push(pageView);
    this.navigationHistory.push({
      action: 'page_enter',
      page: pageName,
      timestamp: this.pageStartTime
    });

    console.log(`📄 Started tracking page: ${pageName}`);
    
    this.trackEvent('page_view', pageView);
  }

  /**
   * End tracking for current page
   */
  endPageTracking() {
    if (!this.currentPage || !this.pageStartTime) return;

    const timeSpent = Date.now() - this.pageStartTime;
    const pageData = {
      page: this.currentPage,
      timeSpent: timeSpent,
      maxScrollDepth: this.maxScrollDepth,
      clicksOnPage: this.clickEvents.filter(c => c.page === this.currentPage).length,
      endTime: Date.now(),
      sessionId: this.sessionId
    };

    // Update the page view record
    const pageViewIndex = this.pageViews.findIndex(pv => 
      pv.page === this.currentPage && pv.startTime === this.pageStartTime
    );
    if (pageViewIndex !== -1) {
      this.pageViews[pageViewIndex] = { ...this.pageViews[pageViewIndex], ...pageData };
    }

    this.navigationHistory.push({
      action: 'page_exit',
      page: this.currentPage,
      timestamp: Date.now(),
      timeSpent: timeSpent
    });

    console.log(`📄 Ended tracking page: ${this.currentPage} (${(timeSpent / 1000).toFixed(1)}s)`);
    
    this.trackEvent('page_exit', pageData);
    
    this.currentPage = null;
    this.pageStartTime = null;
  }

  /**
   * Handle click events
   */
  handleClick(event) {
    if (!this.isTracking) return;

    this.totalClicks++;
    const clickData = {
      sessionId: this.sessionId,
      page: this.currentPage,
      timestamp: Date.now(),
      clickNumber: this.totalClicks,
      element: {
        tagName: event.target.tagName,
        id: event.target.id || null,
        className: event.target.className || null,
        textContent: event.target.textContent?.substring(0, 100) || null
      },
      coordinates: {
        x: event.clientX,
        y: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.clickEvents.push(clickData);
    this.trackEvent('click', clickData);
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    if (!this.isTracking) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
    
    this.currentScrollDepth = scrollPercentage;
    if (scrollPercentage > this.maxScrollDepth) {
      this.maxScrollDepth = scrollPercentage;
    }

    const scrollData = {
      sessionId: this.sessionId,
      page: this.currentPage,
      timestamp: Date.now(),
      scrollPercentage: scrollPercentage,
      maxScrollDepth: this.maxScrollDepth,
      scrollTop: scrollTop,
      documentHeight: documentHeight + window.innerHeight
    };

    this.scrollEvents.push(scrollData);
    this.trackEvent('scroll', scrollData);
  }

  /**
   * Handle page unload
   */
  handleBeforeUnload() {
    this.endPageTracking();
    this.trackEvent('session_end', this.getSessionSummary());
  }

  /**
   * Track custom events
   */
  trackEvent(eventType, eventData) {
    const event = {
      type: eventType,
      sessionId: this.sessionId,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      timestamp: Date.now(),
      data: eventData
    };

    // This would normally send to database
    this.sendToDatabase(event);
  }

  /**
   * Get comprehensive session summary
   */
  getSessionSummary() {
    const sessionDuration = Date.now() - this.sessionStartTime;
    
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      sessionStartTime: this.sessionStartTime,
      sessionDuration: sessionDuration,
      totalClicks: this.totalClicks,
      maxScrollDepth: this.maxScrollDepth,
      pagesVisited: this.pageViews.length,
      pageViews: this.pageViews,
      navigationHistory: this.navigationHistory,
      clickEvents: this.clickEvents.length,
      scrollEvents: this.scrollEvents.length,
      averageTimePerPage: this.pageViews.length > 0 ? 
        this.pageViews.reduce((sum, pv) => sum + (pv.timeSpent || 0), 0) / this.pageViews.length : 0,
      mostVisitedPage: this.getMostVisitedPage(),
      clickHeatmap: this.generateClickHeatmap(),
      userBehaviorPattern: this.analyzeUserBehavior()
    };
  }

  /**
   * Display session summary on screen
   */
  displaySessionSummary() {
    const summary = this.getSessionSummary();
    
    console.log('🎯 USER FLOW TRACKING SUMMARY');
    console.log('================================');
    console.log(`Session ID: ${summary.sessionId}`);
    console.log(`User: ${summary.userName} (${summary.userRole})`);
    console.log(`Session Duration: ${(summary.sessionDuration / 1000).toFixed(1)} seconds`);
    console.log(`Total Clicks: ${summary.totalClicks}`);
    console.log(`Max Scroll Depth: ${summary.maxScrollDepth}%`);
    console.log(`Pages Visited: ${summary.pagesVisited}`);
    console.log(`Average Time Per Page: ${(summary.averageTimePerPage / 1000).toFixed(1)} seconds`);
    console.log('');
    console.log('📄 PAGE VIEWS:');
    summary.pageViews.forEach((pv, index) => {
      console.log(`  ${index + 1}. ${pv.page} - ${pv.timeSpent ? (pv.timeSpent / 1000).toFixed(1) : '?'}s`);
    });
    console.log('');
    console.log('🖱️ CLICK PATTERN:', summary.clickHeatmap);
    console.log('🧠 USER BEHAVIOR:', summary.userBehaviorPattern);
    
    // Also display in a nice alert for user to see
    const alertMessage = `
🎯 USER FLOW TRACKING SUMMARY
================================
Session ID: ${summary.sessionId}
User: ${summary.userName} (${summary.userRole})
Session Duration: ${(summary.sessionDuration / 1000).toFixed(1)} seconds
Total Clicks: ${summary.totalClicks}
Max Scroll Depth: ${summary.maxScrollDepth}%
Pages Visited: ${summary.pagesVisited}
Average Time Per Page: ${(summary.averageTimePerPage / 1000).toFixed(1)} seconds

📄 PAGE VIEWS:
${summary.pageViews.map((pv, i) => `${i + 1}. ${pv.page} - ${pv.timeSpent ? (pv.timeSpent / 1000).toFixed(1) : '?'}s`).join('\n')}

🧠 USER BEHAVIOR: ${summary.userBehaviorPattern}
    `;
    
    alert(alertMessage);
    
    return summary;
  }

  /**
   * Analyze user behavior patterns
   */
  analyzeUserBehavior() {
    const sessionDuration = Date.now() - this.sessionStartTime;
    
    if (sessionDuration > 300000) { // 5+ minutes
      return 'Deep Explorer - Spends significant time exploring features';
    } else if (this.totalClicks > 20) {
      return 'Active User - High interaction with interface elements';
    } else if (this.maxScrollDepth > 80) {
      return 'Content Consumer - Reads through most of the content';
    } else if (sessionDuration < 60000) { // Less than 1 minute
      return 'Quick Visitor - Brief interaction, likely task-focused';
    } else {
      return 'Balanced User - Moderate engagement across features';
    }
  }

  /**
   * Get most visited page
   */
  getMostVisitedPage() {
    const pageCounts = {};
    this.pageViews.forEach(pv => {
      pageCounts[pv.page] = (pageCounts[pv.page] || 0) + 1;
    });
    
    return Object.keys(pageCounts).reduce((a, b) => 
      pageCounts[a] > pageCounts[b] ? a : b, 'None'
    );
  }

  /**
   * Generate click heatmap data
   */
  generateClickHeatmap() {
    const heatmap = {};
    this.clickEvents.forEach(click => {
      const key = `${click.element.tagName}${click.element.className ? '.' + click.element.className : ''}`;
      heatmap[key] = (heatmap[key] || 0) + 1;
    });
    
    return heatmap;
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * MYSQL DATABASE FUNCTIONS (Placeholder)
   * These functions would connect to MySQL database in production
   */

  /**
   * Send event data to MySQL database (Placeholder)
   */
  async sendToDatabase(eventData) {
    // PLACEHOLDER: This would send data to MySQL database
    console.log('📊 [DB PLACEHOLDER] Sending to MySQL:', eventData.type);
    
    // Simulate database operations
    try {
      await this.insertUserSession(eventData);
      await this.insertUserInteraction(eventData);
      await this.updateSessionAnalytics(eventData);
    } catch (error) {
      console.error('Database error (simulated):', error);
    }
  }

  /**
   * Insert user session data (MySQL Placeholder)
   */
  async insertUserSession(eventData) {
    // PLACEHOLDER SQL:
    const sql = `
      INSERT INTO user_sessions (
        session_id, user_id, user_name, user_role, 
        start_time, session_data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        session_data = VALUES(session_data),
        end_time = NOW()
    `;
    
    const params = [
      this.sessionId,
      this.userId,
      this.userName,
      this.userRole,
      this.sessionStartTime,
      JSON.stringify(eventData)
    ];
    
    console.log('📊 [MySQL Placeholder] INSERT user_sessions:', params);
    // await mysql.execute(sql, params);
  }

  /**
   * Insert user interaction data (MySQL Placeholder)
   */
  async insertUserInteraction(eventData) {
    // PLACEHOLDER SQL:
    const sql = `
      INSERT INTO user_interactions (
        id, session_id, user_id, user_name, user_role,
        interaction_type, interaction_data, url, timestamp, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const interactionId = 'interaction_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const params = [
      interactionId,
      this.sessionId,
      this.userId,
      this.userName,
      this.userRole,
      eventData.type,
      JSON.stringify(eventData.data),
      window.location.pathname,
      eventData.timestamp
    ];
    
    console.log('📊 [MySQL Placeholder] INSERT user_interactions:', params);
    // await mysql.execute(sql, params);
  }

  /**
   * Update session analytics (MySQL Placeholder)
   */
  async updateSessionAnalytics(eventData) {
    // PLACEHOLDER SQL:
    const sql = `
      INSERT INTO user_analytics (
        user_id, user_name, user_role, analysis_date,
        total_sessions, total_interactions, avg_session_duration,
        engagement_score, behavior_patterns, user_needs, created_at
      ) VALUES (?, ?, ?, CURDATE(), 1, 1, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        total_interactions = total_interactions + 1,
        avg_session_duration = (avg_session_duration + VALUES(avg_session_duration)) / 2,
        engagement_score = VALUES(engagement_score),
        behavior_patterns = VALUES(behavior_patterns),
        user_needs = VALUES(user_needs)
    `;
    
    const sessionDuration = Date.now() - this.sessionStartTime;
    const engagementScore = this.calculateEngagementScore();
    const behaviorPatterns = JSON.stringify(this.analyzeUserBehavior());
    const userNeeds = JSON.stringify(this.identifyUserNeeds());
    
    const params = [
      this.userId,
      this.userName,
      this.userRole,
      sessionDuration,
      engagementScore,
      behaviorPatterns,
      userNeeds
    ];
    
    console.log('📊 [MySQL Placeholder] UPDATE user_analytics:', params);
    // await mysql.execute(sql, params);
  }

  /**
   * Calculate engagement score based on user activity
   */
  calculateEngagementScore() {
    const sessionDuration = Date.now() - this.sessionStartTime;
    const normalizedDuration = Math.min(sessionDuration / 300000, 1); // Max 5 minutes
    const normalizedClicks = Math.min(this.totalClicks / 50, 1); // Max 50 clicks
    const normalizedScroll = this.maxScrollDepth / 100; // Max 100%
    
    return Math.round((normalizedDuration * 0.4 + normalizedClicks * 0.3 + normalizedScroll * 0.3) * 100);
  }

  /**
   * Identify user needs based on behavior
   */
  identifyUserNeeds() {
    const needs = [];
    const sessionDuration = Date.now() - this.sessionStartTime;
    
    if (sessionDuration > 300000) {
      needs.push('comprehensive_exploration');
    }
    if (this.totalClicks > 20) {
      needs.push('interactive_features');
    }
    if (this.maxScrollDepth > 80) {
      needs.push('detailed_content');
    }
    if (this.pageViews.length > 3) {
      needs.push('multi_page_workflow');
    }
    
    return needs;
  }

  /**
   * Stop tracking and cleanup
   */
  stop() {
    this.isTracking = false;
    this.endPageTracking();
    
    // Remove event listeners
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    
    console.log('🔍 User Flow Tracking stopped');
  }
}

// Export singleton instance
export const userFlowTracker = new UserFlowTracker();

// Export class for testing
export { UserFlowTracker };