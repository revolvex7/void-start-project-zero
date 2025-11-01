import React from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag, Lock } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string;
  mediaUrl?: string;
  price: string;
}

interface ProductPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  creatorName: string;
  themeColor?: string;
}

export function ProductPurchaseModal({ 
  open, 
  onOpenChange, 
  product, 
  creatorName,
  themeColor = '#8017E8'
}: ProductPurchaseModalProps) {
  if (!product) return null;

  const handlePurchase = () => {
    // Payment integration will be added later
    console.log('Purchase product:', product.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent className="max-w-2xl bg-gray-900 text-white border border-gray-700 p-0 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: themeColor }}
            >
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-lg font-semibold">{creatorName}</span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Product Image */}
          <div className="mb-6">
            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
              {product.mediaUrl ? (
                <>
                  <img 
                    src={product.mediaUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Lock Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="text-center">
                      <Lock className="w-16 h-16 text-white mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">Payment Required</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <ShoppingBag className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            {product.description && (
              <p className="text-gray-400 text-sm mb-4">{product.description}</p>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Price</p>
                <p className="text-3xl font-bold" style={{ color: themeColor }}>
                  ₦{parseFloat(product.price || '0').toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-1">Payment Integration in Progress</h3>
                <p className="text-sm text-gray-400">
                  We're currently setting up secure payment processing. You'll be able to purchase this product once payment integration is complete.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={true}
              className="flex-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: themeColor }}
            >
              <Lock className="w-4 h-4 mr-2" />
              Purchase (Coming Soon)
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment processing will be available soon
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
