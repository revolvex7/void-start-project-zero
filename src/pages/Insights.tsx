import React, { useState } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share
} from 'lucide-react';

export default function Insights() {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'earnings'>('subscribers');

  // Mock data for subscribers
  const subscriberStats = {
    total: 1247,
    thisMonth: 89,
    growth: '+12.5%',
    recentSubscribers: [
      { name: 'Alex Johnson', date: '2 hours ago', tier: 'Premium' },
      { name: 'Sarah Chen', date: '5 hours ago', tier: 'Basic' },
      { name: 'Mike Rodriguez', date: '1 day ago', tier: 'VIP' },
      { name: 'Emma Wilson', date: '2 days ago', tier: 'Premium' },
      { name: 'David Kim', date: '3 days ago', tier: 'Basic' }
    ]
  };

  // Mock data for earnings
  const earningsStats = {
    totalRevenue: 4250,
    thisMonth: 890,
    growth: '+18.2%',
    recentTransactions: [
      { subscriber: 'Alex Johnson', amount: 25, date: '2 hours ago', type: 'Premium Subscription' },
      { subscriber: 'Sarah Chen', amount: 10, date: '5 hours ago', type: 'Basic Subscription' },
      { subscriber: 'Mike Rodriguez', amount: 50, date: '1 day ago', type: 'VIP Subscription' },
      { subscriber: 'Emma Wilson', amount: 25, date: '2 days ago', type: 'Premium Subscription' },
      { subscriber: 'David Kim', amount: 10, date: '3 days ago', type: 'Basic Subscription' }
    ]
  };

  // Mock engagement data
  const engagementData = [
    { metric: 'Post Views', value: '12.4K', change: '+8.2%', icon: Eye },
    { metric: 'Likes', value: '2.1K', change: '+15.3%', icon: Heart },
    { metric: 'Comments', value: '456', change: '+22.1%', icon: MessageCircle },
    { metric: 'Shares', value: '189', change: '+5.7%', icon: Share }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 sm:w-72 lg:w-80 bg-gray-800 z-50">
        <UnifiedSidebar />
      </div>
      
      {/* Main Content */}
      <div className="ml-64 sm:ml-72 lg:ml-80 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Insights</h1>
            <p className="text-gray-400">Track your subscribers, earnings, and engagement</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'subscribers' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('subscribers')}
              className={`px-6 py-2 ${
                activeTab === 'subscribers' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Subscribers
            </Button>
            <Button
              variant={activeTab === 'earnings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('earnings')}
              className={`px-6 py-2 ${
                activeTab === 'earnings' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Earnings
            </Button>
          </div>

          {/* Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Total Subscribers</h3>
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{subscriberStats.total.toLocaleString()}</div>
                  <div className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {subscriberStats.growth} from last month
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">This Month</h3>
                    <Calendar className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{subscriberStats.thisMonth}</div>
                  <div className="text-sm text-gray-400">New subscribers</div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Growth Rate</h3>
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{subscriberStats.growth}</div>
                  <div className="text-sm text-gray-400">Monthly growth</div>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Engagement Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {engagementData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="flex justify-center mb-2">
                        <item.icon className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold mb-1">{item.value}</div>
                      <div className="text-sm text-gray-400 mb-1">{item.metric}</div>
                      <div className="text-xs text-green-400">{item.change}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Subscribers */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Recent Subscribers</h3>
                <div className="space-y-4">
                  {subscriberStats.recentSubscribers.map((subscriber, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">{subscriber.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{subscriber.name}</div>
                          <div className="text-sm text-gray-400">{subscriber.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subscriber.tier === 'VIP' ? 'bg-purple-600 text-white' :
                          subscriber.tier === 'Premium' ? 'bg-blue-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {subscriber.tier}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">${earningsStats.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {earningsStats.growth} from last month
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">This Month</h3>
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">${earningsStats.thisMonth}</div>
                  <div className="text-sm text-gray-400">Monthly earnings</div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Average per Sub</h3>
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold mb-2">${(earningsStats.totalRevenue / subscriberStats.total).toFixed(2)}</div>
                  <div className="text-sm text-gray-400">Revenue per subscriber</div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Revenue Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-300 mb-1">$1,200</div>
                    <div className="text-sm text-gray-400 mb-1">Basic Tier</div>
                    <div className="text-xs text-blue-400">28% of total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">$2,100</div>
                    <div className="text-sm text-gray-400 mb-1">Premium Tier</div>
                    <div className="text-xs text-blue-400">49% of total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">$950</div>
                    <div className="text-sm text-gray-400 mb-1">VIP Tier</div>
                    <div className="text-xs text-purple-400">23% of total</div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Recent Transactions</h3>
                <div className="space-y-4">
                  {earningsStats.recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">{transaction.subscriber}</div>
                          <div className="text-sm text-gray-400">{transaction.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-400">+${transaction.amount}</div>
                        <div className="text-sm text-gray-400">{transaction.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
