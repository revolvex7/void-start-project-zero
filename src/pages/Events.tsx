import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, X, Trash2, Menu, Edit, Upload, Loader2 } from 'lucide-react';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { staticEvents } from '@/data/staticEvents';
import { Event } from '@/types/event';
import { useToast } from '@/hooks/use-toast';
import { commonAPI } from '@/lib/api';

const Events = () => {
  const { toast } = useToast();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [events, setEvents] = useState<Event[]>(staticEvents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    eventDate: ''
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
        const uploadedUrl = await commonAPI.uploadFile(file, 'events');
        setUploadedImageUrl(uploadedUrl);
        toast({
          title: "Image uploaded",
          description: "Image has been uploaded successfully.",
        });
      } catch (error: any) {
        console.error('Failed to upload image:', error);
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload image. Please try again.",
          variant: "destructive",
        });
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
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setIsUploadingImage(true);
      try {
        const uploadedUrl = await commonAPI.uploadFile(file, 'events');
        setUploadedImageUrl(uploadedUrl);
        toast({
          title: "Image uploaded",
          description: "Image has been uploaded successfully.",
        });
      } catch (error: any) {
        console.error('Failed to upload image:', error);
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        setImageFile(null);
        setImagePreview(null);
        setUploadedImageUrl(null);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleCreateEvent = () => {
    if (!newEvent.name) return;

    const event: Event = {
      id: `event-${Date.now()}`,
      name: newEvent.name,
      description: newEvent.description,
      mediaUrl: uploadedImageUrl || undefined,
      eventDate: newEvent.eventDate || undefined,
      creatorId: 'creator-1',
      createdAt: new Date().toISOString()
    };

    setEvents([event, ...events]);
    handleCloseModals();
    toast({
      title: "Event created",
      description: "Your event has been created successfully.",
    });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !newEvent.name) return;

    const updatedEvents = events.map(e => 
      e.id === editingEvent.id 
        ? {
            ...e,
            name: newEvent.name,
            description: newEvent.description,
            eventDate: newEvent.eventDate || undefined,
            mediaUrl: uploadedImageUrl || e.mediaUrl
          }
        : e
    );

    setEvents(updatedEvents);
    handleCloseModals();
    toast({
      title: "Event updated",
      description: "Your event has been updated successfully.",
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      name: event.name,
      description: event.description || '',
      eventDate: event.eventDate || ''
    });
    setImagePreview(event.mediaUrl || null);
    setUploadedImageUrl(event.mediaUrl || null);
    setShowEditModal(true);
    setShowCreateModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast({
      title: "Event deleted",
      description: "Your event has been deleted successfully.",
    });
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingEvent(null);
    setNewEvent({ name: '', description: '', eventDate: '' });
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setIsDragging(false);
  };

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <UnifiedSidebar currentPage="events" />
      </div>

      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <UnifiedSidebar 
              currentPage="events"
              showMobileSidebar={showMobileSidebar}
              setShowMobileSidebar={setShowMobileSidebar}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold">Events</h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Events</h1>
                <p className="text-gray-400">Create and manage events for your fans</p>
              </div>
              <Button
                onClick={() => {
                  setShowCreateModal(true);
                  setShowEditModal(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            {/* Events Grid */}
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                <p className="text-gray-400 mb-4">Create your first event to engage with your fans</p>
                <Button
                  onClick={() => {
                    setShowCreateModal(true);
                    setShowEditModal(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
                    <div className="relative h-48">
                      <img 
                        src={event.mediaUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'} 
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button 
                          onClick={() => handleEditEvent(event)}
                          className="p-2 bg-gray-900/80 rounded-lg hover:bg-gray-900 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-white" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 bg-red-900/80 rounded-lg hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description || 'No description'}</p>
                      <div className="flex items-center text-blue-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatEventDate(event.eventDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Event Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{showEditModal ? 'Edit Event' : 'Create New Event'}</h2>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Event Name *</label>
                <Input
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  placeholder="e.g., Live Q&A Session"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Tell your fans about this event..."
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white resize-none"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Event Date & Time</label>
                <Input
                  type="datetime-local"
                  value={newEvent.eventDate}
                  onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Event Image</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setUploadedImageUrl(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <Loader2 className="w-8 h-8 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400 mb-2">Drag and drop an image here, or click to select</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="event-image-upload"
                      />
                      <label htmlFor="event-image-upload">
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                          onClick={() => document.getElementById('event-image-upload')?.click()}
                        >
                          Select Image
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                onClick={handleCloseModals}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={showEditModal ? handleUpdateEvent : handleCreateEvent}
                disabled={!newEvent.name || isUploadingImage}
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-700 disabled:text-gray-500"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  showEditModal ? 'Update Event' : 'Create Event'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
