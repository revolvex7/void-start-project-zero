import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  UserPlus, 
  FileText, 
  Users, 
  Pencil, 
  Download,
  Eye,
  XCircle,
  Upload,
  FilePlus,
  Trash2,
  FileX,
  GraduationCap,
  Activity,
  Calendar,
  UserCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { courseService, CourseDetailResponse } from "@/services/courseService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatFileSize } from "@/lib/utils";
import { EnrollUsersDialog } from "@/components/courses/EnrollUsersDialog";
import { FileUploader } from "@/components/courses/FileUploader";
import { AssignmentsTab, ClassOption } from "@/components/courses/AssignmentsTab";
import { Assignment } from "@/components/courses/AssignmentsTab";

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: courseBasicInfo, isLoading: isLoadingBasicInfo } = useQuery({
    queryKey: ["course-basic-info", courseId],
    queryFn: async () => {
      const courses = await courseService.getCourses();
      return courses.find(c => c.id === courseId);
    },
    enabled: !!courseId
  });

  const { data: courseDetail, isLoading: isLoadingDetail, error: detailError, refetch } = useQuery({
    queryKey: ["courseDetail", courseId],
    queryFn: () => courseService.getCourseDetails(courseId || ""),
    enabled: !!courseId,
    meta: {
      onError: () => {
        toast.error("Failed to fetch course details", {
          description: "Please try again later",
        });
      }
    }
  });

  const isLoading = isLoadingBasicInfo || isLoadingDetail;

  // Extract classes from courseDetail for use in the AssignmentsTab
  const courseClasses: ClassOption[] = React.useMemo(() => {
    if (!courseDetail?.data) return [];    
    // Check if the course has course.classes with classes
    if (courseDetail.data.course.classes && courseDetail.data.course.classes.length > 0) {
      return courseDetail.data.course.classes.map(course => {
        return {
          id: course.id,
          title: course.title
        };
      });
    }
    
    return [];
  }, [courseDetail]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Loading */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-64 bg-slate-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Course Banner Loading */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="h-48 bg-slate-200 dark:bg-slate-600 animate-pulse"></div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              </div>
              <div className="w-24 h-10 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Loading */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6">
            <div className="h-12 w-full bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse mb-6"></div>
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse mb-4"></div>
            <div className="space-y-4">
              <div className="h-16 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div className="h-16 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
              <div className="h-16 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (detailError || !courseDetail) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Error */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Link to="/courses" aria-label="Back to courses">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Course Management</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Course Details
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Course</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto mb-6">
              We couldn't load the course details. Please try again later.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/courses">Back to Courses</Link>
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleUserEnrollment = async () => {
    await refetch();
    setIsEnrollDialogOpen(false);
    toast.success("User enrolled successfully", {
      description: "The user has been added to the course"
    });
  };

  const handleUnenrollUser = async (userId: string) => {
    try {
      await courseService.unenrollFromCourse(courseId || "", userId);
      toast.success("User unenrolled successfully");
      await refetch();
    } catch (error) {
      toast.error("Failed to unenroll user", {
        description: "An error occurred while removing the user from the course",
      });
    }
  };

  const handleFileUploadSuccess = async () => {
    await refetch();
    setIsFileUploaderOpen(false);
    toast.success("File uploaded successfully", {
      description: "The file has been added to the course"
    });
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await courseService.deleteFile(fileId);
      await refetch();
      toast.success("File deleted successfully", {
        description: "The file has been removed from the course"
      });
    } catch (error) {
      toast.error("Failed to delete file", {
        description: "An error occurred while removing the file from the course",
      });
    }
  };

  const handleAssignmentAdded = async () => {
    await refetch(); // Refetch course details to update assignments
  };

  const filteredUsers = courseDetail.data.enrolledUsers.filter(user => 
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = courseDetail.data.files.filter(file => 
    file.fileUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = courseDetail.data.groups.filter(group => 
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Link to="/courses" aria-label="Back to courses">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Course Management</p>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {courseBasicInfo?.courseTitle || "Course Details"}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                {courseBasicInfo?.description || "Manage course content and enrollment"}
              </p>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Course Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-2xl font-bold mb-2">{courseBasicInfo?.courseTitle}</h2>
            <p className="text-blue-100 max-w-2xl">{courseBasicInfo?.description}</p>
          </div>
          <div className="absolute top-6 right-6">
            <Button 
              onClick={() => navigate(`/course/${courseId}/edit`)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit Course
            </Button>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {filteredUsers.length} Students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {filteredFiles.length} Files
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  {filteredGroups.length} Groups
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Course Management
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View and manage course information, enrolled users, files, groups, and assignments.
          </p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <TabsList className="bg-transparent h-auto p-0 w-full flex justify-start">
                <TabsTrigger 
                  value="users" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Enrolled Users
                </TabsTrigger>
                <TabsTrigger 
                  value="files" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Course Files
                </TabsTrigger>
                <TabsTrigger 
                  value="groups" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Study Groups
                </TabsTrigger>
                <TabsTrigger 
                  value="assignments" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none px-6 py-4 font-medium transition-all duration-200"
                >
                  <FileX className="mr-2 h-4 w-4" />
                  Assignments
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
            {activeTab !== "assignments" && (
              <div className="flex-1 flex items-center space-x-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder={`Search ${activeTab}...`} 
                    className="pl-10 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              )}
              {activeTab === "users" && (
                <Button onClick={() => setIsEnrollDialogOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <UserPlus className="mr-2 h-4 w-4" /> Enroll Users
                </Button>
              )}
              {activeTab === "files" && (
                <Button onClick={() => setIsFileUploaderOpen(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <FilePlus className="mr-2 h-4 w-4" /> Upload File
                </Button>
              )}
            </div>

            <TabsContent value="users" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Enrollment date</TableHead>
                      <TableHead>Completion date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers && filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.userName}</TableCell>
                          <TableCell className="capitalize">{user.userRole}</TableCell>
                          <TableCell>{user.progress}%</TableCell>
                          <TableCell>{new Date(user.enrolledAt).toLocaleDateString()}</TableCell>
                          <TableCell>{user.completionDate ? new Date(user.completionDate).toLocaleDateString() : "-"}</TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0"
                                    onClick={() => navigate(`/users/${user.userId}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View user</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleUnenrollUser(user.userId)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Unenroll user</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="files" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">File Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Upload date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles && filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">{file.fileUrl.split('/').pop()}</TableCell>
                          <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                          <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-8 w-8"
                                    onClick={() => window.open(file.fileUrl, '_blank')}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteFile(file.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32">
                          <div className="flex flex-col items-center justify-center text-center">
                            <FileText className="h-8 w-8 text-muted-foreground mb-3" />
                            <p className="text-lg font-medium mb-1">No files uploaded yet</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Upload course materials, resources, or documents for your learners
                            </p>
                            <Button onClick={() => setIsFileUploaderOpen(true)}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Files
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="groups" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Group name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created at</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups && filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">{group.groupName}</TableCell>
                          <TableCell>{group.description}</TableCell>
                          <TableCell>{group.groupMembers}</TableCell>
                          <TableCell>{new Date(group.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Users className="h-8 w-8 text-muted-foreground mb-3" />
                            <p className="text-lg font-medium mb-1">No study groups created</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Create groups to enable collaborative learning and discussions
                            </p>
                            <Button>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Create Study Group
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="assignments" className="space-y-4">
              <AssignmentsTab 
                courseId={courseId || ""} 
                assignments={courseDetail.data.assignments || []} 
                onAssignmentAdded={handleAssignmentAdded}
                classes={courseClasses}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EnrollUsersDialog 
        isOpen={isEnrollDialogOpen}
        onClose={() => setIsEnrollDialogOpen(false)}
        courseId={courseId || ""}
        enrolledUsers={courseDetail.data.enrolledUsers}
        onEnrollment={handleUserEnrollment}
      />

      <FileUploader
        isOpen={isFileUploaderOpen}
        onClose={() => setIsFileUploaderOpen(false)}
        courseId={courseId || ""}
        onFileUpload={handleFileUploadSuccess}
      />
    </div>
  );
};

export default CourseDetailPage;
