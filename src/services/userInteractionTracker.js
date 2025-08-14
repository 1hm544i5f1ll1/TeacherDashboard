import { apiService } from './apiService.js';

/**
 * User Interaction Tracking Module
 * Gathers user interactions with the system and records them into database
 * Analyzes patterns to understand user needs and behavior
 */

class UserInteractionTracker {
  constructor() {
    this.interactions = [];
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.userName = null;
    this.userRole = null;
    this.startTime = Date.now();
    this.isTracking = false;
    this.clickCount = 0;
    this.scrollDepth = 0;
    this.maxScrollDepth = 0;
    this.pageViews = [];
    this.sessionData = {
      startTime: Date.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };
    
    // Bind methods to preserve context
    this.trackClick = this.trackClick.bind(this);
    this.trackPageView = this.trackPageView.bind(this);
    this.trackTimeOnPage = this.trackTimeOnPage.bind(this);
    this.trackScroll = this.trackScroll.bind(this);
    this.trackFormInteraction = this.trackFormInteraction.bind(this);
  }

  /**
   * Initialize tracking for a user session
   */
  init(userId, userRole = 'unknown', userName = null) {
    this.userId = userId;
    this.userRole = userRole;
    this.userName = userName;
    this.isTracking = true;
    
    // Track initial page load
    this.trackPageView(window.location.pathname);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Send session start event
    this.recordInteraction({
      type: 'session_start',
      data: {
        ...this.sessionData,
        referrer: document.referrer,
        sessionId: this.sessionId,
        userId: this.userId,
        userName: this.userName,
        userRole: this.userRole
      }
    });

    console.log(`🔍 User Interaction Tracking initialized for user: ${userId} (${userRole})`);
  }

  /**
   * Set up event listeners for various interactions
   */
  setupEventListeners() {
    // Click tracking
    document.addEventListener('click', this.trackClick);
    
    // Scroll tracking (throttled)
    let scrollTimeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(this.trackScroll, 100);
    });

    // Form interactions
    document.addEventListener('input', this.trackFormInteraction);
    document.addEventListener('change', this.trackFormInteraction);

    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.recordInteraction({
          type: 'page_hidden',
          data: { timeOnPage: Date.now() - this.startTime }
        });
      } else {
        this.recordInteraction({
          type: 'page_visible',
          data: { returnTime: Date.now() }
        });
      }
    });

    // Before page unload
    window.addEventListener('beforeunload', () => {
      this.recordInteraction({
        type: 'session_end',
        data: { 
          totalSessionTime: Date.now() - this.startTime,
          totalInteractions: this.interactions.length
        }
      });
      this.sendBatchToDatabase();
    });
  }

  /**
   * Track click interactions
   */
  trackClick(event) {
    if (!this.isTracking) return;

    this.clickCount++;
    const element = event.target;
    const clickData = {
      elementType: element.tagName.toLowerCase(),
      elementId: element.id || null,
      elementClass: element.className || null,
      elementText: element.textContent?.substring(0, 100) || null,
      coordinates: { x: event.clientX, y: event.clientY },
      timestamp: Date.now(),
      url: window.location.pathname,
      clickNumber: this.clickCount,
      sessionClickCount: this.clickCount
    };

    // Special tracking for dashboard items
    if (element.closest('[data-dashboard-item]')) {
      clickData.dashboardItem = element.closest('[data-dashboard-item]').dataset.dashboardItem;
      clickData.dashboardAction = 'item_click';
    }

    // Special tracking for buttons
    if (element.tagName === 'BUTTON' || element.type === 'button') {
      clickData.buttonAction = this.identifyButtonAction(element);
    }

    this.recordInteraction({
      type: 'click',
      data: clickData
    });
  }

  /**
   * Track page views and navigation
   */
  trackPageView(path, additionalData = {}) {
    if (!this.isTracking) return;

    const pageViewData = {
      path,
      title: document.title,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      ...additionalData
    };

    this.pageViews.push(pageViewData);

    this.recordInteraction({
      type: 'page_view',
      data: pageViewData
    });
  }

  /**
   * Track time spent on page/section
   */
  trackTimeOnPage(section = 'page', startTime = null) {
    if (!this.isTracking) return;

    const timeSpent = Date.now() - (startTime || this.startTime);
    
    this.recordInteraction({
      type: 'time_on_page',
      data: {
        section,
        timeSpent,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Track scroll behavior
   */
  trackScroll() {
    if (!this.isTracking) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0;
    
    this.scrollDepth = scrollPercentage;
    if (scrollPercentage > this.maxScrollDepth) {
      this.maxScrollDepth = scrollPercentage;
    }

    this.recordInteraction({
      type: 'scroll',
      data: {
        scrollPercentage,
        maxScrollDepth: this.maxScrollDepth,
        scrollTop,
        documentHeight,
        sessionId: this.sessionId,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Track form interactions
   */
  trackFormInteraction(event) {
    if (!this.isTracking) return;

    const element = event.target;
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) return;

    this.recordInteraction({
      type: 'form_interaction',
      data: {
        formId: element.form?.id || null,
        fieldName: element.name || element.id || null,
        fieldType: element.type || element.tagName.toLowerCase(),
        action: event.type,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Track custom dashboard events
   */
  trackDashboardEvent(eventType, data = {}) {
    if (!this.isTracking) return;

    this.recordInteraction({
      type: 'dashboard_event',
      data: {
        eventType,
        sessionId: this.sessionId,
        userId: this.userId,
        userName: this.userName,
        userRole: this.userRole,
        timestamp: Date.now(),
        ...data
      }
    });
  }

  /**
   * Track user flow and navigation patterns
   */
  trackUserFlow(flowType, flowData = {}) {
    if (!this.isTracking) return;

    this.recordInteraction({
      type: 'user_flow',
      data: {
        flowType,
        sessionId: this.sessionId,
        userId: this.userId,
        userName: this.userName,
        userRole: this.userRole,
        sessionDuration: Date.now() - this.startTime,
        totalClicks: this.clickCount,
        maxScrollDepth: this.maxScrollDepth,
        pageViewCount: this.pageViews.length,
        timestamp: Date.now(),
        ...flowData
      }
    });
  }

  /**
   * Record interaction in memory and batch for database
   */
  recordInteraction(interaction) {
    const fullInteraction = {
      id: this.generateInteractionId(),
      sessionId: this.sessionId,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      timestamp: Date.now(),
      url: window.location.pathname,
      ...interaction
    };

    this.interactions.push(fullInteraction);

    // Send to database in batches of 10 or every 30 seconds
    if (this.interactions.length >= 10) {
      this.sendBatchToDatabase();
    }
  }

  /**
   * Send batch of interactions to database
   */
  async sendBatchToDatabase() {
    if (this.interactions.length === 0) return;

    const batch = [...this.interactions];
    this.interactions = []; // Clear the batch

    try {
      await apiService.storeInteractions(batch, {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        batchSize: batch.length
      });

      console.log(`📊 Sent ${batch.length} interactions to database`);
    } catch (error) {
      console.error('Failed to send interactions to database:', error);
      // Re-add failed interactions back to queue
      this.interactions.unshift(...batch);
    }
  }

  /**
   * Analyze user behavior patterns
   */
  analyzeUserBehavior() {
    const analysis = {
      totalInteractions: this.interactions.length,
      sessionDuration: Date.now() - this.startTime,
      clickPatterns: this.analyzeClickPatterns(),
      scrollBehavior: this.analyzeScrollBehavior(),
      timeDistribution: this.analyzeTimeDistribution(),
      userNeeds: this.identifyUserNeeds()
    };

    return analysis;
  }

  /**
   * Analyze click patterns to understand user preferences
   */
  analyzeClickPatterns() {
    const clicks = this.interactions.filter(i => i.type === 'click');
    const patterns = {
      totalClicks: clicks.length,
      mostClickedElements: {},
      dashboardItemClicks: {},
      buttonActions: {}
    };

    clicks.forEach(click => {
      // Count element types
      const elementKey = `${click.data.elementType}${click.data.elementClass ? '.' + click.data.elementClass : ''}`;
      patterns.mostClickedElements[elementKey] = (patterns.mostClickedElements[elementKey] || 0) + 1;

      // Count dashboard items
      if (click.data.dashboardItem) {
        patterns.dashboardItemClicks[click.data.dashboardItem] = 
          (patterns.dashboardItemClicks[click.data.dashboardItem] || 0) + 1;
      }

      // Count button actions
      if (click.data.buttonAction) {
        patterns.buttonActions[click.data.buttonAction] = 
          (patterns.buttonActions[click.data.buttonAction] || 0) + 1;
      }
    });

    return patterns;
  }

  /**
   * Analyze scroll behavior
   */
  analyzeScrollBehavior() {
    const scrollEvents = this.interactions.filter(i => i.type === 'scroll');
    if (scrollEvents.length === 0) return { averageScrollDepth: 0, maxScrollDepth: 0 };

    const scrollDepths = scrollEvents.map(s => s.data.scrollPercentage);
    return {
      averageScrollDepth: scrollDepths.reduce((a, b) => a + b, 0) / scrollDepths.length,
      maxScrollDepth: Math.max(...scrollDepths),
      scrollEvents: scrollEvents.length
    };
  }

  /**
   * Analyze time distribution across different activities
   */
  analyzeTimeDistribution() {
    const timeEvents = this.interactions.filter(i => i.type === 'time_on_page');
    const distribution = {};

    timeEvents.forEach(event => {
      const section = event.data.section;
      if (!distribution[section]) {
        distribution[section] = { totalTime: 0, events: 0 };
      }
      distribution[section].totalTime += event.data.timeSpent;
      distribution[section].events += 1;
    });

    // Calculate averages
    Object.keys(distribution).forEach(section => {
      distribution[section].averageTime = distribution[section].totalTime / distribution[section].events;
    });

    return distribution;
  }

  /**
   * AI-powered analysis to identify user needs based on behavior patterns
   */
  identifyUserNeeds() {
    const clickPatterns = this.analyzeClickPatterns();
    const scrollBehavior = this.analyzeScrollBehavior();
    const sessionDuration = Date.now() - this.startTime;

    const needs = [];

    // Analyze engagement level
    if (sessionDuration > 300000) { // 5+ minutes
      needs.push({
        need: 'high_engagement',
        confidence: 0.8,
        reasoning: 'User spent significant time on platform, indicating high interest',
        recommendation: 'Provide advanced features and detailed content'
      });
    } else if (sessionDuration < 60000) { // Less than 1 minute
      needs.push({
        need: 'quick_access',
        confidence: 0.7,
        reasoning: 'Short session suggests need for quick, easily accessible information',
        recommendation: 'Prioritize key information and streamline navigation'
      });
    }

    // Analyze scroll behavior
    if (scrollBehavior.averageScrollDepth < 30) {
      needs.push({
        need: 'content_optimization',
        confidence: 0.6,
        reasoning: 'Low scroll depth suggests content above fold needs improvement',
        recommendation: 'Move important content higher up and improve initial engagement'
      });
    }

    // Analyze click patterns
    const totalClicks = clickPatterns.totalClicks;
    if (totalClicks > 20) {
      needs.push({
        need: 'exploration_oriented',
        confidence: 0.7,
        reasoning: 'High click count indicates user is exploring multiple features',
        recommendation: 'Provide guided tours and feature discovery tools'
      });
    } else if (totalClicks < 5) {
      needs.push({
        need: 'focused_task',
        confidence: 0.6,
        reasoning: 'Low click count suggests user has specific task in mind',
        recommendation: 'Streamline workflows and reduce navigation complexity'
      });
    }

    // Analyze dashboard usage
    const dashboardClicks = Object.keys(clickPatterns.dashboardItemClicks).length;
    if (dashboardClicks > 3) {
      needs.push({
        need: 'comprehensive_user',
        confidence: 0.8,
        reasoning: 'User interacted with multiple dashboard items',
        recommendation: 'Provide comprehensive dashboard with all features visible'
      });
    }

    return needs;
  }

  /**
   * Helper methods
   */
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateInteractionId() {
    return 'interaction_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  identifyButtonAction(element) {
    const text = element.textContent?.toLowerCase() || '';
    const className = element.className?.toLowerCase() || '';
    
    if (text.includes('save') || className.includes('save')) return 'save';
    if (text.includes('edit') || className.includes('edit')) return 'edit';
    if (text.includes('delete') || className.includes('delete')) return 'delete';
    if (text.includes('add') || className.includes('add')) return 'add';
    if (text.includes('cancel') || className.includes('cancel')) return 'cancel';
    if (text.includes('submit') || className.includes('submit')) return 'submit';
    if (text.includes('login') || className.includes('login')) return 'login';
    if (text.includes('logout') || className.includes('logout')) return 'logout';
    
    return 'unknown';
  }

  /**
   * Stop tracking
   */
  stop() {
    this.isTracking = false;
    this.sendBatchToDatabase();
    
    // Remove event listeners
    document.removeEventListener('click', this.trackClick);
    document.removeEventListener('scroll', this.trackScroll);
    document.removeEventListener('input', this.trackFormInteraction);
    document.removeEventListener('change', this.trackFormInteraction);
    
    console.log('🔍 User Interaction Tracking stopped');
  }

  /**
   * Get current session analytics
   */
  getSessionAnalytics() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      sessionDuration: Date.now() - this.startTime,
      totalInteractions: this.interactions.length,
      totalClicks: this.clickCount,
      maxScrollDepth: this.maxScrollDepth,
      pageViews: this.pageViews.length,
      currentScrollDepth: this.scrollDepth,
      analysis: this.analyzeUserBehavior(),
      sessionData: this.sessionData
    };
  }

  /**
   * Get detailed user flow analytics
   */
  getUserFlowAnalytics() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      userName: this.userName,
      userRole: this.userRole,
      sessionStartTime: this.startTime,
      sessionDuration: Date.now() - this.startTime,
      totalInteractions: this.interactions.length,
      totalClicks: this.clickCount,
      maxScrollDepth: this.maxScrollDepth,
      pageViews: this.pageViews,
      interactionTimeline: this.interactions.map(i => ({
        type: i.type,
        timestamp: i.timestamp,
        data: i.data
      })),
      userBehaviorPatterns: this.analyzeUserBehavior()
    };
  }
}

// Export singleton instance
export const userTracker = new UserInteractionTracker();

// Export class for testing
export { UserInteractionTracker };