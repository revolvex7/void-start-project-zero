import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  FileText, 
  Send, 
  CheckCircle,
  BookOpen,
  Trophy,
  AlertTriangle,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { learnerAssignmentService, Question } from "@/services/learnerAssignmentService";
import { LearnerSkeleton } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AssignmentAttempt = () => {
  const { assignmentId: studentAssignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // First get the assignment ID from student assignment ID
  const { data: studentAssignmentDetails, isLoading: detailsLoading, error: detailsError } = useQuery({
    queryKey: ['studentAssignmentDetails', studentAssignmentId],
    queryFn: () => learnerAssignmentService.getStudentAssignmentDetails(studentAssignmentId!),
    enabled: !!studentAssignmentId,
    refetchOnWindowFocus: false
  });

  // Then fetch assignment questions using the assignment ID
  const { data: questions = [], isLoading: questionsLoading, error: questionsError } = useQuery({
    queryKey: ['assignmentQuestions', studentAssignmentDetails?.assignmentId],
    queryFn: () => learnerAssignmentService.getAssignmentQuestions(studentAssignmentDetails!.assignmentId),
    enabled: !!studentAssignmentDetails?.assignmentId,
    refetchOnWindowFocus: false
  });

  const currentQuestion = questions[currentQuestionIndex];
  const isLoading = detailsLoading || questionsLoading;
  const error = detailsError || questionsError;

  useEffect(() => {
    if (error) {
      toast.error("Failed to load assignment questions. Please try again.");
    }
  }, [error]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFileUpload = (questionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAnswerChange(questionId, file);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!studentAssignmentId) return;

    // Validate that all questions are answered
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      await learnerAssignmentService.submitAssignment(studentAssignmentId, answers);
      toast.success('Assignment submitted successfully!');
      navigate('/assignments');
    } catch (error) {
      toast.error('Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  const getAnsweredCount = () => {
    return questions.filter(question => answers[question.id]?.trim && answers[question.id]?.trim()).length;
  };

  const progress = questions.length > 0 ? (getAnsweredCount() / questions.length) * 100 : 0;

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id] || "";

    switch (question.type) {
      case 'brief':
        return (
          <Textarea
            placeholder="Write your detailed answer here..."
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="min-h-[150px]"
          />
        );

      case 'fill-blank':
        return (
          <Input
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="py-4 text-lg"
          />
        );

      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <RadioGroup 
              value={currentAnswer} 
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-purple-700 dark:text-purple-300">
                    {option}
                  </Label>
                </div>
              )) || (
                <p className="text-gray-500 italic">No options available for this question.</p>
              )}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-2">
            Loading Assignment... 📝
          </h1>
          <p className="text-purple-600 dark:text-purple-400 text-lg">
            Getting your assignment ready!
          </p>
        </div>
        
        {/* Assignment Attempt Skeleton */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="kid-card p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-7 bg-purple-200 dark:bg-purple-700 rounded-xl w-64 mb-3 animate-pulse" />
                <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded w-48 mb-2 animate-pulse" />
                <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-32 animate-pulse" />
              </div>
              <div className="w-20 h-8 bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800 to-purple-800 rounded-full animate-pulse" />
            </div>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-16 animate-pulse" />
                <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-12 animate-pulse" />
              </div>
              <div className="kid-progress">
                <div className="kid-progress-bar w-1/3 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="kid-card p-6 animate-pulse">
            <div className="mb-6">
              <div className="h-6 bg-purple-200 dark:bg-purple-700 rounded-xl w-48 mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded w-full animate-pulse" />
                <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded w-3/4 animate-pulse" />
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="w-4 h-4 bg-purple-200 dark:bg-purple-700 rounded-full animate-pulse" />
                  <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded w-48 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 to-gray-800 rounded-full w-24 animate-pulse" />
              <div className="h-10 bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800 to-purple-800 rounded-full w-24 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-2">
            Assignment Unavailable 📝
          </h1>
          <p className="text-purple-600 dark:text-purple-400 text-lg">
            There was an error loading your assignment.
          </p>
        </div>
        <div className="text-center py-12">
          <div className="kid-card max-w-md mx-auto p-8">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Failed to Load Assignment Questions
            </h3>
            <p className="text-red-500 dark:text-red-400 mb-6">
              We couldn't load the assignment questions. Please check your internet connection and try again.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/assignments')}
                className="kid-button"
              >
                Back to Assignments
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-300 mb-2">
            Assignment Questions
          </h1>
          <p className="text-purple-600 dark:text-purple-400 text-lg">
            No questions available for this assignment.
          </p>
        </div>
        <div className="text-center py-12">
          <div className="kid-card max-w-md mx-auto p-8">
            <FileText className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-2">
              No Questions Found
            </h3>
            <p className="text-purple-600 dark:text-purple-400 mb-6">
              This assignment doesn't have any questions yet. Please contact your instructor.
            </p>
            <Button 
              onClick={() => navigate('/assignments')}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              Back to Assignments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/assignments")}
          className="kid-button bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-300">
            Assignment Questions
          </h1>
          <div className="flex items-center gap-4 text-sm text-purple-600 dark:text-purple-400 mt-1">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{questions.length} Questions</span>
            </div>
          </div>
        </div>

        <div className="w-32" /> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <Card className="kid-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Progress: {getAnsweredCount()}/{questions.length} questions answered
            </span>
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              {Math.round(progress)}%
            </Badge>
          </div>
          <div className="kid-progress">
            <div 
              className="kid-progress-bar transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      {currentQuestion && (
        <Card className="kid-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-purple-800 dark:text-purple-300">
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <Badge 
                className={cn(
                  "text-white px-3 py-1 rounded-full text-xs",
                  currentQuestion.type === 'multiple-choice' ? "bg-blue-500" :
                  currentQuestion.type === 'brief' ? "bg-green-500" : "bg-orange-500"
                )}
              >
                {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' :
                 currentQuestion.type === 'brief' ? 'Brief Answer' : 'Fill in the Blank'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <p className="text-lg font-medium text-purple-800 dark:text-purple-300">
                {currentQuestion.question}
              </p>
            </div>

            {renderQuestion(currentQuestion)}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="kid-button bg-white dark:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={cn(
                      "w-8 h-8 rounded-full text-sm font-medium transition-all",
                      index === currentQuestionIndex
                        ? "bg-purple-600 text-white scale-110"
                        : answers[questions[index].id]?.trim && answers[questions[index].id]?.trim()
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-purple-200 dark:hover:bg-purple-800"
                    )}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="kid-button bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Assignment
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="kid-button bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="kid-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-purple-800 dark:text-purple-300">
              Submit Assignment?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-purple-600 dark:text-purple-400">
              Are you sure you want to submit your assignment? You have answered {getAnsweredCount()} out of {questions.length} questions.
              {getAnsweredCount() < questions.length && (
                <span className="block mt-2 text-orange-600 dark:text-orange-400 font-medium">
                  ⚠️ You have {questions.length - getAnsweredCount()} unanswered questions.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Review Answers
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Assignment
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssignmentAttempt;
