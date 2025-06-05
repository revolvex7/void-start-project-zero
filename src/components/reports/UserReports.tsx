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
import { reportsService, ViewAs, UserReportsDataAdmin, UserReportsDataInstructor } from "@/services/reportsService";
import { useRole } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type UserReportsData = UserReportsDataAdmin | UserReportsDataInstructor;

const UserReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { role } = useRole();
  const { user } = useAuth();
  
  // Determine viewAs based on current role - use actual user role first, then role context for admins
  const getUserRole = () => {
    const userRole = user?.role?.toLowerCase();
    const selectedRole = role?.toLowerCase();
    
    // If user is actually an instructor, always use instructor
    if (userRole === 'instructor') {
      return 'instructor';
    }
    
    // If user is admin, use their selected role from role context
    if (userRole === 'administrator') {
      return selectedRole === 'instructor' ? 'instructor' : 'admin';
    }
    
    // Default fallback
    return 'instructor';
  };
  
  const viewAs: ViewAs = getUserRole() as ViewAs;

  const { data: reportData, isLoading: reportLoading, error: reportError } = useQuery({
    queryKey: ['userReports', viewAs],
    queryFn: (): Promise<UserReportsData> => {
      return viewAs === 'admin' 
        ? reportsService.getUserReportsAdmin() 
        : reportsService.getUserReportsInstructor();
    },
    meta: {
      onError: () => {
        toast.error('Failed to fetch user reports. Please try again later.');
      }
    }
  });

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAllUsers,
    meta: {
      onError: () => {
        toast.error('Failed to fetch users data. Please try again later.');
      }
    }
  });

  const isLoading = reportLoading || usersLoading;
  const error = reportError || usersError;

  // Calculate stats from API data
  const stats = React.useMemo(() => {
    if (!reportData) return {
      completionRate: "0.0%",
      completedCourses: 0,
      coursesInProgress: 1,
      coursesNotPassed: 0,
      coursesNotStarted: 0,
      trainingTime: "1m"
    };

    if (viewAs === 'admin') {
      const adminData = reportData as UserReportsDataAdmin;
      const totalUsers = adminData.totalUsers;
      const activeUsers = adminData.totalActiveUsers;
      const completionRate = totalUsers > 0 ? `${((activeUsers / totalUsers) * 100).toFixed(1)}%` : "0.0%";
      
      return {
        completionRate,
        completedCourses: activeUsers,
        coursesInProgress: Math.max(1, totalUsers - activeUsers),
        coursesNotPassed: adminData.totalInstructorUsers,
        coursesNotStarted: adminData.totalLearnerUsers,
        trainingTime: `${totalUsers}m`
      };
    } else {
      const instructorData = reportData as UserReportsDataInstructor;
      const totalStudents = instructorData.totalStudents;
      const activeStudents = instructorData.totalActiveStudents;
      const completionRate = instructorData.averageCompletionRate || "0.0%";
      
      return {
        completionRate: typeof completionRate === 'string' ? completionRate : `${completionRate}%`,
        completedCourses: activeStudents,
        coursesInProgress: Math.max(0, totalStudents - activeStudents),
        coursesNotPassed: 0,
        coursesNotStarted: instructorData.totalAssignments,
        trainingTime: `${instructorData.totalCourses || 0}`
      };
    }
  }, [reportData, viewAs]);

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
          {viewAs === 'admin' ? (
            // Admin view stats
            <>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200 dark:border-slate-600">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {(reportData as UserReportsDataAdmin)?.totalUsers || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total users
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {(reportData as UserReportsDataAdmin)?.totalActiveUsers || 0}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Active users
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {(reportData as UserReportsDataAdmin)?.totalInstructorUsers || 0}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  Instructors
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {(reportData as UserReportsDataAdmin)?.totalLearnerUsers || 0}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Learners
                </div>
              </div>
            </>
          ) : (
            // Instructor view stats
            <>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200 dark:border-slate-600">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {(reportData as UserReportsDataInstructor)?.totalStudents || 0}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total students
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {(reportData as UserReportsDataInstructor)?.totalActiveStudents || 0}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Active students
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                  {(reportData as UserReportsDataInstructor)?.totalCourses || 0}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  Total courses
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {(reportData as UserReportsDataInstructor)?.totalAssignments || 0}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Total assignments
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {(reportData as UserReportsDataInstructor)?.totalEnrolled || 0}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  Total enrolled
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border border-indigo-200 dark:border-indigo-700">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {(reportData as UserReportsDataInstructor)?.averageCompletionRate || '0.00'}%
                </div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400">
                  Completion rate
                </div>
              </div>
            </>
          )}
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
