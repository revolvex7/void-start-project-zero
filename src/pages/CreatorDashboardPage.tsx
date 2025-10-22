import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/contexts/MembershipContext';
import { CreatorDashboardContent } from '@/components/dashboard/CreatorDashboardContent';
import { Plus, Eye, Edit, X, Info, Loader2 } from 'lucide-react';

interface CreatorDashboardPageProps {
  currentPage: string;
}

export default function CreatorDashboardPage({ currentPage }: CreatorDashboardPageProps) {
  const { user } = useAuth();
  const { tiers, addTier, updateTier, hasTiers, isLoading, error, refetch } = useMembership();
  const [showNewTierModal, setShowNewTierModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [newTier, setNewTier] = useState({
    name: '',
    price: '',
    description: ''
  });

  const handleSaveTier = async () => {
    if (newTier.name && newTier.price && parseFloat(newTier.price) > 0) {
      try {
        setIsCreating(true);
        
        if (editingTier) {
          // Update existing tier
          await updateTier(editingTier.id, {
            name: newTier.name,
            price: newTier.price,
            description: newTier.description,
            currency: 'NGN'
          });
        } else {
          // Create new tier
          await addTier({
            name: newTier.name,
            price: newTier.price,
            description: newTier.description,
            memberCount: 0,
            currency: 'NGN'
          });
        }
        
        setNewTier({ name: '', price: '', description: '' });
        setEditingTier(null);
        setShowNewTierModal(false);
        // Refetch memberships to get updated list
        await refetch();
      } catch (err) {
        console.error('Failed to save membership:', err);
        // Error is already handled in the context
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleEditTier = (tier: any) => {
    setEditingTier(tier);
    setNewTier({
      name: tier.name,
      price: tier.price,
      description: tier.description
    });
    setShowNewTierModal(true);
  };

  const handleCloseModal = () => {
    setShowNewTierModal(false);
    setEditingTier(null);
    setNewTier({ name: '', price: '', description: '' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'library':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Content Library</h1>
            <p className="text-gray-400">Manage your posts, videos, and exclusive content here.</p>
          </div>
        );
      case 'membership':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-gray-800 rounded-lg p-8">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-400">Loading memberships...</span>
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                  <p className="text-red-400">Error: {error}</p>
                </div>
              )}
              
              {/* Content */}
              {!isLoading && !hasTiers ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">Build your paid membership</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-sm">$</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Income you can count on</h3>
                          <p className="text-gray-400">Earn recurring income from your biggest fans.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Start with what you have</h3>
                          <p className="text-gray-400">Offer something you're already excited to share with your fans, plus some added perks.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-sm">📊</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Grow your creative business</h3>
                          <p className="text-gray-400">Get insights on your members, create exclusive member-only Chats and more.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button 
                          onClick={() => setShowNewTierModal(true)}
                          className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3"
                        >
                          Get started
                        </Button>
                        <div className="group relative">
                          <Info className="w-5 h-5 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Only monthly memberships supported for now
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-6">
                      <div className="bg-pink-100 rounded-lg p-4 mb-4">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face" 
                          alt="Creator" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-lg mb-2">Friend of the Show</h4>
                        <p className="text-2xl font-bold mb-2">₦5 <span className="text-sm font-normal text-gray-400">/ month</span></p>
                        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2">
                          Join now
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold">Paid membership tiers</h2>
                      <p className="text-gray-400 mt-2">Creators can set monthly or one-time prices with different perks.</p>
                    </div>
                    <Button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500">
                      <Eye size={16} />
                      <span>Preview</span>
                    </Button>
                  </div>

                  <div className="space-y-4 mb-6">
                    {tiers.map((tier) => (
                      <div key={tier.id} className="bg-gray-700 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                            <p className="text-gray-300 mb-2">₦{tier.price} / month • {tier.memberCount} members</p>
                            <p className="text-gray-400">{tier.description}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => handleEditTier(tier)}
                          >
                            <Edit size={16} className="mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={() => setShowNewTierModal(true)}
                      disabled={hasTiers} // Only allow one membership
                      className={`flex items-center space-x-2 ${
                        hasTiers 
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      <Plus size={16} />
                      <span>{hasTiers ? 'Membership exists' : 'Add a tier'}</span>
                    </Button>
                    {hasTiers && (
                      <div className="group relative">
                        <Info className="w-5 h-5 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          Only one membership tier allowed currently
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case 'insights':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Insights</h1>
            <p className="text-gray-400">Analytics and performance metrics for your content.</p>
          </div>
        );
      case 'payouts':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Payouts</h1>
            <p className="text-gray-400">Manage your earnings and payment settings.</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <p className="text-gray-400">No new notifications</p>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Creator Settings</h1>
            <p className="text-gray-400">Manage your creator profile and preferences.</p>
          </div>
        );
      default:
        return <CreatorDashboardContent creatorName={user?.creatorName || user?.name || 'Creator'} />;
    }
  };

  return (
    <>
      {renderContent()}

      {/* New Tier Modal */}
      {showNewTierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingTier ? 'Edit tier' : 'New tier'}</h2>
              <button
                onClick={handleCloseModal}
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
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newTier.price}
                        onChange={(e) => setNewTier({ ...newTier, price: e.target.value })}
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
                  onClick={handleCloseModal}
                  className="bg-transparent border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveTier}
                  disabled={!newTier.name || !newTier.price || parseFloat(newTier.price) <= 0 || isCreating}
                  className="bg-white text-black hover:bg-gray-100 disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {editingTier ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingTier ? 'Update tier' : 'Save tier'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
