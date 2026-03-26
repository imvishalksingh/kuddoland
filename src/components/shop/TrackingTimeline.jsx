import { cn } from "../../utils/cn";

export function TrackingTimeline({ events }) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.label} className="flex gap-4">
          <div
            className={cn(
              "mt-1 h-3 w-3 rounded-full",
              event.status === "done" && "bg-emerald-500",
              event.status === "current" && "bg-brand-coral ring-4 ring-orange-100",
              event.status === "upcoming" && "bg-slate-200"
            )}
          />
          <div>
            <p className="font-semibold text-brand-ink">{event.label}</p>
            <p className="text-sm text-slate-500">{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
