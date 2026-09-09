import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AnimatedContainer from "../components/animated-container";
import ResetPasswordForm from "../components/reset-password-form";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new Motif password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/find-my-vibe");
  }

  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const hasToken = Boolean(token && token.length > 0 && token.length <= 256);

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
                Password reset / 002
              </p>
              <h1 className="text-5xl font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-6xl">
                Choose
                <span className="bodoniModa block font-normal italic normal-case text-motif-red">
                  a new password.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-6 text-motif-charcoal/70 sm:text-base">
                Enter a new password, then confirm it. You will return to sign
                in when it is saved.
              </p>

              <div className="mt-8">
                {hasToken && token ? (
                  <ResetPasswordForm token={token} />
                ) : (
                  <div className="space-y-4">
                    <p
                      role="alert"
                      className="border-l-4 border-motif-red px-3 text-sm font-bold text-motif-red"
                    >
                      That reset link is invalid or has expired.
                    </p>
                    <Link
                      href="/forgot-password"
                      className="inline-flex text-[10px] font-black uppercase tracking-[0.14em] text-motif-red underline underline-offset-4"
                    >
                      Request a new link
                    </Link>
                  </div>
                )}
              </div>
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
                One more
                <span className="bodoniModa mt-2 block font-normal italic normal-case text-motif-taupe">
                  step in.
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
