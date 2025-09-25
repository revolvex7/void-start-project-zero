import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { CreatorSidebar } from "@/components/layout/CreatorSidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { CreatorDashboardContent } from "@/components/dashboard/CreatorDashboardContent";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { creatorUrl } = useParams();
  const isCreatorDashboard = !!creatorUrl;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col lg:flex-row w-full bg-black text-white">
        {isCreatorDashboard ? <CreatorSidebar /> : <AppSidebar />}
        <main className="flex-1 lg:ml-0">
          {isCreatorDashboard ? (
            <CreatorDashboardContent creatorName={creatorUrl?.replace(/([A-Z])/g, ' $1').trim() || 'Creator'} />
          ) : (
            <DashboardContent />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;