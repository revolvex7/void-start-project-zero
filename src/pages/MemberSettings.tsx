import React, { useState } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  User, 
  Star,
  Download,
  Eye,
  Settings,
  Bell,
  Shield,
  Trash2
} from 'lucide-react';

interface Subscription {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'active' | 'cancelled' | 'expired';
  nextBilling: string;
  subscribedDate: string;
  isVerified?: boolean;
}

interface PurchaseHistory {
  id: string;
  type: 'subscription' | 'tip' | 'content';
  creatorName: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function MemberSettings() {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'memberships' | 'history' | 'account'>('subscriptions');

  // Mock data
  const subscriptions: Subscription[] = [
    {
      id: '1',
      creatorName: 'Alex Johnson',
      creatorAvatar: 'AJ',
      planName: 'Premium Access',
      amount: 2500,
      currency: 'NGN',
      status: 'active',
      nextBilling: '2024-02-20',
      subscribedDate: '2024-01-20',
      isVerified: true
    },
    {
      id: '2',
      creatorName: 'Sarah Chen',
      creatorAvatar: 'SC',
      planName: 'Basic Tier',
      amount: 1000,
      currency: 'NGN',
      status: 'active',
      nextBilling: '2024-02-15',
      subscribedDate: '2024-01-15'
    },
    {
      id: '3',
      creatorName: 'Mike Rodriguez',
      creatorAvatar: 'MR',
      planName: 'VIP Access',
      amount: 5000,
      currency: 'NGN',
      status: 'cancelled',
      nextBilling: '2024-02-10',
      subscribedDate: '2023-12-10',
      isVerified: true
    }
  ];

  const purchaseHistory: PurchaseHistory[] = [
    {
      id: '1',
      type: 'subscription',
      creatorName: 'Alex Johnson',
      description: 'Premium Access - Monthly',
      amount: 2500,
      currency: 'NGN',
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: '2',
      type: 'tip',
      creatorName: 'Sarah Chen',
      description: 'Tip for amazing content',
      amount: 500,
      currency: 'NGN',
      date: '2024-01-18',
      status: 'completed'
    },
    {
      id: '3',
      type: 'content',
      creatorName: 'Emma Wilson',
      description: 'Digital Art Tutorial Pack',
      amount: 1500,
      currency: 'NGN',
      date: '2024-01-15',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20';
      case 'cancelled': return 'text-red-400 bg-red-900/20';
      case 'expired': return 'text-gray-400 bg-gray-900/20';
      case 'completed': return 'text-green-400 bg-green-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      case 'failed': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return currency === 'NGN' ? `₦${amount.toLocaleString()}` : `$${amount}`;
  };

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active Subscriptions</h2>
        <span className="text-sm text-gray-400">
          {subscriptions.filter(s => s.status === 'active').length} active subscriptions
        </span>
      </div>

      <div className="grid gap-4">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">{subscription.creatorAvatar}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{subscription.creatorName}</h3>
                    {subscription.isVerified && (
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{subscription.planName}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {formatCurrency(subscription.amount, subscription.currency)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Subscribed:</span>
                <p className="font-medium">{new Date(subscription.subscribedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-400">Next billing:</span>
                <p className="font-medium">{new Date(subscription.nextBilling).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-700">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              {subscription.status === 'active' && (
                <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMemberships = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Memberships</h2>
        <span className="text-sm text-gray-400">
          Following {subscriptions.length} creators
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">{subscription.creatorAvatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <h3 className="font-medium text-sm truncate">{subscription.creatorName}</h3>
                  {subscription.isVerified && (
                    <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{subscription.planName}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan:</span>
                <span>{formatCurrency(subscription.amount, subscription.currency)}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Since:</span>
                <span>{new Date(subscription.subscribedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-xs">
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-xs">
                Message
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPurchaseHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Purchase History</h2>
        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="space-y-4">
        {purchaseHistory.map((purchase) => (
          <div key={purchase.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  {purchase.type === 'subscription' && <CreditCard className="w-5 h-5 text-blue-400" />}
                  {purchase.type === 'tip' && <DollarSign className="w-5 h-5 text-green-400" />}
                  {purchase.type === 'content' && <Star className="w-5 h-5 text-purple-400" />}
                </div>
                <div>
                  <h3 className="font-medium">{purchase.description}</h3>
                  <p className="text-sm text-gray-400">{purchase.creatorName}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatCurrency(purchase.amount, purchase.currency)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(purchase.status)}`}>
                    {purchase.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(purchase.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Account Settings</h2>
      
      <div className="grid gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New Content Notifications</h4>
                <p className="text-sm text-gray-400">Get notified when creators you follow post new content</p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Bell className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Privacy & Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Account Privacy</h4>
                <p className="text-sm text-gray-400">Manage who can see your profile and activity</p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Shield className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 sm:w-72 lg:w-80 bg-gray-800 z-50">
        <UnifiedSidebar />
      </div>
      
      {/* Main Content */}
      <div className="ml-64 sm:ml-72 lg:ml-80 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">Manage your subscriptions, memberships, and account preferences</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'subscriptions' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('subscriptions')}
              className={`px-6 py-2 ${
                activeTab === 'subscriptions' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Subscriptions
            </Button>
            <Button
              variant={activeTab === 'memberships' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('memberships')}
              className={`px-6 py-2 ${
                activeTab === 'memberships' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Memberships
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 ${
                activeTab === 'history' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              variant={activeTab === 'account' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('account')}
              className={`px-6 py-2 ${
                activeTab === 'account' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Account
            </Button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'subscriptions' && renderSubscriptions()}
            {activeTab === 'memberships' && renderMemberships()}
            {activeTab === 'history' && renderPurchaseHistory()}
            {activeTab === 'account' && renderAccountSettings()}
          </div>
        </div>
      </div>
    </div>
  );
}
