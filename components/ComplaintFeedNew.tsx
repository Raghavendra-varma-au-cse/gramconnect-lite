'use client';

import { useState, useEffect } from 'react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';
import { Clock, MapPin, Eye, Filter, X, Calendar, User, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const getCategoryColor = (category: ComplaintCategory): string => {
    const colors = {
      Water: 'bg-blue-100 text-blue-800',
      Electricity: 'bg-yellow-100 text-yellow-800',
      Sanitation: 'bg-green-100 text-green-800',
      Road: 'bg-gray-100 text-gray-800',
      Garbage: 'bg-red-100 text-red-800'
    };
    return colors[category];
  };

  const getStatusColor = (status: ComplaintStatus): string => {
    const colors = {
      Submitted: 'bg-yellow-100 text-yellow-800',
      'In Review': 'bg-blue-100 text-blue-800',
      Resolved: 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getComplaintImages = (complaint: Complaint): string[] => {
    if (complaint.image) {
      return [complaint.image];
    }
    return [];
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
                    {/* Show image count if images exist */}
                    {getComplaintImages(complaint).length > 0 && (
                      <span className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {getComplaintImages(complaint).length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setSelectedImageIndex(0);
                    }}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm hover:bg-blue-50 px-3 py-1 rounded-md transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
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

      {/* Enhanced Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Complaint Details</h3>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white`}>
                      {selectedComplaint.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-white hover:text-gray-200 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Location */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  Location
                </h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedComplaint.location}
                </p>
              </div>

              {/* Images Section */}
              {getComplaintImages(selectedComplaint).length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-green-500" />
                    Photos ({getComplaintImages(selectedComplaint).length})
                  </h4>
                  <div className="relative">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <img
                        src={getComplaintImages(selectedComplaint)[selectedImageIndex]}
                        alt={`Complaint photo ${selectedImageIndex + 1}`}
                        className="w-full max-h-96 object-contain rounded-lg"
                      />
                    </div>
                    
                    {/* Image Navigation */}
                    {getComplaintImages(selectedComplaint).length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImageIndex(prev => 
                            prev === 0 ? getComplaintImages(selectedComplaint).length - 1 : prev - 1
                          )}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedImageIndex(prev => 
                            prev === getComplaintImages(selectedComplaint).length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        {/* Image Dots Indicator */}
                        <div className="flex justify-center mt-4 space-x-2">
                          {getComplaintImages(selectedComplaint).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-colors ${
                                index === selectedImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                  Timeline
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Submitted</span>
                    <span className="text-sm text-gray-600">{formatDate(selectedComplaint.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                    <span className="text-sm text-gray-600">{formatDate(selectedComplaint.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Current Status</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status}
                    </span>
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
