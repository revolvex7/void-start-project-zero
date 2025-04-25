
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EnrollCoursesDialog } from "@/components/courses/EnrollCoursesDialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface EnrolledCourse {
  id: string;
  courseId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  progress: string;
  completionDate: string | null;
}

interface UserCoursesTabProps {
  userId: string;
  courses: EnrolledCourse[];
}

export const UserCoursesTab: React.FC<UserCoursesTabProps> = ({ userId, courses }) => {
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  const handleCourseEnrollment = () => {
    // This will be handled by the parent component refreshing the user details
    setIsEnrollDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-xl font-medium">Enrolled Courses</h2>
        <Button onClick={() => setIsEnrollDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Enroll to course
        </Button>
      </div>
      
      <Card>
        <CardContent>
          {courses && courses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course ID</TableHead>
                  <TableHead>Enrollment Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.courseId}</TableCell>
                    <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{parseFloat(course.progress).toFixed(2)}%</TableCell>
                    <TableCell>
                      {course.completionDate ? 'Completed' : 'In Progress'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-14">
              <h3 className="text-lg font-semibold mb-1 text-gray-900">No enrolled courses</h3>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                Enroll this user in courses from the available list.
              </p>
              <Button variant="outline" onClick={() => setIsEnrollDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Enroll to course
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <EnrollCoursesDialog 
        isOpen={isEnrollDialogOpen}
        onClose={() => setIsEnrollDialogOpen(false)}
        userId={userId}
        onEnrollment={handleCourseEnrollment}
      />
    </div>
  );
};
