import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService, UpdateCoursePayload } from "@/services/courseService";
import { Category } from "@/services/courseService";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onCourseUpdate: () => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({ isOpen, onClose, courseId, onCourseUpdate }) => {
  const [courseTitle, setCourseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  // Fetch course details
  const { data: courseDetails, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course-details", courseId],
    queryFn: () => courseService.getCourseEditorDetails(courseId),
    enabled: isOpen,
  });

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => courseService.getCategories(),
  });

  const categories: Category[] = categoriesData || [];

  useEffect(() => {
    if (courseDetails?.course) {
      setCourseTitle(courseDetails.course.courseTitle || "");
      setDescription(courseDetails.course.description || "");
      setPrice(courseDetails.course.price);
      setCategoryId(courseDetails.course.categoryId || "");
      setImage(courseDetails.course.image || null);
      setIsPublished(courseDetails.course.isPublished || false);
      setCourseCode(courseDetails.course.courseCode || "");
    }
  }, [courseDetails, isOpen]);

  const updateCourseMutation = useMutation({
    mutationFn: (payload: UpdateCoursePayload) => courseService.updateCourse(courseId, payload),
    onSuccess: () => {
      toast.success("Course updated successfully!");
      queryClient.invalidateQueries(["course-details", courseId]);
      onCourseUpdate();
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Failed to update course: ${error.message || "An error occurred"}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: UpdateCoursePayload = {
      courseTitle,
      description,
      price,
      categoryId,
      isPublished,
      image,
      courseCode,
    };

    updateCourseMutation.mutate(payload);
  };

  if (isCourseLoading || isCategoriesLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] flex items-center justify-center">
          <Spinner size="lg" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Course Details</DialogTitle>
          <DialogDescription>
            Make changes to your course details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="courseTitle">Course Title</Label>
              <Input
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Course title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                id="price"
                value={price !== null ? price.toString() : ""}
                onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Course price"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="courseCode">Course Code</Label>
              <Input
                type="text"
                id="courseCode"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="Course Code"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Add more fields as necessary, e.g., for image, isPublished, etc. */}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
