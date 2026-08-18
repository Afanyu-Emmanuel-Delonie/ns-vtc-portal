import Link from "next/link";
import { getRecruiters } from "@/lib/queries/recruiters";
import { Card } from "@/components/ui/Card";

export default async function RecruitersPage() {
  const recruiters = await getRecruiters();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">
          Recruiters
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Staff and workload</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {recruiters.map((recruiter) => (
          <Card key={recruiter.id} className="grid gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{recruiter.name}</h2>
                <p className="text-sm text-[var(--slate)]">{recruiter.role}</p>
              </div>
              <Link className="text-sm font-semibold text-[var(--navy)]" href={`/recruiters/${recruiter.id}`}>
                View profile
              </Link>
            </div>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-[var(--slate)]">Workload</dt>
                <dd className="font-semibold">{recruiter.workload}</dd>
              </div>
              <div>
                <dt className="text-[var(--slate)]">Active</dt>
                <dd className="font-semibold">{recruiter.activeApplications}</dd>
              </div>
              <div>
                <dt className="text-[var(--slate)]">Placed</dt>
                <dd className="font-semibold">{recruiter.placedCandidates}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}
