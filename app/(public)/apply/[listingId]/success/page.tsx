import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function ApplicationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ candidate?: string; listing?: string }>;
}) {
  const { candidate, listing } = await searchParams;

  return (
    <Card className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">
        Application received
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Thanks, {candidate || "candidate"}.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--slate)]">
        We’ve logged the application{listing ? ` for ${listing}` : ""} and the recruitment
        team can now review it in the dashboard.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to dashboard</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/login">Staff login</Link>
        </Button>
      </div>
    </Card>
  );
}
