import { getReportData } from "@/lib/queries/stats";
import { getRecruiters } from "@/lib/queries/recruiters";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { TradeBreakdownTable } from "@/components/dashboard/TradeBreakdownTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function ReportsPage() {
  const [report, recruiters] = await Promise.all([getReportData(), getRecruiters()]);

  const maxApps = Math.max(...report.monthly.map((m) => m.applications), 1);

  return (
    <div className="grid gap-6">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Reports</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Analytics &amp; exports</h1>
        </div>
        <div className="flex gap-3">
          <Button type="button">Export CSV</Button>
          <Button type="button" variant="secondary">Export PDF</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Applications", value: report.stats.totalApplications },
          { label: "Hired", value: report.stats.hired },
          { label: "Conversion Rate", value: `${report.conversionRate}%` },
          { label: "Avg. Days to Hire", value: report.avgTimeToHire },
        ].map(({ label, value }) => (
          <Card key={label} className="min-w-0">
            <p className="text-sm font-medium text-slate">{label}</p>
            <p className="mt-3 font-heading text-3xl font-bold tracking-tight tabular-nums">
              {value}
            </p>
          </Card>
        ))}
      </div>

      {/* Growth chart + top trade */}
      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        {/* Monthly bar chart */}
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold">Monthly applications</h3>
            <span className="text-sm text-slate">Last 6 months</span>
          </div>
          <div className="flex h-40 items-end gap-3">
            {report.monthly.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs tabular-nums text-slate">{m.applications}</span>
                <div className="relative w-full overflow-hidden rounded-t-md bg-border/50" style={{ height: "100px" }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-navy transition-all"
                    style={{ height: `${(m.applications / maxApps) * 100}%` }}
                  />
                  {m.hired > 0 && (
                    <div
                      className="absolute bottom-0 w-full rounded-t-md bg-emerald-500/80"
                      style={{ height: `${(m.hired / maxApps) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-xs font-medium text-slate">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-slate">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-navy" />
              Applications
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500/80" />
              Hired
            </span>
          </div>
        </Card>

        {/* Summary stats */}
        <Card className="grid content-start gap-4">
          <h3 className="text-base font-semibold">Summary</h3>
          {[
            { label: "Open listings", value: report.stats.openListings },
            { label: "In pipeline", value: report.stats.inPipeline },
            { label: "Overdue follow-ups", value: report.stats.overdueFollowUps },
            { label: "Top trade", value: report.topTrade },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between border-t border-border pt-3 first:border-0 first:pt-0">
              <span className="text-sm text-slate">{label}</span>
              <span className="font-heading text-sm font-bold tabular-nums">{value}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Funnel + Trade breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FunnelChart steps={report.funnel} />
        <TradeBreakdownTable rows={report.trades} />
      </div>

      {/* Recruiter performance */}
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold">Recruiter performance</h3>
          <span className="text-sm text-slate">All time</span>
        </div>
        <div className="hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-canvas text-slate">
              <tr>
                <th className="px-4 py-2.5 font-medium">Recruiter</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Active</th>
                <th className="px-4 py-2.5 font-medium">Placed</th>
                <th className="px-4 py-2.5 font-medium">Workload</th>
                <th className="px-4 py-2.5 font-medium">Complaints</th>
              </tr>
            </thead>
            <tbody className="bg-surface">
              {recruiters.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium">{r.name}</td>
                  <td className="px-4 py-2.5 text-slate">{r.role}</td>
                  <td className="px-4 py-2.5 tabular-nums">{r.activeApplications}</td>
                  <td className="px-4 py-2.5 tabular-nums">{r.placedCandidates}</td>
                  <td className="px-4 py-2.5 tabular-nums">{r.workload}</td>
                  <td className="px-4 py-2.5 tabular-nums">
                    {r.complaints.filter((c) => !c.resolved).length > 0 ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-red-500">
                        {r.complaints.filter((c) => !c.resolved).length} open
                      </span>
                    ) : (
                      <span className="text-slate">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="grid gap-2 md:hidden">
          {recruiters.map((r) => (
            <div key={r.id} className="card flex items-center justify-between gap-3 rounded-xl px-4 py-3">
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-slate">{r.role}</p>
              </div>
              <dl className="flex items-center gap-4 text-right text-xs">
                <div>
                  <dt className="text-slate">Active</dt>
                  <dd className="font-semibold tabular-nums">{r.activeApplications}</dd>
                </div>
                <div>
                  <dt className="text-slate">Placed</dt>
                  <dd className="font-semibold tabular-nums">{r.placedCandidates}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
