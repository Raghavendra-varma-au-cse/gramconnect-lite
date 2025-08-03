'use client';

import { useState, useEffect } from 'react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';
import { Clock, MapPin, Eye, Filter } from 'lucide-react';
import FilterControls from './FilterControls';

interface ComplaintFeedProps {
  refreshTrigger?: number;
}

export default function ComplaintFeed({ refreshTrigger }: ComplaintFeedProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [filters, setFilters] = useState({
    category: '' as ComplaintCategory | '',
    status: '' as ComplaintStatus | '',
    search: ''
  });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [complaints, filters]);

  const loadComplaints = () => {
    const data = LocalStorage.getComplaints();
    setComplaints(data);
  };

  const applyFilters = () => {
    let filtered = [...complaints];

    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.description.toLowerCase().includes(searchLower) ||
        c.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredComplaints(filtered);
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: ComplaintCategory) => {
    const colors = {
      Water: 'bg-blue-100 text-blue-800',
      Electricity: 'bg-yellow-100 text-yellow-800',
      Sanitation: 'bg-green-100 text-green-800',
      Road: 'bg-gray-100 text-gray-800',
      Garbage: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recent Complaints</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <FilterControls
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{complaints.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <p className="text-sm text-gray-600">Submitted</p>
          <p className="text-2xl font-bold text-yellow-600">
            {complaints.filter(c => c.status === 'Submitted').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <p className="text-sm text-gray-600">In Review</p>
          <p className="text-2xl font-bold text-blue-600">
            {complaints.filter(c => c.status === 'In Review').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600">
            {complaints.filter(c => c.status === 'Resolved').length}
          </p>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No complaints found matching your criteria.</p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(complaint.category)}`}>
                      {complaint.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </div>

                <p className="text-gray-900 mb-3 line-clamp-2">{complaint.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{complaint.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatDate(complaint.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Complaint Details</h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedComplaint.category)}`}>
                    {selectedComplaint.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedComplaint.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-700">{selectedComplaint.location}</p>
                </div>

                {selectedComplaint.image && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Photo</h4>
                    <img
                      src={selectedComplaint.image}
                      alt="Complaint"
                      className="w-full max-w-md rounded-lg"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Submitted</h4>
                    <p className="text-gray-700">{formatDate(selectedComplaint.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Last Updated</h4>
                    <p className="text-gray-700">{formatDate(selectedComplaint.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}