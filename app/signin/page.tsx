import type { Metadata } from "next";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Spark } from "iconoir-react";
import AnimatedContainer from "../components/animated-container";

export const metadata: Metadata = {
  title: "Sign In — Motif",
  description: "Sign in to continue building your Motif taste profile.",
};

const collageImages = [
  "/assets/style-references/01-mid-century.jpg",
  "/assets/style-references/14-bohemian.jpg",
  "/assets/style-references/27-bauhaus.jpg",
  "/assets/style-references/36-art-deco.jpg",
];

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="size-5 shrink-0"
    >
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function SignIn() {
  return (
    <AnimatedContainer>
      <main className="relative min-h-screen overflow-hidden bg-motif-black text-motif-ivory">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />

        <header className="relative z-30 flex min-h-16 items-stretch border-b-2 border-motif-ivory bg-motif-black">
          <Link href="/" className="bodoniModa flex items-center border-r-2 border-motif-ivory px-5 text-3xl font-black tracking-[-0.06em] transition-colors hover:bg-motif-ivory hover:text-motif-black focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-8">
            Motif
          </Link>
          <p className="hidden flex-1 items-center px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-motif-taupe md:flex">
            Member access / private archive
          </p>
          <Link href="/" className="flex items-center border-l-2 border-motif-ivory px-4 text-[10px] font-black uppercase tracking-[0.18em] transition-colors hover:bg-motif-blue sm:px-6 sm:text-xs">
            Return home ×
          </Link>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-[96rem] lg:grid-cols-12">
          <section className="relative flex items-center border-b-2 border-motif-ivory px-5 py-14 sm:px-10 lg:col-span-7 lg:border-b-0 lg:border-r-2 lg:px-14 lg:py-20">
            <Image aria-hidden="true" src="/assets/persian-rug-1.png" alt="" width={700} height={420} className="pointer-events-none absolute -left-52 -top-36 hidden w-[35rem] -rotate-12 opacity-70 md:block" />
            <Image aria-hidden="true" src="/assets/cd.png" alt="" width={260} height={260} className="pointer-events-none absolute -bottom-24 -right-20 hidden w-56 rotate-12 opacity-80 sm:block" />

            <div className="relative mx-auto w-full max-w-xl border-2 border-motif-ivory bg-motif-ivory p-5 text-motif-black shadow-[12px_12px_0_var(--color-motif-red)] sm:p-8">
              <span className="absolute -right-3 -top-5 rotate-3 border-2 border-motif-black bg-motif-blue px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-motif-ivory">
                Good to see you
              </span>

              <div className="border-b-2 border-motif-black pb-6">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-motif-red">
                  Identity check / 001
                </p>
                <h1 className="text-5xl font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-7xl">
                  Welcome
                  <span className="bodoniModa block font-normal italic normal-case text-motif-red">
                    back to your taste.
                  </span>
                </h1>
                <p className="mt-5 max-w-md text-sm leading-6 text-motif-charcoal/70 sm:text-base">
                  Sign in to revisit your visual profile and keep decoding the
                  things that feel unmistakably you.
                </p>
              </div>

              <Link href="" className="mt-6 flex w-full items-center justify-center gap-3 border-2 border-motif-black bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.1em] text-motif-black transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--color-motif-blue)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-motif-red motion-reduce:transform-none">
                <GoogleMark />
                Sign in with Google
              </Link>

              <div className="my-6 flex items-center gap-3" aria-hidden="true">
                <span className="h-0.5 flex-1 bg-motif-black" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Or use email</span>
                <span className="h-0.5 flex-1 bg-motif-black" />
              </div>

              <Form action="/signin" className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">Email address</span>
                  <input className="w-full border-2 border-motif-black bg-transparent px-4 py-3 text-base font-bold outline-none transition-shadow placeholder:text-motif-charcoal/40 focus:shadow-[5px_5px_0_var(--color-motif-red)]" name="email" type="email" autoComplete="email" placeholder="yourname@example.com" required />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.18em]">
                    Password
                    <button type="button" className="cursor-pointer text-motif-red underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-motif-red">
                      Forgot password?
                    </button>
                  </span>
                  <input className="w-full border-2 border-motif-black bg-transparent px-4 py-3 text-base font-bold outline-none transition-shadow placeholder:text-motif-charcoal/40 focus:shadow-[5px_5px_0_var(--color-motif-red)]" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
                </label>

                <button type="submit" className="group flex w-full cursor-pointer items-center justify-between border-2 border-motif-black bg-motif-red px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-motif-ivory shadow-[6px_6px_0_var(--color-motif-blue)] transition-all hover:bg-motif-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-motif-red">
                  Sign in
                  <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </button>
              </Form>

              <p className="mt-8 border-t-2 border-motif-black pt-5 text-center text-sm font-bold">
                New to Motif?{" "}
                <Link href="/signin" className="text-motif-red underline decoration-2 underline-offset-4 hover:text-motif-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-motif-red">
                  Create an account
                </Link>
              </p>
            </div>
          </section>

          <aside className="relative hidden overflow-hidden bg-motif-blue p-8 lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:p-12">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(232,221,200,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.16)_1px,transparent_1px)] [background-size:38px_38px]" />
            <div className="relative flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em]">
              <Spark aria-hidden="true" className="size-5" />
              Your private visual archive
            </div>

            <div className="relative my-10 grid h-[28rem] grid-cols-2 grid-rows-2 gap-2 rotate-2">
              {collageImages.map((src, index) => (
                <div key={src} className={`group relative overflow-hidden border-2 border-motif-black ${index === 0 ? "mt-8" : ""} ${index === 3 ? "-mt-8 mb-8" : ""}`}>
                  <Image src={src} alt="Visual inspiration" fill sizes="20vw" className="object-cover transition duration-500 group-hover:scale-110 motion-reduce:transition-none" />
                  <span className="absolute bottom-0 left-0 bg-motif-ivory px-2 py-1 text-[9px] font-black text-motif-black">ARCH—0{index + 1}</span>
                </div>
              ))}
              <span className="absolute -left-5 top-1/2 -translate-y-1/2 -rotate-6 border-2 border-motif-black bg-motif-red px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] shadow-[4px_4px_0_var(--color-motif-ivory)]">
                Saved for later
              </span>
            </div>

            <blockquote className="relative border-t-2 border-motif-ivory pt-6">
              <p className="bodoniModa text-4xl italic leading-[0.95]">
                “Taste is memory with better lighting.”
              </p>
              <footer className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-motif-ivory/60">Motif field note / 07</footer>
            </blockquote>
          </aside>
        </div>
      </main>
    </AnimatedContainer>
  );
}
