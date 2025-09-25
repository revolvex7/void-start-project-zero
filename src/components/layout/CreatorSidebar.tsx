import React from "react";
import { BarChart3, Users, Bell, Settings, DollarSign, BookOpen, Megaphone, MessageSquare, Home } from "lucide-react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "", icon: Home },
  { title: "Library", url: "/library", icon: BookOpen, badge: "NEW" },
  { title: "Audience", url: "/audience", icon: Users },
  { title: "Insights", url: "/insights", icon: BarChart3 },
  { title: "Payouts", url: "/payouts", icon: DollarSign },
  { title: "Promotions", url: "/promotions", icon: Megaphone, badge: "NEW" },
  { title: "Community", url: "/community", icon: MessageSquare },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function CreatorSidebar() {
  const location = useLocation();
  const { creatorUrl } = useParams();
  const currentPath = location.pathname;
  const basePath = `/c/${creatorUrl}`;

  const isActive = (path: string) => {
    const fullPath = path === "" ? basePath : basePath + path;
    return currentPath === fullPath;
  };

  return (
    <Sidebar className="border-r border-gray-800 bg-gray-900" collapsible="offcanvas">
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-black rounded-full relative">
                <div className="absolute inset-0 bg-white rounded-full" style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%)'
                }}></div>
              </div>
            </div>
            <span className="font-bold text-white">Patreon</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url === "" ? basePath : basePath + item.url}
                      className={({ isActive: linkActive }) => 
                        `flex items-center px-3 py-2 rounded-lg transition-colors ${
                          linkActive || isActive(item.url)
                            ? "bg-gray-800 text-white" 
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom section with role switcher */}
        <div className="mt-auto p-4 border-t border-gray-800">
          {/* Active Account */}
          <div className="flex items-center space-x-3 mb-3 p-2 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Sloane Mcconnell</div>
              <div className="text-gray-400 text-xs">Creator</div>
            </div>
            <div className="w-4 h-4 text-green-500">✓</div>
          </div>
          
          {/* Switch Account */}
          <NavLink 
            to="/dashboard" 
            className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Emi Burris</div>
              <div className="text-gray-400 text-xs">Member</div>
            </div>
          </NavLink>
          
          {/* More Account - Creator Profile */}
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer mt-1">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Sloane Mccon...</div>
              <div className="text-gray-400 text-xs">Creator</div>
            </div>
            <div className="text-gray-400">⚙</div>
          </div>

          {/* Logout Button */}
          <button className="w-full flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors text-left mt-3">
            <div className="w-5 h-5">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-400">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </div>
            <span className="text-white text-sm">Log out</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}