const PropertySkeleton = () => {
  return (
    <div className="group relative overflow-hidden rounded-none border border-border/30 bg-card transition-all duration-700 hover:border-accent/50">
      {/* Image Skeleton */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-card via-background to-card animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent skeleton-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-8 space-y-6">
        {/* Title Skeleton */}
        <div className="space-y-3">
          <div className="h-7 bg-gradient-to-r from-card via-accent/10 to-card rounded animate-pulse w-3/4"></div>
          <div className="h-7 bg-gradient-to-r from-card via-accent/10 to-card rounded animate-pulse w-1/2"></div>
        </div>

        {/* Features Skeleton */}
        <div className="flex items-center gap-6 pt-4 border-t border-border/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent/20 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-accent/10 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent/20 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-accent/10 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent/20 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-accent/10 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Location Skeleton */}
        <div className="flex items-start gap-2 pt-2">
          <div className="w-5 h-5 bg-accent/20 rounded animate-pulse mt-0.5"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full bg-accent/10 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-accent/10 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Price Skeleton */}
        <div className="pt-4 border-t border-border/20">
          <div className="h-8 w-40 bg-gradient-to-r from-accent/20 via-accent/30 to-accent/20 rounded animate-pulse"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-14 w-full bg-gradient-to-r from-card via-accent/10 to-card rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default PropertySkeleton;
