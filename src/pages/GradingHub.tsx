import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Calendar, 
  GraduationCap, 
  Users,
  Search,
  Filter,
  Activity,
  CheckSquare,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/LoadingState";
import { assignmentService } from "@/services/assignmentService";
import { Assignment } from "@/types/assignment";

const GradingHub: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: assignmentsResponse, isLoading, error } = useQuery({
    queryKey: ["instructor-assignments"],
    queryFn: assignmentService.getInstructorAssignments,
  });

  const assignments = assignmentsResponse?.data || [];

  const filteredAssignments = assignments.filter((assignment: Assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === "ongoing") {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700">Ongoing</Badge>;
    } else if (statusLower === "overdue") {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700">Overdue</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">{status}</Badge>;
    }
  };

  const handleAssignmentClick = (assignmentId: string) => {
    navigate(`/grading-hub/assignment/${assignmentId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Loading */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse"></div>
              <div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-64 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 h-12 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              <div className="w-24 h-12 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Loading */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <div className="h-12 w-full bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse mb-6"></div>
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse mb-4"></div>
            <div className="space-y-4">
              <div className="h-16 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div className="h-16 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div className="h-16 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
            </div>
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Instructor Tools</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Grading Hub
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Assignments</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
              We encountered an issue while fetching assignment data. Please check your connection and try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalAssignments = assignments.length;
  const ongoingAssignments = assignments.filter((a: Assignment) => a.status.toLowerCase() === "ongoing").length;
  const overdueAssignments = assignments.filter((a: Assignment) => a.status.toLowerCase() === "overdue").length;
  const totalSubmissions = assignments.reduce((sum: number, a: Assignment) => sum + (Number(a.totalSubmissions) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Instructor Tools</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Grading Hub
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Review and grade student assignments across all your courses
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalAssignments}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{ongoingAssignments}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Ongoing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Assignments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalAssignments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ongoing</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{ongoingAssignments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overdue</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{overdueAssignments}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Submissions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSubmissions}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Assignment Management
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Click on any assignment to view student submissions and grade them
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search assignments or courses..." 
                className="pl-10 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-700/50">
                  <TableHead className="font-semibold">Assignment Title</TableHead>
                  <TableHead className="font-semibold">Course</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Total Marks</TableHead>
                  <TableHead className="font-semibold">Submissions</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment: Assignment) => (
                    <TableRow 
                      key={assignment.id}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      onClick={() => handleAssignmentClick(assignment.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-slate-900 dark:text-white">{assignment.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600 dark:text-slate-400">{assignment.courseName}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-slate-900 dark:text-white">{assignment.totalMarks}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">{assignment.totalSubmissions}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32">
                      <div className="flex flex-col items-center justify-center text-center">
                        <FileText className="h-8 w-8 text-slate-400 mb-3" />
                        <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">No assignments found</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {searchTerm ? "Try adjusting your search terms" : "No assignments available for grading"}
                        </p>
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

export default GradingHub;
