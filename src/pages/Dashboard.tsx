import React from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Users, LayoutGrid, BookText, ChevronRight, TrendingUp, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip as RechartsTooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";
import { UserRoles, AdminDashboardData } from "@/types/dashboard";
import { useRole } from "@/context/RoleContext";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();
  
  const firstName = user?.name?.split(' ')[0] || '';

  // Redirect Parent users to parent dashboard
  React.useEffect(() => {
    if (user?.role === 'Parent' || user?.role === 'parent') {
      navigate('/parent-dashboard');
    }
  }, [user?.role, navigate]);

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', 'administrator'],
    queryFn: () => dashboardService.getDashboardData(UserRoles.Administrator),
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: () => {
        toast.error('Failed to load dashboard data. Please try again later.');
      }
    }
  });

  const adminData = dashboardData?.data as AdminDashboardData | undefined;

  // User data for pie chart
  const userData = adminData ? [
    { name: "Admins", value: adminData.adminUsers, color: "#1B68B3" },
    { name: "Instructors", value: adminData.instructorUsers, color: "#4DA1FF" },
    { name: "Learners", value: adminData.learners, color: "#0A2D50" },
  ] : [
    { name: "Admins", value: 0, color: "#1B68B3" },
    { name: "Instructors", value: 0, color: "#4DA1FF" },
    { name: "Learners", value: 0, color: "#0A2D50" },
  ];

  const COLORS = ["#1B68B3", "#4DA1FF", "#0A2D50"];
  
  // Calculate the total number of users
  const totalUsers = adminData?.totalUsers || 0;

  const chartConfig = {
    admin: { color: "#1B68B3", label: "Admins" },
    instructor: { color: "#4DA1FF", label: "Instructors" },
    learner: { color: "#0A2D50", label: "Learners" },
  };

  // Fixed CustomTooltip component with proper TypeScript interface
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: {
        name: string;
        value: number;
        color: string;
      };
    }>;
  }

  // Custom tooltip component with proper type annotations
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-slate-900 dark:text-white">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Loading */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Admin Dashboard</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back, {firstName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Monitor your platform's performance and analytics</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center animate-pulse">
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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

        {/* Charts Loading */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-600 rounded mb-4 animate-pulse"></div>
              <div className="h-[200px] bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse"></div>
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
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Admin Dashboard</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back, {firstName}!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Monitor your platform's performance and analytics</p>
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
              <Activity className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
              We encountered an issue while fetching dashboard data. Please check your connection and try again.
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
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Admin Dashboard</p>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back, {firstName}!
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Monitor your platform's performance and analytics</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Courses</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{adminData?.totalCourses || 0}</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Users</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{adminData?.activeUsers || 0}</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center">
              <BookText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Course Completions</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{adminData?.courseCompletion || 0}%</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-lg flex items-center justify-center">
              <BarChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Activity Rate</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{adminData?.activityRate || 0}%</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Users Donut Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Users Distribution
              </h3>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative h-[200px] w-full">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={4}
                      >
                        {userData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalUsers}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {userData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Quick Actions
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid gap-4">
              <Link 
                to="/users" 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Manage Users</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Add, edit, and manage user accounts</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </Link>
              
              <Link 
                to="/courses" 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Manage Courses</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Create and organize learning content</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </Link>
              
              <Link 
                to="/reports" 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <BarChart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">View Reports</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Analytics and performance metrics</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
