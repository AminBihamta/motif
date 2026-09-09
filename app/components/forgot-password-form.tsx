"use client";

import { ArrowRight } from "iconoir-react";
import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordResetAction,
  type ForgotPasswordState,
} from "../forgot-password/actions";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">
          Email address
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full border-2 border-motif-black bg-transparent px-4 py-3 font-bold outline-none focus:shadow-[5px_5px_0_var(--color-motif-red)]"
          placeholder="yourname@example.com"
        />
      </label>

      {state.error ? (
        <p
          role="alert"
          className="border-l-4 border-motif-red px-3 text-sm font-bold text-motif-red"
        >
          {state.error}
        </p>
      ) : null}
      {state.notice ? (
        <p
          role="status"
          className="border-l-4 border-motif-blue px-3 text-sm font-bold text-motif-charcoal"
        >
          {state.notice}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="group flex w-full items-center justify-between border-2 border-motif-black bg-motif-red px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-motif-ivory shadow-[6px_6px_0_var(--color-motif-blue)] transition-all hover:bg-motif-black disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Sending link..." : "Send reset link"}
        <ArrowRight
          aria-hidden="true"
          className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </button>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.14em]">
        <Link
          href="/signin"
          className="text-motif-red underline underline-offset-4"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
