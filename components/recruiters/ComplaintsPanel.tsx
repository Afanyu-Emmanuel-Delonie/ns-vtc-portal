"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Plus, X } from "lucide-react";
import type { Complaint } from "@/lib/types";
import { addComplaint, resolveComplaint } from "@/lib/queries/recruiters";
import { useRouter } from "next/navigation";

const SEVERITY_STYLES: Record<Complaint["severity"], string> = {
  low: "bg-amber-50 text-amber-700 border-amber-200",
  medium: "bg-orange-50 text-orange-700 border-orange-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

export function ComplaintsPanel({
  recruiterId,
  complaints: initial,
}: {
  recruiterId: string;
  complaints: Complaint[];
}) {
  const router = useRouter();
  const [complaints, setComplaints] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ note: "", severity: "low" as Complaint["severity"], reportedBy: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.note.trim()) return;
    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      note: form.note.trim(),
      severity: form.severity,
      reportedBy: form.reportedBy.trim() || "Admin",
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    await addComplaint(recruiterId, { note: newComplaint.note, severity: newComplaint.severity, reportedBy: newComplaint.reportedBy });
    setComplaints([newComplaint, ...complaints]);
    setForm({ note: "", severity: "low", reportedBy: "" });
    setAdding(false);
    router.refresh();
  };

  const handleResolve = async (id: string) => {
    await resolveComplaint(recruiterId, id);
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, resolved: true } : c));
    router.refresh();
  };

  const open = complaints.filter((c) => !c.resolved);
  const resolved = complaints.filter((c) => c.resolved);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Complaints</h2>
          {open.length > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              {open.length} open
            </span>
          )}
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-slate transition hover:border-navy/30 hover:text-navy"
        >
          {adding ? <X size={13} /> : <Plus size={13} />}
          {adding ? "Cancel" : "Log complaint"}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="grid gap-3 rounded-xl border border-border bg-canvas p-4">
          <textarea
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="Describe the complaint…"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-slate">Severity</label>
              <select
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as Complaint["severity"] }))}
                className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-navy"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-slate">Reported by</label>
              <input
                value={form.reportedBy}
                onChange={(e) => setForm((f) => ({ ...f, reportedBy: e.target.value }))}
                placeholder="Admin"
                className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-navy"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!form.note.trim()}
              className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:opacity-40"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {complaints.length === 0 && !adding && (
        <p className="text-sm text-slate">No complaints on record.</p>
      )}

      {open.length > 0 && (
        <div className="grid gap-2">
          {open.map((c) => (
            <div key={c.id} className={`flex gap-3 rounded-xl border p-4 ${SEVERITY_STYLES[c.severity]}`}>
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold capitalize">{c.severity} severity</span>
                  <span className="text-xs opacity-70">
                    {c.reportedBy} · {new Date(c.createdAt).toLocaleDateString("en-RW", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="mt-1 text-sm">{c.note}</p>
              </div>
              <button
                onClick={() => handleResolve(c.id)}
                className="shrink-0 rounded-lg border border-current px-2.5 py-1 text-xs font-semibold opacity-70 transition hover:opacity-100"
              >
                Resolve
              </button>
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-xs font-semibold text-slate hover:text-ink">
            {resolved.length} resolved complaint{resolved.length !== 1 ? "s" : ""}
          </summary>
          <div className="mt-2 grid gap-2">
            {resolved.map((c) => (
              <div key={c.id} className="flex gap-3 rounded-xl border border-border bg-canvas p-4 opacity-60">
                <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold capitalize text-slate">{c.severity} · Resolved</span>
                    <span className="text-xs text-slate">{c.reportedBy} · {new Date(c.createdAt).toLocaleDateString("en-RW", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
