import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Calendar,
  Trophy,
  PlayCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { learnerAssignmentService, LearnerAssignment } from "@/services/learnerAssignmentService";
import { LearnerSkeleton } from "@/components/LoadingSpinner";
import { toast } from "sonner";

const LearnerAssignments = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: assignmentsData, isLoading, error } = useQuery({
    queryKey: ['learnerAssignments'],
    queryFn: learnerAssignmentService.getLearnerAssignments,
    retry: 2
  });

  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load assignments. Please try again.");
    }
  }, [error]);

  const assignments = assignmentsData?.data || [];

  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusInfo = (assignment: LearnerAssignment) => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isOverdue = now > dueDate && !assignment.isSubmitted;
    
    if (assignment.isSubmitted) {
      if (assignment.obtainedMarks !== undefined) {
        return {
          status: 'graded',
          label: 'Graded',
          color: 'bg-green-500',
          icon: Trophy
        };
      }
      return {
        status: 'submitted',
        label: 'Submitted',
        color: 'bg-blue-500',
        icon: CheckCircle
      };
    }
    
    if (isOverdue) {
      return {
        status: 'overdue',
        label: 'Overdue',
        color: 'bg-red-500',
        icon: AlertCircle
      };
    }
    
    return {
      status: 'pending',
      label: 'Pending',
      color: 'bg-yellow-500',
      icon: Clock
    };
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-2">
            My Assignments 📝
          </h1>
          <p className="text-purple-600 dark:text-purple-400 text-lg">
            Complete your assignments and show what you've learned!
          </p>
        </div>
        <LearnerSkeleton type="assignments" count={6} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-2">
          My Assignments 📝
        </h1>
        <p className="text-purple-600 dark:text-purple-400 text-lg">
          Complete your assignments and show what you've learned!
        </p>
      </div>

      {/* Search and Filter */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
          <Input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 rounded-2xl border-purple-200 dark:border-purple-700 focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map((assignment, index) => {
          const statusInfo = getStatusInfo(assignment);
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card
              key={assignment.id}
              className={cn(
                "kid-card hover:shadow-xl transition-all duration-300 overflow-hidden group",
                "animate-fade-in hover:scale-105",
                `animate-delay-${index * 100}`
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-2">
                      {assignment.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mb-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{assignment.courseName}</span>
                    </div>
                  </div>
                  <Badge 
                    className={cn(
                      "text-white text-xs px-2 py-1 rounded-full",
                      statusInfo.color
                    )}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-purple-600 dark:text-purple-400 line-clamp-2">
                  {assignment.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className={cn(
                      "font-medium",
                      statusInfo.status === 'overdue' ? "text-red-600 dark:text-red-400" : "text-purple-600 dark:text-purple-400"
                    )}>
                      {formatDueDate(assignment.dueDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-purple-600 dark:text-purple-400">
                        {assignment.totalMarks} points
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                      <span className="text-purple-600 dark:text-purple-400">
                        {assignment.questions?.length || 0} questions
                      </span>
                    </div>
                  </div>

                  {assignment.isSubmitted && assignment.obtainedMarks !== undefined && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Your Score:
                        </span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {assignment.obtainedMarks}/{assignment.totalMarks}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  {assignment.isSubmitted ? (
                    <Button 
                      disabled
                      className="w-full kid-button bg-gray-400 cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submitted
                    </Button>
                  ) : (
                    <Link to={`/assignment/${assignment.id}/attempt`}>
                      <Button 
                        className={cn(
                          "w-full kid-button group-hover:scale-105 transition-transform",
                          statusInfo.status === 'overdue' 
                            ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                            : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                        )}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        {statusInfo.status === 'overdue' ? 'Submit Late' : 'Start Assignment'}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="kid-card max-w-md mx-auto p-8">
            <FileText className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-2">
              No Assignments Yet
            </h3>
            <p className="text-purple-600 dark:text-purple-400 mb-6">
              {searchTerm 
                ? "No assignments found matching your search." 
                : "You don't have any assignments yet. Check back later for new assignments!"
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerAssignments;
