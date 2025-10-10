import React, { useState, useEffect } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  Copy, 
  Send,
  Plus,
  Trash2,
  Menu,
  X
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

export default function CreatorSettings() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPlatform, setNewGroupPlatform] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [newGroupLink, setNewGroupLink] = useState('');

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


  const deleteVIPGroup = (groupId: string) => {
    setVipGroups(vipGroups.filter(group => group.id !== groupId));
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
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-medium mb-4">Create New VIP Group</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Group Name</label>
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g., Premium Fitness Community"
              className="bg-gray-700 border-gray-600 w-full"
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
          <div>
            <label className="block text-sm font-medium mb-2">Invite Link</label>
            <Input
              value={newGroupLink}
              onChange={(e) => setNewGroupLink(e.target.value)}
              placeholder="https://chat.whatsapp.com/your-group-link"
              className="bg-gray-700 border-gray-600 w-full"
            />
          </div>
          <div>
            <Button onClick={addVIPGroup} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
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
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-gray-300 font-mono break-all flex-1">
                  {group.inviteLink}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(group.inviteLink)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-600 self-start sm:self-auto"
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




  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar-creator-settings');
      const menuButton = document.getElementById('mobile-menu-button-creator-settings');
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
        <button id="mobile-menu-button-creator-settings" onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-semibold">Creator Settings</h1>
        <div className="w-8" />
      </div>
      {showMobileSidebar && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />}
      <div className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out`} id="mobile-sidebar-creator-settings">
        <UnifiedSidebar showMobileSidebar={showMobileSidebar} setShowMobileSidebar={setShowMobileSidebar} />
      </div>
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header - Hidden on mobile since it's in the fixed header */}
          <div className="mb-8 hidden lg:block">
            <h1 className="text-3xl font-bold mb-2">Creator Settings</h1>
            <p className="text-gray-400">Manage your VIP group invites</p>
          </div>


          {/* Content */}
          <div>
            {renderVIPGroups()}
          </div>
        </div>
      </div>
    </div>
  );
}
