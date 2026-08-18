import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LookupsPage() {
  return (
    <Card className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">
          Lookups
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin dropdown values</h1>
      </div>
      <div className="grid gap-3">
        {["Pipeline stages", "Trades", "Application sources", "Recruiter roles"].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-canvas px-4 py-3"
          >
            <span className="font-medium">{item}</span>
            <Button variant="secondary" type="button">
              Edit
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
