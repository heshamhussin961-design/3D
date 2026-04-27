import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names with conflict resolution.
 *
 * Combines `clsx` (conditional class composition) with `tailwind-merge`
 * (deduplication of conflicting Tailwind utilities), so the last one wins.
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-gold', 'px-4') // 'py-1 bg-gold px-4'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
