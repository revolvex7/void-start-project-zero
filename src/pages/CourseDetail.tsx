
import React, { useState } from "react";
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
  XCircle
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

import { courseService, CourseDetailResponse, CourseEnrolledResponse } from "@/services/courseService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatFileSize } from "@/lib/utils";
import { EnrollUsersDialog } from "@/components/courses/EnrollUsersDialog";

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  // Query for course basic info
  const { data: courseBasicInfo, isLoading: isLoadingBasicInfo } = useQuery({
    queryKey: ["course-basic-info", courseId],
    queryFn: async () => {
      const courses = await courseService.getCourses();
      return courses.find(c => c.id === courseId);
    },
    enabled: !!courseId
  });

  // Query for detailed course info (enrolled users, files, groups)
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
      <LoadingSpinner message="Loading course details..." />
    </div>;
  }

  if (detailError || !courseDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Course</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We couldn't load the course details. Please try again later.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/courses")}>
            Back to Courses
          </Button>
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

  // Filter users, files, and groups based on search term
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
    <div className="space-y-6">
      <div className="flex items-center gap-6 justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Link 
              to="/courses" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Courses
              </div>
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{courseBasicInfo?.name || "Course"}</h1>
          <p className="text-sm text-muted-foreground">{courseBasicInfo?.description || "Course Details"}</p>
        </div>
        
        <Button onClick={() => navigate(`/course/${courseId}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit course
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            View and manage course information, enrolled users, files, and groups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full bg-transparent border-b p-0 h-12 rounded-none flex justify-start space-x-6">
              <TabsTrigger 
                value="users" 
                className="pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-sm font-medium"
              >
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="files" 
                className="pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-sm font-medium"
              >
                <FileText className="mr-2 h-4 w-4" />
                Files
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className="pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 text-sm font-medium"
              >
                <Users className="mr-2 h-4 w-4" />
                Groups
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex-1 flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={`Search ${activeTab}...`} 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              {activeTab === "users" && (
                <Button onClick={() => setIsEnrollDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" /> Enroll to course
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
                      <TableHead className="w-[300px]">File URL</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Upload date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles && filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">{file.fileUrl}</TableCell>
                          <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                          <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="icon" variant="outline" className="h-8 w-8">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No files found
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
                        <TableCell colSpan={4} className="h-24 text-center">
                          No groups found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <EnrollUsersDialog 
        isOpen={isEnrollDialogOpen}
        onClose={() => setIsEnrollDialogOpen(false)}
        courseId={courseId || ""}
        enrolledUsers={courseDetail.data.enrolledUsers}
        onEnrollment={handleUserEnrollment}
      />
    </div>
  );
};

export default CourseDetailPage;
