import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, X } from 'lucide-react';

interface StartBasicsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    pageName: string;
    patreonUrl: string;
    description: string;
    profileImage?: string;
  }) => void;
}

export function StartBasicsModal({ open, onOpenChange, onSave }: StartBasicsModalProps) {
  const [pageName, setPageName] = useState('');
  const [patreonUrl, setPatreonUrl] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSave = () => {
    onSave({
      pageName,
      patreonUrl,
      description,
      profileImage: profileImage || undefined
    });
    onOpenChange(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md mx-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-center flex-1">
            Start with the basics
          </DialogTitle>
        
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Profile Image Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full rounded-2xl object-cover" 
                  />
                ) : (
                  'S'
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-700 hover:bg-gray-800 transition-colors">
                <Camera className="w-4 h-4 text-gray-400" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Page Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Page name
            </label>
            <Input
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Enter page name"
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* True Fans URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your True Fans URL
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 text-sm">
                patreon.com/
              </span>
              <Input
                value={patreonUrl}
                onChange={(e) => setPatreonUrl(e.target.value)}
                placeholder="your-url"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-l-none"
              />
            </div>
          </div>

          {/* What do you create */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What do you create?
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. A podcast for pizza makers"
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none h-24"
            />
            <p className="text-xs text-gray-400 mt-1">
              Be specific so people can discover your work.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!pageName.trim()}
              className="flex-1 bg-white text-black hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}