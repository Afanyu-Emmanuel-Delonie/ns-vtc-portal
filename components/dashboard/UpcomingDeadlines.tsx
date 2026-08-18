import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { DeadlineListing } from "@/lib/queries/stats";

export function UpcomingDeadlines({ deadlines }: { deadlines: DeadlineListing[] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Closing soon</h3>
        <span className="text-xs text-slate">Next 14 days</span>
      </div>
      {deadlines.length === 0 ? (
        <p className="text-sm text-slate">No listings closing in the next 14 days.</p>
      ) : (
        <div className="grid gap-2">
          {deadlines.map((d) => (
            <Link
              key={d.id}
              href={`/listings/${d.id}`}
              className="flex items-center justify-between rounded-lg border border-border bg-canvas px-3 py-2.5 transition hover:border-navy/30 hover:bg-navy/5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{d.title}</p>
                <p className="text-xs text-slate">{d.trade} · {d.applicants} applicant{d.applicants !== 1 ? "s" : ""}</p>
              </div>
              <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                d.daysLeft <= 3 ? "bg-amber-100 text-amber-700" : "bg-canvas text-slate border border-border"
              }`}>
                {d.daysLeft === 0 ? "Today" : d.daysLeft < 0 ? "Overdue" : `${d.daysLeft}d left`}
              </span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
