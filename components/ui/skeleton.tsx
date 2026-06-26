/**
 * @file Skeleton component for loading states.
 * @remarks Uses Tailwind CSS animation for pulsing placeholder effect.
 */

import { cn } from "@/lib/utils"

/**
 * Props for the Skeleton component.
 *
 * @public
 */
interface SkeletonProps extends React.ComponentProps<"div"> {
  /** Optional additional Tailwind classes */
  className?: string
}

/**
 * Skeleton placeholder component for loading states.
 *
 * @remarks
 * Uses Tailwind CSS `animate-pulse` and `bg-muted` for a pulsing
 * placeholder effect. Commonly used in `BookCatalog` during initial data fetch.
 *
 * @param props - Component props
 * @param props.className - Additional Tailwind CSS classes for size/position
 *
 * @example
 * ```tsx
 * <Skeleton className="h-6 w-3/4" />
 * <Skeleton className="h-4 w-1/3" />
 * <Skeleton className="h-16 w-full" />
 * ```
 *
 * @public
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
