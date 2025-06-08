import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Target,
  BookOpen,
  Star,
  MessageSquare,
  Award,
  GraduationCap,
  Save,
  X,
  Calculator,
  CheckCircle2,
  XCircle,
  MinusCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { assignmentService, AssignmentSubmissionResponse, AssignmentDetail, SubmittedAnswer } from "@/services/assignmentService";
import api from "@/services/api";
import { toast } from "sonner";

const AssignmentGrading: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewSubmissionDialog, setViewSubmissionDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmissionResponse | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<SubmittedAnswer[]>([]);
  const [questionGrades, setQuestionGrades] = useState<Record<string, number>>({});
  const [totalObtainedMarks, setTotalObtainedMarks] = useState<number>(0);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);

  const queryClient = useQueryClient();

  const { data: assignmentData, isLoading, error } = useQuery({
    queryKey: ["assignment-details", assignmentId],
    queryFn: () => assignmentService.getAssignmentSubmissions(assignmentId!),
    enabled: !!assignmentId,
  });

  const gradeMutation = useMutation({
    mutationFn: async ({ studentAssignmentId, obtainMarks }: { studentAssignmentId: string; obtainMarks: number }) => {
      const response = await api.put(`/user/grade-assignment/${studentAssignmentId}`, {
        obtainMarks: obtainMarks
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Grade saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["assignment-details", assignmentId] });
      setViewSubmissionDialog(false);
      setSelectedSubmission(null);
      setSubmittedAnswers([]);
      setQuestionGrades({});
      setTotalObtainedMarks(0);
    },
    onError: () => {
      toast.error("Failed to save grade. Please try again.");
    }
  });

  const assignmentDetails: AssignmentDetail | undefined = assignmentData?.data;
  const submissions = assignmentDetails?.submissions || [];

  // Calculate total obtained marks whenever question grades change
  useEffect(() => {
    const total = Object.values(questionGrades).reduce((sum, grade) => sum + grade, 0);
    setTotalObtainedMarks(total);
  }, [questionGrades]);

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

  const fetchSubmittedAnswers = async (studentAssignmentId: string) => {
    setIsLoadingAnswers(true);
    try {
      const response = await assignmentService.getSubmittedAssignment(studentAssignmentId);
      setSubmittedAnswers(response.data);
      
      // Initialize question grades - you can set default marks per question or leave as 0
      const initialGrades: Record<string, number> = {};
      response.data.forEach(answer => {
        initialGrades[answer.questionId] = 0; // Default to 0, instructor will set marks
      });
      setQuestionGrades(initialGrades);
    } catch (error) {
      toast.error("Failed to load submission details");
      console.error("Error fetching submitted answers:", error);
    } finally {
      setIsLoadingAnswers(false);
    }
  };

  const handleViewSubmission = async (submission: AssignmentSubmissionResponse) => {
    setSelectedSubmission(submission);
    setViewSubmissionDialog(true);
    
    // Fetch the submitted answers using the submission ID as studentAssignmentId
    await fetchSubmittedAnswers(submission.id);
  };

  const updateQuestionGrade = (questionId: string, grade: number) => {
    const newGrade = Math.max(0, grade); // Ensure non-negative grades
    const newGrades = {
      ...questionGrades,
      [questionId]: newGrade
    };
    
    // Calculate what the new total would be
    const newTotal = Object.values(newGrades).reduce((sum, g) => sum + g, 0);
    
    // Check if new total would exceed max possible marks
    if (assignmentDetails && newTotal > assignmentDetails.totalMarks) {
      toast.error(`Total marks cannot exceed ${assignmentDetails.totalMarks}`);
      return;
    }
    
    setQuestionGrades(newGrades);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'multiple-choice':
        return <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'brief':
        return <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'fill-blank':
        return <MinusCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getAnswerDisplay = (answer: SubmittedAnswer) => {
    if (answer.type === 'multiple-choice' && answer.options) {
      const isCorrect = answer.answer === answer.correctAnswer;
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Selected:</span>
            <Badge variant={isCorrect ? "default" : "destructive"} className="text-xs">
              {answer.answer}
            </Badge>
            {isCorrect ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
          {!isCorrect && answer.correctAnswer && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <span>Correct answer:</span>
              <Badge variant="outline" className="text-xs">
                {answer.correctAnswer}
              </Badge>
            </div>
          )}
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Options: {answer.options.join(", ")}
          </div>
        </div>
      );
    }

    if (answer.type === 'fill-blank' && answer.correctAnswer) {
      const isCorrect = answer.answer.toLowerCase().trim() === answer.correctAnswer.toLowerCase().trim();
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Answer:</span>
            <span className="text-slate-900 dark:text-white">{answer.answer}</span>
            {isCorrect ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
          {!isCorrect && (
            <div className="text-sm text-green-600 dark:text-green-400">
              Expected: {answer.correctAnswer}
            </div>
          )}
        </div>
      );
    }

    // For brief questions or others without predefined correct answers
    return (
      <div>
        <span className="font-medium">Answer:</span>
        <p className="text-slate-900 dark:text-white mt-1">{answer.answer}</p>
      </div>
    );
  };

  const handleSaveGrade = () => {
    if (!selectedSubmission) return;

    gradeMutation.mutate({
      studentAssignmentId: selectedSubmission.id,
      obtainMarks: totalObtainedMarks
    });
  };

  // Calculate submission stats
  const submittedCount = submissions.filter((s: AssignmentSubmissionResponse) => s.status === "submitted" || s.status === "graded" || s.status === "late").length;
  const gradedCount = submissions.filter((s: AssignmentSubmissionResponse) => s.status === "graded").length;
  const lateCount = submissions.filter((s: AssignmentSubmissionResponse) => s.status === "late").length;
  const pendingCount = submittedCount - gradedCount;

  // Check if grading actions should be shown
  const showGradingActions = pendingCount > 0 && !gradeMutation.isPending;

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

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !assignmentDetails) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
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
            <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Assignment Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-xl font-bold mb-1">{assignmentDetails.courseName}</h2>
            <p className="text-blue-100">Assignment Details & Submission Management</p>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Due Date</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {new Date(assignmentDetails.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Marks</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {assignmentDetails.totalMarks}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Questions</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {assignmentDetails.questions?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Submissions</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {submittedCount}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Description:</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{assignmentDetails.description}</p>
          </div>
        </div>
      </div>

      {/* Assignment Questions */}
      {assignmentDetails.questions && assignmentDetails.questions.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-700/50 dark:to-purple-900/20 px-6 py-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Assignment Questions ({assignmentDetails.questions.length})
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Review the questions students need to answer
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {assignmentDetails.questions.map((question, index) => (
                <div key={question.id} className="bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-700/30 dark:to-purple-900/10 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white font-medium mb-2">{question.question}</p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">
                          {question.type}
                        </Badge>
                        {question.options && (
                          <Badge variant="outline" className="text-xs">
                            {question.options.length} options
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{submittedCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Graded</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{gradedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800/50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Late</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{lateCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-200 dark:bg-red-800/50 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
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

          {/* Status message when actions are hidden */}
          {!showGradingActions && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {gradeMutation.isPending 
                    ? "Grading in progress..."
                    : pendingCount === 0 
                    ? "All submissions have been graded."
                    : "No pending submissions to grade."
                  }
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-700/50">
                  <TableHead className="font-semibold">Student</TableHead>
                  <TableHead className="font-semibold">Submitted</TableHead>
                  <TableHead className="font-semibold">Grade</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  {showGradingActions && (
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {submission.studentName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{submission.studentName}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{submission.studentEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <span className="text-slate-900 dark:text-white">
                            {submission.submittedAt ? 
                              new Date(submission.submittedAt).toLocaleDateString() : 
                              "Not submitted"
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {submission.obtainMarks !== undefined && submission.obtainMarks !== null ? (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="font-medium text-slate-900 dark:text-white">
                              {submission.obtainMarks}/{assignmentDetails?.totalMarks}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Not graded</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      {showGradingActions && (
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                onClick={() => handleViewSubmission(submission)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View & Grade Submission</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={showGradingActions ? 5 : 4} className="h-32">
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

      {/* View Submission Dialog */}
      <Dialog open={viewSubmissionDialog} onOpenChange={setViewSubmissionDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Submission Details & Grading - {selectedSubmission?.studentName}
            </DialogTitle>
            <DialogDescription>
              Review the student's answers and provide grades for each question
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Student Info Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {selectedSubmission.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{selectedSubmission.studentName}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{selectedSubmission.studentEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(selectedSubmission.status)}
                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Submitted</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {selectedSubmission.submittedAt ? 
                          new Date(selectedSubmission.submittedAt).toLocaleString() : 
                          "Not submitted"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Grade Summary */}
              <div className={`rounded-lg p-4 border transition-all duration-200 ${
                assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks
                  ? 'bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 border-red-200 dark:border-red-700'
                  : assignmentDetails && totalObtainedMarks === assignmentDetails.totalMarks
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700'
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calculator className={`h-6 w-6 ${
                      assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks
                        ? 'text-red-600 dark:text-red-400'
                        : assignmentDetails && totalObtainedMarks === assignmentDetails.totalMarks
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-green-600 dark:text-green-400'
                    }`} />
                    <div>
                      <h4 className={`font-semibold ${
                        assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks
                          ? 'text-red-900 dark:text-red-100'
                          : assignmentDetails && totalObtainedMarks === assignmentDetails.totalMarks
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-green-900 dark:text-green-100'
                      }`}>
                        {assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks
                          ? 'Grade Exceeds Maximum!'
                          : 'Grade Summary'
                        }
                      </h4>
                      <p className={`text-sm ${
                        assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks
                          ? 'text-red-700 dark:text-red-300'
                          : assignmentDetails && totalObtainedMarks === assignmentDetails.totalMarks
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-green-700 dark:text-green-300'
                      }`}>
                        {assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks
                          ? `Reduce by ${totalObtainedMarks - assignmentDetails.totalMarks} marks`
                          : assignmentDetails && totalObtainedMarks === assignmentDetails.totalMarks
                          ? 'Perfect score achieved'
                          : `${assignmentDetails ? assignmentDetails.totalMarks - totalObtainedMarks : 0} marks remaining`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks
                        ? 'text-red-900 dark:text-red-100'
                        : assignmentDetails && totalObtainedMarks === assignmentDetails.totalMarks
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-green-900 dark:text-green-100'
                    }`}>
                      {totalObtainedMarks} / {assignmentDetails?.totalMarks}
                    </div>
                    <div className={`text-sm ${
                      assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks
                        ? 'text-red-700 dark:text-red-300'
                        : assignmentDetails && totalObtainedMarks === assignmentDetails.totalMarks
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-green-700 dark:text-green-300'
                    }`}>
                      {assignmentDetails?.totalMarks ? 
                        `${((totalObtainedMarks / assignmentDetails.totalMarks) * 100).toFixed(1)}%` : 
                        '0%'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Submitted Answers with Grading */}
              {isLoadingAnswers ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                  <span className="ml-2 text-slate-600 dark:text-slate-400">Loading submission details...</span>
                </div>
              ) : submittedAnswers.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Student Answers & Grading ({submittedAnswers.length} Questions)
                  </h4>
                  <div className="space-y-4">
                    {submittedAnswers.map((answer, index) => (
                      <div key={answer.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {/* Question Header */}
                        <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-200 dark:border-slate-600">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getQuestionTypeIcon(answer.type)}
                                  <Badge variant="outline" className="text-xs">
                                    {answer.type}
                                  </Badge>
                                </div>
                                <p className="text-slate-900 dark:text-white font-medium">{answer.question}</p>
                              </div>
                            </div>
                            {/* Grade Input */}
                            <div className="flex items-center gap-2 ml-4">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Marks:</span>
                              <Input
                                type="number"
                                min="0"
                                value={questionGrades[answer.questionId] || 0}
                                onChange={(e) => updateQuestionGrade(answer.questionId, Number(e.target.value))}
                                className="w-20 h-8 text-center bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Answer Content */}
                        <div className="p-4">
                          {getAnswerDisplay(answer)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">No answers found for this submission</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setViewSubmissionDialog(false);
                    setSelectedSubmission(null);
                    setSubmittedAnswers([]);
                    setQuestionGrades({});
                    setTotalObtainedMarks(0);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  <div className="text-right text-sm text-slate-600 dark:text-slate-400">
                    <div>Total Grade: <span className="font-semibold text-slate-900 dark:text-white">{totalObtainedMarks}</span></div>
                    <div>Max Possible: <span className="font-semibold">{assignmentDetails?.totalMarks}</span></div>
                  </div>
                  <Button 
                    onClick={handleSaveGrade} 
                    disabled={gradeMutation.isPending || (assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks)}
                    className={`${
                      assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks
                        ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {gradeMutation.isPending 
                      ? "Saving Grade..." 
                      : (assignmentDetails && totalObtainedMarks > assignmentDetails.totalMarks)
                      ? "Exceeds Maximum"
                      : "Save Grade"
                    }
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentGrading;
