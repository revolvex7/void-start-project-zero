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
import apiService, { GroupInvite } from '@/lib/api';

export default function CreatorSettings() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPlatform, setNewGroupPlatform] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [newGroupLink, setNewGroupLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use GroupInvite from API instead of VIPGroup
  const [groupInvites, setGroupInvites] = useState<GroupInvite[]>([]);

  // Fetch group invites on component mount
  useEffect(() => {
    fetchGroupInvites();
  }, []);

  const fetchGroupInvites = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGroupInvites();
      setGroupInvites(response.data || []);
    } catch (err) {
      console.error('Failed to fetch group invites:', err);
      setError('Failed to load group invites');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const addGroupInvite = async () => {
    if (newGroupName && newGroupLink) {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.createGroupInvite({
          groupName: newGroupName,
          platform: newGroupPlatform,
          link: newGroupLink,
        });
        
        // Add the new group invite to the list
        setGroupInvites([response.data, ...groupInvites]);
        
        // Clear form
        setNewGroupName('');
        setNewGroupLink('');
      } catch (err) {
        console.error('Failed to create group invite:', err);
        setError('Failed to create group invite');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteGroupInvite = async (groupId: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.deleteGroupInvite(groupId);
      
      // Remove from local state
      setGroupInvites(groupInvites.filter(group => group.id !== groupId));
    } catch (err) {
      console.error('Failed to delete group invite:', err);
      setError('Failed to delete group invite');
    } finally {
      setLoading(false);
    }
  };

  const renderVIPGroups = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">VIP Group Invites</h2>
          <p className="text-gray-400 text-sm mt-1">Send paying fans invite links to WhatsApp or Telegram groups</p>
        </div>
        <span className="text-sm text-gray-400">
          {groupInvites.length} groups
        </span>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={newGroupPlatform}
              onChange={(e) => setNewGroupPlatform(e.target.value as 'whatsapp' | 'telegram')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <div>
            <Button 
              onClick={addGroupInvite} 
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              disabled={loading || !newGroupName || !newGroupLink}
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && groupInvites.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400">Loading group invites...</div>
        </div>
      )}

      {/* Existing Groups */}
      <div className="space-y-4">
        {groupInvites.map((group) => (
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
                  <h3 className="font-medium">{group.groupName}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="capitalize">{group.platform}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-gray-300 font-mono break-all flex-1">
                  {group.link}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(group.link)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-600 self-start sm:self-auto"
                  disabled={loading}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Created: {new Date(group.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteGroupInvite(group.id)}
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && groupInvites.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400">No group invites created yet. Create your first one above!</div>
        </div>
      )}
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
