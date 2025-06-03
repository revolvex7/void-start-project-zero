import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  MessageCircle, 
  FileText,
  Info,
  ArrowLeft,
  Presentation,
  FileQuestion,
  PlayCircle,
  CheckCircle,
  Circle,
  Clock,
  Users,
  Award,
  BarChart3
} from 'lucide-react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import PresentationView from '@/components/syllabus/PresentationView';

// Define course related interfaces
export interface Slide {
  id: string;
  title: string;
  slideNo: number;
  visualPrompt: string;
  voiceoverScript: string;
  imageUrl: string | null;
  content: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  example: string;
}

export interface Class {
  classNo: number;
  classId: string;
  classTitle: string;
  concepts: string[];
  slides: Slide[];
  faqs?: Array<{
    id: string;
    question: string;
    answer: string;
    classId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface CourseInfo {
  id: string;
  courseTitle: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  courseCode: string | null;
  price: number | null;
  categoryId: string | null;
  description: string | null;
  image: string | null;
  isPublished: boolean | null;
}

export interface CourseResponse {
  data: {
    courseInfo: CourseInfo;
    classes: Class[];
  };
}

const CoursePreview: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeClassIndex, setActiveClassIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('content');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const { theme } = useTheme();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['course-preview', courseId],
    queryFn: async () => {
      try {
        const response = await api.get(`/user/course/${courseId}`);
        return response.data as CourseResponse;
      } catch (error) {
        console.error('Error fetching course data:', error);
        throw error;
      }
    },
    enabled: !!courseId,
  });

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading course",
        description: "Failed to load course preview. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  const startPresentation = () => {
    if (course?.classes[activeClassIndex]?.slides) {
      setIsPresentationMode(true);
    } else {
      toast({
        title: "Cannot start presentation",
        description: "This class doesn't have any slides to present.",
        variant: "destructive",
      });
    }
  };

  const closePresentation = () => {
    setIsPresentationMode(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-8 animate-pulse">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg w-64 mx-auto"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/20 dark:to-rose-950/20 flex items-center justify-center p-4">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/50 dark:border-red-800/50 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-4">Course Not Found</h2>
          <p className="text-red-600 dark:text-red-400 mb-8">We couldn't load this course. Please try again or contact support.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const course = data.data;
  const classes = course.classes || [];
  const activeClass = classes[activeClassIndex] || null;
  const slides = activeClass?.slides || [];
  const activeSlide = slides[activeSlideIndex] || null;
  const totalClasses = classes.length;
  const totalSlides = slides.length;

  const goToNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    } else if (activeClassIndex < classes.length - 1) {
      setActiveClassIndex(activeClassIndex + 1);
      setActiveSlideIndex(0);
      setActiveTab('content');
    }
  };

  const goToPreviousSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
      if (activeSlideIndex === slides.length - 1 && activeTab === 'quiz') {
        setActiveTab('content');
      }
    } else if (activeClassIndex > 0) {
      setActiveClassIndex(activeClassIndex - 1);
      setActiveSlideIndex(classes[activeClassIndex - 1].slides.length - 1);
      setActiveTab('content');
    }
  };

  const handleClassSelect = (index: number) => {
    setActiveClassIndex(index);
    setActiveSlideIndex(0);
  };

  const handleSlideSelect = (index: number) => {
    setActiveSlideIndex(index);
    if (index !== slides.length - 1 && activeTab === 'quiz') {
      setActiveTab('content');
    }
  };
  
  const getSlideProgress = () => {
    if (!totalSlides) return 0;
    return ((activeSlideIndex + 1) / totalSlides) * 100;
  };

  const getOverallProgress = () => {
    if (!classes.length) return 0;
    const completedClasses = activeClassIndex;
    const currentClassProgress = totalSlides > 0 ? (activeSlideIndex + 1) / totalSlides : 0;
    return ((completedClasses + currentClassProgress) / classes.length) * 100;
  };

  return (
    <>
      {isPresentationMode && activeClass && (
        <PresentationView
          slides={activeClass.slides}
          title={activeClass.classTitle}
          faqs={activeClass.faqs || []}
          onClose={closePresentation}
          classId={activeClass.classId}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Modern Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(-1)}
                  className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {course?.courseInfo.courseTitle}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {totalClasses} Classes
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {totalSlides} Slides
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">{Math.round(getOverallProgress())}% Complete</span>
                </div>
                <ThemeToggle />
                <Button variant="outline" onClick={() => navigate(-1)} className="hidden md:flex">
                  Exit Preview
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <Progress value={getOverallProgress()} className="h-2 bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Modern Sidebar Navigation */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3">
              <div className="sticky top-32 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                  <h2 className="text-lg font-semibold flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                    Course Content
                  </h2>
                </div>
                
                <div className="p-4 max-h-[70vh] overflow-y-auto space-y-3">
                  {classes.map((classItem, classIndex) => (
                    <div
                      key={classItem.classId}
                      className={cn(
                        "rounded-xl overflow-hidden transition-all duration-300 border",
                        classIndex === activeClassIndex
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 shadow-lg"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md"
                      )}
                    >
                      <button
                        onClick={() => handleClassSelect(classIndex)}
                        className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3",
                              classIndex === activeClassIndex
                                ? "bg-blue-500 text-white"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                            )}>
                              {classItem.classNo}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {classItem.classTitle}
                            </span>
                          </div>
                          {classIndex < activeClassIndex && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        
                        {classIndex === activeClassIndex && (
                          <div className="space-y-2 ml-11">
                            {classItem.slides.map((slide, slideIndex) => (
                              <button
                                key={slide.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSlideSelect(slideIndex);
                                }}
                                className={cn(
                                  "w-full flex items-center p-2 rounded-lg text-sm transition-all duration-200",
                                  slideIndex === activeSlideIndex
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                                )}
                              >
                                <div className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3",
                                  slideIndex < activeSlideIndex
                                    ? "bg-green-100 dark:bg-green-900/30"
                                    : slideIndex === activeSlideIndex
                                      ? "bg-blue-100 dark:bg-blue-900/30"
                                      : "bg-slate-100 dark:bg-slate-700"
                                )}>
                                  {slideIndex < activeSlideIndex ? (
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                  ) : slideIndex === activeSlideIndex ? (
                                    <PlayCircle className="w-3 h-3 text-blue-600" />
                                  ) : (
                                    <Circle className="w-3 h-3 text-slate-400" />
                                  )}
                                </div>
                                <span className="truncate">{slide.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9">
              {activeClass && activeSlide ? (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                  {/* Content Header */}
                  <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                            Class {activeClass.classNo} • Slide {activeSlide.slideNo}/{slides.length}
                          </span>
                          <Progress value={getSlideProgress()} className="w-24 h-2" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                          {activeSlide.title}
                        </h2>
                      </div>
                      
                      <Button 
                        onClick={startPresentation}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Presentation className="h-4 w-4 mr-2" />
                        Start Presentation
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                    <div className="px-6 pt-6">
                      <TabsList className="bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                        <TabsTrigger 
                          value="content" 
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 rounded-lg transition-all"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Content
                        </TabsTrigger>
                        {activeSlideIndex === slides.length - 1 && (
                          <TabsTrigger 
                            value="quiz" 
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 rounded-lg transition-all"
                          >
                            <FileQuestion className="w-4 h-4 mr-2" />
                            Class Quiz
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </div>
                    
                    <TabsContent value="content" className="p-6 pt-4 focus:outline-none">
                      <div className="space-y-6">
                        {activeSlide.imageUrl && (
                          <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <AspectRatio ratio={16/9}>
                              <img 
                                src={activeSlide.imageUrl} 
                                alt={activeSlide.title} 
                                className="w-full h-full object-cover"
                              />
                            </AspectRatio>
                          </div>
                        )}
                        
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                            {activeSlide.content}
                          </p>
                        </div>
                        
                        {activeSlide.example && (
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-400 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center">
                              <Award className="w-5 h-5 mr-2" />
                              Example
                            </h4>
                            <p className="text-amber-700 dark:text-amber-200">
                              {activeSlide.example}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="quiz" className="p-6 pt-4 focus:outline-none">
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FileQuestion className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                          Ready for the Class Quiz?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                          Test your understanding of the concepts covered in {activeClass.classTitle}
                        </p>
                        <Button 
                          onClick={() => navigate(`/quiz/${activeClass.classId}`)}
                          size="lg"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <FileQuestion className="mr-2 h-5 w-5" />
                          Start Quiz
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {/* Navigation Footer */}
                  <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={goToPreviousSlide}
                        disabled={activeClassIndex === 0 && activeSlideIndex === 0}
                        className="flex items-center space-x-2 hover:shadow-md transition-all duration-200"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>
                      
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{activeSlideIndex + 1} of {slides.length}</span>
                      </div>
                      
                      <Button
                        onClick={goToNextSlide}
                        disabled={activeClassIndex === classes.length - 1 && activeSlideIndex === slides.length - 1}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center">
                  <BookOpen className="h-24 w-24 mx-auto text-slate-400 mb-6" />
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">No Content Available</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">This course doesn't have any content yet.</p>
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePreview;
