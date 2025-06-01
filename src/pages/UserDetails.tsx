import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Shield, Calendar, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { userService, ApiUser, UserDetailsResponse } from "@/services/userService";
import { LoadingState } from "@/components/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserInfoTab } from "@/components/users/UserInfoTab";
import { UserCoursesTab } from "@/components/users/UserCoursesTab";
import { UserGroupsTab } from "@/components/users/UserGroupsTab";
import { toast } from "sonner";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("info");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userData = await userService.getUserById(userId);
        const detailsData = await userService.getUserDetailsById(userId);
        
        setUser(userData);
        setUserDetails(detailsData);
      } catch (error) {
        toast.error("Failed to load user", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCourseEnrollment = async () => {
    const detailsData = await userService.getUserDetailsById(userId || "");
    setUserDetails(detailsData);
  };

  if (loading) {
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

        {/* User Profile Loading */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-8 w-64 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-3"></div>
                <div className="h-5 w-48 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
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

  if (!user || !userDetails) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Error */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/users" aria-label="Back to users">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">User Management</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                User Details
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <User className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">User Not Found</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/users">Back to Users</Link>
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
              <Link to="/users" aria-label="Back to users">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">User Management</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                User Profile
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">View and manage user information</p>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            User Overview
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
                <Badge 
                  variant={user.status === "Active" ? "default" : "outline"}
                  className={user.status === "Active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700" 
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                  }
                >
                  {user.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Shield className="h-4 w-4" />
                  <span>Role: {user.role || "User"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Tabs defaultValue="info" value={activeTab} onValueChange={handleTabChange}>
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6">
            <TabsList className="bg-transparent h-auto p-0 w-full flex justify-start">
              <TabsTrigger 
                value="info" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
              >
                User Information
              </TabsTrigger>
              <TabsTrigger 
                value="courses" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
              >
                Enrolled Courses
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
              >
                Group Memberships
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="p-6">
            <UserInfoTab user={user} />
          </TabsContent>
          
          <TabsContent value="courses" className="p-6">
            <UserCoursesTab 
              userId={user.id} 
              courses={userDetails?.data?.courses || []}
              onEnrollmentUpdate={handleCourseEnrollment}
            />
          </TabsContent>
          
          <TabsContent value="groups" className="p-6">
            <UserGroupsTab 
              userId={user.id}
              groups={userDetails?.data?.groups || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDetails;
