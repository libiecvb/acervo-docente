import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names using clsx and tailwind-merge.
 *
 * @remarks
 * This utility combines the conditional class name handling of clsx
 * with Tailwind CSS conflict resolution from tailwind-merge.
 * Later classes override earlier ones when they target the same CSS property.
 *
 * @param inputs - Class values to merge (strings, objects, arrays, etc.)
 * @returns Merged class name string with Tailwind conflicts resolved
 *
 * @example
 * ```tsx
 * <div className={cn('base-class', condition && 'conditional-class', 'tw-class')}>
 * ```
 *
 * @public
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
