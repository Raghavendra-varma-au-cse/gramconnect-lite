import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Home, Calendar, MessageSquare, Settings } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GramConnect Lite - Festival Reminders & Complaint Tracker',
  description: 'Your local companion for Indian festivals and civic complaints',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">GC</span>
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">GramConnect Lite</h1>
                    <p className="text-xs text-gray-600">Festivals & Complaints</p>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/complaints"
                    className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Complaints</span>
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Mobile Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex items-center justify-around">
              <Link
                href="/"
                className="flex flex-col items-center space-y-1 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="text-xs">Home</span>
              </Link>
              <Link
                href="/complaints"
                className="flex flex-col items-center space-y-1 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">Complaints</span>
              </Link>
              <Link
                href="/admin"
                className="flex flex-col items-center space-y-1 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs">Admin</span>
              </Link>
            </div>
          </nav>

          {/* Mobile Bottom Spacer */}
          <div className="md:hidden h-16"></div>
        </div>
      </body>
    </html>
  );
}