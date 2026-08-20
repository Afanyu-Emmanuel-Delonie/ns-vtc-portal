import { notFound } from "next/navigation";
import { Mail, Phone, User, Calendar, Briefcase } from "lucide-react";
import { getApplication } from "@/lib/queries/applications";
import { getListing } from "@/lib/queries/listings";
import { StageSelector } from "@/components/applications/StageSelector";
import { FollowUpLog } from "@/components/applications/FollowUpLog";
import { BackButton } from "@/components/ui/BackButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const application = await getApplication(applicationId);
  if (!application) notFound();

  const listing = await getListing(application.listingId);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <BackButton />
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">
              Application
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {application.candidateName}
            </h1>
            <p className="mt-1 text-sm text-slate">{listing?.title ?? application.trade}</p>
          </div>
          <Badge tone={application.stage === "Hired" ? "success" : "brand"}>
            {application.stage}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="grid gap-6 self-start">
          {/* Candidate info */}
          <Card className="grid gap-4">
            <h2 className="text-base font-semibold">Candidate details</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 shrink-0 text-slate" />
                <div>
                  <dt className="text-xs text-slate">Email</dt>
                  <dd className="text-sm font-medium">{application.candidateEmail}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 shrink-0 text-slate" />
                <div>
                  <dt className="text-xs text-slate">Phone</dt>
                  <dd className="text-sm font-medium">{application.phone}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Briefcase size={15} className="mt-0.5 shrink-0 text-slate" />
                <div>
                  <dt className="text-xs text-slate">Trade</dt>
                  <dd className="text-sm font-medium">{application.trade}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User size={15} className="mt-0.5 shrink-0 text-slate" />
                <div>
                  <dt className="text-xs text-slate">Recruiter</dt>
                  <dd className="text-sm font-medium">{application.recruiter}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar size={15} className="mt-0.5 shrink-0 text-slate" />
                <div>
                  <dt className="text-xs text-slate">Applied</dt>
                  <dd className="text-sm font-medium">
                    {new Date(application.appliedAt).toLocaleDateString("en-RW", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </dd>
                </div>
              </div>
              {application.interviewDate && (
                <div className="flex items-start gap-2">
                  <Calendar size={15} className="mt-0.5 shrink-0 text-slate" />
                  <div>
                    <dt className="text-xs text-slate">Interview</dt>
                    <dd className="text-sm font-medium">
                      {new Date(application.interviewDate).toLocaleDateString("en-RW", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </Card>

          {/* Stage */}
          <Card>
            <h2 className="mb-4 text-base font-semibold">Pipeline stage</h2>
            <StageSelector initialStage={application.stage} />
          </Card>

          {/* Notes */}
          {application.notes && (
            <Card>
              <h2 className="mb-3 text-base font-semibold">Notes</h2>
              <p className="rounded-xl border border-border bg-canvas p-4 text-sm leading-6 text-slate">
                {application.notes}
              </p>
            </Card>
          )}
        </div>

        {/* Right column — follow-up log */}
        <FollowUpLog applicationId={application.id} followUps={application.followUps} />
      </div>
    </div>
  );
}
