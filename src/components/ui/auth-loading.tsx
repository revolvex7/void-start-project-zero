import React from 'react';
import { Skeleton } from './skeleton';

export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <Skeleton className="h-12 w-48 mx-auto mb-4 bg-gray-800" />
          <Skeleton className="h-4 w-64 mx-auto bg-gray-800" />
        </div>

        {/* Loading Card */}
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="space-y-6">
            {/* Animated pulse circles */}
            <div className="flex justify-center items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>

            {/* Loading text */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">Preparing your experience...</p>
            </div>

            {/* Form skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-gray-700" />
              <Skeleton className="h-12 w-full bg-gray-700" />
              <Skeleton className="h-12 w-full bg-gray-700" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <Skeleton className="h-3 w-40 mx-auto bg-gray-800" />
          <Skeleton className="h-3 w-32 mx-auto bg-gray-800" />
        </div>
      </div>
    </div>
  );
}
