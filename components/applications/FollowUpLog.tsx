"use client";

import { useState } from "react";
import {
  FileText,
  Briefcase,
  Image,
  Phone,
  Mail,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import type { FollowUp } from "@/lib/types";
import { Card } from "@/components/ui/Card";

type FollowUpType = FollowUp["type"];

const TYPES: { value: FollowUpType; label: string; icon: LucideIcon }[] = [
  { value: "note", label: "Note", icon: MessageSquare },
  { value: "call", label: "Call", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "cv_request", label: "CV Request", icon: FileText },
  { value: "portfolio_request", label: "Portfolio Request", icon: Image },
  { value: "document_request", label: "Document Request", icon: Briefcase },
];

const TYPE_MAP = Object.fromEntries(TYPES.map((t) => [t.value, t])) as Record<FollowUpType, (typeof TYPES)[number]>;

export function FollowUpLog({
  applicationId,
  followUps,
}: {
  applicationId: string;
  followUps: FollowUp[];
}) {
  const [items, setItems] = useState(followUps);
  const [note, setNote] = useState("");
  const [type, setType] = useState<FollowUpType>("note");

  const handleAdd = () => {
    if (!note.trim()) return;
    setItems([
      {
        id: `fu-${Date.now()}`,
        note: note.trim(),
        type,
        createdAt: new Date().toISOString(),
        recruiter: "Current user",
      },
      ...items,
    ]);
    setNote("");
    setType("note");
  };

  return (
    <Card className="flex flex-col gap-5">
      <h3 className="text-base font-semibold">Activity log</h3>

      {/* Add entry */}
      <div className="grid gap-3 rounded-xl border border-border bg-canvas p-4">
        {/* Type pills */}
        <div className="flex flex-wrap gap-2">
          {TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                type === value
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-surface text-slate hover:border-navy/30 hover:text-ink"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd(); }}
          placeholder={
            type === "cv_request" ? "e.g. Requested updated CV via WhatsApp…" :
            type === "portfolio_request" ? "e.g. Asked candidate to share portfolio link…" :
            type === "document_request" ? "e.g. Requested ID copy and school certificate…" :
            type === "call" ? "e.g. Called candidate, confirmed interview time…" :
            type === "email" ? "e.g. Sent offer letter to candidate email…" :
            "Add a note…"
          }
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate">⌘ + Enter to submit</p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!note.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add entry
          </button>
        </div>
      </div>

      {/* Log entries */}
      <div className="grid gap-2">
        {items.length === 0 ? (
          <p className="text-sm text-slate">No activity logged yet.</p>
        ) : (
          items.map((item) => {
            const meta = TYPE_MAP[item.type] ?? TYPE_MAP.note;
            const Icon = meta.icon;
            return (
              <div key={item.id} className="flex gap-3 rounded-xl border border-border bg-canvas p-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy/8 text-navy">
                  <Icon size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-navy">{meta.label}</span>
                    <span className="text-xs text-slate">
                      {item.recruiter} · {new Date(item.createdAt).toLocaleDateString("en-RW", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-ink">{item.note}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
