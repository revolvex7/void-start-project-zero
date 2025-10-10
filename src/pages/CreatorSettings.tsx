import React, { useState } from 'react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  Copy, 
  Send,
  Plus,
  Trash2
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
                  </div>
                </div>
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
