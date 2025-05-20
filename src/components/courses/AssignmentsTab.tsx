
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus, Download, Pencil, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import { toast } from "sonner";
import { deleteAssignment as deleteAssignmentApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";
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

export interface Assignment {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  dueDate: string;
  createdAt: string;
  classNumbers?: string[];
  isAiGenerated: boolean;
}

interface AssignmentsTabProps {
  courseId: string;
  assignments: Assignment[];
  onAssignmentAdded: () => Promise<void>;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ 
  courseId, 
  assignments = [],
  onAssignmentAdded 
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEditDialog = (assignment: Assignment) => {
    setAssignmentToEdit(assignment);
    setIsEditDialogOpen(true);
  };

  const handleConfirmDelete = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteAssignment = async () => {
    if (!assignmentToDelete) return;
    
    try {
      setLoading(assignmentToDelete);
      await deleteAssignmentApi(assignmentToDelete);
      toast.success("Assignment deleted successfully");
      await onAssignmentAdded(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete assignment", {
        description: "An error occurred while deleting the assignment"
      });
    } finally {
      setLoading(null);
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search assignments..."
            className="w-full px-3 py-2 border rounded-md pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> 
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <FilePlus className="mr-2 h-4 w-4" /> Add Assignment
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] min-w-[150px]">Title</TableHead>
              <TableHead className="min-w-[250px]">Description</TableHead>
              <TableHead className="w-[120px]">Due Date</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell className="line-clamp-2 max-w-[300px]">{assignment.description}</TableCell>
                  <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{assignment.isAiGenerated ? "AI Generated" : "Manual"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-8 w-8"
                              onClick={() => handleOpenEditDialog(assignment)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-8 w-8"
                              onClick={() => window.open(assignment.fileUrl, '_blank')}
                              disabled={!assignment.fileUrl}
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
                              onClick={() => handleConfirmDelete(assignment.id)}
                              disabled={loading === assignment.id}
                            >
                              {loading === assignment.id ? (
                                <Spinner size="sm" color="primary" className="h-4 w-4" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32">
                  <div className="flex flex-col items-center justify-center text-center">
                    <FilePlus className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-lg font-medium mb-1">No assignments available</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create assignments for your students to complete
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Add Assignment
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Assignment Dialog */}
      <AddAssignmentDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        courseId={courseId}
        onAssignmentAdded={onAssignmentAdded}
      />
      
      {/* Edit Assignment Dialog */}
      {assignmentToEdit && (
        <AddAssignmentDialog 
          isOpen={isEditDialogOpen} 
          onClose={() => {
            setIsEditDialogOpen(false);
            setAssignmentToEdit(null);
          }} 
          courseId={courseId}
          onAssignmentAdded={onAssignmentAdded}
          existingAssignment={assignmentToEdit}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assignment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteAssignment}
              disabled={loading !== null}
            >
              {loading !== null ? (
                <div className="flex items-center">
                  <Spinner size="sm" color="white" className="mr-2" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
