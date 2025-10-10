import React from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, Star, X } from 'lucide-react';

interface SubscriptionRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creatorName: string;
  onSubscribe: () => void;
}

export function SubscriptionRequiredModal({ 
  open, 
  onOpenChange, 
  creatorName,
  onSubscribe 
}: SubscriptionRequiredModalProps) {
  const handleSubscribe = () => {
    onOpenChange(false);
    onSubscribe();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent className="max-w-md bg-gray-900 text-white border border-gray-700 p-0">
        {/* Header */}
        <div className="relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="text-center pt-8 pb-6 px-6">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Members-Only Content</h2>
            <p className="text-gray-400">
              This post is exclusive to {creatorName}'s subscribers
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Benefits Preview */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <p className="font-medium text-sm">Subscribe to get access to:</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>All exclusive members-only posts</span>
              </li>
              <li className="flex items-start">
                <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Early access to new content</span>
              </li>
              <li className="flex items-start">
                <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Behind-the-scenes updates</span>
              </li>
              <li className="flex items-start">
                <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Direct messaging with {creatorName}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSubscribe}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            >
              Subscribe Now - $9.99/month
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
            >
              Maybe later
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Cancel anytime. Support {creatorName} and unlock all exclusive content.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
