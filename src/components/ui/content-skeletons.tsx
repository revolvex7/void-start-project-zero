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

// Post Preview Skeleton
export function PostPreviewSkeleton() {
  return (
    <div className="space-y-8">
      {/* Title & Excerpt */}
      <div>
        <Skeleton className="h-10 w-3/4 bg-gray-700 mb-3" />
        <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
        <Skeleton className="h-4 w-2/3 bg-gray-700" />
      </div>

      {/* Creator Info */}
      <div className="flex items-center space-x-4">
        <Skeleton className="w-12 h-12 rounded-full bg-gray-700" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32 bg-gray-700" />
          <div className="flex space-x-4">
            <Skeleton className="h-3 w-24 bg-gray-700" />
            <Skeleton className="h-3 w-24 bg-gray-700" />
            <Skeleton className="h-3 w-24 bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {[1,2,3,4].map((i) => (
          <Skeleton key={i} className="h-6 w-16 bg-gray-700 rounded-full" />
        ))}
      </div>

      {/* Content Block */}
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className={`h-4 bg-gray-700 ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-5/6' : 'w-2/3'}`} />
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {[1,2,3].map((i) => (
          <Skeleton key={i} className="aspect-video bg-gray-700 rounded" />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 py-4 border-t border-b border-gray-700">
        <Skeleton className="h-10 w-28 bg-gray-700 rounded" />
        <Skeleton className="h-5 w-20 bg-gray-700" />
      </div>

      {/* Comments */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 bg-gray-700" />
        {[1,2,3].map((i) => (
          <div key={i} className="flex space-x-3">
            <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-700" />
              <Skeleton className="h-16 w-full bg-gray-700 rounded" />
            </div>
          </div>
        ))}
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

// Dashboard Skeleton (Fan View)
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <Skeleton className="h-8 w-64 mb-4 bg-gray-700" />
        <Skeleton className="h-4 w-96 bg-gray-700" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
              <Skeleton className="h-6 w-16 bg-gray-700 rounded" />
            </div>
            <Skeleton className="h-8 w-24 mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-32 bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Feed Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-48 bg-gray-700" />
          <Skeleton className="h-10 w-32 bg-gray-700 rounded" />
        </div>
        {[1, 2, 3].map((i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Creator Dashboard Skeleton
export function CreatorDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
        <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
        <Skeleton className="h-4 w-96 bg-white/20" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-5 w-24 bg-gray-700" />
              <Skeleton className="h-8 w-8 rounded bg-gray-700" />
            </div>
            <Skeleton className="h-9 w-20 mb-2 bg-gray-700" />
            <Skeleton className="h-3 w-32 bg-gray-700" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <Skeleton className="h-6 w-40 mb-4 bg-gray-700" />
          <Skeleton className="h-64 w-full bg-gray-700 rounded" />
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <Skeleton className="h-6 w-40 mb-4 bg-gray-700" />
          <Skeleton className="h-64 w-full bg-gray-700 rounded" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <Skeleton className="h-6 w-48 mb-4 bg-gray-700" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48 bg-gray-700" />
                <Skeleton className="h-3 w-32 bg-gray-700" />
              </div>
              <Skeleton className="h-8 w-20 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Library Page Skeleton
export function LibrarySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48 bg-gray-700" />
        <Skeleton className="h-10 w-32 bg-gray-700 rounded" />
      </div>

      {/* Search Bar */}
      <Skeleton className="h-12 w-full bg-gray-700 rounded" />

      {/* Stats */}
      <div className="flex items-center space-x-6">
        <Skeleton className="h-5 w-32 bg-gray-700" />
        <Skeleton className="h-5 w-40 bg-gray-700" />
      </div>

      {/* Posts Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-750 border-b border-gray-700">
          <Skeleton className="col-span-6 h-4 bg-gray-700" />
          <Skeleton className="col-span-2 h-4 bg-gray-700" />
          <Skeleton className="col-span-2 h-4 bg-gray-700" />
          <Skeleton className="col-span-2 h-4 bg-gray-700" />
        </div>
        
        {/* Table Rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 hover:bg-gray-750/50">
            <div className="col-span-6 flex items-center space-x-3">
              <Skeleton className="w-12 h-12 rounded bg-gray-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
                <Skeleton className="h-3 w-1/2 bg-gray-700" />
              </div>
            </div>
            <div className="col-span-2 flex items-center">
              <Skeleton className="h-6 w-16 bg-gray-700 rounded-full" />
            </div>
            <div className="col-span-2 flex items-center">
              <Skeleton className="h-4 w-24 bg-gray-700" />
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <Skeleton className="h-8 w-8 rounded bg-gray-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48 bg-gray-700" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 bg-gray-700 rounded" />
          <Skeleton className="h-10 w-10 bg-gray-700 rounded" />
          <Skeleton className="h-10 w-10 bg-gray-700 rounded" />
          <Skeleton className="h-10 w-10 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}
