
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Book, 
  MessageCircle, 
  FileText,
  Info,
  ArrowLeft
} from 'lucide-react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-2">Loading your course</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Please wait while we prepare an amazing learning experience for you...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
        <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center animate-fade-in">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            Oops! We couldn't load the course
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're having trouble loading this course. Please try again or contact support if the problem persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)} className="hover:scale-105 transition-transform">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-transform">
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
  
  const renderClassAccordion = (classItem: Class, classIndex: number) => (
    <AccordionItem 
      key={classItem.classId} 
      value={classItem.classId}
      className={cn(
        "border border-purple-100 dark:border-purple-800/40 rounded-lg mb-2 overflow-hidden transition-all duration-300",
        classIndex === activeClassIndex 
          ? "bg-purple-100/70 dark:bg-purple-900/40 shadow-md" 
          : "bg-white/80 dark:bg-gray-800/60 hover:bg-purple-50 dark:hover:bg-purple-900/20"
      )}
    >
      <AccordionTrigger className="py-3 px-3 hover:no-underline group">
        <div className="flex items-center text-left">
          <div 
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium shadow-sm transition-colors",
              classIndex === activeClassIndex 
                ? "bg-purple-600 text-white" 
                : "bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200 group-hover:bg-purple-300 dark:group-hover:bg-purple-700"
            )}
          >
            {classItem.classNo}
          </div>
          <span className={cn(
            "font-medium transition-colors",
            classIndex === activeClassIndex 
              ? "text-purple-900 dark:text-purple-200" 
              : "text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-300"
          )}>
            {classItem.classTitle}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2 pb-3 bg-white/50 dark:bg-gray-800/50">
        <ul className="space-y-1">
          {classItem.slides.map((slide, slideIndex) => (
            <li key={slide.id} className="animate-fade-in" style={{ animationDelay: `${slideIndex * 50}ms` }}>
              <button
                onClick={() => {
                  handleClassSelect(classIndex);
                  handleSlideSelect(slideIndex);
                }}
                className={cn(
                  "w-full flex items-center text-left px-3 py-2 rounded-md text-sm transition-all duration-200",
                  classIndex === activeClassIndex && slideIndex === activeSlideIndex
                    ? "bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-100 font-medium"
                    : "hover:bg-purple-100 dark:hover:bg-purple-800/50 text-gray-700 dark:text-gray-300",
                  "transform hover:translate-x-1"
                )}
              >
                <span className="mr-2 min-w-5 text-xs opacity-70">{slide.slideNo}.</span>
                <span className="truncate">{slide.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-purple-100 dark:border-purple-900/40 py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)} 
              className="hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100 truncate max-w-[300px] md:max-w-md animate-fade-in">
                {course.courseInfo.courseTitle}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '100ms' }}>
                Learning Journey • {totalClasses} Classes • {slides.length} Slides in current class
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 animate-fade-in"
              onClick={() => navigate(-1)}
              style={{ animationDelay: '150ms' }}
            >
              Exit Preview
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-6 gap-6">
        {/* Content navigation panel */}
        <div className="w-full md:w-80 flex-shrink-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-purple-100 dark:border-purple-800/40 overflow-hidden">
            <div className="p-4 border-b border-purple-100 dark:border-purple-800/40">
              <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100 flex items-center">
                <Book className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Course Content
              </h2>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <Accordion type="single" collapsible className="w-full" defaultValue={activeClass?.classId}>
                {classes.map((classItem, classIndex) => renderClassAccordion(classItem, classIndex))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 animate-fade-in" style={{ animationDelay: '300ms' }}>
          {activeClass && activeSlide ? (
            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-purple-100 dark:border-purple-800/40 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Class {activeClass.classNo} • Slide {activeSlide.slideNo} of {slides.length}
                  </span>
                  <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                    {activeSlide.title}
                  </h2>
                </div>
                <div className="hidden md:block">
                  <Progress 
                    value={((activeSlideIndex + 1) / slides.length) * 100} 
                    className="w-32 h-2 bg-purple-100 dark:bg-purple-900"
                  />
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="mb-6 bg-purple-100/70 dark:bg-purple-900/40">
                  <TabsTrigger 
                    value="content" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger 
                    value="script" 
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Voice Script
                  </TabsTrigger>
                  {activeClass.faqs && activeClass.faqs.length > 0 && (
                    <TabsTrigger 
                      value="faqs" 
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 transition-all"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      FAQs
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="content" className="pt-2 pb-6 animate-fade-in">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="rounded-lg overflow-hidden border border-purple-100 dark:border-purple-800/40 bg-white/60 dark:bg-gray-800/60 shadow-sm">
                      {activeSlide.imageUrl && (
                        <div className="transition-all duration-300 hover:scale-[1.02] transform-gpu mb-6">
                          <img 
                            src={activeSlide.imageUrl} 
                            alt={activeSlide.title} 
                            className="w-full h-auto object-cover rounded-t-lg"
                          />
                        </div>
                      )}
                      
                      <div className="p-6 space-y-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {activeSlide.content}
                        </p>
                        
                        {activeSlide.example && (
                          <div 
                            className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/40 dark:to-blue-900/30 p-5 rounded-lg border-l-4 border-purple-400 dark:border-purple-500 animate-fade-in"
                            style={{ animationDelay: '400ms' }}
                          >
                            <h4 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                              <span className="w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center mr-2 text-purple-700 dark:text-purple-200 text-xs font-bold">!</span>
                              Example
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300">
                              {activeSlide.example}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="script" className="pt-2 pb-6 animate-fade-in">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-lg border border-blue-100 dark:border-blue-900/40 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mr-3 shadow-sm">
                        <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">Voice-over Script</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {activeSlide.voiceoverScript}
                    </p>
                  </div>
                </TabsContent>
                
                {activeClass.faqs && activeClass.faqs.length > 0 && (
                  <TabsContent value="faqs" className="pt-2 pb-6 animate-fade-in">
                    <div className="space-y-4">
                      {activeClass.faqs.map((faq, index) => (
                        <Card 
                          key={faq.id} 
                          className="overflow-hidden border-purple-100 dark:border-purple-800/40 bg-white/60 dark:bg-gray-800/60"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={faq.id} className="border-b-0">
                              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-colors">
                                <div className="flex items-start text-left">
                                  <span className="font-medium text-purple-900 dark:text-purple-100">
                                    {faq.question}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
              
              <div className="flex items-center justify-between pt-4 border-t border-purple-100 dark:border-purple-800/40">
                <Button
                  variant="outline"
                  onClick={goToPreviousSlide}
                  disabled={activeClassIndex === 0 && activeSlideIndex === 0}
                  className="flex items-center space-x-2 border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 transition-transform hover:translate-x-[-2px]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                <div className="hidden md:flex items-center bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                  <span className="text-sm text-purple-700 dark:text-purple-300">
                    {activeSlideIndex + 1} of {slides.length}
                  </span>
                </div>
                
                <Button
                  onClick={goToNextSlide}
                  disabled={activeClassIndex === classes.length - 1 && activeSlideIndex === slides.length - 1}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition-transform hover:translate-x-[2px]"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm border border-purple-100 dark:border-purple-800/40 p-12 animate-fade-in">
              <div className="text-center">
                <div className="mb-6">
                  <Book className="h-20 w-20 mx-auto text-purple-300 dark:text-purple-700" />
                </div>
                <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3">No content available</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  This course doesn't have any content yet. Please check back later.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)} 
                  className="mt-6 border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/40"
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
