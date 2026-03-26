import { cn } from "../../utils/cn";

export function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition",
        variant === "primary" && "bg-brand-coral text-white hover:bg-orange-500",
        variant === "secondary" && "bg-white text-brand-ink ring-1 ring-orange-200 hover:bg-orange-50",
        className
      )}
      {...props}
    />
  );
}
