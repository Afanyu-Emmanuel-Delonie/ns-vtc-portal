"use client";

import Link from "next/link";
import { useState } from "react";
import { PlusCircle, Mail, Phone, Briefcase, Users, TrendingUp, AlertTriangle } from "lucide-react";
import type { Recruiter } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { AddRecruiterModal } from "@/components/recruiters/AddRecruiterModal";

export function RecruitersList({ recruiters: initial }: { recruiters: Recruiter[] }) {
  const [recruiters] = useState(initial);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="grid gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Recruiters</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Staff & workload</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-hover"
          >
            <PlusCircle size={16} />
            Add recruiter
          </button>
        </div>

        <div className="grid gap-3">
          {recruiters.map((r) => {
            const openComplaints = r.complaints.filter((c) => !c.resolved).length;
            return (
              <Card key={r.id} className="flex flex-col gap-3 px-4 py-4 transition hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                {/* Avatar */}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/8 text-lg font-bold text-navy">
                  {r.name.charAt(0)}
                </span>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{r.name}</p>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-slate">{r.role}</span>
                    {openComplaints > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                        <AlertTriangle size={11} />
                        {openComplaints} complaint{openComplaints !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate">
                    <span className="inline-flex items-center gap-1"><Mail size={11} />{r.email}</span>
                    {r.phone && <span className="inline-flex items-center gap-1"><Phone size={11} />{r.phone}</span>}
                  </div>
                  {/* Stats visible on mobile inline */}
                  <div className="mt-2 flex items-center gap-4 sm:hidden">
                    <span className="text-xs text-slate">Workload <strong className="text-ink">{r.workload}</strong></span>
                    <span className="text-xs text-slate">Active <strong className="text-ink">{r.activeApplications}</strong></span>
                    <span className="text-xs text-slate">Placed <strong className="text-ink">{r.placedCandidates}</strong></span>
                  </div>
                </div>

                {/* Stats — desktop */}
                <div className="hidden items-center gap-6 sm:flex">
                  <Stat icon={<Briefcase size={13} />} label="Workload" value={r.workload} />
                  <Stat icon={<Users size={13} />} label="Active" value={r.activeApplications} />
                  <Stat icon={<TrendingUp size={13} />} label="Placed" value={r.placedCandidates} />
                </div>

                <Link
                  href={`/recruiters/${r.id}`}
                  className="self-end rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink transition hover:border-navy/30 hover:text-navy sm:ml-2 sm:self-auto sm:shrink-0"
                >
                  View
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {showModal && <AddRecruiterModal onClose={() => setShowModal(false)} />}
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-xs text-slate">
        {icon}
        {label}
      </div>
      <p className="font-heading text-lg font-bold tabular-nums">{value}</p>
    </div>
  );
}
