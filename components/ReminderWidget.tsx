'use client';

import { useState, useEffect } from 'react';
import { Reminder } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';
import { Bell, Clock, Calendar, X } from 'lucide-react';
import { formatDate, getDaysUntil } from '@/lib/utils';
import Link from 'next/link';

export default function ReminderWidget() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = () => {
    const data = LocalStorage.getReminders();
    // Sort by festival date
    const sortedReminders = data.sort((a, b) => 
      new Date(a.festivalDate).getTime() - new Date(b.festivalDate).getTime()
    );
    setReminders(sortedReminders);
  };

  const removeReminder = (festivalId: string) => {
    LocalStorage.removeReminder(festivalId);
    loadReminders();
  };

  const upcomingReminders = reminders.filter(reminder => {
    const daysUntil = getDaysUntil(reminder.festivalDate);
    return daysUntil >= 0 && daysUntil <= 30; // Show upcoming within 30 days
  });

  if (upcomingReminders.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-blue-200">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-blue-600" />
              {upcomingReminders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {upcomingReminders.length}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Festival Reminders</h3>
              <p className="text-sm text-gray-600">
                {upcomingReminders.length} upcoming festival{upcomingReminders.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="p-4 space-y-3">
            {upcomingReminders.map((reminder) => {
              const daysUntil = getDaysUntil(reminder.festivalDate);
              return (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/festivals/${reminder.festivalId}`}
                        className="font-medium text-blue-900 hover:text-blue-700"
                      >
                        {reminder.festivalName}
                      </Link>
                      {daysUntil === 0 && (
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                          Today!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(reminder.festivalDate)}</span>
                      </div>
                      {daysUntil > 0 && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{daysUntil} days to go</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeReminder(reminder.festivalId);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}