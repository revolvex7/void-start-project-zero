
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Assignment } from "./AssignmentsTab";
import api, { uploadFile, updateAssignment } from "@/services/api";

// Create the schema based on the provided schema
const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
});

// Type for API responses
interface CourseFileUploadResponse {
  data: {
    name: string;
    size: number;
    url: string;
  };
}

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  initialFileUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, initialFileUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(
    initialFileUrl ? "Existing file" : null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <p className="text-sm font-semibold">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">PDF, DOCX, or TXT (max 10MB)</p>
        {initialFileUrl && (
          <p className="text-xs text-blue-500 mt-2">Current file already uploaded</p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx,.txt"
        />
      </div>
      
      {fileName && (
        <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
          <span className="text-sm truncate">{fileName}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setFileName(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

interface AIGenerationProps {
  onClassNumbersChange: (classNumbers: string) => void;
  initialClassNumbers?: string[];
}

const AIGeneration: React.FC<AIGenerationProps> = ({ onClassNumbersChange, initialClassNumbers }) => {
  const initialValue = initialClassNumbers?.join(',') || '';
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">AI-Generated Assignment</h3>
            <p className="text-xs text-blue-700 mt-1">
              Provide the class numbers to generate an assignment based on those classes.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Class Numbers</label>
        <Input 
          placeholder="e.g., 1,2,3 or 1-3" 
          defaultValue={initialValue}
          onChange={(e) => onClassNumbersChange(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Enter comma-separated numbers (e.g., 1,2,3) or a range (e.g., 1-3)
        </p>
      </div>
    </div>
  );
};

interface AddAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onAssignmentAdded: () => Promise<void>;
  existingAssignment?: Assignment;
  isEditing?: boolean;
}

export const AddAssignmentDialog: React.FC<AddAssignmentDialogProps> = ({
  isOpen,
  onClose,
  courseId,
  onAssignmentAdded,
  existingAssignment,
  isEditing = false,
}) => {
  const isEdit = isEditing && existingAssignment;
  const dialogTitle = isEdit ? "Edit Assignment" : "Add Assignment";
  const submitButtonText = isEdit ? "Update Assignment" : "Create Assignment";
  
  const initialTab = existingAssignment?.isAiGenerated ? "ai" : "manual";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [classNumbers, setClassNumbers] = useState<string>(
    existingAssignment?.classNumbers?.join(',') || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: existingAssignment?.title || "",
      description: existingAssignment?.description || "",
      dueDate: existingAssignment ? new Date(existingAssignment.dueDate) : undefined,
    },
  });

  // Function to create assignment
  const createAssignment = async (data: {
    title: string;
    description: string;
    fileUrl: string;
    dueDate: string;
    classNumbers?: string[];
    isAiGenerated?: boolean;
  }) => {
    try {
      // Updated to use the new API endpoint with courseId in the URL
      const response = await api.post(`/user/assignments/${courseId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  };

  const handleSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    setIsSubmitting(true);
    try {
      // For manual assignments, file is required (unless editing and not changing)
      if (activeTab === "manual" && !selectedFile && !isEdit) {
        toast.error("Please upload an assignment file");
        setIsSubmitting(false);
        return;
      }

      // For AI generation, class numbers are required
      if (activeTab === "ai" && !classNumbers.trim()) {
        toast.error("Please enter class numbers for AI generation");
        setIsSubmitting(false);
        return;
      }

      // Upload file for manual assignments (only if new file selected)
      let fileUrl = existingAssignment?.fileUrl || '';
      if (activeTab === "manual" && selectedFile) {
        // Use the imported uploadFile function
        const uploadResponse = await uploadFile(selectedFile);
        fileUrl = uploadResponse.data.url;
      }

      // Prepare assignment data
      const assignmentData = {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate.toISOString(),
        fileUrl: activeTab === "manual" ? fileUrl : '',
        classNumbers: activeTab === "ai" ? classNumbers.split(',').map(n => n.trim()) : undefined,
        isAiGenerated: activeTab === "ai",
      };

      if (isEdit && existingAssignment) {
        // Update existing assignment
        await updateAssignment(existingAssignment.id, assignmentData);
        toast.success("Assignment updated successfully");
      } else {
        // Create new assignment
        await createAssignment(assignmentData);
        toast.success(
          activeTab === "manual" 
            ? "Assignment uploaded successfully" 
            : "AI is generating your assignment",
          {
            description: activeTab === "manual" 
              ? "Students can now access this assignment" 
              : "You will be notified when the generation is complete"
          }
        );
      }

      await onAssignmentAdded();
      onClose();
      form.reset();
      setSelectedFile(null);
      setClassNumbers("");
    } catch (error) {
      toast.error(isEdit ? "Failed to update assignment" : "Failed to create assignment", {
        description: "An error occurred while processing the assignment"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update assignment details" : "Create a new assignment for your students"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignment title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter assignment description" 
                      className="resize-none h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Upload</TabsTrigger>
                <TabsTrigger value="ai">AI Generated</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="mt-4">
                <FileUpload 
                  onFileSelect={setSelectedFile} 
                  initialFileUrl={existingAssignment?.fileUrl}
                />
              </TabsContent>
              <TabsContent value="ai" className="mt-4">
                <AIGeneration 
                  onClassNumbersChange={setClassNumbers}
                  initialClassNumbers={existingAssignment?.classNumbers} 
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
