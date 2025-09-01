import React from 'react';

// Skeleton pulse animation
const SkeletonPulse: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// Sidebar skeleton component
export const SidebarSkeleton: React.FC = () => (
  <aside className="w-[600px] xl:w-[600px] lg:w-[500px] md:w-[400px] sm:w-[350px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
    {/* Image Library Skeleton */}
    <div className="p-4 border-b border-gray-200">
      <SkeletonPulse className="h-4 w-32 mb-3" />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {/* Upload button skeleton */}
        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 animate-pulse"></div>
        {/* Image placeholders */}
        {[1, 2, 3].map(i => (
          <SkeletonPulse key={i} className="w-20 h-20 flex-shrink-0" />
        ))}
      </div>
    </div>

    {/* Analysis Section Skeleton */}
    <div className="p-4 border-b border-gray-200">
      <div className="bg-gray-50 rounded-lg p-4">
        <SkeletonPulse className="h-5 w-48 mb-3" />
        <SkeletonPulse className="h-3 w-64 mb-4" />
        
        {/* Tabs skeleton */}
        <div className="flex gap-2 mb-4">
          <SkeletonPulse className="h-8 w-20" />
          <SkeletonPulse className="h-8 w-20" />
          <SkeletonPulse className="h-8 w-20" />
          <SkeletonPulse className="h-8 w-20" />
        </div>
        
        {/* Content area skeleton */}
        <div className="space-y-3">
          <SkeletonPulse className="h-10 w-full" />
          <SkeletonPulse className="h-10 w-full" />
          <SkeletonPulse className="h-20 w-full" />
        </div>
      </div>
    </div>

    {/* Generate Button Skeleton */}
    <div className="p-4">
      <SkeletonPulse className="h-10 w-48 mx-auto" />
    </div>
  </aside>
);

// Workspace skeleton component
export const WorkspaceSkeleton: React.FC = () => (
  <main className="flex-1 flex flex-col overflow-hidden">
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Title skeleton */}
        <SkeletonPulse className="h-8 w-64 mx-auto mb-3" />
        
        {/* Subtitle skeleton */}
        <SkeletonPulse className="h-4 w-80 mx-auto mb-8" />
        
        {/* Upload area skeleton */}
        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 animate-pulse flex items-center justify-center">
          <div className="space-y-2">
            <SkeletonPulse className="h-12 w-12 mx-auto rounded-full" />
            <SkeletonPulse className="h-4 w-32 mx-auto" />
            <SkeletonPulse className="h-3 w-24 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  </main>
);

// Complete app skeleton
export const AppSkeleton: React.FC = () => (
  <div className="h-screen flex flex-col bg-gray-50">
    {/* Header skeleton */}
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-8 w-32" />
        <SkeletonPulse className="h-6 w-48" />
      </div>
    </header>

    {/* Main content */}
    <div className="flex-1 flex overflow-hidden">
      <SidebarSkeleton />
      <WorkspaceSkeleton />
    </div>
  </div>
);