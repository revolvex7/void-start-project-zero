import React from 'react';
import { Skeleton } from './skeleton';

// Creator Card Skeleton for Explore page
export function CreatorCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <Skeleton className="w-16 h-16 rounded-full bg-gray-700" />
          
          <div className="flex-1 space-y-3">
            {/* Name */}
            <Skeleton className="h-5 w-32 bg-gray-700" />
            {/* Description */}
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-4 w-3/4 bg-gray-700" />
            
            {/* Stats */}
            <div className="flex space-x-4 pt-2">
              <Skeleton className="h-4 w-20 bg-gray-700" />
              <Skeleton className="h-4 w-20 bg-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex space-x-2 mt-4">
          <Skeleton className="h-6 w-16 rounded-full bg-gray-700" />
          <Skeleton className="h-6 w-20 rounded-full bg-gray-700" />
          <Skeleton className="h-6 w-14 rounded-full bg-gray-700" />
        </div>
        
        {/* Follow Button */}
        <div className="mt-4">
          <Skeleton className="h-9 w-full bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

// Post Card Skeleton for Feed
export function PostCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 bg-gray-700" />
            <Skeleton className="h-3 w-20 bg-gray-700" />
          </div>
        </div>
        
        {/* Title */}
        <Skeleton className="h-5 w-3/4 mb-3 bg-gray-700" />
        
        {/* Content */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-3 w-full bg-gray-700" />
          <Skeleton className="h-3 w-full bg-gray-700" />
          <Skeleton className="h-3 w-2/3 bg-gray-700" />
        </div>
        
        {/* Image */}
        <Skeleton className="h-48 w-full mb-4 bg-gray-700 rounded" />
        
        {/* Actions */}
        <div className="flex items-center space-x-6">
          <Skeleton className="h-8 w-16 bg-gray-700 rounded" />
          <Skeleton className="h-8 w-16 bg-gray-700 rounded" />
          <Skeleton className="h-8 w-16 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Cover Photo */}
      <Skeleton className="w-full h-64 bg-gray-800" />
      
      <div className="max-w-6xl mx-auto px-6 -mt-16">
        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          {/* Avatar */}
          <Skeleton className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-800" />
          
          <div className="flex-1 space-y-4">
            {/* Name and actions */}
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 bg-gray-800" />
                <Skeleton className="h-4 w-32 bg-gray-800" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-24 bg-gray-800 rounded" />
                <Skeleton className="h-10 w-28 bg-gray-800 rounded" />
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex space-x-6">
              <Skeleton className="h-4 w-20 bg-gray-800" />
              <Skeleton className="h-4 w-20 bg-gray-800" />
              <Skeleton className="h-4 w-20 bg-gray-800" />
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <div className="flex space-x-8">
            <Skeleton className="h-10 w-20 bg-gray-800" />
            <Skeleton className="h-10 w-28 bg-gray-800" />
            <Skeleton className="h-10 w-20 bg-gray-800" />
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
              <Skeleton className="aspect-video bg-gray-700" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
                <Skeleton className="h-3 w-1/2 bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
      <Skeleton className="w-12 h-12 rounded-full bg-gray-700" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40 bg-gray-700" />
        <Skeleton className="h-3 w-24 bg-gray-700" />
      </div>
      <Skeleton className="h-8 w-20 bg-gray-700 rounded" />
    </div>
  );
}

// Grid Skeleton
export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CreatorCardSkeleton key={i} />
      ))}
    </div>
  );
}
