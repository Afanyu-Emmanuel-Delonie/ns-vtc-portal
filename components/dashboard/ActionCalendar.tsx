"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { CalendarEvent } from "@/lib/queries/stats";

const DOT: Record<CalendarEvent["state"], string> = {
  "needs-action": "bg-amber-500",
  upcoming: "bg-navy/50",
  scheduled: "bg-slate/30",
};

const TYPE_LABEL: Record<CalendarEvent["type"], string> = {
  interview: "Interview",
  followup: "Follow-up",
  deadline: "Deadline",
};

export function ActionCalendar({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1,
  );

  const eventsForDay = (day: number) => {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === key);
  };

  const selectedEvents = selected ? events.filter((e) => e.date === selected) : [];
  const monthName = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <Card className="relative overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Action Calendar</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate">{monthName}</span>
          <button onClick={prev} className="rounded p-1 hover:bg-canvas"><ChevronLeft size={15} /></button>
          <button onClick={next} className="rounded p-1 hover:bg-canvas"><ChevronRight size={15} /></button>
        </div>
      </div>

      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-[11px] font-semibold uppercase tracking-wide text-slate/60">{d}</span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dayEvents = eventsForDay(day);
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selected;
          const topState = dayEvents.find((e) => e.state === "needs-action")?.state
            ?? dayEvents.find((e) => e.state === "upcoming")?.state
            ?? dayEvents[0]?.state;

          return (
            <button
              key={i}
              onClick={() => setSelected(isSelected ? null : dateStr)}
              className={`flex flex-col items-center rounded-lg py-1.5 transition hover:bg-canvas ${isSelected ? "bg-canvas ring-1 ring-navy/20" : ""}`}
            >
              <span className={`text-xs font-medium tabular-nums ${isToday ? "flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white" : "text-ink"}`}>
                {day}
              </span>
              {topState && (
                <span className={`mt-1 h-1.5 w-1.5 rounded-full ${DOT[topState]}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Side panel */}
      {selected && selectedEvents.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">
              {new Date(selected + "T00:00:00").toLocaleDateString("default", { weekday: "short", month: "short", day: "numeric" })}
            </p>
            <button onClick={() => setSelected(null)} className="text-slate hover:text-ink"><X size={14} /></button>
          </div>
          <div className="grid gap-2">
            {selectedEvents.map((e, i) => (
              <div key={i} className={`flex items-start gap-2 rounded-lg border p-2.5 ${e.state === "needs-action" ? "border-amber-200 bg-amber-50" : "border-border bg-canvas"}`}>
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${DOT[e.state]}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{e.candidateName || e.listingTitle}</p>
                  <p className="truncate text-xs text-slate">{e.candidateName ? e.listingTitle : ""} · {TYPE_LABEL[e.type]}</p>
                </div>
                {e.type !== "deadline" && (
                  <Link href={`/applications/${e.applicationId}`} className="shrink-0 text-xs font-medium text-navy hover:underline">
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
        {(["needs-action", "upcoming", "scheduled"] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-[11px] text-slate">
            <span className={`h-2 w-2 rounded-full ${DOT[s]}`} />
            {s === "needs-action" ? "Needs action" : s === "upcoming" ? "Upcoming" : "Scheduled"}
          </span>
        ))}
      </div>
    </Card>
  );
}
