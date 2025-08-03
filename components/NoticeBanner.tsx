'use client';

import { useState, useEffect } from 'react';
import { Notice } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';
import { AlertCircle, X, Sparkles } from 'lucide-react';
import { isToday } from '@/lib/utils';

export default function NoticeBanner() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dismissedNotices, setDismissedNotices] = useState<string[]>([]);

  useEffect(() => {
    loadNotices();
    // Load dismissed notices from sessionStorage
    const dismissed = sessionStorage.getItem('dismissed_notices');
    if (dismissed) {
      setDismissedNotices(JSON.parse(dismissed));
    }
  }, []);

  const loadNotices = () => {
    const allNotices = LocalStorage.getNotices();
    const activeNotices = allNotices.filter(notice => {
      if (!notice.isActive) return false;
      
      // Show festival notices only on the festival date
      if (notice.type === 'festival') {
        return isToday(notice.date);
      }
      
      // Show civic notices always when active
      return true;
    });
    
    setNotices(activeNotices);
  };

  const dismissNotice = (noticeId: string) => {
    const newDismissed = [...dismissedNotices, noticeId];
    setDismissedNotices(newDismissed);
    sessionStorage.setItem('dismissed_notices', JSON.stringify(newDismissed));
  };

  const visibleNotices = notices.filter(notice => !dismissedNotices.includes(notice.id));

  if (visibleNotices.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleNotices.map((notice) => (
        <div
          key={notice.id}
          className={`rounded-lg shadow-sm border-l-4 p-4 ${
            notice.type === 'festival'
              ? 'bg-orange-50 border-orange-400'
              : 'bg-blue-50 border-blue-400'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notice.type === 'festival' ? (
                <Sparkles className="w-5 h-5 text-orange-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${
                notice.type === 'festival' ? 'text-orange-800' : 'text-blue-800'
              }`}>
                {notice.title}
              </h3>
              <p className={`mt-1 text-sm ${
                notice.type === 'festival' ? 'text-orange-700' : 'text-blue-700'
              }`}>
                {notice.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => dismissNotice(notice.id)}
                className={`rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  notice.type === 'festival'
                    ? 'text-orange-400 hover:bg-orange-100 focus:ring-orange-500'
                    : 'text-blue-400 hover:bg-blue-100 focus:ring-blue-500'
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}