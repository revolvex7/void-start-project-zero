import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import FanDashboard from '@/pages/FanDashboard';
import CreatorDashboardPage from '@/pages/CreatorDashboardPage';
import { Menu, X } from 'lucide-react';

const Dashboard = () => {
  const { user, completeCreatorProfile, updateUser, isCreator, fetchUserProfile } = useAuth();
  const { currentRole, switchRole } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [showCreatorSetup, setShowCreatorSetup] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [creatorData, setCreatorData] = useState({
    creatorName: '',
    pageName: '',
    is18Plus: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Ensure new users without creator profile start in member view
  useEffect(() => {
    if (user && currentRole === 'creator' && !user.creatorName && !user.pageName) {
      // User doesn't have creator profile, force member role
      switchRole('member');
      navigate('/dashboard?view=fan', { replace: true });
    }
  }, [user, currentRole, switchRole, navigate]);

  // Handle creator setup from URL params
  useEffect(() => {
    const setupParam = searchParams.get('setup');
    if (setupParam === 'creator') {
      setShowCreatorSetup(true);
    }
  }, [searchParams]);

  // Fetch user profile on component mount only if user data is incomplete
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
  }, []); // Remove dependencies to prevent infinite loops

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
        is18Plus: creatorData.is18Plus
      });
      
      setShowCreatorSetup(false);
      
      toast({
        title: "Creator profile completed!",
        description: "Welcome to your creator dashboard.",
      });
      
      navigate('/dashboard?view=creator');
    } catch (error: any) {
      console.error('Error completing creator profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete creator profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show creator setup modal if needed
  if (showCreatorSetup) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Creator Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Creator Name</label>
              <Input
                type="text"
                placeholder="Enter your creator name"
                value={creatorData.creatorName}
                onChange={(e) => setCreatorData(prev => ({ ...prev, creatorName: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Page Name</label>
              <Input
                type="text"
                placeholder="Enter your page name"
                value={creatorData.pageName}
                onChange={(e) => setCreatorData(prev => ({ ...prev, pageName: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="age-confirmation"
                checked={creatorData.is18Plus}
                onCheckedChange={(checked) => setCreatorData(prev => ({ ...prev, is18Plus: !!checked }))}
              />
              <label htmlFor="age-confirmation" className="text-sm">
                I confirm that I am 18 years or older
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreatorSetup(false);
                navigate('/dashboard');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteCreatorProfile}
              disabled={!creatorData.creatorName || !creatorData.pageName || !creatorData.is18Plus || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Complete Profile'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <span className="text-white font-bold text-sm">
            {currentRole === 'creator' 
              ? (user?.creatorName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'C')
              : (user?.name?.charAt(0)?.toUpperCase() || 'U')
            }
          </span>
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
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0 overflow-y-auto">
        {currentRole === 'member' ? (
          <FanDashboard currentPage={currentPage} />
        ) : (
          <CreatorDashboardPage currentPage={currentPage} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
