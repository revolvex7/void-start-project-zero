import React from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Users, LayoutGrid, BarChart, GraduationCap, CalendarDays, ChevronRight, TrendingUp, User, Briefcase } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { UserRoles, InstructorDashboardData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const InstructorDashboard = () => {
  const { user } = useAuth();
  
  const firstName = user?.name?.split(' ')[0] || '';

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', 'instructor'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Instructor),
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: () => {
        toast.error('Failed to load instructor dashboard data. Please try again later.');
      }
    }
  });

  const instructorData = dashboardData?.data as InstructorDashboardData | undefined;

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Loading */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Instructor Dashboard</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back, {firstName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your courses and track student progress</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center animate-pulse">
              <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Stats Cards Loading */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Content Sections Loading */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Error */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Instructor Dashboard</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back, {firstName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your courses and track student progress</p>
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
              <Briefcase className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
              We encountered an issue while fetching your instructor dashboard data. Please check your connection and try again.
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
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Instructor Dashboard</p>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back, {firstName}!
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your courses and track student progress</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">My Courses</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{instructorData?.myCourses || 0}</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Students</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{instructorData?.activeStudents || 0}</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assignments</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{instructorData?.assignments || 0}</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-lg flex items-center justify-center">
              <BarChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg. Grade</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{instructorData?.avgGrade || 0}%</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Upcoming Classes */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Upcoming Classes
              </h3>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Introduction to React</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Today, 2:00 PM - 3:30 PM</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Join
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Advanced CSS Techniques</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tomorrow, 10:00 AM - 11:30 AM</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  Join
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">JavaScript Fundamentals</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Apr 10, 1:00 PM - 2:30 PM</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  Join
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Assignments to Grade */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Assignments to Grade
              </h3>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {instructorData && instructorData.assignmentsList && instructorData.assignmentsList.length > 0 ? (
                instructorData.assignmentsList.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">{assignment.assignmentName}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{assignment.totalSubmissions} submissions pending</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      Grade
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">No assignments to grade</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">All caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Quick Actions
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link 
              to="/courses/create" 
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all duration-200"
            >
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Create Course</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Start a new course</p>
              </div>
            </Link>
            
            <Link 
              to="/assignments" 
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700 hover:shadow-md transition-all duration-200"
            >
              <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">View Assignments</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage assignments</p>
              </div>
            </Link>
            
            <Link 
              to="/reports" 
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-700 hover:shadow-md transition-all duration-200"
            >
              <BarChart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">View Reports</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Student progress</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
