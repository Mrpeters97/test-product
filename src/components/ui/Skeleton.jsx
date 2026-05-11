import { cn } from '../../lib/utils'

export default function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--border-radius-md,6px)] bg-gray-100',
        className
      )}
    />
  )
}
