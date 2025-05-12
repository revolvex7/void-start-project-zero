
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

import { courseService, Category, UpdateCoursePayload, CourseEditorDetailsResponse } from "@/services/courseService";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onCourseUpdate: () => void;
}

export function EditCourseModal({
  isOpen,
  onClose,
  courseId,
  onCourseUpdate,
}: EditCourseModalProps) {
  const [courseData, setCourseData] = useState<UpdateCoursePayload>({
    courseTitle: "",
    description: "",
    price: null,
    categoryId: "",
    isPublished: false,
    image: null,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch course details
  const { data: courseDetails, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course-editor-details", courseId],
    queryFn: () => courseService.getCourseEditorDetails(courseId),
    enabled: isOpen && !!courseId
  });

  // Update courseData when courseDetails changes
  useEffect(() => {
    if (courseDetails?.data?.course) {
      setCourseData({
        courseTitle: courseDetails.data?.course.courseTitle || "",
        description: courseDetails.data?.course.description || "",
        price: courseDetails.data?.course.price,
        categoryId: courseDetails.data?.course.categoryId || "",
        isPublished: courseDetails.data?.course.isPublished || false,
        image: courseDetails.data?.course.image || null,
        courseCode: courseDetails.data?.course.courseCode || "",
      });
    }
  }, [courseDetails]);

  // Fetch categories for dropdown
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => courseService.getCategories(),
    enabled: isOpen,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    setCourseData((prev) => ({ ...prev, price: value }));
  };

  const handleCategoryChange = (value: string) => {
    setCourseData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleCourseCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCourseData((prev) => ({ ...prev, courseCode: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await courseService.updateCourse(courseId, courseData);
      toast.success("Course updated successfully");
      onCourseUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update course", {
        description: "An error occurred while updating the course details"
      });
      console.error("Error updating course:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isLoadingCourse || isLoadingCategories;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Course Details</DialogTitle>
          <DialogDescription>
            Update the information for your course
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="courseTitle">Course Title</Label>
                <Input
                  id="courseTitle"
                  name="courseTitle"
                  value={courseData.courseTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={courseData.description || ""}
                  onChange={handleInputChange}
                  placeholder="Course description"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={courseData.price === null ? "" : courseData.price}
                  onChange={handlePriceChange}
                  placeholder="Leave empty for free course"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={courseData.categoryId} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  name="courseCode"
                  value={courseData.courseCode || ""}
                  onChange={handleCourseCodeChange}
                  className="bg-white"
                />
                <p className="text-xs text-muted-foreground">Enter a unique course code</p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
