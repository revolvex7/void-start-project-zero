import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, UserCircle, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/services/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface AvatarUploadProps {
  name: string;
  onChange: (base64: string | null) => void;
}

export const AvatarUpload = ({ name, onChange }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [initials, setInitials] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (name) {
      const words = name.trim().split(' ');
      if (words.length >= 2) {
        setInitials(`${words[0][0]}${words[1][0]}`.toUpperCase());
      } else if (words.length === 1 && words[0].length >= 1) {
        setInitials(words[0].substring(0, 2).toUpperCase());
      }
    }
  }, [name]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a temporary preview for immediate feedback
    const tempPreview = URL.createObjectURL(file);
    setPreview(tempPreview);
    setIsUploading(true);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('fileToUpload', file);

      // Upload file to API
      const response = await api.post('/common/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get image URL from response
      const imageUrl = response.data.data;
      
      if (imageUrl) {
        setPreview(imageUrl);
        onChange(imageUrl);
        
        // Store in localStorage for persistence across pages
        localStorage.setItem('userAvatar', imageUrl);
        toast.success('Profile image uploaded successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Failed to upload profile image');
      
      // Revert preview if upload fails
      setPreview(null);
      onChange(null);
    } finally {
      setIsUploading(false);
      // Revoke the temporary object URL
      URL.revokeObjectURL(tempPreview);
    }
  };

  const removeAvatar = () => {
    setPreview(null);
    onChange(null);
    localStorage.removeItem('userAvatar');
  };

  const gradientColors = [
    'from-blue-500 to-indigo-500',
    'from-[#1B68B3] to-blue-400',
    'from-sky-500 to-blue-600',
    'from-indigo-500 to-purple-500',
    'from-green-500 to-teal-500',
    'from-amber-500 to-orange-500'
  ];
  
  // Choose a consistent background color based on initials
  const colorIndex = name ? name.charCodeAt(0) % gradientColors.length : 0;
  const gradientColor = gradientColors[colorIndex];

  return (
    <div className="flex flex-col items-center mb-4">
      <motion.div 
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {preview ? (
          <motion.div 
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="w-20 h-20 border-3 border-white dark:border-gray-800 shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/20">
              <AvatarImage src={preview} alt="Avatar preview" />
              {isUploading && (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Spinner size="sm" color="primary" />
                </motion.div>
              )}
            </Avatar>
            
            {/* Hover overlay for preview */}
            <motion.div
              className={`absolute inset-0 rounded-full bg-black/20 flex items-center justify-center transition-opacity ${
                isHovered && !isUploading ? 'opacity-100' : 'opacity-0'
              }`}
              initial={false}
              animate={{ opacity: isHovered && !isUploading ? 1 : 0 }}
            >
              <Camera className="h-6 w-6 text-white" />
            </motion.div>
            
            <motion.button 
              type="button"
              onClick={removeAvatar} 
              className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors border-2 border-white dark:border-gray-800"
              disabled={isUploading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X size={12} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center text-white text-lg font-semibold shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/20 relative overflow-hidden`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
              animate={{ 
                background: isHovered 
                  ? "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)"
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Hover overlay */}
            <motion.div
              className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <Upload className="h-6 w-6 text-white" />
            </motion.div>
            
            {/* Avatar content */}
            <motion.div
              animate={{ opacity: isHovered ? 0.7 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {initials || <UserCircle size={36} className="text-white/90" />}
            </motion.div>
          </motion.div>
        )}
        
        <motion.label 
          htmlFor="avatar-upload" 
          className={`absolute -bottom-1 -right-1 bg-gradient-to-r from-[#1B68B3] to-blue-600 hover:from-[#1A5DA0] hover:to-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-all duration-200 border-2 border-white dark:border-gray-800 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          }`}
          whileHover={!isUploading ? { scale: 1.1, rotate: 5 } : {}}
          whileTap={!isUploading ? { scale: 0.95 } : {}}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <motion.div
            animate={{ rotate: isUploading ? 360 : 0 }}
            transition={{ duration: 1, repeat: isUploading ? Infinity : 0, ease: "linear" }}
          >
            <Camera size={14} />
          </motion.div>
          <input 
            id="avatar-upload" 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={isUploading}
          />
        </motion.label>
      </motion.div>
      
      <motion.p 
        className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium text-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {isUploading ? (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Uploading...
          </motion.span>
        ) : (
          'Upload profile photo'
        )}
      </motion.p>
    </div>
  );
};
