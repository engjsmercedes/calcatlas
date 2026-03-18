"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function WorkflowChainPanel() {
  const searchParams = useSearchParams();
  const workflowTitle = searchParams.get("workflowTitle");
  const workflowReturn = searchParams.get("workflowReturn");

  if (!workflowTitle) {
    return null;
  }

  return (
    <div className="surface flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="section-label">Workflow chain</p>
        <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">
          You came from the {workflowTitle}. Keep moving through related calculators without losing the earlier scenario.
        </p>
      </div>
      {workflowReturn ? (
        <Link href={workflowReturn} className="text-sm font-medium text-accent transition hover:text-cyan-700">
          Return to previous scenario
        </Link>
      ) : null}
    </div>
  );
}
