"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Application, Listing } from "@/lib/types";
import { pipelineStages } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const PAGE_SIZE = 10;

export function ApplicationTable({
  applications,
  listings,
}: {
  applications: Application[];
  listings: Listing[];
}) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");
  const [listingId, setListingId] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return applications.filter((application) => {
      const matchesQuery =
        [application.candidateName, application.trade, application.recruiter]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesStage = stage === "All" || application.stage === stage;
      const matchesListing = listingId === "All" || application.listingId === listingId;
      return matchesQuery && matchesStage && matchesListing;
    });
  }, [applications, listingId, query, stage]);

  const filterKey = `${query}|${stage}|${listingId}`;
  const [appliedFilterKey, setAppliedFilterKey] = useState(filterKey);
  if (filterKey !== appliedFilterKey) {
    setAppliedFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search candidate, trade, recruiter"
          />
          <select
            value={stage}
            onChange={(event) => setStage(event.target.value)}
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink"
          >
            <option>All</option>
            {pipelineStages.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            value={listingId}
            onChange={(event) => setListingId(event.target.value)}
            className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink"
          >
            <option value="All">All listings</option>
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.title}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        {/* Table view (md and up) */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas text-slate">
              <tr>
                <th className="px-5 py-4 font-medium">Candidate</th>
                <th className="px-5 py-4 font-medium">Trade</th>
                <th className="px-5 py-4 font-medium">Stage</th>
                <th className="px-5 py-4 font-medium">Recruiter</th>
                <th className="px-5 py-4 font-medium">Open</th>
              </tr>
            </thead>
            <tbody className="bg-surface">
              {paginated.map((application) => (
                <tr key={application.id} className="border-t border-border">
                  <td className="px-5 py-4">
                    <div className="font-medium">{application.candidateName}</div>
                    <div className="text-xs text-slate">{application.candidateEmail}</div>
                  </td>
                  <td className="px-5 py-4">{application.trade}</td>
                  <td className="px-5 py-4">
                    <Badge tone={application.stage === "Hired" ? "success" : "brand"}>
                      {application.stage}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">{application.recruiter}</td>
                  <td className="px-5 py-4">
                    <Link className="font-semibold text-navy hover:text-navy-hover" href={`/applications/${application.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card view (below md) */}
        <div className="grid gap-3 p-4 md:hidden">
          {paginated.map((application) => (
            <Link
              key={application.id}
              href={`/applications/${application.id}`}
              className="card block rounded-2xl p-4 transition hover:border-navy/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{application.candidateName}</p>
                  <p className="truncate text-xs text-slate">{application.candidateEmail}</p>
                </div>
                <Badge tone={application.stage === "Hired" ? "success" : "brand"} className="shrink-0">
                  {application.stage}
                </Badge>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-slate">Trade</dt>
                  <dd className="font-medium">{application.trade}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate">Recruiter</dt>
                  <dd className="font-medium">{application.recruiter}</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center justify-end gap-1 text-sm font-semibold text-navy">
                View <ChevronRight size={14} />
              </div>
            </Link>
          ))}
          {paginated.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border bg-canvas/60 p-6 text-center text-sm text-slate">
              No results
            </p>
          )}
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <p className="text-xs text-slate">
            {filtered.length === 0 ? "No results" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-slate transition hover:border-navy/30 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition ${
                  p === page
                    ? "bg-navy text-white"
                    : "border border-border text-slate hover:border-navy/30 hover:text-navy"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-slate transition hover:border-navy/30 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
