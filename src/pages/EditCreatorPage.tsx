import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Save, X, Upload, Plus, Trash2, ExternalLink, Eye, Tag } from 'lucide-react';
import { Category, UpdateUserData } from '@/lib/api';
import { useCategories, useUpdateUser } from '@/hooks/useApi';

export default function EditCreatorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { creatorUrl } = useParams();
  
  const [pageData, setPageData] = useState({
    pageName: user?.creator?.creatorName || user?.creatorName || '',
    profilePhoto: null as File | null,
    profileImageUrl: '',
    coverPhoto: null as File | null,
    coverImageUrl: '',
    themeColor: user?.creator?.themeColor || '#8017E8',
    visibility: 'public' as 'public' | 'free' | 'paid',
    categoryId: user?.creator?.categoryId || '',
    tags: user?.creator?.tags || [] as string[]
  });

  const [selectedColor, setSelectedColor] = useState(user?.creator?.themeColor || '#8017E8');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aboutData, setAboutData] = useState({
    introVideo: user?.creator?.introVideo || '',
    bio: user?.creator?.bio || ''
  });
  const [profileImageUrl, setProfileImageUrl] = useState(user?.creator?.profilePhoto || '');
  const [coverImageUrl, setCoverImageUrl] = useState(user?.creator?.coverPhoto || '');
  const [socialLinks, setSocialLinks] = useState<Array<{id: string, platform: string, url: string}>>(
    user?.creator?.socialLinks || [
      { id: '1', platform: 'Instagram', url: 'https://instagram.com/username' },
      { id: '2', platform: 'Twitter', url: 'https://twitter.com/username' }
    ]
  );
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [tagInput, setTagInput] = useState('');

  // React Query hooks
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useCategories();
  
  const updateUserMutation = useUpdateUser();

  // Update state when user data changes
  useEffect(() => {
    if (user?.creator) {
      setPageData(prev => ({
        ...prev,
        pageName: user.creator?.creatorName || prev.pageName,
        themeColor: user.creator?.themeColor || prev.themeColor,
        categoryId: user.creator?.categoryId || prev.categoryId,
        tags: user.creator?.tags || prev.tags
      }));
      setSelectedColor(user.creator?.themeColor || '#8017E8');
      setAboutData({
        introVideo: user.creator?.introVideo || '',
        bio: user.creator?.bio || ''
      });
      setProfileImageUrl(user.creator?.profilePhoto || '');
      setCoverImageUrl(user.creator?.coverPhoto || '');
      setSocialLinks(user.creator?.socialLinks || [
        { id: '1', platform: 'Instagram', url: 'https://instagram.com/username' },
        { id: '2', platform: 'Twitter', url: 'https://twitter.com/username' }
      ]);
    }
  }, [user]);


  const colorPalette = [
    // Green shades
    '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
    // Blue shades  
    '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
    // Purple shades
    '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#581c87',
    // Pink shades
    '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843',
    // Red shades
    '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
    // Orange shades
    '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12',
    // Gray
    '#6b7280'
  ];

  const handleSave = async () => {
    try {
      const updateData: UpdateUserData = {
        pageName: pageData.pageName,
        creatorName: pageData.pageName, // Using pageName as creatorName
        profilePhoto: profileImageUrl || undefined,
        coverPhoto: coverImageUrl || undefined,
        themeColor: selectedColor,
        bio: aboutData.bio || undefined,
        introVideo: aboutData.introVideo || undefined,
        socialLinks: socialLinks.length > 0 ? socialLinks : undefined,
        tags: pageData.tags.length > 0 ? pageData.tags : undefined,
        categoryId: pageData.categoryId || undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof UpdateUserData] === undefined) {
          delete updateData[key as keyof UpdateUserData];
        }
      });
      
      console.log('=== SAVING PAGE DATA ===');
      console.log('Update Data:', updateData);
      console.log('========================');
      
      await updateUserMutation.mutateAsync(updateData);
      
      // Navigate back to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update user profile:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = `https://images.unsplash.com/photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}?w=400&h=400&fit=crop&crop=face`;
        setProfileImageUrl(imageUrl);
      };
      reader.readAsDataURL(file);
      setPageData({ ...pageData, profilePhoto: file });
    }
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = `https://images.unsplash.com/photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}?w=1920&h=400&fit=crop`;
        setCoverImageUrl(imageUrl);
      };
      reader.readAsDataURL(file);
      setPageData({ ...pageData, coverPhoto: file });
    }
  };

  const addSocialLink = () => {
    if (newSocialPlatform && newSocialUrl) {
      const newLink = {
        id: Date.now().toString(),
        platform: newSocialPlatform,
        url: newSocialUrl
      };
      setSocialLinks([...socialLinks, newLink]);
      setNewSocialPlatform('');
      setNewSocialUrl('');
    }
  };

  const deleteSocialLink = (linkId: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== linkId));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!pageData.tags.includes(tagInput.trim())) {
        setPageData({ ...pageData, tags: [...pageData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPageData({ ...pageData, tags: pageData.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={handleCancel}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base sm:text-lg font-semibold">Edit your page</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            value={pageData.visibility}
            onChange={(e) => setPageData({ ...pageData, visibility: e.target.value as 'public' | 'free' | 'paid' })}
            className="bg-gray-700 border border-gray-600 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm"
          >
            <option value="public">Public</option>
            <option value="free">Free member</option>
            <option value="paid">Paid member</option>
          </select>
          <Button variant="outline" onClick={handleCancel} className="bg-transparent border-gray-600 hidden sm:inline-flex">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={updateUserMutation.isPending}
            className="bg-white text-black hover:bg-gray-100 text-sm sm:text-base px-3 sm:px-4 disabled:opacity-50"
          >
            {updateUserMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Settings */}
        <div className={`w-full lg:w-80 bg-gray-800 border-r border-gray-700 p-4 lg:p-6 max-h-screen overflow-y-auto ${showPreview ? 'hidden lg:block' : 'block'}`}>
          {/* Details Section */}
          <div className="mb-8">
            <button className="flex items-center justify-between w-full text-left py-2">
              <span className="font-medium">Details</span>
            </button>
          </div>

          {/* Page name */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Page name</label>
            <Input
              value={pageData.pageName}
              onChange={(e) => setPageData({ ...pageData, pageName: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter page name"
            />
          </div>

          {/* Cover Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            <p className="text-sm text-gray-400 mb-3">We recommend 1920 x 400px for best results</p>
            <div className="space-y-3">
              <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                {coverImageUrl ? (
                  <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 text-sm">No cover image</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                  id="cover-upload"
                />
                <label htmlFor="cover-upload">
                  <Button variant="outline" className="bg-gray-700 border-gray-600 cursor-pointer" asChild>
                    <span>Upload cover image</span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* Profile photo */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Profile photo</label>
            <p className="text-sm text-gray-400 mb-3">We recommend a square image at least 1024 by 1024px</p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden" style={{ backgroundColor: selectedColor }}>
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {pageData.pageName.charAt(0).toUpperCase() || 'A'}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-upload"
                />
                <label htmlFor="profile-upload">
                  <Button variant="outline" className="bg-gray-700 border-gray-600 cursor-pointer" asChild>
                    <span>Upload image</span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* Theme colour */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Theme colour</h4>
            <p className="text-sm text-gray-400 mb-4">Options are automatically pulled from your photo</p>
            
            <button 
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="text-blue-400 text-sm mb-4 hover:text-blue-300"
            >
              Choose a custom colour
            </button>
            
            {showColorPicker && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm">#</span>
                  <Input
                    value={selectedColor.replace('#', '')}
                    onChange={(e) => {
                      const color = `#${e.target.value}`;
                      setSelectedColor(color);
                      setPageData({ ...pageData, themeColor: color });
                    }}
                    className="bg-gray-700 border-gray-600 text-white flex-1"
                    placeholder="8017E8"
                  />
                  <div 
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
                
                {/* Color Palette */}
                <div className="grid grid-cols-6 gap-2">
                  {colorPalette.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedColor(color);
                        setPageData({ ...pageData, themeColor: color });
                      }}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        selectedColor === color ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Category</label>
            <p className="text-sm text-gray-400 mb-3">Choose a category that best describes your content</p>
            <select
              value={pageData.categoryId}
              onChange={(e) => setPageData({ ...pageData, categoryId: e.target.value })}
              disabled={categoriesLoading}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tags</label>
            <p className="text-sm text-gray-400 mb-3">Add up to 5 tags to help people discover your content</p>
            
            {/* Tag Input */}
            <div className="mb-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Type a tag and press Enter"
                maxLength={20}
                disabled={pageData.tags.length >= 5}
              />
            </div>

            {/* Display Tags */}
            {pageData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pageData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-300 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {pageData.tags.length >= 5 && (
              <p className="text-xs text-yellow-400 mt-2">Maximum 5 tags allowed</p>
            )}
          </div>

          {/* About Section */}
          <div className="mb-8">
            <button 
              onClick={() => setShowAboutModal(true)}
              className="flex items-center justify-between w-full text-left py-2 hover:text-white"
            >
              <div>
                <div className="font-medium">About</div>
                <div className="text-sm text-gray-400">Introduce yourself and your Patreon</div>
              </div>
            </button>
          </div>

          {/* Mobile Preview Button */}
          <div className="lg:hidden sticky bottom-0 bg-gray-800 pt-4 pb-2 border-t border-gray-700 -mx-4 px-4">
            <Button 
              onClick={() => setShowPreview(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Page
            </Button>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className={`flex-1 bg-gray-900 p-4 lg:p-6 ${showPreview ? 'block' : 'hidden lg:block'}`}>
          {/* Mobile Preview Header */}
          <div className="lg:hidden mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Preview</h2>
            <Button 
              onClick={() => setShowPreview(false)}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              Back to Edit
            </Button>
          </div>
          
          <div className="max-w-4xl mx-auto">

            {/* Preview Content */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Cover Image Preview - Always show placeholder or uploaded image */}
              <div className="w-full h-48 overflow-hidden bg-gray-700 flex items-center justify-center">
                {coverImageUrl ? (
                  <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Cover image will appear here</p>
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <div className="text-center mb-8">
                  <div 
                    className="w-24 h-24 rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden -mt-16 border-4 border-gray-800"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {pageData.pageName.charAt(0).toUpperCase() || 'E'}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{pageData.pageName || 'Enim sed eaque sit n'}</h1>
                  <p className="text-gray-400">0 posts</p>
                </div>

                <div className="text-center mb-8">
                  <Button 
                    className="px-8 py-2 mb-4 font-semibold"
                    style={{ 
                      backgroundColor: selectedColor,
                      color: 'white'
                    }}
                  >
                    {pageData.visibility === 'public' ? 'Join for free' : 
                     pageData.visibility === 'free' ? 'Member' : 'Paid member'}
                  </Button>
                  <div className="text-gray-400">•••</div>
                </div>

              {/* Latest post section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Latest post</h2>
                <div className="bg-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-400">This section will be shown when you add more posts.</p>
                </div>
              </div>

              {/* Recent posts section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  Recent posts
                  <span className="ml-2 text-gray-400">›</span>
                </h2>
                <div className="bg-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-400">This section will be shown when you add posts.</p>
                </div>
              </div>

              {/* Popular products section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  Popular products
                  <span className="ml-2 text-gray-400">›</span>
                </h2>
                <div className="bg-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-400">This section will be shown when you add items for sale</p>
                </div>
              </div>

              {/* Explore more section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  Explore more
                  <span className="ml-2 text-gray-400">›</span>
                </h2>
                <div className="bg-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-400">This section will be shown when you add more posts.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
                <p>$ USD • English (United States) • Report creator • Block creator</p>
                <p className="mt-1">PATREON © 2025 Patreon</p>
                <Button variant="ghost" className="mt-2 text-xs">
                  Get app
                </Button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">About</h2>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              {/* Intro Video */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Intro video</h3>
                <Input
                  placeholder="Video URL"
                  value={aboutData.introVideo}
                  onChange={(e) => setAboutData({ ...aboutData, introVideo: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Bio</h3>
                <div className="bg-gray-700 rounded-lg">
                  <Textarea
                    placeholder="Add a short bio to let people know more about who you are, what you create and why you're on Patreon."
                    value={aboutData.bio}
                    onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
                    className="bg-transparent border-0 text-white min-h-[120px] resize-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                <p className="text-sm text-gray-400 mb-4">Add your social media profiles</p>
                
                {/* Add New Social Link */}
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Platform (e.g., Instagram, Twitter)"
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                    <Input
                      placeholder="URL (e.g., https://instagram.com/username)"
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <Button 
                    onClick={addSocialLink}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>

                {/* Existing Social Links */}
                <div className="space-y-2">
                  {socialLinks.map((link) => (
                    <div key={link.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{link.platform}</div>
                        <div className="text-xs text-gray-400 truncate">{link.url}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(link.url, '_blank')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-600 h-8 w-8 p-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSocialLink(link.id)}
                          className="border-red-600 text-red-400 hover:bg-red-900/20 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAboutModal(false)}
                  className="bg-transparent border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setShowAboutModal(false)}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
