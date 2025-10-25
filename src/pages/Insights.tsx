import React, { useState, useEffect } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { useInsights } from '@/hooks/useApi';
import { CreatorDashboardSkeleton } from '@/components/ui/content-skeletons';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  FileText,
  Globe,
  Lock,
  UserCheck,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';

export default function Insights() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { data: insights, isLoading, error, refetch } = useInsights();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar-insights');
      const menuButton = document.getElementById('mobile-menu-button-insights');
      if (showMobileSidebar && sidebar && !sidebar.contains(event.target as Node) && !menuButton?.contains(event.target as Node)) {
        setShowMobileSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button id="mobile-menu-button-insights" onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-semibold">Insights</h1>
        <div className="w-8" />
      </div>
      {showMobileSidebar && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />}
      <div className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out`} id="mobile-sidebar-insights">
        <UnifiedSidebar showMobileSidebar={showMobileSidebar} setShowMobileSidebar={setShowMobileSidebar} />
      </div>
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header - Hidden on mobile since it's in the fixed header */}
          <div className="mb-8 hidden lg:block">
            <h1 className="text-3xl font-bold mb-2">Insights</h1>
            <p className="text-gray-400">Track your performance and growth</p>
          </div>

          {isLoading ? (
            <CreatorDashboardSkeleton />
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-400 mb-2">Failed to load insights</h3>
              <p className="text-gray-400 mb-4">
                {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
              </p>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                className="border-red-500 text-red-400 hover:bg-red-900/30"
              >
                Try Again
              </Button>
            </div>
          ) : insights ? (
            <>
              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Subscribers */}
                <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-300">Total Subscribers</h3>
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{insights.totalSubscribers.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">All-time subscribers</div>
                </div>

                {/* Active Subscribers */}
                <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-300">Active Subscribers</h3>
                    <UserCheck className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{insights.activeSubscribers.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">
                    {insights.totalSubscribers > 0 ? ((insights.activeSubscribers / insights.totalSubscribers) * 100).toFixed(1) : 0}% active rate
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-300">Total Revenue</h3>
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">NGN {insights.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    All-time earnings
                  </div>
                </div>

                {/* Posts This Month */}
                <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-300">Posts This Month</h3>
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{insights.postsThisMonth}</div>
                  <div className="text-sm text-gray-400">Content published</div>
                </div>

                {/* Free Posts */}
                <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-300">Free Posts</h3>
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{insights.freePosts}</div>
                  <div className="text-sm text-gray-400">
                    {insights.postsThisMonth > 0 ? ((insights.freePosts / insights.postsThisMonth) * 100).toFixed(0) : 0}% of total
                  </div>
                </div>

                {/* Paid Posts */}
                <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-300">Paid Posts</h3>
                    <Lock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{insights.paidPosts}</div>
                  <div className="text-sm text-gray-400">
                    {insights.postsThisMonth > 0 ? ((insights.paidPosts / insights.postsThisMonth) * 100).toFixed(0) : 0}% of total
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
