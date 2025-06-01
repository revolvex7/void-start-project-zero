import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { LearnerSidebar } from "@/components/dashboard/LearnerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const MainLayout = () => {
  const { role } = useRole();
  const { user } = useAuth();
  const location = useLocation();
  
  // Determine the effective role based on user's actual role and selected role context
  const isActualLearner = user?.role === 'Learner' || user?.role === 'learner';
  const isActualInstructor = user?.role === 'Instructor' || user?.role === 'instructor';
  const isActualAdmin = user?.role === 'Administrator' || user?.role === 'administrator';
  
  // Check role context for admins who can switch roles
  const isAdminAsLearner = isActualAdmin && role === 'learner';
  const isAdminAsInstructor = isActualAdmin && role === 'instructor';
  
  // Determine which view/layout to show
  const isLearnerView = isActualLearner || isAdminAsLearner || location.pathname.includes('learner-dashboard');
  const isInstructorView = isActualInstructor || isAdminAsInstructor || location.pathname.includes('instructor-dashboard');
  const isParentDashboard = location.pathname.includes('parent-dashboard');
  const isCoursePreview = location.pathname.includes('/preview');
  
  // For course preview, return just the outlet without any navigation
  if (isCoursePreview) {
    return (
      <div className="min-h-screen w-full">
        <Outlet />
      </div>
    );
  }
  
  if (isParentDashboard) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col w-full transition-colors duration-200",
        "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950"
      )}>
        <Navbar hideDropdown={true} />
        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    );
  }

  // Determine background styling based on view
  const getBackgroundStyle = () => {
    if (isLearnerView) {
      return "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950";
    }
    if (isInstructorView) {
      return "bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950";
    }
    return "bg-gradient-to-br from-background to-muted/50 dark:from-gray-900 dark:to-gray-950";
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn(
        "min-h-screen flex flex-col w-full transition-colors duration-200",
        getBackgroundStyle()
      )}>
        <Navbar />
        <div className="flex flex-1">
          {isLearnerView ? (
            <LearnerSidebar key={`learner-${role}`} />
          ) : (
            <DashboardSidebar key={`dashboard-${role}-${user?.role}`} />
          )}
          <main className={cn(
            "flex-1 overflow-auto",
            isLearnerView ? "p-5 md:p-8" : "p-4 md:p-6"
          )}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
