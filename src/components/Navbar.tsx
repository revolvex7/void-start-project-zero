import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookText, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserNav } from "@/components/user/UserNav";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface NavbarProps {
  hideDropdown?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ hideDropdown = false }) => {
  // Wrap the useSidebar hook in a try/catch to handle cases where it's used outside a provider
  const sidebarContext = { state: "expanded", toggleSidebar: () => {} };
  try {
    Object.assign(sidebarContext, useSidebar());
  } catch (error) {
    // If there's an error, we'll use the default values defined above
    console.log("Sidebar context not available, using default values");
  }

  const { toggleSidebar, state } = sidebarContext;
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const { role } = useRole();
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if this is a learner route based on actual user role
  const isActualLearner = user?.role === 'Learner';
  const isLearnerRoute = isActualLearner || role === 'learner' || location.pathname.includes('learner-dashboard');

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isLearnerRoute 
        ? "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50 shadow-lg" 
        : "bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm"
    )}>
      <div className="mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {!isMobile && !isLearnerRoute && !hideDropdown && (
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-xl transition-all duration-200",
                  "hover:bg-blue-50 dark:hover:bg-blue-900/30",
                  "hover:scale-105 active:scale-95",
                  "border border-transparent hover:border-blue-200 dark:hover:border-blue-700/50"
                )}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </Button>
            )}
            <Link
              to="/"
              className={cn(
                "flex items-center gap-3 transition-all duration-200 hover:scale-105 active:scale-95",
                "group"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                isLearnerRoute
                  ? "bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 group-hover:from-purple-200 group-hover:to-indigo-200 dark:group-hover:from-purple-800/40 dark:group-hover:to-indigo-800/40"
                  : "bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800/40 dark:group-hover:to-purple-800/40"
              )}>
                <BookText className={cn(
                  "h-6 w-6 transition-colors",
                  isLearnerRoute
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-blue-600 dark:text-blue-400"
                )} />
              </div>
              <span className={cn(
                "text-lg font-bold tracking-tight transition-all duration-200",
                isLearnerRoute
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 dark:from-purple-400 dark:via-indigo-400 dark:to-purple-500 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent"
              )}>
                {isLearnerRoute ? "Learning Portal" : "Ilmee"}
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {!isLearnerRoute && (
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            )}
            <UserNav />
          </div>
        </div>
      </div>
      
      {/* Subtle gradient line at the bottom */}
      <div className={cn(
        "h-px w-full",
        isLearnerRoute
          ? "bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-700/50 to-transparent"
          : "bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-700/50 to-transparent"
      )} />
    </header>
  );
};
