import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Users, FileText, BookOpen, Folder, Activity, Calendar, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupInfoTab } from "@/components/groups/GroupInfoTab";
import { GroupUsersTab } from "@/components/groups/GroupUsersTab";
import { GroupCoursesTab } from "@/components/groups/GroupCoursesTab";
import { GroupFilesTab } from "@/components/groups/GroupFilesTab";
import { useQuery } from "@tanstack/react-query";
import { groupService } from "@/services/groupService";
import { toast } from "sonner";

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

  const { 
    data: groupDetails, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['group-details', groupId],
    queryFn: () => groupService.getGroupDetails(groupId || ''),
    enabled: !!groupId,
    meta: {
      onError: (error: Error) => {
        toast.error("Failed to fetch group details", {
          description: error.message || "Unknown error occurred"
        });
      }
    }
  });

  if (!groupId) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Error */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/groups" aria-label="Back to groups">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Group Management</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Group Details
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Users className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Group ID Missing</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
              Unable to load group details without a valid group identifier.
            </p>
            <Button asChild>
              <Link to="/groups">Back to Groups</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Error */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/groups" aria-label="Back to groups">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Group Management</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Group Details
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Users className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Group</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
              {error instanceof Error ? error.message : "An unknown error occurred"}
            </p>
            <Button asChild>
              <Link to="/groups">Back to Groups</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !groupDetails) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Loading */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Group Profile Loading */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-8 w-64 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-3"></div>
                <div className="h-5 w-96 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Loading */}
        <div className="space-y-6">
          <div className="h-12 w-full bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
            <div className="h-40 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
            <div className="h-40 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Check if groupInfo is available and handle it properly whether it's an object or array
  const groupInfo = Array.isArray(groupDetails.groupInfo) 
    ? groupDetails.groupInfo[0] 
    : groupDetails.groupInfo;
  
  if (!groupInfo) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Error */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/groups" aria-label="Back to groups">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Group Management</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Group Details
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Users className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Group Not Found</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
              The group you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/groups">Back to Groups</Link>
            </Button>
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
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Link to="/groups" aria-label="Back to groups">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Group Management</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Group Profile
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">View and manage group information</p>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Group Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Group Overview
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <Users className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{groupInfo.name}</h3>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700">
                  Active
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-400">{groupInfo.description}</p>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(groupInfo.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Settings className="h-4 w-4" />
                  <span>Group ID: {groupInfo.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6">
            <TabsList className="bg-transparent h-auto p-0 w-full flex justify-start">
              <TabsTrigger 
                value="info" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
              >
                Group Information
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
              >
                Group Members
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
              >
                Assigned Courses
              </TabsTrigger>
              <TabsTrigger 
                value="files" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
              >
                Shared Files
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="p-6">
            <GroupInfoTab group={groupInfo} />
          </TabsContent>
          
          <TabsContent value="users" className="p-6">
            <GroupUsersTab groupId={groupInfo.id} users={groupDetails.groupUsers || []} />
          </TabsContent>
          
          <TabsContent value="courses" className="p-6">
            <GroupCoursesTab groupId={groupInfo.id} courses={groupDetails.groupCourses || []} />
          </TabsContent>
          
          <TabsContent value="files" className="p-6">
            <GroupFilesTab groupId={groupInfo.id} files={groupDetails.groupFiles || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GroupDetails;
