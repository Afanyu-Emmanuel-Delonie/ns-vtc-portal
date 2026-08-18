import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, Briefcase, Users, TrendingUp, Calendar } from "lucide-react";
import { getRecruiter } from "@/lib/queries/recruiters";
import { getApplications } from "@/lib/queries/applications";
import { BackButton } from "@/components/ui/BackButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ComplaintsPanel } from "@/components/recruiters/ComplaintsPanel";

export default async function RecruiterDetailPage({
  params,
}: {
  params: Promise<{ recruiterId: string }>;
}) {
  const { recruiterId } = await params;
  const [recruiter, allApplications] = await Promise.all([
    getRecruiter(recruiterId),
    getApplications(),
  ]);
  if (!recruiter) notFound();

  const history = allApplications.filter((a) => a.recruiter === recruiter.name);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <BackButton />
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Recruiter</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{recruiter.name}</h1>
            <p className="mt-1 text-sm text-slate">{recruiter.role}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate">
            {recruiter.phone && (
              <a href={`tel:${recruiter.phone}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                <Phone size={14} />{recruiter.phone}
              </a>
            )}
            <a href={`mailto:${recruiter.email}`} className="inline-flex items-center gap-1.5 text-navy hover:underline">
              <Mail size={14} />{recruiter.email}
            </a>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={<Briefcase size={18} />} label="Workload" value={recruiter.workload} />
        <StatCard icon={<Users size={18} />} label="Active applications" value={recruiter.activeApplications} />
        <StatCard icon={<TrendingUp size={18} />} label="Placed candidates" value={recruiter.placedCandidates} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Application history */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Application history</h2>
            <span className="text-sm text-slate">{history.length} total</span>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-slate">No applications assigned yet.</p>
          ) : (
            <div className="grid gap-2">
              {history.map((app) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-canvas px-4 py-3 transition hover:border-navy/30 hover:bg-navy/5"
                >
                  <div>
                    <p className="text-sm font-medium">{app.candidateName}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate">
                      <Calendar size={11} />
                      {new Date(app.appliedAt).toLocaleDateString("en-RW", { day: "numeric", month: "short", year: "numeric" })}
                      <span className="text-border">·</span>
                      {app.trade}
                    </p>
                  </div>
                  <Badge tone={app.stage === "Hired" ? "success" : "brand"}>{app.stage}</Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Complaints */}
        <Card>
          <ComplaintsPanel recruiterId={recruiter.id} complaints={recruiter.complaints} />
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="flex items-center gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/8 text-navy">
        {icon}
      </span>
      <div>
        <p className="text-xs text-slate">{label}</p>
        <p className="font-heading text-2xl font-bold tabular-nums">{value}</p>
      </div>
    </Card>
  );
}
