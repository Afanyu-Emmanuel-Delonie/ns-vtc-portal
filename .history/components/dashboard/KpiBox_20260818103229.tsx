import { Card } from "@/components/ui/Card";

export function KpiBox({
  label,
  value,
  alert,
}: {
  label: string;
  value: string | number;
  alert?: boolean;
}) {
  return (
    <Card className="min-w-0">
      <p className="text-sm font-medium text-slate">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span
          className={`font-heading text-3xl font-bold tracking-tight tabular-nums ${
            alert && Number(value) > 0 ? "text-[#b45309]" : ""
          }`}
        >
          {value}
        </span>
        {alert && Number(value) > 0 && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-500">
            Critical
          </span>
        )}
      </div>
    </Card>
  );
}
