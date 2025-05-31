import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, ShoppingCart, Star, Clock, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseStoreService } from "@/services/courseStoreService";
import { LoadingState } from "@/components/LoadingState";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  rating: number;
  duration: string;
  instructor: string;
  enrollmentCount: number;
}

const CourseStore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courseStore'],
    queryFn: courseStoreService.getAllCourses,
  });

  const categories = [...new Set(courses?.map(course => course.instructor))];

  const filteredCourses = courses?.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower)
    );
  }).filter(course => activeTab === "all" || course.instructor === activeTab);

  if (error) {
    toast.error("Failed to fetch courses", {
      description: error.message || "An unknown error occurred"
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Course Store
              </h1>
              <p className="text-gray-600 mt-1">Explore available courses</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200">
              <ShoppingCart className="mr-2 h-4 w-4" /> View Cart
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4">
              <TabsList className="h-12 p-1 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
                <TabsTrigger
                  value="all"
                  className="rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  All Courses
                </TabsTrigger>
                {categories?.map(category => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search courses by title, description, or instructor..."
                    className="pl-10 h-12 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-gray-50 focus:bg-white transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-12 w-12 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all duration-200">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="bg-white rounded-xl border border-gray-100">
                    <LoadingState
                      message="Loading courses"
                      variant="spinner"
                      className="py-16"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses?.map(course => (
                      <Card key={course.id} className="h-full">
                        <CardHeader>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription>{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <img src={course.imageUrl} alt={course.title} className="rounded-md mb-4" />
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{course.instructor}</Badge>
                            <div className="flex items-center">
                              <Star className="mr-1 h-4 w-4 text-yellow-500" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{course.enrollmentCount} enrolled</span>
                          </div>
                          <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200">
                            Add to Cart - ${course.price}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {categories?.map(category => (
                <TabsContent key={category} value={category} className="mt-0">
                  {isLoading ? (
                    <div className="bg-white rounded-xl border border-gray-100">
                      <LoadingState
                        message={`Loading ${category} courses`}
                        variant="spinner"
                        className="py-16"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses?.map(course => (
                        <Card key={course.id} className="h-full">
                          <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <img src={course.imageUrl} alt={course.title} className="rounded-md mb-4" />
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">{course.instructor}</Badge>
                              <div className="flex items-center">
                                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                <span>{course.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col items-start">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{course.duration}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{course.enrollmentCount} enrolled</span>
                            </div>
                            <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200">
                              Add to Cart - ${course.price}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CourseStore;
