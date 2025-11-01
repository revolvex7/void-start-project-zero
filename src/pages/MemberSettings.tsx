import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Trash2,
  Menu,
  X,
  Loader2,
  Upload,
  Camera
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'account'>('subscriptions');
  
  // Edit Profile Modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    profilePhoto: ''
  });
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Change Password Modal
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Load user data - use bio and profilePhoto from root level
  useEffect(() => {
    if (user) {
      // Get profile data from root level of user object
      const userBio = (user as any).bio || '';
      const userProfilePhoto = (user as any).profilePhoto || '';
      
      setProfileData({
        name: user.name || '',
        bio: userBio,
        profilePhoto: userProfilePhoto
      });
      setProfileImagePreview(userProfilePhoto || null);
    }
  }, [user]);

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
              <Button 
                onClick={() => navigate(`/${subscription.creatorName.toLowerCase().replace(' ', '-')}`)} 
                variant="outline" 
                size="sm" 
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              {subscription.status === 'active' && (
                <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImagePreview(base64String);
        setProfileData({ ...profileData, profilePhoto: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      // Update user profile with bio and profilePhoto at root level
      const response = await userAPI.updateMemberProfile({
        name: profileData.name,
        bio: profileData.bio,
        profilePhoto: profileImagePreview || profileData.profilePhoto
      });
      
      if (response.data) {
        // Update the user context with new profile data
        updateUser({
          ...user,
          name: response.data.name,
          bio: response.data.bio || '',
          profilePhoto: response.data.profilePhoto || ''
        } as any);
        
        toast({
          title: "Profile updated!",
          description: "Your profile has been updated successfully.",
        });
        
        setShowEditProfileModal(false);
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    
    // Validate old password
    if (!passwordData.oldPassword) {
      setPasswordError('Old password is required');
      return;
    }
    
    // Validate new password
    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await userAPI.changePassword(passwordData.oldPassword, passwordData.newPassword);
      
      toast({
        title: "Password changed!",
        description: "Your password has been changed successfully.",
      });
      
      setShowChangePasswordModal(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      setPasswordError(errorMessage);
      
      toast({
        title: "Password change failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Account Settings</h2>
      
      <div className="grid gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Update Profile</h4>
                <p className="text-sm text-gray-400">Edit your profile information, avatar, and bio</p>
              </div>
              <Button 
                onClick={() => setShowEditProfileModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Change Password</h4>
                <p className="text-sm text-gray-400">Update your password to keep your account secure</p>
              </div>
              <Button 
                onClick={() => setShowChangePasswordModal(true)}
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar-member-settings');
      const menuButton = document.getElementById('mobile-menu-button-member-settings');
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
        <button id="mobile-menu-button-member-settings" onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-semibold">Settings</h1>
        <div className="w-8" />
      </div>
      {showMobileSidebar && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />}
      <div className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out`} id="mobile-sidebar-member-settings">
        <UnifiedSidebar showMobileSidebar={showMobileSidebar} setShowMobileSidebar={setShowMobileSidebar} />
      </div>
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header - Hidden on mobile since it's in the fixed header */}
          <div className="mb-8 hidden lg:block">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-400">Manage your subscriptions, memberships, and account preferences</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg overflow-x-auto scrollbar-hide">
            <Button
              variant={activeTab === 'subscriptions' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('subscriptions')}
              className={`px-4 sm:px-6 py-2 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'subscriptions' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Subscriptions</span>
              <span className="sm:hidden">Subs</span>
            </Button>
            <Button
              variant={activeTab === 'account' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('account')}
              className={`px-4 sm:px-6 py-2 whitespace-nowrap flex-shrink-0 ${
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
            {activeTab === 'account' && renderAccountSettings()}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">Click camera icon to upload</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Your name"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEditProfileModal(false)}
                  disabled={isUpdatingProfile}
                  className="bg-transparent border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile || !profileData.name}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 min-w-[100px]"
                >
                  {isUpdatingProfile ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Change Password</h2>
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {passwordError && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">
                  {passwordError}
                </div>
              )}

              {/* Old Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <Input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                  }}
                  disabled={isChangingPassword}
                  className="bg-transparent border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 min-w-[120px]"
                >
                  {isChangingPassword ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Changing...</span>
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
