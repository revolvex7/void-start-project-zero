
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Group Management
              </h1>
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
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-700/80 px-6 py-4">
              <TabsList className="h-12 p-1 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl shadow-md border border-slate-200/50 dark:border-slate-600/50">
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Users className="mr-2 h-4 w-4" />
                  All Groups
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    placeholder="Search groups by name, description, or creator..."
                    className="pl-10 h-12 border-slate-200 dark:border-slate-600 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-slate-50/50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-700 backdrop-blur-sm transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <LoadingState 
                      message="Loading groups" 
                      variant="spinner"
                      className="py-16"
                    />
                  </div>
                ) : (
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-lg">
                    <GroupTable 
                      groups={filteredGroups}
                      isLoading={isLoading}
                      onUpdateGroup={handleUpdateGroup}
                      onDeleteGroup={handleDeleteGroup}
                    />
                  </div>
                )}
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
    </div>
  );
};

export default Groups;
