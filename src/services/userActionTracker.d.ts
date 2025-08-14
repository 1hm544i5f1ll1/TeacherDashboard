declare module '../services/userActionTracker' {
  interface ActionSummary {
    totalActions: number;
    actionTypes: Record<string, number>;
    scrollData: {
      maxDepth: number;
      direction: string;
      lastScrollTop: number;
      scrollEvents: number;
    };
    sessionData: {
      totalTime: number;
      pageVisits: number;
      lastActivity: number;
    };
    formData: {
      fields: Array<{name: string; type: string}>;
      submissions: number;
      totalForms: number;
    };
    mediaData: {
      actions: Array<{action: string; element: string}>;
      totalMedia: number;
    };
    imageData: {
      actions: Array<{action: string; element: string}>;
      totalImages: number;
    };
    recentActions: any[];
    timeOnPage: number;
    maxScrollDepth: number;
  }

  interface UserActionTracker {
    start(): void;
    stop(): void;
    getActionSummary(): ActionSummary;
    getActionsByType(type: string): any[];
    clear(): void;
    exportActions(): string;
    getTrackingStatus(): {
      isTracking: boolean;
      totalActions: number;
      sessionDuration: number;
      pageVisits: number;
      lastActivity: number;
    };
  }

  const userActionTracker: UserActionTracker;
  export default userActionTracker;
}

export {};
