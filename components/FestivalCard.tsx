'use client';

import { Festival } from '@/lib/types';
import { formatDate, getDaysUntil, isToday } from '@/lib/utils';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

interface FestivalCardProps {
  festival: Festival;
}

export default function FestivalCard({ festival }: FestivalCardProps) {
  const daysUntil = getDaysUntil(festival.date);
  const isToday_ = isToday(festival.date);

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
      isToday_ ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {festival.name}
          </h3>
          {isToday_ && (
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
              Today!
            </span>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDate(festival.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{festival.region_tags.join(', ')}</span>
          </div>
          
          {!isToday_ && (
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {daysUntil > 0 ? `${daysUntil} days to go` : `${Math.abs(daysUntil)} days ago`}
              </span>
            </div>
          )}
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {festival.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {festival.region_tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {festival.region_tags.length > 2 && (
              <span className="text-xs text-gray-500">
                +{festival.region_tags.length - 2} more
              </span>
            )}
          </div>
          
          <Link
            href={`/festivals/${festival.id}`}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}