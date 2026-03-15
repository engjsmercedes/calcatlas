import { useEmbedOptions } from "@/components/embed-options";
import { cn } from "@/lib/utils";

export function ResultCard({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}) {
  const { showResults } = useEmbedOptions();

  if (!showResults) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-3xl border p-5",
        tone === "default" && "border-border bg-white/70 dark:bg-slate-950/30",
        tone === "success" && "border-success/20 bg-emerald-50 dark:bg-emerald-950/20",
        tone === "warning" && "border-warning/20 bg-amber-50 dark:bg-amber-950/20"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
