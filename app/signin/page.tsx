import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AnimatedContainer from "../components/animated-container";
import EmailPasswordForm from "../components/email-password-form";
import GoogleSignInButton from "../components/google-sign-in-button";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to continue building your Motif taste profile.",
  alternates: {
    canonical: "/signin",
  },
};

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    verification?: string | string[];
    reset?: string | string[];
    mode?: string | string[];
  }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/find-my-vibe");
  }

  const params = await searchParams;
  const callbackUrl = Array.isArray(params.callbackUrl)
    ? params.callbackUrl[0]
    : params.callbackUrl;
  const safeCallbackUrl = callbackUrl?.startsWith("/")
    ? callbackUrl
    : "/find-my-vibe";
  const verification = Array.isArray(params.verification)
    ? params.verification[0]
    : params.verification;
  const reset = Array.isArray(params.reset) ? params.reset[0] : params.reset;
  const modeParam = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const initialMode = modeParam === "signup" ? "signup" : "signin";

  return (
    <AnimatedContainer>
      <main className="relative min-h-screen overflow-hidden bg-motif-black text-motif-ivory">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />

        <SiteHeader priority />

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

              {reset === "success" && (
                <p
                  role="status"
                  className="mt-5 border-l-4 border-motif-blue px-3 text-sm font-bold text-motif-charcoal"
                >
                  Password updated. Sign in with your new password.
                </p>
              )}

              <EmailPasswordForm
                callbackUrl={safeCallbackUrl}
                initialMode={initialMode}
              />

              <p className="mt-6 text-[10px] font-bold uppercase leading-5 tracking-[0.12em] text-motif-charcoal/60">
                By continuing you agree to our{" "}
                <Link href="/terms" className="text-motif-red underline underline-offset-2">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-motif-red underline underline-offset-2">
                  Privacy Policy
                </Link>
                . Support:{" "}
                <Link
                  href="/contact"
                  className="text-motif-red underline underline-offset-2"
                >
                  Contact
                </Link>
              </p>
            </div>
          </section>

          <aside className="relative hidden min-h-[32rem] overflow-hidden bg-motif-black lg:col-span-5 lg:block">
            <Image
              src="/assets/sign-in-bg.png"
              alt=""
              fill
              priority
              sizes="42vw"
              className="object-cover object-[72%_center]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-motif-black via-motif-black/55 to-motif-black/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]"
            />

            <div className="absolute inset-x-0 bottom-0 z-10 p-10 lg:p-12">
              <span className="inline-block bg-motif-red px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                Members keep the thread
              </span>
              <h2 className="mt-6 max-w-md text-5xl font-black uppercase leading-[0.82] tracking-[-0.07em] xl:text-6xl">
                Your taste
                <span className="bodoniModa mt-2 block font-normal italic normal-case text-motif-taupe">
                  has a pattern.
                </span>
              </h2>
              <p className="mt-6 max-w-sm border-l-[6px] border-motif-red pl-5 text-sm leading-7 text-motif-ivory/75">
                Verified accounts unlock five analyses and five searches each
                week — so the profile you build stays usable.
              </p>
            </div>
          </aside>
        </div>

        <SiteFooter />
      </main>
    </AnimatedContainer>
  );
}
