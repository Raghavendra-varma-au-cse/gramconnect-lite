import Link from 'next/link';
import { ArrowLeft, Calendar, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Festival Not Found</h1>
          <p className="text-gray-600 text-lg mb-6">
            The festival you're looking for doesn't exist or may have been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or explore our collection of festivals:</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <Search className="w-4 h-4" />
              <span>Use the search and filters on the main page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}