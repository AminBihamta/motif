"use client";

import { ContainerScroll } from "./container-scroll-animation";

export default function HomepageVideoScroll() {
  return (
    <section className="relative z-10 hidden overflow-hidden border-b-2 border-motif-ivory bg-motif-black text-motif-ivory md:block">
      <ContainerScroll
        titleComponent={
          <h2 className="text-4xl font-black uppercase leading-[0.88] tracking-[-0.05em] text-motif-ivory sm:text-6xl md:text-[5.5rem]">
            Watch taste
            <span className="bodoniModa mt-2 block font-normal italic normal-case text-motif-taupe">
              become a profile.
            </span>
          </h2>
        }
      >
        <video
          src="/assets/marketing/motif-showcase.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Motif product showcase video"
          className="h-full w-full object-cover object-center"
        />
      </ContainerScroll>
    </section>
  );
}
