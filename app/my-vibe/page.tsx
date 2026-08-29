import Image from "next/image";
import Link from "next/link";
import VibeResults from "../components/vibe-results";
import ProductSearch from "../components/product-search";
import { AmbientDecor, CollageCard, Reveal } from "../components/motion-elements";
import { getTasteProfile } from "../lib/taste-profile";

const evidenceCardClasses = [
  "col-span-7 row-span-2 sm:col-span-4 lg:col-span-3",
  "col-span-5 sm:col-span-3 lg:col-span-2 lg:translate-y-10",
  "col-span-5 sm:col-span-5 lg:col-span-3",
  "col-span-7 sm:col-span-4 lg:col-span-2 lg:-translate-y-7",
  "col-span-6 sm:col-span-4 lg:col-span-2 lg:translate-y-14",
  "col-span-6 sm:col-span-4 lg:col-span-2",
];

export default async function MyVibe() {
  const tasteProfile = await getTasteProfile();

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

      <AmbientDecor className="pointer-events-none absolute -right-56 -top-28 hidden lg:block">
        <Image src="/assets/persian-rug-1.png" alt="" width={700} height={420} className="w-[40rem] rotate-[11deg] opacity-80" />
      </AmbientDecor>
      <AmbientDecor delay={1.2} className="pointer-events-none absolute -left-14 top-64 hidden md:block">
        <Image src="/assets/star.png" alt="" width={220} height={220} className="w-44 -rotate-12" />
      </AmbientDecor>
      <AmbientDecor delay={2.4} className="pointer-events-none absolute -right-24 top-[52rem] hidden lg:block">
        <Image src="/assets/cd.png" alt="" width={260} height={260} className="w-56 rotate-12 opacity-80" />
      </AmbientDecor>

      <header className="relative z-20 mx-3 mt-3 flex items-stretch justify-between border-2 border-motif-ivory bg-motif-black sm:mx-5 sm:mt-5">
        <Link
          href="/"
          className="bodoniModa flex items-center border-r-2 border-motif-ivory px-4 py-3 text-2xl font-black uppercase tracking-[-0.05em] transition-colors hover:bg-motif-ivory hover:text-motif-black focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-7 sm:text-3xl"
        >
          Motif
        </Link>
        <p className="hidden items-center px-6 text-[10px] uppercase tracking-[0.32em] text-motif-taupe md:flex">
          Personal taste report / 001
        </p>
        <Link
          href="/find-my-vibe"
          className="flex items-center border-l-2 border-motif-ivory bg-motif-red px-4 text-xs font-bold uppercase tracking-[0.16em] transition-colors hover:bg-motif-ivory hover:text-motif-red focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-black sm:px-7 sm:text-sm"
        >
          Start over ↗
        </Link>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-5 pb-24 pt-14 sm:px-10 sm:pt-20 lg:px-16 lg:pt-28">
        <VibeResults analysis={tasteProfile} />

        {tasteProfile && (
          <>
            <ProductSearch />
            <Reveal className="relative mt-24 border-2 border-motif-ivory bg-motif-ivory p-2 text-motif-black sm:mt-36 sm:p-4" aria-labelledby="evidence-heading">
            <div className="absolute -left-2 -top-8 rotate-[-2deg] bg-motif-blue px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-motif-ivory sm:-left-5">
              Visual evidence
            </div>
            <div className="grid gap-6 border-b-2 border-motif-black px-2 pb-6 pt-7 sm:px-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
              <h2
                id="evidence-heading"
                className="max-w-4xl text-5xl font-black uppercase leading-[0.82] tracking-[-0.06em] sm:text-7xl lg:text-8xl"
              >
                Follow the
                <span className="bodoniModa block font-normal italic text-motif-red">
                  visual thread.
                </span>
              </h2>
              <div className="border-l-4 border-motif-red pl-4">
                <p className="text-sm leading-6">{tasteProfile.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tasteProfile.characteristics.map((characteristic) => (
                    <span
                      key={characteristic}
                      className="border border-motif-black px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em]"
                    >
                      {characteristic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {tasteProfile.images.length === 6 ? (
              <div className="mt-2 grid auto-rows-[8rem] grid-cols-12 gap-2 sm:auto-rows-[10rem] lg:auto-rows-[13rem]">
                {tasteProfile.images.map(({ id, position }, index) => (
                  <CollageCard
                    key={id}
                    delay={index * 0.07}
                    className={`group relative min-h-0 overflow-hidden border-2 border-motif-black ${evidenceCardClasses[index]}`}
                  >
                    <Image
                      src={`/api/taste-images/${id}`}
                      alt={`Uploaded visual reference ${position} for ${tasteProfile.vibeName}`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 58vw, (max-width: 1024px) 42vw, 25vw"
                      className="object-cover saturate-[0.85] transition duration-500 group-hover:scale-110 group-hover:saturate-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <span className="absolute bottom-0 left-0 bg-motif-black px-2 py-1 text-[10px] font-bold text-motif-ivory">
                      EVIDENCE—{String(position).padStart(2, "0")}
                    </span>
                  </CollageCard>
                ))}
              </div>
            ) : (
              <div className="mt-2 flex min-h-64 flex-col items-center justify-center border-2 border-dashed border-motif-black px-6 py-12 text-center">
                <p className="max-w-lg text-sm font-bold uppercase leading-6 tracking-[0.12em]">
                  This profile predates saved visual evidence. Recalibrate it to
                  connect your six images to the thread.
                </p>
                <Link
                  href="/find-my-vibe"
                  className="mt-6 border-2 border-motif-black bg-motif-red px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-motif-ivory transition-transform hover:-translate-y-1"
                >
                  Recalibrate ↗
                </Link>
              </div>
            )}
            </Reveal>
          </>
        )}
      </div>

      <footer className="relative z-10 flex items-center justify-between border-t-2 border-motif-ivory bg-motif-red px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] sm:px-10">
        <span>Your taste, translated</span>
        <span>Motif © 2026</span>
      </footer>
    </main>
  );
}
