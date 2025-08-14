// Enhanced User Action Tracker - Tracks comprehensive user interactions on the page
class UserActionTracker {
  constructor() {
    this.actions = [];
    this.isTracking = false;
    this.scrollData = {
      maxDepth: 0,
      direction: 'none',
      lastScrollTop: 0,
      scrollEvents: []
    };
    this.hoverData = new Map(); // Track hover durations
    this.pageStartTime = Date.now();
    this.sessionData = {
      totalTime: 0,
      pageVisits: 0,
      lastActivity: Date.now()
    };
    this.formData = {
      fields: new Map(),
      submissions: [],
      focusEvents: []
    };
    this.mediaData = {
      videos: new Map(),
      audios: new Map(),
      images: new Map()
    };
    this.interactionData = {
      clicks: [],
      hovers: [],
      scrolls: [],
      forms: [],
      media: [],
      images: []
    };
  }

  start() {
    if (this.isTracking) return;
    this.isTracking = true;
    this.pageStartTime = Date.now();
    this.sessionData.pageVisits++;
    this.setupEventListeners();
    this.startTimeTracking();
    console.log('Enhanced user action tracking started');
  }

  stop() {
    if (!this.isTracking) return;
    this.isTracking = false;
    this.removeEventListeners();
    this.stopTimeTracking();
    console.log('Enhanced user action tracking stopped');
  }

  startTimeTracking() {
    this.timeInterval = setInterval(() => {
      if (this.isTracking) {
        this.sessionData.totalTime = Date.now() - this.pageStartTime;
        this.sessionData.lastActivity = Date.now();
      }
    }, 1000);
  }

  stopTimeTracking() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  setupEventListeners() {
    // Click tracking with enhanced details
    document.addEventListener('click', this.handleClick.bind(this), true);
    
    // Enhanced hover tracking
    document.addEventListener('mouseenter', this.handleMouseEnter.bind(this), true);
    document.addEventListener('mouseleave', this.handleMouseLeave.bind(this), true);
    
    // Enhanced scroll tracking
    document.addEventListener('scroll', this.handleScroll.bind(this), true);
    
    // Enhanced form tracking
    document.addEventListener('focus', this.handleFocus.bind(this), true);
    document.addEventListener('blur', this.handleBlur.bind(this), true);
    document.addEventListener('input', this.handleInput.bind(this), true);
    document.addEventListener('change', this.handleChange.bind(this), true);
    document.addEventListener('submit', this.handleSubmit.bind(this), true);
    
    // Keyboard tracking
    document.addEventListener('keydown', this.handleKeydown.bind(this), true);
    document.addEventListener('keyup', this.handleKeyup.bind(this), true);
    
    // Drag and drop
    document.addEventListener('dragstart', this.handleDragStart.bind(this), true);
    document.addEventListener('drop', this.handleDrop.bind(this), true);
    
    // Enhanced media tracking
    this.setupMediaTracking();
    
    // Enhanced image tracking
    this.setupImageTracking();
    
    // Element visibility tracking
    this.setupVisibilityTracking();
    
    // Page visibility tracking
    this.setupPageVisibilityTracking();
    
    // Resize tracking
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Before unload tracking
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  removeEventListeners() {
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('mouseenter', this.handleMouseEnter, true);
    document.removeEventListener('mouseleave', this.handleMouseLeave, true);
    document.removeEventListener('scroll', this.handleScroll, true);
    document.removeEventListener('focus', this.handleFocus, true);
    document.removeEventListener('blur', this.handleBlur, true);
    document.removeEventListener('input', this.handleInput, true);
    document.removeEventListener('change', this.handleChange, true);
    document.removeEventListener('submit', this.handleSubmit, true);
    document.removeEventListener('keydown', this.handleKeydown, true);
    document.removeEventListener('keyup', this.handleKeyup, true);
    document.removeEventListener('dragstart', this.handleDragStart, true);
    document.removeEventListener('drop', this.handleDrop, true);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  // Enhanced click tracking
  handleClick(event) {
    const element = event.target;
    const rect = element.getBoundingClientRect();
    const action = {
      type: 'click',
      timestamp: Date.now(),
      element: {
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        className: element.className || null,
        text: element.textContent?.slice(0, 100) || null,
        type: element.type || null,
        value: element.value || null
      },
      coordinates: {
        x: event.clientX,
        y: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY
      },
      elementPosition: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      },
      modifiers: {
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey
      }
    };
    
    this.actions.push(action);
    this.interactionData.clicks.push(action);
    console.log('Enhanced click tracked:', action);
  }

  // Enhanced hover tracking
  handleMouseEnter(event) {
    const element = event.target;
    const key = `${element.tagName}-${element.id || element.className || 'unknown'}-${Date.now()}`;
    
    this.hoverData.set(key, {
      startTime: Date.now(),
      element: {
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        className: element.className || null,
        text: element.textContent?.slice(0, 50) || null
      },
      coordinates: {
        x: event.clientX,
        y: event.clientY
      }
    });
  }

  handleMouseLeave(event) {
    const element = event.target;
    const keys = Array.from(this.hoverData.keys());
    const key = keys.find(k => k.includes(element.tagName) && k.includes(element.id || element.className || 'unknown'));
    
    if (key) {
      const hoverData = this.hoverData.get(key);
      if (hoverData) {
        const duration = Date.now() - hoverData.startTime;
        const action = {
          type: 'hover',
          timestamp: Date.now(),
          element: hoverData.element,
          duration: duration,
          coordinates: hoverData.coordinates
        };
        
        this.actions.push(action);
        this.interactionData.hovers.push(action);
        this.hoverData.delete(key);
        console.log('Enhanced hover tracked:', action);
      }
    }
  }

  // Enhanced scroll tracking
  handleScroll(event) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    
    // Update max depth
    if (scrollPercentage > this.scrollData.maxDepth) {
      this.scrollData.maxDepth = scrollPercentage;
    }
    
    // Track scroll event
    const scrollEvent = {
      timestamp: Date.now(),
      scrollTop: scrollTop,
      scrollPercentage: scrollPercentage,
      maxDepth: this.scrollData.maxDepth
    };
    
    this.scrollData.scrollEvents.push(scrollEvent);
    this.interactionData.scrolls.push(scrollEvent);
    
    // Detect direction change
    const direction = scrollTop > this.scrollData.lastScrollTop ? 'down' : 'up';
    if (direction !== this.scrollData.direction) {
      const action = {
        type: 'scroll_direction_change',
        timestamp: Date.now(),
        direction: direction,
        scrollPercentage: scrollPercentage,
        maxDepth: this.scrollData.maxDepth
      };
      
      this.actions.push(action);
      this.scrollData.direction = direction;
      console.log('Scroll direction change tracked:', action);
    }
    
    this.scrollData.lastScrollTop = scrollTop;
  }

  // Enhanced form tracking
  handleFocus(event) {
    const element = event.target;
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      const action = {
        type: 'form_focus',
        timestamp: Date.now(),
        element: {
          tag: element.tagName.toLowerCase(),
          id: element.id || null,
          name: element.name || null,
          type: element.type || null,
          placeholder: element.placeholder || null
        },
        coordinates: {
          x: event.clientX,
          y: event.clientY
        }
      };
      
      this.actions.push(action);
      this.formData.focusEvents.push(action);
      this.interactionData.forms.push(action);
      console.log('Enhanced form focus tracked:', action);
    }
  }

  handleBlur(event) {
    const element = event.target;
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      const action = {
        type: 'form_blur',
        timestamp: Date.now(),
        element: {
          tag: element.tagName.toLowerCase(),
          id: element.id || null,
          name: element.name || null,
          type: element.type || null,
          value: element.value || null
        }
      };
      
      this.actions.push(action);
      this.interactionData.forms.push(action);
      console.log('Form blur tracked:', action);
    }
  }

  handleInput(event) {
    const element = event.target;
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      const action = {
        type: 'form_input',
        timestamp: Date.now(),
        element: {
          tag: element.tagName.toLowerCase(),
          id: element.id || null,
          name: element.name || null,
          type: element.type || null
        },
        valueLength: element.value?.length || 0,
        valuePreview: element.value?.slice(0, 20) || null
      };
      
      this.actions.push(action);
      this.interactionData.forms.push(action);
      console.log('Enhanced form input tracked:', action);
    }
  }

  handleChange(event) {
    const element = event.target;
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      const action = {
        type: 'form_change',
        timestamp: Date.now(),
        element: {
          tag: element.tagName.toLowerCase(),
          id: element.id || null,
          name: element.name || null,
          type: element.type || null
        },
        oldValue: element.defaultValue || null,
        newValue: element.value || null
      };
      
      this.actions.push(action);
      this.interactionData.forms.push(action);
      console.log('Form change tracked:', action);
    }
  }

  handleSubmit(event) {
    const form = event.target;
    const formData = new FormData(form);
    const action = {
      type: 'form_submit',
      timestamp: Date.now(),
      element: {
        tag: 'form',
        id: form.id || null,
        className: form.className || null,
        action: form.action || null,
        method: form.method || null
      },
      formData: Object.fromEntries(formData.entries())
    };
    
    this.actions.push(action);
    this.formData.submissions.push(action);
    this.interactionData.forms.push(action);
    console.log('Enhanced form submit tracked:', action);
  }

  // Enhanced keyboard tracking
  handleKeydown(event) {
    const action = {
      type: 'keydown',
      timestamp: Date.now(),
      key: event.key,
      code: event.code,
      modifiers: {
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey
      },
      target: {
        tag: event.target.tagName.toLowerCase(),
        id: event.target.id || null,
        type: event.target.type || null
      }
    };
    
    this.actions.push(action);
    console.log('Enhanced keydown tracked:', action);
  }

  handleKeyup(event) {
    const action = {
      type: 'keyup',
      timestamp: Date.now(),
      key: event.key,
      code: event.code,
      modifiers: {
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey
      }
    };
    
    this.actions.push(action);
    console.log('Keyup tracked:', action);
  }

  // Enhanced drag and drop
  handleDragStart(event) {
    const element = event.target;
    const action = {
      type: 'drag_start',
      timestamp: Date.now(),
      element: {
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        className: element.className || null,
        text: element.textContent?.slice(0, 50) || null
      },
      coordinates: {
        x: event.clientX,
        y: event.clientY
      }
    };
    
    this.actions.push(action);
    console.log('Enhanced drag start tracked:', action);
  }

  handleDrop(event) {
    const action = {
      type: 'drop',
      timestamp: Date.now(),
      coordinates: {
        x: event.clientX,
        y: event.clientY
      },
      dataTransfer: event.dataTransfer ? Array.from(event.dataTransfer.types) : []
    };
    
    this.actions.push(action);
    console.log('Enhanced drop tracked:', action);
  }

  // Enhanced media tracking
  setupMediaTracking() {
    const mediaElements = document.querySelectorAll('video, audio');
    mediaElements.forEach(media => {
      const mediaId = media.id || `media-${Date.now()}`;
      this.mediaData.videos.set(mediaId, {
        element: media,
        events: [],
        currentTime: 0,
        duration: 0,
        volume: 1,
        paused: true
      });

      media.addEventListener('play', () => this.trackMediaAction('play', media));
      media.addEventListener('pause', () => this.trackMediaAction('pause', media));
      media.addEventListener('seeked', () => this.trackMediaAction('seek', media));
      media.addEventListener('volumechange', () => this.trackMediaAction('volume_change', media));
      media.addEventListener('fullscreenchange', () => this.trackMediaAction('fullscreen_change', media));
      media.addEventListener('timeupdate', () => this.trackMediaAction('time_update', media));
      media.addEventListener('ended', () => this.trackMediaAction('ended', media));
      media.addEventListener('error', () => this.trackMediaAction('error', media));
    });
  }

  trackMediaAction(actionType, media) {
    const mediaId = media.id || `media-${Date.now()}`;
    const mediaInfo = this.mediaData.videos.get(mediaId) || {};
    
    const action = {
      type: `media_${actionType}`,
      timestamp: Date.now(),
      element: {
        tag: media.tagName.toLowerCase(),
        id: media.id || null,
        className: media.className || null,
        src: media.src || null
      },
      mediaInfo: {
        currentTime: media.currentTime || 0,
        duration: media.duration || 0,
        volume: media.volume || 1,
        paused: media.paused !== undefined ? media.paused : true,
        muted: media.muted || false,
        playbackRate: media.playbackRate || 1
      }
    };
    
    this.actions.push(action);
    this.interactionData.media.push(action);
    
    // Update media data
    if (mediaInfo) {
      mediaInfo.events.push(action);
      mediaInfo.currentTime = action.mediaInfo.currentTime;
      mediaInfo.duration = action.mediaInfo.duration;
      mediaInfo.volume = action.mediaInfo.volume;
      mediaInfo.paused = action.mediaInfo.paused;
    }
    
    console.log(`Enhanced media ${actionType} tracked:`, action);
  }

  // Enhanced image tracking
  setupImageTracking() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const imageId = img.id || `img-${Date.now()}`;
      this.mediaData.images.set(imageId, {
        element: img,
        events: [],
        loaded: false,
        error: false
      });

      img.addEventListener('click', () => this.trackImageAction('click', img));
      img.addEventListener('load', () => this.trackImageAction('load', img));
      img.addEventListener('error', () => this.trackImageAction('error', img));
      img.addEventListener('contextmenu', () => this.trackImageAction('right_click', img));
      img.addEventListener('dblclick', () => this.trackImageAction('double_click', img));
    });
  }

  trackImageAction(actionType, img) {
    const imageId = img.id || `img-${Date.now()}`;
    const imageInfo = this.mediaData.images.get(imageId) || {};
    
    const action = {
      type: `image_${actionType}`,
      timestamp: Date.now(),
      element: {
        tag: 'img',
        id: img.id || null,
        className: img.className || null,
        src: img.src || null,
        alt: img.alt || null,
        width: img.naturalWidth || img.width || null,
        height: img.naturalHeight || img.height || null
      },
      coordinates: actionType === 'click' || actionType === 'right_click' || actionType === 'double_click' ? {
        x: event?.clientX || null,
        y: event?.clientY || null
      } : null
    };
    
    this.actions.push(action);
    this.interactionData.images.push(action);
    
    // Update image data
    if (imageInfo) {
      imageInfo.events.push(action);
      if (actionType === 'load') imageInfo.loaded = true;
      if (actionType === 'error') imageInfo.error = true;
    }
    
    console.log(`Enhanced image ${actionType} tracked:`, action);
  }

  // Enhanced element visibility tracking
  setupVisibilityTracking() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const action = {
          type: entry.isIntersecting ? 'element_visible' : 'element_hidden',
          timestamp: Date.now(),
          element: {
            tag: entry.target.tagName.toLowerCase(),
            id: entry.target.id || null,
            className: entry.target.className || null
          },
          intersectionRatio: entry.intersectionRatio,
          boundingRect: entry.boundingClientRect
        };
        
        this.actions.push(action);
        console.log(`Enhanced element visibility tracked:`, action);
      });
    }, {
      threshold: [0, 0.25, 0.5, 0.75, 1.0]
    });

    // Observe all elements with IDs or important classes
    const elementsToTrack = document.querySelectorAll('[id], .important, .tracked, [data-track]');
    elementsToTrack.forEach(el => observer.observe(el));
  }

  // Page visibility tracking
  setupPageVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      const action = {
        type: 'page_visibility_change',
        timestamp: Date.now(),
        hidden: document.hidden,
        visibilityState: document.visibilityState
      };
      
      this.actions.push(action);
      console.log('Page visibility change tracked:', action);
    });
  }

  // Resize tracking
  handleResize() {
    const action = {
      type: 'window_resize',
      timestamp: Date.now(),
      dimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      }
    };
    
    this.actions.push(action);
    console.log('Window resize tracked:', action);
  }

  // Before unload tracking
  handleBeforeUnload() {
    const action = {
      type: 'page_unload',
      timestamp: Date.now(),
      sessionDuration: Date.now() - this.pageStartTime
    };
    
    this.actions.push(action);
    console.log('Page unload tracked:', action);
  }

  // Get comprehensive summary of tracked actions
  getActionSummary() {
    const summary = {
      totalActions: this.actions.length,
      actionTypes: {},
      scrollData: this.scrollData,
      sessionData: this.sessionData,
      formData: {
        fields: Array.from(this.formData.fields.values()).map(field => ({
          name: field.name,
          type: field.type
        })),
        submissions: this.formData.submissions.length,
        totalForms: this.formData.focusEvents.length + this.formData.submissions.length
      },
      mediaData: {
        actions: this.interactionData.media.map(action => ({
          action: action.type,
          element: action.element.tagName || 'unknown'
        })),
        totalMedia: this.interactionData.media.length
      },
      imageData: {
        actions: this.interactionData.images.map(action => ({
          action: action.type,
          element: action.element.tagName || 'unknown'
        })),
        totalImages: this.interactionData.images.length
      },
      recentActions: this.actions.slice(-20), // Last 20 actions
      timeOnPage: this.sessionData.totalTime,
      maxScrollDepth: this.scrollData.maxDepth
    };

    // Count action types
    this.actions.forEach(action => {
      summary.actionTypes[action.type] = (summary.actionTypes[action.type] || 0) + 1;
    });

    // Add interaction counts to actionTypes
    summary.actionTypes.click = this.interactionData.clicks.length;
    summary.actionTypes.hover = this.interactionData.hovers.length;
    summary.actionTypes.scroll = this.interactionData.scrolls.length;
    summary.actionTypes.form = this.interactionData.forms.length;
    summary.actionTypes.media = this.interactionData.media.length;
    summary.actionTypes.image = this.interactionData.images.length;

    return summary;
  }

  // Get actions by type
  getActionsByType(type) {
    return this.actions.filter(action => action.type === type);
  }

  // Get time-based analytics
  getTimeAnalytics() {
    const now = Date.now();
    const timeRanges = {
      lastMinute: now - 60000,
      last5Minutes: now - 300000,
      last15Minutes: now - 900000,
      lastHour: now - 3600000
    };

    const analytics = {};
    Object.entries(timeRanges).forEach(([range, startTime]) => {
      analytics[range] = this.actions.filter(action => action.timestamp >= startTime);
    });

    return analytics;
  }

  // Get user behavior patterns
  getUserBehaviorPatterns() {
    const patterns = {
      scrollBehavior: this.analyzeScrollBehavior(),
      clickPatterns: this.analyzeClickPatterns(),
      formEngagement: this.analyzeFormEngagement(),
      mediaConsumption: this.analyzeMediaConsumption()
    };

    return patterns;
  }

  analyzeScrollBehavior() {
    if (this.scrollData.scrollEvents.length === 0) return null;

    const scrollEvents = this.scrollData.scrollEvents;
    const totalScrolls = scrollEvents.length;
    const maxDepth = this.scrollData.maxDepth;
    const avgScrollDepth = scrollEvents.reduce((sum, event) => sum + event.scrollPercentage, 0) / totalScrolls;

    return {
      totalScrolls,
      maxDepth,
      avgScrollDepth,
      scrollFrequency: totalScrolls / (this.sessionData.totalTime / 1000), // scrolls per second
      scrollPattern: maxDepth > 80 ? 'Deep Scroller' : maxDepth > 40 ? 'Moderate Scroller' : 'Light Scroller'
    };
  }

  analyzeClickPatterns() {
    if (this.interactionData.clicks.length === 0) return null;

    const clicks = this.interactionData.clicks;
    const totalClicks = clicks.length;
    const clickFrequency = totalClicks / (this.sessionData.totalTime / 1000);
    const elementTypes = {};
    
    clicks.forEach(click => {
      const tag = click.element.tag;
      elementTypes[tag] = (elementTypes[tag] || 0) + 1;
    });

    return {
      totalClicks,
      clickFrequency,
      elementTypes,
      clickPattern: clickFrequency > 2 ? 'High Activity' : clickFrequency > 1 ? 'Moderate Activity' : 'Low Activity'
    };
  }

  analyzeFormEngagement() {
    if (this.interactionData.forms.length === 0) return null;

    const forms = this.interactionData.forms;
    const focusEvents = this.formData.focusEvents.length;
    const submissions = this.formData.submissions.length;
    const inputs = this.interactionData.forms.filter(f => f.type === 'form_input').length;

    return {
      totalFormInteractions: forms.length,
      focusEvents,
      submissions,
      inputs,
      formEngagement: focusEvents > 0 ? (submissions / focusEvents) * 100 : 0,
      formPattern: submissions > 0 ? 'Form Submitter' : focusEvents > 0 ? 'Form Explorer' : 'No Form Interaction'
    };
  }

  analyzeMediaConsumption() {
    const videoEvents = this.interactionData.media.filter(m => m.element.tag === 'video').length;
    const audioEvents = this.interactionData.media.filter(m => m.element.tag === 'audio').length;
    const imageEvents = this.interactionData.images.length;

    return {
      videoInteractions: videoEvents,
      audioInteractions: audioEvents,
      imageInteractions: imageEvents,
      totalMediaInteractions: videoEvents + audioEvents + imageEvents,
      mediaPattern: videoEvents > 0 || audioEvents > 0 ? 'Media Consumer' : imageEvents > 0 ? 'Image Viewer' : 'No Media Interaction'
    };
  }

  // Clear all tracked actions
  clear() {
    this.actions = [];
    this.scrollData = {
      maxDepth: 0,
      direction: 'none',
      lastScrollTop: 0,
      scrollEvents: []
    };
    this.hoverData.clear();
    this.formData = {
      fields: new Map(),
      submissions: [],
      focusEvents: []
    };
    this.mediaData = {
      videos: new Map(),
      audios: new Map(),
      images: new Map()
    };
    this.interactionData = {
      clicks: [],
      hovers: [],
      scrolls: [],
      forms: [],
      media: [],
      images: []
    };
    this.sessionData = {
      totalTime: 0,
      pageVisits: 0,
      lastActivity: Date.now()
    };
    console.log('All tracked actions cleared');
  }

  // Export actions as JSON
  exportActions() {
    return JSON.stringify({
      actions: this.actions,
      summary: this.getActionSummary(),
      timeAnalytics: this.getTimeAnalytics(),
      behaviorPatterns: this.getUserBehaviorPatterns()
    }, null, 2);
  }

  // Get real-time tracking status
  getTrackingStatus() {
    return {
      isTracking: this.isTracking,
      totalActions: this.actions.length,
      sessionDuration: this.sessionData.totalTime,
      pageVisits: this.sessionData.pageVisits,
      lastActivity: this.sessionData.lastActivity
    };
  }
}

// Create and export a singleton instance
const userActionTracker = new UserActionTracker();

export default userActionTracker;

