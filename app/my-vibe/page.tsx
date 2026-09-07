import Image from "next/image";
import type { Metadata } from "next";
import { auth } from "../../auth";
import VibeResults from "../components/vibe-results";
import ProductSearch from "../components/product-search";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { AmbientDecor } from "../components/motion-elements";
import { getAnonymousOwnerId, getTasteProfile } from "../lib/taste-profile";
import { getUsageSummary } from "../lib/usage-allowance";

export const metadata: Metadata = {
  title: "My Vibe",
  description: "Your Motif taste profile.",
  robots: {
    index: false,
    follow: false,
  },
};

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

      <SiteHeader priority />

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-5 pb-24 pt-14 sm:px-10 sm:pt-20 lg:px-16 lg:pt-28">
        <VibeResults analysis={tasteProfile} />

        {tasteProfile && <ProductSearch usage={usage} />}
      </div>

      <SiteFooter />
    </main>
  );
}
