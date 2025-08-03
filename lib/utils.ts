import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Festival } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function isUpcoming(dateString: string, days: number = 30): boolean {
  const today = new Date();
  const festivalDate = new Date(dateString);
  const diffTime = festivalDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= days;
}

export function isToday(dateString: string): boolean {
  const today = new Date().toDateString();
  const festivalDate = new Date(dateString).toDateString();
  return today === festivalDate;
}

export function getDaysUntil(dateString: string): number {
  const today = new Date();
  const festivalDate = new Date(dateString);
  const diffTime = festivalDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getUpcomingFestivals(festivals: Festival[], days: number = 30): Festival[] {
  return festivals
    .filter(festival => isUpcoming(festival.date, days))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.resolve('denied');
  }
  
  return Notification.requestPermission();
}

export function scheduleNotification(title: string, body: string, date: Date): void {
  if (Notification.permission === 'granted') {
    const now = new Date().getTime();
    const notificationTime = date.getTime();
    const delay = notificationTime - now;
    
    if (delay > 0) {
      setTimeout(() => {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }, delay);
    }
  }
}

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}