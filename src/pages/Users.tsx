import React, { useState, useEffect } from "react";
import { Plus, Search, SlidersHorizontal, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/components/users/UserTable";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { toast } from "sonner";
import { userService, ApiUser, CreateUserPayload, CreateParentPayload } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/LoadingState";
import { AddParentDialog } from "@/components/users/AddParentDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddParentOpen, setIsAddParentOpen] = useState(false);
  const [isAddingParent, setIsAddingParent] = useState(false);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
    meta: {
      onError: () => {
        toast.error('Failed to fetch users. Please try again later.');
      }
    }
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch users", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, [error]);

  const handleAddUser = async (newUser: CreateUserPayload) => {
    try {
      setIsAddingUser(true);
      await userService.createUser({
        ...newUser,
        status: newUser.status as "Active" | "Inactive"
      });
      
      toast.success("User added successfully");
      setIsAddUserOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Add user error:", error);
      console.log("🔍 Error response structure:", error.response);
      console.log("🔍 Error response data:", error.response?.data);
      
      // Extract error message from API response
      let errorMessage = "Failed to add user";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log("🔍 Extracted error message:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleAddParent = async (parentData: CreateParentPayload): Promise<void> => {
    try {
      setIsAddingParent(true);
      await userService.createParent(parentData);
      
      toast.success("Parent added successfully", {
        description: "An email has been sent to the parent with login instructions."
      });
      
      setIsAddingParent(false);
      setIsAddParentOpen(false);
      setSelectedLearnerId(undefined);
      await refetch();
      return Promise.resolve();
    } catch (error: any) {
      setIsAddingParent(false);
      
      // Extract error message from API response
      let errorMessage = "Failed to add parent";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return Promise.reject(error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      toast.success("User deleted successfully");
      refetch();
    } catch (error: any) {
      // Extract error message from API response
      let errorMessage = "Failed to delete user";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleUpdateUser = async (updatedUser: ApiUser) => {
    try {
      await userService.updateUserById(updatedUser.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status as "Active" | "Inactive",
      });
      
      toast.success("User updated successfully");
      refetch();
      
      // Navigate to the user details page after update
      navigate(`/users/${updatedUser.id}`);
    } catch (error: any) {
      // Extract error message from API response
      let errorMessage = "Failed to update user";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleAddParentName = async (userId: string, parentName: string): Promise<any> => {
    try {
      await userService.addParentName(userId, parentName);
      toast.success("Parent added successfully");
      await refetch();
      return Promise.resolve();
    } catch (error: any) {
      // Extract error message from API response
      let errorMessage = "Failed to add parent";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return Promise.reject(error);
    }
  };

  const openAddParentForm = (learnerId?: string) => {
    setSelectedLearnerId(learnerId);
    setIsAddParentOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    
    if (activeTab !== "all" && user.role.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }
    
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Consistent with loaded state */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">User Management</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Manage and organize your platform users</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-32 h-10 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg animate-pulse"></div>
              <div className="w-32 h-10 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content with Loading State */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Loading Tabs Skeleton */}
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg animate-pulse"></div>
              <div className="h-12 w-28 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div className="h-12 w-24 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div className="h-12 w-20 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div className="h-12 w-20 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
            </div>
          </div>

          <div className="p-6">
            <LoadingState 
              message="Loading users" 
              variant="spinner"
              className="py-16"
              statusMessage="Fetching user data and roles..."
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">User Management</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Manage and organize your platform users</p>
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
              <UsersIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Users</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
              We encountered an issue while fetching your users. Please check your connection and try again.
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Manage and organize your platform users</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={() => openAddParentForm()} 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add Parent
            </Button>
            <Button 
              onClick={() => setIsAddUserOpen(true)}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
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
                <UsersIcon className="mr-2 h-4 w-4" />
                All Users
              </TabsTrigger>
              <TabsTrigger 
                value="administrator"
                className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
              >
                Administrators
              </TabsTrigger>
              <TabsTrigger 
                value="instructor"
                className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
              >
                Instructors
              </TabsTrigger>
              <TabsTrigger 
                value="learner"
                className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
              >
                Learners
              </TabsTrigger>
              <TabsTrigger 
                value="parent"
                className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
              >
                Parents
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search users by name, email, or role..."
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
              {renderUserTable()}
            </TabsContent>
            <TabsContent value="administrator" className="mt-0">
              {renderUserTable()}
            </TabsContent>
            <TabsContent value="instructor" className="mt-0">
              {renderUserTable()}
            </TabsContent>
            <TabsContent value="learner" className="mt-0">
              {renderUserTable()}
            </TabsContent>
            <TabsContent value="parent" className="mt-0">
              {renderUserTable()}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <AddUserDialog 
        isOpen={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)} 
        onSubmit={handleAddUser}
        isLoading={isAddingUser}
      />

      <AddParentDialog
        isOpen={isAddParentOpen}
        onClose={() => {
          setIsAddParentOpen(false);
          setSelectedLearnerId(undefined);
        }}
        onSubmit={handleAddParent}
        isLoading={isAddingParent}
        learners={users}
        currentLearnerId={selectedLearnerId}
      />
    </div>
  );

  function renderUserTable() {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <UserTable 
          users={filteredUsers} 
          onDelete={handleDeleteUser} 
          onUpdate={handleUpdateUser}
          onAddParent={handleAddParentName}
          onCreateParent={openAddParentForm}
        />
      </div>
    );
  }
};

export default Users;
