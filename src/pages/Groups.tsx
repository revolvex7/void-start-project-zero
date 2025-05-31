
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
      onError: (error: Error) => {
        toast.error("Failed to fetch groups", {
          description: error.message || "An unknown error occurred"
        });
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Group Management</h1>
              <p className="text-slate-200 dark:text-slate-300 mt-1">Organize and manage your learning groups</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <LoadingState 
            message="Loading groups" 
            variant="spinner"
            className="py-20"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Group Management</h1>
            <p className="text-slate-200 dark:text-slate-300 mt-1">Organize and manage your learning groups</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 px-6 py-4">
            <TabsList className="h-10 p-1 bg-slate-100 dark:bg-slate-600">
              <TabsTrigger 
                value="all" 
                className="px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
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
                  className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                className="border-slate-200 dark:border-slate-600"
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
