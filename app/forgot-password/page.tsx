import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AnimatedContainer from "../components/animated-container";
import ForgotPasswordForm from "../components/forgot-password-form";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a Motif password reset link.",
  alternates: {
    canonical: "/forgot-password",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/find-my-vibe");
  }

  return (
    <AnimatedContainer>
      <main className="relative min-h-screen overflow-hidden bg-motif-black text-motif-ivory">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]"
        />

        <SiteHeader priority />

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-[96rem] lg:grid-cols-12">
          <section className="relative flex items-center border-b-2 border-motif-ivory px-5 py-14 sm:px-10 lg:col-span-7 lg:border-b-0 lg:border-r-2 lg:px-14 lg:py-20">
            <div className="relative mx-auto w-full max-w-xl border-2 border-motif-ivory bg-motif-ivory p-5 text-motif-black shadow-[12px_12px_0_var(--color-motif-red)] sm:p-8">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-motif-red">
                Password reset / 001
              </p>
              <h1 className="text-5xl font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-6xl">
                Forgot
                <span className="bodoniModa block font-normal italic normal-case text-motif-red">
                  your password?
                </span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-6 text-motif-charcoal/70 sm:text-base">
                Enter the email on your Motif account and we will send a reset
                link if a password login exists for it.
              </p>

              <div className="mt-8">
                <ForgotPasswordForm />
              </div>

              <p className="mt-6 text-[10px] font-bold uppercase leading-5 tracking-[0.12em] text-motif-charcoal/60">
                Remembered it?{" "}
                <Link
                  href="/signin"
                  className="text-motif-red underline underline-offset-2"
                >
                  Sign in
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
            <div className="absolute inset-x-0 bottom-0 z-10 p-10 lg:p-12">
              <h2 className="max-w-md text-5xl font-black uppercase leading-[0.82] tracking-[-0.07em]">
                Back to
                <span className="bodoniModa mt-2 block font-normal italic normal-case text-motif-taupe">
                  your archive.
                </span>
              </h2>
            </div>
          </aside>
        </div>

        <SiteFooter />
      </main>
    </AnimatedContainer>
  );
}
