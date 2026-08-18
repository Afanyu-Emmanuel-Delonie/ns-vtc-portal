"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Inbox, PlusCircle, RotateCcw, Search } from "lucide-react";
import type { Listing } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ListingCard } from "@/components/listings/ListingCard";

type StatusFilter = "All" | Listing["status"];
type SortOption = "newest" | "applicants" | "deadline";

const statusFilters: StatusFilter[] = ["All", "Open", "Paused", "Closed"];

function daysUntil(iso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function ListingsBoard({ listings }: { listings: Listing[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [trade, setTrade] = useState("All");
  const [sort, setSort] = useState<SortOption>("newest");

  const trades = useMemo(
    () => Array.from(new Set(listings.map((listing) => listing.trade))).sort(),
    [listings],
  );

  const stats = useMemo(() => {
    const open = listings.filter((l) => l.status === "Open");
    return {
      total: listings.length,
      open: open.length,
      applicants: listings.reduce((sum, l) => sum + l.applicants, 0),
      closingSoon: open.filter((l) => l.applicationDeadline && daysUntil(l.applicationDeadline) <= 7 && daysUntil(l.applicationDeadline) >= 0)
        .length,
    };
  }, [listings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = listings.filter((listing) => {
      const matchesQuery =
        q.length === 0 ||
        [listing.title, listing.employer, listing.trade, listing.location].join(" ").toLowerCase().includes(q);
      const matchesStatus = status === "All" || listing.status === status;
      const matchesTrade = trade === "All" || listing.trade === trade;
      return matchesQuery && matchesStatus && matchesTrade;
    });

    return rows.sort((a, b) => {
      if (sort === "applicants") return b.applicants - a.applicants;
      if (sort === "deadline") {
        if (!a.applicationDeadline) return 1;
        if (!b.applicationDeadline) return -1;
        return daysUntil(a.applicationDeadline) - daysUntil(b.applicationDeadline);
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [listings, query, status, trade, sort]);

  const filtersActive = query.trim().length > 0 || status !== "All" || trade !== "All";

  const resetFilters = () => {
    setQuery("");
    setStatus("All");
    setTrade("All");
  };

  if (listings.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 py-16 text-center">
        <Inbox className="text-slate" size={28} />
        <p className="font-heading text-lg font-semibold">No listings yet</p>
        <p className="max-w-sm text-sm text-slate">
          Publish your first apprenticeship or learnership opening to start collecting applications.
        </p>
        <Button asChild className="mt-2">
          <Link href="/listings/new">
            <PlusCircle size={16} className="mr-1.5" />
            Create listing
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-5">
      <Card className="flex flex-wrap gap-x-8 gap-y-4">
        <Stat label="Total listings" value={stats.total} />
        <Stat label="Open" value={stats.open} />
        <Stat label="Total applicants" value={stats.applicants} />
        <Stat label="Closing within 7 days" value={stats.closingSoon} accent={stats.closingSoon > 0} />
      </Card>

      <Card className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, employer, trade, location"
              className="w-full rounded-2xl border border-border bg-surface py-2.5 pr-4 pl-10 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
            />
          </div>

          <select
            value={trade}
            onChange={(event) => setTrade(event.target.value)}
            className="rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition focus:border-navy"
          >
            <option value="All">All trades</option>
            {trades.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition focus:border-navy"
          >
            <option value="newest">Newest first</option>
            <option value="applicants">Most applicants</option>
            <option value="deadline">Deadline soonest</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-canvas p-1">
            {statusFilters.map((option) => {
              const count = option === "All" ? listings.length : listings.filter((l) => l.status === option).length;
              const active = status === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium tabular-nums transition ${
                    active ? "bg-navy text-white" : "text-slate hover:text-ink"
                  }`}
                >
                  {option} <span className="opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          <p className="text-sm text-slate">
            Showing <span className="font-medium text-ink">{filtered.length}</span> of {listings.length} listings
          </p>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-canvas/60 py-16 text-center">
          <Inbox className="text-slate" size={28} />
          <p className="font-heading text-lg font-semibold">No listings match your filters</p>
          <p className="max-w-sm text-sm text-slate">Try a different search term or clear the filters below.</p>
          {filtersActive && (
            <Button variant="secondary" type="button" onClick={resetFilters}>
              <RotateCcw size={14} className="mr-1.5" />
              Reset filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="min-w-[7rem]">
      <p className="text-xs font-medium tracking-wide text-slate uppercase">{label}</p>
      <p
        className={`font-heading mt-1 text-2xl font-bold tabular-nums ${accent ? "text-[#b45309]" : "text-ink"}`}
      >
        {value}
      </p>
    </div>
  );
}
