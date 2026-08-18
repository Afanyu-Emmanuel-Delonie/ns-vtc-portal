import { getApplications } from "@/lib/queries/applications";
import { getListings } from "@/lib/queries/listings";
import { ApplicationTable } from "@/components/applications/ApplicationTable";

export default async function ApplicationsPage() {
  const [applications, listings] = await Promise.all([getApplications(), getListings()]);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">
          Applications
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Candidate pipeline</h1>
      </div>
      <ApplicationTable applications={applications} listings={listings} />
    </div>
  );
}
