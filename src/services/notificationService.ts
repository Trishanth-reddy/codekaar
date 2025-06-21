interface NotificationData {
  id: string;
  type: 'weather' | 'scheme' | 'market' | 'forum' | 'ai';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: string;
  actionUrl?: string;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: NotificationData[] = [];
  private listeners: ((notifications: NotificationData[]) => void)[] = [];

  private constructor() {
    this.initializeNotifications();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeNotifications() {
    // Check for browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Set up periodic checks for new notifications
    setInterval(() => {
      this.checkForNewNotifications();
    }, 60000); // Check every minute
  }

  private async checkForNewNotifications() {
    // Simulate checking for new notifications based on various conditions
    const now = new Date();
    const hour = now.getHours();

    // Weather-based notifications
    if (hour === 6 || hour === 18) { // Morning and evening
      this.addWeatherNotification();
    }

    // Market price notifications
    if (hour === 9) { // Morning market update
      this.addMarketNotification();
    }

    // Scheme notifications (weekly)
    if (now.getDay() === 1 && hour === 10) { // Monday morning
      this.addSchemeNotification();
    }
  }

  private addWeatherNotification() {
    const notification: NotificationData = {
      id: `weather-${Date.now()}`,
      type: 'weather',
      title: 'Weather Alert',
      message: 'Check today\'s weather forecast for farming activities.',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium',
      icon: '🌤️',
      actionUrl: '/weather'
    };

    this.addNotification(notification);
  }

  private addMarketNotification() {
    const notification: NotificationData = {
      id: `market-${Date.now()}`,
      type: 'market',
      title: 'Market Update',
      message: 'New market prices available. Check for best selling opportunities.',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium',
      icon: '📈',
      actionUrl: '/markets'
    };

    this.addNotification(notification);
  }

  private addSchemeNotification() {
    const notification: NotificationData = {
      id: `scheme-${Date.now()}`,
      type: 'scheme',
      title: 'New Scheme Available',
      message: 'A new government scheme you might be eligible for is now available.',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'high',
      icon: '🏆',
      actionUrl: '/schemes'
    };

    this.addNotification(notification);
  }

  public addNotification(notification: NotificationData) {
    this.notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }

    // Notify listeners
    this.notifyListeners();
    
    // Save to localStorage
    this.saveToStorage();
  }

  public addCustomNotification(
    type: NotificationData['type'],
    title: string,
    message: string,
    priority: NotificationData['priority'] = 'medium',
    icon: string = '📢'
  ) {
    const notification: NotificationData = {
      id: `custom-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      priority,
      icon
    };

    this.addNotification(notification);
  }

  public getNotifications(): NotificationData[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
      this.saveToStorage();
    }
  }

  public markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
    this.saveToStorage();
  }

  public deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
    this.saveToStorage();
  }

  public clearAllNotifications() {
    this.notifications = [];
    this.notifyListeners();
    this.saveToStorage();
  }

  public subscribe(listener: (notifications: NotificationData[]) => void) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  private saveToStorage() {
    try {
      localStorage.setItem('rythu-saathi-notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
    }
  }

  public loadFromStorage() {
    try {
      const saved = localStorage.getItem('rythu-saathi-notifications');
      if (saved) {
        this.notifications = JSON.parse(saved);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load notifications from storage:', error);
    }
  }

  // Weather-specific notifications
  public addWeatherAlert(severity: 'low' | 'medium' | 'high', message: string) {
    this.addCustomNotification('weather', 'Weather Alert', message, severity, '⚠️');
  }

  // Market-specific notifications
  public addPriceAlert(commodity: string, change: number) {
    const icon = change > 0 ? '📈' : '📉';
    const message = `${commodity} price ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)}%`;
    this.addCustomNotification('market', 'Price Alert', message, 'medium', icon);
  }

  // Forum-specific notifications
  public addForumReply(postTitle: string) {
    this.addCustomNotification(
      'forum',
      'New Reply',
      `Someone replied to your post: "${postTitle}"`,
      'low',
      '💬'
    );
  }

  // AI-specific notifications
  public addAIRecommendation(recommendation: string) {
    this.addCustomNotification(
      'ai',
      'AI Recommendation',
      recommendation,
      'low',
      '🤖'
    );
  }
}

export const notificationService = NotificationService.getInstance();