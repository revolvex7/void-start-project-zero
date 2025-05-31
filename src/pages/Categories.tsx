
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Search, SlidersHorizontal, ArrowUpDown, MoreHorizontal, Trash, FolderOpen } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/LoadingState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api";

interface Category {
  id: string;
  name: string;
}

const Categories = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "id">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<string>("all");
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/administrator/categories');
      return response.data.data;
    }
  });

  // Add category mutation
  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post('/administrator/category', { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to add category');
      console.error('Add category error:', error);
    }
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await api.put(`/administrator/category/${id}`, { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to update category');
      console.error('Update category error:', error);
    }
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/administrator/category/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
      setIsDeleteAlertOpen(false);
      setDeletingCategoryId(null);
    },
    onError: (error) => {
      toast.error('Failed to delete category');
      console.error('Delete category error:', error);
    }
  });

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const sortedAndFilteredCategories = React.useMemo(() => {
    if (!categories) return [];
    
    let filtered = categories.filter((category: Category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.sort((a: Category, b: Category) => {
      const compareResult = a.name.localeCompare(b.name);
      return sortDirection === "asc" ? compareResult : -compareResult;
    });
  }, [categories, searchTerm, sortDirection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, name: categoryName });
    } else {
      addMutation.mutate(categoryName);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingCategoryId(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (deletingCategoryId) {
      deleteMutation.mutate(deletingCategoryId);
    }
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
            <LoadingState 
              message="Loading categories" 
              variant="spinner"
              className="py-20"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Category Management
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Organize your content with categories</p>
            </div>
            <Button 
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-700/80 px-6 py-4">
              <TabsList className="h-12 p-1 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl shadow-md border border-slate-200/50 dark:border-slate-600/50">
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg px-6 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  All Categories
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    placeholder="Search categories by name..."
                    className="pl-10 h-12 border-slate-200 dark:border-slate-600 focus:border-blue-400 focus:ring-blue-400 rounded-xl bg-slate-50/50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-700 backdrop-blur-sm transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-12 w-12 border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 dark:bg-slate-700/50">
                        <TableHead className="w-[80%]">
                          <Button 
                            variant="ghost" 
                            onClick={handleSort}
                            className="font-medium flex items-center gap-1 px-0 hover:bg-transparent text-slate-700 dark:text-slate-300"
                          >
                            Name
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right text-slate-700 dark:text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAndFilteredCategories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center h-24 text-slate-600 dark:text-slate-400">
                            No categories found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedAndFilteredCategories.map((category: Category) => (
                          <TableRow key={category.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                            <TableCell className="font-medium text-slate-900 dark:text-slate-100">{category.name}</TableCell>
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <DropdownMenu>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Actions</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg">
                                    <DropdownMenuItem onClick={() => handleEdit(category)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDelete(category.id)}
                                      className="text-red-600 dark:text-red-400"
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Add/Edit Category Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-slate-100">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="py-4">
                <Input
                  placeholder="Category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="rounded-lg border-slate-200 dark:border-slate-600"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 rounded-lg"
                >
                  {addMutation.isPending || updateMutation.isPending ? (
                    <>Saving...</>
                  ) : (
                    <>{editingCategory ? "Update" : "Add"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
        >
          <AlertDialogContent className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-slate-900 dark:text-slate-100">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                This action cannot be undone. This will permanently delete this category.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => {
                  setIsDeleteAlertOpen(false);
                  setDeletingCategoryId(null);
                }}
                className="rounded-lg border-slate-200 dark:border-slate-600"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 rounded-lg"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Categories;
