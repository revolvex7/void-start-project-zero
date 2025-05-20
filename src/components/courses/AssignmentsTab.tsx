
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus, Download, Eye, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import { toast } from "sonner";
import { deleteAssignment as deleteAssignmentApi } from "@/services/api";

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
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      await deleteAssignmentApi(assignmentId);
      toast.success("Assignment deleted successfully");
      await onAssignmentAdded(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete assignment", {
        description: "An error occurred while deleting the assignment"
      });
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
                              onClick={() => window.open(assignment.fileUrl, '_blank')}
                              disabled={!assignment.fileUrl}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View</p>
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
                              onClick={() => handleDeleteAssignment(assignment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

      <AddAssignmentDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
        courseId={courseId}
        onAssignmentAdded={onAssignmentAdded}
      />
    </div>
  );
};
