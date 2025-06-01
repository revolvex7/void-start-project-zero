import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Users, 
  Eye,
  Edit,
  Search,
  Filter,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Target
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { GradingDialog } from "@/components/grading/GradingDialog";
import { assignmentService, AssignmentSubmissionResponse } from "@/services/assignmentService";

const AssignmentGrading: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmissionResponse | null>(null);

  const { data: assignmentData, isLoading, error } = useQuery({
    queryKey: ["assignment-details", assignmentId],
    queryFn: () => assignmentService.getAssignmentSubmissions(assignmentId!),
    enabled: !!assignmentId,
  });

  const assignmentDetails = assignmentData?.data;
  const submissions = assignmentDetails?.submissions || [];

  const filteredSubmissions = submissions.filter((submission: AssignmentSubmissionResponse) =>
    submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: AssignmentSubmissionResponse["status"]) => {
    const statusConfig = {
      submitted: { 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700",
        label: "Submitted"
      },
      graded: { 
        className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-700",
        label: "Graded"
      },
      late: { 
        className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700",
        label: "Late"
      },
      "not submitted": { 
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-700",
        label: "Not Submitted"
      }
    };

    const config = statusConfig[status] || statusConfig["not submitted"];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleGradeSubmission = (submission: AssignmentSubmissionResponse) => {
    setSelectedSubmission(submission);
    setGradingDialogOpen(true);
  };

  const handleSaveGrade = (grade: number, feedback: string) => {
    // Handle grade saving logic here
    console.log('Saving grade:', grade, 'Feedback:', feedback);
  };

  const truncateFeedback = (feedback: string) => {
    if (feedback && feedback.length <= 100) return feedback;
    return feedback ? feedback.substring(0, 100) + "..." : "-";
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Loading */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-64 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Assignment Banner Loading */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="h-32 bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
            </div>
            <div className="h-20 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
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

  if (error || !assignmentDetails) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Error */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Link to="/grading-hub" aria-label="Back to grading hub">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Assignment Grading</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Assignment Details
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FileText className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Assignment Not Found</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
              The assignment you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/grading-hub">Back to Grading Hub</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate submission stats
  const submittedCount = submissions.filter((s: AssignmentSubmissionResponse) => s.status === "submitted" || s.status === "graded" || s.status === "late").length;
  const gradedCount = submissions.filter((s: AssignmentSubmissionResponse) => s.status === "graded").length;
  const lateCount = submissions.filter((s: AssignmentSubmissionResponse) => s.status === "late").length;
  const pendingCount = submittedCount - gradedCount;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Link to="/grading-hub" aria-label="Back to grading hub">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Assignment Grading</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {assignmentDetails.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Grade student submissions and provide feedback</p>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Assignment Info Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-xl font-bold mb-1">{assignmentDetails.courseName}</h2>
            <p className="text-blue-100">Assignment Details & Submission Management</p>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Due: {new Date(assignmentDetails.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Total Marks: {assignmentDetails.totalMarks}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Submissions: {submittedCount}
              </span>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Description:</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{assignmentDetails.description}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Submissions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{submittedCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Graded</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{gradedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Late Submissions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{lateCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Student Submissions ({filteredSubmissions.length})
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review submissions, provide grades and feedback to students
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search students..." 
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
                  <TableHead className="font-semibold">Student Name</TableHead>
                  <TableHead className="font-semibold">Student Email</TableHead>
                  <TableHead className="font-semibold">Submission Date</TableHead>
                  <TableHead className="font-semibold">Grade</TableHead>
                  <TableHead className="font-semibold">Feedback</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <TableCell className="font-medium text-slate-900 dark:text-white">{submission.studentName}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{submission.studentEmail}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {submission.submittedAt ? 
                          new Date(submission.submittedAt).toLocaleDateString() : 
                          "-"
                        }
                      </TableCell>
                      <TableCell>
                        {submission.obtainMarks !== undefined ? (
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-slate-900 dark:text-white">
                              {submission.obtainMarks}/{assignmentDetails.totalMarks}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs text-slate-600 dark:text-slate-400">
                        {truncateFeedback(submission.feedback || "")}
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View submission</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20"
                                onClick={() => handleGradeSubmission(submission)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Grade submission</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Users className="h-8 w-8 text-slate-400 mb-3" />
                        <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">No submissions found</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {searchTerm ? "Try adjusting your search terms" : "No student submissions available yet"}
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

      <GradingDialog
        isOpen={gradingDialogOpen}
        onClose={() => setGradingDialogOpen(false)}
        onSave={handleSaveGrade}
        studentName={selectedSubmission?.studentName || ""}
        totalMarks={assignmentDetails?.totalMarks || 100}
        currentGrade={selectedSubmission?.obtainMarks}
        currentFeedback={selectedSubmission?.feedback}
      />
    </div>
  );
};

export default AssignmentGrading;
