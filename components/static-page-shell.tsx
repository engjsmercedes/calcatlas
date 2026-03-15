import type { ReactNode } from "react";

export function StaticPageShell({
  eyebrow,
  title,
  intro,
  children
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="page-shell py-10 md:py-14">
        <div className="space-y-4">
          <span className="section-label">{eyebrow}</span>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">{title}</h1>
          <p className="max-w-3xl text-base leading-8 md:text-lg">{intro}</p>
        </div>
      </section>
      <section className="page-shell pb-16 md:pb-24">
        <div className="space-y-8">{children}</div>
      </section>
    </>
  );
}
