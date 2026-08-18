"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ApplicationForm({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setBusy(true);
        const formData = new FormData(event.currentTarget);
        const candidate = String(formData.get("candidate") || "Candidate");
        router.push(`/apply/${listingId}/success?candidate=${encodeURIComponent(candidate)}&listing=${encodeURIComponent(listingTitle)}`);
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium">Candidate name</label>
        <Input name="candidate" required placeholder="e.g. Sipho Maseko" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Email</label>
        <Input name="email" type="email" required placeholder="candidate@email.com" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Phone</label>
        <Input name="phone" required placeholder="08X XXX XXXX" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          name="notes"
          rows={4}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
          placeholder="Anything the recruiter should know?"
        />
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  );
}
