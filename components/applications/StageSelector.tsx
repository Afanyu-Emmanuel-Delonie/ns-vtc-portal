"use client";

import { useState } from "react";
import { pipelineStages, type PipelineStage } from "@/lib/constants";

export function StageSelector({ initialStage }: { initialStage: PipelineStage }) {
  const [stage, setStage] = useState<PipelineStage>(initialStage);

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">Pipeline stage</label>
      <select
        value={stage}
        onChange={(event) => setStage(event.target.value as PipelineStage)}
        className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink"
      >
        {pipelineStages.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
