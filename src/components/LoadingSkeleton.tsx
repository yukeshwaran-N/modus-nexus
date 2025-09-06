import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingSkeleton() {
  return (
    <Card className="law-enforcement-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Table header skeleton */}
          <div className="flex items-center space-x-4 p-3 border-b">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
          
          {/* Table rows skeleton */}
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center space-x-4 p-3">
              {Array.from({ length: 9 }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-16" />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}