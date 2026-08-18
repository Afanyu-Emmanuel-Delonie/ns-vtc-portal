"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { mockStore } from "@/lib/mock-data";

export function AddRecruiterModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSaving(true);
    mockStore.createRecruiter({
      name: form.name.trim(),
      role: form.role.trim() || "Recruiter",
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
    });
    router.refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card w-full max-w-md rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add recruiter</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label="Full name *" value={form.name} onChange={set("name")} placeholder="e.g. Diane Uwase" />
          <Field label="Role" value={form.role} onChange={set("role")} placeholder="e.g. Recruiter" />
          <Field label="Email *" type="email" value={form.email} onChange={set("email")} placeholder="diane@nsvtc.rw" />
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
              disabled={saving || !form.name.trim() || !form.email.trim()}
              className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-hover disabled:opacity-40"
            >
              {saving ? "Saving…" : "Add recruiter"}
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
