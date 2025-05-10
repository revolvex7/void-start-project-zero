
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Book, CircleDollarSign, Star, StarHalf, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import CategoryBadge from "@/components/courses/CategoryBadge";

// Dummy data for courses
const ilmeeLibraryCourses = [
  {
    id: "tl1",
    title: "Digital Transformation Strategy",
    courseCode: "DTS001",
    category: "Business Strategy",
    description: "Learn how to lead digital transformation initiatives in your organization",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=500&auto=format&fit=crop",
    featured: true
  },
  {
    id: "tl2",
    title: "AI for Business Leaders",
    courseCode: "AIB001",
    category: "Technology",
    description: "Understanding AI applications and implementation for strategic decision makers",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=500&auto=format&fit=crop",
    featured: true
  },
  {
    id: "tl3",
    title: "Data Analytics Fundamentals",
    courseCode: "DAF001",
    category: "Data Science",
    description: "Master the basics of data analysis for business intelligence",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop",
    featured: false
  },
  {
    id: "tl4",
    title: "Leadership in Digital Age",
    courseCode: "LDA001",
    category: "Leadership",
    description: "Develop leadership skills needed in today's digital business environment",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=500&auto=format&fit=crop",
    featured: false
  },
  {
    id: "tl5",
    title: "Cybersecurity for Everyone",
    courseCode: "CSE001",
    category: "Security",
    description: "Essential cybersecurity concepts every professional should know",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=500&auto=format&fit=crop",
    featured: false
  },
  {
    id: "tl6",
    title: "Project Management Excellence",
    courseCode: "PME001",
    category: "Project Management",
    description: "Master modern project management methodologies and tools",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=500&auto=format&fit=crop",
    featured: false
  }
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
    currency: "USD"
  },
  {
    id: "op2",
    title: "Workplace Violence Prevention",
    courseCode: "WVP001",
    category: "Health and Safety",
    description: "Essential training for identifying and preventing workplace violence",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=500&auto=format&fit=crop",
    provider: "ELL Training",
    price: 19.95,
    currency: "USD"
  },
  {
    id: "op3",
    title: "Microsoft Excel Advanced Techniques",
    courseCode: "MEA001",
    category: "Software Skills",
    description: "Take your Excel skills to the next level with advanced formulas and functions",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=500&auto=format&fit=crop",
    provider: "Excel Pro",
    price: 29.99,
    currency: "USD"
  },
  {
    id: "op4",
    title: "Communication Skills Master Class",
    courseCode: "CSM001",
    category: "Personal Development",
    description: "Enhance your personal and professional communication abilities",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=500&auto=format&fit=crop",
    provider: "KeySkills Training",
    price: null, // Free course
    currency: "USD"
  },
  {
    id: "op5",
    title: "Python for Data Analysis",
    courseCode: "PDA001",
    category: "Programming",
    description: "Learn how to analyze data efficiently using Python",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500&auto=format&fit=crop",
    provider: "CodeMasters",
    price: 49.99,
    currency: "USD"
  },
  {
    id: "op6",
    title: "Digital Marketing Essentials",
    courseCode: "DME001",
    category: "Marketing",
    description: "Core concepts and practices for effective digital marketing",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=500&auto=format&fit=crop",
    provider: "Marketing Pros",
    price: null, // Free course
    currency: "USD"
  }
];

// Featured collection data
const featuredCollections = [
  {
    id: "col1",
    title: "Digital Transformation",
    courses: ["tl1", "tl2", "tl4"]
  },
  {
    id: "col2",
    title: "Technical Skills",
    courses: ["tl3", "tl5", "op5"]
  },
  {
    id: "col3",
    title: "Professional Development",
    courses: ["tl6", "op4", "op6"]
  }
];

// Categories for filtering
const categories = [
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
  const filterCourses = (courses: any[]) => {
    return courses.filter(course => {
      const matchesSearch = searchQuery === "" || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(course.category);
      
      const matchesFeatured = !featuredFilter || (course.featured === true);
      
      return matchesSearch && matchesCategory && (activeTab === "otherProviders" || matchesFeatured);
    });
  };

  const filteredIlmeeLibraryCourses = filterCourses(ilmeeLibraryCourses);
  const filteredOtherProviderCourses = filterCourses(otherProviderCourses);

  const handleCourseClick = (courseId: string) => {
    navigate(`/course-store/course/${courseId}`);
  };

  const handleCollectionClick = (collectionId: string) => {
    const collection = featuredCollections.find(col => col.id === collectionId);
    if (collection) {
      // Reset current filters
      setSearchQuery('');
      setFeaturedFilter(false);
      
      // Get the categories of courses in this collection
      const collectionCourses = [
        ...ilmeeLibraryCourses.filter(course => collection.courses.includes(course.id)),
        ...otherProviderCourses.filter(course => collection.courses.includes(course.id))
      ];
      
      const collectionCategories = [...new Set(collectionCourses.map(course => course.category))];
      setSelectedCategories(collectionCategories);
      
      // If collection has courses from other providers, switch to that tab if necessary
      const hasOtherProviders = collection.courses.some(id => id.startsWith('op'));
      if (hasOtherProviders && activeTab !== "otherProviders") {
        setActiveTab("ilmeeLibrary"); // We'll stay on IlmeeLibrary tab by default
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Store</h1>
        <p className="text-muted-foreground">
          Discover and access professional learning content from our library and trusted partners
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-card border rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            {activeTab === "ilmeeLibrary" && (
              <Button 
                variant={featuredFilter ? "default" : "outline"} 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setFeaturedFilter(!featuredFilter)}
              >
                <Star className="h-4 w-4" />
                <span>Featured</span>
              </Button>
            )}

            {(selectedCategories.length > 0 || searchQuery || featuredFilter) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Categories</h3>
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
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg p-4 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            {activeTab === "ilmeeLibrary" 
              ? "IlmeeLibrary™ offers high-quality courses curated and created by our team. Access requires a subscription."
              : "Other providers offer courses from third-party content creators. Pricing varies by provider."
            }
          </p>
        </div>
        <Button variant="link" size="sm" className="text-blue-700 dark:text-blue-400">
          How it works
        </Button>
      </div>

      <Tabs defaultValue="ilmeeLibrary" value={activeTab} className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-background border overflow-hidden rounded-lg p-1 h-auto">
          <TabsTrigger 
            value="ilmeeLibrary" 
            className="text-sm md:text-base py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            IlmeeLibrary™
          </TabsTrigger>
          <TabsTrigger 
            value="otherProviders" 
            className="text-sm md:text-base py-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Other providers
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ilmeeLibrary" className="space-y-8">
          {/* Featured Collection */}
          {!searchQuery && selectedCategories.length === 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Featured Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredCollections.map(collection => (
                  <Card 
                    key={collection.id} 
                    className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-indigo-900/10 border-none bg-gradient-to-b from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 cursor-pointer"
                    onClick={() => handleCollectionClick(collection.id)}
                  >
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                      <CardTitle className="text-lg">{collection.title}</CardTitle>
                      <CardDescription className="text-indigo-100">
                        {collection.courses.length} courses
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {collection.courses.slice(0, 3).map(courseId => {
                          const course = ilmeeLibraryCourses.find(c => c.id === courseId) || 
                                       otherProviderCourses.find(c => c.id === courseId);
                          return course ? (
                            <li key={courseId} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span>{course.title}</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 ml-auto">
                        View all
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredIlmeeLibraryCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIlmeeLibraryCourses.map(course => (
                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border bg-card" onClick={() => handleCourseClick(course.id)}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {course.featured && (
                      <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {course.courseCode} | {course.category}
                        </CardDescription>
                      </div>
                      <div className="flex">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <StarHalf className="h-4 w-4 text-amber-500 fill-amber-500" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-4">{course.description}</p>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between">
                    <Badge variant="secondary" className="text-xs font-normal">
                      IlmeeLibrary™
                    </Badge>
                    <Button size="sm" className="ml-auto">
                      Get this course
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-2">No courses match your filters</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="otherProviders" className="space-y-8">
          {filteredOtherProviderCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOtherProviderCourses.map(course => (
                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border bg-card" onClick={() => handleCourseClick(course.id)}>
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
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {course.courseCode} | {course.category}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-4">{course.description}</p>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div className="flex items-center">
                      <CircleDollarSign className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                      <span className="font-medium">
                        {course.price ? `${course.price.toFixed(2)} ${course.currency}` : 'Free'}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className={course.price ? "bg-green-600 hover:bg-green-700" : ""}
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
            <div className="text-center py-16 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-2">No courses match your filters</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseStore;
