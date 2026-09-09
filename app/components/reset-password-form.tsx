"use client";

import { ArrowRight } from "iconoir-react";
import Link from "next/link";
import { useActionState } from "react";
import {
  resetPasswordAction,
  type ResetPasswordState,
} from "../reset-password/actions";

const initialState: ResetPasswordState = {};

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <label className="block">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">
          New password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          className="w-full border-2 border-motif-black bg-transparent px-4 py-3 font-bold outline-none focus:shadow-[5px_5px_0_var(--color-motif-red)]"
          placeholder="At least 8 characters"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em]">
          Confirm password
        </span>
        <input
          name="passwordConfirmation"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          className="w-full border-2 border-motif-black bg-transparent px-4 py-3 font-bold outline-none focus:shadow-[5px_5px_0_var(--color-motif-red)]"
          placeholder="Repeat your password"
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

      <button
        type="submit"
        disabled={pending}
        className="group flex w-full items-center justify-between border-2 border-motif-black bg-motif-red px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-motif-ivory shadow-[6px_6px_0_var(--color-motif-blue)] transition-all hover:bg-motif-black disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Updating password..." : "Save new password"}
        <ArrowRight
          aria-hidden="true"
          className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </button>

      <p className="text-center text-[10px] font-black uppercase tracking-[0.14em]">
        <Link
          href="/forgot-password"
          className="text-motif-red underline underline-offset-4"
        >
          Request a new link
        </Link>
      </p>
    </form>
  );
}
