"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createEmployer } from "@/lib/queries/recruiters";

export function AddEmployerModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", industry: "", email: "", phone: "", location: "" });
  const [saving, setSaving] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.location.trim()) return;
    setSaving(true);
    await createEmployer({
      name: form.name.trim(),
      industry: form.industry.trim() || "General",
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      location: form.location.trim(),
    });
    router.refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card w-full max-w-md rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add employer</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label="Company name *" value={form.name} onChange={set("name")} placeholder="e.g. Kigali Steel & Fabrication" />
          <Field label="Industry" value={form.industry} onChange={set("industry")} placeholder="e.g. Manufacturing" />
          <Field label="Location *" value={form.location} onChange={set("location")} placeholder="e.g. Kigali, Gasabo" />
          <Field label="Email *" type="email" value={form.email} onChange={set("email")} placeholder="contact@company.rw" />
          <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="+250 788 000 000" />
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.name.trim() || !form.email.trim() || !form.location.trim()}
              className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:opacity-40"
            >
              {saving ? "Saving…" : "Add employer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-semibold text-slate">{label}</label>
      <input
        {...props}
        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
      />
    </div>
  );
}
