import { CheckCircle, Phone, Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default async function ApplicationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ candidate?: string; listing?: string }>;
}) {
  const { candidate, listing } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="mx-auto max-w-lg text-center">
        <div className="flex justify-center">
          <CheckCircle size={48} strokeWidth={1.5} className="text-emerald-500" />
        </div>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight">
          Application submitted!
        </h1>
        <p className="mt-1 text-lg font-medium">
          Thank you, {candidate || "candidate"}.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate">
          Your application{listing ? ` for ${listing}` : ""} has been received. The recruitment team will be in touch if your profile is a good fit.
        </p>
        <div className="mx-auto mt-6 flex flex-col items-center gap-2 border-t border-border pt-6 text-sm text-slate">
          <p className="font-medium text-ink">Have questions? Contact us:</p>
          <a href="tel:+250788000000" className="flex items-center gap-1.5 hover:text-navy">
            <Phone size={14} />
            +250 788 000 000
          </a>
          <a href="mailto:info@nsvtc.co.za" className="flex items-center gap-1.5 hover:text-navy">
            <Mail size={14} />
            info@nsvtc.co.za
          </a>
        </div>
      </Card>
    </div>
  );
}
