import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Upload
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: 'digital' | 'merch' | 'exclusive';
  sales: number;
}

export default function Storefront() {
  const navigate = useNavigate();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Exclusive Digital Art Pack',
      description: 'Collection of 10 high-resolution digital artworks',
      price: 2500,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      category: 'digital',
      sales: 12
    },
    {
      id: '2',
      name: 'Premium Tutorial Series',
      description: 'Complete video tutorial series with source files',
      price: 5000,
      currency: 'NGN',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      category: 'digital',
      sales: 8
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'digital' as 'digital' | 'merch' | 'exclusive',
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.price) return;

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      currency: 'NGN',
      image: imagePreview || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      category: 'digital',
      sales: 0
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: 'digital',
      image: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setShowCreateModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'digital': return 'bg-blue-900/30 text-blue-300';
      case 'merch': return 'bg-green-900/30 text-green-300';
      case 'exclusive': return 'bg-purple-900/30 text-purple-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'digital': return <Package className="w-4 h-4" />;
      case 'merch': return <ShoppingBag className="w-4 h-4" />;
      case 'exclusive': return <Tag className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);

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

           

            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{totalSales}</h3>
                  <p className="text-gray-400 text-sm">Total Sales</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Products</h2>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-gray-400 mb-4">Create your first product to start selling</p>
                <Button 
                  onClick={() => setShowCreateModal(true)}
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
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button className="p-2 bg-gray-900/80 rounded-lg hover:bg-gray-900 transition-colors">
                          <Edit className="w-4 h-4 text-white" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 bg-red-900/80 rounded-lg hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1 ${getCategoryColor(product.category)}`}>
                        {getCategoryIcon(product.category)}
                        <span className="capitalize">{product.category}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-400">₦{product.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{product.sales} sales</p>
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

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create New Product</h2>
              <button
                onClick={() => setShowCreateModal(false)}
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
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
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
                  onClick={() => setShowCreateModal(false)}
                  className="bg-transparent border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProduct}
                  disabled={!newProduct.name || !newProduct.price}
                  className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  Create Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
