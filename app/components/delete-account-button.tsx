"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { deleteAccountAction } from "./delete-account-action";

const defaultTriggerClassName =
  "flex shrink-0 items-center border-l-2 border-motif-ivory px-3 text-[10px] font-black uppercase tracking-[0.16em] text-motif-taupe transition-colors hover:bg-motif-red hover:text-motif-ivory focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-5";

export default function DeleteAccountButton({
  className = defaultTriggerClassName,
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const titleId = useId();
  const descriptionId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        setOpen(false);
        setError(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, pending]);

  function closeDialog() {
    if (pending) return;
    setOpen(false);
    setError(null);
  }

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteAccountAction();
      } catch (err) {
        const digest =
          typeof err === "object" &&
          err !== null &&
          "digest" in err &&
          typeof (err as { digest?: unknown }).digest === "string"
            ? (err as { digest: string }).digest
            : null;

        // Server Actions surface redirects as thrown NEXT_REDIRECT errors.
        if (digest?.startsWith("NEXT_REDIRECT")) {
          throw err;
        }

        console.error("Account deletion failed:", err);
        setError("We could not delete your account. Please try again.");
      }
    });
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Delete account
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Dismiss delete account dialog"
            className="absolute inset-0 bg-motif-black/80"
            onClick={closeDialog}
            disabled={pending}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative z-10 w-full max-w-md border-2 border-motif-ivory bg-motif-black p-6 text-motif-ivory shadow-[10px_10px_0_var(--color-motif-red)] sm:p-8"
          >
            <h2
              id={titleId}
              className="text-2xl font-black uppercase leading-[0.9] tracking-[-0.04em]"
            >
              Delete your Motif account?
            </h2>
            <p
              id={descriptionId}
              className="mt-4 border-l-[6px] border-motif-red pl-4 text-sm leading-6 text-motif-ivory/75"
            >
              This permanently deletes your vibe profile, uploaded images,
              search history and allowances, and sign-in data. This cannot be
              undone.
            </p>

            {error ? (
              <p role="alert" className="mt-4 text-sm font-bold text-motif-red">
                {error}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={closeDialog}
                disabled={pending}
                className="border-2 border-motif-ivory px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-motif-ivory transition-colors hover:bg-motif-ivory hover:text-motif-black disabled:opacity-50"
              >
                Keep account
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                className="border-2 border-motif-red bg-motif-red px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-motif-ivory transition-colors hover:border-motif-ivory hover:bg-motif-ivory hover:text-motif-red disabled:opacity-50"
              >
                {pending ? "Deleting…" : "Delete forever"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
