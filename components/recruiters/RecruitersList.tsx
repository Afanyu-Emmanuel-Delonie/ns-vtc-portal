"use client";

import Link from "next/link";
import { useState } from "react";
import { PlusCircle, Mail, Phone, MapPin, Briefcase, TrendingUp, AlertTriangle } from "lucide-react";
import type { Employer } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { AddEmployerModal } from "@/components/recruiters/AddRecruiterModal";

export function EmployersList({ employers: initial }: { employers: Employer[] }) {
  const [employers] = useState(initial);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Employers</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Hiring companies</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-hover"
          >
            <PlusCircle size={16} />
            Add employer
          </button>
        </div>

        <div className="grid gap-3">
          {employers.length === 0 && (
            <p className="text-sm text-slate">No employers yet. Add your first hiring company.</p>
          )}
          {employers.map((e) => {
            const openComplaints = e.complaints.filter((c) => !c.resolved).length;
            return (
              <Card key={e.id} className="flex items-center gap-4 px-5 py-4 transition hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy/8 text-lg font-bold text-navy">
                  {e.name.charAt(0)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{e.name}</p>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-slate">{e.industry}</span>
                    {openComplaints > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                        <AlertTriangle size={11} />
                        {openComplaints} complaint{openComplaints !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate">
                    <span className="inline-flex items-center gap-1"><MapPin size={11} />{e.location}</span>
                    <span className="inline-flex items-center gap-1"><Mail size={11} />{e.email}</span>
                    {e.phone && <span className="inline-flex items-center gap-1"><Phone size={11} />{e.phone}</span>}
                  </div>
                </div>

                <div className="hidden items-center gap-6 sm:flex">
                  <Stat icon={<Briefcase size={13} />} label="Listings" value={e.activeListings} />
                  <Stat icon={<TrendingUp size={13} />} label="Placements" value={e.totalPlacements} />
                </div>

                <Link
                  href={`/recruiters/${e.id}`}
                  className="ml-2 shrink-0 rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink transition hover:border-navy/30 hover:text-navy"
                >
                  View
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {showModal && <AddEmployerModal onClose={() => setShowModal(false)} />}
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-xs text-slate">{icon}{label}</div>
      <p className="font-heading text-lg font-bold tabular-nums">{value}</p>
    </div>
  );
}
