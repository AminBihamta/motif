import SiteHeader from "./site-header";

export default function PageLoading() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-motif-black text-motif-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]"
      />

      <SiteHeader />

      <div
        aria-busy="true"
        aria-live="polite"
        className="relative z-10 mx-auto max-w-[96rem] animate-pulse px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="h-3 w-28 bg-motif-red/70" />
        <div className="mt-8 h-16 max-w-2xl bg-motif-ivory/20 sm:h-24" />
        <div className="mt-4 h-4 max-w-xl bg-motif-ivory/10" />
        <div className="mt-4 h-4 max-w-lg bg-motif-ivory/10" />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["a", "b", "c", "d", "e", "f"].map((item) => (
            <div
              key={item}
              className="min-h-48 border-2 border-motif-ivory/20 bg-motif-ivory/10 sm:min-h-64"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
