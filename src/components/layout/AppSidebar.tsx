import React from "react";
import { Home, Search, Users, Bell, Settings, User } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Explore", url: "/dashboard/explore", icon: Search },
  { title: "Community", url: "/dashboard/community", icon: Users },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || (path === "/dashboard" && currentPath === "/dashboard");

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar className="border-r border-gray-800 bg-gray-900 w-64 lg:w-64">
      <SidebarContent className="bg-gray-900">
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
                      to={item.url} 
                      className={({ isActive: linkActive }) => 
                        `flex items-center px-3 py-2 rounded-lg transition-colors ${
                          linkActive || isActive(item.url)
                            ? "bg-gray-800 text-white" 
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile Section */}
        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="space-y-4">
            {/* User Profile */}
            <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">SHAZ</div>
                <div className="text-gray-400 text-xs">Creator</div>
              </div>
              <div className="w-4 h-4 text-blue-500">✓</div>
            </div>
            
            {/* Secondary Profile */}
            <div className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">Shazil</div>
                <div className="text-gray-400 text-xs">Member</div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="space-y-1">
              <div className="text-gray-400 text-xs px-2 py-1">Appearance</div>
              
              <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-600 rounded"></div>
                  <span className="text-white text-sm">Light</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white rounded"></div>
                  <span className="text-white text-sm">Dark</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-gray-600 to-white rounded"></div>
                  <span className="text-white text-sm">System</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <div className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <span className="text-white text-sm">News</span>
              </div>
              <div className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <span className="text-white text-sm">Patreon for Creators</span>
              </div>
              <div className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <span className="text-white text-sm">Help Centre & FAQ</span>
              </div>
              <div className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <span className="text-white text-sm">Feature Requests</span>
              </div>
              <div className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <span className="text-white text-sm">Terms of Use</span>
              </div>
              <div className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <span className="text-white text-sm">Privacy Policy</span>
              </div>
              <div className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <span className="text-white text-sm">Community Policies</span>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-400">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
              </div>
              <span className="text-white text-sm">Log out</span>
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}