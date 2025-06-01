import React, { useState } from "react";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/ThemeContext";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { getMenuItemsByRole } from "@/constants/menuItems";

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, openMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { role } = useRole();
  const { user } = useAuth();

  // Determine the correct role for menu items - handle admin role switching properly
  const menuRole = (() => {
    const userRole = user?.role?.toLowerCase();
    const selectedRole = role?.toLowerCase();
    
    // If user is admin and has selected a different role, use the selected role
    if (userRole === 'administrator' && selectedRole && selectedRole !== 'administrator') {
      return selectedRole;
    }
    
    // For non-admin users, use their actual role
    if (userRole === 'instructor') {
      return 'instructor';
    }
    if (userRole === 'learner') {
      return 'learner';
    }
    if (userRole === 'parent') {
      return 'parent';
    }
    if (userRole === 'administrator') {
      return 'administrator';
    }
    
    // Fallback to role context if user role is not available
    return selectedRole || 'administrator';
  })();

  // Get menu items based on the determined role and user's actual role
  const items = getMenuItemsByRole(menuRole, user?.role);

  const handleDropdownItemClick = (url: string) => {
    navigate(url);
  };

  return (
    <>
      {/* Mobile toggle button - premium gradient design */}
      {isMobile && (
        <Button 
          onClick={() => setOpenMobile(!openMobile)}
          className={cn(
            "fixed z-50 left-4 top-20 p-2 h-12 w-12 rounded-2xl shadow-xl md:hidden flex items-center justify-center",
            "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600",
            "text-white transition-all duration-300 hover:scale-110 active:scale-95",
            "border border-white/30 backdrop-blur-sm shadow-purple-500/25 hover:shadow-purple-500/40",
            "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          )}
          size="icon"
          aria-label={openMobile ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="h-6 w-6 relative z-10" />
        </Button>
      )}

      <Sidebar 
        collapsible="icon"
        className={cn(
          "border-r border-slate-200/60 dark:border-slate-700/60 isolate",
          "bg-gradient-to-b from-white/95 via-slate-50/90 to-white/95 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95",
          "backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-black/20"
        )}
      >
        <SidebarContent className="bg-gradient-to-b from-transparent via-slate-50/30 to-transparent dark:from-transparent dark:via-slate-800/30 dark:to-transparent backdrop-blur-sm isolate">
          <SidebarGroup style={{marginTop:'75px'}} className="isolate">
            <SidebarGroupContent className="px-2 isolate">
              <SidebarMenu className="space-y-1">
                {items.map(item => {
                  const isActive = location.pathname === item.url;
                  
                  if (item.hasDropdown && item.dropdownItems) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton 
                              tooltip={item.title}
                              className={cn(
                                "transition-all duration-300 my-1 w-full justify-between relative overflow-hidden isolate",
                                "rounded-xl p-2 h-auto min-h-[2.5rem]",
                                "hover:bg-gradient-to-r hover:from-indigo-50/80 hover:via-purple-50/60 hover:to-pink-50/80",
                                "dark:hover:bg-gradient-to-r dark:hover:from-indigo-900/20 dark:hover:via-purple-900/15 dark:hover:to-pink-900/20",
                                "hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-purple-500/20",
                                "hover:scale-[1.02] hover:-translate-y-0.5",
                                "focus:ring-2 focus:ring-indigo-300 dark:focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900",
                                "border border-transparent hover:border-indigo-200/60 dark:hover:border-purple-500/30",
                                "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-indigo-500/5 before:to-purple-500/5 before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 before:z-0"
                              )}
                            >
                              <div className="flex items-center relative z-10">
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 relative",
                                  "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40",
                                  "hover:from-indigo-200 hover:via-purple-200 hover:to-pink-200",
                                  "dark:hover:from-indigo-800/60 dark:hover:via-purple-800/60 dark:hover:to-pink-800/60",
                                  "hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/25",
                                  "border border-indigo-200/50 dark:border-purple-500/30 hover:border-indigo-300/70 dark:hover:border-purple-400/50"
                                )}>
                                  <item.icon className={cn(
                                    "h-4 w-4 transition-all duration-300",
                                    "text-indigo-600 dark:text-indigo-400",
                                    "hover:text-indigo-700 dark:hover:text-indigo-300",
                                    "hover:scale-110"
                                  )} />
                                </div>
                                <span className={cn(
                                  "font-medium transition-all duration-300", 
                                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
                                  "text-white dark:text-white",
                                  "hover:text-indigo-700 dark:hover:text-indigo-300"
                                )}>
                                  {item.title}
                                </span>
                              </div>
                              {!isCollapsed && (
                                <ChevronRight className={cn(
                                  "h-4 w-4 transition-all duration-300 relative z-10",
                                  "text-white/70 dark:text-white/70",
                                  "hover:text-indigo-500 dark:hover:text-purple-400",
                                  "data-[state=open]:rotate-90 data-[state=open]:text-purple-600 dark:data-[state=open]:text-purple-300",
                                  "hover:scale-110"
                                )} />
                              )}
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            side="right" 
                            className={cn(
                              "bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0 shadow-2xl z-50 min-w-[200px] rounded-xl",
                              "bg-gradient-to-b from-white/90 via-slate-50/80 to-white/90 dark:from-slate-800/90 dark:via-slate-700/80 dark:to-slate-800/90",
                              "ring-1 ring-slate-200/60 dark:ring-slate-600/60 shadow-slate-900/10 dark:shadow-black/40"
                            )}
                            sideOffset={8}
                          >
                            <div className="p-2">
                              <div className={cn(
                                "text-xs font-bold uppercase tracking-wider mb-2 px-2",
                                "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                              )}>
                                {item.title}
                              </div>
                              {item.dropdownItems.map((dropdownItem, index) => (
                                <DropdownMenuItem 
                                  key={dropdownItem.title}
                                  onClick={() => handleDropdownItemClick(dropdownItem.url)}
                                  className={cn(
                                    "cursor-pointer rounded-lg transition-all duration-300 px-3 py-2 relative overflow-hidden isolate",
                                    "hover:bg-gradient-to-r hover:from-indigo-50/80 hover:via-purple-50/60 hover:to-pink-50/80",
                                    "dark:hover:bg-gradient-to-r dark:hover:from-indigo-900/30 dark:hover:via-purple-900/20 dark:hover:to-pink-900/30",
                                    "hover:text-indigo-700 dark:hover:text-indigo-300",
                                    "hover:scale-[1.02] hover:shadow-md hover:shadow-indigo-500/10",
                                    "focus:bg-indigo-100 dark:focus:bg-indigo-900/40",
                                    index !== item.dropdownItems!.length - 1 && "mb-1"
                                  )}
                                >
                                  <div className="flex items-center relative z-10">
                                    <div className={cn(
                                      "w-2 h-2 rounded-full mr-3 transition-all duration-300",
                                      "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500",
                                      "hover:scale-150 hover:shadow-lg hover:shadow-indigo-500/30"
                                    )}></div>
                                    <span className="font-medium">{dropdownItem.title}</span>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title} 
                        isActive={isActive} 
                        className={cn(
                          "transition-all duration-300 my-1 relative overflow-hidden isolate",
                          "rounded-xl p-2 h-auto min-h-[2.5rem]",
                          isActive 
                            ? cn(
                                "bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/80",
                                "dark:bg-gradient-to-r dark:from-indigo-900/20 dark:via-purple-900/15 dark:to-pink-900/20",
                                "shadow-lg shadow-indigo-500/10 dark:shadow-purple-500/20",
                                "scale-[1.02] -translate-y-0.5 border border-indigo-200/60 dark:border-purple-500/30",
                                "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-indigo-500/5 before:to-purple-500/5 before:z-0"
                              )
                            : cn(
                                "hover:bg-gradient-to-r hover:from-indigo-50/80 hover:via-purple-50/60 hover:to-pink-50/80",
                                "dark:hover:bg-gradient-to-r dark:hover:from-indigo-900/20 dark:hover:via-purple-900/15 dark:hover:to-pink-900/20",
                                "hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-purple-500/20",
                                "hover:scale-[1.02] hover:-translate-y-0.5",
                                "border border-transparent hover:border-indigo-200/60 dark:hover:border-purple-500/30",
                                "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-indigo-500/5 before:to-purple-500/5 before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 before:z-0"
                              )
                        )}
                      >
                        <Link to={item.url} className="flex items-center w-full relative z-10">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 relative",
                            isActive 
                              ? cn(
                                  "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200",
                                  "dark:bg-gradient-to-br dark:from-indigo-800/60 dark:via-purple-800/60 dark:to-pink-800/60",
                                  "scale-110 shadow-lg shadow-indigo-500/25",
                                  "border border-indigo-300/70 dark:border-purple-400/50"
                                )
                              : cn(
                                  "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40",
                                  "hover:from-indigo-200 hover:via-purple-200 hover:to-pink-200",
                                  "dark:hover:from-indigo-800/60 dark:hover:via-purple-800/60 dark:hover:to-pink-800/60",
                                  "hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/25",
                                  "border border-indigo-200/50 dark:border-purple-500/30 hover:border-indigo-300/70 dark:hover:border-purple-400/50"
                                )
                          )}>
                            <item.icon className={cn(
                              "h-4 w-4 transition-all duration-300",
                              isActive 
                                ? "text-indigo-700 dark:text-indigo-300" 
                                : cn(
                                    "text-indigo-600 dark:text-indigo-400",
                                    "hover:text-indigo-700 dark:hover:text-indigo-300",
                                    "hover:scale-110"
                                  )
                            )} />
                          </div>
                          <span className={cn(
                            "font-medium transition-all duration-300", 
                            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto",
                            isActive 
                              ? "text-indigo-700 dark:text-indigo-300 font-semibold" 
                              : cn(
                                  "text-white dark:text-white",
                                  "hover:text-indigo-700 dark:hover:text-indigo-300"
                                )
                          )}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
