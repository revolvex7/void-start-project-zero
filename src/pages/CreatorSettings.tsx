import React, { useState } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageCircle, 
  Link, 
  Copy, 
  Settings,
  Bell,
  Shield,
  DollarSign,
  Star,
  Send,
  ExternalLink,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

interface VIPGroup {
  id: string;
  name: string;
  platform: 'whatsapp' | 'telegram';
  inviteLink: string;
  memberCount: number;
  tierRequired: string;
  isActive: boolean;
  createdDate: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isVisible: boolean;
}

export default function CreatorSettings() {
  const [activeTab, setActiveTab] = useState<'vip-groups' | 'social-links' | 'notifications' | 'account'>('vip-groups');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPlatform, setNewGroupPlatform] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [newGroupLink, setNewGroupLink] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // Mock data
  const [vipGroups, setVipGroups] = useState<VIPGroup[]>([
    {
      id: '1',
      name: 'Premium Fitness Community',
      platform: 'whatsapp',
      inviteLink: 'https://chat.whatsapp.com/premium-fitness-123',
      memberCount: 45,
      tierRequired: 'Premium',
      isActive: true,
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'VIP Workout Group',
      platform: 'telegram',
      inviteLink: 'https://t.me/vip-workout-group',
      memberCount: 28,
      tierRequired: 'VIP',
      isActive: true,
      createdDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Basic Support Group',
      platform: 'whatsapp',
      inviteLink: 'https://chat.whatsapp.com/basic-support-456',
      memberCount: 120,
      tierRequired: 'Basic',
      isActive: false,
      createdDate: '2023-12-20'
    }
  ]);

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: '1',
      platform: 'Instagram',
      url: 'https://instagram.com/mikerodriguez',
      isVisible: true
    },
    {
      id: '2',
      platform: 'Twitter',
      url: 'https://twitter.com/mikerodriguez',
      isVisible: true
    },
    {
      id: '3',
      platform: 'YouTube',
      url: 'https://youtube.com/mikerodriguez',
      isVisible: true
    },
    {
      id: '4',
      platform: 'TikTok',
      url: 'https://tiktok.com/@mikerodriguez',
      isVisible: false
    }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const addVIPGroup = () => {
    if (newGroupName && newGroupLink) {
      const newGroup: VIPGroup = {
        id: Date.now().toString(),
        name: newGroupName,
        platform: newGroupPlatform,
        inviteLink: newGroupLink,
        memberCount: 0,
        tierRequired: 'Premium',
        isActive: true,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setVipGroups([...vipGroups, newGroup]);
      setNewGroupName('');
      setNewGroupLink('');
    }
  };

  const addSocialLink = () => {
    if (newSocialPlatform && newSocialUrl) {
      const newLink: SocialLink = {
        id: Date.now().toString(),
        platform: newSocialPlatform,
        url: newSocialUrl,
        isVisible: true
      };
      setSocialLinks([...socialLinks, newLink]);
      setNewSocialPlatform('');
      setNewSocialUrl('');
    }
  };

  const toggleGroupStatus = (groupId: string) => {
    setVipGroups(vipGroups.map(group => 
      group.id === groupId ? { ...group, isActive: !group.isActive } : group
    ));
  };

  const toggleSocialVisibility = (linkId: string) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === linkId ? { ...link, isVisible: !link.isVisible } : link
    ));
  };

  const deleteVIPGroup = (groupId: string) => {
    setVipGroups(vipGroups.filter(group => group.id !== groupId));
  };

  const deleteSocialLink = (linkId: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== linkId));
  };

  const renderVIPGroups = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">VIP Group Invites</h2>
          <p className="text-gray-400 text-sm mt-1">Send paying fans invite links to WhatsApp or Telegram groups</p>
        </div>
        <span className="text-sm text-gray-400">
          {vipGroups.filter(g => g.isActive).length} active groups
        </span>
      </div>

      {/* Add New Group */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Create New VIP Group</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Group Name</label>
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g., Premium Fitness Community"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={newGroupPlatform}
              onChange={(e) => setNewGroupPlatform(e.target.value as 'whatsapp' | 'telegram')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Invite Link</label>
            <Input
              value={newGroupLink}
              onChange={(e) => setNewGroupLink(e.target.value)}
              placeholder="https://chat.whatsapp.com/your-group-link"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="md:col-span-2">
            <Button onClick={addVIPGroup} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>
      </div>

      {/* Existing Groups */}
      <div className="space-y-4">
        {vipGroups.map((group) => (
          <div key={group.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  {group.platform === 'whatsapp' ? (
                    <MessageCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Send className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{group.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="capitalize">{group.platform}</span>
                    <span>•</span>
                    <span>{group.memberCount} members</span>
                    <span>•</span>
                    <span>{group.tierRequired} tier required</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  group.isActive 
                    ? 'text-green-400 bg-green-900/20' 
                    : 'text-gray-400 bg-gray-900/20'
                }`}>
                  {group.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300 font-mono truncate flex-1 mr-4">
                  {group.inviteLink}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(group.inviteLink)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Created: {new Date(group.createdDate).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleGroupStatus(group.id)}
                  className={`border-gray-600 text-gray-300 hover:bg-gray-700 ${
                    group.isActive ? 'text-yellow-400' : 'text-green-400'
                  }`}
                >
                  {group.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteVIPGroup(group.id)}
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSocialLinks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Social Media Links</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your social media presence on your creator profile</p>
        </div>
        <span className="text-sm text-gray-400">
          {socialLinks.filter(l => l.isVisible).length} visible links
        </span>
      </div>

      {/* Add New Social Link */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Add Social Media Link</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <Input
              value={newSocialPlatform}
              onChange={(e) => setNewSocialPlatform(e.target.value)}
              placeholder="e.g., Instagram, Twitter, YouTube"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">URL</label>
            <Input
              value={newSocialUrl}
              onChange={(e) => setNewSocialUrl(e.target.value)}
              placeholder="https://instagram.com/username"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="md:col-span-2">
            <Button onClick={addSocialLink} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </div>
      </div>

      {/* Existing Social Links */}
      <div className="grid gap-4">
        {socialLinks.map((link) => (
          <div key={link.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Link className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{link.platform}</h3>
                  <p className="text-sm text-gray-400 truncate max-w-xs">{link.url}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs ${
                  link.isVisible 
                    ? 'text-green-400 bg-green-900/20' 
                    : 'text-gray-400 bg-gray-900/20'
                }`}>
                  {link.isVisible ? 'Visible' : 'Hidden'}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(link.url, '_blank')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleSocialVisibility(link.id)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {link.isVisible ? 'Hide' : 'Show'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteSocialLink(link.id)}
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      
      <div className="grid gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Creator Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New Subscribers</h4>
                <p className="text-sm text-gray-400">Get notified when someone subscribes to your content</p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Bell className="w-4 h-4 mr-2" />
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Payment Notifications</h4>
                <p className="text-sm text-gray-400">Receive alerts for new payments and earnings</p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <DollarSign className="w-4 h-4 mr-2" />
                Enabled
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Account Settings</h2>
      
      <div className="grid gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Creator Profile</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Profile Visibility</h4>
                <p className="text-sm text-gray-400">Control who can see your creator profile</p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Shield className="w-4 h-4 mr-2" />
                Public
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
            <h1 className="text-3xl font-bold mb-2">Creator Settings</h1>
            <p className="text-gray-400">Manage your VIP groups, social links, and creator preferences</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'vip-groups' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('vip-groups')}
              className={`px-6 py-2 ${
                activeTab === 'vip-groups' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              VIP Groups
            </Button>
            <Button
              variant={activeTab === 'social-links' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('social-links')}
              className={`px-6 py-2 ${
                activeTab === 'social-links' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Link className="w-4 h-4 mr-2" />
              Social Links
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-2 ${
                activeTab === 'notifications' 
                  ? 'bg-white text-black' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
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
            {activeTab === 'vip-groups' && renderVIPGroups()}
            {activeTab === 'social-links' && renderSocialLinks()}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'account' && renderAccount()}
          </div>
        </div>
      </div>
    </div>
  );
}
