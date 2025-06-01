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
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/administrator/categories');
      return response.data.data;
    },
    meta: {
      onError: () => {
        toast.error('Failed to fetch categories. Please try again later.');
      }
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Consistent with loaded state */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Category Management</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Organize your content with categories</p>
            </div>
            <div className="w-32 h-10 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Main Content with Loading State */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Loading Tabs Skeleton */}
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-36 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg animate-pulse"></div>
            </div>
          </div>

          <div className="p-6">
            <LoadingState 
              message="Loading categories" 
              variant="spinner"
              className="py-16"
              statusMessage="Fetching category data and content..."
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section - Consistent */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Category Management</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Organize your content with categories</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try Again
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FolderOpen className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Categories</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-md mx-auto">
              We encountered an issue while fetching your categories. Please check your connection and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Category Management</h1>
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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 px-6 py-5">
            <TabsList className="h-12 p-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-600 shadow-sm rounded-xl">
              <TabsTrigger 
                value="all" 
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                All Categories
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search categories by name..."
                  className="pl-10 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-blue-900/20 border-slate-200 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-700/50">
                      <TableHead className="w-[80%]">
                        <Button 
                          variant="ghost" 
                          onClick={handleSort}
                          className="font-medium flex items-center gap-1 px-0 hover:bg-transparent"
                        >
                          Name
                          <ArrowUpDown className="h-3.5 w-3.5" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                          No categories found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedAndFilteredCategories.map((category: Category) => (
                        <TableRow key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <TableCell className="font-medium">{category.name}</TableCell>
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
        <DialogContent className="rounded-xl bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="py-4">
              <Input
                placeholder="Category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
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
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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
        <AlertDialogContent className="rounded-xl bg-white dark:bg-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
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
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
