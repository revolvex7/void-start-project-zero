import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { ExplorePage } from '@/components/dashboard/ExplorePage';
import Feed from '@/components/dashboard/Feed';

interface FanDashboardProps {
  currentPage?: string;
}

export default function FanDashboard({ currentPage = 'home' }: FanDashboardProps) {
  const { user } = useAuth();
  const { currentRole } = useUserRole();
  const navigate = useNavigate();

  const handleCreatorClick = (creatorName: string) => {
    const creatorUrl = creatorName.toLowerCase().replace(/\s+/g, '');
    sessionStorage.setItem('previousContext', 'fan-dashboard');
    navigate(`/${creatorUrl}`);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'explore':
        return <ExplorePage onCreatorClick={handleCreatorClick} />;
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
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-gray-400">Manage your account settings.</p>
          </div>
        );
      default:
        return <Feed />;
    }
  };

  return renderContent();
}
