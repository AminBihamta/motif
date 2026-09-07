import Image from "next/image";
import SiteHeader from "../components/site-header";

export default function Loading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-motif-black text-motif-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:42px_42px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[11%] top-0 h-full w-px bg-motif-red/45"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 -top-28 hidden lg:block"
      >
        <Image
          src="/assets/persian-rug-1.png"
          alt=""
          width={700}
          height={420}
          className="w-[40rem] rotate-[11deg] opacity-80"
          priority
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 top-64 hidden md:block"
      >
        <Image
          src="/assets/star.png"
          alt=""
          width={220}
          height={220}
          className="w-44 -rotate-12"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-[52rem] hidden lg:block"
      >
        <Image
          src="/assets/cd.png"
          alt=""
          width={260}
          height={260}
          className="w-56 opacity-80"
        />
      </div>

      <SiteHeader priority />

      <div
        aria-busy="true"
        aria-live="polite"
        className="relative z-10 mx-auto w-full max-w-[90rem] animate-pulse px-5 pb-24 pt-14 sm:px-10 sm:pt-20 lg:px-16 lg:pt-28"
      >
        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-9">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-6 w-36 bg-motif-red/80" />
              <span className="h-px flex-1 bg-motif-ivory/35" />
            </div>

            <div className="space-y-3">
              <div className="h-14 max-w-xs bg-motif-ivory/25 sm:h-24 lg:h-32" />
              <div className="h-14 max-w-sm bg-motif-ivory/25 sm:h-24 lg:h-32" />
              <div className="mt-4 h-16 max-w-xl rotate-[-1deg] bg-motif-red/90 sm:h-24 lg:h-28" />
            </div>
          </div>

          <aside className="relative self-end border-2 border-motif-ivory bg-motif-ivory p-3 text-motif-black shadow-[10px_10px_0_var(--color-motif-blue)] lg:col-span-3 lg:rotate-2">
            <div className="mb-3 border-b-2 border-motif-black pb-2">
              <div className="h-3 w-28 bg-motif-black/25" />
            </div>
            <div>
              {["c1", "c2", "c3", "c4", "c5"].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-[3rem_1fr] items-stretch border-b border-motif-black last:border-b-0"
                >
                  <span className="min-h-12 border-x border-motif-black bg-motif-black/15" />
                  <span className="flex flex-col justify-center gap-1.5 px-3 py-2">
                    <span className="h-3 w-28 bg-motif-black/20" />
                    <span className="h-2 w-16 bg-motif-black/10" />
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <div className="mt-6 lg:col-span-12 lg:mt-10">
            <div className="w-full space-y-3 border-l-[6px] border-motif-blue pl-5">
              <div className="h-4 max-w-4xl bg-motif-ivory/15" />
              <div className="h-4 max-w-3xl bg-motif-ivory/15" />
              <div className="h-4 max-w-2xl bg-motif-ivory/10" />
            </div>
          </div>
        </div>

        <section className="relative mt-28 border-b border-motif-ivory pb-11 sm:mt-40">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-6 w-32 bg-motif-red/80" />
            <span className="h-px flex-1 bg-motif-ivory/35" />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-6">
            {["t1", "t2", "t3", "t4"].map((item, index) => (
              <div
                key={item}
                className="h-12 border-2 border-motif-ivory/40 bg-motif-charcoal shadow-[5px_5px_0_var(--color-motif-red)]"
                style={{ width: `${9 + (index % 3) * 3}rem` }}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
