import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  message?: string;
}

interface LearnerSkeletonProps {
  type?: 'courses' | 'assignments' | 'dashboard';
  count?: number;
}

export const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Spinner size="lg" className="text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
};

// Learner-specific skeleton loader with kid-friendly design
export const LearnerSkeleton = ({ type = 'courses', count = 3 }: LearnerSkeletonProps) => {
  if (type === 'courses') {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "kid-card p-6",
              `animate-delay-${index * 200}`
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-200 dark:bg-purple-700 animate-pulse" />
                <div>
                  <div className="h-6 bg-purple-200 dark:bg-purple-700 rounded-xl w-32 mb-2 animate-pulse" />
                  <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded-lg w-48 animate-pulse" />
                </div>
              </div>
              <div className="h-10 bg-purple-200 dark:bg-purple-700 rounded-full w-28 animate-pulse" />
            </div>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded w-20 animate-pulse" />
                <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded w-16 animate-pulse" />
              </div>
              <div className="kid-progress">
                <div className="kid-progress-bar w-2/3 animate-pulse" />
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-purple-100 dark:bg-purple-800 rounded-xl mb-2 animate-pulse" />
                  <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-16 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'assignments') {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "kid-card p-6",
              `animate-delay-${index * 100}`
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-purple-200 dark:bg-purple-700 rounded-xl w-3/4 mb-3 animate-pulse" />
                <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded w-24 animate-pulse" />
              </div>
              <div className="w-16 h-6 bg-purple-200 dark:bg-purple-700 rounded-full animate-pulse" />
            </div>

            {/* Description */}
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-full animate-pulse" />
              <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-2/3 animate-pulse" />
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-32 animate-pulse" />
              <div className="flex justify-between">
                <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-20 animate-pulse" />
                <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-16 animate-pulse" />
              </div>
            </div>

            {/* Button */}
            <div className="h-10 bg-purple-200 dark:bg-purple-700 rounded-full w-full animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "kid-card p-6 text-center",
                `animate-delay-${index * 100}`
              )}
            >
              <div className="w-12 h-12 bg-purple-200 dark:bg-purple-700 rounded-full mx-auto mb-3 animate-pulse" />
              <div className="h-6 bg-purple-200 dark:bg-purple-700 rounded-xl mb-2 animate-pulse" />
              <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded w-16 mx-auto animate-pulse" />
            </div>
          ))}
        </div>

        {/* Content Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "kid-card p-6",
                `animate-delay-${(index + 4) * 100}`
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-purple-200 dark:bg-purple-700 rounded-xl w-48 animate-pulse" />
                <div className="h-8 bg-purple-200 dark:bg-purple-700 rounded-full w-20 animate-pulse" />
              </div>
              
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-xl animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 bg-purple-100 dark:bg-purple-800 rounded w-32 mb-2 animate-pulse" />
                      <div className="h-3 bg-purple-100 dark:bg-purple-800 rounded w-24 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <LoadingSpinner />;
};
