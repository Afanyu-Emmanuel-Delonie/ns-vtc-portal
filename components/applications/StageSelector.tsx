"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pipelineStages, type PipelineStage } from "@/lib/constants";
import { updateStage } from "@/lib/queries/applications";

export function StageSelector({
  applicationId,
  initialStage,
}: {
  applicationId: string;
  initialStage: PipelineStage;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<PipelineStage>(initialStage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(next: PipelineStage) {
    const previous = stage;
    setStage(next);
    setError(null);
    setSaving(true);
    try {
      await updateStage(applicationId, next);
      router.refresh();
    } catch {
      setStage(previous);
      setError("Couldn't save — try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">Pipeline stage</label>
      <select
        value={stage}
        disabled={saving}
        onChange={(event) => handleChange(event.target.value as PipelineStage)}
        className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink disabled:opacity-60"
      >
        {pipelineStages.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
