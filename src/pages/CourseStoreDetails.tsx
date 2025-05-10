
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, Book, CircleDollarSign, Star, StarHalf, Info, FileText } from "lucide-react";

// Reusing the dummy data from CourseStore
const ilmeeLibraryCourses = [
  {
    id: "tl1",
    title: "Digital Transformation Strategy",
    courseCode: "DTS001",
    category: "Business Strategy",
    description: "Learn how to lead digital transformation initiatives in your organization",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=500&auto=format&fit=crop",
    featured: true,
    longDescription: `Do you ever feel the business world is rapidly changing around you? Digital transformation is revolutionizing how companies operate and compete.

This comprehensive course provides business leaders with the knowledge and tools to successfully implement digital transformation strategies. From understanding the latest technologies to managing organizational change, you'll learn how to guide your company through digital evolution.

Learn how to:
• Assess your organization's digital readiness
• Develop a comprehensive digital transformation roadmap
• Implement emerging technologies effectively
• Manage change and overcome resistance
• Measure the success of digital initiatives`,
    duration: "8 hours",
    modules: [
      "Understanding Digital Transformation",
      "Assessing Your Digital Readiness",
      "Creating a Digital Strategy",
      "Implementation and Change Management",
      "Measuring Success and Continuous Improvement"
    ],
    provider: "IlmeeLibrary™"
  },
  // Additional courses would be listed here
];

const otherProviderCourses = [
  {
    id: "op1",
    title: "Adobe Acrobat DC Essentials",
    courseCode: "ADE001",
    category: "Software Skills",
    description: "Master PDF editing and management with Adobe Acrobat DC",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=500&auto=format&fit=crop",
    provider: "Bigger Brains",
    price: 40.00,
    currency: "USD",
    longDescription: `Have you ever been frustrated trying to work with PDF documents? This Adobe Acrobat DC Essentials course, taught by 25-year IT veteran Chip Reaves, will help beginners and experts get more from the latest version of the Adobe Acrobat solutions.

In this course from Bigger Brains, you will learn to use Adobe Acrobat Pro DC to convert documents to PDF files, search within PDF documents, edit and markup PDF documents, and convert and optimize PDF files.

Learn how to:
• Convert documents to PDF from within Acrobat
• Convert documents to PDF using the Print command
• Create and use multiple PDF conversion presets
• Create PDFs from websites
• Find text in PDF documents
• Add text to a PDF document
• Add comments, stamps, highlights, and markup
• Merge multiple documents
• Extract pages from a PDF document`,
    duration: "3.5 hours",
    modules: [
      "Introduction to Adobe Acrobat DC",
      "Creating PDF Documents",
      "Editing PDF Documents",
      "PDF Document Management",
      "PDF Security Features"
    ]
  },
  // Additional courses would be listed here
];

// Combine the courses for easy lookup
const allCourses = [...ilmeeLibraryCourses, ...otherProviderCourses];

const CourseStoreDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Find the course based on the ID
  const course = allCourses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold mb-4">Course Not Found</h1>
        <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/course-store')}>
          Return to Course Store
        </Button>
      </div>
    );
  }
  
  const isIlmeeLibrary = course.id.startsWith('tl');
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back navigation */}
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 flex items-center group"
        onClick={() => navigate('/course-store')}
      >
        <ChevronLeft className="mr-1 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Back to Course Store
      </Button>
      
      {/* Course breadcrumb */}
      <div className="text-sm text-muted-foreground mb-4 flex items-center">
        <span>{course.category}</span>
        <span className="mx-2">•</span>
        <Badge variant={isIlmeeLibrary ? "default" : "secondary"} className="font-normal">
          {isIlmeeLibrary ? "IlmeeLibrary™" : course.provider}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <div className="flex items-center mb-6">
            <div className="flex mr-4">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <StarHalf className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="ml-2 text-sm font-medium">4.5</span>
            </div>
            <span className="text-sm text-muted-foreground">{course.courseCode}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{course.duration}</span>
          </div>
          
          <div className="mb-8 rounded-xl overflow-hidden shadow-md">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-[300px] object-cover"
            />
          </div>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="w-full mb-6 bg-background border-b rounded-none h-auto">
              <TabsTrigger value="overview" className="text-sm md:text-base py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Overview</TabsTrigger>
              <TabsTrigger value="content" className="text-sm md:text-base py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Content</TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm md:text-base py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-2">
              <div className="prose dark:prose-invert max-w-none">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <div className="whitespace-pre-line">{course.longDescription}</div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="pt-2">
              <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-all border bg-card">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{module}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-2">
              <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Reviews will be available after the course is published.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Call to action card */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className={`p-6 ${isIlmeeLibrary ? 
              "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50" : 
              "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50"}`}>
              <div className="mb-6">
                {isIlmeeLibrary ? (
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium">IlmeeLibrary™ Course</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium">
                      {'price' in course && course.price !== null && course.price !== undefined
                        ? `${course.price.toFixed(2)} ${('currency' in course) ? course.currency : 'USD'}` 
                        : 'Free Course'}
                    </span>
                  </div>
                )}
              </div>
              
              <Button 
                className={`w-full mb-4 ${!isIlmeeLibrary && 'price' in course && course.price ? "bg-green-600 hover:bg-green-700" : ""}`} 
                size="lg"
                onClick={() => isIlmeeLibrary ? navigate('/subscription') : undefined}
              >
                {isIlmeeLibrary ? 'Get this course' 
                  : ('price' in course && course.price !== null && course.price !== undefined) ? 'Buy licenses' : 'Get for free'}
              </Button>
              
              {!isIlmeeLibrary && (
                <Button variant="outline" className="w-full">
                  Add to wishlist
                </Button>
              )}
            </div>
            
            <CardContent className="p-6 bg-card">
              <h3 className="font-semibold mb-3">This course includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span>Full lifetime access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Book className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span>{course.duration} of content</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Info card */}
          <Card className="overflow-hidden border bg-card shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">About the provider</h3>
                  <p className="text-sm text-muted-foreground">
                    {isIlmeeLibrary ? 
                      "IlmeeLibrary™ courses are created by our expert instructional designers and subject matter experts." : 
                      `${course.provider} is a trusted third-party content provider specializing in professional development courses.`
                    }
                  </p>
                </div>
              </div>
              
              {isIlmeeLibrary && (
                <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Access IlmeeLibrary™ to get this and hundreds of other courses.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-blue-700 dark:text-blue-400 p-0 h-auto text-sm mt-2"
                    onClick={() => navigate('/subscription')}
                  >
                    View subscription plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseStoreDetails;
