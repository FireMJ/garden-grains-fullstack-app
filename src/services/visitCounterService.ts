'use client';

interface Visit {
  id: string;
  timestamp: string;
  page: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
}

class VisitCounterService {
  private visitsKey = 'website_visits';
  private sessionKey = 'visitor_session_id';
  private dailyVisitsKey = 'daily_visits';
  
  // Generate unique session ID
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem(this.sessionKey);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem(this.sessionKey, sessionId);
    }
    return sessionId;
  }
  
  // Track a visit
  trackVisit(page: string = window.location.pathname): void {
    const sessionId = this.getOrCreateSessionId();
    const visit: Visit = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      page,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId,
    };
    
    // Store visit
    const visits = this.getAllVisits();
    visits.push(visit);
    localStorage.setItem(this.visitsKey, JSON.stringify(visits));
    
    // Update daily count
    this.updateDailyCount();
    
    // Dispatch event for live counter
    window.dispatchEvent(new CustomEvent('visitTracked', { detail: { totalVisits: this.getTotalVisits() } }));
  }
  
  // Get all visits
  getAllVisits(): Visit[] {
    const stored = localStorage.getItem(this.visitsKey);
    return stored ? JSON.parse(stored) : [];
  }
  
  // Get total visits
  getTotalVisits(): number {
    return this.getAllVisits().length;
  }
  
  // Get unique visitors (by session)
  getUniqueVisitors(): number {
    const visits = this.getAllVisits();
    const uniqueSessions = new Set(visits.map(v => v.sessionId));
    return uniqueSessions.size;
  }
  
  // Get today's visits
  getTodayVisits(): number {
    const today = new Date().toISOString().split('T')[0];
    const visits = this.getAllVisits();
    return visits.filter(v => v.timestamp.startsWith(today)).length;
  }
  
  // Update daily count
  private updateDailyCount(): void {
    const today = new Date().toISOString().split('T')[0];
    const dailyVisits = this.getDailyVisits();
    dailyVisits[today] = (dailyVisits[today] || 0) + 1;
    localStorage.setItem(this.dailyVisitsKey, JSON.stringify(dailyVisits));
  }
  
  // Get daily visits
  getDailyVisits(): Record<string, number> {
    const stored = localStorage.getItem(this.dailyVisitsKey);
    return stored ? JSON.parse(stored) : {};
  }
  
  // Get visits by page
  getVisitsByPage(): Record<string, number> {
    const visits = this.getAllVisits();
    const pageCounts: Record<string, number> = {};
    visits.forEach(visit => {
      pageCounts[visit.page] = (pageCounts[visit.page] || 0) + 1;
    });
    return pageCounts;
  }
  
  // Reset counter (for testing)
  reset(): void {
    localStorage.removeItem(this.visitsKey);
    localStorage.removeItem(this.dailyVisitsKey);
  }
}

export const visitCounterService = new VisitCounterService();
