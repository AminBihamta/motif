import Image from "next/image";
import Link from "next/link";
import { auth } from "../../auth";
import VibeResults from "../components/vibe-results";
import ProductSearch from "../components/product-search";
import MotifLogo from "../components/motif-logo";
import { AmbientDecor } from "../components/motion-elements";
import { getAnonymousOwnerId, getTasteProfile } from "../lib/taste-profile";
import { getUsageSummary } from "../lib/usage-allowance";

export default async function MyVibe() {
  const session = await auth();
  const tasteProfile = await getTasteProfile(session?.user?.id);
  const usage = await getUsageSummary({
    userId: session?.user?.id,
    anonymousOwnerId: session?.user?.id ? undefined : await getAnonymousOwnerId(),
  });

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
        <Image id="rotating-cd" src="/assets/cd.png" alt="" width={260} height={260} className="w-56 opacity-80" />
      </AmbientDecor>

      <header className="relative z-20 mx-3 mt-3 flex items-stretch justify-between border-2 border-motif-ivory bg-motif-black sm:mx-5 sm:mt-5">
        <Link
          href="/"
          className="group flex items-center border-r-2 border-motif-ivory px-4 py-3 transition-colors hover:bg-motif-ivory focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-7"
        >
          <MotifLogo className="h-6 w-auto transition group-hover:brightness-0 sm:h-7" priority />
        </Link>
        <Link
          href="/find-my-vibe"
          className="flex items-center border-l-2 border-motif-ivory bg-motif-red px-4 text-xs font-bold uppercase tracking-[0.16em] transition-colors hover:bg-motif-ivory hover:text-motif-red focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-black sm:px-7 sm:text-sm"
        >
          Start over ↗
        </Link>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-5 pb-24 pt-14 sm:px-10 sm:pt-20 lg:px-16 lg:pt-28">
        <VibeResults analysis={tasteProfile} />

        {tasteProfile && <ProductSearch usage={usage} />}
      </div>

      <footer className="relative z-10 flex items-center justify-between border-t border-motif-ivory/35 bg-motif-black px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-motif-ivory/55 sm:px-10">
        <span>Your taste, translated</span>
        <span>Motif © 2026</span>
      </footer>
    </main>
  );
}
