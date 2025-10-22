import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, Settings, Users, BarChart3, DollarSign, Edit, Eye, Megaphone, Plus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { StartBasicsModal } from './StartBasicsModal';
import { EmailVerificationModal } from '../modals/EmailVerificationModal';
import { useAuth } from '@/contexts/AuthContext';
import { useMembership } from '@/contexts/MembershipContext';

interface CreatorDashboardContentProps {
  creatorName: string;
}

const setupTasks = [
  {
    id: 'basics',
    icon: Settings,
    title: 'Start with the basics',
    description: 'Add your name, photo and what you create.',
    completed: false,
    enabled: true
  },
  {
    id: 'first-post',
    icon: Edit,
    title: 'Make your first post',
    description: 'Create a public welcome post or share your first exclusive post just for members.',
    completed: false,
    link: 'Tips for your first post',
    enabled: true
  },
  {
    id: 'publish',
    icon: Users,
    title: 'Publish your page',
    description: 'You can come back to edit your page at any time.',
    completed: false,
    enabled: true
  }
];

export function CreatorDashboardContent({ creatorName }: CreatorDashboardContentProps) {
  const { user, updateUser } = useAuth();
  const { tiers, addTier, hasTiers } = useMembership();
  const navigate = useNavigate();
  const { creatorUrl } = useParams();
  const [showBasicsModal, setShowBasicsModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [showNewTierModal, setShowNewTierModal] = useState(false);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [newTier, setNewTier] = useState({
    name: '',
    price: '',
    description: ''
  });

  const handleTaskClick = (task: any) => {
    if (!task.enabled) return;
    
    if (task.id === 'basics') {
      setShowBasicsModal(true);
    } else if (task.id === 'first-post') {
      navigate(`/create-post`);
    } else if (task.id === 'layout') {
      navigate('/customize');
    } else if (task.id === 'publish') {
      navigate(`/customize`);
    }
  };

  const handleVerifyEmail = async () => {
    setIsVerifyingEmail(true);
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setIsVerifyingEmail(false);
      setShowEmailVerificationModal(true);
    }, 3000);
  };
  const handleEditPage = () => {
    navigate('/customize');
  };

  const handleAddTier = () => {
    if (!newTier.name || !newTier.price || parseFloat(newTier.price) <= 0) return;
    
    if (editingTierId) {
      // Update existing tier (in a real app, this would call an API)
      console.log('Updating tier:', editingTierId, newTier);
      // For now, just close the modal
    } else {
      // Add new tier
      addTier({
        name: newTier.name,
        price: newTier.price,
        description: newTier.description,
        memberCount: 0,
        currency: 'NGN'
      });
    }
    
    setNewTier({ name: '', price: '', description: '' });
    setEditingTierId(null);
    setShowNewTierModal(false);
  };

  const handleEditTier = (tier: any) => {
    setNewTier({
      name: tier.name,
      price: tier.price,
      description: tier.description || ''
    });
    setEditingTierId(tier.id);
    setShowNewTierModal(true);
  };

  const handleBasicsSave = (data: {
    pageName: string;
    patreonUrl: string;
    description: string;
    profileImage?: string;
  }) => {
    console.log('Basics saved:', data);
    
    // Update user context with the new data
    updateUser({
      creatorName: data.pageName,
      pageName: data.patreonUrl,
      description: data.description,
      profilePhoto: data.profileImage
    });
    
    setCompletedTasks(prev => [...prev, 'basics']);
    setShowBasicsModal(false);
  };

  const getCompletedCount = () => {
    return completedTasks.length;
  };
  return (
    <div className="flex-1 bg-gray-900 text-white">
      {/* Top banner */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <span className="text-sm text-gray-300">You need to verify your email before you can launch your page.</span>
        <Button 
          onClick={handleVerifyEmail}
          variant="outline" 
          size="sm" 
          disabled={isVerifyingEmail}
          className="bg-white text-black border-white hover:bg-gray-100 disabled:opacity-50"
        >
          {isVerifyingEmail ? 'Verifying...' : 'Verify email'}
        </Button>
      </div>

      {/* Creator Name Header */}
      <div className="px-6 py-6 border-b border-gray-700">
        <div className="flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{creatorName}</h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('home')}
              className={`pb-2 px-1 transition-colors ${
                activeTab === 'home' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab('membership')}
              className={`pb-2 px-1 transition-colors ${
                activeTab === 'membership' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Membership
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Edit button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{activeTab === 'home' ? 'Home' : 'Membership'}</h2>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleEditPage}
                variant="outline" 
                className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit page
              </Button>
             
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'home' ? (
            <>
              {/* Welcome Card */}
              <div className="bg-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Welcome to [TrueFans]</h3>
               
              </div>
             
            </div>

            {/* Setup Tasks */}
            <div className="mt-6 space-y-4">
              {setupTasks.map((task, index) => (
                <div 
                  key={index} 
                  onClick={() => handleTaskClick(task)}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    task.enabled 
                      ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer' 
                      : 'bg-gray-800 cursor-not-allowed opacity-50'
                  } ${completedTasks.includes(task.id) ? 'ring-2 ring-green-500' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <task.icon className={`w-5 h-5 ${task.enabled ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${task.enabled ? 'text-white' : 'text-gray-500'}`}>
                        {task.title}
                      </h4>
                      <p className={`text-sm ${task.enabled ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                      {task.link && task.enabled && (
                        <a href="#" className="text-xs text-blue-400 underline mt-1 block">
                          {task.link}
                        </a>
                      )}
                    </div>
                  </div>
                  {completedTasks.includes(task.id) && (
                    <div className="w-5 h-5 text-green-500">✓</div>
                  )}
                  {!completedTasks.includes(task.id) && task.enabled && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">0</h3>
                  <p className="text-gray-400 text-sm">Members</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">₦0</h3>
                  <p className="text-gray-400 text-sm">Monthly revenue</p>
                </div>
              </div>
            </div>
          </div>

              {/* Empty State */}
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start creating</h3>
                <p className="text-gray-400 mb-4">Share your first post to get started with your community.</p>
                <Button 
                  onClick={() => navigate('/create-post')}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Create your first post
                </Button>
              </div>
            </>
          ) : (
            /* Membership Content */
            <div className="bg-gray-800 rounded-lg p-8">
              {!hasTiers ? (
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
                      
                      <Button 
                        onClick={() => setShowNewTierModal(true)}
                        className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3"
                      >
                        Get started
                      </Button>
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
                        <p className="text-2xl font-bold mb-2">$5 <span className="text-sm font-normal text-gray-400">/ month</span></p>
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
                   
                  </div>

                  <div className="space-y-4 mb-6">
                    {tiers.map((tier) => (
                      <div key={tier.id} className="bg-gray-700 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                            <p className="text-gray-300 mb-2">${tier.price} / month • {tier.memberCount} members</p>
                            <p className="text-gray-400">{tier.description}</p>
                          </div>
                          <Button 
                            onClick={() => handleEditTier(tier)}
                            variant="ghost" 
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={16} className="mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => setShowNewTierModal(true)}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500"
                  >
                    <Plus size={16} />
                    <span>Add a tier</span>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Start Basics Modal */}
      <StartBasicsModal 
        open={showBasicsModal}
        onOpenChange={setShowBasicsModal}
        onSave={handleBasicsSave}
      />

      {/* Email Verification Modal */}
      <EmailVerificationModal 
        open={showEmailVerificationModal}
        onOpenChange={setShowEmailVerificationModal}
        email={user?.email}
      />

      {/* New Tier Modal */}
      {showNewTierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingTierId ? 'Edit Subscription Tier' : 'Create Subscription Tier'}</h2>
              <button
                onClick={() => setShowNewTierModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {hasTiers && !editingTierId ? (
                <div className="text-center py-8">
                  <p className="text-gray-300 mb-4">You already have a subscription tier. You can only have one subscription tier at this time.</p>
                  <Button 
                    onClick={() => setShowNewTierModal(false)}
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Set up your monthly subscription</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tier Name</label>
                        <Input
                          placeholder="e.g., Premium Membership"
                          value={newTier.name}
                          onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Monthly Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                          <Input
                            type="number"
                            placeholder="9.99"
                            value={newTier.price}
                            onChange={(e) => setNewTier({ ...newTier, price: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white pl-8"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Set your monthly subscription price</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          placeholder="Describe the benefits subscribers will get (e.g., exclusive content, early access, behind-the-scenes, etc.)"
                          value={newTier.description}
                          onChange={(e) => setNewTier({ ...newTier, description: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                        />
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
                      disabled={!newTier.name || !newTier.price || parseFloat(newTier.price) <= 0}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      {editingTierId ? 'Update Tier' : 'Create Tier'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}