import { Card } from "@/components/ui/Card";
import type { TradeRow } from "@/lib/queries/stats";

export function TradeBreakdownTable({ rows }: { rows: TradeRow[] }) {
  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold">By trade</h3>
        <span className="text-sm text-slate">All disciplines</span>
      </div>
      {/* Table view (md and up) */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-canvas text-slate">
            <tr>
              <th className="px-4 py-2.5 font-medium">Trade</th>
              <th className="px-4 py-2.5 font-medium">Applications</th>
              <th className="px-4 py-2.5 font-medium">Hired</th>
            </tr>
          </thead>
          <tbody className="bg-surface">
            {rows.map((row) => (
              <tr key={row.trade} className="border-t border-border">
                <td className="px-4 py-2.5 font-medium">{row.trade}</td>
                <td className="px-4 py-2.5 tabular-nums">{row.applications}</td>
                <td className="px-4 py-2.5 tabular-nums">{row.hired}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view (below md) */}
      <div className="grid gap-2 md:hidden">
        {rows.map((row) => (
          <div key={row.trade} className="card flex items-center justify-between gap-3 rounded-xl px-4 py-3">
            <span className="font-medium">{row.trade}</span>
            <dl className="flex items-center gap-5 text-right text-xs">
              <div>
                <dt className="text-slate">Applications</dt>
                <dd className="font-heading font-semibold text-ink tabular-nums">{row.applications}</dd>
              </div>
              <div>
                <dt className="text-slate">Hired</dt>
                <dd className="font-heading font-semibold text-ink tabular-nums">{row.hired}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </Card>
  );
}
