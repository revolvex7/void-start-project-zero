
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
  ArrowLeft
} from 'lucide-react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

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
  const [showSidebar, setShowSidebar] = useState(true);
  
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
        <div className="text-center animate-fade-in max-w-md">
          <div className="w-20 h-20 border-t-4 border-b-4 border-purple-600 border-solid rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-4">Loading your learning journey</h2>
          <p className="text-gray-600 dark:text-gray-300 mx-auto leading-relaxed">
            We're preparing an amazing learning experience just for you. This will only take a moment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
        <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center animate-fade-in">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Oops! Unable to load course
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            We encountered an issue while loading this course. Please try again or contact support if the problem persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="hover:scale-105 transition-all">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all">
              Try Again
            </Button>
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
    }
  };

  const goToPreviousSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    } else if (activeClassIndex > 0) {
      setActiveClassIndex(activeClassIndex - 1);
      setActiveSlideIndex(classes[activeClassIndex - 1].slides.length - 1);
    }
  };

  const handleClassSelect = (index: number) => {
    setActiveClassIndex(index);
    setActiveSlideIndex(0);
  };

  const handleSlideSelect = (index: number) => {
    setActiveSlideIndex(index);
  };
  
  const getSlideProgress = () => {
    if (!totalSlides) return 0;
    return ((activeSlideIndex + 1) / totalSlides) * 100;
  };

  const renderClassAccordion = (classItem: Class, classIndex: number) => (
    <AccordionItem 
      key={classItem.classId} 
      value={classItem.classId}
      className={cn(
        "border border-indigo-100/60 dark:border-indigo-700/40 rounded-lg mb-3 overflow-hidden transition-all duration-300",
        classIndex === activeClassIndex 
          ? "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/50 shadow-lg" 
          : "bg-white/90 dark:bg-indigo-950/50 hover:bg-indigo-50/70 dark:hover:bg-indigo-900/30"
      )}
    >
      <AccordionTrigger className="py-3 px-4 hover:no-underline group">
        <div className="flex items-center text-left">
          <div 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mr-3 text-sm font-medium shadow-md transition-colors",
              classIndex === activeClassIndex 
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
                : "bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-700"
            )}
          >
            {classItem.classNo}
          </div>
          <span className={cn(
            "font-medium transition-colors text-lg",
            classIndex === activeClassIndex 
              ? "text-indigo-900 dark:text-indigo-200" 
              : "text-gray-700 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
          )}>
            {classItem.classTitle}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2 pb-4 bg-white/80 dark:bg-indigo-950/80 backdrop-blur-sm">
        <ul className="space-y-1.5">
          {classItem.slides.map((slide, slideIndex) => (
            <li key={slide.id} className="animate-fade-in" style={{ animationDelay: `${slideIndex * 50}ms` }}>
              <button
                onClick={() => {
                  handleClassSelect(classIndex);
                  handleSlideSelect(slideIndex);
                }}
                className={cn(
                  "w-full flex items-center text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 hover:translate-x-1",
                  classIndex === activeClassIndex && slideIndex === activeSlideIndex
                    ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-800/70 dark:to-purple-800/70 text-indigo-900 dark:text-indigo-100 font-medium shadow-sm"
                    : "hover:bg-indigo-50/80 dark:hover:bg-indigo-800/30 text-gray-700 dark:text-gray-300",
                )}
              >
                <span className="mr-2.5 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-800/50 flex items-center justify-center text-xs text-indigo-700 dark:text-indigo-300">
                  {slide.slideNo}
                </span>
                <span className="truncate">{slide.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/80 dark:to-purple-900/80 overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 dark:bg-indigo-950/80 backdrop-blur-md py-4 px-6 sticky top-0 z-30 border-b border-indigo-100/60 dark:border-indigo-700/40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)} 
              className="rounded-full hover:bg-indigo-100/80 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300 truncate max-w-[300px] md:max-w-md animate-fade-in">
                {course.courseInfo.courseTitle}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <span className="inline-block bg-indigo-100/60 dark:bg-indigo-800/40 px-2 py-0.5 rounded text-indigo-700 dark:text-indigo-300 text-xs mr-2">Learning Journey</span> 
                {totalClasses} Classes • {slides.length} Slides in current class
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100/80 dark:hover:bg-indigo-800/60 text-indigo-700 dark:text-indigo-300 animate-fade-in"
              onClick={() => navigate(-1)}
              style={{ animationDelay: '150ms' }}
            >
              Exit Preview
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-indigo-700 dark:text-indigo-300"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto px-4 py-6 md:py-8 gap-5 md:gap-8">
        {/* Content navigation panel - can be toggled on mobile */}
        <div 
          className={cn(
            "w-80 flex-shrink-0 animate-fade-in transition-all duration-300",
            showSidebar ? "translate-x-0 opacity-100 h-auto" : "-translate-x-full opacity-0 h-0 md:translate-x-0 md:opacity-100 md:h-auto md:w-0 md:overflow-hidden"
          )} 
          style={{ animationDelay: '200ms' }}
        >
          <div className="bg-white/90 dark:bg-indigo-950/60 backdrop-blur-md rounded-2xl shadow-lg border border-indigo-100/60 dark:border-indigo-700/40 overflow-hidden sticky top-24">
            <div className="p-5 border-b border-indigo-100/60 dark:border-indigo-700/40 flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                Course Content
              </h2>
            </div>
            
            <div className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
              <Accordion 
                type="single" 
                collapsible 
                className="w-full" 
                defaultValue={activeClass?.classId}
              >
                {classes.map((classItem, classIndex) => renderClassAccordion(classItem, classIndex))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={cn(
          "flex-1 animate-fade-in transition-all duration-300",
          !showSidebar && "md:pl-0"
        )} style={{ animationDelay: '300ms' }}>
          {activeClass && activeSlide ? (
            <div className="bg-white/90 dark:bg-indigo-950/60 backdrop-blur-md rounded-2xl shadow-lg border border-indigo-100/60 dark:border-indigo-700/40 p-6 md:p-8">
              <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-4 gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-indigo-100/80 dark:bg-indigo-800/60 rounded-full text-xs font-medium text-indigo-700 dark:text-indigo-300">
                        Class {activeClass.classNo} • Slide {activeSlide.slideNo}/{slides.length}
                      </span>
                      <Progress 
                        value={getSlideProgress()} 
                        className="w-24 h-1.5 bg-indigo-100 dark:bg-indigo-900/60"
                      />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300">
                      {activeSlide.title}
                    </h2>
                  </div>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="mb-6 bg-indigo-50/80 dark:bg-indigo-900/40 p-1 rounded-xl">
                  <TabsTrigger 
                    value="content" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-800/70 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-100 rounded-lg transition-all data-[state=active]:shadow-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger 
                    value="script" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-800/70 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-100 rounded-lg transition-all data-[state=active]:shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Voice Script
                  </TabsTrigger>
                  {activeClass.faqs && activeClass.faqs.length > 0 && (
                    <TabsTrigger 
                      value="faqs" 
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-indigo-800/70 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-100 rounded-lg transition-all data-[state=active]:shadow-sm"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      FAQs
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="content" className="pt-2 pb-6 animate-fade-in focus:outline-none">
                  <div className="rounded-xl overflow-hidden border border-indigo-100/60 dark:border-indigo-700/40 bg-white/80 dark:bg-indigo-900/40 shadow-sm">
                    {activeSlide.imageUrl && (
                      <div className="transition-all duration-300 hover:scale-[1.01] transform-gpu overflow-hidden">
                        <AspectRatio ratio={16/9}>
                          <img 
                            src={activeSlide.imageUrl} 
                            alt={activeSlide.title} 
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                    )}
                    
                    <div className="p-6 md:p-8 space-y-5">
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                          {activeSlide.content}
                        </p>
                      </div>
                      
                      {activeSlide.example && (
                        <div 
                          className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/30 p-5 md:p-6 rounded-xl border-l-4 border-indigo-400 dark:border-indigo-500 animate-fade-in shadow-inner"
                          style={{ animationDelay: '400ms' }}
                        >
                          <h4 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-3 flex items-center">
                            <span className="w-6 h-6 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center mr-2 text-indigo-700 dark:text-indigo-200 text-xs font-bold">!</span>
                            Example
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {activeSlide.example}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="script" className="pt-2 pb-6 animate-fade-in focus:outline-none">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/40 dark:to-indigo-900/30 p-6 md:p-8 rounded-xl border border-purple-100/60 dark:border-purple-700/40 shadow-inner">
                    <div className="flex items-center mb-5">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center mr-4 shadow-md">
                        <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                      </div>
                      <h3 className="text-xl font-medium text-purple-800 dark:text-purple-200">Voice-over Script</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {activeSlide.voiceoverScript}
                    </p>
                  </div>
                </TabsContent>
                
                {activeClass.faqs && activeClass.faqs.length > 0 && (
                  <TabsContent value="faqs" className="pt-2 pb-6 animate-fade-in focus:outline-none">
                    <div className="space-y-4">
                      {activeClass.faqs.map((faq, index) => (
                        <div 
                          key={faq.id} 
                          className="overflow-hidden border border-indigo-100/60 dark:border-indigo-700/40 bg-white/80 dark:bg-indigo-900/40 rounded-xl shadow-sm animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={faq.id} className="border-b-0">
                              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/40 dark:to-purple-900/40 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50 transition-colors">
                                <div className="flex items-start text-left">
                                  <span className="font-medium text-indigo-900 dark:text-indigo-100">
                                    {faq.question}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 py-5 text-gray-700 dark:text-gray-300 text-lg">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
              
              <div className="flex items-center justify-between pt-4 border-t border-indigo-100/60 dark:border-indigo-700/40">
                <Button
                  variant="outline"
                  onClick={goToPreviousSlide}
                  disabled={activeClassIndex === 0 && activeSlideIndex === 0}
                  className="flex items-center space-x-2 border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100/80 dark:hover:bg-indigo-800/60 text-indigo-700 dark:text-indigo-300 transition-transform hover:translate-x-[-2px]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                
                <div className="bg-indigo-50/80 dark:bg-indigo-800/40 px-3 py-1 rounded-full hidden md:flex items-center shadow-inner">
                  <span className="text-sm text-indigo-700 dark:text-indigo-300">
                    {activeSlideIndex + 1} of {slides.length}
                  </span>
                </div>
                
                <Button
                  onClick={goToNextSlide}
                  disabled={activeClassIndex === classes.length - 1 && activeSlideIndex === slides.length - 1}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-transform hover:translate-x-[2px] hover:shadow-md"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-white/90 dark:bg-indigo-950/60 backdrop-blur-md rounded-2xl shadow-lg border border-indigo-100/60 dark:border-indigo-700/40 p-12 animate-fade-in">
              <div className="text-center max-w-md">
                <div className="mb-8">
                  <BookOpen className="h-24 w-24 mx-auto text-indigo-300 dark:text-indigo-700" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300 mb-4">No content available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  This course doesn't have any content yet. Please check back later or explore other courses.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)} 
                  className="border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100/80 dark:hover:bg-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:scale-105 transition-transform"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
