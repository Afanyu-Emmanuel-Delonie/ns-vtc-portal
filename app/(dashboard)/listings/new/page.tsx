import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

export default function NewListingPage() {
  return (
    <div className="grid gap-6">
      <div>
        <BackButton />
        <div className="mt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Listings</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create listing</h1>
        </div>
      </div>
      <Card className="max-w-3xl">
        <form className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Listing title" />
            <Input placeholder="Trade" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Employer" />
            <Input placeholder="Location" />
          </div>
          <Input placeholder="Salary / stipend" />
          <textarea
            rows={6}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
            placeholder="Description"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button">Cancel</Button>
            <Button type="submit">Save listing</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
