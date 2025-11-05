import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedSidebar } from '@/components/layout/UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Menu,
  X,
  Upload,
  Loader2,
  TrendingUp,
  Users,
  Heart,
  Clock
} from 'lucide-react';
import { eventAPI, commonAPI, membershipAPI } from '@/lib/api';
import type { Event } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Events() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [memberships, setMemberships] = useState<any[]>([]);

  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    eventDate: '',
    liveStreamLink: '',
    memberShipId: '',
    isFree: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Analytics calculations
  const futureEvents = events.filter(event => {
    if (!event.eventDate) return false;
    return new Date(event.eventDate) > new Date();
  });
  const pastEvents = events.filter(event => {
    if (!event.eventDate) return false;
    return new Date(event.eventDate) <= new Date();
  });
  const totalInterested = events.reduce((sum, event) => sum + (event.interestedCount || 0), 0);

  // Fetch events and memberships on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [eventsRes, membershipsRes] = await Promise.all([
          eventAPI.getAll(),
          membershipAPI.getAll()
        ]);
        setEvents(eventsRes.data || []);
        setMemberships(membershipsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({
          title: "Failed to load data",
          description: "Could not fetch your events. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
          variant: "success",
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
          variant: "success",
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

  const handleCreateEvent = async () => {
    if (!newEvent.name) return;

    setIsSubmitting(true);
    try {
      const eventData = {
        name: newEvent.name,
        description: newEvent.description || undefined,
        eventDate: newEvent.eventDate || undefined,
        mediaUrl: uploadedImageUrl || undefined,
        liveStreamLink: newEvent.liveStreamLink || undefined,
        isFree: newEvent.memberShipId === '' || newEvent.memberShipId === 'free' ? true : false,
        memberShipId: (newEvent.memberShipId === '' || newEvent.memberShipId === 'free') ? undefined : newEvent.memberShipId,
      };

      await eventAPI.create(eventData);
      
      // Fetch updated events list
      const eventsRes = await eventAPI.getAll();
      setEvents(eventsRes.data || []);

      toast({
        title: "Event created!",
        description: "Your event has been created successfully.",
        variant: "success",
      });

      // Reset form
      setNewEvent({ name: '', description: '', eventDate: '', liveStreamLink: '', memberShipId: '', isFree: true });
      setImageFile(null);
      setImagePreview(null);
      setUploadedImageUrl(null);
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Failed to create event:', error);
      toast({
        title: "Failed to create event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      name: event.name,
      description: event.description || '',
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : '',
      liveStreamLink: event.liveStreamLink || '',
      memberShipId: event.memberShipId || 'free',
      isFree: event.isFree !== undefined ? event.isFree : true
    });
    setImagePreview(event.mediaUrl || null);
    setImageFile(null);
    setUploadedImageUrl(event.mediaUrl || null);
    setShowEditModal(true);
    setShowCreateModal(false);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !newEvent.name) return;

    setIsSubmitting(true);
    try {
      const mediaUrl = uploadedImageUrl !== null ? uploadedImageUrl : editingEvent.mediaUrl;

      const eventData = {
        name: newEvent.name,
        description: newEvent.description || undefined,
        eventDate: newEvent.eventDate || undefined,
        mediaUrl: mediaUrl || undefined,
        liveStreamLink: newEvent.liveStreamLink || undefined,
        isFree: newEvent.memberShipId === '' || newEvent.memberShipId === 'free' ? true : false,
        memberShipId: (newEvent.memberShipId === '' || newEvent.memberShipId === 'free') ? undefined : newEvent.memberShipId,
      };

      await eventAPI.update(editingEvent.id, eventData);
      
      // Fetch updated events list
      const eventsRes = await eventAPI.getAll();
      setEvents(eventsRes.data || []);

      toast({
        title: "Event updated!",
        description: "Your event has been updated successfully.",
        variant: "success",
      });

      // Reset form
      setEditingEvent(null);
      setNewEvent({ name: '', description: '', eventDate: '', liveStreamLink: '', memberShipId: '', isFree: true });
      setImageFile(null);
      setImagePreview(null);
      setUploadedImageUrl(null);
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Failed to update event:', error);
      toast({
        title: "Failed to update event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteDialog(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      await eventAPI.delete(eventToDelete.id);
      
      // Fetch updated events list
      const eventsRes = await eventAPI.getAll();
      setEvents(eventsRes.data || []);

      toast({
        title: "Event deleted",
        description: "Your event has been deleted successfully.",
        variant: "success",
      });

      setShowDeleteDialog(false);
      setEventToDelete(null);
    } catch (error: any) {
      console.error('Failed to delete event:', error);
      toast({
        title: "Failed to delete event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleInterest = async (eventId: string) => {
    try {
      await eventAPI.toggleInterest(eventId);
      
      // Refresh events to get updated interest count
      const eventsRes = await eventAPI.getAll();
      setEvents(eventsRes.data || []);
    } catch (error: any) {
      console.error('Failed to toggle interest:', error);
      toast({
        title: "Failed to update interest",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingEvent(null);
    setNewEvent({ name: '', description: '', eventDate: '', liveStreamLink: '', memberShipId: '', isFree: true });
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
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
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => setShowMobileSidebar(!showMobileSidebar)} 
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-lg font-semibold">Events</h1>
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
            <h1 className="text-3xl font-bold mb-2">Events</h1>
            <p className="text-gray-400">Create and manage events for your fans</p>
          </div>

          {/* Analytics Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{events.length}</h3>
                  <p className="text-gray-400 text-sm">Total Events</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{futureEvents.length}</h3>
                  <p className="text-gray-400 text-sm">Upcoming</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{totalInterested}</h3>
                  <p className="text-gray-400 text-sm">Total Interested</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{pastEvents.length}</h3>
                  <p className="text-gray-400 text-sm">Past Events</p>
                </div>
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Events</h2>
              <Button 
                onClick={() => {
                  setShowCreateModal(true);
                  setShowEditModal(false);
                  setEditingEvent(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-700 rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-48 bg-gray-600" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4 bg-gray-600" />
                      <Skeleton className="h-4 w-full bg-gray-600" />
                      <Skeleton className="h-4 w-2/3 bg-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
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
                    setEditingEvent(null);
                    setNewEvent({ name: '', description: '', eventDate: '', liveStreamLink: '', memberShipId: '', isFree: true });
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
                  <div key={event.id} className="bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
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
                          onClick={() => handleDeleteClick(event)}
                          className="p-2 bg-red-900/80 rounded-lg hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description || 'No description'}</p>
                      <div className="flex items-center text-blue-400 text-sm mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatEventDate(event.eventDate)}
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleToggleInterest(event.id)}
                          className="flex items-center space-x-2 text-sm hover:text-blue-400 transition-colors"
                        >
                          <Heart 
                            className={`w-5 h-5 ${event.isInterested ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                          />
                          <span className={event.isInterested ? 'text-red-400' : 'text-gray-400'}>
                            {event.interestedCount || 0} interested
                          </span>
                        </button>
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

              {/* Live Stream Link */}
              <div>
                <label className="block text-sm font-medium mb-2">Live Stream Link (Optional)</label>
                <Input
                  value={newEvent.liveStreamLink}
                  onChange={(e) => setNewEvent({ ...newEvent, liveStreamLink: e.target.value })}
                  placeholder="e.g., https://youtube.com/live/..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Membership Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Access Level</label>
                <Select
                  value={newEvent.memberShipId || 'free'}
                  onValueChange={(value) => setNewEvent({ ...newEvent, memberShipId: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="free" className="text-white hover:bg-gray-600">
                      Free - Everyone can attend
                    </SelectItem>
                    {memberships.map((membership) => (
                      <SelectItem 
                        key={membership.id} 
                        value={membership.id}
                        className="text-white hover:bg-gray-600"
                      >
                        {membership.name} - {membership.currency} {membership.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-2">
                  {newEvent.memberShipId === 'free' || !newEvent.memberShipId
                    ? 'This event is free for everyone'
                    : 'Only members with this tier can access this event'}
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Event Image</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-gray-600 bg-gray-700/50'
                  }`}
                >
                  {isUploadingImage ? (
                    <div className="space-y-4">
                      <div className="w-full h-48 bg-gray-600 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                          <p className="text-gray-300 text-sm">Uploading image...</p>
                        </div>
                      </div>
                    </div>
                  ) : imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {uploadedImageUrl && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                            <span>✓</span>
                            <span>Uploaded</span>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setUploadedImageUrl(null);
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
                          <span className="text-blue-400 hover:text-blue-300 underline">
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
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                  className="bg-transparent border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={showEditModal ? handleUpdateEvent : handleCreateEvent}
                  disabled={!newEvent.name || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {showEditModal ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    showEditModal ? 'Update Event' : 'Create Event'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete "{eventToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setEventToDelete(null);
              }}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteEvent}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
