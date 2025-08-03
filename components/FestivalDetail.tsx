'use client';

import { Festival } from '@/lib/types';
import { formatDate, isToday, requestNotificationPermission, scheduleNotification } from '@/lib/utils';
import { LocalStorage } from '@/lib/storage';
import { Calendar, MapPin, Bell, BellOff, Utensils } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FestivalDetailProps {
  festival: Festival;
}

export default function FestivalDetail({ festival }: FestivalDetailProps) {
  const [hasReminder, setHasReminder] = useState(false);
  const [loading, setLoading] = useState(false);
  const isToday_ = isToday(festival.date);

  useEffect(() => {
    const reminders = LocalStorage.getReminders();
    setHasReminder(reminders.some(r => r.festivalId === festival.id));
  }, [festival.id]);

  const handleReminderToggle = async () => {
    setLoading(true);
    
    try {
      if (!hasReminder) {
        const permission = await requestNotificationPermission();
        if (permission === 'granted') {
          // Schedule notification for 1 day before the festival
          const festivalDate = new Date(festival.date);
          const reminderDate = new Date(festivalDate.getTime() - 24 * 60 * 60 * 1000);
          
          scheduleNotification(
            `${festival.name} Tomorrow!`,
            `Don't forget to celebrate ${festival.name} tomorrow. Prepare traditional foods and enjoy the festivities!`,
            reminderDate
          );
        }
      }
      
      const newState = LocalStorage.toggleReminder(
        festival.id,
        festival.name,
        festival.date
      );
      setHasReminder(newState);
    } catch (error) {
      console.error('Error toggling reminder:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 ${
        isToday_ ? 'from-yellow-500 to-orange-600' : ''
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{festival.name}</h1>
            <div className="flex items-center text-orange-100 mb-2">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(festival.date)}</span>
            </div>
            <div className="flex items-center text-orange-100">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{festival.region_tags.join(', ')}</span>
            </div>
          </div>
          
          {isToday_ && (
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-bold">Celebrating Today! 🎉</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Description and Reminder */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About the Festival</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{festival.description}</p>
            </div>
            
            <button
              onClick={handleReminderToggle}
              disabled={loading}
              className={`ml-6 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                hasReminder
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {hasReminder ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              <span>{hasReminder ? 'Remove Reminder' : 'Remind Me'}</span>
            </button>
          </div>
          
          {/* Region Tags */}
          <div className="flex flex-wrap gap-2">
            {festival.region_tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Traditional Foods */}
        <div>
          <div className="flex items-center mb-6">
            <Utensils className="w-6 h-6 text-orange-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Traditional Foods</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festival.foods.map((food, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-100 hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{food.name}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{food.short_note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Celebration Tips</h3>
          <ul className="text-gray-700 space-y-1 text-sm">
            <li>• Prepare traditional foods with family and friends</li>
            <li>• Decorate your home with traditional items and lights</li>
            <li>• Share the joy with your community and neighbors</li>
            <li>• Learn about the cultural significance and stories</li>
            <li>• Take photos and create lasting memories</li>
          </ul>
        </div>
      </div>
    </div>
  );
}