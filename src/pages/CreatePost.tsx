import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  MoreHorizontal, 
  Eye, 
  Video, 
  Mic, 
  Image as ImageIcon, 
  Link, 
  Paperclip,
  ChevronDown,
  Globe,
  Lock,
  ChevronRight,
  Plus,
  ToggleLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();
  const { creatorUrl } = useParams();
  const [selectedContentType, setSelectedContentType] = useState<string>('');
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [accessType, setAccessType] = useState<'free' | 'paid'>('free');

  const handleContentTypeClick = (type: string) => {
    setSelectedContentType(type);
    if (type === 'video' || type === 'audio') {
      setShowMediaUpload(true);
    }
  };

  const goBack = () => {
    navigate(`/c/${creatorUrl}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Email Verification Banner */}
      <div className="bg-gray-900 px-6 py-3 flex items-center justify-between border-b border-gray-800">
        <span className="text-sm text-gray-300">Please verify your email address</span>
        <Button variant="outline" size="sm" className="bg-white text-black border-white hover:bg-gray-100">
          Verify email
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={goBack} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
          <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
            <Eye className="w-4 h-4 mr-2" />
            Preview post
          </Button>
          <Button className="bg-white text-black hover:bg-gray-100">
            Publish
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Content Type Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              variant="outline" 
              onClick={() => handleContentTypeClick('video')}
              className={`bg-gray-800 border-gray-700 text-white hover:bg-gray-700 ${
                selectedContentType === 'video' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleContentTypeClick('audio')}
              className={`bg-gray-800 border-gray-700 text-white hover:bg-gray-700 ${
                selectedContentType === 'audio' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Mic className="w-4 h-4 mr-2" />
              Audio
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleContentTypeClick('image')}
              className={`bg-gray-800 border-gray-700 text-white hover:bg-gray-700 ${
                selectedContentType === 'image' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleContentTypeClick('link')}
              className={`bg-gray-800 border-gray-700 text-white hover:bg-gray-700 ${
                selectedContentType === 'link' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Link className="w-4 h-4 mr-2" />
              Link
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleContentTypeClick('attachment')}
              className={`bg-gray-800 border-gray-700 text-white hover:bg-gray-700 ${
                selectedContentType === 'attachment' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Attachment
            </Button>
            <Button 
              variant="outline" 
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              More
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Media Upload Area */}
          {showMediaUpload && (
            <div className="mb-6">
              <div className="relative bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowMediaUpload(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl">↑</div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Media guidelines</h3>
                  <p className="text-sm text-gray-400">
                    Drop an image, video or audio file as the main content of your post.
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <button className="text-blue-400 hover:underline">Browse</button>
                  <span className="text-gray-400">,</span>
                  <button className="text-blue-400 hover:underline">embed URL</button>
                  <span className="text-gray-400">or</span>
                  <button className="text-blue-400 hover:underline">connect Vimeo</button>
                </div>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div className="mb-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="bg-transparent border-0 text-2xl font-semibold text-white placeholder-gray-500 px-0 focus:ring-0"
            />
          </div>

          {/* Content Area */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Plus className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Start writing...</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-900 p-6 border-l border-gray-800">
          <h3 className="text-lg font-semibold mb-6">Settings</h3>

          {/* Audience Settings */}
          <div className="mb-6">
            <h4 className="font-medium mb-4">Audience</h4>
            
            <div className="space-y-3">
              {/* Free Access */}
              <div className={`p-3 rounded-lg border cursor-pointer ${
                accessType === 'free' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-700 hover:border-gray-600'
              }`} onClick={() => setAccessType('free')}>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                    {accessType === 'free' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium">Free access</div>
                    <div className="text-sm text-gray-400">Allow everyone to access this post and discover your work.</div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 justify-between">
                More options
                <ChevronRight className="w-4 h-4" />
              </Button>

              {/* Paid Access */}
              <div className={`p-3 rounded-lg border cursor-pointer ${
                accessType === 'paid' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-700 hover:border-gray-600'
              }`} onClick={() => setAccessType('paid')}>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center">
                    {accessType === 'paid' && <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                  </div>
                  <Lock className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium">Paid access</div>
                    <div className="text-sm text-gray-400">Limit access to paid members and people who purchase this post.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Settings */}
          <div className="space-y-4">
            <Button variant="outline" className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 justify-between">
              Emails and notifications
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div>
              <h4 className="font-medium mb-3">Add to collection</h4>
              <Button variant="outline" className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Create collection
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Make this a Drop</span>
              <ToggleLeft className="w-8 h-8 text-gray-400" />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Set publish date</span>
              <ToggleLeft className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
