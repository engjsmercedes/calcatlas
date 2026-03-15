import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-shell py-24">
      <div className="surface max-w-2xl p-8 md:p-10">
        <span className="section-label">Not found</span>
        <h1 className="mt-4 text-4xl font-semibold">This calculator page does not exist.</h1>
        <p className="mt-4 text-sm leading-7">
          The route may have changed or the calculator has not been added yet. Return to the main library to choose another tool.
        </p>
        <Link href="/" className="button-base mt-6 bg-accent text-white hover:bg-cyan-700 dark:text-slate-950">
          Go to homepage
        </Link>
      </div>
    </section>
  );
}
