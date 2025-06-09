import React from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Calendar, ArrowRight, User, GraduationCap, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { UserRoles, ParentDashboardData } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ParentDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || '';

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', 'parent'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Parent),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Format last login date
  const formatLastLogin = (lastLogin: string) => {
    try {
      const date = new Date(lastLogin);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
      } else if (diffInHours < 48) {
        return "Yesterday";
      } else {
        const days = Math.floor(diffInHours / 24);
        return `${days} day${days === 1 ? '' : 's'} ago`;
      }
    } catch (error) {
      return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
          </div>
          <Separator className="bg-purple-100 dark:bg-purple-800" />
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Unable to load dashboard data. Please try again later.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Properly type the dashboard data as ParentDashboardData (array of children)
  const childrenData = (dashboardData?.data as ParentDashboardData) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">
              Welcome, {firstName}!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Monitor your children's academic progress
            </p>
          </div>
          <Link to="/parent/profile">
            <Button variant="outline" className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50">
              Parent Profile
            </Button>
          </Link>
        </div>
        <Separator className="bg-purple-100 dark:bg-purple-800" />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Your Children ({childrenData.length})
            </h3>
          </div>
          
          {childrenData.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Children Found
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                You don't have any children assigned to your account yet.
              </p>
            </Card>
          ) : (
            <div className="grid gap-5">
              {childrenData.map((child) => (
                <Link key={child.id} to={`/parent/child/${child.id}`}>
                  <Card className={cn(
                    "p-5 hover:shadow-md transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/80",
                    "border-l-4 border-purple-400 hover:border-purple-500",
                    "flex items-center justify-between"
                  )}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-purple-100 dark:border-purple-800">
                        <AvatarImage src={child.profileImage || ""} alt={child.name} />
                        <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                          {child.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{child.name}</h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{child.enrolledCourses} Course{child.enrolledCourses === '1' ? '' : 's'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-green-600 dark:text-green-400">
                              {formatLastLogin(child.lastLogin)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {child.overAllProgress}% Overall Progress
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
