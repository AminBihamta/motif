"use client";

import { useActionState } from "react";
import {
  submitContactForm,
  type ContactFormState,
} from "../contact/actions";

const initialState: ContactFormState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border-2 border-motif-blue bg-motif-charcoal p-6 text-motif-ivory shadow-[8px_8px_0_var(--color-motif-red)]"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-motif-red">
          Message sent
        </p>
        <p className="mt-3 text-lg font-bold leading-7">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-motif-ivory">
          Name
        </span>
        <input
          name="name"
          type="text"
          required
          placeholder="John"
          autoComplete="name"
          disabled={pending}
          className="w-full border-2 border-motif-ivory bg-motif-black px-4 py-3 text-sm text-motif-ivory placeholder:text-motif-taupe/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-motif-red disabled:opacity-60"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-motif-ivory">
          Email Address
        </span>
        <input
          name="email"
          type="email"
          required
          placeholder="name@example.com"
          autoComplete="email"
          disabled={pending}
          className="w-full border-2 border-motif-ivory bg-motif-black px-4 py-3 text-sm text-motif-ivory placeholder:text-motif-taupe/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-motif-red disabled:opacity-60"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-motif-ivory">
          Enquiry
        </span>
        <textarea
          name="enquiry"
          required
          rows={6}
          placeholder="I’m enquiring about …"
          disabled={pending}
          className="w-full resize-y border-2 border-motif-ivory bg-motif-black px-4 py-3 text-sm text-motif-ivory placeholder:text-motif-taupe/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-motif-red disabled:opacity-60"
        />
      </label>

      {state.status === "error" && (
        <p
          role="alert"
          className="border-2 border-motif-red bg-motif-black px-4 py-3 text-sm font-bold text-motif-ivory"
        >
          <span className="mr-2 text-motif-red">Error /</span>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[3.25rem] w-full items-center justify-center border-2 border-motif-ivory bg-motif-red px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[6px_6px_0_var(--color-motif-blue)] transition-colors hover:bg-motif-ivory hover:text-motif-red disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
