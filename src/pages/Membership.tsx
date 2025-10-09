import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useMembership } from '@/contexts/MembershipContext';
import { Menu, X, Plus, Eye, Edit } from 'lucide-react';

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  description: string;
  memberCount: number;
}

export default function Membership() {
  const navigate = useNavigate();
  const { creatorUrl } = useParams();
  const { currentRole } = useUserRole();
  const { tiers, addTier } = useMembership();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showNewTierModal, setShowNewTierModal] = useState(false);
  
  const [newTier, setNewTier] = useState({
    name: '',
    price: 0,
    description: ''
  });

  const handleAddTier = () => {
    if (newTier.name && newTier.price > 0) {
      addTier({
        name: newTier.name,
        price: newTier.price,
        description: newTier.description,
        memberCount: 0
      });
      setNewTier({ name: '', price: 0, description: '' });
      setShowNewTierModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full relative">
              <div className="absolute inset-0 bg-white rounded-full" style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%)'
              }}></div>
            </div>
          </div>
          <span className="font-semibold text-sm">[TrueFans] {currentRole === 'creator' ? 'Creator' : ''}</span>
        </div>

        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentRole === 'creator' ? 'bg-pink-600' : 'bg-blue-600'
        }`}>
          <span className="text-white font-bold text-sm">A</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar */}
      <div className={`
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out
      `}>
        <UnifiedSidebar 
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Paid membership tiers</h1>
              <p className="text-gray-400 mt-2">Creators can set monthly or one-time prices with different perks.</p>
            </div>
            <Button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500">
              <Eye size={16} />
              <span>Preview</span>
            </Button>
          </div>

          {/* Existing Tiers */}
          <div className="space-y-4 mb-6">
            {tiers.map((tier) => (
              <div key={tier.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                    <p className="text-gray-300 mb-2">${tier.price} / month • {tier.memberCount} members</p>
                    <p className="text-gray-400">{tier.description}</p>
                  </div>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Tier Button */}
          <Button 
            onClick={() => setShowNewTierModal(true)}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600"
          >
            <Plus size={16} />
            <span>Add a tier</span>
          </Button>
        </div>
      </div>

      {/* New Tier Modal */}
      {showNewTierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">New tier</h2>
              <button
                onClick={() => setShowNewTierModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Customise tier</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      placeholder="Tier name"
                      value={newTier.name}
                      onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newTier.price || ''}
                        onChange={(e) => setNewTier({ ...newTier, price: parseFloat(e.target.value) || 0 })}
                        className="bg-gray-700 border-gray-600 text-white pl-8"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Eye size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tier description (optional)</label>
                    <Textarea
                      placeholder="Describe the benefits and exclusive content people can expect to get when they join."
                      value={newTier.description}
                      onChange={(e) => setNewTier({ ...newTier, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cover image (optional)</label>
                    <Button variant="outline" className="bg-gray-700 border-gray-600 text-gray-300">
                      <Plus size={16} className="mr-2" />
                      Add cover image
                    </Button>
                    <p className="text-sm text-gray-400 mt-2">Recommended size: 460 by 200 pixels</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewTierModal(false)}
                  className="bg-transparent border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddTier}
                  disabled={!newTier.name || newTier.price <= 0}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Save tier
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
