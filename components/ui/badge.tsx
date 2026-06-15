import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "success" | "warning" | "danger";
}

const variantStyles = {
  default:  "bg-brand-100 text-brand-700",
  outline:  "border border-ink-faint text-ink-muted",
  success:  "bg-emerald-100 text-emerald-700",
  warning:  "bg-yellow-100 text-yellow-700",
  danger:   "bg-red-100 text-red-700",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
