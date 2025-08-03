'use client';

import { useState, useEffect } from 'react';
import { Festival } from '@/lib/types';
import FestivalDetail from '@/components/FestivalDetail';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function FestivalPage() {
  const params = useParams();
  const [festival, setFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFestival();
  }, [params.id]);

  const loadFestival = async () => {
    try {
      const response = await fetch('/data/festivals_2025_2026.json');
      const data = await response.json();
      const foundFestival = data.festivals.find((f: Festival) => f.id === params.id);
      setFestival(foundFestival || null);
    } catch (error) {
      console.error('Error loading festival:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
          <div className="bg-gray-200 h-48"></div>
          <div className="p-8 space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!festival) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Festival Not Found</h1>
        <p className="text-gray-600 mb-6">The festival you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <FestivalDetail festival={festival} />
    </div>
  );
}