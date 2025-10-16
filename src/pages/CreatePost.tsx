import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  X, 
  Eye, 
  Video, 
  Mic, 
  Image as ImageIcon, 
  Paperclip,
  Globe,
  Lock,
  Upload,
  Play,
  Trash2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useUserRole } from '@/contexts/UserRoleContext';
import { postAPI, CreatePostData, MediaFile as APIMediaFile } from '@/lib/api';

interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  name: string;
  size?: number;
  thumbnail?: string;
}

interface InlineImage {
  id: string;
  url: string;
  position: number;
}

export default function CreatePost() {
  const navigate = useNavigate();
  const { creatorUrl } = useParams();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');
  const { currentRole } = useUserRole();
  
  // File upload refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Refs for content editing
  const contentRef = useRef<HTMLDivElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [accessType, setAccessType] = useState<'free' | 'paid'>('free');
  const [isEditing, setIsEditing] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [inlineImages, setInlineImages] = useState<InlineImage[]>([]);
  const [showInlineImageUpload, setShowInlineImageUpload] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Mock post data for editing
  const mockPostData = {
    '1': { title: 'Voluptatem ducimus', content: 'Reiciendis ea exerci.', accessType: 'free' as const },
    '2': { title: 'Behind the scenes content', content: 'Here\'s what goes on behind the camera...', accessType: 'paid' as const },
    '3': { title: 'Monthly update video', content: 'This month has been incredible...', accessType: 'free' as const },
    '4': { title: 'Upcoming project announcement', content: 'I\'m excited to share...', accessType: 'free' as const },
    '5': { title: 'Q&A session recap', content: 'Thank you for all the great questions...', accessType: 'paid' as const }
  };

  // Load post data if editing
  useEffect(() => {
    if (postId && mockPostData[postId as keyof typeof mockPostData]) {
      const postData = mockPostData[postId as keyof typeof mockPostData];
      setTitle(postData.title);
      setContent(postData.content);
      setAccessType(postData.accessType);
      setIsEditing(true);
    }
  }, [postId]);

  const goBack = () => {
    if (currentRole === 'creator') {
      navigate('/library');
    } else {
      navigate('/dashboard');
    }
  };

  // File upload handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio' | 'file') => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMedia: MediaFile = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          url: e.target?.result as string,
          name: file.name,
          size: file.size,
        };
        setMediaFiles(prev => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (id: string) => {
    setMediaFiles(prev => prev.filter(m => m.id !== id));
  };

  const handleVideoUrlSubmit = () => {
    if (!videoUrl.trim()) return;
    
    const newMedia: MediaFile = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'video',
      url: videoUrl,
      name: 'Embedded Video',
    };
    setMediaFiles(prev => [...prev, newMedia]);
    setVideoUrl('');
    setShowVideoUrlInput(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Text formatting functions with active state tracking
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
    if (document.queryCommandState('insertOrderedList')) formats.add('ol');
    setActiveFormats(formats);
  };

  const handleBold = () => applyFormatting('bold');
  const handleItalic = () => applyFormatting('italic');
  const handleUnorderedList = () => applyFormatting('insertUnorderedList');
  const handleOrderedList = () => applyFormatting('insertOrderedList');
  const handleQuote = () => applyFormatting('formatBlock', 'blockquote');
  const handleCode = () => applyFormatting('formatBlock', 'pre');

  // Inline image upload
  const handleInlineImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const img = `<img src="${imageUrl}" alt="inline" style="max-width: 600px; height: auto; margin: 16px 0; border-radius: 8px; display: block;" />`;
      
      // Insert at cursor position
      document.execCommand('insertHTML', false, img);
      setShowInlineImageUpload(false);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content before publishing.');
      return;
    }

    setIsPublishing(true);
    try {
      // Convert MediaFile to APIMediaFile format
      const apiMediaFiles: APIMediaFile[] = mediaFiles.map(media => ({
        id: media.id,
        type: media.type,
        url: media.url,
        name: media.name,
        size: media.size
      }));

      const postData: CreatePostData = {
        title: title.trim(),
        content: contentRef.current?.innerHTML || content,
        accessType: accessType,
        tags: tags.length > 0 ? tags : undefined,
        mediaFiles: apiMediaFiles.length > 0 ? apiMediaFiles : undefined
      };

      console.log('Publishing post:', postData);
      const response = await postAPI.create(postData);
      console.log('Post created successfully:', response);
      
      // Show success message
      alert(isEditing ? 'Post updated successfully!' : 'Post published successfully!');
      goBack();
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const getPreviewData = () => {
    return {
      title,
      content: contentRef.current?.innerHTML || content,
      accessType,
      mediaFiles,
      tags
    };
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={goBack} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handlePreview} className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={isPublishing}
            className="bg-white text-black hover:bg-gray-100 disabled:opacity-50"
          >
            {isPublishing ? 'Publishing...' : (isEditing ? 'Update' : 'Publish')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-[calc(100vh-73px)]">
        {/* Main Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Title */}
          <div className="mb-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="bg-transparent border-0 text-3xl font-bold text-white placeholder-gray-600 px-0 focus:ring-0"
            />
          </div>

          {/* Text Formatting Toolbar */}
          <div className="flex items-center space-x-1 sm:space-x-2 mb-4 pb-4 border-b border-gray-800 overflow-x-auto">
            <button 
              onClick={handleBold} 
              className={`p-2 hover:bg-gray-800 rounded transition-colors ${
                activeFormats.has('bold') ? 'bg-blue-600 text-white' : 'text-gray-400'
              }`} 
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button 
              onClick={handleItalic} 
              className={`p-2 hover:bg-gray-800 rounded transition-colors ${
                activeFormats.has('italic') ? 'bg-blue-600 text-white' : 'text-gray-400'
              }`} 
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button 
              onClick={handleUnorderedList} 
              className={`p-2 hover:bg-gray-800 rounded transition-colors ${
                activeFormats.has('ul') ? 'bg-blue-600 text-white' : 'text-gray-400'
              }`} 
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={handleOrderedList} 
              className={`p-2 hover:bg-gray-800 rounded transition-colors ${
                activeFormats.has('ol') ? 'bg-blue-600 text-white' : 'text-gray-400'
              }`} 
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button onClick={handleQuote} className="p-2 hover:bg-gray-800 rounded transition-colors text-gray-400" title="Quote">
              <Quote className="w-4 h-4" />
            </button>
            <button onClick={handleCode} className="p-2 hover:bg-gray-800 rounded transition-colors text-gray-400" title="Code">
              <Code className="w-4 h-4" />
            </button>
            <div className="h-6 w-px bg-gray-700 mx-2"></div>
            <button 
              onClick={() => inlineImageInputRef.current?.click()} 
              className="p-2 hover:bg-gray-800 rounded transition-colors text-gray-400" 
              title="Insert Image"
            >
              <Plus className="w-4 h-4" />
            </button>
            <input
              ref={inlineImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleInlineImageUpload}
              className="hidden"
            />
          </div>

          {/* Content Area - Editable Div */}
          <div className="mb-6">
            <div
              ref={contentRef}
              contentEditable
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              onMouseUp={updateActiveFormats}
              onKeyUp={updateActiveFormats}
              className="bg-transparent border-0 text-white min-h-[300px] px-0 focus:outline-none"
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
              data-placeholder="Write your post content here... Share your thoughts, updates, or exclusive content with your fans."
            />
            <style>{`
              [contenteditable][data-placeholder]:empty:before {
                content: attr(data-placeholder);
                color: #6b7280;
                pointer-events: none;
              }
              [contenteditable] img {
                max-width: 600px;
                height: auto;
                margin: 16px 0;
                border-radius: 8px;
                display: block;
              }
              [contenteditable] blockquote {
                border-left: 4px solid #4b5563;
                padding-left: 16px;
                margin: 16px 0;
                color: #9ca3af;
              }
              [contenteditable] pre {
                background: #1f2937;
                padding: 12px;
                border-radius: 6px;
                overflow-x: auto;
                margin: 16px 0;
                color: #e5e7eb;
              }
              [contenteditable] ul {
                padding-left: 24px;
                margin: 12px 0;
                list-style-type: disc;
                list-style-position: outside;
              }
              [contenteditable] ul li {
                color: white;
                display: list-item;
              }
              [contenteditable] ul li::marker {
                color: white;
              }
              [contenteditable] ol {
                padding-left: 24px;
                margin: 12px 0;
                list-style-type: decimal;
                list-style-position: outside;
              }
              [contenteditable] ol li {
                color: white;
                display: list-item;
              }
              [contenteditable] ol li::marker {
                color: white;
              }
            `}</style>
          </div>

          {/* Media Attachments */}
          {mediaFiles.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Attachments</h4>
              <div className="grid grid-cols-2 gap-4">
                {mediaFiles.map((media) => (
                  <div key={media.id} className="relative bg-gray-900 border border-gray-700 rounded-lg p-3">
                    <button
                      onClick={() => removeMedia(media.id)}
                      className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    {media.type === 'image' && (
                      <img src={media.url} alt={media.name} className="w-full h-40 object-cover rounded" />
                    )}
                    {media.type === 'video' && (
                      <div className="w-full h-40 bg-gray-800 rounded flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {(media.type === 'audio' || media.type === 'file') && (
                      <div className="flex items-center space-x-3">
                        {media.type === 'audio' ? <Mic className="w-5 h-5 text-blue-400" /> : <Paperclip className="w-5 h-5 text-green-400" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{media.name}</p>
                          {media.size && <p className="text-xs text-gray-400">{(media.size / 1024 / 1024).toFixed(2)} MB</p>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video URL Input */}
          {showVideoUrlInput && (
            <div className="mb-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3">Embed Video</h4>
              <div className="flex items-center space-x-2 mb-3">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <p className="text-xs text-gray-400">
                  Supports Vimeo, YouTube, BunnyStream. Use signed/private URLs for subscriber-only content.
                </p>
              </div>
              <div className="flex space-x-2">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://vimeo.com/... or https://youtube.com/..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Button onClick={handleVideoUrlSubmit} className="bg-blue-600 hover:bg-blue-700">
                  Add
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowVideoUrlInput(false)}
                  className="text-gray-400"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Add Media Buttons */}
          <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gray-800">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e, 'image')}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e, 'video')}
              className="hidden"
            />
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => handleFileUpload(e, 'audio')}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileUpload(e, 'file')}
              className="hidden"
            />
            
            <Button 
              variant="outline" 
              onClick={() => imageInputRef.current?.click()}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Images
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowVideoUrlInput(!showVideoUrlInput)}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <Video className="w-4 h-4 mr-2" />
              Embed Video
            </Button>
            <Button 
              variant="outline" 
              onClick={() => videoInputRef.current?.click()}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button onClick={() => removeTag(tag)} className="hover:text-blue-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags (press Enter)"
                className="bg-gray-900 border-gray-700 text-white"
              />
              <Button onClick={addTag} variant="outline" className="border-gray-700">
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Fixed on desktop, bottom sheet on mobile */}
        <div className="w-full lg:w-80 bg-gray-900 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto flex-shrink-0">
          {/* Audience Settings */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4 text-white">Audience</h4>
            
            <div className="space-y-3">
              {/* Free Access */}
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  accessType === 'free' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-700 hover:border-gray-600'
                }`} 
                onClick={() => setAccessType('free')}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    {accessType === 'free' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Globe className="w-4 h-4 text-green-400" />
                      <span className="font-semibold text-white">Public</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Free for everyone. Great for growing your audience and attracting new fans.
                    </p>
                  </div>
                </div>
              </div>

              {/* Paid Access */}
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  accessType === 'paid' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-700 hover:border-gray-600'
                }`} 
                onClick={() => setAccessType('paid')}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    {accessType === 'paid' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Lock className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-white">Members Only</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Exclusive content for paying subscribers. Reward your most loyal fans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post Stats (for editing) */}
          {isEditing && (
            <div className="pt-6 border-t border-gray-800">
              <h4 className="text-lg font-semibold mb-4 text-white">Stats</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Views</span>
                  <span className="text-white font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Likes</span>
                  <span className="text-white font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Comments</span>
                  <span className="text-white font-medium">12</span>
                </div>
              </div>
            </div>
          )}

          {/* Tips & Guidelines */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h4 className="text-sm font-semibold mb-3 text-gray-400">💡 Tips for better posts</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Use high-quality images and videos</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Write engaging titles and descriptions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Add relevant tags for discoverability</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Use signed URLs for private videos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">Post Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Post Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Creator Name</h3>
                      <p className="text-sm text-gray-400">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {accessType === 'free' ? (
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        Free
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Title */}
              {title && (
                <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
              )}

              {/* Post Content */}
              {content && (
                <div 
                  className="text-gray-300 mb-6 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: contentRef.current?.innerHTML || content }}
                  style={{
                    wordBreak: 'break-word'
                  }}
                />
              )}

              {/* Media Files */}
              {mediaFiles.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {mediaFiles.map((media) => (
                      <div key={media.id} className="relative rounded-lg overflow-hidden bg-gray-800">
                        {media.type === 'image' && (
                          <img
                            src={media.url}
                            alt={media.name}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        {media.type === 'video' && (
                          <div className="relative w-full h-48 bg-gray-800 flex items-center justify-center">
                            <Play className="w-12 h-12 text-white opacity-75" />
                          </div>
                        )}
                        {media.type === 'audio' && (
                          <div className="relative w-full h-24 bg-gray-800 flex items-center justify-center">
                            <Mic className="w-8 h-8 text-white opacity-75" />
                            <span className="ml-2 text-sm text-gray-400">{media.name}</span>
                          </div>
                        )}
                        {media.type === 'file' && (
                          <div className="relative w-full h-24 bg-gray-800 flex items-center justify-center">
                            <Paperclip className="w-8 h-8 text-white opacity-75" />
                            <span className="ml-2 text-sm text-gray-400">{media.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Preview Notice */}
              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-400 font-medium">Preview Mode</p>
                    <p className="text-sm text-gray-400 mt-1">
                      This is how your post will appear to your audience. Click "Publish" to make it live.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-6 py-4 flex items-center justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Close Preview
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false);
                  handlePublish();
                }}
                disabled={isPublishing}
                className="bg-white text-black hover:bg-gray-100 disabled:opacity-50"
              >
                {isPublishing ? 'Publishing...' : (isEditing ? 'Update' : 'Publish')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
