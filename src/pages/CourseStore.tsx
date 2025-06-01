import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Book, CircleDollarSign, Star, StarHalf, Search, SlidersHorizontal, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import CategoryBadge from "@/components/courses/CategoryBadge";
import { toast } from 'sonner';
import { courseStoreService } from '@/services/courseStoreService';
import { LoadingState } from '@/components/LoadingState';

// Types for API response
interface CourseStoreData {
  ilmeeLibrary: IlmeeLibraryCourse[];
  otherProviders: OtherProviderCourse[];
}

interface IlmeeLibraryCourse {
  id: string;
  courseTitle: string;
  courseCode: string;
  categoryName: string;
  description: string;
  image: string;
  isFeatured: boolean;
  avgrating?: string;
  // Additional properties as needed
}

interface OtherProviderCourse {
  id: string;
  courseTitle: string;
  courseCode: string;
  categoryName: string;
  description: string;
  image: string;
  price: string;
  providerName: string;
  avgrating?: string;
  // Additional properties as needed
}

// Type guard functions to check course types
const isIlmeeLibraryCourse = (course: IlmeeLibraryCourse | OtherProviderCourse): course is IlmeeLibraryCourse => {
  return 'isFeatured' in course;
};

const isOtherProviderCourse = (course: IlmeeLibraryCourse | OtherProviderCourse): course is OtherProviderCourse => {
  return 'providerName' in course && 'price' in course;
};

// Categories for filtering (will be dynamically populated)
const initialCategories = [
  "Business Strategy",
  "Technology",
  "Data Science",
  "Leadership",
  "Security",
  "Project Management",
  "Software Skills",
  "Health and Safety",
  "Programming",
  "Marketing",
  "Personal Development"
];

const CourseStore = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ilmeeLibrary");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseStoreData>({
    ilmeeLibrary: [],
    otherProviders: []
  });
  const [categories, setCategories] = useState<string[]>(initialCategories);

  // Fetch course data on component mount
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await courseStoreService.fetchCourseStore();
        console.log('Course store data:', response);
        
        if (response && response.data) {
          setCourseData({
            ilmeeLibrary: response.data.ilmeeLibrary || [],
            otherProviders: response.data.otherProviders || []
          });
          
          // Extract categories from all courses
          const allCourses = [...(response.data.ilmeeLibrary || []), ...(response.data.otherProviders || [])];
          const uniqueCategories = [...new Set(allCourses.map(course => course.categoryName))].filter(Boolean);
          
          // Only update categories if we have some from the API
          if (uniqueCategories.length > 0) {
            setCategories(uniqueCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Failed to load course data. Please try again later.');
        toast.error('Failed to load course data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, []);

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setFeaturedFilter(false);
  };

  // Filter courses based on search query and categories
  const filterCourses = (courses: IlmeeLibraryCourse[] | OtherProviderCourse[]) => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === "" || 
        course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(course.categoryName);
      
      // For IlmeeLibrary courses, check featured flag if filter is active
      let matchesFeatured = true;
      if (featuredFilter && activeTab === "ilmeeLibrary") {
        matchesFeatured = isIlmeeLibraryCourse(course) && course.isFeatured === true;
      }
      
      return matchesSearch && matchesCategory && matchesFeatured;
    });
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course-store/course/${courseId}`);
  };

  // Transform API data to the structure expected by the UI
  const transformedIlmeeLibraryCourses = filterCourses(courseData.ilmeeLibrary).map(course => {
    // We know this is an IlmeeLibraryCourse because it comes from ilmeeLibrary array
    const ilmeeCourse = course as IlmeeLibraryCourse;
    return {
      id: ilmeeCourse.id,
      title: ilmeeCourse.courseTitle,
      courseCode: ilmeeCourse.courseCode,
      category: ilmeeCourse.categoryName,
      description: ilmeeCourse.description,
      image: ilmeeCourse.image,
      featured: ilmeeCourse.isFeatured,
      rating: ilmeeCourse.avgrating || "4.5"
    };
  });

  const transformedOtherProviderCourses = filterCourses(courseData.otherProviders).map(course => {
    // We know this is an OtherProviderCourse because it comes from otherProviders array
    const otherCourse = course as OtherProviderCourse;
    return {
      id: otherCourse.id,
      title: otherCourse.courseTitle,
      courseCode: otherCourse.courseCode,
      category: otherCourse.categoryName,
      description: otherCourse.description,
      image: otherCourse.image,
      provider: otherCourse.providerName || "External Provider",
      price: parseFloat(otherCourse.price) || null,
      currency: "USD",
      rating: otherCourse.avgrating || "4.0"
    };
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Consistent with loaded state */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Course Store</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Discover and access professional learning content from our library and trusted partners</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center animate-pulse">
              <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Main Content with Loading State */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Loading Search and Filter Section */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full md:w-96 h-10 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="w-24 h-8 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
                  <div className="w-28 h-8 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-20 h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-16 h-6 bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading Tabs Skeleton */}
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-32 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg animate-pulse"></div>
              <div className="h-12 w-32 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
            </div>
          </div>

          <div className="p-6">
            <LoadingState 
              message="Loading course store" 
              variant="spinner"
              className="py-16"
              statusMessage="Fetching courses from our library and partner providers..."
            />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Consistent */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Course Store</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Discover and access professional learning content from our library and trusted partners</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try Again
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Store className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Course Store</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-4">
              We encountered an issue while fetching courses from our store. Please check your connection and try again.
            </p>
            <p className="text-red-500 text-sm">{error}</p>
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
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Course Store</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Discover and access professional learning content from our library and trusted partners</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search courses..."
                className="pl-10 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-blue-900/20 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              {activeTab === "ilmeeLibrary" && (
                <Button 
                  variant={featuredFilter ? "default" : "outline"} 
                  size="sm" 
                  className={featuredFilter 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg" 
                    : "border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20"
                  }
                  onClick={() => setFeaturedFilter(!featuredFilter)}
                >
                  <Star className="h-4 w-4 mr-1" />
                  <span>Featured</span>
                </Button>
              )}

              {(selectedCategories.length > 0 || searchQuery || featuredFilter) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}

              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <CategoryBadge 
                  key={category} 
                  category={category}
                  isSelected={selectedCategories.includes(category)}
                  onClick={() => toggleCategory(category)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Help Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-100 dark:border-blue-900/50 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {activeTab === "ilmeeLibrary" 
                ? "IlmeeLibrary™ offers high-quality courses curated and created by our team. Access requires a subscription."
                : "Other providers offer courses from third-party content creators. Pricing varies by provider."
              }
            </p>
          </div>
          <Button 
            variant="link" 
            size="sm" 
            className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            How it works
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ilmeeLibrary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-5">
            <TabsList className="h-12 p-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-600 shadow-sm rounded-xl">
              <TabsTrigger 
                value="ilmeeLibrary" 
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
              >
                <Book className="mr-2 h-4 w-4" />
                IlmeeLibrary™
              </TabsTrigger>
              <TabsTrigger 
                value="otherProviders" 
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
              >
                <Store className="mr-2 h-4 w-4" />
                Other providers
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="ilmeeLibrary" className="mt-0">
              {transformedIlmeeLibraryCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transformedIlmeeLibraryCourses.map(course => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600" onClick={() => handleCourseClick(course.id)}>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {course.featured && (
                          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {course.title}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {course.courseCode} | {course.category}
                            </CardDescription>
                          </div>
                          <div className="flex ml-2">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <StarHalf className="h-4 w-4 text-amber-500 fill-amber-500" />
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm line-clamp-2 mb-4 text-slate-600 dark:text-slate-300">{course.description}</p>
                      </CardContent>
                      
                      <CardFooter className="pt-0 flex justify-between">
                        <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          IlmeeLibrary™
                        </Badge>
                        <Button 
                          size="sm" 
                          className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Get this course
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <Book className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-2">No courses match your filters</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="border-slate-200 dark:border-slate-600"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="otherProviders" className="mt-0">
              {transformedOtherProviderCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transformedOtherProviderCourses.map(course => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-green-300 dark:hover:border-green-600" onClick={() => handleCourseClick(course.id)}>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-3">
                          <span className="text-xs font-medium text-white">
                            Provider: {course.provider}
                          </span>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                              {course.title}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {course.courseCode} | {course.category}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-sm line-clamp-2 mb-4 text-slate-600 dark:text-slate-300">{course.description}</p>
                      </CardContent>
                      
                      <CardFooter className="pt-0 flex justify-between items-center">
                        <div className="flex items-center">
                          <CircleDollarSign className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {course.price ? `${course.price.toFixed(2)} ${course.currency}` : 'Free'}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          className={course.price 
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/course-store/course/${course.id}`);
                          }}
                        >
                          {course.price ? 'Buy licenses' : 'Get for free'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <Store className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-2">No courses match your filters</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="border-slate-200 dark:border-slate-600"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseStore;
