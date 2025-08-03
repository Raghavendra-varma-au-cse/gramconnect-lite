'use client';

import { useState, useEffect } from 'react';
import { Festival } from '@/lib/types';
import { getUpcomingFestivals } from '@/lib/utils';
import FestivalCard from '@/components/FestivalCard';
import NoticeBanner from '@/components/NoticeBanner';
import ReminderWidget from '@/components/ReminderWidget';
import { Calendar, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [upcomingFestivals, setUpcomingFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFestivals();
  }, []);

  const loadFestivals = async () => {
    try {
      const response = await fetch('/data/festivals_2025_2026.json');
      const data = await response.json();
      setFestivals(data.festivals);
      setUpcomingFestivals(getUpcomingFestivals(data.festivals, 30));
    } catch (error) {
      console.error('Error loading festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const FestivalSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl text-white p-8 md:p-12">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Welcome to GramConnect Lite</h1>
          </div>
          <p className="text-orange-100 text-lg md:text-xl mb-6 leading-relaxed">
            Your local companion for celebrating Indian festivals and tracking community issues. 
            Never miss a festival celebration and help improve your neighborhood.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Festival Reminders</span>
              </div>
              <p className="text-orange-100">Get notified about upcoming festivals with traditional food suggestions</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Community Issues</span>
              </div>
              <p className="text-orange-100">Report and track local complaints to improve your neighborhood</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Offline Ready</span>
              </div>
              <p className="text-orange-100">Works completely offline with all data stored locally</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <NoticeBanner />

      {/* Reminder Widget */}
      <ReminderWidget />

      {/* Upcoming Festivals */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Festivals
              <span className="text-lg font-normal text-gray-600 ml-2">
                (Next 30 Days)
              </span>
            </h2>
          </div>
          {!loading && upcomingFestivals.length > 0 && (
            <p className="text-sm text-gray-600">
              {upcomingFestivals.length} festival{upcomingFestivals.length !== 1 ? 's' : ''} coming up
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <FestivalSkeleton key={i} />
            ))}
          </div>
        ) : upcomingFestivals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Festivals</h3>
            <p className="text-gray-600">
              Check back later or explore all festivals to plan ahead for future celebrations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingFestivals.map((festival) => (
              <FestivalCard key={festival.id} festival={festival} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {festivals.length}
          </div>
          <p className="text-gray-600">Total Festivals in Database</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {festivals.reduce((acc, festival) => acc + festival.foods.length, 0)}
          </div>
          <p className="text-gray-600">Traditional Food Items</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {Array.from(new Set(festivals.flatMap(f => f.region_tags))).length}
          </div>
          <p className="text-gray-600">Regions Covered</p>
        </div>
      </div>
    </div>
  );
}