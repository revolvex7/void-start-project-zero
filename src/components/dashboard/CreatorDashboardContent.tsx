import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Settings, Users, BarChart3, DollarSign, Edit, Eye, Megaphone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { StartBasicsModal } from './StartBasicsModal';
import { useAuth } from '@/contexts/AuthContext';

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
    id: 'layout',
    icon: Eye,
    title: 'Choose your layout',
    description: 'Customise your post layout, header and page colours.',
    completed: false,
    enabled: false
  },
  {
    id: 'publish',
    icon: Users,
    title: 'Publish your page',
    description: 'You can come back to edit your page at any time.',
    completed: false,
    enabled: false
  },
  {
    id: 'promote',
    icon: Megaphone,
    title: 'Promote your [TrueFans]',
    description: 'Share previews on social media with a link to your page.',
    completed: false,
    enabled: false
  }
];

export function CreatorDashboardContent({ creatorName }: { creatorName: string }) {
  const navigate = useNavigate();
  const { creatorUrl } = useParams();
  const { updateUser } = useAuth();
  const [showBasicsModal, setShowBasicsModal] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleTaskClick = (task: any) => {
    if (!task.enabled) return;
    
    if (task.id === 'basics') {
      setShowBasicsModal(true);
    } else if (task.id === 'first-post') {
      navigate(`/c/${creatorUrl}/create-post`);
    }
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
    <div className="flex-1 bg-black text-white">
      {/* Top banner */}
      <div className="bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-800">
        <span className="text-sm text-gray-300">You need to verify your email before you can launch your page.</span>
        <Button variant="outline" size="sm" className="bg-white text-black border-white hover:bg-gray-100">
          Verify email
        </Button>
      </div>

      {/* Creator Name Header */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">{creatorName}</h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-8">
            <button className="text-white border-b-2 border-white pb-2 px-1">
              Home
            </button>
            <button className="text-gray-400 hover:text-white pb-2 px-1">
              Collections
            </button>
            <button className="text-gray-400 hover:text-white pb-2 px-1">
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
            <h2 className="text-2xl font-bold">Home</h2>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit page
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                •••
              </Button>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Welcome to [TrueFans]</h3>
                <p className="text-gray-400 mb-3">
                  Let's set up your page and start growing your community. <a href="#" className="text-blue-400 underline">Learn more</a>
                </p>
                <div className="text-green-400 text-sm font-medium">
                  {getCompletedCount()} of 5 complete
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white ml-4">
                ×
              </Button>
            </div>

            {/* Setup Tasks */}
            <div className="mt-6 space-y-4">
              {setupTasks.map((task, index) => (
                <div 
                  key={index} 
                  onClick={() => handleTaskClick(task)}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    task.enabled 
                      ? 'bg-gray-800 hover:bg-gray-750 cursor-pointer' 
                      : 'bg-gray-900 cursor-not-allowed opacity-50'
                  } ${completedTasks.includes(task.id) ? 'ring-2 ring-green-500' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <task.icon className={`w-5 h-5 ${task.enabled ? 'text-gray-400' : 'text-gray-600'}`} />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-6">
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
            
            <div className="bg-gray-900 rounded-xl p-6">
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
            
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">0</h3>
                  <p className="text-gray-400 text-sm">Page views</p>
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
            <Button className="bg-white text-black hover:bg-gray-100">
              Create your first post
            </Button>
          </div>
        </div>
      </div>

      {/* Start Basics Modal */}
      <StartBasicsModal 
        open={showBasicsModal}
        onOpenChange={setShowBasicsModal}
        onSave={handleBasicsSave}
      />
    </div>
  );
}