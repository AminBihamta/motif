import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Spark } from "iconoir-react";
import AnimatedContainer from "../components/animated-container";
import EmailPasswordForm from "../components/email-password-form";
import GoogleSignInButton from "../components/google-sign-in-button";
import MotifLogo from "../components/motif-logo";

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

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[]; verification?: string | string[] }>;
}) {
  const params = await searchParams;
  const callbackUrl = Array.isArray(params.callbackUrl)
    ? params.callbackUrl[0]
    : params.callbackUrl;
  const safeCallbackUrl = callbackUrl?.startsWith("/")
    ? callbackUrl
    : "/my-vibe";
  const verification = Array.isArray(params.verification)
    ? params.verification[0]
    : params.verification;

  return (
    <AnimatedContainer>
      <main className="relative min-h-screen overflow-hidden bg-motif-black text-motif-ivory">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />

        <header className="relative z-30 flex min-h-16 items-stretch border-b-2 border-motif-ivory bg-motif-black">
          <Link href="/" className="group flex items-center border-r-2 border-motif-ivory px-5 transition-colors hover:bg-motif-ivory focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-8">
            <MotifLogo className="h-7 w-auto transition group-hover:brightness-0 sm:h-8" priority />
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

              <div className="pb-6">
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

              <GoogleSignInButton callbackUrl={safeCallbackUrl} />

              {verification && (
                <p role="status" className={`mt-5 border-l-4 px-3 text-sm font-bold ${verification === "success" ? "border-motif-blue text-motif-charcoal" : "border-motif-red text-motif-red"}`}>
                  {verification === "success"
                    ? "Email verified — your five analyses and five searches per week are ready."
                    : "That verification link is invalid or has expired. Request a new one below."}
                </p>
              )}

              <EmailPasswordForm callbackUrl={safeCallbackUrl} />
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
