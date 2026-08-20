"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, Check, Copy, Plus, X, GripVertical, Building2 } from "lucide-react";
import type { Listing, ApplicationField, Employer } from "@/lib/types";
import { defaultApplicationFields } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type FormListing = Omit<Listing, "id" | "applicants" | "publishedAt">;

const FIELD_TYPES: { value: ApplicationField["type"]; label: string }[] = [
  { value: "text",     label: "Short text" },
  { value: "textarea", label: "Long text"  },
  { value: "url",      label: "URL / link" },
  { value: "file",     label: "File upload"},
];

function buildDefault(trades: string[]): FormListing {
  return {
    title: "",
    trade: trades[0] ?? "",
    location: "",
    employer: "",
    employerId: undefined,
    status: "Open",
    description: "",
    salary: "",
    applicationDeadline: "",
    applicationFields: defaultApplicationFields.map((f) => ({ ...f })),
  };
}

export function ListingForm({
  initial,
  listingId,
  trades: initialTrades,
  employers,
  onSave,
  onAddTrade,
}: {
  initial?: Listing;
  listingId?: string;
  trades: string[];
  employers: Employer[];
  onSave: (data: FormListing) => Promise<void>;
  onAddTrade: (trade: string) => Promise<void>;
}) {
  const router = useRouter();

  const [trades, setTrades] = useState<string[]>(initialTrades);
  const [tradeInput, setTradeInput] = useState("");
  const [showTradeInput, setShowTradeInput] = useState(false);

  const [form, setForm] = useState<FormListing>(
    initial
      ? {
          title: initial.title,
          trade: initial.trade,
          location: initial.location,
          employer: initial.employer,
          employerId: initial.employerId,
          status: initial.status,
          description: initial.description,
          salary: initial.salary,
          applicationDeadline: initial.applicationDeadline ?? "",
          applicationFields: initial.applicationFields?.length
            ? initial.applicationFields.map((f) => ({ ...f }))
            : defaultApplicationFields.map((f) => ({ ...f })),
        }
      : buildDefault(initialTrades),
  );

  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<ApplicationField["type"]>("text");
  const [showAddField, setShowAddField] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const applyUrl =
    typeof window !== "undefined" && listingId
      ? `${window.location.origin}/apply/${listingId}`
      : listingId ? `/apply/${listingId}` : null;

  function setField<K extends keyof FormListing>(key: K, value: FormListing[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // ── Trade helpers ──
  async function confirmNewTrade() {
    const t = tradeInput.trim();
    if (!t) return;
    await onAddTrade(t);
    setTrades((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setField("trade", t);
    setTradeInput("");
    setShowTradeInput(false);
  }

  // ── Field helpers ──
  function toggleEnabled(key: string) {
    setForm((f) => ({
      ...f,
      applicationFields: f.applicationFields.map((field) =>
        field.key === key
          ? { ...field, enabled: !field.enabled, required: field.enabled ? false : field.required }
          : field,
      ),
    }));
  }

  function toggleRequired(key: string) {
    setForm((f) => ({
      ...f,
      applicationFields: f.applicationFields.map((field) =>
        field.key === key ? { ...field, required: !field.required } : field,
      ),
    }));
  }

  function addCustomField() {
    const label = newFieldLabel.trim();
    if (!label) return;
    const key = `custom_${Date.now()}`;
    const newField: ApplicationField = { key, label, type: newFieldType, required: false, enabled: true };
    setForm((f) => ({ ...f, applicationFields: [...f.applicationFields, newField] }));
    setNewFieldLabel("");
    setNewFieldType("text");
    setShowAddField(false);
  }

  function removeField(key: string) {
    setForm((f) => ({
      ...f,
      applicationFields: f.applicationFields.filter((field) => field.key !== key),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try { await onSave(form); } finally { setBusy(false); }
  }

  function copyLink() {
    if (!applyUrl) return;
    navigator.clipboard.writeText(applyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const TEXTAREA = "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15";
  const SELECT   = "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-navy";

  const builtInKeys = new Set(defaultApplicationFields.map((f) => f.key));
  const builtInFields = form.applicationFields.filter((f) => builtInKeys.has(f.key) && f.key !== "phone");
  const customFields  = form.applicationFields.filter((f) => !builtInKeys.has(f.key));

  const selectedEmployer = employers.find((e) => e.id === form.employerId);

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">

      {/* ── Basic info ── */}
      <Card>
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate">Basic information</h2>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-slate">Listing title <span className="text-red-500">*</span></label>
            <Input required placeholder="e.g. Senior Welder Apprentice Intake" value={form.title} onChange={(e) => setField("title", e.target.value)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Trade picker */}
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-slate">Trade <span className="text-red-500">*</span></label>
              {showTradeInput ? (
                <div className="flex gap-2">
                  <Input autoFocus placeholder="New trade name" value={tradeInput}
                    onChange={(e) => setTradeInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmNewTrade(); } if (e.key === "Escape") setShowTradeInput(false); }}
                  />
                  <button type="button" onClick={confirmNewTrade} className="shrink-0 rounded-full bg-navy px-3 py-2 text-xs font-semibold text-white hover:bg-navy-hover">Add</button>
                  <button type="button" onClick={() => setShowTradeInput(false)} className="shrink-0 rounded-full border border-border px-3 py-2 text-xs text-slate hover:text-ink"><X size={13} /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select required value={form.trade} onChange={(e) => setField("trade", e.target.value)} className={SELECT}>
                    {trades.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button type="button" onClick={() => setShowTradeInput(true)} title="Add new trade"
                    className="shrink-0 flex items-center justify-center rounded-full border border-border bg-surface px-3 text-slate transition hover:border-navy/30 hover:text-navy">
                    <Plus size={15} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-slate">Status <span className="text-red-500">*</span></label>
              <select value={form.status} onChange={(e) => setField("status", e.target.value as Listing["status"])} className={SELECT}>
                <option value="Open">Open</option>
                <option value="Paused">Paused</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Employer picker — select from list, auto-fills name */}
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-slate">Employer <span className="text-red-500">*</span></label>
            {employers.length > 0 && (
              <div className="mb-2 grid gap-1.5 rounded-xl border border-border bg-canvas p-2">
                <p className="px-2 text-xs text-slate">Select from registered employers</p>
                <div className="grid gap-1">
                  {employers.map((emp) => {
                    const selected = form.employerId === emp.id;
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          setField("employerId", emp.id);
                          setField("employer", emp.name);
                          if (!form.location) setField("location", emp.location);
                        }}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                          selected ? "bg-navy text-white" : "hover:bg-border/40"
                        }`}
                      >
                        <Building2 size={14} className={selected ? "text-white/70" : "text-slate"} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium ${selected ? "text-white" : ""}`}>{emp.name}</p>
                          <p className={`text-xs ${selected ? "text-white/60" : "text-slate"}`}>{emp.industry} · {emp.location}</p>
                        </div>
                        {selected && <Check size={14} className="shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <Input
              required
              placeholder={employers.length > 0 ? "Or type a new employer name" : "e.g. Kigali Steel & Fabrication"}
              value={form.employer}
              onChange={(e) => {
                setField("employer", e.target.value);
                if (form.employerId) setField("employerId", undefined);
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-slate">Location <span className="text-red-500">*</span></label>
              <Input required placeholder="e.g. Kigali, Gasabo" value={form.location} onChange={(e) => setField("location", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-slate">Application deadline</label>
              <Input type="date" value={form.applicationDeadline ?? ""} onChange={(e) => setField("applicationDeadline", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-slate">Salary / stipend <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-slate">RWF</span>
              <input
                required
                inputMode="numeric"
                placeholder="75,000"
                value={form.salary.replace(/^RWF\s*/, "")}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^\d]/g, "");
                  const formatted = raw ? Number(raw).toLocaleString("en") : "";
                  setField("salary", formatted ? `RWF ${formatted}` : "");
                }}
                className="w-full rounded-2xl border border-border bg-surface py-3 pr-4 pl-14 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-slate">Description <span className="text-red-500">*</span></label>
            <textarea required rows={5} placeholder="Describe the role, requirements, and what candidates can expect…" value={form.description} onChange={(e) => setField("description", e.target.value)} className={TEXTAREA} />
          </div>
        </div>
      </Card>

      {/* ── Application form fields ── */}
      <Card>
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-slate">Application form fields</h2>
        <p className="mb-5 text-xs text-slate">Name and phone are always collected. Toggle email and additional fields below.</p>

        <div className="mb-3 grid gap-2">
          {["Candidate name", "Phone number"].map((label) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-border bg-canvas px-4 py-3">
              <span className="text-sm font-medium">{label}</span>
              <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-semibold text-navy">Always required</span>
            </div>
          ))}
        </div>

        <div className="grid gap-2">
          {builtInFields.map((field) => (
            <FieldRow key={field.key} field={field} onToggleEnabled={() => toggleEnabled(field.key)} onToggleRequired={() => toggleRequired(field.key)} />
          ))}
        </div>

        {customFields.length > 0 && (
          <div className="mt-2 grid gap-2">
            {customFields.map((field) => (
              <FieldRow key={field.key} field={field} onToggleEnabled={() => toggleEnabled(field.key)} onToggleRequired={() => toggleRequired(field.key)} onRemove={() => removeField(field.key)} />
            ))}
          </div>
        )}

        {showAddField ? (
          <div className="mt-3 grid gap-3 rounded-xl border border-border bg-canvas p-4">
            <p className="text-xs font-semibold text-slate">New custom field</p>
            <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
              <div className="grid gap-1.5">
                <label className="text-xs text-slate">Field label</label>
                <Input autoFocus placeholder="e.g. ID number, LinkedIn URL…" value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomField(); } }}
                />
              </div>
              <div className="grid gap-1.5">
                <label className="text-xs text-slate">Field type</label>
                <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value as ApplicationField["type"])} className={SELECT}>
                  {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={addCustomField} disabled={!newFieldLabel.trim()}>Add field</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowAddField(false); setNewFieldLabel(""); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setShowAddField(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-slate transition hover:border-navy/40 hover:text-navy">
            <Plus size={15} />
            Add custom field
          </button>
        )}
      </Card>

      {/* ── Apply link (edit only) ── */}
      {applyUrl && (
        <Card>
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-slate">Shareable apply link</h2>
          <p className="mb-4 text-xs text-slate">Send this link to candidates so they can apply directly.</p>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-canvas px-4 py-3">
            <Link2 size={14} className="shrink-0 text-slate" />
            <span className="min-w-0 flex-1 truncate text-sm text-navy">{applyUrl}</span>
            <button type="button" onClick={copyLink} className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-navy/30 hover:text-navy">
              {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </Card>
      )}

      {/* ── Actions ── */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : listingId ? "Save changes" : "Create listing"}</Button>
      </div>
    </form>
  );
}

function FieldRow({ field, onToggleEnabled, onToggleRequired, onRemove }: {
  field: ApplicationField;
  onToggleEnabled: () => void;
  onToggleRequired: () => void;
  onRemove?: () => void;
}) {
  const typeLabel = FIELD_TYPES.find((t) => t.value === field.type)?.label ?? field.type;
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 transition ${field.enabled ? "border-border bg-surface" : "border-border/50 bg-canvas opacity-60"}`}>
      <div className="flex items-center gap-3">
        <GripVertical size={14} className="shrink-0 text-border" />
        <button type="button" onClick={onToggleEnabled}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${field.enabled ? "bg-navy" : "bg-border"}`}
          aria-label={field.enabled ? "Disable" : "Enable"}>
          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${field.enabled ? "translate-x-6" : "translate-x-1"}`} />
        </button>
        <div>
          <span className="text-sm font-medium">{field.label}</span>
          <span className="ml-2 text-xs text-slate/70">{typeLabel}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {field.enabled && (
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate">
            <button type="button" onClick={onToggleRequired}
              className={`flex h-4 w-4 items-center justify-center rounded border-2 transition ${field.required ? "border-navy bg-navy text-white" : "border-border bg-surface text-transparent"}`}>
              <Check size={10} strokeWidth={3} />
            </button>
            Required
          </label>
        )}
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-slate transition hover:text-red-500" aria-label="Remove field">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
