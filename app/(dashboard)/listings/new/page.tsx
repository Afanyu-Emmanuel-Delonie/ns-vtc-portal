import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewListingPage() {
  return (
    <Card className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">
          Listings
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create listing</h1>
      </div>
      <form className="grid gap-4">
        <div className="grid gap-2 md:grid-cols-2">
          <Input placeholder="Listing title" />
          <Input placeholder="Trade" />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <Input placeholder="Employer" />
          <Input placeholder="Location" />
        </div>
        <Input placeholder="Salary / stipend" />
        <textarea
          rows={6}
          className="w-full rounded-2xl border border-[var(--border)] bg-surface px-4 py-3 text-sm outline-none"
          placeholder="Description"
        />
        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
          <Button type="submit">Save listing</Button>
        </div>
      </form>
    </Card>
  );
}
