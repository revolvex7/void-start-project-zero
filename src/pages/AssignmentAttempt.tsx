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
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: () => learnerAssignmentService.getAssignmentById(assignmentId!),
    enabled: !!assignmentId
  });

  const questions = assignment?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate time remaining
  useEffect(() => {
    if (!assignment?.dueDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      const diff = dueDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Time's up!");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [assignment?.dueDate]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load assignment. Please try again.");
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
    if (!assignment) return;

    // Validate that all questions are answered
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      await learnerAssignmentService.submitAssignment(assignment.id, answers);
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
    return questions.filter(question => answers[question.id]?.trim()).length;
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

      case 'mcq':
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
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading || !assignment) {
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

  const isOverdue = new Date(assignment.dueDate) < new Date();

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
            {assignment.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-purple-600 dark:text-purple-400 mt-1">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{assignment.courseName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>{assignment.totalMarks} points</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{timeRemaining}</span>
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
                  currentQuestion.type === 'mcq' ? "bg-blue-500" :
                  currentQuestion.type === 'brief' ? "bg-green-500" : "bg-orange-500"
                )}
              >
                {currentQuestion.type === 'mcq' ? 'Multiple Choice' :
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
                        : answers[questions[index].id]?.trim()
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
