import Link from "next/link";
import {
  Briefcase,
  Clock,
  Cog,
  Droplet,
  Flame,
  Hammer,
  HardHat,
  MapPin,
  Pencil,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Listing } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const tradeIcons: Record<string, LucideIcon> = {
  Welder: Flame,
  Electrician: Zap,
  Plumber: Droplet,
  Boilermaker: HardHat,
  Carpenter: Hammer,
  Mechanic: Cog,
};

function daysUntil(iso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function compactSalary(salary: string) {
  return salary.replace(/(\d[\d,]*)/g, (match) => {
    const n = parseInt(match.replace(/,/g, ""), 10);
    if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${+(n / 1_000).toFixed(0)}k`;
    return match;
  });
}

function postedAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export function ListingCard({ listing }: { listing: Listing }) {
  const tone =
    listing.status === "Open" ? "success" : listing.status === "Paused" ? "warning" : "neutral";
  const Icon = tradeIcons[listing.trade] ?? Briefcase;

  const daysLeft = listing.applicationDeadline ? daysUntil(listing.applicationDeadline) : null;
  const closingSoon = listing.status === "Open" && daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;
  const closingLabel = daysLeft === 0 ? "today" : daysLeft === 1 ? "tomorrow" : `${daysLeft}d left`;

  return (
    <Card className="flex flex-col gap-3 px-4 py-4 transition hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:px-5">
      {/* Top row on mobile: icon + title + badge + actions */}
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/8 text-navy sm:h-11 sm:w-11">
          <Icon size={20} />
        </span>

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{listing.title}</h3>
            <Badge tone={tone}>{listing.status}</Badge>
            {closingSoon && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                <Clock size={11} />
                Closes {closingLabel}
              </span>
            )}
          </div>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate">
            <span className="inline-flex items-center gap-1"><MapPin size={11} />{listing.location}</span>
            <span className="text-border">·</span>
            <span>{listing.employer}</span>
            <span className="text-border">·</span>
            <span className="inline-flex items-center gap-1"><Users size={11} />{listing.applicants} applicants</span>
            <span className="hidden text-border sm:inline">·</span>
            <span className="hidden sm:inline">Posted {postedAgo(listing.publishedAt)}</span>
          </p>
        </div>
      </div>

      {/* Bottom row on mobile: salary + actions */}
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-left sm:text-right">
          <span className="block text-xs text-slate">Salary</span>
          <span className="font-heading text-sm font-bold text-navy">{compactSalary(listing.salary)}</span>
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={`/listings/${listing.id}`}
            className="inline-flex items-center justify-center rounded-full bg-navy px-4 py-2 text-xs font-semibold !text-white transition hover:bg-navy-hover"
          >
            View
          </Link>
          <Link
            href={`/listings/${listing.id}/edit`}
            aria-label="Edit listing"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-slate transition hover:border-navy/30 hover:text-navy"
          >
            <Pencil size={14} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
