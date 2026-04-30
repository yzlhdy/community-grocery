import { cn } from "../lib/cn";

export interface StatusBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-600/20",
        className,
      )}
    >
      {children}
    </span>
  );
}
