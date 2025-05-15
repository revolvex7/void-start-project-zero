
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  ChevronLeft, 
  ChevronRight, 
  Book, 
  Layout, 
  List, 
  MessageCircle, 
  Clock,
  FileText,
  CheckCircle,
  ChevronDown,
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
      toast.error('Failed to load course preview', {
        description: 'Please try again later or contact support.'
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Loading course preview...</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we prepare your course content.</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Failed to load course
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We couldn't load the course preview. Please try again later or contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/courses')} 
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-[300px] md:max-w-md">
                {course.courseInfo.courseTitle}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Course Preview • {totalClasses} Classes • {totalClasses * totalSlides} Slides
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => navigate(-1)}
            >
              Exit Preview
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Course Content</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {classes.map((classItem, classIndex) => (
                <AccordionItem 
                  key={classItem.classId} 
                  value={classItem.classId}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    classIndex === activeClassIndex ? "bg-purple-50 dark:bg-purple-900/20 rounded-md" : ""
                  }`}
                >
                  <AccordionTrigger className="py-3 px-2 hover:no-underline">
                    <div className="flex items-center text-left">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-medium ${
                          classIndex === activeClassIndex 
                            ? "bg-purple-600 text-white" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {classItem.classNo}
                      </div>
                      <span className={`font-medium ${
                        classIndex === activeClassIndex 
                          ? "text-purple-700 dark:text-purple-400" 
                          : "text-gray-700 dark:text-gray-300"
                      } truncate max-w-[180px]`}>
                        {classItem.classTitle}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-11 pr-2">
                    <ul className="space-y-2 py-1">
                      {classItem.slides.map((slide, slideIndex) => (
                        <li key={slide.id}>
                          <button
                            onClick={() => {
                              handleClassSelect(classIndex);
                              handleSlideSelect(slideIndex);
                            }}
                            className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm ${
                              classIndex === activeClassIndex && slideIndex === activeSlideIndex
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            <span className="mr-2 min-w-5 text-xs">{slide.slideNo}.</span>
                            <span className="truncate">{slide.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
          {activeClass && activeSlide ? (
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Class {activeClass.classNo} • Slide {activeSlide.slideNo} of {slides.length}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {activeSlide.title}
                  </h2>
                </div>
                <div className="hidden md:block">
                  <Progress 
                    value={((activeSlideIndex + 1) / slides.length) * 100} 
                    className="w-32 h-2 bg-gray-200 dark:bg-gray-700"
                  />
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="mb-6">
                  <TabsTrigger value="content" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400">
                    <FileText className="w-4 h-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="script" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Voice Script
                  </TabsTrigger>
                  {activeClass.faqs && activeClass.faqs.length > 0 && (
                    <TabsTrigger value="faqs" className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400">
                      <Info className="w-4 h-4 mr-2" />
                      FAQs
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="content" className="pt-2 pb-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      {activeSlide.imageUrl && (
                        <div className="mb-6">
                          <img 
                            src={activeSlide.imageUrl} 
                            alt={activeSlide.title} 
                            className="w-full h-auto rounded-lg object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {activeSlide.content}
                        </p>
                        
                        {activeSlide.example && (
                          <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                            <h4 className="text-lg font-medium text-purple-700 dark:text-purple-400 mb-2">
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
                
                <TabsContent value="script" className="pt-2 pb-6">
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                        <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Voice-over Script</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {activeSlide.voiceoverScript}
                    </p>
                  </div>
                </TabsContent>
                
                {activeClass.faqs && activeClass.faqs.length > 0 && (
                  <TabsContent value="faqs" className="pt-2 pb-6">
                    <div className="space-y-4">
                      {activeClass.faqs.map((faq, index) => (
                        <Card key={faq.id} className="overflow-hidden">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={faq.id} className="border-b-0">
                              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <div className="flex items-start text-left">
                                  <span className="font-medium text-gray-900 dark:text-white">
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
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={goToPreviousSlide}
                  disabled={activeClassIndex === 0 && activeSlideIndex === 0}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                <div className="hidden md:flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activeSlideIndex + 1} of {slides.length}
                  </span>
                </div>
                
                <Button
                  onClick={goToNextSlide}
                  disabled={activeClassIndex === classes.length - 1 && activeSlideIndex === slides.length - 1}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <Book className="h-16 w-16 mx-auto text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No content available</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  This course doesn't have any content yet. Please check back later.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursePreview;
