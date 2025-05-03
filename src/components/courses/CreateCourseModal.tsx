
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, Image, FileText, X, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentUpload } from "@/components/DocumentUpload";
import { courseService } from "@/services/courseService";
import { useSocketProgress } from "@/hooks/useSocketProgress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Course categories - fetch these from an API in a real app
const COURSE_CATEGORIES = [
  "Mathematics",
  "Science",
  "Language Arts",
  "Social Studies",
  "Computer Science",
  "Arts",
  "Music",
  "Physical Education",
  "Foreign Languages",
  "Business",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Form schema
const courseSchema = z.object({
  classTitle: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  classNo: z.coerce.number()
    .int()
    .min(1, "Class number must be at least 1")
    .max(100, "Class number cannot exceed 100"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  category: z.string({
    required_error: "Please select a category",
  }),
  classCount: z.coerce.number()
    .int()
    .min(1, "Must have at least 1 class")
    .max(50, "Cannot exceed 50 classes"),
  price: z.coerce.number()
    .nullable()
    .default(null),
  // We'll handle image and syllabus validation separately
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { socketId } = useSocketProgress();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [syllabusPdf, setSyllabusPdf] = useState<File | null>(null);
  const [syllabusStatus, setSyllabusStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [syllabusProgress, setSyllabusProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      classTitle: "",
      classNo: 1,
      description: "",
      category: "",
      classCount: 1,
      price: null,
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG, JPG, or PNG image",
      });
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: "Image must be less than 5MB",
      });
      return;
    }

    try {
      setUploadingImage(true);
      setCoverImage(file);
      const imageUrl = URL.createObjectURL(file);
      setCoverImagePreview(imageUrl);

      // Upload the image to the server
      const response = await courseService.uploadFile(file);
      setCoverImageUrl(response.data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      resetCoverImage();
    } finally {
      setUploadingImage(false);
    }
  };

  const resetCoverImage = () => {
    setCoverImage(null);
    setCoverImageUrl(null);
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
      setCoverImagePreview(null);
    }
  };

  const handleSyllabusUpload = (file: File) => {
    setSyllabusPdf(file);
    setSyllabusStatus('success');
    setSyllabusProgress(100);
  };

  const onSubmit = async (data: CourseFormValues) => {
    if (!syllabusPdf) {
      toast.error("Syllabus PDF is required");
      return;
    }

    if (!socketId) {
      toast.error("Socket connection not established");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        noOfClasses: data.classCount,
        socketId: socketId,
        classNo: data.classNo.toString(),
        classTitle: data.classTitle,
        description: data.description,
        price: data.price,
        isPublished: false,
        image: coverImageUrl || undefined, // Include image URL if available
      };
      
      const response = await courseService.generateCourse(payload);
      
      toast.success("Course generation started", {
        description: "You'll be redirected to the edit page once complete"
      });
      
      // Redirect to the edit page
      navigate(`/course/${response.data.id}/edit`);
      
      // Call onSuccess to update any parent components
      onSuccess();
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset();
    resetCoverImage();
    setSyllabusPdf(null);
    setSyllabusStatus('idle');
    setSyllabusProgress(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Course</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new course for your students.
          </DialogDescription>
        </DialogHeader>

        {/* Cover Image Upload - Redesigned to be circular and centered */}
        <div className="flex justify-center items-center w-full mb-6">
          {uploadingImage ? (
            <div className="w-40 h-40 rounded-full flex items-center justify-center bg-slate-100 animate-pulse">
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          ) : coverImagePreview ? (
            <div className="relative">
              <Avatar className="w-40 h-40 border-4 border-purple-100">
                <AvatarImage src={coverImagePreview} alt="Course cover" className="object-cover" />
                <AvatarFallback className="bg-purple-100 text-purple-500">
                  <Image className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                onClick={resetCoverImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label
              htmlFor="cover-image"
              className="relative cursor-pointer"
            >
              <Avatar className="w-40 h-40 border-4 border-dashed border-purple-200 hover:border-purple-300 transition-colors bg-slate-50">
                <AvatarFallback className="bg-transparent flex flex-col items-center justify-center">
                  <Camera className="w-12 h-12 text-purple-300" />
                  <span className="text-xs text-gray-500 mt-2">Add course image</span>
                </AvatarFallback>
              </Avatar>
              <Input
                id="cover-image"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </label>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="classTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduction to Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        placeholder="1" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify which class this course refers to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COURSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Classes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      How many classes will this course contain?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a short description of the course..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly describe what students will learn in this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0.00"
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Set a price for this course (leave empty for free)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Syllabus Document</FormLabel>
              <DocumentUpload
                onFileAccepted={handleSyllabusUpload}
                status={syllabusStatus}
                progress={syllabusProgress}
                maxSize={10485760} // 10MB
              />
              <FormDescription>
                Upload a PDF document containing the course syllabus (Max 10MB)
              </FormDescription>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || uploadingImage}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || uploadingImage || !socketId}
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
