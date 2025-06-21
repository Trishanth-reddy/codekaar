import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

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

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from storage
    notificationService.loadFromStorage();
    
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    });

    // Initial load
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    return unsubscribe;
  }, []);

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const deleteNotification = (notificationId: string) => {
    notificationService.deleteNotification(notificationId);
  };

  const clearAll = () => {
    notificationService.clearAllNotifications();
  };

  const addNotification = (
    type: NotificationData['type'],
    title: string,
    message: string,
    priority: NotificationData['priority'] = 'medium',
    icon: string = '📢'
  ) => {
    notificationService.addCustomNotification(type, title, message, priority, icon);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification
  };
}