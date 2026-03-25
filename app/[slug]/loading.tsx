function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-border/40 ${className}`} />;
}

export default function CalculatorLoading() {
  return (
    <>
      {/* Header section */}
      <section className="page-shell py-6 md:py-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <Bone className="h-4 w-36" />
            <div className="space-y-3">
              <Bone className="h-3 w-20" />
              <Bone className="h-10 w-2/3 md:h-12" />
              <Bone className="h-4 w-full max-w-2xl" />
              <Bone className="h-4 w-4/5 max-w-xl" />
            </div>
          </div>

          {/* Calculator section */}
          <section className="space-y-4">
            <div className="space-y-2">
              <Bone className="h-3 w-28" />
              <Bone className="h-8 w-1/2" />
            </div>
            <div className="surface p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Bone className="h-3 w-24" />
                    <Bone className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Bone className="h-9 w-24" />
                <Bone className="h-9 w-20" />
              </div>
            </div>
          </section>

          {/* About section */}
          <section className="space-y-4">
            <div className="space-y-2">
              <Bone className="h-3 w-32" />
              <Bone className="h-8 w-2/5" />
              <Bone className="h-4 w-3/4 max-w-2xl" />
            </div>
            <div className="surface p-6 md:p-8">
              <Bone className="h-4 w-full" />
              <Bone className="mt-2 h-4 w-11/12" />
              <Bone className="mt-2 h-4 w-4/5" />
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Bone key={i} className="h-6 w-24 rounded-full" />
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="surface p-6 space-y-3">
                  <Bone className="h-5 w-32" />
                  <Bone className="h-3 w-full" />
                  <Bone className="h-3 w-5/6" />
                  <Bone className="h-3 w-4/5" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* Result explanation + examples */}
      <section className="page-shell pb-10 md:pb-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="space-y-2">
              <Bone className="h-3 w-32" />
              <Bone className="h-8 w-48" />
            </div>
            <div className="surface p-6 md:p-8 space-y-2">
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-11/12" />
              <Bone className="h-4 w-4/5" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <Bone className="h-3 w-20" />
              <Bone className="h-8 w-56" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="surface p-6 space-y-2">
                  <Bone className="h-5 w-40" />
                  <Bone className="h-3 w-full" />
                  <Bone className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
