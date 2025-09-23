import React from "react";
import { Home, Search, Users, Bell, Settings, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || (path === "/dashboard" && currentPath === "/dashboard");

  return (
    <Sidebar className="border-r border-gray-800 bg-gray-900">
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

        {/* Bottom section with role switcher */}
        <div className="mt-auto p-4 border-t border-gray-800">
          {/* Active Member Account */}
          <div className="flex items-center space-x-3 mb-3 p-2 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Nissim Booth</div>
              <div className="text-gray-400 text-xs">Member</div>
            </div>
            <div className="w-4 h-4 text-green-500">✓</div>
          </div>
          
          {/* Switch to Creator */}
          <NavLink 
            to="/c/NissimBooth" 
            className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors mb-3"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Nissim Booth</div>
              <div className="text-gray-400 text-xs">Creator</div>
            </div>
          </NavLink>
          
          {/* Become Creator CTA */}
          <div className="p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm font-medium">Become a creator</div>
                <div className="text-gray-400 text-xs">You're almost there! Complete your page and take it live.</div>
              </div>
              <button className="text-gray-400 hover:text-white">×</button>
            </div>
            <NavLink to="/signup">
              <button className="w-full mt-2 bg-white text-black py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100">
                Finish my page
              </button>
            </NavLink>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}