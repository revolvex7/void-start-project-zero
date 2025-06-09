import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BookOpen, Calendar, Clock, Star, Award, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseModal } from "@/components/parent/CourseModal";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { ChildDetailsResponse, ChildEnrolledCourse } from "@/types/dashboard";

// Category colors for visual differentiation
const categoryColors: Record<string, string> = {
  "Mathematics": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  "Math": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  "Science": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  "History": "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  "Language Arts": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  "Computer Science": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
  "Art": "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
  "Music": "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  "Physical Education": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
};

const ChildDetails = () => {
  const { childId } = useParams<{ childId: string }>();
  const [selectedCourse, setSelectedCourse] = useState<ChildEnrolledCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch child data from API
  const { data: childData, isLoading, error } = useQuery({
    queryKey: ['childDetails', childId],
    queryFn: () => userService.getChildDetails(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Format last login date
  const formatLastLogin = (lastLogin: string) => {
    try {
      const date = new Date(lastLogin);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
      } else if (diffInHours < 48) {
        return "Yesterday";
      } else {
        const days = Math.floor(diffInHours / 24);
        return `${days} day${days === 1 ? '' : 's'} ago`;
      }
    } catch (error) {
      return "Unknown";
    }
  };

  // Calculate average progress across all courses
  const calculateAverageProgress = (courses: ChildEnrolledCourse[]) => {
    if (courses.length === 0) return 0;
    const totalProgress = courses.reduce((sum, course) => sum + parseFloat(course.progress || "0"), 0);
    return Math.round(totalProgress / courses.length);
  };

  // Map API course data to CourseModal expected format
  const mapCourseForModal = (course: ChildEnrolledCourse) => ({
    id: course.id,
    name: course.courseName,
    instructor: course.instructorName,
    progress: parseFloat(course.progress),
    category: course.categoryName,
    avgAssignmentGrade: course.avgAssignmentGrades || 0,
    avgQuizGrade: course.avgAssignmentGrades || 0, // Using same value as we don't have separate quiz grades
    lastAccessed: new Date(course.enrolledAt).toLocaleDateString()
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-10 w-40 mb-4" />
          <div className="grid gap-6">
            <Skeleton className="h-48" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !childData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link to="/parent-dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <User className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Child not found
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Unable to load child details. Please try again later.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const { user, enrolledCourses } = childData.data;
  const averageProgress = calculateAverageProgress(enrolledCourses);
  
  const handleOpenCourseModal = (course: ChildEnrolledCourse) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/parent-dashboard">
          <Button variant="ghost" className="gap-2 mb-4 hover:bg-purple-100 dark:hover:bg-purple-900/50">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        {/* Child Header Section */}
        <Card className="p-6 border-purple-200 dark:border-purple-800">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-purple-100 dark:border-purple-800">
              <AvatarImage src={user.profileImage || ""} alt={user.name} />
              <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">Learner Account</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span>Progress: {user.overAllProgress || '0'}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span>{user.enrolledCourses} Course{user.enrolledCourses === 1 ? '' : 's'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>Last login: {formatLastLogin(user.lastLogin)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Courses Section */}
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Enrolled Courses
          </h3>
          
          <div className="grid gap-5">
            {enrolledCourses.map((course) => (
              <Card 
                key={course.id} 
                className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4"
                style={{ borderLeftColor: parseFloat(course.progress) >= 75 ? '#10B981' : parseFloat(course.progress) >= 50 ? '#F59E0B' : '#6366F1' }}
                onClick={() => handleOpenCourseModal(course)}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <img 
                          src={course.courseImage} 
                          alt={course.courseName}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{course.courseName}</h4>
                          <Badge className={categoryColors[course.categoryName] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}>
                            {course.categoryName}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Instructor: {course.instructorName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Classes: {course.classNo}/{course.totalClasses}
                      </p>
                    </div>
                    
                    <div className="text-sm text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{course.progress}%</span>
                    </div>
                    <Progress value={parseFloat(course.progress)} className="h-2" />
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>
                        Avg Grade: <span className="font-medium">{course.avgAssignmentGrades || 'N/A'}</span>
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {course.completionDate ? `Completed: ${new Date(course.completionDate).toLocaleDateString()}` : 'In Progress'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {selectedCourse && (
        <CourseModal 
          course={mapCourseForModal(selectedCourse)} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          studentName={user.name}
        />
      )}
    </div>
  );
};

export default ChildDetails;
