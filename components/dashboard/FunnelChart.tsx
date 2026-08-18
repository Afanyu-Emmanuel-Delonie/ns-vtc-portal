import { Card } from "@/components/ui/Card";
import type { FunnelStep } from "@/lib/queries/stats";

export function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  const max = Math.max(...steps.map((s) => s.value), 1);

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold">Pipeline funnel</h3>
        <span className="text-sm text-slate">All time</span>
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.label} className="grid grid-cols-[100px_1fr_36px] items-center gap-3">
            <span className="text-sm font-medium">{step.label}</span>
            <div className="h-2.5 overflow-hidden rounded-full bg-border/60">
              <div
                className="h-full rounded-full bg-navy transition-all"
                style={{ width: `${(step.value / max) * 100}%` }}
              />
            </div>
            <span className="text-right text-sm text-slate tabular-nums">{step.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
