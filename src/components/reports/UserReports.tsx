import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Eye, Users, Clock, BookOpen, Award, SlidersHorizontal, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userService } from "@/services/userService";
import { LoadingState } from "@/components/LoadingState";
import { toast } from "sonner";

const UserReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAllUsers,
    meta: {
      onError: () => {
        toast.error('Failed to fetch user reports. Please try again later.');
      }
    }
  });

  // Calculate stats from users data
  const stats = React.useMemo(() => {
    if (!users) return {
      completionRate: "0.0%",
      completedCourses: 0,
      coursesInProgress: 1,
      coursesNotPassed: 0,
      coursesNotStarted: 0,
      trainingTime: "1m"
    };

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    
    return {
      completionRate: totalUsers > 0 ? `${((activeUsers / totalUsers) * 100).toFixed(1)}%` : "0.0%",
      completedCourses: activeUsers,
      coursesInProgress: Math.max(1, totalUsers - activeUsers),
      coursesNotPassed: 0,
      coursesNotStarted: 0,
      trainingTime: `${totalUsers}m`
    };
  }, [users]);

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Consistent with loaded state */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Reports</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">User Reports</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Analyze user activity and engagement metrics</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center animate-pulse">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Stats Cards Loading */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-center p-4 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 animate-pulse">
                <div className="h-8 w-16 bg-slate-300 dark:bg-slate-500 rounded mx-auto mb-2"></div>
                <div className="h-4 w-20 bg-slate-300 dark:bg-slate-500 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content with Loading State */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <LoadingState 
              message="Loading user reports" 
              variant="spinner"
              className="py-16"
              statusMessage="Analyzing user activity and performance data..."
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
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Reports</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">User Reports</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Analyze user activity and engagement metrics</p>
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
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading User Reports</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
              We encountered an issue while fetching user report data. Please check your connection and try again.
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
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Reports</p>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">User Reports</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Analyze user activity and engagement metrics</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200 dark:border-slate-600">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.completionRate}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Active rate
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {stats.completedCourses}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Active users
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
              {stats.coursesInProgress}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              Inactive users
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
              {stats.coursesNotPassed}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              Courses not passed
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200 dark:border-slate-600">
            <div className="text-3xl font-bold text-slate-600 dark:text-slate-400 mb-1">
              {stats.coursesNotStarted}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Courses not started
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {stats.trainingTime}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Training time
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            User Analytics
          </h2>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search users..." 
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

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-700/50">
                  <TableHead>User</TableHead>
                  <TableHead>User type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Assigned courses</TableHead>
                  <TableHead>Completed courses</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'Active' ? 'default' : 'secondary'}
                          className={user.status === 'Active' 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                            : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-900 dark:text-white">
                          {new Date().toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600 dark:text-slate-400">-</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600 dark:text-slate-400">-</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600 dark:text-slate-400">-</span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <User className="h-8 w-8 text-slate-400" />
                        <p className="text-slate-600 dark:text-slate-400">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReports;
