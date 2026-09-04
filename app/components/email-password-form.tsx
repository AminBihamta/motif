"use client";

import { ArrowRight } from "iconoir-react";
import { signIn } from "next-auth/react";
import { useActionState, useState } from "react";
import {
  registerAccount,
  resendVerification,
  type RegistrationState,
} from "../signin/actions";
import { capturePostHogEvent } from "../lib/posthog";

const initialRegistrationState: RegistrationState = {};

export default function EmailPasswordForm({ callbackUrl }: { callbackUrl: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInError, setSignInError] = useState("");
  const [pending, setPending] = useState(false);
  const [registrationState, registrationAction, registrationPending] = useActionState(
    registerAccount,
    initialRegistrationState,
  );
  const [resendState, resendAction, resendPending] = useActionState(
    resendVerification,
    initialRegistrationState,
  );

  async function handleSignIn(formData: FormData) {
    capturePostHogEvent("sign_in_started");
    setPending(true);
    setSignInError("");

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      redirectTo: callbackUrl,
    });

    if (!result?.ok) {
      setSignInError("That email and password combination did not work.");
      setPending(false);
      return;
    }

    window.location.assign(result.url ?? callbackUrl);
  }

  return (
    <div className="relative mt-8 border-t-2 border-motif-black pt-6">
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-motif-ivory px-3 text-[10px] font-black uppercase tracking-[0.2em]">
        Or
      </span>
      <div className="mb-5 flex border-2 border-motif-black p-1 text-[10px] font-black uppercase tracking-[0.16em]">
        <button type="button" onClick={() => setMode("signin")} className={`flex-1 px-3 py-3 transition-colors ${mode === "signin" ? "bg-motif-black text-motif-ivory" : "hover:bg-motif-taupe/20"}`}>Sign in</button>
        <button type="button" onClick={() => setMode("signup")} className={`flex-1 px-3 py-3 transition-colors ${mode === "signup" ? "bg-motif-black text-motif-ivory" : "hover:bg-motif-taupe/20"}`}>Create account</button>
      </div>

      {mode === "signup" ? (
        <form
          action={registrationAction}
          onSubmit={() => capturePostHogEvent("account_registration_submitted")}
          className="space-y-4"
        >
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">Your name</span><input name="name" type="text" autoComplete="name" required className="w-full border-2 border-motif-black bg-transparent px-4 py-3 font-bold outline-none focus:shadow-[5px_5px_0_var(--color-motif-red)]" placeholder="Amin Bihamta" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">Email address</span><input name="email" type="email" autoComplete="email" required className="w-full border-2 border-motif-black bg-transparent px-4 py-3 font-bold outline-none focus:shadow-[5px_5px_0_var(--color-motif-red)]" placeholder="yourname@example.com" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">Password</span><input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required className="w-full border-2 border-motif-black bg-transparent px-4 py-3 font-bold outline-none focus:shadow-[5px_5px_0_var(--color-motif-red)]" placeholder="At least 8 characters" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">Confirm password</span><input name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} maxLength={72} required className="w-full border-2 border-motif-black bg-transparent px-4 py-3 font-bold outline-none focus:shadow-[5px_5px_0_var(--color-motif-red)]" placeholder="Repeat your password" /></label>
          {registrationState.error && <p role="alert" className="border-l-4 border-motif-red px-3 text-sm font-bold text-motif-red">{registrationState.error}</p>}
          {registrationState.notice && <p role="status" className="border-l-4 border-motif-blue px-3 text-sm font-bold text-motif-charcoal">{registrationState.notice}</p>}
          <button type="submit" disabled={registrationPending} className="group flex w-full items-center justify-between border-2 border-motif-black bg-motif-red px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-motif-ivory shadow-[6px_6px_0_var(--color-motif-blue)] transition-all hover:bg-motif-black disabled:cursor-wait disabled:opacity-60">{registrationPending ? "Creating your archive..." : "Create account"}<ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" /></button>
        </form>
      ) : (
        <form action={handleSignIn} className="space-y-4">
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">Email address</span><input name="email" type="email" autoComplete="email" required className="w-full border-2 border-motif-black bg-transparent px-4 py-3 font-bold outline-none focus:shadow-[5px_5px_0_var(--color-motif-red)]" placeholder="yourname@example.com" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">Password</span><input name="password" type="password" autoComplete="current-password" required className="w-full border-2 border-motif-black bg-transparent px-4 py-3 font-bold outline-none focus:shadow-[5px_5px_0_var(--color-motif-red)]" placeholder="Enter your password" /></label>
          {signInError && <p role="alert" className="border-l-4 border-motif-red px-3 text-sm font-bold text-motif-red">{signInError}</p>}
          <button type="submit" disabled={pending} className="group flex w-full items-center justify-between border-2 border-motif-black bg-motif-red px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-motif-ivory shadow-[6px_6px_0_var(--color-motif-blue)] transition-all hover:bg-motif-black disabled:cursor-wait disabled:opacity-60">{pending ? "Checking your archive..." : "Sign in"}<ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" /></button>
        </form>
      )}

      <form action={resendAction} className="mt-5 border-t border-motif-black pt-5">
        <label className="block"><span className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em]">Need a new verification link?</span><input name="email" type="email" autoComplete="email" required className="w-full border-2 border-motif-black bg-transparent px-4 py-2 text-sm font-bold outline-none focus:shadow-[4px_4px_0_var(--color-motif-blue)]" placeholder="yourname@example.com" /></label>
        {resendState.error && <p role="alert" className="mt-2 text-xs font-bold text-motif-red">{resendState.error}</p>}
        {resendState.notice && <p role="status" className="mt-2 text-xs font-bold text-motif-charcoal/70">{resendState.notice}</p>}
        <button type="submit" disabled={resendPending} className="mt-3 text-[10px] font-black uppercase tracking-[0.15em] underline underline-offset-4 disabled:opacity-50">{resendPending ? "Sending..." : "Resend verification"}</button>
      </form>
    </div>
  );
}
