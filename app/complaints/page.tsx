'use client';

import { useState } from 'react';
import ComplaintForm from '@/components/ComplaintForm';
import ComplaintFeed from '@/components/ComplaintFeed';
import { MessageSquare, Plus, List } from 'lucide-react';

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'submit'>('feed');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleComplaintSubmit = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('feed');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Complaint Tracker</h1>
            <p className="text-gray-600">Report and track local community issues</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('feed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'feed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <List className="w-4 h-4" />
              <span>View Complaints</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'submit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Submit Complaint</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === 'feed' ? (
          <ComplaintFeed refreshTrigger={refreshTrigger} />
        ) : (
          <div className="max-w-2xl">
            <ComplaintForm onSubmit={handleComplaintSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}