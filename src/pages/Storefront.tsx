import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Package, 
  DollarSign, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  Menu,
  X,
  ShoppingBag,
  Tag,
  TrendingUp,
  Upload,
  Loader2
} from 'lucide-react';
import { productAPI, commonAPI } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  mediaUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Storefront() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      setIsUploadingImage(true);
      try {
        const uploadedUrl = await commonAPI.uploadFile(file, 'products');
        setUploadedImageUrl(uploadedUrl);
        toast({
          title: "Image uploaded",
          description: "Image has been uploaded successfully.",
          variant: "success",
        });
      } catch (error: any) {
        console.error('Failed to upload image:', error);
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        // Reset on error
        setImageFile(null);
        setImagePreview(null);
        setUploadedImageUrl(null);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      setIsUploadingImage(true);
      try {
        const uploadedUrl = await commonAPI.uploadFile(file, 'products');
        setUploadedImageUrl(uploadedUrl);
        toast({
          title: "Image uploaded",
          description: "Image has been uploaded successfully.",
          variant: "success",
        });
      } catch (error: any) {
        console.error('Failed to upload image:', error);
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        // Reset on error
        setImageFile(null);
        setImagePreview(null);
        setUploadedImageUrl(null);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await productAPI.getAll();
        setProducts(res.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;

    setIsSubmitting(true);
    try {
      // Use already uploaded image URL (uploaded immediately when image was selected)
      const productData = {
        name: newProduct.name,
        description: newProduct.description || undefined,
        price: newProduct.price,
        mediaUrl: uploadedImageUrl || undefined,
      };

      await productAPI.create(productData);
      
      // Fetch updated products list
      const productsRes = await productAPI.getAll();
      setProducts(productsRes.data || []);

      toast({
        title: "Product created!",
        description: "Your product has been created successfully.",
        variant: "success",
      });

      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setUploadedImageUrl(null);
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Failed to create product:', error);
      toast({
        title: "Failed to create product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description || '',
      price: product.price,
    });
    setImagePreview(product.mediaUrl || null);
    setImageFile(null);
    setUploadedImageUrl(product.mediaUrl || null); // Set existing image URL
    setShowEditModal(true);
    setShowCreateModal(false);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !newProduct.name || !newProduct.price) return;

    setIsSubmitting(true);
    try {
      // Use uploaded image URL if a new image was uploaded, otherwise keep existing
      const mediaUrl = uploadedImageUrl !== null ? uploadedImageUrl : editingProduct.mediaUrl;

      // Update product
      const productData = {
        name: newProduct.name,
        description: newProduct.description || undefined,
        price: newProduct.price,
        mediaUrl: mediaUrl || undefined,
      };

      await productAPI.update(editingProduct.id, productData);
      
      // Fetch updated products list
      const productsRes = await productAPI.getAll();
      setProducts(productsRes.data || []);

      toast({
        title: "Product updated!",
        description: "Your product has been updated successfully.",
        variant: "success",
      });

      // Reset form
      setEditingProduct(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setUploadedImageUrl(null);
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Failed to update product:', error);
      toast({
        title: "Failed to update product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await productAPI.delete(productToDelete.id);
      
      // Fetch updated products list
      const productsRes = await productAPI.getAll();
      setProducts(productsRes.data || []);

      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully.",
        variant: "success",
      });

      setShowDeleteDialog(false);
      setProductToDelete(null);
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      toast({
        title: "Failed to delete product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => setShowMobileSidebar(!showMobileSidebar)} 
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-semibold">Digital Storefront</h1>
        <div className="w-8" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileSidebar(false)} />
      )}

      {/* Sidebar */}
      <div className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} w-64 sm:w-72 lg:w-80 bg-gray-800 flex flex-col fixed h-full z-50 lg:z-10 transition-transform duration-300 ease-in-out`}>
        <UnifiedSidebar showMobileSidebar={showMobileSidebar} setShowMobileSidebar={setShowMobileSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 pt-16 lg:pt-0 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 hidden lg:block">
            <h1 className="text-3xl font-bold mb-2">Digital Storefront</h1>
            <p className="text-gray-400">Manage your products and track sales</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{products.length}</h3>
                  <p className="text-gray-400 text-sm">Products</p>
                </div>
              </div>
            </div>

           

          </div>

          {/* Products Section */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Products</h2>
              <Button 
                onClick={() => {
                  setShowCreateModal(true);
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-700 rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-48 bg-gray-600" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4 bg-gray-600" />
                      <Skeleton className="h-4 w-full bg-gray-600" />
                      <Skeleton className="h-4 w-2/3 bg-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-gray-400 mb-4">Create your first product to start selling</p>
                <Button 
                  onClick={() => {
                    setShowCreateModal(true);
                    setShowEditModal(false);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all">
                    <div className="relative h-48">
                      <img 
                        src={product.mediaUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-2 bg-gray-900/80 rounded-lg hover:bg-gray-900 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-white" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 bg-red-900/80 rounded-lg hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description || 'No description'}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-400">₦{parseFloat(product.price || '0').toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Product Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{showEditModal ? 'Edit Product' : 'Create New Product'}</h2>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Premium Tutorial Bundle"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe your product..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2">Price (NGN) *</label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="2500"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-gray-600 bg-gray-700/50'
                  }`}
                >
                  {isUploadingImage ? (
                    <div className="space-y-4">
                      <div className="w-full h-48 bg-gray-600 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                          <p className="text-gray-300 text-sm">Uploading image...</p>
                        </div>
                      </div>
                    </div>
                  ) : imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {uploadedImageUrl && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                            <span>✓</span>
                            <span>Uploaded</span>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setUploadedImageUrl(null);
                        }}
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-300 mb-2">
                          Drag and drop your image here, or
                        </p>
                        <label className="cursor-pointer">
                          <span className="text-purple-400 hover:text-purple-300 underline">
                            browse from your computer
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400">
                        Supports: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

            

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                  className="bg-transparent border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={showEditModal ? handleUpdateProduct : handleCreateProduct}
                  disabled={!newProduct.name || !newProduct.price || isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {showEditModal ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    showEditModal ? 'Update Product' : 'Create Product'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setProductToDelete(null);
              }}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProduct}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
