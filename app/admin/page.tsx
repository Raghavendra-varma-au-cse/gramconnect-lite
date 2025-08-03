'use client';

import { useState, useEffect } from 'react';
import { Complaint, Notice, ComplaintStatus } from '@/lib/types';
import { LocalStorage } from '@/lib/storage';
import { Settings, Edit, Trash2, Plus, Check, Clock, AlertCircle } from 'lucide-react';

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState<'complaints' | 'notices'>('complaints');
  const [editingComplaint, setEditingComplaint] = useState<string | null>(null);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    message: '',
    type: 'civic' as 'civic' | 'festival',
    date: new Date().toISOString().split('T')[0],
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setComplaints(LocalStorage.getComplaints());
    setNotices(LocalStorage.getNotices());
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus) => {
    LocalStorage.updateComplaintStatus(id, status);
    loadData();
    setEditingComplaint(null);
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    LocalStorage.addNotice(noticeForm);
    setNoticeForm({
      title: '',
      message: '',
      type: 'civic',
      date: new Date().toISOString().split('T')[0],
      isActive: true
    });
    setShowNoticeForm(false);
    loadData();
  };

  const deleteNotice = (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      LocalStorage.deleteNotice(id);
      loadData();
    }
  };

  const toggleNoticeStatus = (id: string, isActive: boolean) => {
    LocalStorage.updateNotice(id, { isActive });
    loadData();
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return <Clock className="w-4 h-4" />;
      case 'In Review':
        return <Edit className="w-4 h-4" />;
      case 'Resolved':
        return <Check className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-gray-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage complaints and notices</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'complaints'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Complaints ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Notices ({notices.length})
          </button>
        </nav>
      </div>

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm text-yellow-600">Submitted</p>
                  <p className="text-2xl font-bold text-yellow-800">
                    {complaints.filter(c => c.status === 'Submitted').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center">
                <Edit className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-blue-600">In Review</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {complaints.filter(c => c.status === 'In Review').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-green-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-800">
                    {complaints.filter(c => c.status === 'Resolved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(complaint.status)}
                        <span>{complaint.status}</span>
                      </span>
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                      {complaint.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingComplaint(editingComplaint === complaint.id ? null : complaint.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {editingComplaint === complaint.id ? 'Cancel' : 'Update Status'}
                  </button>
                </div>

                <p className="text-gray-900 mb-3">{complaint.description}</p>
                <p className="text-sm text-gray-600 mb-4">📍 {complaint.location}</p>

                {complaint.image && (
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="w-32 h-32 object-cover rounded-lg mb-4"
                  />
                )}

                {editingComplaint === complaint.id && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-gray-900 mb-3">Update Status:</p>
                    <div className="flex space-x-2">
                      {(['Submitted', 'In Review', 'Resolved'] as ComplaintStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateComplaintStatus(complaint.id, status)}
                          disabled={complaint.status === status}
                          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            complaint.status === status
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-4">
                  Created: {new Date(complaint.createdAt).toLocaleString('en-IN')} |
                  Updated: {new Date(complaint.updatedAt).toLocaleString('en-IN')}
                </div>
              </div>
            ))}

            {complaints.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No complaints found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notices Tab */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          {/* Add Notice Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowNoticeForm(!showNoticeForm)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Notice</span>
            </button>
          </div>

          {/* Notice Form */}
          {showNoticeForm && (
            <form onSubmit={handleNoticeSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Notice</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={noticeForm.type}
                    onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value as 'civic' | 'festival' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="civic">Civic</option>
                    <option value="festival">Festival</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={3}
                  value={noticeForm.message}
                  onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={noticeForm.date}
                  onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={noticeForm.isActive}
                  onChange={(e) => setNoticeForm({ ...noticeForm, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active (will be shown to users)
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Notice
                </button>
                <button
                  type="button"
                  onClick={() => setShowNoticeForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Notices List */}
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notice.type === 'festival' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {notice.type === 'festival' ? '🎉 Festival' : '📢 Civic'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notice.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {notice.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleNoticeStatus(notice.id, !notice.isActive)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {notice.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteNotice(notice.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">{notice.title}</h3>
                <p className="text-gray-700 mb-3">{notice.message}</p>
                <p className="text-sm text-gray-500">📅 {new Date(notice.date).toLocaleDateString('en-IN')}</p>
              </div>
            ))}

            {notices.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notices found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}