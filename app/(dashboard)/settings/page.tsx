import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <Card className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">School information</h1>
      </div>
      <form className="grid gap-4">
        <Input placeholder="School name" defaultValue="NS VTC" />
        <Input placeholder="Primary contact" defaultValue="Recruitment Office" />
        <Input placeholder="Contact email" defaultValue="info@nsvtc.co.za" />
        <div className="flex justify-end">
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </Card>
  );
}
