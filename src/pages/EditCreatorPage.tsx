import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';

export default function EditCreatorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { creatorUrl } = useParams();
  
  const [pageData, setPageData] = useState({
    pageName: user?.creatorName || '',
    profilePhoto: null as File | null,
    profileImageUrl: '',
    themeColor: '#8017E8',
    visibility: 'public' as 'public' | 'free' | 'paid'
  });

  const [selectedColor, setSelectedColor] = useState('#8017E8');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [aboutData, setAboutData] = useState({
    introVideo: '',
    bio: ''
  });
  const [profileImageUrl, setProfileImageUrl] = useState('');

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

  const handleSave = () => {
    const completePageData = {
      ...pageData,
      selectedColor,
      aboutData,
      profileImageUrl
    };
    
    console.log('=== SAVING PAGE DATA ===');
    console.log('Page Name:', completePageData.pageName);
    console.log('Profile Image URL:', completePageData.profileImageUrl);
    console.log('Theme Color:', completePageData.themeColor);
    console.log('Visibility:', completePageData.visibility);
    console.log('About Data:', completePageData.aboutData);
    console.log('Complete Data:', completePageData);
    console.log('========================');
    
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setPageData({ ...pageData, profilePhoto: file });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleCancel}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Edit your page</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={pageData.visibility}
            onChange={(e) => setPageData({ ...pageData, visibility: e.target.value as 'public' | 'free' | 'paid' })}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="public">Public</option>
            <option value="free">Free member</option>
            <option value="paid">Paid member</option>
          </select>
          <Button variant="outline" onClick={handleCancel} className="bg-transparent border-gray-600">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-100">
            Save
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Settings */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
          {/* Details Section */}
          <div className="mb-8">
            <button className="flex items-center justify-between w-full text-left py-2">
              <span className="font-medium">Details</span>
              <span className="text-gray-400">›</span>
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
            
            {/* Default color options */}
            <div className="flex space-x-2 mb-4">
              <div className="w-8 h-8 bg-gray-600 rounded border border-gray-500"></div>
            </div>
            
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
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="flex-1 bg-gray-900 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Preview Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <span className="font-semibold">{pageData.pageName || 'Page Name'}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="bg-transparent border-gray-600 text-sm">
                  Home
                </Button>
                <Button className="bg-white text-black text-sm">
                  Join for free
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <div 
                    className="w-24 h-24 rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden"
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
                      backgroundColor: pageData.visibility === 'public' ? 'white' : selectedColor,
                      color: pageData.visibility === 'public' ? 'black' : 'white'
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

            {/* Tip Section */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">💡</span>
                </div>
                <div>
                  <p className="text-white mb-2">
                    Use this space to introduce yourself and give potential members an idea of what they can expect.
                  </p>
                  <button className="text-blue-400 text-sm hover:text-blue-300">
                    More tips for your About page
                  </button>
                </div>
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="text-gray-400 hover:text-white ml-auto"
                >
                  <X size={16} />
                </button>
              </div>
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
                  {/* Toolbar */}
                  <div className="border-b border-gray-600 p-3 flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-600 rounded text-xs">&lt;/&gt;</button>
                    <button className="p-1 hover:bg-gray-600 rounded">📋</button>
                    <button className="p-1 hover:bg-gray-600 rounded font-bold">B</button>
                    <button className="p-1 hover:bg-gray-600 rounded italic">I</button>
                    <button className="p-1 hover:bg-gray-600 rounded line-through">S</button>
                    <button className="p-1 hover:bg-gray-600 rounded">≡</button>
                    <button className="p-1 hover:bg-gray-600 rounded">≣</button>
                    <button className="p-1 hover:bg-gray-600 rounded">⊞</button>
                    <button className="p-1 hover:bg-gray-600 rounded">⊟</button>
                    <button className="p-1 hover:bg-gray-600 rounded">🔗</button>
                    <button className="p-1 hover:bg-gray-600 rounded">🖼️</button>
                    <button className="p-1 hover:bg-gray-600 rounded">🎥</button>
                    <button className="p-1 hover:bg-gray-600 rounded">≡</button>
                  </div>
                  <Textarea
                    placeholder="Add a short bio to let people know more about who you are, what you create and why you're on Patreon."
                    value={aboutData.bio}
                    onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
                    className="bg-transparent border-0 text-white min-h-[120px] resize-none focus:ring-0"
                  />
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
