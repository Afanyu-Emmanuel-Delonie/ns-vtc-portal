"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DIAL_CODES } from "@/lib/constants";
import { createApplication } from "@/lib/queries/applications";
import type { ApplicationField } from "@/lib/types";

export function ApplicationForm({
  listingId,
  listingTitle,
  applicationFields,
}: {
  listingId: string;
  listingTitle: string;
  applicationFields: ApplicationField[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [dialCode, setDialCode] = useState<string>(DIAL_CODES[0].code);

  // phone is always-on hardcoded — strip it from dynamic fields to avoid duplicates
  const activeFields = applicationFields.filter((f) => f.enabled && f.key !== "phone");
  const emailField = activeFields.find((f) => f.key === "email");
  const otherFields = activeFields.filter((f) => f.key !== "email");

  const TEXTAREA = "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15";
  const SELECT = "h-full rounded-l-2xl border-r border-border bg-canvas px-3 text-sm text-ink outline-none transition focus:border-navy";

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          const fd = new FormData(e.currentTarget);
          const candidateName = String(fd.get("candidate") || "").trim();
          const phone = `${dialCode} ${String(fd.get("phone") || "").trim()}`;
          const candidateEmail = String(fd.get("email") || "").trim();
          const notes = String(fd.get("notes") || "").trim();
          const trade = String(fd.get("trade") || "").trim();

          await createApplication({
            listingId,
            candidateName,
            candidateEmail,
            phone,
            trade,
            notes,
            recruiter: "",
          });

          router.push(
            `/apply/${listingId}/success?candidate=${encodeURIComponent(candidateName)}&listing=${encodeURIComponent(listingTitle)}`,
          );
        } catch {
          setBusy(false);
        }
      }}
    >
      {/* Full name — always required */}
      <div className="grid gap-1.5">
        <label className="text-xs font-medium text-slate">
          Full name <span className="text-red-500">*</span>
        </label>
        <Input name="candidate" required placeholder="e.g. Diane Uwase" />
      </div>

      {/* Phone — always required with dial code */}
      <div className="grid gap-1.5">
        <label className="text-xs font-medium text-slate">
          Phone number <span className="text-red-500">*</span>
        </label>
        <div className="flex overflow-hidden rounded-2xl border border-border bg-surface focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/15">
          <select
            value={dialCode}
            onChange={(e) => setDialCode(e.target.value)}
            className={SELECT}
          >
            {DIAL_CODES.map(({ code, country }) => (
              <option key={code} value={code}>
                {country} {code}
              </option>
            ))}
          </select>
          <input
            name="phone"
            required
            inputMode="tel"
            placeholder="788 000 000"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ink outline-none"
          />
        </div>
      </div>

      {/* Email — only if enabled on the listing */}
      {emailField && (
        <div className="grid gap-1.5">
          <label className="text-xs font-medium text-slate">
            Email address
            {emailField.required
              ? <span className="text-red-500"> *</span>
              : <span className="text-slate"> (optional)</span>
            }
          </label>
          <Input
            name="email"
            type="email"
            required={emailField.required}
            placeholder="candidate@email.com"
          />
        </div>
      )}

      {/* Other dynamic fields */}
      {otherFields.map((field) => (
        <div key={field.key} className="grid gap-1.5">
          <label className="text-xs font-medium text-slate">
            {field.label}
            {field.required
              ? <span className="text-red-500"> *</span>
              : <span className="text-slate"> (optional)</span>
            }
          </label>

          {field.type === "textarea" && (
            <textarea
              name={field.key}
              required={field.required}
              rows={4}
              placeholder={`Enter ${field.label.toLowerCase()}…`}
              className={TEXTAREA}
            />
          )}

          {field.type === "file" && (
            <>
              <input
                name={field.key}
                type="file"
                required={field.required}
                accept=".pdf,.doc,.docx,.png,.jpg"
                className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-navy/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-navy focus:border-navy"
              />
              <p className="text-xs text-slate">PDF, DOC, DOCX, PNG or JPG — max 5 MB</p>
            </>
          )}

          {field.type === "url" && (
            <Input name={field.key} type="url" required={field.required} placeholder="https://" />
          )}

          {field.type === "text" && (
            <Input
              name={field.key}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}…`}
            />
          )}
        </div>
      ))}

      <Button type="submit" disabled={busy} className="mt-1 w-full">
        {busy ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
