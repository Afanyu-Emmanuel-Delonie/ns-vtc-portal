import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ReportsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">
          Reports
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Exportable breakdowns</h1>
      </div>
      <Card className="grid gap-4">
        <p className="text-sm text-[var(--slate)]">
          Placeholder exports for applications by stage, listing, recruiter, and trade.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button type="button">Export CSV</Button>
          <Button type="button" variant="secondary">
            Export PDF
          </Button>
        </div>
      </Card>
    </div>
  );
}
