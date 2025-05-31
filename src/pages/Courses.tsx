import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Grid2X2, 
  List, 
  ArrowUpDown, 
  Eye,
  Pencil,
  Trash2, 
  Book,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

import api from '@/services/api';
import { LoadingState } from '@/components/LoadingState';
import { courseService, Course } from '@/services/courseService';
import { CreateCourseModal } from '@/components/courses/CreateCourseModal';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Course>("courseTitle");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: courses, isLoading: coursesLoading, error: coursesError, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getCourses,
    meta: {
      onError: () => {
        toast.error('Failed to fetch courses. Please try again later.');
      }
    }
  });

  const uniqueCategories = React.useMemo(() => {
    if (!courses) return [];
    const uniqueCats = new Set<string>();
    courses.forEach((course) => {
      if (course.categoryName) {
        uniqueCats.add(course.categoryName);
      }
    });
    return Array.from(uniqueCats);
  }, [courses]);

  const filteredAndSortedCourses = React.useMemo(() => {
    if (!courses) return [];
    
    let filtered = courses.filter((course) => 
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.courseCode && course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.categoryName && course.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (activeTab !== "all") {
      filtered = filtered.filter((course) => 
        course.categoryName && course.categoryName.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    return [...filtered].sort((a, b) => {
      if (sortBy === "courseTitle" || sortBy === "courseCode" || sortBy === "categoryName") {
        const aValue = a[sortBy] || "";
        const bValue = b[sortBy] || "";
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue.toString()) 
          : bValue.toString().localeCompare(aValue.toString());
      } else if (sortBy === "price") {
        const aValue = a.price !== undefined ? Number(a.price) || 0 : 0;
        const bValue = b.price !== undefined ? Number(b.price) || 0 : 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortBy === "updatedAt") {
        return sortDirection === "asc" 
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return 0;
    });
  }, [courses, searchTerm, activeTab, sortBy, sortDirection]);

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const handleSort = (column: keyof Course) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };
  
  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/course/${courseId}/edit?isEdit=true`);
  };

  const openDeleteDialog = (courseId: string) => {
    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    try {
      await courseService.deleteCourse(courseToDelete);
      toast.success("Course deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete course", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };
  
  const isLoading = coursesLoading;
  
  const formatPrice = (price?: number | string) => {
    if (price === undefined) return "-";
    const numericPrice = typeof price === 'string' ? Number(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericPrice);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
            <LoadingState 
              message="Loading courses" 
              variant="spinner"
              className="py-20"
            />
          </div>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8 text-center">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Courses
            </h1>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Courses</h2>
              <p className="text-slate-700 dark:text-slate-300">
                We couldn't load your courses. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Create and manage your educational content</p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-700/80 px-6 py-4">
              <TabsList className="h-12 p-1 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl shadow-md border border-slate-200/50 dark:border-slate-600/50">
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <Book className="mr-2 h-4 w-4" />
                  All Courses
                </TabsTrigger>
                {uniqueCategories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category.toLowerCase()} 
                    className="rounded-lg px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    placeholder="Search courses by title, code, or category..."
                    className="pl-10 h-12 border-slate-200 dark:border-slate-600 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-slate-50/50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-700 backdrop-blur-sm transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={toggleViewMode}
                        className="h-12 w-12 border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
                      >
                        {viewMode === "grid" ? (
                          <List className="h-4 w-4" />
                        ) : (
                          <Grid2X2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle {viewMode === "grid" ? "list" : "grid"} view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Content for all tabs */}
              <TabsContent value="all" className="mt-0">
                {renderCourseContent()}
              </TabsContent>

              {uniqueCategories.map((category) => (
                <TabsContent key={category} value={category.toLowerCase()} className="mt-0">
                  {renderCourseContent()}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this course?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the course and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteCourse} 
                className="bg-red-500 text-white hover:bg-red-600 rounded-lg"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <CreateCourseModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
          onCourseCreated={refetch}
        />
      </div>
    </div>
  );

  function renderCourseContent() {
    if (isLoading) {
      return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <LoadingState 
            message="Loading courses" 
            variant="spinner"
            className="py-16"
          />
        </div>
      );
    }

    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-lg">
        {viewMode === "list" ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-700/50">
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("courseTitle")}
                    className="font-medium flex items-center gap-1 px-0 hover:bg-transparent text-slate-700 dark:text-slate-300"
                  >
                    Course Name
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("courseCode")}
                    className="font-medium flex items-center gap-1 px-0 hover:bg-transparent text-slate-700 dark:text-slate-300"
                  >
                    Course Code
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("categoryName")}
                    className="font-medium flex items-center gap-1 px-0 hover:bg-transparent text-slate-700 dark:text-slate-300"
                  >
                    Category
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort("updatedAt")}
                    className="font-medium flex items-center gap-1 px-0 hover:bg-transparent text-slate-700 dark:text-slate-300"
                  >
                    Updated On
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </Button>
                </TableHead>
                <TableHead className="text-right text-slate-700 dark:text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-slate-600 dark:text-slate-400">
                    No courses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">{course.courseTitle}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{course.courseCode || "-"}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{course.categoryName || "-"}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{format(new Date(course.updatedAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleViewCourse(course.id)}
                                className="h-8 w-8 border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Course</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditCourse(course.id)}
                                className="h-8 w-8 border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Course</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => openDeleteDialog(course.id)}
                                className="h-8 w-8 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Course</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredAndSortedCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100">{course.courseTitle}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">{course.courseCode || "No code"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">Category: {course.categoryName || "Uncategorized"}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Updated: {format(new Date(course.updatedAt), 'MMM dd, yyyy')}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCourse(course.id)}
                    className="border-slate-200 dark:border-slate-600"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCourse(course.id)}
                    className="border-slate-200 dark:border-slate-600"
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
};

export default Courses;
