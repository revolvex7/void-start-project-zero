import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { CreatorDashboardContent } from "@/components/dashboard/CreatorDashboardContent";
import { useParams } from "react-router-dom";
import { Menu } from "lucide-react";

const Dashboard = () => {
  const { creatorUrl } = useParams();
  const isCreatorDashboard = !!creatorUrl;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black text-white">
        {isCreatorDashboard ? <CreatorSidebar /> : <AppSidebar />}
        
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between p-4 bg-black border-b border-gray-800">
            <SidebarTrigger className="text-white hover:bg-gray-800 p-2 rounded-lg">
              <Menu className="w-6 h-6" />
            </SidebarTrigger>
            <h1 className="text-xl font-semibold text-white">
              {isCreatorDashboard ? 'Creator Dashboard' : 'Explore'}
            </h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </header>

          <main className="flex-1 overflow-hidden">
            {isCreatorDashboard ? (
              <CreatorDashboardContent creatorName={creatorUrl?.replace(/([A-Z])/g, ' $1').trim() || 'Creator'} />
            ) : (
              <DashboardContent />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;