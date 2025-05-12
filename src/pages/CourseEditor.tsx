import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Settings, 
  CheckCircle, 
  X, 
  Users, 
  Upload, 
  Eye, 
  Edit,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Lightbulb,
  GraduationCap,
  LayoutGrid,
  LayoutList,
  Save,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { useSocketProgress } from "@/hooks/useSocketProgress";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "@/components/Sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EditCourseModal } from "@/components/courses/EditCourseModal";
import { useQuery } from "@tanstack/react-query";
import { courseService, AddSlidePayload, UpdateSlidePayload, QuizQuestionWithOptions, UpdateClassPayload } from "@/services/courseService";
import QuizManager from "@/components/quiz/QuizManager";

interface SlideData {
  slideId?: string;
  slideNo: number;
  slideTitle: string;
  content: string;
  voiceoverScript: string;
  visualPrompt: string;
  example: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface QuizQuestion {
  id?: string | number; // Make id optional for new questions
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  classId?: string | number; // Make classId optional for new questions
  createdAt?: string; // Make createdAt optional for new questions
  updatedAt?: string; // Make updatedAt optional for new questions
}

interface GeneratedClassData {
  classNo: number;
  classId: string;
  classTitle: string;
  concepts: string[];
  slides: SlideData[];
  faqs: FAQ[];
  quizzes: QuizQuestionWithOptions[]; // Updated to QuizQuestionWithOptions
}

interface AddSlideFormData {
  title: string;
  content: string;
  visualPrompt: string;
  voiceoverScript: string;
  example: string;
}

const CourseEditor: React.FC = () => {
	const { courseId } = useParams<{ courseId: string }>();
	const navigate = useNavigate();
	const [courseName, setCourseName] = useState("Loading course...");
	const [isPublishing, setIsPublishing] = useState(false);
	const [generatedClasses, setGeneratedClasses] = useState<GeneratedClassData[]>([]);
	const [selectedClass, setSelectedClass] = useState<GeneratedClassData | null>(null);
	const [showMainLoader, setShowMainLoader] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    concepts: true,
    slides: true,
    faqs: true,
    quizzes: true
  });
  const [slideView, setSlideView] = useState<'grid' | 'list'>('grid');
  const [hovered, setHovered] = useState<string | null>(null);
  const [addSlideDialogOpen, setAddSlideDialogOpen] = useState(false);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideFormData, setSlideFormData] = useState<AddSlideFormData>({
    title: "",
    content: "",
    visualPrompt: "",
    voiceoverScript: "",
    example: ""
  });
  const [isSubmittingSlide, setIsSubmittingSlide] = useState(false);
  const [generationNotifications, setGenerationNotifications] = useState<Array<{id: string, message: string}>>([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // New state for editing functionality
  const [isEditingTitleConcepts, setIsEditingTitleConcepts] = useState(false);
  const [editedClassTitle, setEditedClassTitle] = useState("");
  const [editedConcepts, setEditedConcepts] = useState<string[]>([]);
  const [newConceptInput, setNewConceptInput] = useState("");

  // Add this for the QuizManager
  const handleQuizChange = (classId: string, newQuizzes: QuizQuestionWithOptions[]) => {
    setGeneratedClasses(prev => 
      prev.map(classData => 
        classData.classId === classId
          ? { ...classData, quizzes: newQuizzes }
          : classData
      )
    );
    
    // Also update the selectedClass if it matches the classId
    if (selectedClass && selectedClass.classId === classId) {
      setSelectedClass(prev => {
        if (!prev) return null;
        return { ...prev, quizzes: newQuizzes };
      });
    }
  };

  // Fetch course details from API when available
  const { data: courseDetails } = useQuery({
    queryKey: ["course-editor-details", courseId],
    queryFn: () => courseService.getCourseEditorDetails(courseId!),
    enabled: !!courseId
  });
  
  // Update courseName when courseDetails changes
  useEffect(() => {
    if (courseDetails?.course) {
      setCourseName(courseDetails.course.courseTitle || "Untitled Course");
    }
  }, [courseDetails]);

	// Get socket connection for real-time updates - prevent disconnection by setting dependencies to []
	const { socket, isConnected, progressData } = useSocketProgress();

	// Listen for socket events for course generation
	useEffect(() => {
		if (!socket || !isConnected) {
			console.log("Socket not connected in CourseEditor, waiting...");
			return;
		}
		
		console.log("Setting up class_data listener in CourseEditor");
		
		// Listen for class data generation
		socket.on('class_data', (data: GeneratedClassData) => {
			console.log("Received class data:", data);
			
			setGeneratedClasses(prev => {
				// Check if we already have this class (prevent duplicates)
				const exists = prev.some(c => c.classId === data.classId);
				if (exists) {
					return prev;
				}
				
				// Set the first class as selected by default if we don't have a selected class yet
				if (!selectedClass) {
					setSelectedClass(data);
				}
				
				// Hide main loader after first class is generated
				if (prev.length === 0) {
					setTimeout(() => {
						setShowMainLoader(false);
					}, 500); // Short delay to let animations complete
				}
				
				return [...prev, data];
			});
			
      // Show toast notification that auto-closes
      toast.success(`Class ${data.classNo} generated`, {
        description: data.classTitle,
        duration: 5000
      });
      
      // Add class generation badge notification (will auto-remove after 5 seconds)
      const notificationId = Date.now().toString();
      setGenerationNotifications(prev => [
        ...prev, 
        {
          id: notificationId,
          message: `Class ${data.classNo} generated: ${data.classTitle}`
        }
      ]);
      
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setGenerationNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
      }, 5000);
		});
		
		return () => {
			// Only remove the event listener, but don't disconnect the socket
			if (socket) {
				console.log("Removing class_data listener");
				socket.off('class_data');
			}
		};
	}, [socket, isConnected, selectedClass]);

	const handlePublishCourse = () => {
		setIsPublishing(true);
		
		setTimeout(() => {
			setIsPublishing(false);
			toast.success("Course published successfully", {
				description: "Your course is now available to enrolled students",
        duration: 5000
			});
		}, 1500);
	};
	
	const handleClassSelect = (classData: GeneratedClassData) => {
		setSelectedClass(classData);
    // Initialize edited values when selecting a class
    if (classData) {
      setEditedClassTitle(classData.classTitle);
      setEditedConcepts([...classData.concepts]);
    }
	};

	const calculateProgress = (): number => {
		// If we have socket progress, use that
		if (progressData.status !== 'idle') {
			const match = progressData.progress.match(/(\d+)%/);
			if (match && match[1]) {
				return parseInt(match[1], 10);
			}
		}
		
		// Otherwise calculate based on generated classes
		if (generatedClasses.length === 0) return 5;
		// Assume we'll have 5 classes total
		return Math.min(95, Math.floor((generatedClasses.length / 5) * 100));
	};

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSlideView = () => {
    setSlideView(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // Get the exact progress value for display
  const getProgressText = (): string => {
    if (progressData.status !== 'idle') {
      return progressData.progress;
    }
    return `${calculateProgress()}%`;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSlideFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to open the add slide modal
  const openAddSlideModal = () => {
    setIsEditingSlide(false);
    setEditingSlideId(null);
    setSlideFormData({
      title: "",
      content: "",
      visualPrompt: "",
      voiceoverScript: "",
      example: ""
    });
    setAddSlideDialogOpen(true);
  };

  // Function to open the edit slide modal
  const openEditSlideModal = (slide: SlideData) => {
    if (!slide.slideId) {
      toast.error("Cannot edit slide without ID");
      return;
    }
    
    setIsEditingSlide(true);
    setEditingSlideId(slide.slideId);
    setSlideFormData({
      title: slide.slideTitle || "",
      content: slide.content || "",
      visualPrompt: slide.visualPrompt || "",
      voiceoverScript: slide.voiceoverScript || "",
      example: slide.example || ""
    });
    setAddSlideDialogOpen(true);
  };

  // Function to add a new slide
  const handleAddSlide = async () => {
    if (!selectedClass) return;
    
    setIsSubmittingSlide(true);
    
    try {
      const slidePayload: AddSlidePayload = {
        title: slideFormData.title,
        content: slideFormData.content,
        visualPrompt: slideFormData.visualPrompt,
        voiceoverScript: slideFormData.voiceoverScript,
        example: slideFormData.example
      };
      
      if (isEditingSlide && editingSlideId) {
        // Update slide
        await courseService.updateSlide(editingSlideId, slidePayload);
        toast.success("Slide updated successfully");
        
        // Update the slide in the UI
        setSelectedClass(prev => {
          if (!prev) return null;
          const updatedSlides = prev.slides.map(slide => {
            if (slide.slideId === editingSlideId) {
              return {
                ...slide,
                slideTitle: slideFormData.title,
                content: slideFormData.content,
                visualPrompt: slideFormData.visualPrompt,
                voiceoverScript: slideFormData.voiceoverScript,
                example: slideFormData.example
              };
            }
            return slide;
          });
          return { ...prev, slides: updatedSlides };
        });
        
        // Also update the slide in the generatedClasses array
        setGeneratedClasses(prev => 
          prev.map(classData => {
            if (classData.classId === selectedClass.classId) {
              const updatedSlides = classData.slides.map(slide => {
                if (slide.slideId === editingSlideId) {
                  return {
                    ...slide,
                    slideTitle: slideFormData.title,
                    content: slideFormData.content,
                    visualPrompt: slideFormData.visualPrompt,
                    voiceoverScript: slideFormData.voiceoverScript,
                    example: slideFormData.example
                  };
                }
                return slide;
              });
              return { ...classData, slides: updatedSlides };
            }
            return classData;
          })
        );
      } else {
        // Add new slide
        const response = await courseService.addSlide(selectedClass.classId, slidePayload);
        const newSlideId = response.data?.id || `temp-${Date.now()}`;
        
        // Create a new slide with the response data
        const newSlide: SlideData = {
          slideId: newSlideId,
          slideNo: selectedClass.slides.length + 1,
          slideTitle: slideFormData.title,
          content: slideFormData.content,
          voiceoverScript: slideFormData.voiceoverScript,
          visualPrompt: slideFormData.visualPrompt,
          example: slideFormData.example
        };
        
        // Add the new slide to the selected class
        setSelectedClass(prev => {
          if (!prev) return null;
          return {
            ...prev,
            slides: [...prev.slides, newSlide]
          };
        });
        
        // Also update the slide in the generatedClasses array
        setGeneratedClasses(prev => 
          prev.map(classData => 
            classData.classId === selectedClass.classId
              ? { ...classData, slides: [...classData.slides, newSlide] }
              : classData
          )
        );
        
        toast.success("New slide added successfully");
      }
      
      // Reset form data and close dialog
      setSlideFormData({
        title: "",
        content: "",
        visualPrompt: "",
        voiceoverScript: "",
        example: ""
      });
      setAddSlideDialogOpen(false);
      
    } catch (error) {
      console.error("Error handling slide:", error);
      toast.error(isEditingSlide ? "Failed to update slide" : "Failed to add slide", {
        description: "An error occurred while processing your request"
      });
    } finally {
      setIsSubmittingSlide(false);
    }
  };

  const handleCourseUpdate = () => {
    // Refetch course details
    if (courseDetails?.course) {
      setCourseName(courseDetails.course.courseTitle);
    }
  };

  // Check if we should show the processing screen
  const shouldShowProcessing = progressData.status === 'processing' || 
    progressData.status === 'starting' || 
    (sessionStorage.getItem('processingActive') === 'true' && progressData.status !== 'completed');

  // Function to toggle edit mode for title and concepts
  const toggleEditMode = () => {
    if (isEditingTitleConcepts) {
      // Save changes
      handleSaveChanges();
    } else {
      // Enter edit mode
      if (selectedClass) {
        setEditedClassTitle(selectedClass.classTitle);
        setEditedConcepts([...selectedClass.concepts]);
      }
      setIsEditingTitleConcepts(!isEditingTitleConcepts);
    }
  };
  
  // Function to cancel editing without saving changes
  const handleCancelEdit = () => {
    if (selectedClass) {
      setEditedClassTitle(selectedClass.classTitle);
      setEditedConcepts([...selectedClass.concepts]);
    }
    setIsEditingTitleConcepts(false);
    setNewConceptInput("");
  };
  
  // Function to remove a concept
  const handleRemoveConcept = (index: number) => {
    setEditedConcepts(prev => prev.filter((_, i) => i !== index));
  };
  
  // Function to handle key press in the new concept input
  const handleNewConceptKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newConceptInput.trim()) {
      e.preventDefault();
      handleAddConcept();
    }
  };
  
  // Function to add a new concept
  const handleAddConcept = () => {
    if (newConceptInput.trim()) {
      setEditedConcepts(prev => [...prev, newConceptInput.trim()]);
      setNewConceptInput("");
    }
  };

  // New function to save class title and concepts
  const handleSaveChanges = async () => {
    if (!selectedClass) return;
    
    try {
      const payload: UpdateClassPayload = {
        classTitle: editedClassTitle,
        concepts: editedConcepts
      };
      
      toast.info("Updating class details...");
      
      await courseService.updateClassDetails(selectedClass.classId, payload);
      
      // Update the class title and concepts in generatedClasses
      setGeneratedClasses(prev => 
        prev.map(classData => 
          classData.classId === selectedClass.classId
            ? { ...classData, classTitle: editedClassTitle, concepts: editedConcepts }
            : classData
        )
      );
      
      // Also update selectedClass
      setSelectedClass(prev => {
        if (!prev) return null;
        return {
          ...prev,
          classTitle: editedClassTitle,
          concepts: editedConcepts
        };
      });
      
      setIsEditingTitleConcepts(false);
      toast.success("Class details updated successfully");
    } catch (error) {
      console.error("Error updating class details:", error);
      toast.error("Failed to update class details", {
        description: "An error occurred while updating the class information"
      });
    }
  };

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
			{/* Custom sidebar for course editing */}
			<div className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-md transition-all duration-300">
				<div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
					<Link 
						to="/courses"
						className="flex items-center text-sm text-white/80 hover:text-white mb-4 transition-colors"
					>
						<ArrowLeft className="h-4 w-4 mr-1" />
						Back to courses
					</Link>
					<h1 className="text-xl font-bold truncate">
						{courseName}
					</h1>
					<p className="text-xs text-white/80 mt-1 flex items-center">
						<Sparkles className="h-3 w-3 mr-1" />
						Course being generated
					</p>
				</div>
				
				<div className="p-4 bg-gradient-to-b from-indigo-500/10 to-transparent">
					<Button 
						className="w-full mb-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md transition-all duration-300 hover:shadow-lg"
						onClick={handlePublishCourse}
						disabled={isPublishing || generatedClasses.length === 0}
					>
						{isPublishing ? (
							<Spinner size="sm" className="mr-2" />
						) : (
							<CheckCircle className="h-4 w-4 mr-2" />
						)}
						{isPublishing ? "Publishing..." : "Publish Course"}
					</Button>
					
					<div className="flex space-x-2 mb-4">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" size="sm" className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
										<Eye className="h-4 w-4 mr-1" />
										Preview
									</Button>
								</TooltipTrigger>
								<TooltipContent>Preview course as student</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => setIsSettingsModalOpen(true)}
                  >
										<Settings className="h-4 w-4 mr-1" />
										Settings
									</Button>
								</TooltipTrigger>
								<TooltipContent>Course settings</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
				
				<Separator />
				
				<div className="flex-1 overflow-auto p-4">
					<h2 className="text-sm font-medium mb-2 text-slate-500 dark:text-slate-400 flex items-center">
						<BookOpen className="h-4 w-4 mr-1 text-indigo-500" />
						Course Content
					</h2>
					
					{generatedClasses.length > 0 ? (
						<div className="space-y-1 animate-fade-in">
							{generatedClasses.map((classData, index) => (
								<div 
									key={index} 
									className={`text-sm py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between group transition-all duration-200 ${selectedClass?.classId === classData.classId ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300' : 'border border-transparent'}`}
									onClick={() => handleClassSelect(classData)}
                  onMouseEnter={() => setHovered(`class-${classData.classId}`)}
                  onMouseLeave={() => setHovered(null)}
								>
									<div className="flex items-center overflow-hidden">
										<div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-medium ${selectedClass?.classId === classData.classId ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200'}`}>
											{index + 1}
										</div>
										<span className="truncate">
											{classData.classTitle}
										</span>
									</div>
									{hovered === `class-${classData.classId}` && (
										<Button 
											variant="ghost" 
											size="icon" 
											className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-opacity"
										>
											<Edit className="h-3.5 w-3.5" />
										</Button>
									)}
								</div>
							))}
						</div>
					) : showMainLoader ? (
						<div className="text-center text-sm text-slate-500 mt-4">
							<div className="flex justify-center mb-3">
								<Spinner size="md" color="secondary" className="opacity-50" />
							</div>
							<p className="text-sm text-slate-400">The first class will appear here soon</p>
						</div>
					) : (
            <div className="text-center text-sm text-slate-500 mt-4 animate-fade-in">
              <GraduationCap className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-400">Waiting for generated classes...</p>
            </div>
          )}
				</div>
				
				{/* Loader in sidebar for upcoming class generation */}
				{socket && isConnected && progressData.status !== 'idle' && !showMainLoader && (
					<div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-medium text-slate-600 dark:text-slate-300">Generating next class</span>
							<Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                {progressData.progress}
              </Badge>
						</div>
						<Progress value={calculateProgress()} className="h-1.5 bg-blue-100 dark:bg-blue-900/30" />
						<p className="text-xs text-slate-400 mt-2 text-center italic">
							{progressData.message || "Processing..."}
						</p>
					</div>
				)}
        
        {/* Class generation notification badges */}
        {generationNotifications.length > 0 && (
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 space-y-2">
            {generationNotifications.map(notification => (
              <Badge
                key={notification.id}
                className="w-full py-1.5 px-2 flex items-center justify-between bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30 animate-fade-in"
              >
                <span className="truncate text-xs">{notification.message}</span>
                <Button
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-green-100 dark:hover:bg-green-800/50 rounded-full p-0"
                  onClick={() => setGenerationNotifications(prev => 
                    prev.filter(n => n.id !== notification.id)
                  )}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
			</div>

			{/* Main content area */}
			<div className="flex-1 overflow-y-auto">
				<header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm bg-opacity-80 backdrop-blur-sm">
					<div className="flex items-center justify-between h-16 px-6">
						<h1 className="text-xl font-semibold text-slate-900 dark:text-white">
							Course Editor
						</h1>
						<div className="flex items-center space-x-3">
							<Badge variant="outline" className="bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
								<div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
								Auto-saving
							</Badge>
						</div>
					</div>
				</header>

				<div className="max-w-5xl mx-auto p-6">
					{/* Show loader for first class generation */}
          {showMainLoader ? (
						<div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-white/50 dark:bg-slate-800/30 shadow-sm animate-fade-in">
							<div className="relative inline-flex mb-6">
								<div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
								<Spinner className="relative z-10" size="xl" />
							</div>
							<h3 className="text-xl font-medium mb-3 text-slate-700 dark:text-slate-300">Creating Your Course</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400 max-w-md text-center">
								Our AI is generating comprehensive course content based on your requirements. The first class will appear shortly.
							</p>
              <div className="mt-8 flex flex-col items-center">
                <Progress value={calculateProgress()} className="h-1.5 w-64 mb-2" />
                <p className="text-xs text-slate-400">{progressData.message || "Starting generation..."}</p>
              </div>
						</div>
					) : selectedClass ? (
						<div className="animate-fade-in">
							<div className="mb-6">
								<div className="flex items-center justify-between">
                  {isEditingTitleConcepts ? (
                    <div className="flex-1 mr-2">
                      <Input 
                        value={editedClassTitle}
                        onChange={(e) => setEditedClassTitle(e.target.value)}
                        className="text-2xl font-bold py-2 px-3 border-2 border-indigo-300 focus:border-indigo-500 rounded-md bg-white/90 dark:bg-slate-800/90 shadow-sm transition-all duration-200"
                        placeholder="Enter class title"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {selectedClass.classTitle}
                    </h2>
                  )}
                  <div className="flex space-x-2">
                    {isEditingTitleConcepts ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancelEdit}
                          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={handleSaveChanges}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={toggleEditMode}
                              className="h-8 w-8 p-0 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-indigo-600 dark:text-indigo-400 transition-all duration-200 hover:scale-105"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit title and key concepts</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
								<div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none dark:bg-indigo-900/30 dark:text-indigo-300">
                    Class {selectedClass.classNo}
                  </Badge>
                  <Badge variant="outline" className="text-slate-600 dark:text-slate-300">
                    {selectedClass.slides.length} slides
                  </Badge>
                </div>
							</div>

              {/* Key Concepts Section */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Key Concepts
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${openSections.concepts ? 'rotate-180' : ''} transition-transform duration-200`}
                      onClick={() => toggleSection('concepts')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                {openSections.concepts && (
                  <CardContent>
                    {isEditingTitleConcepts ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {editedConcepts.map((concept, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                            >
                              {concept}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full p-0"
                                onClick={() => handleRemoveConcept(index)}
                              >
                                <X className="h-2.5 w-2.5" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex mt-3">
                          <Input 
                            placeholder="Add a new concept"
                            value={newConceptInput}
                            onChange={(e) => setNewConceptInput(e.target.value)}
                            onKeyDown={handleNewConceptKeyDown}
                            className="mr-2"
                          />
                          <Button 
                            onClick={handleAddConcept}
                            disabled={!newConceptInput.trim()}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedClass.concepts.map((concept, index) => (
                          <Badge key={index} variant="secondary" className="bg-slate-100 dark:bg-slate-700">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Slides Section */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Slides
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={toggleSlideView}
                            >
                              {slideView === 'grid' ? (
                                <LayoutList className="h-4 w-4" />
                              ) : (
                                <LayoutGrid className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Toggle slide view</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${openSections.slides ? 'rotate-180' : ''} transition-transform duration-200`}
                        onClick={() => toggleSection('slides')}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {openSections.slides && (
                  <CardContent>
                    <div className="mb-4 flex justify-end">
                      <Button onClick={openAddSlideModal} className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Slide
                      </Button>
                    </div>
                    {selectedClass.slides.length > 0 ? (
                      <div className={slideView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                        {selectedClass.slides.map((slide, index) => (
                          <div 
                            key={index} 
                            className={`border rounded-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 bg-white dark:bg-slate-800 shadow-sm hover:shadow ${slideView === 'grid' ? '' : 'p-4 flex'}`}
                            onMouseEnter={() => setHovered(`slide-${index}`)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            {slideView === 'grid' ? (
                              <>
                                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 border-b flex justify-between items-center">
                                  <span className="font-medium text-sm">Slide {slide.slideNo}</span>
                                  {hovered === `slide-${index}` && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 rounded-full hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30"
                                      onClick={() => openEditSlideModal(slide)}
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                                <div className="p-4">
                                  <h3 className="font-medium mb-2 truncate">{slide.slideTitle}</h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                                    {slide.content}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex-shrink-0 w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center mr-4 text-slate-500 dark:text-slate-400">
                                  <span className="font-medium">{slide.slideNo}</span>
                                </div>
                                <div className="flex-grow">
                                  <h3 className="font-medium mb-1">{slide.slideTitle}</h3>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {slide.content}
                                  </p>
                                </div>
                                {hovered === `slide-${index}` && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-shrink-0 self-start h-7 w-7 p-0 rounded-full hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30"
                                    onClick={() => openEditSlideModal(slide)}
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed rounded-md bg-slate-50 dark:bg-slate-800/50">
                        <FileText className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                        <h3 className="text-lg font-medium mb-2 text-slate-700 dark:text-slate-300">No slides yet</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-md mx-auto">
                          Add slides to this class to provide learning content for your students.
                        </p>
                        <Button onClick={openAddSlideModal} className="bg-indigo-600 hover:bg-indigo-700">
                          <Plus className="h-4 w-4 mr-1" />
                          Add First Slide
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Quiz Section */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      Quiz Questions
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${openSections.quizzes ? 'rotate-180' : ''} transition-transform duration-200`}
                      onClick={() => toggleSection('quizzes')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                {openSections.quizzes && (
                  <CardContent>
                    <QuizManager 
                      classId={selectedClass.classId} 
                      quizzes={selectedClass.quizzes || []} 
                      onChange={(newQuizzes) => handleQuizChange(selectedClass.classId, newQuizzes)} 
                    />
                  </CardContent>
                )}
              </Card>
              
              {/* FAQs Section */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      FAQs
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${openSections.faqs ? 'rotate-180' : ''} transition-transform duration-200`}
                      onClick={() => toggleSection('faqs')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                {openSections.faqs && (
                  <CardContent>
                    {selectedClass.faqs && selectedClass.faqs.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {selectedClass.faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-slate-600 dark:text-slate-300">
                                {faq.answer}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No FAQs available for this class.
                        </p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-white/50 dark:bg-slate-800/30 shadow-sm animate-fade-in">
							<GraduationCap className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
							<h3 className="text-xl font-medium mb-2 text-slate-700 dark:text-slate-300">Select a Class</h3>
							<p className="text-sm text-slate-500 dark:text-slate-400 max-w-md text-center">
								Choose a class from the sidebar to view and edit its content.
							</p>
						</div>
					)}
				</div>
			</div>

      {/* Add/Edit Slide Dialog */}
      <Dialog open={addSlideDialogOpen} onOpenChange={setAddSlideDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditingSlide ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Slide Title</Label>
              <Input
                id="title"
                name="title"
                value={slideFormData.title}
                onChange={handleInputChange}
                placeholder="Enter slide title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={slideFormData.content}
                onChange={handleInputChange}
                placeholder="Enter slide content"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="visualPrompt">Visual Prompt</Label>
              <Textarea
                id="visualPrompt"
                name="visualPrompt"
                value={slideFormData.visualPrompt}
                onChange={handleInputChange}
                placeholder="Describe what should be shown visually"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="voiceoverScript">Voiceover Script</Label>
              <Textarea
                id="voiceoverScript"
                name="voiceoverScript"
                value={slideFormData.voiceoverScript}
                onChange={handleInputChange}
                placeholder="Script for audio narration"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="example">Example</Label>
              <Textarea
                id="example"
                name="example"
                value={slideFormData.example}
                onChange={handleInputChange}
                placeholder="Provide an example for this concept"
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSlideDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSlide} 
              disabled={isSubmittingSlide || !slideFormData.title || !slideFormData.content}
            >
              {isSubmittingSlide && <Spinner size="sm" className="mr-2" />}
              {isEditingSlide ? 'Save Changes' : 'Add Slide'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Settings Modal */}
      <EditCourseModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
        courseId={courseId || ''}
        onUpdate={handleCourseUpdate}
      />
		</div>
	);
};

export default CourseEditor;
