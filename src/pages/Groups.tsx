import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Search, SlidersHorizontal, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GroupTable } from "@/components/groups/GroupTable";
import { AddGroupDialog } from "@/components/groups/AddGroupDialog";
import { Group } from "@/types/group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { groupService } from "@/services/groupService";
import { LoadingState } from "@/components/LoadingState";

const Groups = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch groups data with proper error handling
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['groups'],
    queryFn: groupService.getAllGroups,
    meta: {
      onError: () => {
        toast.error('Failed to fetch groups. Please try again later.');
      }
    }
  });
  
  // Ensure groups is always an array, even if data is undefined or null
  const groups = Array.isArray(data) ? data : [];

  const handleCreateGroup = (newGroup: Group) => {
    refetch();
  };

  const handleUpdateGroup = async (updatedGroup: Group) => {
    try {
      // The actual update happens in EditGroupDialog now
      refetch();
    } catch (error) {
      console.error("Error in parent component after update:", error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      // The actual deletion happens in the GroupTable component
      refetch();
    } catch (error) {
      console.error("Error in parent component after delete:", error);
    }
  };

  // Filter groups based on search term
  const filteredGroups = groups.filter(group => {
    const searchLower = searchTerm.toLowerCase();
    
    return (
      group.name.toLowerCase().includes(searchLower) ||
      group.description.toLowerCase().includes(searchLower) ||
      (group.creatorName && group.creatorName.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Consistent with loaded state */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Group Management</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Organize and manage your learning groups</p>
            </div>
            <div className="w-32 h-10 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Main Content with Loading State */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Loading Tabs Skeleton */}
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg animate-pulse"></div>
            </div>
          </div>

          <div className="p-6">
            <LoadingState 
              message="Loading groups" 
              variant="spinner"
              className="py-16"
              statusMessage="Fetching group data and memberships..."
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Consistent */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Group Management</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Organize and manage your learning groups</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try Again
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Users className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Groups</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
              We encountered an issue while fetching your groups. Please check your connection and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Group Management</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Organize and manage your learning groups</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-5">
            <TabsList className="h-12 p-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-600 shadow-sm rounded-xl">
              <TabsTrigger 
                value="all" 
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
              >
                <Users className="mr-2 h-4 w-4" />
                All Groups
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search groups by name, description, or creator..."
                  className="pl-10 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-blue-900/20 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <GroupTable 
                  groups={filteredGroups}
                  isLoading={isLoading}
                  onUpdateGroup={handleUpdateGroup}
                  onDeleteGroup={handleDeleteGroup}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <AddGroupDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
};

export default Groups;
