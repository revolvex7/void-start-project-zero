import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import FanDashboard from '@/components/dashboard/FanDashboard';
import CreatorDashboard from '@/components/dashboard/CreatorDashboard';

const Dashboard = () => {
  const { user, completeCreatorProfile, updateUser, isCreator, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [showCreatorSetup, setShowCreatorSetup] = useState(false);
  const [currentView, setCurrentView] = useState<'fan' | 'creator'>('fan');
  const [creatorData, setCreatorData] = useState({
    creatorName: '',
    pageName: '',
    is18Plus: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Determine initial view based on user status and URL params
  useEffect(() => {
    const viewParam = searchParams.get('view');
    const setupParam = searchParams.get('setup');
    
    if (setupParam === 'creator') {
      setShowCreatorSetup(true);
    } else if (viewParam === 'creator' && isCreator) {
      setCurrentView('creator');
    } else if (viewParam === 'fan') {
      setCurrentView('fan');
    } else if (isCreator) {
      setCurrentView('creator');
    } else {
      setCurrentView('fan');
    }
  }, [isCreator, searchParams]);

  // Fetch user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    
    if (user) {
      loadUserProfile();
    }
  }, [fetchUserProfile, user]);

  const handleCompleteCreatorProfile = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await completeCreatorProfile({
        creatorName: creatorData.creatorName,
        pageName: creatorData.pageName,
        is18Plus: creatorData.is18Plus
      });
      
      updateUser({
        creatorName: creatorData.creatorName,
        pageName: creatorData.pageName,
        is18Plus: creatorData.is18Plus,
      });
      
      toast({
        title: "Creator profile completed!",
        description: "Welcome to your creator dashboard.",
      });
      
      setShowCreatorSetup(false);
      setCurrentView('creator');
      // Update URL to reflect creator view
      navigate('/dashboard?view=creator', { replace: true });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete creator profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render the appropriate dashboard based on current view
  if (showCreatorSetup) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md mx-auto p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Complete Your Creator Profile</h1>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="adult-content"
                checked={creatorData.is18Plus}
                onCheckedChange={(checked) => setCreatorData(prev => ({ ...prev, is18Plus: checked as boolean }))}
                className="border-gray-400 mt-1"
              />
              <label htmlFor="adult-content" className="text-white text-sm leading-relaxed">
                My page isn't suitable for people under 18
              </label>
            </div>

            <Input
              type="text"
              value={creatorData.creatorName}
              onChange={(e) => setCreatorData(prev => ({ ...prev, creatorName: e.target.value }))}
              placeholder="Your creator name"
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 py-2.5 sm:py-3 h-auto rounded-lg text-sm sm:text-base"
            />

            <div className="relative">
              <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg">
                <span className="text-gray-400 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base">truefans.com/</span>
                <Input
                  type="text"
                  value={creatorData.pageName}
                  onChange={(e) => setCreatorData(prev => ({ ...prev, pageName: e.target.value }))}
                  placeholder="YourPageName"
                  className="flex-1 bg-transparent border-0 text-white placeholder-gray-400 py-2.5 sm:py-3 text-sm sm:text-base"
                />
              </div>
            </div>

            <Button 
              onClick={handleCompleteCreatorProfile}
              disabled={!creatorData.creatorName || !creatorData.pageName || isLoading}
              className="w-full bg-white text-black hover:bg-gray-100 py-2.5 sm:py-3 h-auto rounded-lg font-medium text-sm sm:text-base"
            >
              {isLoading ? 'Creating...' : 'Complete Creator Profile'}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowCreatorSetup(false)}
              className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 py-2.5 sm:py-3 text-sm sm:text-base"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard
  if (currentView === 'creator') {
    return <CreatorDashboard />;
  }

  return <FanDashboard />;
};

export default Dashboard;
